'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import AssistantFiscalResults from '@/components/fiscalite/AssistantFiscalResults'

import { genererCalendrier, preparerDeclaration, preparerControle, questionFiscale } from '@/lib/api/fiscaliteApi'

const STEPS = [
  { n: 1, label: 'Configuration' },
  { n: 2, label: 'Analyse' },
  { n: 3, label: 'Resultats' }
]

const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

const MODES = [
  { value: 'calendrier', label: 'Calendrier' },
  { value: 'declaration', label: 'Declaration' },
  { value: 'controle', label: 'Controle' },
  { value: 'question', label: 'Question' }
]

const STATUTS_JURIDIQUES = [
  { value: '', label: 'Selectionner un statut' },
  { value: 'micro', label: 'Micro-entreprise' },
  { value: 'ei', label: 'Entreprise Individuelle (EI)' },
  { value: 'eurl', label: 'EURL' },
  { value: 'sasu', label: 'SASU' },
  { value: 'sarl', label: 'SARL' },
  { value: 'sas', label: 'SAS' },
  { value: 'sa', label: 'SA' },
  { value: 'sci', label: 'SCI' }
]

const REGIMES_TVA = [
  { value: '', label: 'Selectionner un regime' },
  { value: 'franchise', label: 'Franchise en base de TVA' },
  { value: 'simplifie', label: 'Regime simplifie' },
  { value: 'normal', label: 'Regime normal' }
]

const REGIMES_IMPOSITION = [
  { value: '', label: 'Selectionner un regime' },
  { value: 'is', label: 'Impot sur les Societes (IS)' },
  { value: 'ir', label: 'Impot sur le Revenu (IR)' },
  { value: 'micro', label: 'Regime Micro' }
]

const TYPES_DECLARATION = [
  { value: '', label: 'Selectionner un type' },
  { value: 'tva_ca3', label: 'TVA - CA3 (mensuelle)' },
  { value: 'tva_ca12', label: 'TVA - CA12 (annuelle)' },
  { value: 'is', label: 'Impot sur les Societes' },
  { value: 'ir', label: 'Impot sur le Revenu' },
  { value: 'cfe', label: 'CFE' },
  { value: 'cvae', label: 'CVAE' },
  { value: 'das2', label: 'DAS2' }
]

const PERIODES = [
  { value: '', label: 'Selectionner une periode' },
  { value: 'mensuel', label: 'Mensuel' },
  { value: 'trimestriel', label: 'Trimestriel' },
  { value: 'annuel', label: 'Annuel' }
]

const TYPES_CONTROLE = [
  { value: '', label: 'Selectionner un type' },
  { value: 'verification_comptabilite', label: 'Verification de comptabilite' },
  { value: 'examen_situation', label: 'Examen de situation fiscale personnelle' },
  { value: 'controle_sur_pieces', label: 'Controle sur pieces' }
]

const ANNEES_DISPONIBLES = ['2023', '2024', '2025', '2026']

