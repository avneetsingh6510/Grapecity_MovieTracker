import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { useToast } from '../context/ToastContext'
import { IMAGE_BASE_URL, POSTER_SIZE } from '../services/tmdb'

function WatchlistCard({ item, onRemove }) {
  const title = item.title || item.name
  const date = item.release_date || item.first_air_date
  const year = date ? new Date(date).getFullYear() : null
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null
  const href = item.media_type === 'movie' ? `/movie/${item.id}` : `/tv-show/${item.id}`

  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${item.poster_path}`
    : null

  return (
    <div className="card-base flex gap-4 p-4 group">
      {/* Poster */}
      <Link to={href} className="flex-shrink-0 w-20 rounded overflow-hidden border border-border">
        {posterUrl ? (
          <img src={posterUrl} alt={`${title} poster`} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
            <svg className="w-6 h-6 text-text-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18" />
            </svg>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link to={href} className="hover:text-accent transition-colors">
              <h3 className="font-body font-semibold text-text-primary text-sm leading-snug line-clamp-2">
                {title}
              </h3>
            </Link>
            <span className={`flex-shrink-0 text-xs font-mono px-2 py-0.5 rounded border ${
              item.media_type === 'movie'
                ? 'border-accent/20 text-accent bg-accent/10'
                : 'border-teal/20 text-teal bg-teal/10'
            }`}>
              {item.media_type === 'movie' ? 'FILM' : 'TV'}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            {year && <span className="text-text-muted font-mono text-xs">{year}</span>}
            {rating && (
              <div className="flex items-center gap-1 text-accent font-mono text-xs">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </div>
            )}
            {item.addedAt && (
              <span className="text-text-muted font-mono text-xs hidden sm:inline">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Link to={href} className="btn-ghost py-1.5 px-3 text-xs">
            View details
          </Link>
          <button
            onClick={() => onRemove(item.id, item.media_type, title)}
            className="btn-danger py-1.5 px-3 text-xs"
            aria-label={`Remove ${title} from watchlist`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useWatchlist()
  const { showToast } = useToast()
  const [filter, setFilter] = useState('all')

  const handleRemove = (id, mediaType, title) => {
    removeFromWatchlist(id, mediaType)
    showToast(`"${title}" removed from watchlist.`, 'error')
  }

  const filtered = watchlist.filter((item) => {
    if (filter === 'movies') return item.media_type === 'movie'
    if (filter === 'tv') return item.media_type === 'tv'
    return true
  })

  const movieCount = watchlist.filter((i) => i.media_type === 'movie').length
  const tvCount = watchlist.filter((i) => i.media_type === 'tv').length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-text-primary tracking-wide">
              WATCHLIST
            </h1>
            <p className="text-text-secondary font-body text-sm mt-1">
              {watchlist.length === 0
                ? 'Nothing saved yet'
                : `${watchlist.length} item${watchlist.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>

          {/* Filter tabs */}
          {watchlist.length > 0 && (
            <div className="flex bg-panel border border-border rounded-lg p-1 self-start" role="tablist" aria-label="Filter watchlist">
              {[
                { id: 'all', label: `All (${watchlist.length})` },
                { id: 'movies', label: `Movies (${movieCount})` },
                { id: 'tv', label: `TV (${tvCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={filter === tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded text-xs font-body font-medium transition-all duration-200 ${
                    filter === tab.id
                      ? 'bg-accent text-void'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {watchlist.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-panel border border-border flex items-center justify-center">
            <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div>
            <p className="text-text-primary font-body font-semibold text-lg">Your watchlist is empty</p>
            <p className="text-text-secondary font-body text-sm mt-1 max-w-xs">
              Browse movies and TV shows, then hit "Add to Watchlist" to save them here.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/movies" className="btn-primary">Browse Movies</Link>
            <Link to="/tv-shows" className="btn-ghost">Browse TV Shows</Link>
          </div>
        </div>
      )}

      {/* Filtered empty */}
      {watchlist.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary font-body text-sm">
            No {filter === 'movies' ? 'movies' : 'TV shows'} in your watchlist.
          </p>
        </div>
      )}

      {/* List */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3 animate-stagger">
          {filtered.map((item) => (
            <WatchlistCard
              key={`${item.id}-${item.media_type}`}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}
