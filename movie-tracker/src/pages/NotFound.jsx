import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <div className="font-display text-[10rem] md:text-[14rem] leading-none text-border select-none">
          404
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide -mt-4 mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="text-text-secondary font-body text-sm max-w-sm mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/movies" className="btn-ghost">Browse Movies</Link>
        </div>
      </div>
    </div>
  )
}
