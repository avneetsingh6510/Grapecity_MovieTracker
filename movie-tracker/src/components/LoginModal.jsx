import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginModal() {
  const { user, login } = useAuth()
  const { showToast } = useToast()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [visible, setVisible] = useState(false)
  const inputRef = useRef(null)

  // Animate in on mount if not logged in
  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(t)
    }
  }, [])

  // Focus username input when modal appears
  useEffect(() => {
    if (!user && visible) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [visible, user])

  // Trap focus inside modal
  useEffect(() => {
    if (user) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') e.preventDefault() // block escape
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [user])

  if (user) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please fill in both fields.')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))

    const result = login(username.trim(), password)
    setLoading(false)

    if (result.success) {
      showToast(`Welcome, ${username.trim()}! 🎬`, 'success')
    } else {
      setError(result.error)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop — not dismissible */}
      <div className="absolute inset-0 bg-void/95 backdrop-blur-md" />

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-teal/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Modal card */}
      <div
        className={`relative w-full max-w-md mx-4 transition-all duration-500 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-surface border border-border rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Top accent bar */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

          <div className="px-8 py-10">
            {/* Logo + heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl mb-5">
                <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 3.75A.75.75 0 014.75 3h14.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H4.75a.75.75 0 01-.75-.75V3.75z" />
                  <path fillRule="evenodd" d="M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 8.25zm0 4a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12.25zm0 4a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM7 6a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0zm2 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>

              <h2
                id="modal-title"
                className="font-display text-4xl tracking-widest text-text-primary mb-1"
              >
                REEL<span className="text-accent">WATCH</span>
              </h2>
              <p
                id="modal-desc"
                className="text-text-secondary font-body text-sm leading-relaxed"
              >
                Sign in to discover movies, track your watchlist,<br className="hidden sm:inline" /> and never miss a great title.
              </p>
            </div>

            {/* Demo hint */}
            <div className="flex items-center gap-2.5 bg-accent/8 border border-accent/15 rounded-lg px-4 py-3 mb-6">
              <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-accent font-mono text-xs">
                Use <strong>demo</strong> / <strong>demo123</strong> to sign in
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="modal-username"
                  className="block text-text-muted font-mono text-xs uppercase tracking-widest mb-1.5"
                >
                  Username
                </label>
                <input
                  ref={inputRef}
                  id="modal-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError('') }}
                  placeholder="Enter username"
                  className="w-full bg-panel border border-border text-text-primary font-body placeholder-text-muted rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
                  aria-required="true"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="modal-password"
                  className="block text-text-muted font-mono text-xs uppercase tracking-widest mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="modal-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    placeholder="Enter password"
                    className="w-full bg-panel border border-border text-text-primary font-body placeholder-text-muted rounded-lg px-4 py-3 pr-11 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 bg-ember/10 border border-ember/30 text-ember rounded-lg px-4 py-3 text-sm font-body animate-fade-in"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In to Continue
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom bar */}
          <div className="px-8 py-4 bg-panel border-t border-border text-center">
            <p className="text-text-muted font-mono text-xs">
              Sign in required to access REELWATCH
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
