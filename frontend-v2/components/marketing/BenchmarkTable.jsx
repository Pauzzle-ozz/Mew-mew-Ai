'use client'

import { useState } from 'react'

const PRIORITY_COLORS = {
  haute: 'bg-red-500/10 text-red-400',
  moyenne: 'bg-amber-500/10 text-amber-400',
  basse: 'bg-green-500/10 text-green-400'
}

function ScoreBar({ score, max = 10 }) {
  const pct = Math.min((score / max) * 100, 100)
  const color = score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-surface-elevated rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-text-primary w-6 text-right">{score}</span>
    </div>
  )
}

/* ── Individual Analysis Card ── */
export function CompetitorAnalysis({ analysis }) {
  const [expanded, setExpanded] = useState(false)

  if (!analysis) return null

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between cursor-pointer hover:bg-surface-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{analysis.overallScore || '?'}</span>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-text-primary">{analysis.name}</h3>
            <p className="text-xs text-text-muted">{analysis.positioning?.valueProposition || ''}</p>
          </div>
        </div>
        <svg className={`w-5 h-5 text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border p-5 space-y-5">
          {/* Positioning */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted mb-2 uppercase">Positionnement</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-text-muted">Cible :</span> <span className="text-text-primary">{analysis.positioning?.target}</span></div>
              <div><span className="text-text-muted">Segment :</span> <span className="text-text-primary">{analysis.positioning?.marketSegment}</span></div>
            </div>
            {analysis.positioning?.values?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {analysis.positioning.values.map((v, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{v}</span>
                ))}
              </div>
            )}
          </div>

          {/* Communication */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted mb-2 uppercase">Communication</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-text-muted">Ton :</span> <span className="text-text-primary">{analysis.communication?.tone}</span></div>
              <div><span className="text-text-muted">Style :</span> <span className="text-text-primary">{analysis.communication?.style}</span></div>
            </div>
          </div>

          {/* Strengths / Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-green-400 mb-2">Forces</h4>
              <div className="space-y-1">
                {analysis.strengths?.map((s, i) => (
                  <div key={i} className="flex items-start text-sm text-text-secondary">
                    <span className="text-green-400 mr-2 mt-0.5 shrink-0">+</span>{s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-red-400 mb-2">Faiblesses</h4>
              <div className="space-y-1">
                {analysis.weaknesses?.map((w, i) => (
                  <div key={i} className="flex items-start text-sm text-text-secondary">
                    <span className="text-red-400 mr-2 mt-0.5 shrink-0">-</span>{w}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Channels */}
          {analysis.channels?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-text-muted mb-2 uppercase">Canaux</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.channels.map((ch, i) => (
                  <div key={i} className="text-xs px-3 py-1.5 rounded-lg bg-surface-elevated text-text-secondary">
                    <span className="font-medium">{ch.name}</span>
                    <span className="text-text-muted ml-1">({ch.estimatedActivity})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {analysis.opportunities?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-primary mb-2 uppercase">Opportunites</h4>
              <div className="space-y-1">
                {analysis.opportunities.map((o, i) => (
                  <div key={i} className="flex items-start text-sm text-text-secondary">
                    <span className="text-primary mr-2 mt-0.5 shrink-0">→</span>{o}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-text-muted pt-2 border-t border-border">
            Source : {analysis.dataSource === 'scraped' ? 'Analyse du site web' : 'Connaissances IA'}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Benchmark Comparison ── */
export function BenchmarkView({ data }) {
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Rankings */}
      {data.benchmark?.rankings?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Classement global</h3>
          <div className="space-y-3">
            {data.benchmark.rankings.sort((a, b) => a.rank - b.rank).map((r, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-amber-500/20 text-amber-400' :
                  i === 1 ? 'bg-gray-400/20 text-gray-400' :
                  i === 2 ? 'bg-orange-700/20 text-orange-600' :
                  'bg-surface-elevated text-text-muted'
                }`}>
                  {r.rank}
                </span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-text-primary">{r.name}</span>
                  <ScoreBar score={r.totalScore} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Criteria comparison */}
      {data.benchmark?.criteria?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Comparaison par critere</h3>
          <div className="space-y-4">
            {data.benchmark.criteria.map((c, i) => (
              <div key={i}>
                <h4 className="text-xs font-medium text-text-muted mb-2">{c.name}</h4>
                <div className="space-y-2">
                  {Object.entries(c.competitors || {}).map(([name, data]) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-xs text-text-secondary w-24 truncate">{name}</span>
                      <div className="flex-1">
                        <ScoreBar score={data.score} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market synthesis */}
      {data.marketSynthesis && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-primary mb-2">Synthese du marche</h3>
          <p className="text-sm text-text-secondary mb-3">{data.marketSynthesis.summary}</p>
          {data.marketSynthesis.marketGaps?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-primary mb-1">Trous dans le marche :</p>
              <div className="space-y-1">
                {data.marketSynthesis.marketGaps.map((g, i) => (
                  <div key={i} className="flex items-start text-xs text-text-secondary">
                    <span className="text-primary mr-1">●</span>{g}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Recommandations</h3>
          <div className="space-y-3">
            {data.recommendations.map((r, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-text-primary">{r.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${PRIORITY_COLORS[r.priority] || ''}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Differentiation */}
      {data.differentiationAxis?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Axes de differenciation</h3>
          <div className="flex flex-wrap gap-2">
            {data.differentiationAxis.map((a, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">{a}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
