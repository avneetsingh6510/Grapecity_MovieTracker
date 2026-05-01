import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem('reelwatch_watchlist')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('reelwatch_watchlist', JSON.stringify(watchlist))
    } catch {
      console.error('Failed to save watchlist to localStorage')
    }
  }, [watchlist])

  const addToWatchlist = useCallback((item) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.media_type === item.media_type)
      if (exists) return prev
      return [{ ...item, addedAt: new Date().toISOString() }, ...prev]
    })
  }, [])

  const removeFromWatchlist = useCallback((id, mediaType) => {
    setWatchlist((prev) =>
      prev.filter((i) => !(i.id === id && i.media_type === mediaType))
    )
  }, [])

  const isInWatchlist = useCallback(
    (id, mediaType) => watchlist.some((i) => i.id === id && i.media_type === mediaType),
    [watchlist]
  )

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
