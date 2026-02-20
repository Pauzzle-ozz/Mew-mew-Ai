'use client'

import { useState } from 'react'

function ScoreGauge({ score }) {
  const value = typeof score === 'number' ? score : 0
  const color = value >= 75 ? 'text-green-400' :
                value >= 50 ? 'text-yellow-400' :
                value >= 25 ? 'text-orange-400' : 'text-red-400'
  const bgColor = value >= 75 ? 'bg-green-400' :
                  value >= 50 ? 'bg-yellow-400' :
                  value >= 25 ? 'bg-orange-400' : 'bg-red-400'
  const label = value >= 75 ? 'Conforme' : value >= 50 ? 'A ameliorer' : value >= 25 ? 'Risque' : 'Critique'

  return (
    <div className="bg-surface rounded-xl border border-border p-6 text-center">
      <div className="relative w-36 h-36 mx-auto mb-4">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-elevated" />
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeDasharray={`${(value / 100) * 264} 264`} strokeLinecap="round" className={color} stroke="currentColor" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{value}</span>
          <span className="text-xs text-text-muted">/100</span>
        </div>
      </div>
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bgColor}/20 ${color}`}>{label}</div>
    </div>
  )
}

function DiagnosticsSection({ diagnostics }) {
  if (!diagnostics || diagnostics.length === 0) return null

  const statusStyles = {
    conforme: 'bg-green-900/20 border-green-800/50 text-green-300',
    alerte: 'bg-yellow-900/20 border-yellow-800/50 text-yellow-300',
    erreur: 'bg-red-900/20 border-red-800/50 text-red-300'
  }

  const statusIcons = { conforme: '✓', alerte: '⚠', erreur: '✕' }

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Diagnostics par categorie</h3>
      <div className="space-y-3">
        {diagnostics.map((d, i) => (
          <div key={i} className={`rounded-lg border p-4 ${statusStyles[d.statut] || statusStyles.alerte}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{statusIcons[d.statut] || '?'}</span>
              <h4 className="text-sm font-semibold flex-1">{d.categorie}</h4>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/20">{d.statut}</span>
            </div>
            <p className="text-xs opacity-80 mb-2">{d.detail}</p>
            {d.impact_financier && (
              <p className="text-xs font-medium">Impact : {d.impact_financier}</p>
            )}
            {d.action_corrective && (
              <p className="text-xs mt-1 opacity-70">Action : {d.action_corrective}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function OptimisationsSection({ optimisations }) {
  if (!optimisations || optimisations.length === 0) return null

  const diffStyles = {
    facile: 'bg-green-900/30 text-green-300',
    moyen: 'bg-yellow-900/30 text-yellow-300',
    complexe: 'bg-red-900/30 text-red-300'
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Optimisations recommandees</h3>
      <div className="space-y-3">
        {optimisations.map((opt, i) => (
          <div key={i} className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
              <h4 className="text-sm font-semibold text-text-primary flex-1">{opt.titre}</h4>
              {opt.difficulte && (
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${diffStyles[opt.difficulte] || ''}`}>{opt.difficulte}</span>
              )}
            </div>
            <p className="text-xs text-text-secondary mb-2">{opt.description}</p>
            <div className="flex flex-wrap gap-2">
              {opt.economie_estimee && (
                <span className="text-xs bg-green-900/20 text-green-300 px-2 py-0.5 rounded">{opt.economie_estimee}</span>
              )}
              {opt.reference_legale && (
                <span className="text-xs bg-surface-elevated text-text-muted px-2 py-0.5 rounded">{opt.reference_legale}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AuditFiscalResults({ data }) {
  const [activeTab, setActiveTab] = useState('diagnostics')

  if (!data) return null

  const tabs = [
    { id: 'diagnostics', label: `Diagnostics (${data.diagnostics?.length || 0})` },
    { id: 'optimisations', label: `Optimisations (${data.optimisations?.length || 0})` }
  ]

  return (
    <div className="space-y-6">
      <ScoreGauge score={data.score_conformite} />

      {data.resume_executif && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary leading-relaxed">{data.resume_executif}</p>
        </div>
      )}

      {data.alertes_critiques?.length > 0 && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-5 space-y-2">
          <h3 className="text-sm font-semibold text-red-300">Alertes critiques</h3>
          {data.alertes_critiques.map((a, i) => (
            <p key={i} className="text-xs text-red-200 flex items-start">
              <span className="text-red-400 mr-2 mt-0.5">!</span>{a}
            </p>
          ))}
        </div>
      )}

      <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'diagnostics' && <DiagnosticsSection diagnostics={data.diagnostics} />}
      {activeTab === 'optimisations' && <OptimisationsSection optimisations={data.optimisations} />}
    </div>
  )
}
