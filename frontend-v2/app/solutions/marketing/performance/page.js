'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import MetricsForm from '@/components/marketing/MetricsForm'
import PerformanceResults from '@/components/marketing/PerformanceResults'

import { analyzePerformance } from '@/lib/api/marketingApi'

const STEPS = [
  { n: 1, label: 'Metriques' },
  { n: 2, label: 'Analyse' },
  { n: 3, label: 'Resultats' }
]

function createEmptyEntry() {
  return {
    id: Date.now().toString(),
    platform: '',
    contentType: '',
    mode: 'structured',
    rawStats: '',
    metrics: {}
  }
}

export default function PerformancePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [entries, setEntries] = useState([createEmptyEntry()])
  const [sector, setSector] = useState('')
  const [period, setPeriod] = useState('')
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null) // { [entryId]: { platform, platformLabel, data } }

  // Helpers
  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label)
      setProgress(pct)
      await new Promise(r => setTimeout(r, ms))
    }
  }

  const validate = () => {
    const validEntries = entries.filter(e => e.platform)
    if (validEntries.length === 0) {
      return 'Selectionnez au moins une plateforme'
    }
    for (const entry of validEntries) {
      const hasRawStats = entry.rawStats && entry.rawStats.trim().length > 0
      const hasStructured = Object.values(entry.metrics).some(v => v && String(v).trim().length > 0)
      if (!hasRawStats && !hasStructured) {
        return `Fournissez des metriques pour ${entry.platform} (collez vos stats ou remplissez les champs)`
      }
    }
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }

    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)

    const validEntries = entries.filter(e => e.platform)
    const total = validEntries.length

    try {
      // Build progress animation
      const animSteps = []
      validEntries.forEach((entry, i) => {
        const prefix = total > 1 ? `(${i + 1}/${total}) ` : ''
        animSteps.push([`${prefix}Lecture des metriques ${entry.platform}...`, 10 + (i * 80 / total), 600])
        animSteps.push([`${prefix}Analyse des tendances...`, 10 + ((i + 0.3) * 80 / total), 800])
        animSteps.push([`${prefix}Generation des recommandations...`, 10 + ((i + 0.6) * 80 / total), 1000])
      })
      animSteps.push(['Finalisation...', 95, 500])

      // Run API calls in parallel with animation
      const [apiResults] = await Promise.all([
        Promise.all(validEntries.map(entry => {
          const metricsData = {
            platform: entry.platform,
            contentType: entry.contentType,
            period,
            sector,
            ...(entry.mode === 'raw'
              ? { rawStats: entry.rawStats }
              : entry.metrics
            )
          }
          return analyzePerformance(metricsData).then(data => ({
            entryId: entry.id,
            platform: entry.platform,
            data
          }))
        })),
        _progressAnim(animSteps)
      ])

      // Index results by entry ID
      const resultsMap = {}
      apiResults.forEach(r => {
        resultsMap[r.entryId] = {
          platform: r.platform,
          data: r.data
        }
      })

      setResults(resultsMap)
      setProgress(100)
      setProcessingLabel('Termine !')
      await new Promise(r => setTimeout(r, 500))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'analyse')
      setStep(1)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setResults(null)
    setError('')
    setEntries([createEmptyEntry()])
    setSector('')
    setPeriod('')
  }

  const isSubmitDisabled = () => {
    const validEntries = entries.filter(e => e.platform)
    if (validEntries.length === 0) return true
    return validEntries.some(entry => {
      const hasRawStats = entry.rawStats && entry.rawStats.trim().length > 0
      const hasStructured = Object.values(entry.metrics).some(v => v && String(v).trim().length > 0)
      return !hasRawStats && !hasStructured
    })
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
          { label: 'Analyseur Performance' }
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

        {/* Step 1: Metrics Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Analyseur de Performance</h1>
              <p className="text-text-secondary">Diagnostiquez vos stats et obtenez des recommandations IA</p>
            </div>

            <MetricsForm
              entries={entries}
              onEntriesChange={setEntries}
              sector={sector}
              onSectorChange={setSector}
              period={period}
              onPeriodChange={setPeriod}
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Analyser les performances{entries.filter(e => e.platform).length > 1 ? ` (${entries.filter(e => e.platform).length} plateformes)` : ''}
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
            <p className="text-xs text-text-muted">Analyse en cours de vos metriques...</p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && results && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Analyse terminee</h2>
              <p className="text-text-secondary text-sm">Voici le diagnostic complet de vos performances</p>
            </div>

            <PerformanceResults results={results} />

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
