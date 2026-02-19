'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import ChannelSelector from '@/components/marketing/ChannelSelector'
import CalendarView from '@/components/marketing/CalendarView'

import { generateStrategy } from '@/lib/api/marketingApi'

const STEPS = [
  { n: 1, label: 'Configuration' },
  { n: 2, label: 'Generation' },
  { n: 3, label: 'Calendrier' }
]

const OBJECTIVE_OPTIONS = [
  'Notoriete de marque',
  'Generation de leads',
  'Engagement communaute',
  'Trafic site web',
  'Conversion / ventes',
  'Fidelisation clients'
]

export default function StrategiePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    sector: '',
    targetAudience: '',
    objectives: '',
    brandVoice: '',
    competitors: '',
    currentFrequency: ''
  })
  const [channels, setChannels] = useState([])
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!formData.sector.trim()) return 'Le secteur est requis'
    if (!formData.targetAudience.trim()) return 'L\'audience cible est requise'
    if (!formData.objectives.trim()) return 'Les objectifs sont requis'
    if (channels.length === 0) return 'Selectionnez au moins un canal'
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
        generateStrategy({ ...formData, channels }),
        _progressAnim([
          ['Analyse du secteur...', 10, 1000],
          ['Etude des tendances...', 25, 1500],
          ['Planification des themes...', 45, 2000],
          ['Repartition par canal...', 65, 2000],
          ['Optimisation des horaires...', 80, 1500],
          ['Construction du calendrier...', 92, 1000],
          ['Finalisation...', 98, 800]
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
    setChannels([])
    setFormData({ sector: '', targetAudience: '', objectives: '', brandVoice: '', competitors: '', currentFrequency: '' })
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
          { label: 'Strategie de Contenu' }
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

        {/* Step 1: Configuration */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Strategie de Contenu</h1>
              <p className="text-text-secondary">Generez un calendrier editorial sur 30 jours</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
              <h2 className="text-lg font-semibold text-text-primary">Configuration</h2>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Secteur d&apos;activite *</label>
                <input
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  placeholder="Ex: Mode feminine, SaaS B2B, Restaurant gastronomique..."
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Audience cible *</label>
                <input
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="Ex: Entrepreneurs tech 30-45 ans, PME francaises..."
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Objectifs *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {OBJECTIVE_OPTIONS.map(obj => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => {
                        const current = formData.objectives
                        if (current.includes(obj)) {
                          setFormData({ ...formData, objectives: current.replace(obj, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim() })
                        } else {
                          setFormData({ ...formData, objectives: current ? `${current}, ${obj}` : obj })
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        formData.objectives.includes(obj)
                          ? 'bg-primary text-white'
                          : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
                <input
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  placeholder="Ou saisissez vos objectifs manuellement..."
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Ton de marque (optionnel)</label>
                <input
                  name="brandVoice"
                  value={formData.brandVoice}
                  onChange={handleChange}
                  placeholder="Ex: Professionnel mais accessible, avec une touche d'humour"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Concurrents principaux (optionnel)</label>
                <input
                  name="competitors"
                  value={formData.competitors}
                  onChange={handleChange}
                  placeholder="Ex: Nike, Adidas, New Balance"
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
              <ChannelSelector selected={channels} onChange={setChannels} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.sector || !formData.targetAudience || !formData.objectives || channels.length === 0}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Generer la strategie ({channels.length} canal{channels.length > 1 ? 'aux' : ''})
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
            <p className="text-xs text-text-muted">La generation d&apos;un calendrier 30 jours prend un peu plus de temps...</p>
          </div>
        )}

        {/* Step 3: Calendar */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Votre calendrier editorial</h2>
              <p className="text-text-secondary text-sm">30 jours de contenu planifie pour {channels.length} canal{channels.length > 1 ? 'aux' : ''}</p>
            </div>

            <CalendarView data={result} />

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Nouvelle strategie
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
