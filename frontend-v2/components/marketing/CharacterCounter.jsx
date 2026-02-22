'use client'

export default function CharacterCounter({ current, max, unit = 'caracteres' }) {
  const ratio = max > 0 ? current / max : 0
  const colorClass = ratio > 1 ? 'text-red-400' : ratio > 0.8 ? 'text-amber-400' : 'text-green-400'

  return (
    <span className={`text-xs ${colorClass}`}>
      {current} / {max} {unit}
    </span>
  )
}
