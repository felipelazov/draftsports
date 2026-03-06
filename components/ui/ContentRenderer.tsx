'use client'

import React from 'react'

export function ContentRenderer({ content, className }: { content: string; className?: string }) {
  const blocks = content.split('\n\n').filter(b => b.trim())

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(l => l.trim())
        if (!lines.length) return null

        if (lines.every(l => l.startsWith('- '))) {
          return (
            <ul key={i} className="list-disc list-inside space-y-1">
              {lines.map((l, j) => <li key={j}>{l.substring(2)}</li>)}
            </ul>
          )
        }

        if (lines.every(l => /^\d+\.\s/.test(l))) {
          return (
            <ol key={i} className="list-decimal list-inside space-y-2">
              {lines.map((l, j) => <li key={j}>{l.replace(/^\d+\.\s/, '')}</li>)}
            </ol>
          )
        }

        return lines.map((l, j) => <p key={`${i}-${j}`}>{l}</p>)
      })}
    </div>
  )
}
