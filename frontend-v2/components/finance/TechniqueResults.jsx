'use client'

import { useState } from 'react'

function IndicatorBadge({ label, value, interpret }) {
  const color = interpret === 'bullish' ? 'text-green-400 bg-green-900/20' :
                interpret === 'bearish' ? 'text-red-400 bg-red-900/20' :
                'text-yellow-400 bg-yellow-900/20'

  return (
    <div className={`rounded-lg p-3 ${color}`}>
      <p className="text-[10px] opacity-70">{label}</p>
      <p className="text-sm font-bold">{typeof value === 'number' ? value.toFixed(2) : value || 'N/A'}</p>
    </div>
  )
}

function AnalyseHorizon({ data, horizon }) {
  if (!data) return null

  const signalColor = data.signal === 'achat' ? 'bg-green-900/20 border-green-800 text-green-300' :
                      data.signal === 'vente' ? 'bg-red-900/20 border-red-800 text-red-300' :
                      'bg-yellow-900/20 border-yellow-800 text-yellow-300'

  const tendanceColor = data.tendance === 'haussier' ? 'text-green-400' :
                        data.tendance === 'baissier' ? 'text-red-400' : 'text-yellow-400'

  return (
    <div className={`rounded-xl border p-5 ${signalColor}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold capitalize">{horizon}</h4>
        <span className="text-xs opacity-70">{data.horizon}</span>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div><p className="text-[10px] opacity-70">Tendance</p><p className={`text-sm font-bold capitalize ${tendanceColor}`}>{data.tendance}</p></div>
        <div><p className="text-[10px] opacity-70">Signal</p><p className="text-sm font-bold uppercase">{data.signal}</p></div>
        {data.objectif_prix > 0 && <div><p className="text-[10px] opacity-70">Objectif</p><p className="text-sm font-bold">{data.objectif_prix}</p></div>}
      </div>
      {data.arguments?.length > 0 && (
        <ul className="space-y-1">
          {data.arguments.map((a, i) => (
            <li key={i} className="text-xs opacity-80 flex items-start"><span className="mr-2">-</span>{a}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function TechniqueResults({ data }) {
  const [activeTab, setActiveTab] = useState('analyse')

  if (!data) return null

  const ind = data.indicateurs || {}
  const niveaux = data.niveaux_cles || {}

  const tabs = [
    { id: 'analyse', label: 'Analyse' },
    { id: 'indicateurs', label: 'Indicateurs' },
    { id: 'niveaux', label: 'Niveaux cles' }
  ]

  // Interpreter les indicateurs pour les couleurs
  const rsiInterpret = ind.rsi_14 > 70 ? 'bearish' : ind.rsi_14 < 30 ? 'bullish' : 'neutral'
  const macdInterpret = ind.macd?.histogram > 0 ? 'bullish' : ind.macd?.histogram < 0 ? 'bearish' : 'neutral'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-primary">{data.actif?.ticker || 'Actif'}</h3>
            <p className="text-sm text-text-muted">Analyse technique</p>
          </div>
          <div className="text-right">
            {data.actif?.prix_actuel > 0 && <p className="text-2xl font-bold text-text-primary">{data.actif.prix_actuel}</p>}
            {data.actif?.variation_24h && <p className={`text-sm ${parseFloat(data.actif.variation_24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{data.actif.variation_24h}</p>}
          </div>
        </div>
        {data.score_technique !== undefined && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-text-muted">Score technique</span>
            <div className="flex-1 bg-surface-elevated rounded-full h-3 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${data.score_technique >= 60 ? 'bg-green-400' : data.score_technique >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${data.score_technique}%` }} />
            </div>
            <span className={`text-sm font-bold ${data.score_technique >= 60 ? 'text-green-400' : data.score_technique >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{data.score_technique}/100</span>
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

      {/* Analyse 3 horizons */}
      {activeTab === 'analyse' && data.analyse && (
        <div className="space-y-3">
          <AnalyseHorizon data={data.analyse.court_terme} horizon="Court terme" />
          <AnalyseHorizon data={data.analyse.moyen_terme} horizon="Moyen terme" />
          <AnalyseHorizon data={data.analyse.long_terme} horizon="Long terme" />
        </div>
      )}

      {/* Indicateurs */}
      {activeTab === 'indicateurs' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Moyennes mobiles</h4>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              <IndicatorBadge label="SMA 20" value={ind.sma_20} interpret={ind.prix_actuel > ind.sma_20 ? 'bullish' : 'bearish'} />
              <IndicatorBadge label="SMA 50" value={ind.sma_50} interpret={ind.prix_actuel > ind.sma_50 ? 'bullish' : 'bearish'} />
              <IndicatorBadge label="SMA 200" value={ind.sma_200} interpret={ind.prix_actuel > ind.sma_200 ? 'bullish' : 'bearish'} />
              <IndicatorBadge label="EMA 12" value={ind.ema_12} interpret="neutral" />
              <IndicatorBadge label="EMA 26" value={ind.ema_26} interpret="neutral" />
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Oscillateurs</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <IndicatorBadge label="RSI (14)" value={ind.rsi_14} interpret={rsiInterpret} />
              <IndicatorBadge label="MACD" value={ind.macd?.macd} interpret={macdInterpret} />
              <IndicatorBadge label="Signal" value={ind.macd?.signal} interpret="neutral" />
              <IndicatorBadge label="Histogramme" value={ind.macd?.histogram} interpret={macdInterpret} />
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Bandes de Bollinger</h4>
            <div className="grid grid-cols-3 gap-2">
              <IndicatorBadge label="Upper" value={ind.bollinger?.upper} interpret="neutral" />
              <IndicatorBadge label="Middle" value={ind.bollinger?.middle} interpret="neutral" />
              <IndicatorBadge label="Lower" value={ind.bollinger?.lower} interpret="neutral" />
            </div>
          </div>
        </div>
      )}

      {/* Niveaux cles */}
      {activeTab === 'niveaux' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-900/10 border border-green-800/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-300 mb-2">Supports</h4>
              {(niveaux.supports || []).map((s, i) => (
                <p key={i} className="text-sm text-green-200 font-medium">{s}</p>
              ))}
            </div>
            <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-red-300 mb-2">Resistances</h4>
              {(niveaux.resistances || []).map((r, i) => (
                <p key={i} className="text-sm text-red-200 font-medium">{r}</p>
              ))}
            </div>
          </div>
          {niveaux.fibonacci && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Fibonacci</h4>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(niveaux.fibonacci).map(([key, val]) => (
                  <div key={key} className="bg-surface-elevated rounded-lg p-2 text-center">
                    <p className="text-[10px] text-text-muted">{key}</p>
                    <p className="text-xs font-semibold text-text-primary">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.patterns_detectes?.length > 0 && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Patterns detectes</h4>
              <div className="flex flex-wrap gap-2">
                {data.patterns_detectes.map((p, i) => (
                  <span key={i} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resume */}
      {data.resume && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <p className="text-sm text-text-secondary leading-relaxed">{data.resume}</p>
        </div>
      )}

      {data.disclaimer && (
        <p className="text-[10px] text-text-muted text-center italic">{data.disclaimer}</p>
      )}
    </div>
  )
}
