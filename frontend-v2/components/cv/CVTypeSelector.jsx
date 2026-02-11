'use client'
import { CV_TYPES } from '@/lib/constants/cvBuilder'

export default function CVTypeSelector({ selected, onSelect }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-text-primary mb-2">Quel est ton domaine ?</h3>
      <p className="text-text-muted text-sm mb-6">Chaque domaine a des attentes différentes en matière de CV.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CV_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => onSelect(type)}
            className={`p-5 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
              selected?.id === type.id
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                : 'border-border hover:border-primary/40 bg-surface'
            }`}
          >
            <div className="text-3xl mb-2">{type.emoji}</div>
            <div className="font-bold text-text-primary text-sm mb-1">{type.label}</div>
            <div className="text-xs text-text-muted leading-relaxed">{type.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
