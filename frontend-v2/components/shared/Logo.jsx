'use client'

import Link from 'next/link'

const sizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
}

export default function Logo({ size = 'md', link = true, className = '' }) {
  const fontSize = sizes[size] || sizes.md

  const content = (
    <span className={`${fontSize} font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent select-none ${className}`}>
      mew mew
    </span>
  )

  if (link) {
    return <Link href="/" className="inline-flex items-center">{content}</Link>
  }
  return content
}
