import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-void" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 3.75A.75.75 0 014.75 3h14.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H4.75a.75.75 0 01-.75-.75V3.75z" />
                </svg>
              </div>
              <span className="font-display text-lg tracking-widest text-text-primary">
                REEL<span className="text-accent">WATCH</span>
              </span>
            </div>
            <p className="text-text-secondary font-body text-sm leading-relaxed max-w-xs">
              Track, discover, and manage your movies and TV show watchlist in one place.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">Navigate</h4>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {[
                { to: '/', label: 'Home' },
                { to: '/movies', label: 'Movies' },
                { to: '/tv-shows', label: 'TV Shows' },
                { to: '/watchlist', label: 'Watchlist' },
                { to: '/search', label: 'Search' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-text-secondary hover:text-accent font-body text-sm transition-colors duration-200 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Credits */}
          <div>
            <h4 className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">Powered By</h4>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-body text-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              The Movie Database (TMDB)
            </a>
            <p className="text-text-muted font-body text-xs mt-3 leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-text-muted font-mono text-xs">
            © {new Date().getFullYear()} REELWATCH
          </p>
          <p className="text-text-muted font-mono text-xs">
            Built with React + Vite + TMDB
          </p>
        </div>
      </div>
    </footer>
  )
}
