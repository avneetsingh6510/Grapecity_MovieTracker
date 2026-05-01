import React from 'react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-ember/10 border border-ember/30 flex items-center justify-center">
        <svg className="w-8 h-8 text-ember" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <div>
        <p className="text-ember font-body font-medium mb-1">Something went wrong</p>
        <p className="text-text-secondary font-body text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost">
          Try again
        </button>
      )}
    </div>
  )
}
