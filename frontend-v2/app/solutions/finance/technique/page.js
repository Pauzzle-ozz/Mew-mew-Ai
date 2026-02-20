'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import TechniqueResults from '@/components/finance/TechniqueResults'

import { analyseTechnique } from '@/lib/api/fiscaliteApi'

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

const PERIODE_OPTIONS = [
  { value: '1m', label: '1 mois' },
  { value: '3m', label: '3 mois' },
  { value: '6m', label: '6 mois' },
  { value: '1y', label: '1 an' },
  { value: '5y', label: '5 ans' }
]

export default function TechniquePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [actif, setActif] = useState('')
  const [typeActif, setTypeActif] = useState('action')
  const [periode, setPeriode] = useState('6m')
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
    const trimmedActif = actif.trim()

    if (!trimmedActif) {
      setError('Entrez le ticker de l\'actif')
      return
    }

    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)

    try {
      const [apiResult] = await Promise.all([
        analyseTechnique(trimmedActif, typeActif, periode),
        _progressAnim([
          ['Recuperation des donnees historiques...', 8, 2000],
          ['Calcul des moyennes mobiles...', 18, 2000],
          ['Calcul RSI et MACD...', 30, 2000],
          ['Analyse des bandes de Bollinger...', 42, 2000],
          ['Analyse des patterns...', 55, 2500],
          ['Detection supports et resistances...', 68, 2000],
          ['Analyse des volumes...', 78, 1500],
          ['Analyse IA en cours...', 88, 2500],
          ['Generation des signaux...', 95, 1500],
          ['Finalisation de l\'analyse...', 98, 1000]
        ])
      ])

      setResult(apiResult)
      setProgress(100)
      setProcessingLabel('Analyse terminee !')
      await new Promise(r => setTimeout(r, 500))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'analyse technique')
      setStep(1)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setActif('')
    setTypeActif('action')
    setPeriode('6m')
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
          { label: 'Analyse Technique' }
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
              <h1 className="text-2xl font-bold text-text-primary mb-2">Analyse Technique</h1>
              <p className="text-text-secondary">Analysez les indicateurs techniques et les tendances d&apos;un actif</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
              {/* Actif input */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Actif (ticker)</label>
                <input
                  value={actif}
                  onChange={(e) => setActif(e.target.value)}
                  placeholder="AAPL, BTC-USD, MSFT..."
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

              {/* Periode */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Periode</label>
                <div className="flex gap-2">
                  {PERIODE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setPeriode(opt.value)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        periode === opt.value
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
                  L&apos;analyse technique etudie les donnees historiques de prix et de volume pour identifier les tendances, calculer les indicateurs (RSI, MACD, moyennes mobiles, Bollinger) et detecter les niveaux de support et resistance.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!actif.trim()}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Lancer l&apos;analyse technique
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
              L&apos;analyse peut prendre jusqu&apos;a une minute selon la periode selectionnee...
            </p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Analyse terminee</h2>
              <p className="text-text-secondary text-sm">
                Analyse technique de {actif.toUpperCase()} sur {PERIODE_OPTIONS.find(p => p.value === periode)?.label || periode}
              </p>
            </div>

            <TechniqueResults data={result} />

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
