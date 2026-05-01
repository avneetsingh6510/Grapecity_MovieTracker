import { useState, useEffect, useRef, useCallback } from 'react'

export function useApiFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchFn(...args)
      setData(response.data)
    } catch (err) {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        if (err.response?.status === 404) {
          setError('Not found.')
        } else if (err.response?.status === 401) {
          setError('Invalid API key. Please check your VITE_TMDB_API_KEY.')
        } else if (!navigator.onLine) {
          setError('No internet connection. Please check your network.')
        } else {
          setError(err.message || 'An unexpected error occurred.')
        }
      }
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch, execute }
}

export default useApiFetch
