'use client'

import { useState } from 'react'

function ScoreGauge({ score }) {
  const color = score.value >= 75 ? 'text-green-400' :
                score.value >= 50 ? 'text-yellow-400' :
                score.value >= 25 ? 'text-orange-400' : 'text-red-400'

  const bgColor = score.value >= 75 ? 'bg-green-400' :
                  score.value >= 50 ? 'bg-yellow-400' :
                  score.value >= 25 ? 'bg-orange-400' : 'bg-red-400'

  return (
    <div className="bg-surface rounded-xl border border-border p-6 text-center">
      <div className="relative w-36 h-36 mx-auto mb-4">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
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
      {score.summary && (
        <p className="text-sm text-text-secondary mt-3">{score.summary}</p>
      )}
    </div>
  )
}

function ScoreBar({ label, score, details }) {
  const barColor = score >= 75 ? 'bg-green-400' :
                   score >= 50 ? 'bg-yellow-400' :
                   score >= 25 ? 'bg-orange-400' : 'bg-red-400'

  const textColor = score >= 75 ? 'text-green-400' :
                    score >= 50 ? 'text-yellow-400' :
                    score >= 25 ? 'text-orange-400' : 'text-red-400'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{score}/100</span>
      </div>
      <div className="w-full bg-surface-elevated rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {details && (
        <p className="text-xs text-text-muted">{details}</p>
      )}
    </div>
  )
}

function CategoryScoresSection({ categories }) {
  if (!categories || categories.length === 0) return null

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
      <h3 className="text-lg font-semibold text-text-primary">Scores par categorie</h3>
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <ScoreBar key={i} label={cat.name} score={cat.score} details={cat.details} />
        ))}
      </div>
    </div>
  )
}

function PageAnalysesSection({ pages }) {
  const [expandedPage, setExpandedPage] = useState(null)

  if (!pages || pages.length === 0) return null

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Analyse par page</h3>
      <div className="space-y-2">
        {pages.map((page, i) => {
          const scoreColor = page.score >= 75 ? 'text-green-400' :
                             page.score >= 50 ? 'text-yellow-400' :
                             page.score >= 25 ? 'text-orange-400' : 'text-red-400'

          const scoreBg = page.score >= 75 ? 'bg-green-900/20 border-green-800/50' :
                          page.score >= 50 ? 'bg-yellow-900/20 border-yellow-800/50' :
                          page.score >= 25 ? 'bg-orange-900/20 border-orange-800/50' : 'bg-red-900/20 border-red-800/50'

          const isExpanded = expandedPage === i

          return (
            <div key={i} className={`rounded-lg border ${scoreBg} overflow-hidden`}>
              <button
                onClick={() => setExpandedPage(isExpanded ? null : i)}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className={`text-lg font-bold ${scoreColor} flex-shrink-0`}>{page.score}</span>
                  <span className="text-sm text-text-primary truncate">{page.url}</span>
                </div>
                <span className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                  {page.positives?.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-green-400 mb-1.5">Points positifs</h5>
                      <ul className="space-y-1">
                        {page.positives.map((p, j) => (
                          <li key={j} className="text-xs text-text-secondary flex items-start">
                            <span className="text-green-400 mr-2 mt-0.5">+</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {page.issues?.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-red-400 mb-1.5">Problemes detectes</h5>
                      <ul className="space-y-1">
                        {page.issues.map((issue, j) => (
                          <li key={j} className="text-xs text-text-secondary flex items-start">
                            <span className="text-red-400 mr-2 mt-0.5">-</span>{issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ImprovementsSection({ improvements }) {
  if (!improvements || improvements.length === 0) return null

  const priorityStyles = {
    haute: 'bg-red-900/30 text-red-300 border-red-800',
    moyenne: 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
    basse: 'bg-surface-elevated text-text-muted border-border'
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Axes d&apos;amelioration</h3>
      <div className="space-y-3">
        {improvements.map((imp, i) => (
          <div key={i} className={`rounded-lg border p-4 ${priorityStyles[imp.priority] || priorityStyles.basse}`}>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold flex-1">{imp.title}</h4>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/20">
                {imp.priority}
              </span>
              {imp.category && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10">
                  {imp.category}
                </span>
              )}
            </div>
            <p className="text-xs opacity-80 mb-2">{imp.description}</p>
            {imp.pages?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {imp.pages.map((pageUrl, j) => (
                  <span key={j} className="text-[10px] bg-black/20 px-2 py-0.5 rounded truncate max-w-[200px]">
                    {pageUrl}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickWinsSection({ quickWins }) {
  if (!quickWins || quickWins.length === 0) return null

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-primary mb-3">Quick Wins</h3>
      <p className="text-xs text-text-muted mb-3">Actions rapides a fort impact</p>
      <ol className="space-y-2">
        {quickWins.map((win, i) => (
          <li key={i} className="flex items-start text-sm text-text-secondary">
            <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            {win}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function SeoResults({ data }) {
  const [activeTab, setActiveTab] = useState('categories')

  if (!data) return null

  const tabs = [
    { id: 'categories', label: 'Scores' },
    { id: 'pages', label: `Pages (${data.pageAnalyses?.length || 0})` },
    { id: 'improvements', label: 'Ameliorations' }
  ]

  return (
    <div className="space-y-6">
      {/* Global Score */}
      {data.globalScore && <ScoreGauge score={data.globalScore} />}

      {/* Summary */}
      {data.summary && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary leading-relaxed">{data.summary}</p>
        </div>
      )}

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
      {activeTab === 'categories' && <CategoryScoresSection categories={data.categoryScores} />}
      {activeTab === 'pages' && <PageAnalysesSection pages={data.pageAnalyses} />}
      {activeTab === 'improvements' && <ImprovementsSection improvements={data.improvements} />}

      {/* Quick Wins (always visible) */}
      <QuickWinsSection quickWins={data.quickWins} />
    </div>
  )
}
