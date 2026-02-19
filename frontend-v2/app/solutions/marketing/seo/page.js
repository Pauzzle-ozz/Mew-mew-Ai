'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import SeoResults from '@/components/marketing/SeoResults'

import { auditSeo } from '@/lib/api/marketingApi'

const STEPS = [
  { n: 1, label: 'Configuration' },
  { n: 2, label: 'Analyse' },
  { n: 3, label: 'Resultats' }
]

const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

export default function SeoPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [url, setUrl] = useState('')
  const [maxPages, setMaxPages] = useState(10)
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

  const isValidUrl = (str) => {
    try {
      const parsed = new URL(str)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setError('Entrez l\'URL de votre site')
      return
    }

    // Ajouter https:// si pas de protocole
    let finalUrl = trimmedUrl
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl
    }

    if (!isValidUrl(finalUrl)) {
      setError('URL invalide. Format attendu : https://example.com')
      return
    }

    setUrl(finalUrl)
    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)

    try {
      const [apiResult] = await Promise.all([
        auditSeo(finalUrl, maxPages),
        _progressAnim([
          ['Connexion au site...', 5, 1500],
          ['Crawl de la page d\'accueil...', 12, 2000],
          ['Decouverte des pages internes...', 22, 2500],
          ['Extraction des donnees SEO...', 38, 3000],
          ['Analyse des balises meta...', 50, 2000],
          ['Verification des headings...', 60, 1500],
          ['Audit des images et liens...', 72, 2000],
          ['Analyse IA en cours...', 85, 3000],
          ['Generation des recommandations...', 93, 2000],
          ['Finalisation de l\'audit...', 98, 1000]
        ])
      ])

      setResult(apiResult)
      setProgress(100)
      setProcessingLabel('Audit termine !')
      await new Promise(r => setTimeout(r, 500))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'audit SEO')
      setStep(1)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setUrl('')
    setMaxPages(10)
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
          { label: 'Audit SEO' }
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
              <h1 className="text-2xl font-bold text-text-primary mb-2">Audit SEO</h1>
              <p className="text-text-secondary">Analysez le SEO de votre site et obtenez des recommandations IA</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
              {/* URL input */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">URL du site</label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={inputStyles}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                />
                <p className="text-xs text-text-muted mt-1.5">
                  Entrez l&apos;URL de la page d&apos;accueil de votre site
                </p>
              </div>

              {/* Max pages slider */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Nombre de pages a analyser : <span className="text-primary font-bold">{maxPages}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxPages}
                  onChange={(e) => setMaxPages(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>1 page (rapide)</span>
                  <span>10 pages (complet)</span>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-text-secondary">
                  L&apos;audit va crawler votre site, extraire les donnees SEO de chaque page (balises, meta, headings, images, liens...) puis analyser le tout avec l&apos;IA pour vous donner un score global et des recommandations concretes.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!url.trim()}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Lancer l&apos;audit SEO
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
              Le crawl et l&apos;analyse peuvent prendre jusqu&apos;a une minute selon la taille du site...
            </p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Audit termine</h2>
              <p className="text-text-secondary text-sm">
                {result.crawledPages} page{result.crawledPages > 1 ? 's' : ''} analysee{result.crawledPages > 1 ? 's' : ''} sur {result.siteUrl}
              </p>
            </div>

            <SeoResults data={result} />

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
