import React from 'react'

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
    xl: 'w-16 h-16 border-[3px]',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${sizes[size]} ${className} rounded-full border-border border-t-accent animate-spin-slow`}
    />
  )
}

export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="lg" />
      <p className="text-text-secondary font-body text-sm animate-pulse-slow">{message}</p>
    </div>
  )
}
