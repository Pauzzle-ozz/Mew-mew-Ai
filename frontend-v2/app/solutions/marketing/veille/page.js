'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import SectorInput from '@/components/marketing/SectorInput'
import { SourcesList, DeepAnalysisResults } from '@/components/marketing/VeilleResults'

import { identifySources, deepAnalyze } from '@/lib/api/marketingApi'

const STEPS = [
  { n: 1, label: 'Secteur' },
  { n: 2, label: 'Sources' },
  { n: 3, label: 'Tendances' }
]

export default function VeillePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [sectorData, setSectorData] = useState({ sector: '', country: 'France', keywords: '' })
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const [sourcesResult, setSourcesResult] = useState(null)
  const [deepResult, setDeepResult] = useState(null)
  const [analyzingDeep, setAnalyzingDeep] = useState(false)

  // Helpers
  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label)
      setProgress(pct)
      await new Promise(r => setTimeout(r, ms))
    }
  }

  // Step 1 → 2 : identifier les sources
  const handleIdentifySources = async () => {
    if (!sectorData.sector || !sectorData.country) {
      setError('Le secteur et le pays sont requis')
      return
    }

    setError('')
    setProcessing(true)
    setProgress(0)

    try {
      const [result] = await Promise.all([
        identifySources(sectorData.sector, sectorData.country, sectorData.keywords),
        _progressAnim([
          ['Analyse du secteur...', 20, 1000],
          ['Recherche des medias...', 50, 1500],
          ['Evaluation des sources...', 80, 1200],
          ['Finalisation...', 95, 600]
        ])
      ])

      setSourcesResult(result)
      setProgress(100)
      await new Promise(r => setTimeout(r, 300))
      setStep(2)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'identification des sources')
    } finally {
      setProcessing(false)
    }
  }

  // Step 2 → 3 : analyse approfondie
  const handleDeepAnalyze = async () => {
    if (!sourcesResult?.sources) return

    setAnalyzingDeep(true)
    setError('')
    setProcessing(true)
    setProgress(0)

    try {
      const sourcesWithUrl = sourcesResult.sources.filter(s => s.url)
      const [result] = await Promise.all([
        deepAnalyze(sectorData.sector, sourcesWithUrl),
        _progressAnim([
          ['Scraping des sources...', 15, 2000],
          ['Lecture des articles...', 35, 3000],
          ['Extraction des tendances...', 60, 2500],
          ['Identification des signaux faibles...', 80, 2000],
          ['Generation des idees...', 92, 1500],
          ['Finalisation...', 98, 500]
        ])
      ])

      setDeepResult(result)
      setProgress(100)
      await new Promise(r => setTimeout(r, 300))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'analyse approfondie')
    } finally {
      setProcessing(false)
      setAnalyzingDeep(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setSourcesResult(null)
    setDeepResult(null)
    setError('')
    setSectorData({ sector: '', country: 'France', keywords: '' })
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
          { label: 'Veille Sectorielle' }
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

        {/* Step 1: Sector Input */}
        {step === 1 && !processing && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Veille Sectorielle IA</h1>
              <p className="text-text-secondary">Identifiez les sources media et tendances de votre secteur</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Definissez votre veille</h2>
              <SectorInput
                sector={sectorData.sector}
                country={sectorData.country}
                keywords={sectorData.keywords}
                onChange={setSectorData}
              />
            </div>

            <button
              onClick={handleIdentifySources}
              disabled={!sectorData.sector || !sectorData.country}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Identifier les sources media
            </button>
          </div>
        )}

        {/* Processing */}
        {processing && (
          <div className="space-y-4 bg-surface rounded-xl border border-border p-8 text-center">
            <CatLoadingAnimation label={processingLabel} />
            <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-text-muted">
              {step <= 2 ? 'Identification des sources en cours...' : 'Analyse approfondie en cours (scraping + IA)...'}
            </p>
          </div>
        )}

        {/* Step 2: Sources List */}
        {step === 2 && !processing && sourcesResult && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Sources identifiees</h2>
              <p className="text-text-secondary text-sm">Secteur : {sectorData.sector} / {sectorData.country}</p>
            </div>

            <SourcesList
              data={sourcesResult}
              onDeepAnalyze={handleDeepAnalyze}
              analyzing={analyzingDeep}
            />

            <div className="text-center pt-2">
              <button onClick={handleReset} className="text-sm text-text-muted hover:text-text-secondary cursor-pointer">
                Nouvelle recherche
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Deep Analysis */}
        {step === 3 && !processing && deepResult && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Analyse approfondie</h2>
              <p className="text-text-secondary text-sm">Tendances et idees de contenu pour : {sectorData.sector}</p>
            </div>

            <DeepAnalysisResults data={deepResult} />

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={() => { setStep(2); setDeepResult(null) }}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Retour aux sources
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Nouvelle veille
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
