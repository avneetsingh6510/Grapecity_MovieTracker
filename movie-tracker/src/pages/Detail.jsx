import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApiFetch } from '../hooks/useApiFetch'
import { useWatchlist } from '../context/WatchlistContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { getMovieDetails, getTVDetails, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE, PROFILE_SIZE } from '../services/tmdb'
import { LoadingScreen } from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Detail({ mediaType }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const { showToast } = useToast()
  const { user } = useAuth()

  const fetchFn = mediaType === 'movie' ? getMovieDetails : getTVDetails
  const { data: item, loading, error, execute } = useApiFetch(fetchFn, [id])

  useEffect(() => {
    execute(id)
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return <LoadingScreen message={`Loading ${mediaType === 'movie' ? 'movie' : 'TV show'}...`} />
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <ErrorMessage message={error} onRetry={() => execute(id)} />
    </div>
  )
  if (!item) return null

  const title = item.title || item.name
  const releaseDate = item.release_date || item.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null
  const genres = item.genres || []
  const cast = item.credits?.cast?.slice(0, 8) || []
  const inWatchlist = isInWatchlist(item.id, mediaType)

  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${item.poster_path}`
    : null

  const backdropUrl = item.backdrop_path
    ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${item.backdrop_path}`
    : null

  const handleWatchlistToggle = () => {
    if (!user) {
      showToast('Please sign in to add items to your watchlist.', 'warning')
      return
    }
    const watchlistItem = {
      id: item.id,
      media_type: mediaType,
      title: item.title,
      name: item.name,
      poster_path: item.poster_path,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      vote_average: item.vote_average,
    }

    if (inWatchlist) {
      removeFromWatchlist(item.id, mediaType)
      showToast(`"${title}" removed from watchlist.`, 'error')
    } else {
      addToWatchlist(watchlistItem)
      showToast(`"${title}" added to watchlist!`, 'success')
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="relative h-[35vh] md:h-[50vh] overflow-hidden">
          <img
            src={backdropUrl}
            alt={`${title} backdrop`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${backdropUrl ? '-mt-32 relative z-10' : 'pt-12'} pb-16`}>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-48 md:w-64 lg:w-72 rounded-xl overflow-hidden shadow-card border border-border mx-auto md:mx-0">
              {posterUrl ? (
                <img src={posterUrl} alt={`${title} poster`} className="w-full h-auto" />
              ) : (
                <div className="aspect-[2/3] bg-panel flex items-center justify-center">
                  <svg className="w-16 h-16 text-text-muted opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded border mb-4 ${
              mediaType === 'movie'
                ? 'border-accent/30 text-accent bg-accent/10'
                : 'border-teal/30 text-teal bg-teal/10'
            }`}>
              {mediaType === 'movie' ? 'FILM' : 'TV SERIES'}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-wide leading-none mb-3">
              {title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {year && (
                <span className="text-text-secondary font-mono text-sm">{year}</span>
              )}
              {item.runtime && (
                <span className="text-text-muted font-mono text-sm">{item.runtime}m</span>
              )}
              {item.number_of_seasons && (
                <span className="text-text-muted font-mono text-sm">
                  {item.number_of_seasons} Season{item.number_of_seasons > 1 ? 's' : ''}
                </span>
              )}
              {rating && (
                <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 text-accent px-2.5 py-1 rounded font-mono text-sm">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {rating}
                  {item.vote_count && (
                    <span className="text-text-muted text-xs">({item.vote_count.toLocaleString()})</span>
                  )}
                </div>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="tag border-border text-text-secondary bg-panel"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {item.overview && (
              <div className="mb-8">
                <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">Overview</h2>
                <p className="text-text-secondary font-body text-sm md:text-base leading-relaxed max-w-2xl">
                  {item.overview}
                </p>
              </div>
            )}

            {/* Release date */}
            {releaseDate && (
              <div className="mb-8">
                <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-1">
                  {mediaType === 'movie' ? 'Release Date' : 'First Aired'}
                </h2>
                <p className="text-text-secondary font-body text-sm">
                  {new Date(releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={handleWatchlistToggle}
                className={inWatchlist ? 'btn-danger' : 'btn-primary'}
                aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
              >
                {inWatchlist ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove from Watchlist
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Watchlist
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="btn-ghost"
                aria-label="Go back"
              >
                ← Back
              </button>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h2 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {cast.map((person) => (
                    <div key={person.id} className="flex items-center gap-3 bg-panel border border-border rounded-lg p-2.5">
                      {person.profile_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}${PROFILE_SIZE}${person.profile_path}`}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                          <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-text-primary font-body text-xs font-medium truncate">{person.name}</p>
                        <p className="text-text-muted font-body text-xs truncate">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
