'use client'
import { CV_STYLES } from '@/lib/constants/cvBuilder'

export default function CVStyleSelector({ selected, onSelect }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-text-primary mb-2">Choisis ton style de couleurs</h3>
      <p className="text-text-muted text-sm mb-6">La couleur principale de ton CV — elle définit l'ambiance générale.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CV_STYLES.map(style => (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
              selected?.id === style.id
                ? 'border-primary shadow-lg shadow-primary/10'
                : 'border-border hover:border-primary/40 bg-surface'
            }`}
          >
            {/* Swatch */}
            <div className="flex gap-1.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg shadow-sm"
                style={{ background: style.accent }}
              />
              <div
                className="w-8 h-8 rounded-lg shadow-sm"
                style={{ background: style.light }}
              />
            </div>
            <div className="font-bold text-text-primary text-sm">{style.label}</div>
            <div className="text-xs text-text-muted mt-0.5">{style.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
