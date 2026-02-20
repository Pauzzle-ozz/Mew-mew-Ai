'use client'

import { useState } from 'react'

export default function SimulateurResults({ data }) {
  const [activeTab, setActiveTab] = useState('comparaison')

  if (!data) return null

  const tabs = [
    { id: 'comparaison', label: `Regimes (${data.comparaison_regimes?.length || 0})` },
    { id: 'remuneration', label: 'Remuneration' },
    { id: 'projections', label: 'Projections' },
    { id: 'seuils', label: 'Seuils critiques' }
  ]

  const sit = data.situation_actuelle_analyse

  return (
    <div className="space-y-6">
      {/* Situation actuelle */}
      {sit && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Situation actuelle</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-text-muted">Statut</p><p className="text-sm font-semibold text-text-primary">{sit.statut}</p></div>
            <div><p className="text-xs text-text-muted">Regime</p><p className="text-sm font-semibold text-text-primary">{sit.regime_fiscal}</p></div>
            <div><p className="text-xs text-text-muted">Charge totale</p><p className="text-sm font-semibold text-primary">{sit.charge_fiscale_totale}</p></div>
            <div><p className="text-xs text-text-muted">Taux effectif</p><p className="text-sm font-semibold text-text-primary">{sit.taux_effectif}</p></div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comparaison regimes */}
      {activeTab === 'comparaison' && data.comparaison_regimes?.length > 0 && (
        <div className="space-y-3">
          {data.comparaison_regimes.map((regime, i) => (
            <div key={i} className={`rounded-xl border p-5 ${regime.recommande ? 'bg-primary/5 border-primary/30' : 'bg-surface border-border'}`}>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-bold text-text-primary">{regime.statut} - {regime.regime}</h4>
                {regime.recommande && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">RECOMMANDE</span>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div><p className="text-[10px] text-text-muted">IS/IR</p><p className="text-xs font-semibold text-text-primary">{regime.impot_societe}</p></div>
                <div><p className="text-[10px] text-text-muted">Cotisations</p><p className="text-xs font-semibold text-text-primary">{regime.cotisations_sociales}</p></div>
                <div><p className="text-[10px] text-text-muted">IR dirigeant</p><p className="text-xs font-semibold text-text-primary">{regime.ir_dirigeant}</p></div>
                <div><p className="text-[10px] text-text-muted">Total</p><p className="text-xs font-bold text-primary">{regime.charge_totale}</p></div>
              </div>
              {regime.economie_vs_actuel && (
                <p className="text-xs font-medium text-green-400 mb-2">Economie vs actuel : {regime.economie_vs_actuel}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {regime.avantages?.length > 0 && (
                  <div>
                    {regime.avantages.map((a, j) => (
                      <p key={j} className="text-[10px] text-green-300 flex items-start"><span className="mr-1">+</span>{a}</p>
                    ))}
                  </div>
                )}
                {regime.inconvenients?.length > 0 && (
                  <div>
                    {regime.inconvenients.map((ic, j) => (
                      <p key={j} className="text-[10px] text-red-300 flex items-start"><span className="mr-1">-</span>{ic}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remuneration */}
      {activeTab === 'remuneration' && data.optimisation_remuneration && (
        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Mix optimal de remuneration</h3>
          {data.optimisation_remuneration.mix_optimal && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-elevated rounded-lg p-3"><p className="text-xs text-text-muted">Salaire</p><p className="text-sm font-bold text-text-primary">{data.optimisation_remuneration.mix_optimal.salaire}</p></div>
              <div className="bg-surface-elevated rounded-lg p-3"><p className="text-xs text-text-muted">Dividendes</p><p className="text-sm font-bold text-text-primary">{data.optimisation_remuneration.mix_optimal.dividendes}</p></div>
              <div className="bg-surface-elevated rounded-lg p-3"><p className="text-xs text-text-muted">Avantages nature</p><p className="text-sm font-bold text-text-primary">{data.optimisation_remuneration.mix_optimal.avantages_nature || 'N/A'}</p></div>
              <div className="bg-surface-elevated rounded-lg p-3"><p className="text-xs text-text-muted">PER deductible</p><p className="text-sm font-bold text-text-primary">{data.optimisation_remuneration.mix_optimal.per_deductible || 'N/A'}</p></div>
            </div>
          )}
          {data.optimisation_remuneration.economie_totale && (
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4 text-center">
              <p className="text-xs text-green-300">Economie totale estimee</p>
              <p className="text-2xl font-bold text-green-400">{data.optimisation_remuneration.economie_totale}</p>
            </div>
          )}
        </div>
      )}

      {/* Projections */}
      {activeTab === 'projections' && data.projections && (
        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Projections</h3>
          <div className="grid grid-cols-3 gap-4">
            {['annee_1', 'annee_3', 'annee_5'].map((key) => {
              const proj = data.projections[key]
              if (!proj) return null
              return (
                <div key={key} className="bg-surface-elevated rounded-lg p-4 text-center">
                  <p className="text-xs text-text-muted mb-2">{key.replace('annee_', 'Annee ')}</p>
                  {proj.ca_estime && <p className="text-xs text-text-secondary">CA : {proj.ca_estime}</p>}
                  {proj.charge_fiscale && <p className="text-sm font-semibold text-text-primary">{proj.charge_fiscale}</p>}
                  {proj.taux_effectif && <p className="text-xs text-primary">{proj.taux_effectif}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Seuils critiques */}
      {activeTab === 'seuils' && data.seuils_critiques?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-6 space-y-3">
          <h3 className="text-lg font-semibold text-text-primary">Seuils critiques</h3>
          {data.seuils_critiques.map((s, i) => (
            <div key={i} className="bg-yellow-900/10 border border-yellow-800/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-300">{s.seuil}</p>
              <p className="text-xs text-text-secondary mt-1">{s.impact}</p>
              {s.echeance_estimee && <p className="text-xs text-text-muted mt-1">Echeance : {s.echeance_estimee}</p>}
              {s.action_recommandee && <p className="text-xs text-primary mt-1">{s.action_recommandee}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Recommandation finale */}
      {data.recommandation_finale && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Recommandation</h3>
          {data.recommandation_finale.statut_recommande && (
            <p className="text-sm font-bold text-text-primary mb-2">Statut recommande : {data.recommandation_finale.statut_recommande}</p>
          )}
          <p className="text-sm text-text-secondary mb-3">{data.recommandation_finale.justification}</p>
          {data.recommandation_finale.plan_action?.length > 0 && (
            <ol className="space-y-1">
              {data.recommandation_finale.plan_action.map((step, i) => (
                <li key={i} className="text-xs text-text-secondary flex items-start">
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[10px] font-bold mr-2 flex-shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  )
}
