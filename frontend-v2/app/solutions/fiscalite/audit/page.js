'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import AuditFiscalResults from '@/components/fiscalite/AuditFiscalResults'

import { auditFiscal } from '@/lib/api/fiscaliteApi'

const STEPS = [
  { n: 1, label: 'Configuration' },
  { n: 2, label: 'Analyse' },
  { n: 3, label: 'Resultats' }
]

const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

const PROFIL_TYPES = [
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'independant', label: 'Independant' },
  { value: 'particulier', label: 'Particulier' }
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

export default function AuditFiscalPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [typeProfil, setTypeProfil] = useState('')
  const [statutJuridique, setStatutJuridique] = useState('')
  const [regimeTva, setRegimeTva] = useState('')
  const [chiffreAffaires, setChiffreAffaires] = useState('')
  const [charges, setCharges] = useState('')
  const [secteur, setSecteur] = useState('')
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Helpers
  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label)
      setProgress(pct)
      await new Promise(r => setTimeout(r, ms))
    }
  }

  const handleSubmit = async () => {
    if (!typeProfil) {
      setError('Selectionnez votre type de profil')
      return
    }

    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)

    const data = {
      type_profil: typeProfil,
      statut_juridique: statutJuridique,
      regime_tva: regimeTva,
      chiffre_affaires: chiffreAffaires ? Number(chiffreAffaires) : undefined,
      charges: charges ? Number(charges) : undefined,
      secteur: secteur.trim() || undefined
    }

    try {
      const [apiResult] = await Promise.all([
        auditFiscal(data, file),
        _progressAnim([
          ['Analyse du profil fiscal...', 5, 1500],
          ['Verification du statut juridique...', 12, 2000],
          ['Calcul des obligations declaratives...', 22, 2500],
          ['Analyse du regime TVA...', 35, 2000],
          ['Evaluation des charges deductibles...', 48, 2500],
          ['Verification de la conformite fiscale...', 60, 2000],
          ['Identification des optimisations...', 72, 2500],
          ['Analyse IA en cours...', 85, 3000],
          ['Generation des recommandations...', 93, 2000],
          ['Finalisation de l&apos;audit...', 98, 1000]
        ])
      ])

      setResult(apiResult)
      setProgress(100)
      setProcessingLabel('Audit termine !')
      await new Promise(r => setTimeout(r, 500))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'audit fiscal')
      setStep(1)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setTypeProfil('')
    setStatutJuridique('')
    setRegimeTva('')
    setChiffreAffaires('')
    setCharges('')
    setSecteur('')
    setFile(null)
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
          { label: 'Audit Fiscal' }
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
              <h1 className="text-2xl font-bold text-text-primary mb-2">Audit Fiscal</h1>
              <p className="text-text-secondary">Analysez votre situation fiscale et obtenez des recommandations IA personnalisees</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
              {/* Type de profil */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Type de profil *</label>
                <div className="grid grid-cols-3 gap-3">
                  {PROFIL_TYPES.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setTypeProfil(p.value)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                        typeProfil === p.value
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-elevated text-text-secondary border-border hover:border-primary hover:text-primary'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statut juridique */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Statut juridique</label>
                <select
                  value={statutJuridique}
                  onChange={(e) => setStatutJuridique(e.target.value)}
                  className={inputStyles}
                >
                  {STATUTS_JURIDIQUES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Regime TVA */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Regime TVA</label>
                <select
                  value={regimeTva}
                  onChange={(e) => setRegimeTva(e.target.value)}
                  className={inputStyles}
                >
                  {REGIMES_TVA.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Chiffre d'affaires */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Chiffre d&apos;affaires annuel (EUR)</label>
                <input
                  type="number"
                  value={chiffreAffaires}
                  onChange={(e) => setChiffreAffaires(e.target.value)}
                  placeholder="Ex: 85000"
                  className={inputStyles}
                />
              </div>

              {/* Charges */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Charges annuelles (EUR)</label>
                <input
                  type="number"
                  value={charges}
                  onChange={(e) => setCharges(e.target.value)}
                  placeholder="Ex: 25000"
                  className={inputStyles}
                />
              </div>

              {/* Secteur */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Secteur d&apos;activite</label>
                <input
                  value={secteur}
                  onChange={(e) => setSecteur(e.target.value)}
                  placeholder="Ex: Conseil en informatique"
                  className={inputStyles}
                />
              </div>

              {/* Upload document */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Document comptable (optionnel)</label>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className={inputStyles}
                />
                <p className="text-xs text-text-muted mt-1.5">
                  Formats acceptes : PDF, Excel, CSV
                </p>
              </div>

              {/* Info box */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-text-secondary">
                  L&apos;audit fiscal analyse votre situation actuelle, verifie votre conformite et identifie les optimisations possibles. Un document comptable permet une analyse plus precise.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!typeProfil}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Lancer l&apos;audit fiscal
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
              <h2 className="text-2xl font-bold text-text-primary mb-1">Audit termine</h2>
              <p className="text-text-secondary text-sm">
                Votre audit fiscal est pret avec des recommandations personnalisees
              </p>
            </div>

            <AuditFiscalResults data={result} />

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Nouvel audit
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