export default function AssistantFiscalPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState('calendrier')
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Calendrier fields
  const [calStatut, setCalStatut] = useState('')
  const [calRegimeTva, setCalRegimeTva] = useState('')
  const [calRegimeImposition, setCalRegimeImposition] = useState('')
  const [calDateCloture, setCalDateCloture] = useState('31/12')

  // Declaration fields
  const [declType, setDeclType] = useState('')
  const [declPeriode, setDeclPeriode] = useState('')
  const [declStatut, setDeclStatut] = useState('')
  const [declFile, setDeclFile] = useState(null)

  // Controle fields
  const [ctrlType, setCtrlType] = useState('')
  const [ctrlAnnees, setCtrlAnnees] = useState([])
  const [ctrlStatut, setCtrlStatut] = useState('')
  const [ctrlFile, setCtrlFile] = useState(null)

  // Question fields
  const [question, setQuestion] = useState('')
  const [contexte, setContexte] = useState('')

  // Helpers
  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label)
      setProgress(pct)
      await new Promise(r => setTimeout(r, ms))
    }
  }

  const toggleAnnee = (annee) => {
    setCtrlAnnees(prev =>
      prev.includes(annee) ? prev.filter(a => a !== annee) : [...prev, annee]
    )
  }

  const getProgressSteps = () => {
    switch (mode) {
      case 'calendrier':
        return [
          ['Analyse du statut juridique...', 10, 1500],
          ['Identification des obligations...', 25, 2000],
          ['Calcul des echeances fiscales...', 45, 2500],
          ['Verification du calendrier TVA...', 60, 2000],
          ['Generation du calendrier IA...', 80, 3000],
          ['Finalisation...', 95, 1500]
        ]
      case 'declaration':
        return [
          ['Analyse du type de declaration...', 10, 1500],
          ['Verification des obligations...', 25, 2000],
          ['Preparation des donnees...', 40, 2500],
          ['Calcul des montants...', 55, 2000],
          ['Verification de coherence...', 70, 2500],
          ['Generation IA de l\'aide...', 85, 3000],
          ['Finalisation...', 95, 1500]
        ]
      case 'controle':
        return [
          ['Analyse du type de controle...', 10, 1500],
          ['Evaluation des risques...', 25, 2000],
          ['Verification des periodes...', 40, 2500],
          ['Preparation de la strategie...', 55, 2500],
          ['Analyse IA des points de vigilance...', 75, 3000],
          ['Generation des recommandations...', 90, 2000],
          ['Finalisation...', 95, 1500]
        ]
      case 'question':
        return [
          ['Analyse de votre question...', 15, 1500],
          ['Recherche dans la base fiscale...', 35, 2500],
          ['Analyse du contexte...', 55, 2000],
          ['Generation de la reponse IA...', 80, 3000],
          ['Finalisation...', 95, 1500]
        ]
      default:
        return []
    }
  }

  const handleSubmit = async () => {
    setError('')

    // Validation par mode
    if (mode === 'calendrier' && !calStatut) {
      setError('Selectionnez votre statut juridique')
      return
    }
    if (mode === 'declaration' && !declType) {
      setError('Selectionnez le type de declaration')
      return
    }
    if (mode === 'controle' && !ctrlType) {
      setError('Selectionnez le type de controle')
      return
    }
    if (mode === 'question' && !question.trim()) {
      setError('Posez votre question fiscale')
      return
    }

    setProcessing(true)
    setProgress(0)
    setStep(2)

    try {
      let apiCall

      if (mode === 'calendrier') {
        const data = {
          statut_juridique: calStatut,
          regime_tva: calRegimeTva || undefined,
          regime_imposition: calRegimeImposition || undefined,
          date_cloture: calDateCloture || '31/12'
        }
        apiCall = genererCalendrier(data)
      } else if (mode === 'declaration') {
        const data = {
          type_declaration: declType,
          periode: declPeriode || undefined,
          statut_juridique: declStatut || undefined
        }
        apiCall = preparerDeclaration(data, declFile)
      } else if (mode === 'controle') {
        const data = {
          type_controle: ctrlType,
          annees_concernees: ctrlAnnees.length > 0 ? ctrlAnnees : undefined,
          statut_juridique: ctrlStatut || undefined
        }
        apiCall = preparerControle(data, ctrlFile)
      } else {
        apiCall = questionFiscale(question.trim(), contexte.trim() || undefined)
      }

      const [apiResult] = await Promise.all([
        apiCall,
        _progressAnim(getProgressSteps())
      ])

      setResult(apiResult)
      setProgress(100)
      setProcessingLabel('Analyse terminee !')
      await new Promise(r => setTimeout(r, 500))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'analyse fiscale')
      setStep(1)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setCalStatut('')
    setCalRegimeTva('')
    setCalRegimeImposition('')
    setCalDateCloture('31/12')
    setDeclType('')
    setDeclPeriode('')
    setDeclStatut('')
    setDeclFile(null)
    setCtrlType('')
    setCtrlAnnees([])
    setCtrlStatut('')
    setCtrlFile(null)
    setQuestion('')
    setContexte('')
  }

  const isSubmitDisabled = () => {
    if (mode === 'calendrier') return !calStatut
    if (mode === 'declaration') return !declType
    if (mode === 'controle') return !ctrlType
    if (mode === 'question') return !question.trim()
    return true
  }

  const getSubmitLabel = () => {
    switch (mode) {
      case 'calendrier': return 'Generer le calendrier fiscal'
      case 'declaration': return 'Preparer la declaration'
      case 'controle': return 'Analyser le controle'
      case 'question': return 'Obtenir la reponse'
      default: return 'Lancer l\'analyse'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Logo size="md" link={false} />
        <p className="text-text-muted">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Fiscalite', href: '/dashboard?tab=fiscalite' },
          { label: 'Assistant Fiscal' }
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stepper */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {STEPS.map(s => (
            <div key={s.n} className="flex items-center gap-1">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step === s.n ? 'bg-primary text-white' :
                step > s.n ? 'bg-primary/20 text-primary' : 'bg-surface-elevated text-text-muted'
              }`}>
                {step > s.n ? '✓ ' : ''}{s.label}
              </div>
              {s.n < STEPS.length && <div className="w-6 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-300">{error}</p>
              <button onClick={() => setError('')} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Fermer</button>
            </div>
          </div>
        )}

        {/* Step 1: Configuration */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Assistant Fiscal</h1>
              <p className="text-text-secondary">Calendrier, declarations, controles et questions fiscales</p>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-2 justify-center flex-wrap">
              {MODES.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                    mode === m.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">

              {/* CALENDRIER mode */}
              {mode === 'calendrier' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Statut juridique *</label>
                    <select
                      value={calStatut}
                      onChange={(e) => setCalStatut(e.target.value)}
                      className={inputStyles}
                    >
                      {STATUTS_JURIDIQUES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Regime TVA</label>
                    <select
                      value={calRegimeTva}
                      onChange={(e) => setCalRegimeTva(e.target.value)}
                      className={inputStyles}
                    >
                      {REGIMES_TVA.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Regime d&apos;imposition</label>
                    <select
                      value={calRegimeImposition}
                      onChange={(e) => setCalRegimeImposition(e.target.value)}
                      className={inputStyles}
                    >
                      {REGIMES_IMPOSITION.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Date de cloture</label>
                    <input
                      value={calDateCloture}
                      onChange={(e) => setCalDateCloture(e.target.value)}
                      placeholder="31/12"
                      className={inputStyles}
                    />
                    <p className="text-xs text-text-muted mt-1.5">
                      Format JJ/MM (ex: 31/12 pour cloture au 31 decembre)
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-text-secondary">
                      Le calendrier fiscal genere toutes les echeances declaratives et de paiement selon votre statut, avec les dates limites et les penalites en cas de retard.
                    </p>
                  </div>
                </>
              )}

              {/* DECLARATION mode */}
              {mode === 'declaration' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Type de declaration *</label>
                    <select
                      value={declType}
                      onChange={(e) => setDeclType(e.target.value)}
                      className={inputStyles}
                    >
                      {TYPES_DECLARATION.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Periode</label>
                    <select
                      value={declPeriode}
                      onChange={(e) => setDeclPeriode(e.target.value)}
                      className={inputStyles}
                    >
                      {PERIODES.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Statut juridique</label>
                    <select
                      value={declStatut}
                      onChange={(e) => setDeclStatut(e.target.value)}
                      className={inputStyles}
                    >
                      {STATUTS_JURIDIQUES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Document comptable (optionnel)</label>
                    <input
                      type="file"
                      accept=".pdf,.xlsx,.xls,.csv"
                      onChange={(e) => setDeclFile(e.target.files?.[0] || null)}
                      className={inputStyles}
                    />
                    <p className="text-xs text-text-muted mt-1.5">
                      Formats acceptes : PDF, Excel, CSV
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-text-secondary">
                      L&apos;assistant vous guide pas a pas dans la preparation de votre declaration avec les montants a reporter, les cases a remplir et les verifications a effectuer.
                    </p>
                  </div>
                </>
              )}

              {/* CONTROLE mode */}
              {mode === 'controle' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Type de controle *</label>
                    <select
                      value={ctrlType}
                      onChange={(e) => setCtrlType(e.target.value)}
                      className={inputStyles}
                    >
                      {TYPES_CONTROLE.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Annees concernees</label>
                    <div className="flex gap-3 flex-wrap">
                      {ANNEES_DISPONIBLES.map(annee => (
                        <button
                          key={annee}
                          onClick={() => toggleAnnee(annee)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                            ctrlAnnees.includes(annee)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-surface-elevated text-text-secondary border-border hover:border-primary hover:text-primary'
                          }`}
                        >
                          {annee}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Statut juridique</label>
                    <select
                      value={ctrlStatut}
                      onChange={(e) => setCtrlStatut(e.target.value)}
                      className={inputStyles}
                    >
                      {STATUTS_JURIDIQUES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Document comptable (optionnel)</label>
                    <input
                      type="file"
                      accept=".pdf,.xlsx,.xls,.csv"
                      onChange={(e) => setCtrlFile(e.target.files?.[0] || null)}
                      className={inputStyles}
                    />
                    <p className="text-xs text-text-muted mt-1.5">
                      Formats acceptes : PDF, Excel, CSV
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-text-secondary">
                      L&apos;assistant analyse votre situation face a un controle fiscal : points de vigilance, documents a preparer, droits et recours, strategie de reponse.
                    </p>
                  </div>
                </>
              )}

              {/* QUESTION mode */}
              {mode === 'question' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Votre question fiscale *</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ex: Puis-je deduire les frais de repas en micro-entreprise ?"
                      rows={4}
                      className={inputStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Contexte (optionnel)</label>
                    <textarea
                      value={contexte}
                      onChange={(e) => setContexte(e.target.value)}
                      placeholder="Ex: Je suis auto-entrepreneur en prestation de services informatiques depuis 2024..."
                      rows={3}
                      className={inputStyles}
                    />
                    <p className="text-xs text-text-muted mt-1.5">
                      Plus vous donnez de contexte, plus la reponse sera precise
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-text-secondary">
                      Posez n&apos;importe quelle question fiscale : deductions, obligations, regimes, TVA, impots... L&apos;IA vous repond avec les references legales.
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {getSubmitLabel()}
            </button>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && processing && (
          <div className="space-y-4 bg-surface rounded-xl border border-border p-8 text-center">
            <CatLoadingAnimation label={processingLabel} />
            <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-text-muted">
              L&apos;analyse fiscale peut prendre jusqu&apos;a une minute...
            </p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Analyse terminee</h2>
              <p className="text-text-secondary text-sm">
                {mode === 'calendrier' && 'Votre calendrier fiscal est pret'}
                {mode === 'declaration' && 'Votre aide a la declaration est prete'}
                {mode === 'controle' && 'Votre preparation au controle est prete'}
                {mode === 'question' && 'Votre reponse fiscale est prete'}
              </p>
            </div>

            <AssistantFiscalResults data={result} mode={mode} />

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Nouvelle analyse
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
