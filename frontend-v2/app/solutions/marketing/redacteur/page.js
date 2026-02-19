'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import PlatformSelector from '@/components/marketing/PlatformSelector'
import ContentResults from '@/components/marketing/ContentResults'

import { generateContent } from '@/lib/api/marketingApi'

const STEPS = [
  { n: 1, label: 'Brief' },
  { n: 2, label: 'Generation' },
  { n: 3, label: 'Resultats' }
]

const TONE_OPTIONS = [
  'Professionnel',
  'Decontracte',
  'Inspirant',
  'Humoristique',
  'Educatif',
  'Provocateur',
  'Empathique'
]

export default function RedacteurPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [brief, setBrief] = useState({
    subject: '',
    tone: 'Professionnel',
    targetAudience: '',
    objective: '',
    keywords: '',
    context: ''
  })
  const [platforms, setPlatforms] = useState([])
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

  const handleChange = (e) => {
    setBrief({ ...brief, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!brief.subject.trim()) return 'Le sujet est requis'
    if (!brief.targetAudience.trim()) return 'L\'audience cible est requise'
    if (!brief.objective.trim()) return 'L\'objectif est requis'
    if (platforms.length === 0) return 'Selectionnez au moins une plateforme'
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }

    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)

    try {
      const [apiResult] = await Promise.all([
        generateContent(brief, platforms),
        _progressAnim([
          ['Analyse du brief...', 15, 800],
          ['Adaptation du ton et du style...', 35, 1200],
          ['Generation du contenu...', 60, 2000],
          ['Optimisation par plateforme...', 85, 1500],
          ['Finalisation...', 95, 800]
        ])
      ])

      setResult(apiResult)
      setProgress(100)
      setProcessingLabel('Termine !')
      await new Promise(r => setTimeout(r, 500))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors de la generation')
      setStep(1)
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setPlatforms([])
    setBrief({ subject: '', tone: 'Professionnel', targetAudience: '', objective: '', keywords: '', context: '' })
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Logo size="md" link={false} />
        <p className="text-text-muted">Chargement...</p>
      </div>
    )
  }

  const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Marketing', href: '/dashboard?tab=marketing' },
          { label: 'Redacteur Multi-Format' }
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

        {/* Step 1: Brief */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Redacteur Multi-Format</h1>
              <p className="text-text-secondary">Un brief, du contenu adapte a chaque plateforme</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
              <h2 className="text-lg font-semibold text-text-primary">Votre brief</h2>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Sujet *</label>
                <input
                  name="subject"
                  value={brief.subject}
                  onChange={handleChange}
                  placeholder="Ex: Lancement de notre nouvelle gamme de produits bio"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Ton *</label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBrief({ ...brief, tone: t })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        brief.tone === t
                          ? 'bg-primary text-white'
                          : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Audience cible *</label>
                <input
                  name="targetAudience"
                  value={brief.targetAudience}
                  onChange={handleChange}
                  placeholder="Ex: Femmes 25-45 ans, sensibles a l'ecologie"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Objectif *</label>
                <input
                  name="objective"
                  value={brief.objective}
                  onChange={handleChange}
                  placeholder="Ex: Generer du trafic vers notre site et des preinscriptions"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Mots-cles (optionnel)</label>
                <input
                  name="keywords"
                  value={brief.keywords}
                  onChange={handleChange}
                  placeholder="Ex: bio, naturel, zero dechet, sante"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Contexte additionnel (optionnel)</label>
                <textarea
                  name="context"
                  value={brief.context}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ex: Nous sommes une startup francaise, lancement prevu en mars..."
                  className={inputStyles + ' resize-none'}
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
              <PlatformSelector selected={platforms} onChange={setPlatforms} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!brief.subject || !brief.targetAudience || !brief.objective || platforms.length === 0}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Generer le contenu ({platforms.length} plateforme{platforms.length > 1 ? 's' : ''})
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
            <p className="text-xs text-text-muted">Generation en cours pour {platforms.length} plateforme{platforms.length > 1 ? 's' : ''}...</p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Contenu genere !</h2>
              <p className="text-text-secondary text-sm">Copiez et publiez directement sur vos plateformes</p>
            </div>

            <ContentResults data={result} />

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Nouveau brief
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
