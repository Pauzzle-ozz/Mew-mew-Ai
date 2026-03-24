'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import Button from '@/components/shared/Button'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import ChannelSelector from '@/components/marketing/ChannelSelector'
import CalendarView from '@/components/marketing/CalendarView'

import { generateStrategy } from '@/lib/api/marketingApi'

const STEPS = [
  { n: 1, label: 'Configuration' },
  { n: 2, label: 'Generation' },
  { n: 3, label: 'Resultats' }
]

const OBJECTIVE_OPTIONS = [
  'Notoriete de marque',
  'Generation de leads',
  'Engagement communaute',
  'Trafic site web',
  'Conversion / ventes',
  'Fidelisation clients'
]

const AUDIENCE_OPTIONS = [
  'Entrepreneurs / Independants',
  'PME / TPE',
  'Grands comptes B2B',
  'Grand public B2C',
  'Jeunes 18-25 ans',
  'Professionnels 30-45 ans',
  'Etudiants',
  'Femmes 25-40 ans'
]

const BRAND_VOICE_OPTIONS = [
  'Expert & professionnel',
  'Decontracte & proche',
  'Inspirant & motivant',
  'Humoristique & decale',
  'Luxe & exclusif',
  'Educatif & pedagogue',
  'Provocateur & audacieux'
]

const BUDGET_OPTIONS = [
  { id: 'zero', label: 'Pas de budget', desc: 'DIY, smartphone, outils gratuits' },
  { id: 'petit', label: 'Petit budget', desc: '< 500\u20ac/mois' },
  { id: 'moyen', label: 'Budget moyen', desc: '500-2000\u20ac/mois' },
  { id: 'confortable', label: 'Budget confortable', desc: '2000-5000\u20ac/mois' },
  { id: 'gros', label: 'Gros budget', desc: '> 5000\u20ac/mois' }
]

