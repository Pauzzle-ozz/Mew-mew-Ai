'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import TradingDashboard from '@/components/finance/TradingDashboard'

import { analyseTrading, analysePortefeuille } from '@/lib/api/fiscaliteApi'

const STEPS = [
  { n: 1, label: 'Configuration' },
  { n: 2, label: 'Analyse' },
  { n: 3, label: 'Resultats' }
]

const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

const TYPE_ACTIF_OPTIONS = [
  { value: 'action', label: 'Action' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'etf', label: 'ETF' }
]

const RISQUE_OPTIONS = [
  { value: 'conservateur', label: 'Conservateur' },
  { value: 'modere', label: 'Modere' },
  { value: 'agressif', label: 'Agressif' }
]

const HORIZON_OPTIONS = [
  { value: 'court', label: 'Court terme' },
  { value: 'moyen', label: 'Moyen terme' },
  { value: 'long', label: 'Long terme' }
]

const MODES = [
  { value: 'analyser', label: 'Analyser un actif' },
  { value: 'portefeuille', label: 'Analyser mon portefeuille' }
]

const EMPTY_POSITION = { actif: '', type: 'action', quantite: '', prix_achat: '' }

export default function TradingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [selectedMode, setSelectedMode] = useState('analyser')
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Analyser mode state
  const [actif, setActif] = useState('')
  const [typeActif, setTypeActif] = useState('action')
  const [capitalDisponible, setCapitalDisponible] = useState('')
  const [toleranceRisque, setToleranceRisque] = useState('modere')
  const [horizon, setHorizon] = useState('moyen')

  // Portefeuille mode state
  const [capitalTotal, setCapitalTotal] = useState('')
  const [objectif, setObjectif] = useState('')
  const [positions, setPositions] = useState([{ ...EMPTY_POSITION }])

  // Helpers
  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label)
      setProgress(pct)
      await new Promise(r => setTimeout(r, ms))
    }
  }

  const addPosition = () => {
    setPositions([...positions, { ...EMPTY_POSITION }])
  }

  const removePosition = (index) => {
    if (positions.length <= 1) return
    setPositions(positions.filter((_, i) => i !== index))
  }

  const updatePosition = (index, field, value) => {
    const updated = [...positions]
    updated[index] = { ...updated[index], [field]: value }
    setPositions(updated)
  }

  const handleSubmit = async () => {
    setError('')

    if (selectedMode === 'analyser') {
      const trimmedActif = actif.trim()
      if (!trimmedActif) {
        setError('Entrez le ticker ou le nom de l\'actif')
        return
      }

      setProcessing(true)
      setProgress(0)
      setStep(2)

      try {
        const [apiResult] = await Promise.all([
          analyseTrading({
            actif: trimmedActif,
            type_actif: typeActif,
            capital_disponible: capitalDisponible ? parseFloat(capitalDisponible) : undefined,
            tolerance_risque: toleranceRisque,
            horizon
          }),
          _progressAnim([
            ['Analyse fondamentale en cours...', 8, 2000],
            ['Analyse technique en cours...', 22, 2500],
            ['Croisement des donnees...', 38, 2000],
            ['Calcul du risque...', 52, 2000],
            ['Evaluation du sentiment de marche...', 65, 2000],
            ['Simulation de scenarios...', 78, 2000],
            ['Generation de la recommandation...', 90, 2500],
            ['Finalisation...', 98, 1000]
          ])
        ])

        setResult(apiResult)
        setProgress(100)
        setProcessingLabel('Analyse terminee !')
        await new Promise(r => setTimeout(r, 500))
        setStep(3)
      } catch (err) {
        setError(err.message || 'Erreur lors de l\'analyse trading')
        setStep(1)
      } finally {
        setProcessing(false)
      }
    } else {
      // Portefeuille mode
      const validPositions = positions.filter(p => p.actif.trim())
      if (validPositions.length === 0) {
        setError('Ajoutez au moins une position avec un actif')
        return
      }

      setProcessing(true)
      setProgress(0)
      setStep(2)

      try {
        const [apiResult] = await Promise.all([
          analysePortefeuille({
            positions: validPositions.map(p => ({
              ...p,
              quantite: p.quantite ? parseFloat(p.quantite) : undefined,
              prix_achat: p.prix_achat ? parseFloat(p.prix_achat) : undefined
            })),
            capital_total: capitalTotal ? parseFloat(capitalTotal) : undefined,
            objectif: objectif.trim() || undefined
          }),
          _progressAnim([
            ['Analyse fondamentale en cours...', 8, 2000],
            ['Analyse technique en cours...', 20, 2000],
            ['Croisement des donnees...', 35, 2000],
            ['Calcul du risque...', 48, 2000],
            ['Analyse de la diversification...', 60, 2000],
            ['Evaluation des correlations...', 72, 2000],
            ['Optimisation du portefeuille...', 85, 2500],
            ['Generation de la recommandation...', 95, 2000],
            ['Finalisation...', 98, 1000]
          ])
        ])

        setResult(apiResult)
        setProgress(100)
        setProcessingLabel('Analyse terminee !')
        await new Promise(r => setTimeout(r, 500))
        setStep(3)
      } catch (err) {
        setError(err.message || 'Erreur lors de l\'analyse du portefeuille')
        setStep(1)
      } finally {
        setProcessing(false)
      }
    }
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setActif('')
    setTypeActif('action')
    setCapitalDisponible('')
    setToleranceRisque('modere')
    setHorizon('moyen')
    setCapitalTotal('')
    setObjectif('')
    setPositions([{ ...EMPTY_POSITION }])
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
          { label: 'Finance', href: '/dashboard?tab=finance' },
          { label: 'Bot Trading' }
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
              <h1 className="text-2xl font-bold text-text-primary mb-2">Bot Trading</h1>
              <p className="text-text-secondary">Obtenez des recommandations de trading basees sur l&apos;IA</p>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-1 bg-surface-elevated rounded-xl p-1">
              {MODES.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => setSelectedMode(mode.value)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    selectedMode === mode.value
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Analyser mode */}
            {selectedMode === 'analyser' && (
              <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
                {/* Actif input */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Actif</label>
                  <input
                    value={actif}
                    onChange={(e) => setActif(e.target.value)}
                    placeholder="AAPL, BTC-USD..."
                    className={inputStyles}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                  />
                </div>

                {/* Type d'actif */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Type d&apos;actif</label>
                  <div className="flex gap-2">
                    {TYPE_ACTIF_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setTypeActif(opt.value)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          typeActif === opt.value
                            ? 'bg-primary text-white'
                            : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:border-primary border border-border'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capital disponible */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Capital disponible (EUR)</label>
                  <input
                    type="number"
                    value={capitalDisponible}
                    onChange={(e) => setCapitalDisponible(e.target.value)}
                    placeholder="10000"
                    className={inputStyles}
                    min="0"
                  />
                </div>

                {/* Tolerance au risque */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Tolerance au risque</label>
                  <div className="flex gap-2">
                    {RISQUE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setToleranceRisque(opt.value)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          toleranceRisque === opt.value
                            ? 'bg-primary text-white'
                            : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:border-primary border border-border'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horizon */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Horizon</label>
                  <div className="flex gap-2">
                    {HORIZON_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setHorizon(opt.value)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          horizon === opt.value
                            ? 'bg-primary text-white'
                            : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:border-primary border border-border'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-text-secondary">
                    Le bot combine analyse fondamentale et technique pour generer une recommandation d&apos;achat, vente ou attente, avec un niveau de confiance et des points d&apos;entree/sortie.
                  </p>
                </div>
              </div>
            )}

            {/* Portefeuille mode */}
            {selectedMode === 'portefeuille' && (
              <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
                {/* Capital total */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Capital total (EUR)</label>
                  <input
                    type="number"
                    value={capitalTotal}
                    onChange={(e) => setCapitalTotal(e.target.value)}
                    placeholder="50000"
                    className={inputStyles}
                    min="0"
                  />
                </div>

                {/* Objectif */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Objectif</label>
                  <input
                    value={objectif}
                    onChange={(e) => setObjectif(e.target.value)}
                    placeholder="Croissance long terme, revenus passifs, preservation du capital..."
                    className={inputStyles}
                  />
                </div>

                {/* Positions */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">Positions</label>
                  <div className="space-y-3">
                    {positions.map((pos, index) => (
                      <div key={index} className="bg-surface-elevated rounded-lg border border-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-text-muted">Position {index + 1}</span>
                          {positions.length > 1 && (
                            <button
                              onClick={() => removePosition(index)}
                              className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-text-muted mb-1">Actif</label>
                            <input
                              value={pos.actif}
                              onChange={(e) => updatePosition(index, 'actif', e.target.value)}
                              placeholder="AAPL, BTC-USD..."
                              className={inputStyles}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-text-muted mb-1">Type</label>
                            <select
                              value={pos.type}
                              onChange={(e) => updatePosition(index, 'type', e.target.value)}
                              className={inputStyles}
                            >
                              <option value="action">Action</option>
                              <option value="crypto">Crypto</option>
                              <option value="etf">ETF</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-text-muted mb-1">Quantite</label>
                            <input
                              type="number"
                              value={pos.quantite}
                              onChange={(e) => updatePosition(index, 'quantite', e.target.value)}
                              placeholder="10"
                              className={inputStyles}
                              min="0"
                              step="any"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-text-muted mb-1">Prix d&apos;achat (EUR)</label>
                            <input
                              type="number"
                              value={pos.prix_achat}
                              onChange={(e) => updatePosition(index, 'prix_achat', e.target.value)}
                              placeholder="150.00"
                              className={inputStyles}
                              min="0"
                              step="any"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addPosition}
                    className="mt-3 w-full py-2.5 border border-dashed border-border rounded-lg text-sm text-text-secondary hover:text-primary hover:border-primary transition-colors cursor-pointer"
                  >
                    + Ajouter une position
                  </button>
                </div>

                {/* Info box */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-text-secondary">
                    L&apos;analyse de portefeuille evalue la diversification, les correlations entre vos actifs, le risque global et genere des recommandations de reequilibrage.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={selectedMode === 'analyser' ? !actif.trim() : positions.every(p => !p.actif.trim())}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {selectedMode === 'analyser' ? 'Lancer l\'analyse trading' : 'Analyser mon portefeuille'}
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
              L&apos;analyse peut prendre jusqu&apos;a une minute...
            </p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Analyse terminee</h2>
              <p className="text-text-secondary text-sm">
                {selectedMode === 'analyser'
                  ? `Recommandation trading pour ${actif.toUpperCase()}`
                  : `Analyse de votre portefeuille (${positions.filter(p => p.actif.trim()).length} position${positions.filter(p => p.actif.trim()).length > 1 ? 's' : ''})`
                }
              </p>
            </div>

            <TradingDashboard data={result} mode={selectedMode === 'portefeuille' ? 'portefeuille' : undefined} />

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
