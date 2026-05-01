import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { IMAGE_BASE_URL, POSTER_SIZE } from '../services/tmdb'

function StarIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function MovieCard({ item, mediaType }) {
  const type = mediaType || item.media_type || 'movie'
  const title = item.title || item.name
  const date = item.release_date || item.first_air_date
  const year = date ? new Date(date).getFullYear() : null
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null
  const href = type === 'movie' ? `/movie/${item.id}` : `/tv-show/${item.id}`

  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${item.poster_path}`
    : null

  return (
    <Link
      to={href}
      className="card-base group block cursor-pointer"
      aria-label={`${title}${year ? `, ${year}` : ''}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-muted overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${title} poster`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-muted">
            <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="text-xs font-mono">No Image</span>
          </div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-void/90 backdrop-blur-sm border border-accent/30 text-accent px-2 py-0.5 rounded text-xs font-mono font-medium">
            <StarIcon />
            {rating}
          </div>
        )}

        {/* Type badge */}
        <div className={`absolute top-2 right-2 text-xs font-mono font-medium px-2 py-0.5 rounded border ${
          type === 'movie'
            ? 'bg-void/90 border-accent/20 text-text-secondary'
            : 'bg-void/90 border-teal/20 text-teal'
        }`}>
          {type === 'movie' ? 'FILM' : 'TV'}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-body font-medium text-text-primary text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        {year && (
          <p className="text-text-muted font-mono text-xs mt-1">{year}</p>
        )}
      </div>
    </Link>
  )
}

export default memo(MovieCard)
