import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { LoadingScreen } from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import SectionHeader from '../components/SectionHeader'
import { useApiFetch } from '../hooks/useApiFetch'
import { getTrendingMovies, getTrendingTV } from '../services/tmdb'

export default function Home() {
  const {
    data: trendingMovies,
    loading: moviesLoading,
    error: moviesError,
    execute: fetchMovies,
  } = useApiFetch(getTrendingMovies)

  const {
    data: trendingTV,
    loading: tvLoading,
    error: tvError,
    execute: fetchTV,
  } = useApiFetch(getTrendingTV)

  useEffect(() => {
    fetchMovies()
    fetchTV()
  }, [])

  const movies = trendingMovies?.results?.slice(0, 10) || []
  const tvShows = trendingTV?.results?.slice(0, 10) || []

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-teal/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-slow" />
              Powered by TMDB
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-none tracking-wide text-text-primary mb-6">
              YOUR ULTIMATE<br />
              <span className="text-gradient">WATCH</span> GUIDE
            </h1>
            <p className="text-text-secondary font-body text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              Discover trending movies and TV shows, build your personal watchlist, and never miss a great title again.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/movies" className="btn-primary">
                Browse Movies
              </Link>
              <Link to="/tv-shows" className="btn-ghost">
                Explore TV Shows
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-border">
              {[
                { label: 'Movies', value: '500K+' },
                { label: 'TV Shows', value: '150K+' },
                { label: 'Updated', value: 'Daily' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="font-display text-2xl text-accent">{value}</div>
                  <div className="text-text-muted font-mono text-xs uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <SectionHeader title="TRENDING MOVIES" subtitle="What the world is watching this week" />
          <Link to="/movies" className="text-accent font-mono text-xs uppercase tracking-widest hover:text-accent-dim transition-colors hidden sm:inline">
            View all →
          </Link>
        </div>

        {moviesLoading && <LoadingScreen message="Fetching trending movies..." />}
        {moviesError && <ErrorMessage message={moviesError} onRetry={fetchMovies} />}
        {!moviesLoading && !moviesError && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-stagger">
            {movies.map((movie) => (
              <MovieCard key={movie.id} item={movie} mediaType="movie" />
            ))}
          </div>
        )}
      </section>

      {/* Trending TV */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <SectionHeader title="TRENDING TV SHOWS" subtitle="Binge-worthy series making waves" />
          <Link to="/tv-shows" className="text-teal font-mono text-xs uppercase tracking-widest hover:text-teal/70 transition-colors hidden sm:inline">
            View all →
          </Link>
        </div>

        {tvLoading && <LoadingScreen message="Fetching trending TV shows..." />}
        {tvError && <ErrorMessage message={tvError} onRetry={fetchTV} />}
        {!tvLoading && !tvError && tvShows.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-stagger">
            {tvShows.map((show) => (
              <MovieCard key={show.id} item={show} mediaType="tv" />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="border-t border-b border-border bg-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide">
              NEVER LOSE TRACK<br />
              <span className="text-gradient">AGAIN</span>
            </h2>
            <p className="text-text-secondary font-body text-sm mt-2 max-w-sm">
              Save movies and shows to your personal watchlist. Synced to your device.
            </p>
          </div>
          <Link to="/watchlist" className="btn-primary flex-shrink-0">
            Open Watchlist
          </Link>
        </div>
      </section>
    </div>
  )
}
