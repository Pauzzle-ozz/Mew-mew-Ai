'use client'

import { useState } from 'react'

const PLATFORM_INFO = {
  linkedin: { label: 'LinkedIn', emoji: '💼' },
  instagram: { label: 'Instagram', emoji: '📸' },
  twitter: { label: 'Twitter/X', emoji: '🐦' },
  facebook: { label: 'Facebook', emoji: '👥' },
  tiktok: { label: 'TikTok', emoji: '🎵' },
  youtube: { label: 'YouTube', emoji: '▶️' },
  blog: { label: 'Blog/SEO', emoji: '📝' },
  newsletter: { label: 'Newsletter', emoji: '📧' }
}

function ScoreGauge({ score }) {
  const color = score.value >= 75 ? 'text-green-400' :
                score.value >= 50 ? 'text-yellow-400' :
                score.value >= 25 ? 'text-orange-400' : 'text-red-400'

  const bgColor = score.value >= 75 ? 'bg-green-400' :
                  score.value >= 50 ? 'bg-yellow-400' :
                  score.value >= 25 ? 'bg-orange-400' : 'bg-red-400'

  return (
    <div className="bg-surface rounded-xl border border-border p-6 text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-elevated" />
          <circle
            cx="50" cy="50" r="42" fill="none" strokeWidth="8"
            strokeDasharray={`${(score.value / 100) * 264} 264`}
            strokeLinecap="round"
            className={color}
            stroke="currentColor"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{score.value}</span>
          <span className="text-xs text-text-muted">/100</span>
        </div>
      </div>
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bgColor}/20 ${color}`}>
        {score.label}
      </div>
      <p className="text-sm text-text-secondary mt-3">{score.justification}</p>
    </div>
  )
}

function DiagnosticSection({ diagnostic }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Diagnostic</h3>
      <p className="text-text-secondary text-sm">{diagnostic.summary}</p>

      {diagnostic.positivePoints?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-green-400 mb-2">Points positifs</h4>
          <ul className="space-y-1">
            {diagnostic.positivePoints.map((p, i) => (
              <li key={i} className="text-sm text-text-secondary flex items-start">
                <span className="text-green-400 mr-2 mt-0.5">+</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {diagnostic.negativePoints?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-red-400 mb-2">Points a ameliorer</h4>
          <ul className="space-y-1">
            {diagnostic.negativePoints.map((p, i) => (
              <li key={i} className="text-sm text-text-secondary flex items-start">
                <span className="text-red-400 mr-2 mt-0.5">-</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {diagnostic.rootCauses?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-2">Causes racines</h4>
          <ul className="space-y-1">
            {diagnostic.rootCauses.map((c, i) => (
              <li key={i} className="text-sm text-text-secondary flex items-start">
                <span className="text-primary mr-2 mt-0.5">&#8227;</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PatternsSection({ patterns }) {
  if (!patterns || patterns.length === 0) return null

  const impactColors = {
    positif: 'bg-green-900/30 border-green-800 text-green-300',
    negatif: 'bg-red-900/30 border-red-800 text-red-300',
    neutre: 'bg-surface-elevated border-border text-text-secondary'
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Patterns detectes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {patterns.map((p, i) => (
          <div key={i} className={`rounded-lg border p-4 ${impactColors[p.impact] || impactColors.neutre}`}>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium">{p.title}</h4>
              <span className="text-xs opacity-70 capitalize">{p.impact}</span>
            </div>
            <p className="text-xs opacity-80">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecommendationsSection({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null

  const priorityStyles = {
    haute: 'bg-red-900/30 text-red-300 border-red-800',
    moyenne: 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
    basse: 'bg-surface-elevated text-text-muted border-border'
  }

  const effortBadge = {
    faible: 'bg-green-900/30 text-green-400',
    moyen: 'bg-yellow-900/30 text-yellow-400',
    eleve: 'bg-red-900/30 text-red-400'
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Recommandations</h3>
      <div className="space-y-3">
        {recommendations.map((r, i) => (
          <div key={i} className={`rounded-lg border p-4 ${priorityStyles[r.priority] || priorityStyles.basse}`}>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold flex-1">{r.title}</h4>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/20">
                {r.priority}
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${effortBadge[r.effort] || ''}`}>
                Effort {r.effort}
              </span>
            </div>
            <p className="text-xs opacity-80 mb-1">{r.description}</p>
            {r.estimatedImpact && (
              <p className="text-xs font-medium opacity-90">Impact estime : {r.estimatedImpact}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PredictionsSection({ predictions }) {
  if (!predictions) return null

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Predictions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg bg-green-900/20 border border-green-800/50 p-4">
          <h4 className="text-xs font-bold text-green-400 uppercase mb-1">Optimiste</h4>
          <p className="text-sm text-green-300">{predictions.optimistic}</p>
        </div>
        <div className="rounded-lg bg-yellow-900/20 border border-yellow-800/50 p-4">
          <h4 className="text-xs font-bold text-yellow-400 uppercase mb-1">Realiste</h4>
          <p className="text-sm text-yellow-300">{predictions.realistic}</p>
        </div>
        <div className="rounded-lg bg-red-900/20 border border-red-800/50 p-4">
          <h4 className="text-xs font-bold text-red-400 uppercase mb-1">Pessimiste</h4>
          <p className="text-sm text-red-300">{predictions.pessimistic}</p>
        </div>
      </div>
    </div>
  )
}

function BenchmarkSection({ benchmark }) {
  if (!benchmark) return null

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Benchmark sectoriel</h3>
      <p className="text-sm text-text-secondary">{benchmark.comparison}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benchmark.aboveAverage?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-2">Au-dessus de la moyenne</h4>
            <ul className="space-y-1">
              {benchmark.aboveAverage.map((item, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start">
                  <span className="text-green-400 mr-2">&#9650;</span>{item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {benchmark.belowAverage?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-400 mb-2">En-dessous de la moyenne</h4>
            <ul className="space-y-1">
              {benchmark.belowAverage.map((item, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start">
                  <span className="text-red-400 mr-2">&#9660;</span>{item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function NextStepsSection({ nextSteps }) {
  if (!nextSteps || nextSteps.length === 0) return null

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-primary mb-3">Prochaines etapes</h3>
      <ol className="space-y-2">
        {nextSteps.map((step, i) => (
          <li key={i} className="flex items-start text-sm text-text-secondary">
            <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function SinglePlatformResults({ data }) {
  const [activeTab, setActiveTab] = useState('diagnostic')

  if (!data) return null

  const tabs = [
    { id: 'diagnostic', label: 'Diagnostic' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'recommendations', label: 'Recommandations' },
    { id: 'predictions', label: 'Predictions' },
    { id: 'benchmark', label: 'Benchmark' }
  ]

  return (
    <div className="space-y-6">
      {/* Score */}
      {data.score && <ScoreGauge score={data.score} />}

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'diagnostic' && data.diagnostic && <DiagnosticSection diagnostic={data.diagnostic} />}
      {activeTab === 'patterns' && <PatternsSection patterns={data.patterns} />}
      {activeTab === 'recommendations' && <RecommendationsSection recommendations={data.recommendations} />}
      {activeTab === 'predictions' && <PredictionsSection predictions={data.predictions} />}
      {activeTab === 'benchmark' && <BenchmarkSection benchmark={data.benchmark} />}

      {/* Next Steps (always visible) */}
      <NextStepsSection nextSteps={data.nextSteps} />
    </div>
  )
}

export default function PerformanceResults({ results }) {
  const entries = Object.entries(results || {})
  const [activePlatform, setActivePlatform] = useState(entries[0]?.[0] || '')

  if (entries.length === 0) return null

  // Single platform: no platform tabs needed
  if (entries.length === 1) {
    return <SinglePlatformResults data={entries[0][1].data} />
  }

  // Multi-platform: show platform selector tabs
  const activeResult = results[activePlatform]

  return (
    <div className="space-y-6">
      {/* Platform tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {entries.map(([entryId, result]) => {
          const info = PLATFORM_INFO[result.platform] || { label: result.platform, emoji: '📊' }
          return (
            <button
              key={entryId}
              onClick={() => setActivePlatform(entryId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activePlatform === entryId
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary'
              }`}
            >
              <span>{info.emoji}</span>
              <span>{info.label}</span>
              {result.data?.score && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activePlatform === entryId ? 'bg-white/20' : 'bg-surface-elevated'
                }`}>
                  {result.data.score.value}/100
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active platform results */}
      {activeResult && <SinglePlatformResults data={activeResult.data} />}
    </div>
  )
}
