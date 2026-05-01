import React from 'react'

export default function SectionHeader({ title, subtitle, accent }) {
  return (
    <div className="mb-8">
      <h2 className="section-title">
        {accent ? (
          <>
            {title.split(accent)[0]}
            <span className="text-gradient">{accent}</span>
            {title.split(accent)[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="text-text-secondary font-body text-sm mt-2">{subtitle}</p>
      )}
    </div>
  )
}
