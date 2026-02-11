'use client'
import { useMemo } from 'react'
import { generateCVHTML } from '@/lib/utils/cvBuilderPreview'

const A4_W = 794   // largeur A4 en px (96dpi)
const A4_H = 1123  // hauteur A4 en px (96dpi)

/* Zones cliquables par template (en % de la hauteur A4) */
const BLOCK_ZONES = {
  classique: {
    identity:    { top: '0%',   height: '17%', label: 'Identité' },
    resume:      { top: '17%',  height: '10%', label: 'Résumé' },
    experiences: { top: '27%',  height: '38%', label: 'Expériences' },
    formations:  { top: '65%',  height: '18%', label: 'Formations' },
    competences: { top: '83%',  height: '12%', label: 'Compétences' },
  },
  header_bande: {
    identity:    { top: '0%',   height: '22%', label: 'Identité' },
    experiences: { top: '22%',  height: '40%', label: 'Expériences' },
    formations:  { top: '62%',  height: '19%', label: 'Formations' },
    competences: { top: '81%',  height: '14%', label: 'Compétences' },
  },
  timeline: {
    identity:    { top: '0%',   height: '14%', label: 'Identité' },
    resume:      { top: '14%',  height: '9%',  label: 'Résumé' },
    experiences: { top: '23%',  height: '43%', label: 'Expériences' },
    formations:  { top: '66%',  height: '18%', label: 'Formations' },
    competences: { top: '84%',  height: '11%', label: 'Compétences' },
  },
  encadre: {
    identity:    { top: '0%',   height: '16%', label: 'Identité' },
    resume:      { top: '16%',  height: '10%', label: 'Résumé' },
    experiences: { top: '26%',  height: '44%', label: 'Expériences' },
    formations:  { top: '70%',  height: '18%', label: 'Formations' },
  },
  compact: {
    identity:    { top: '0%',   height: '12%', label: 'Identité' },
    resume:      { top: '12%',  height: '9%',  label: 'Résumé' },
    experiences: { top: '21%',  height: '44%', label: 'Expériences' },
    formations:  { top: '65%',  height: '18%', label: 'Formations' },
    competences: { top: '83%',  height: '12%', label: 'Compétences' },
  },
  minimal_pro: {
    identity:    { top: '0%',   height: '16%', label: 'Identité' },
    resume:      { top: '16%',  height: '10%', label: 'Résumé' },
    experiences: { top: '26%',  height: '39%', label: 'Expériences' },
    formations:  { top: '65%',  height: '18%', label: 'Formations' },
    competences: { top: '83%',  height: '12%', label: 'Compétences' },
  },
  dark_premium: {
    identity:    { top: '0%',   height: '19%', label: 'Identité' },
    experiences: { top: '19%',  height: '40%', label: 'Expériences' },
    formations:  { top: '59%',  height: '19%', label: 'Formations' },
    competences: { top: '78%',  height: '15%', label: 'Compétences' },
  },
  deux_colonnes: {
    identity:    { top: '0%',  height: '38%', left: '0%',   width: '34%', label: 'Identité' },
    competences: { top: '38%', height: '58%', left: '0%',   width: '34%', label: 'Compétences' },
    resume:      { top: '0%',  height: '20%', left: '34%',  width: '66%', label: 'Résumé' },
    experiences: { top: '20%', height: '48%', left: '34%',  width: '66%', label: 'Expériences' },
    formations:  { top: '68%', height: '26%', left: '34%',  width: '66%', label: 'Formations' },
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
}) {
  const html = useMemo(() => {
    if (!cvData) return '<html><body style="margin:0;background:#f9f9f9;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#aaa;font-size:13px;">Aperçu du CV</body></html>'
    return generateCVHTML(cvData, buildConfig || {})
  }, [cvData, buildConfig])

  const previewW = Math.round(A4_W * scale)
  const previewH = Math.round(A4_H * scale)
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
          height: A4_H,
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
