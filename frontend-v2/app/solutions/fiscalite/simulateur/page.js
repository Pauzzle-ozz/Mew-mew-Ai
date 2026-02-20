'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import SimulateurResults from '@/components/fiscalite/SimulateurResults'

import { simulerStrategie } from '@/lib/api/fiscaliteApi'

const STEPS = [
  { n: 1, label: 'Configuration' },
  { n: 2, label: 'Analyse' },
  { n: 3, label: 'Resultats' }
]

const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

const STATUTS_JURIDIQUES = [
  { value: '', label: 'Selectionner un statut' },
  { value: 'micro', label: 'Micro-entreprise' },
  { value: 'ei', label: 'Entreprise Individuelle (EI)' },
  { value: 'eurl', label: 'EURL' },
  { value: 'sasu', label: 'SASU' },
  { value: 'sarl', label: 'SARL' },
  { value: 'sas', label: 'SAS' }
]

const OBJECTIFS = [
  { value: 'croissance', label: 'Croissance' },
  { value: 'optimisation_remuneration', label: 'Optimisation remuneration' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'levee_fonds', label: 'Levee de fonds' },
  { value: 'international', label: 'International' }
]

export default function SimulateurStrategiePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [statutJuridique, setStatutJuridique] = useState('')
  const [chiffreAffaires, setChiffreAffaires] = useState('')
  const [charges, setCharges] = useState('')
  const [remunerationDirigeant, setRemunerationDirigeant] = useState('')
  const [nombreSalaries, setNombreSalaries] = useState('')
  const [secteur, setSecteur] = useState('')
  const [objectifs, setObjectifs] = useState([])
  const [caCible3ans, setCaCible3ans] = useState('')
  const [caCible5ans, setCaCible5ans] = useState('')
  const [embauchesPrevues, setEmbauchesPrevues] = useState('')
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

  const toggleObjectif = (obj) => {
    setObjectifs(prev =>
      prev.includes(obj) ? prev.filter(o => o !== obj) : [...prev, obj]
    )
  }

  const handleSubmit = async () => {
    if (!statutJuridique) {
      setError('Selectionnez votre statut juridique actuel')
      return
    }
    if (!chiffreAffaires) {
      setError('Indiquez votre chiffre d\'affaires annuel')
      return
    }

    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)

    const data = {
      situation_actuelle: {
        statut_juridique: statutJuridique,
        chiffre_affaires: Number(chiffreAffaires),
        charges: charges ? Number(charges) : undefined,
        remuneration_dirigeant: remunerationDirigeant ? Number(remunerationDirigeant) : undefined,
        nombre_salaries: nombreSalaries ? Number(nombreSalaries) : undefined,
        secteur: secteur.trim() || undefined
      },
      objectifs: objectifs.length > 0 ? objectifs : undefined,
      projections: {
        ca_cible_3_ans: caCible3ans ? Number(caCible3ans) : undefined,
        ca_cible_5_ans: caCible5ans ? Number(caCible5ans) : undefined,
        embauches_prevues: embauchesPrevues ? Number(embauchesPrevues) : undefined
      }
    }

    try {
      const [apiResult] = await Promise.all([
        simulerStrategie(data, file),
        _progressAnim([
          ['Analyse de la situation actuelle...', 5, 1500],
          ['Evaluation du statut juridique...', 12, 2000],
          ['Calcul de la fiscalite actuelle...', 22, 2500],
          ['Simulation des scenarios alternatifs...', 35, 3000],
          ['Comparaison des regimes fiscaux...', 48, 2500],
          ['Analyse des projections de croissance...', 58, 2000],
          ['Optimisation de la remuneration...', 68, 2500],
          ['Calcul des economies potentielles...', 78, 2000],
          ['Generation IA de la strategie...', 88, 3000],
          ['Finalisation des recommandations...', 95, 2000]
        ])
      ])

      setResult(apiResult)
      setProgress(100)
      setProcessingLabel('Simulation terminee !')
      await new Promise(r => setTimeout(r, 500))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de la simulation')
      setStep(1)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setStatutJuridique('')
    setChiffreAffaires('')
    setCharges('')
    setRemunerationDirigeant('')
    setNombreSalaries('')
    setSecteur('')
    setObjectifs([])
    setCaCible3ans('')
    setCaCible5ans('')
    setEmbauchesPrevues('')
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
          { label: 'Simulateur Strategie' }
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
              <h1 className="text-2xl font-bold text-text-primary mb-2">Simulateur Strategie</h1>
              <p className="text-text-secondary">Simulez differentes strategies fiscales et trouvez la plus avantageuse</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">

              {/* Section: Situation actuelle */}
              <div className="border-b border-border pb-4 mb-2">
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Situation actuelle</h3>
              </div>

              {/* Statut juridique */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Statut juridique actuel *</label>
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

              {/* Chiffre d'affaires */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Chiffre d&apos;affaires annuel (EUR) *</label>
                <input
                  type="number"
                  value={chiffreAffaires}
                  onChange={(e) => setChiffreAffaires(e.target.value)}
                  placeholder="Ex: 120000"
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
                  placeholder="Ex: 35000"
                  className={inputStyles}
                />
              </div>

              {/* Remuneration dirigeant */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Remuneration dirigeant (EUR)</label>
                <input
                  type="number"
                  value={remunerationDirigeant}
                  onChange={(e) => setRemunerationDirigeant(e.target.value)}
                  placeholder="Ex: 48000"
                  className={inputStyles}
                />
              </div>

              {/* Nombre de salaries */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Nombre de salaries</label>
                <input
                  type="number"
                  value={nombreSalaries}
                  onChange={(e) => setNombreSalaries(e.target.value)}
                  placeholder="Ex: 3"
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

              {/* Section: Objectifs */}
              <div className="border-b border-border pb-4 mb-2 pt-4">
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Objectifs strategiques</h3>
              </div>

              {/* Objectifs multi-select */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Objectifs</label>
                <div className="flex gap-2 flex-wrap">
                  {OBJECTIFS.map(obj => (
                    <button
                      key={obj.value}
                      onClick={() => toggleObjectif(obj.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                        objectifs.includes(obj.value)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-elevated text-text-secondary border-border hover:border-primary hover:text-primary'
                      }`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section: Projections */}
              <div className="border-b border-border pb-4 mb-2 pt-4">
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Projections</h3>
              </div>

              {/* CA cible 3 ans */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">CA cible a 3 ans (EUR)</label>
                <input
                  type="number"
                  value={caCible3ans}
                  onChange={(e) => setCaCible3ans(e.target.value)}
                  placeholder="Ex: 250000"
                  className={inputStyles}
                />
              </div>

              {/* CA cible 5 ans */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">CA cible a 5 ans (EUR)</label>
                <input
                  type="number"
                  value={caCible5ans}
                  onChange={(e) => setCaCible5ans(e.target.value)}
                  placeholder="Ex: 500000"
                  className={inputStyles}
                />
              </div>

              {/* Embauches prevues */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Embauches prevues</label>
                <input
                  type="number"
                  value={embauchesPrevues}
                  onChange={(e) => setEmbauchesPrevues(e.target.value)}
                  placeholder="Ex: 5"
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
                  Le simulateur compare votre situation actuelle avec differents scenarios (changement de statut, optimisation de remuneration, etc.) et vous recommande la strategie la plus avantageuse selon vos objectifs.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!statutJuridique || !chiffreAffaires}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Lancer la simulation
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
              La simulation de strategie peut prendre jusqu&apos;a une minute...
            </p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Simulation terminee</h2>
              <p className="text-text-secondary text-sm">
                Votre strategie fiscale optimale est prete avec des recommandations detaillees
              </p>
            </div>

            <SimulateurResults data={result} />

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Nouvelle simulation
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
