'use client'

import { useState } from 'react'

function CalendrierView({ data }) {
  if (!data?.echeances || data.echeances.length === 0) return <p className="text-sm text-text-muted">Aucune echeance generee</p>

  return (
    <div className="space-y-4">
      {data.prochaine_echeance && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <p className="text-xs text-primary font-medium mb-1">Prochaine echeance</p>
          <p className="text-sm font-semibold text-text-primary">{data.prochaine_echeance.declaration}</p>
          <p className="text-xs text-text-secondary">{data.prochaine_echeance.date_limite} - {data.prochaine_echeance.jours_restants}j restants</p>
        </div>
      )}
      <div className="space-y-2">
        {data.echeances.map((e, i) => (
          <div key={i} className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-text-primary">{e.declaration}</span>
              <span className="text-xs bg-surface-elevated text-text-muted px-2 py-0.5 rounded">{e.date_limite}</span>
            </div>
            {e.formulaire && <p className="text-xs text-text-muted mb-1">Formulaire : {e.formulaire}</p>}
            {e.penalite_retard && <p className="text-xs text-red-300">Penalite retard : {e.penalite_retard}</p>}
            {e.documents_necessaires?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {e.documents_necessaires.map((d, j) => (
                  <span key={j} className="text-[10px] bg-surface-elevated text-text-muted px-2 py-0.5 rounded">{d}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {data.conseils_organisation?.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Conseils</h4>
          <ul className="space-y-1">
            {data.conseils_organisation.map((c, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start"><span className="text-primary mr-2">-</span>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function DeclarationView({ data }) {
  if (!data) return null

  return (
    <div className="space-y-4">
      {data.type_declaration && (
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-text-primary mb-1">{data.type_declaration} - {data.periode}</p>
          {data.date_limite && <p className="text-xs text-text-muted">Date limite : {data.date_limite}</p>}
          {data.montant_total !== undefined && (
            <p className="text-lg font-bold text-primary mt-2">{data.montant_total} EUR</p>
          )}
        </div>
      )}
      {data.champs?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4 space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">Detail des champs</h4>
          {data.champs.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
              <div>
                <span className="text-xs font-medium text-text-primary">{c.case || c.libelle}</span>
                {c.calcul && <p className="text-[10px] text-text-muted">{c.calcul}</p>}
              </div>
              <span className="text-sm font-semibold text-text-primary">{c.montant} EUR</span>
            </div>
          ))}
        </div>
      )}
      {data.recommandations?.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Recommandations</h4>
          <ul className="space-y-1">
            {data.recommandations.map((r, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start"><span className="text-primary mr-2">-</span>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ControleView({ data }) {
  if (!data) return null

  const riskColor = data.niveau_risque >= 75 ? 'text-red-400' :
                    data.niveau_risque >= 50 ? 'text-orange-400' :
                    data.niveau_risque >= 25 ? 'text-yellow-400' : 'text-green-400'

  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-xl border border-border p-6 text-center">
        <p className="text-xs text-text-muted mb-1">Niveau de risque</p>
        <p className={`text-4xl font-bold ${riskColor}`}>{data.niveau_risque}/100</p>
        {data.risque_label && <p className={`text-sm font-medium ${riskColor} mt-1 capitalize`}>{data.risque_label}</p>}
        {data.montant_potentiel_redressement && (
          <p className="text-xs text-text-muted mt-2">Redressement potentiel : {data.montant_potentiel_redressement}</p>
        )}
      </div>
      {data.checklist_conformite?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4 space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">Checklist de conformite</h4>
          {data.checklist_conformite.map((item, i) => {
            const icon = item.statut === 'ok' ? '✓' : item.statut === 'attention' ? '⚠' : '✕'
            const color = item.statut === 'ok' ? 'text-green-400' : item.statut === 'attention' ? 'text-yellow-400' : 'text-red-400'
            return (
              <div key={i} className="flex items-start gap-2 py-1">
                <span className={`${color} flex-shrink-0 mt-0.5`}>{icon}</span>
                <div>
                  <p className="text-xs font-medium text-text-primary">{item.point}</p>
                  {item.action && <p className="text-[10px] text-text-muted">{item.action}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {data.conseils_preparation?.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Conseils de preparation</h4>
          <ol className="space-y-1">
            {data.conseils_preparation.map((c, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start">
                <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[10px] font-bold mr-2 flex-shrink-0">{i + 1}</span>
                {c}
              </li>
            ))}
          </ol>
        </div>
      )}
      {data.droits_contribuable?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-2">Vos droits</h4>
          <ul className="space-y-1">
            {data.droits_contribuable.map((d, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start"><span className="text-primary mr-2">-</span>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function QuestionView({ data }) {
  if (!data) return null

  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-xl border border-border p-5">
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{data.reponse}</p>
      </div>
      {data.points_cles?.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Points cles</h4>
          <ul className="space-y-1">
            {data.points_cles.map((p, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start"><span className="text-primary mr-2">-</span>{p}</li>
            ))}
          </ul>
        </div>
      )}
      {data.references_legales?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-2">References legales</h4>
          <div className="flex flex-wrap gap-1">
            {data.references_legales.map((r, i) => (
              <span key={i} className="text-xs bg-surface-elevated text-text-muted px-2 py-0.5 rounded">{r}</span>
            ))}
          </div>
        </div>
      )}
      {data.risques?.length > 0 && (
        <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-red-300 mb-2">Risques a connaitre</h4>
          <ul className="space-y-1">
            {data.risques.map((r, i) => (
              <li key={i} className="text-xs text-red-200 flex items-start"><span className="text-red-400 mr-2">!</span>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function AssistantFiscalResults({ data, mode }) {
  if (!data) return null

  if (mode === 'calendrier') return <CalendrierView data={data} />
  if (mode === 'declaration') return <DeclarationView data={data} />
  if (mode === 'controle') return <ControleView data={data} />
  if (mode === 'question') return <QuestionView data={data} />

  return <p className="text-sm text-text-muted">Resultats non disponibles</p>
}
