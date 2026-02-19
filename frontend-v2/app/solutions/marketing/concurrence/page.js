'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import CompetitorForm from '@/components/marketing/CompetitorForm'
import { CompetitorAnalysis, BenchmarkView } from '@/components/marketing/BenchmarkTable'

import { analyzeCompetitors, generateBenchmark } from '@/lib/api/marketingApi'

const STEPS = [
  { n: 1, label: 'Concurrents' },
  { n: 2, label: 'Analyse' },
  { n: 3, label: 'Resultats' }
]

export default function ConcurrencePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [sector, setSector] = useState('')
  const [competitors, setCompetitors] = useState([{ name: '', url: '' }])
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const [analyses, setAnalyses] = useState(null)
  const [benchmark, setBenchmark] = useState(null)
  const [generatingBenchmark, setGeneratingBenchmark] = useState(false)

  const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

  // Helpers
  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label)
      setProgress(pct)
      await new Promise(r => setTimeout(r, ms))
    }
  }

  const validate = () => {
    if (!sector.trim()) return 'Le secteur est requis'
    const validCompetitors = competitors.filter(c => c.name.trim())
    if (validCompetitors.length === 0) return 'Ajoutez au moins un concurrent avec un nom'
    return null
  }

  // Analyze competitors
  const handleAnalyze = async () => {
    const err = validate()
    if (err) { setError(err); return }

    const validCompetitors = competitors.filter(c => c.name.trim())

    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)

    try {
      const progressSteps = [
        ['Preparation de l\'analyse...', 10, 800],
        ...validCompetitors.map((c, i) => [
          `Analyse de ${c.name}...`,
          10 + ((i + 1) / validCompetitors.length) * 70,
          c.url ? 3000 : 1500
        ]),
        ['Compilation des resultats...', 90, 1000],
        ['Finalisation...', 98, 500]
      ]

      const [result] = await Promise.all([
        analyzeCompetitors(validCompetitors, sector),
        _progressAnim(progressSteps)
      ])

      setAnalyses(result.analyses)
      setProgress(100)
      await new Promise(r => setTimeout(r, 300))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'analyse')
      setStep(1)
    } finally {
      setProcessing(false)
    }
  }

  // Generate benchmark (requires 2+ analyses)
  const handleBenchmark = async () => {
    if (!analyses || analyses.length < 2) return

    setGeneratingBenchmark(true)
    setError('')

    try {
      const result = await generateBenchmark(analyses, sector)
      setBenchmark(result)
    } catch (err) {
      setError(err.message || 'Erreur lors de la generation du benchmark')
    } finally {
      setGeneratingBenchmark(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setAnalyses(null)
    setBenchmark(null)
    setError('')
    setCompetitors([{ name: '', url: '' }])
    setSector('')
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
          { label: 'Marketing', href: '/dashboard?tab=marketing' },
          { label: 'Analyseur Concurrence' }
        ]}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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

        {/* Step 1: Competitors Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Analyseur de Concurrence</h1>
              <p className="text-text-secondary">Decryptez la strategie de communication de vos concurrents</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Secteur d&apos;activite *</label>
                <input
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Ex: Mode feminine, SaaS B2B, Restauration rapide..."
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
              <CompetitorForm competitors={competitors} onChange={setCompetitors} />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!sector.trim() || !competitors.some(c => c.name.trim())}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Analyser {competitors.filter(c => c.name.trim()).length} concurrent{competitors.filter(c => c.name.trim()).length > 1 ? 's' : ''}
            </button>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && processing && (
          <div className="space-y-4 bg-surface rounded-xl border border-border p-8 text-center">
            <CatLoadingAnimation label={processingLabel} />
            <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-text-muted">L&apos;analyse avec scraping peut prendre un moment...</p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && analyses && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Analyse concurrentielle</h2>
              <p className="text-text-secondary text-sm">{analyses.length} concurrent{analyses.length > 1 ? 's' : ''} analyse{analyses.length > 1 ? 's' : ''} dans le secteur : {sector}</p>
            </div>

            {/* Individual analyses */}
            <div className="space-y-3">
              {analyses.map((a, i) => (
                <CompetitorAnalysis key={i} analysis={a} />
              ))}
            </div>

            {/* Benchmark button */}
            {analyses.length >= 2 && !benchmark && (
              <div className="text-center pt-2">
                <button
                  onClick={handleBenchmark}
                  disabled={generatingBenchmark}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {generatingBenchmark ? 'Generation en cours...' : 'Generer le benchmark comparatif'}
                </button>
              </div>
            )}

            {/* Benchmark results */}
            {benchmark && (
              <>
                <div className="border-t border-border pt-6">
                  <h3 className="text-xl font-bold text-text-primary mb-4 text-center">Benchmark comparatif</h3>
                  <BenchmarkView data={benchmark} />
                </div>
              </>
            )}

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
