'use client'

import { useState } from 'react'

export default function TradingDashboard({ data, mode }) {
  const [activeTab, setActiveTab] = useState('recommandation')

  if (!data) return null

  // Mode portefeuille
  if (mode === 'portefeuille') {
    const resume = data.resume_portefeuille || {}
    return (
      <div className="space-y-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Resume du portefeuille</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-text-muted">Valeur totale</p><p className="text-sm font-bold text-text-primary">{resume.valeur_totale || 'N/A'}</p></div>
            <div><p className="text-xs text-text-muted">Performance</p><p className="text-sm font-bold text-text-primary">{resume.performance_globale || 'N/A'}</p></div>
            <div><p className="text-xs text-text-muted">Diversification</p><p className="text-sm font-bold text-primary">{resume.score_diversification || 0}/100</p></div>
            <div><p className="text-xs text-text-muted">Risque</p><p className="text-sm font-bold capitalize text-text-primary">{resume.niveau_risque || 'N/A'}</p></div>
          </div>
        </div>

        {data.positions_analysees?.length > 0 && (
          <div className="bg-surface rounded-xl border border-border p-6 space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Positions</h4>
            {data.positions_analysees.map((pos, i) => {
              const recColor = pos.recommandation === 'renforcer' ? 'text-green-400 bg-green-900/20' :
                               pos.recommandation === 'vendre' || pos.recommandation === 'reduire' ? 'text-red-400 bg-red-900/20' :
                               'text-yellow-400 bg-yellow-900/20'
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{pos.actif}</p>
                    <p className="text-xs text-text-muted">{pos.poids} | Perf: {pos.performance}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${recColor}`}>{pos.recommandation}</span>
                    {pos.commentaire && <p className="text-[10px] text-text-muted mt-1 max-w-[200px]">{pos.commentaire}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {data.actions_recommandees?.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-primary mb-3">Actions prioritaires</h4>
            {data.actions_recommandees.map((a, i) => {
              const prioColor = a.priorite === 'haute' ? 'bg-red-900/30 text-red-300' : a.priorite === 'moyenne' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-surface-elevated text-text-muted'
              return (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex-shrink-0 ${prioColor}`}>{a.priorite}</span>
                  <div><p className="text-xs text-text-primary font-medium">{a.action}</p><p className="text-[10px] text-text-muted">{a.raison}</p></div>
                </div>
              )
            })}
          </div>
        )}

        {data.disclaimer && <p className="text-[10px] text-text-muted text-center italic">{data.disclaimer}</p>}
      </div>
    )
  }

  // Mode analyse trading
  const actif = data.actif || {}
  const reco = data.recommandation || {}
  const risque = data.gestion_risque || {}
  const plan = data.plan_trading || {}

  const recoColor = reco.action === 'ACHETER' ? 'text-green-400 bg-green-900/20 border-green-800' :
                    reco.action === 'VENDRE' ? 'text-red-400 bg-red-900/20 border-red-800' :
                    'text-yellow-400 bg-yellow-900/20 border-yellow-800'

  const tabs = [
    { id: 'recommandation', label: 'Recommandation' },
    { id: 'risque', label: 'Gestion du risque' },
    { id: 'plan', label: 'Plan de trading' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-primary">{actif.nom || actif.ticker}</h3>
            <p className="text-sm text-text-muted">{actif.ticker} - {actif.type}</p>
          </div>
          {actif.prix_actuel > 0 && <p className="text-2xl font-bold text-text-primary">{actif.prix_actuel} USD</p>}
        </div>
        {/* Scores resume */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.analyse_fondamentale_resume && (
            <div className="bg-surface-elevated rounded-lg p-3">
              <p className="text-[10px] text-text-muted">Score fondamental</p>
              <p className="text-sm font-bold text-text-primary">{data.analyse_fondamentale_resume.score}/100</p>
              <p className="text-[10px] text-text-muted capitalize">{data.analyse_fondamentale_resume.sentiment}</p>
            </div>
          )}
          {data.analyse_technique_resume && (
            <div className="bg-surface-elevated rounded-lg p-3">
              <p className="text-[10px] text-text-muted">Score technique</p>
              <p className="text-sm font-bold text-text-primary">{data.analyse_technique_resume.score}/100</p>
              <p className="text-[10px] text-text-muted capitalize">{data.analyse_technique_resume.tendance} - {data.analyse_technique_resume.signal}</p>
            </div>
          )}
        </div>
      </div>

      {/* Signal principal */}
      <div className={`rounded-xl border p-6 text-center ${recoColor}`}>
        <p className="text-3xl font-bold">{reco.action}</p>
        <p className="text-sm opacity-80 capitalize">Conviction : {reco.conviction}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-elevated rounded-xl p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex-1 ${activeTab === tab.id ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommandation */}
      {activeTab === 'recommandation' && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-surface-elevated rounded-lg p-3"><p className="text-[10px] text-text-muted">Prix d&apos;entree</p><p className="text-sm font-bold text-text-primary">{reco.prix_entree_suggere || 'N/A'}</p></div>
            <div className="bg-red-900/10 rounded-lg p-3"><p className="text-[10px] text-red-300">Stop-loss</p><p className="text-sm font-bold text-red-400">{reco.stop_loss || 'N/A'}</p></div>
            {reco.take_profit?.map((tp, i) => (
              <div key={i} className="bg-green-900/10 rounded-lg p-3"><p className="text-[10px] text-green-300">TP {i + 1}</p><p className="text-sm font-bold text-green-400">{tp}</p></div>
            ))}
            <div className="bg-surface-elevated rounded-lg p-3"><p className="text-[10px] text-text-muted">Taille position</p><p className="text-sm font-bold text-text-primary">{reco.taille_position || 'N/A'}</p></div>
            <div className="bg-surface-elevated rounded-lg p-3"><p className="text-[10px] text-text-muted">Risque/Reward</p><p className="text-sm font-bold text-primary">{reco.ratio_risque_reward || 'N/A'}</p></div>
          </div>
        </div>
      )}

      {/* Risque */}
      {activeTab === 'risque' && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-4 text-center">
              <p className="text-xs text-red-300">Perte max</p>
              <p className="text-lg font-bold text-red-400">{risque.perte_max || 'N/A'}</p>
            </div>
            <div className="bg-green-900/10 border border-green-800/30 rounded-lg p-4 text-center">
              <p className="text-xs text-green-300">Gain potentiel</p>
              <p className="text-lg font-bold text-green-400">{risque.gain_potentiel || 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-surface-elevated rounded-lg p-3 text-center"><p className="text-[10px] text-text-muted">Risque</p><p className="text-sm font-bold text-text-primary">{risque.risque_pourcentage || 'N/A'}</p></div>
            <div className="bg-surface-elevated rounded-lg p-3 text-center"><p className="text-[10px] text-text-muted">Prob. succes</p><p className="text-sm font-bold text-text-primary">{risque.probabilite_succes || 'N/A'}</p></div>
          </div>
        </div>
      )}

      {/* Plan */}
      {activeTab === 'plan' && (
        <div className="space-y-3">
          {plan.scenario_haussier && (
            <div className="bg-green-900/10 border border-green-800/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-300 mb-1">Scenario haussier</h4>
              <p className="text-xs text-green-200">{plan.scenario_haussier}</p>
            </div>
          )}
          {plan.scenario_baissier && (
            <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-red-300 mb-1">Scenario baissier</h4>
              <p className="text-xs text-red-200">{plan.scenario_baissier}</p>
            </div>
          )}
          {plan.catalyseurs?.length > 0 && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Catalyseurs a surveiller</h4>
              <ul className="space-y-1">
                {plan.catalyseurs.map((c, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start"><span className="text-primary mr-2">-</span>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {data.disclaimer && <p className="text-[10px] text-text-muted text-center italic">{data.disclaimer}</p>}
    </div>
  )
}
