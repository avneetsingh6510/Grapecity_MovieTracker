import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/watchlist'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please fill in both fields.')
      return
    }

    setLoading(true)
    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 400))

    const result = login(username.trim(), password)
    setLoading(false)

    if (result.success) {
      showToast(`Welcome back, ${username}!`, 'success')
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-void" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 3.75A.75.75 0 014.75 3h14.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H4.75a.75.75 0 01-.75-.75V3.75z" />
              </svg>
            </div>
            <span className="font-display text-2xl tracking-widest text-text-primary">
              REEL<span className="text-accent">WATCH</span>
            </span>
          </div>
          <h1 className="font-display text-3xl text-text-primary tracking-wide mb-1">SIGN IN</h1>
          <p className="text-text-secondary font-body text-sm">Access your personal watchlist</p>
        </div>

        {/* Demo hint */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg px-4 py-3 mb-6">
          <p className="text-accent font-mono text-xs text-center">
            Demo credentials: <strong>demo</strong> / <strong>demo123</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-text-secondary font-mono text-xs uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-panel border border-border text-text-primary font-body placeholder-text-muted rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
              aria-required="true"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-text-secondary font-mono text-xs uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-panel border border-border text-text-primary font-body placeholder-text-muted rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              id="login-error"
              role="alert"
              className="flex items-center gap-2 bg-ember/10 border border-ember/30 text-ember rounded-lg px-4 py-3 text-sm font-body"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-text-muted font-body text-xs mt-6">
          <Link to="/" className="text-accent hover:text-accent-dim transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