function ChipSelector({ label, options, value, onChange, placeholder }) {
  const isCustom = value && !options.includes(value)
  const [showCustom, setShowCustom] = useState(isCustom)

  const toggleOption = (opt) => {
    if (value === opt) {
      onChange('')
    } else {
      onChange(opt)
      setShowCustom(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggleOption(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              value === opt
                ? 'bg-primary text-white'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80'
            }`}
          >
            {opt}
          </button>
        ))}
        <button
          type="button"
          onClick={() => { setShowCustom(!showCustom); if (!showCustom) onChange('') }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-dashed ${
            showCustom
              ? 'border-primary text-primary bg-primary/5'
              : 'border-border/60 text-text-muted hover:border-primary/40 hover:text-text-secondary'
          }`}
        >
          Personnalise...
        </button>
      </div>
      {showCustom && (
        <input
          value={isCustom ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-surface border border-border/60 rounded-2xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      )}
    </div>
  )
}

function MultiChipSelector({ label, options, value, onChange, placeholder }) {
  const selectedList = value ? value.split(', ').filter(Boolean) : []
  const customParts = selectedList.filter(v => !options.includes(v))
  const hasCustom = customParts.length > 0
  const [showCustom, setShowCustom] = useState(hasCustom)

  const toggleOption = (opt) => {
    if (selectedList.includes(opt)) {
      const next = selectedList.filter(v => v !== opt)
      onChange(next.join(', '))
    } else {
      onChange([...selectedList, opt].join(', '))
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggleOption(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedList.includes(opt)
                ? 'bg-primary text-white'
                : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80'
            }`}
          >
            {opt}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-dashed ${
            showCustom
              ? 'border-primary text-primary bg-primary/5'
              : 'border-border/60 text-text-muted hover:border-primary/40 hover:text-text-secondary'
          }`}
        >
          Personnalise...
        </button>
      </div>
      {showCustom && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-surface border border-border/60 rounded-2xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      )}
    </div>
  )
}

export default function StrategiePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  const today = new Date().toISOString().split('T')[0]

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    sector: '',
    targetAudience: '',
    objectives: '',
    brandVoice: '',
    budget: ''
  })
  const [channels, setChannels] = useState([])
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label)
      setProgress(pct)
      await new Promise(r => setTimeout(r, ms))
    }
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
        generateStrategy({ ...formData, channels, startDate: today }),
        _progressAnim([
          ['Analyse du secteur et de l\'audience...', 10, 1000],
          ['Etude des tendances et marronniers...', 20, 1500],
          ['Planification des themes editoriaux...', 35, 2000],
          ['Repartition par canal...', 50, 2000],
          ['Optimisation des horaires de publication...', 65, 1500],
          ['Construction du calendrier editorial...', 78, 1500],
          ['Planification des sessions de production...', 88, 1500],
          ['Estimation des couts et ressources...', 95, 1000],
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
    setFormData({ sector: '', targetAudience: '', objectives: '', brandVoice: '', budget: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Logo size="md" link={false} />
        <p className="text-text-muted">Chargement...</p>
      </div>
    )
  }

  const inputStyles = 'w-full px-4 py-3 bg-surface border border-border/60 rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

        {/* Stepper */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {STEPS.map(s => (
            <div key={s.n} className="flex items-center gap-1">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step === s.n ? 'bg-primary text-white' :
                step > s.n ? 'bg-primary/20 text-primary' : 'bg-surface-elevated text-text-muted'
              }`}>
                {step > s.n ? '\u2713 ' : ''}{s.label}
              </div>
              {s.n < STEPS.length && <div className="w-6 h-px bg-border/60" />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-300">{error}</p>
              <button onClick={() => setError('')} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Fermer</button>
            </div>
          </div>
        )}

        {/* Step 1: Configuration */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Strategie de Contenu</h1>
              <p className="text-text-secondary">Generez un calendrier editorial + planning de production sur 30 jours</p>
            </div>

            {/* Panneau Config */}
            <div className="bg-surface rounded-2xl border border-border/60 p-6 space-y-5">
              <h2 className="font-display text-lg font-semibold text-text-primary">Configuration</h2>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Secteur d&apos;activite *</label>
                <input
                  name="sector"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  placeholder="Ex: Mode feminine, SaaS B2B, Restaurant gastronomique..."
                  className={inputStyles}
                />
              </div>

              <ChipSelector
                label="Audience cible *"
                options={AUDIENCE_OPTIONS}
                value={formData.targetAudience}
                onChange={(v) => setFormData({ ...formData, targetAudience: v })}
                placeholder="Decrivez votre audience cible..."
              />

              <MultiChipSelector
                label="Objectifs *"
                options={OBJECTIVE_OPTIONS}
                value={formData.objectives}
                onChange={(v) => setFormData({ ...formData, objectives: v })}
                placeholder="Ou saisissez vos objectifs manuellement..."
              />

              <ChipSelector
                label="Ton de marque"
                options={BRAND_VOICE_OPTIONS}
                value={formData.brandVoice}
                onChange={(v) => setFormData({ ...formData, brandVoice: v })}
                placeholder="Decrivez le ton de votre marque..."
              />

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Budget production (optionnel)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {BUDGET_OPTIONS.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: formData.budget === b.id ? '' : b.id })}
                      className={`p-3 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                        formData.budget === b.id
                          ? 'border-primary bg-primary-light'
                          : 'border-border/60 bg-surface hover:border-primary/40'
                      }`}
                    >
                      <div className={`text-xs font-semibold ${formData.budget === b.id ? 'text-primary' : 'text-text-primary'}`}>
                        {b.label}
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Panneau Canaux */}
            <div className="bg-surface rounded-2xl border border-border/60 p-6">
              <ChannelSelector selected={channels} onChange={setChannels} />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formData.sector || !formData.targetAudience || !formData.objectives || channels.length === 0}
              size="lg"
              className="w-full rounded-2xl"
            >
              Generer la strategie ({channels.length} canal{channels.length > 1 ? 'aux' : ''})
            </Button>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && processing && (
          <div className="space-y-4 bg-surface rounded-2xl border border-border/60 p-8 text-center animate-fade-in">
            <CatLoadingAnimation label={processingLabel} />
            <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-text-muted">La generation du calendrier + planning de production prend un peu plus de temps...</p>
          </div>
        )}

        {/* Step 3: Resultats */}
        {step === 3 && result && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-4">
              <h2 className="font-display text-2xl font-bold text-text-primary mb-1">Votre strategie de contenu</h2>
              <p className="text-text-secondary text-sm">
                Calendrier editorial + planning de production pour {channels.length} canal{channels.length > 1 ? 'aux' : ''}
              </p>
            </div>

            <CalendarView data={result} startDate={today} budget={formData.budget} />

            <div className="flex gap-3 justify-center pt-4">
              <Button
                onClick={handleReset}
                variant="outline"
                size="md"
                className="rounded-2xl"
              >
                Nouvelle strategie
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
