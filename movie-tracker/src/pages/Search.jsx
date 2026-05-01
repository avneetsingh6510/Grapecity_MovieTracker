import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import { useToast } from '../context/ToastContext'
import { searchMulti } from '../services/tmdb'

export default function Search() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const queryParam = searchParams.get('q') || ''
  const [inputValue, setInputValue] = useState(queryParam)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const doSearch = useCallback(async (query, pageNum = 1) => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await searchMulti(query, pageNum)
      const filtered = (res.data.results || []).filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
      )
      if (pageNum === 1) {
        setResults(filtered)
      } else {
        setResults((prev) => [...prev, ...filtered])
      }
      setTotalResults(res.data.total_results || 0)
      setTotalPages(res.data.total_pages || 1)
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setInputValue(queryParam)
    if (queryParam) {
      setPage(1)
      setResults([])
      doSearch(queryParam, 1)
    } else {
      setResults([])
    }
  }, [queryParam])

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = inputValue.trim()
    if (!q) {
      showToast('Please enter a search term.', 'warning')
      return
    }
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    doSearch(queryParam, nextPage)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Search form */}
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide mb-6">
          SEARCH
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl" role="search">
          <div className="relative flex-1">
            <label htmlFor="search-input" className="sr-only">Search movies and TV shows</label>
            <input
              id="search-input"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search movies, TV shows..."
              autoFocus
              className="w-full bg-panel border border-border text-text-primary font-body placeholder-text-muted rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
              aria-label="Search movies and TV shows"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary px-6">
            Search
          </button>
        </form>
      </div>

      {/* Empty state — no query yet */}
      {!queryParam && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-panel border border-border flex items-center justify-center">
            <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <p className="text-text-secondary font-body font-medium">Start searching</p>
            <p className="text-text-muted font-body text-sm mt-1">Enter a movie or TV show name above</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <ErrorMessage message={error} onRetry={() => doSearch(queryParam, 1)} />}

      {/* Results header */}
      {queryParam && !loading && !error && (
        <div className="mb-6">
          {results.length > 0 ? (
            <p className="text-text-secondary font-mono text-sm">
              <span className="text-accent font-medium">{totalResults.toLocaleString()}</span> results for{' '}
              <span className="text-text-primary">"{queryParam}"</span>
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[250px] gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-panel border border-border flex items-center justify-center">
                <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-text-secondary font-body font-medium">No results found</p>
                <p className="text-text-muted font-body text-sm mt-1">
                  No movies or TV shows matched "{queryParam}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-stagger">
          {results.map((item) => (
            <MovieCard key={`${item.id}-${item.media_type}`} item={item} />
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Load more */}
      {!loading && results.length > 0 && page < totalPages && page < 5 && (
        <div className="flex justify-center mt-10">
          <button onClick={handleLoadMore} className="btn-ghost px-8">
            Load more results
          </button>
        </div>
      )}
    </div>
  )
}
