import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWatchlist } from '../context/WatchlistContext'
import { useToast } from '../context/ToastContext'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { watchlist } = useWatchlist()
  const { showToast } = useToast()
  const inputRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) {
      showToast('Please enter something to search for.', 'warning')
      inputRef.current?.focus()
      return
    }
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setSearchQuery('')
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully.', 'info')
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `font-body font-medium text-sm transition-colors duration-200 ${
      isActive
        ? 'text-accent'
        : 'text-text-secondary hover:text-text-primary'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-void/95 backdrop-blur-md border-b border-border shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-2"
            aria-label="REELWATCH home"
          >
            <div className="w-7 h-7 bg-accent rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-void" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 3.75A.75.75 0 014.75 3h14.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H4.75a.75.75 0 01-.75-.75V3.75z" />
                <path fillRule="evenodd" d="M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 8.25zm0 4a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12.25zm0 4a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM7 6a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-display text-xl tracking-widest text-text-primary">
              REEL<span className="text-accent">WATCH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/movies" className={navLinkClass}>Movies</NavLink>
            <NavLink to="/tv-shows" className={navLinkClass}>TV Shows</NavLink>
            <NavLink to="/watchlist" className={({ isActive }) =>
              `font-body font-medium text-sm transition-colors duration-200 flex items-center gap-1.5 ${
                isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
              }`
            }>
              Watchlist
              {watchlist.length > 0 && (
                <span className="bg-accent text-void text-xs font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {watchlist.length > 9 ? '9+' : watchlist.length}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Search + Auth */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs justify-end">
            <form onSubmit={handleSearch} className="relative flex-1" role="search">
              <label htmlFor="header-search" className="sr-only">Search movies and TV shows</label>
              <input
                ref={inputRef}
                id="header-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-panel border border-border text-text-primary font-body text-sm placeholder-text-muted rounded px-3 py-2 pr-9 focus:outline-none focus:border-accent transition-colors duration-200"
                aria-label="Search movies and TV shows"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
                aria-label="Submit search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-text-muted font-mono text-xs">{user.username}</span>
                <button onClick={handleLogout} className="btn-ghost py-2 px-3 text-xs">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-4 text-xs">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="relative" role="search">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies & TV shows..."
                className="w-full bg-panel border border-border text-text-primary font-body text-sm placeholder-text-muted rounded px-3 py-2.5 pr-10 focus:outline-none focus:border-accent transition-colors"
                aria-label="Search"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {[
                { to: '/', label: 'Home', end: true },
                { to: '/movies', label: 'Movies' },
                { to: '/tv-shows', label: 'TV Shows' },
                { to: '/watchlist', label: `Watchlist${watchlist.length > 0 ? ` (${watchlist.length})` : ''}` },
              ].map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded font-body font-medium text-sm transition-colors ${
                      isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-panel'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {user ? (
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-text-secondary font-mono text-sm">{user.username}</span>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="btn-ghost py-1.5 px-3 text-xs">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
