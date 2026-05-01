import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import { LoadingScreen } from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import SectionHeader from '../components/SectionHeader'
import { useApiFetch } from '../hooks/useApiFetch'
import { getPopularMovies, getTopRatedMovies } from '../services/tmdb'

const TABS = [
  { id: 'popular', label: 'Popular' },
  { id: 'top_rated', label: 'Top Rated' },
]

export default function Movies() {
  const [activeTab, setActiveTab] = useState('popular')
  const [page, setPage] = useState(1)
  const [allMovies, setAllMovies] = useState([])

  const fetchFn = activeTab === 'popular' ? getPopularMovies : getTopRatedMovies

  const { data, loading, error, execute } = useApiFetch(fetchFn, [activeTab])

  useEffect(() => {
    setAllMovies([])
    setPage(1)
  }, [activeTab])

  useEffect(() => {
    execute(page)
  }, [activeTab, page])

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllMovies(data.results)
      } else {
        setAllMovies((prev) => [...prev, ...data.results])
      }
    }
  }, [data])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleLoadMore = () => {
    setPage((p) => p + 1)
  }

  const totalPages = data?.total_pages || 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <SectionHeader
          title="MOVIES"
          subtitle={`${activeTab === 'popular' ? 'Most popular' : 'Highest rated'} films right now`}
        />

        {/* Tab switcher */}
        <div className="flex bg-panel border border-border rounded-lg p-1 self-start sm:self-auto" role="tablist" aria-label="Movie categories">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-1.5 rounded text-sm font-body font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-accent text-void'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => execute(page)} />}

      {!error && allMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-stagger">
          {allMovies.map((movie) => (
            <MovieCard key={`${movie.id}-${activeTab}`} item={movie} mediaType="movie" />
          ))}
        </div>
      )}

      {loading && <LoadingScreen message="Loading movies..." />}

      {!loading && !error && allMovies.length > 0 && page < totalPages && page < 5 && (
        <div className="flex justify-center mt-10">
          <button onClick={handleLoadMore} className="btn-ghost px-8">
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
