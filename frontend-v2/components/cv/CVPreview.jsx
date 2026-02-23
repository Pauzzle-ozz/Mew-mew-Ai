'use client'
import { useMemo } from 'react'
import { generateCVHTML } from '@/lib/utils/cvBuilderPreview'

const A4_W = 794   // largeur A4 en px (96dpi)
const A4_H = 1123  // hauteur A4 en px (96dpi)

/* Zones cliquables par template (en % de la hauteur A4) */
const BLOCK_ZONES = {
  classique: {
    identity:    { top: '0%',   height: '10%', label: 'Identité' },
    resume:      { top: '10%',  height: '10%', label: 'Résumé' },
    competences: { top: '20%',  height: '12%', label: 'Compétences' },
    experiences: { top: '42%',  height: '35%', label: 'Expériences' },
    formations:  { top: '77%',  height: '15%', label: 'Formations' },
  },
}

const ZONE_COLORS = {
  identity:    '#6366f1',
  resume:      '#f59e0b',
  experiences: '#10b981',
  formations:  '#8b5cf6',
  competences: '#f97316',
}

export default function CVPreview({
  cvData,
  buildConfig,
  scale = 0.46,
  className = '',
  interactive = false,
  selectedBlock = null,
  onBlockClick = null,
  maxPages = 1,
}) {
  const html = useMemo(() => {
    if (!cvData) return '<html><body style="margin:0;background:#f9f9f9;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#aaa;font-size:13px;">Aperçu du CV</body></html>'
    return generateCVHTML(cvData, buildConfig || {})
  }, [cvData, buildConfig])

  const previewW = Math.round(A4_W * scale)
  const previewH = Math.round(A4_H * maxPages * scale)
  const shape = buildConfig?.shape || 'classique'
  const zones = BLOCK_ZONES[shape] || BLOCK_ZONES.classique

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-border shadow-2xl shadow-black/40 bg-white ${className}`}
      style={{ width: previewW, height: previewH, flexShrink: 0 }}
    >
      <iframe
        srcDoc={html}
        title="Aperçu CV"
        scrolling="no"
        style={{
          width: A4_W,
          height: A4_H * maxPages,
          border: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          display: 'block',
        }}
      />

      {/* Overlay interactif — zones cliquables sur le CV */}
      {interactive && (
        <div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
          {Object.entries(zones).map(([blockKey, zone]) => {
            const isSelected = selectedBlock === blockKey
            const color = ZONE_COLORS[blockKey] || '#6366f1'
            return (
              <div
                key={blockKey}
                onClick={() => onBlockClick?.(isSelected ? null : blockKey)}
                className="absolute cursor-pointer group transition-all duration-150"
                style={{
                  top: zone.top,
                  left: zone.left || '0%',
                  width: zone.width || '100%',
                  height: zone.height,
                  background: isSelected ? `${color}25` : 'transparent',
                  border: `2px solid ${isSelected ? color + 'aa' : 'transparent'}`,
                  borderRadius: '3px',
                  zIndex: 10,
                }}
              >
                {/* Highlight au survol */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                  style={{ background: `${color}15`, border: `1.5px solid ${color}66` }}
                />
                {/* Label flottant au survol */}
                <div
                  className="absolute top-1 right-1 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: color, fontSize: '9px', lineHeight: '1.4' }}
                >
                  ✏ {zone.label}
                </div>
                {/* Badge sélectionné */}
                {isSelected && (
                  <div
                    className="absolute top-1 left-1 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold pointer-events-none"
                    style={{ background: color, fontSize: '9px', lineHeight: '1.4' }}
                  >
                    ✏ {zone.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
