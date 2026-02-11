'use client'
import { CV_SHAPES } from '@/lib/constants/cvBuilder'

export default function CVShapeSelector({ selected, onSelect }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-text-primary mb-2">Quelle mise en page ?</h3>
      <p className="text-text-muted text-sm mb-6">La structure de ton CV — certains recruteurs préfèrent le classique, d'autres le moderne.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CV_SHAPES.map(shape => (
          <button
            key={shape.id}
            onClick={() => onSelect(shape)}
            className={`rounded-xl border-2 overflow-hidden text-left transition-all hover:scale-[1.02] ${
              selected?.id === shape.id
                ? 'border-primary shadow-lg shadow-primary/10'
                : 'border-border hover:border-primary/40'
            }`}
          >
            {/* Preview miniature */}
            <div
              className="h-28 w-full border-b border-border overflow-hidden"
              dangerouslySetInnerHTML={{ __html: shape.preview }}
            />
            {/* Label */}
            <div className={`p-3 ${selected?.id === shape.id ? 'bg-primary/10' : 'bg-surface'}`}>
              <div className="font-bold text-text-primary text-sm">{shape.label}</div>
              <div className="text-xs text-text-muted mt-0.5">{shape.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
