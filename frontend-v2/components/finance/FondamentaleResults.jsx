'use client'

import { useState } from 'react'

function ScoreGauge({ score, label }) {
  const value = typeof score === 'number' ? score : 0
  const color = value >= 75 ? 'text-green-400' : value >= 50 ? 'text-yellow-400' : value >= 25 ? 'text-orange-400' : 'text-red-400'

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-elevated" />
        <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeDasharray={`${(value / 100) * 264} 264`} strokeLinecap="round" className={color} stroke="currentColor" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
        <span className="text-[10px] text-text-muted">{label || '/100'}</span>
      </div>
    </div>
  )
}

export default function FondamentaleResults({ data }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!data) return null

  const ent = data.entreprise || {}
  const ratios = data.ratios_financiers || {}
  const swot = data.analyse_swot || {}
  const verdict = data.verdict || {}

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'ratios', label: 'Ratios' },
    { id: 'swot', label: 'SWOT' }
  ]

  const verdictColor = verdict.recommandation === 'Acheter' ? 'text-green-400 bg-green-900/20 border-green-800' :
                        verdict.recommandation === 'Eviter' ? 'text-red-400 bg-red-900/20 border-red-800' :
                        'text-yellow-400 bg-yellow-900/20 border-yellow-800'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-text-primary">{ent.nom || ent.ticker}</h3>
            <p className="text-sm text-text-muted">{ent.ticker} - {ent.secteur}</p>
          </div>
          <ScoreGauge score={data.score_sante} label="Sante" />
        </div>
        {ent.prix_actuel && (
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-text-primary">{ent.prix_actuel} USD</span>
            {ent.variation_52sem && (
              <span className="text-xs text-text-muted">52 sem : {ent.variation_52sem.min} - {ent.variation_52sem.max}</span>
            )}
          </div>
        )}
        {ent.description && <p className="text-xs text-text-secondary mt-3 leading-relaxed">{ent.description}</p>}
      </div>

      {/* Verdict */}
      <div className={`rounded-xl border p-5 text-center ${verdictColor}`}>
        <p className="text-2xl font-bold">{verdict.recommandation}</p>
        <p className="text-sm opacity-80 capitalize">Conviction : {verdict.conviction}</p>
        {verdict.prix_cible && <p className="text-xs mt-1 opacity-70">Prix cible : {verdict.prix_cible}</p>}
        {verdict.arguments?.length > 0 && (
          <div className="mt-3 text-left max-w-md mx-auto">
            {verdict.arguments.map((a, i) => (
              <p key={i} className="text-xs opacity-80 flex items-start"><span className="mr-2">-</span>{a}</p>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-elevated rounded-xl p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex-1 ${activeTab === tab.id ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {data.projet_long_terme && (
            <div className="bg-surface rounded-xl border border-border p-5">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Vision long terme</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{data.projet_long_terme}</p>
            </div>
          )}
          {data.actualites_impact?.length > 0 && (
            <div className="bg-surface rounded-xl border border-border p-5">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Actualites impactantes</h4>
              <ul className="space-y-1">
                {data.actualites_impact.map((a, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start"><span className="text-primary mr-2">-</span>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {data.sentiment_marche && (
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-text-muted">Sentiment du marche</p>
              <p className={`text-lg font-bold capitalize ${data.sentiment_marche === 'positif' ? 'text-green-400' : data.sentiment_marche === 'negatif' ? 'text-red-400' : 'text-yellow-400'}`}>{data.sentiment_marche}</p>
            </div>
          )}
        </div>
      )}

      {/* Ratios */}
      {activeTab === 'ratios' && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <h4 className="text-sm font-semibold text-text-primary mb-4">Ratios financiers</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'P/E Ratio', value: ratios.pe_ratio },
              { label: 'P/B Ratio', value: ratios.pb_ratio },
              { label: 'ROE', value: ratios.roe },
              { label: 'Marge nette', value: ratios.marge_nette },
              { label: 'Marge oper.', value: ratios.marge_operationnelle },
              { label: 'Dette/Equity', value: ratios.dette_equity },
              { label: 'Free Cash Flow', value: ratios.free_cash_flow },
              { label: 'Dividende', value: ratios.dividende_yield },
              { label: 'Croissance CA', value: ratios.croissance_ca }
            ].map((r, i) => (
              <div key={i} className="bg-surface-elevated rounded-lg p-3">
                <p className="text-[10px] text-text-muted">{r.label}</p>
                <p className="text-sm font-semibold text-text-primary">{r.value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SWOT */}
      {activeTab === 'swot' && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'forces', label: 'Forces', color: 'bg-green-900/20 border-green-800/50', icon: '+', textColor: 'text-green-300' },
            { key: 'faiblesses', label: 'Faiblesses', color: 'bg-red-900/20 border-red-800/50', icon: '-', textColor: 'text-red-300' },
            { key: 'opportunites', label: 'Opportunites', color: 'bg-blue-900/20 border-blue-800/50', icon: '>', textColor: 'text-blue-300' },
            { key: 'menaces', label: 'Menaces', color: 'bg-orange-900/20 border-orange-800/50', icon: '!', textColor: 'text-orange-300' }
          ].map(({ key, label, color, icon, textColor }) => (
            <div key={key} className={`rounded-xl border p-4 ${color}`}>
              <h4 className={`text-sm font-semibold ${textColor} mb-2`}>{label}</h4>
              <ul className="space-y-1">
                {(swot[key] || []).map((item, i) => (
                  <li key={i} className={`text-xs ${textColor} opacity-80 flex items-start`}><span className="mr-1">{icon}</span>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      {data.disclaimer && (
        <p className="text-[10px] text-text-muted text-center italic">{data.disclaimer}</p>
      )}
    </div>
  )
}
