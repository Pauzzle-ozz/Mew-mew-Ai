'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import ContentTypeSelector from '@/components/marketing/ContentTypeSelector'
import ContentCreatorPlatformSelector from '@/components/marketing/ContentCreatorPlatformSelector'
import ContentCreatorResults from '@/components/marketing/ContentCreatorResults'
import CreationHistory from '@/components/marketing/CreationHistory'
import SocialKeysManager from '@/components/marketing/SocialKeysManager'

import { createContent, recreateContent, generateContentImage, saveCreation, getSocialKeys, publishToSocial } from '@/lib/api/marketingApi'

const STEPS = [
  { n: 1, label: 'Configuration' },
  { n: 2, label: 'Creation' },
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

export default function CreateurPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  // State
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState('brief') // 'brief' ou 'url'
  const [brief, setBrief] = useState({
    subject: '',
    tone: 'Professionnel',
    targetAudience: '',
    objective: '',
    keywords: '',
    context: ''
  })
  const [platforms, setPlatforms] = useState([])
  const [contentType, setContentType] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [generatedImages, setGeneratedImages] = useState({})
  const [imageLoading, setImageLoading] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showKeysManager, setShowKeysManager] = useState(false)
  const [connectedPlatforms, setConnectedPlatforms] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Charger les plateformes connectees
  const loadConnectedPlatforms = async () => {
    if (!user) return
    try {
      const keys = await getSocialKeys(user.id)
      setConnectedPlatforms(keys || [])
    } catch (err) {
      console.error('Erreur chargement cles sociales:', err)
    }
  }

  useEffect(() => {
    if (user) loadConnectedPlatforms()
  }, [user])

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
    if (!contentType) return 'Selectionnez un type de contenu'
    if (platforms.length === 0) return 'Selectionnez au moins une plateforme'
    if (mode === 'url' && !sourceUrl.trim()) return 'L\'URL source est requise'
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }

    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)
    setGeneratedImages({})
    setSaved(false)

    try {
      const progressSteps = mode === 'url'
        ? [
            ['Scraping de l\'URL source...', 10, 1000],
            ['Analyse du contenu source...', 25, 1200],
            ['Adaptation au type de contenu...', 40, 1000],
            ['Generation du contenu...', 60, 2500],
            ['Optimisation par plateforme...', 80, 1500],
            ['Verification des contraintes algo...', 92, 800],
            ['Finalisation...', 98, 500]
          ]
        : [
            ['Analyse du brief...', 15, 800],
            ['Application des regles algorithmiques...', 30, 1000],
            ['Generation du contenu...', 55, 2500],
            ['Optimisation par plateforme...', 75, 1500],
            ['Verification des contraintes...', 90, 800],
            ['Finalisation...', 98, 500]
          ]

      const apiCall = mode === 'url'
        ? recreateContent(sourceUrl, platforms, contentType, brief)
        : createContent(brief, platforms, contentType)

      const [apiResult] = await Promise.all([
        apiCall,
        _progressAnim(progressSteps)
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

  const handleGenerateImage = async (platform) => {
    setImageLoading(platform)
    try {
      const imageResult = await generateContentImage(brief, platform, contentType)
      setGeneratedImages(prev => ({ ...prev, [platform]: imageResult }))
    } catch (err) {
      setError(`Erreur generation image : ${err.message}`)
    } finally {
      setImageLoading(null)
    }
  }

  const handleSave = async () => {
    if (!user || !result) return
    setSaving(true)
    try {
      await saveCreation({
        userId: user.id,
        title: brief.subject || 'Creation sans titre',
        contentType,
        platforms,
        brief,
        sourceUrl: mode === 'url' ? sourceUrl : null,
        generatedContent: result,
        generatedImages: Object.entries(generatedImages).map(([platform, img]) => ({
          platform,
          url: img.url,
          prompt: img.revisedPrompt
        })),
        status: 'draft'
      })
      setSaved(true)
    } catch (err) {
      setError(`Erreur sauvegarde : ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async (platform) => {
    if (!user || !result?.platforms?.[platform]) {
      throw new Error('Aucun contenu a publier pour cette plateforme')
    }

    const platformData = result.platforms[platform]
    // Extraire le contenu textuel selon la plateforme
    let textContent = ''
    if (platform === 'twitter') {
      textContent = platformData.tweets?.[0] || platformData.content || ''
    } else if (platform === 'tiktok') {
      textContent = platformData.caption || ''
    } else if (platform === 'youtube') {
      textContent = platformData.description || platformData.script || ''
    } else {
      textContent = platformData.content || ''
    }

    // Ajouter les hashtags si disponibles
    if (platformData.hashtags?.length > 0) {
      textContent += '\n\n' + platformData.hashtags.join(' ')
    }

    const imageUrl = generatedImages[platform]?.url || null

    return await publishToSocial(user.id, platform, textContent, imageUrl)
  }

  const handleLoadCreation = (creation) => {
    setResult(creation.generated_content)
    setContentType(creation.content_type)
    setPlatforms(creation.platforms || [])
    setBrief(creation.brief || {})
    setSourceUrl(creation.source_url || '')
    setMode(creation.source_url ? 'url' : 'brief')
    setGeneratedImages(
      (creation.generated_images || []).reduce((acc, img) => {
        acc[img.platform] = { url: img.url, revisedPrompt: img.prompt }
        return acc
      }, {})
    )
    setShowHistory(false)
    setStep(3)
    setSaved(true)
  }

  const handleReset = () => {
    setStep(1)
    setResult(null)
    setError('')
    setPlatforms([])
    setContentType('')
    setSourceUrl('')
    setMode('brief')
    setGeneratedImages({})
    setSaved(false)
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
          { label: 'Createur de Contenu' }
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
              <h1 className="text-2xl font-bold text-text-primary mb-2">Createur de Contenu</h1>
              <p className="text-text-secondary">Generez du contenu optimise pour 9 plateformes avec l&apos;IA</p>
            </div>

            {/* Boutons Historique + Cles API */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowKeysManager(true)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                🔑 Cles API {connectedPlatforms.length > 0 && (
                  <span className="ml-1 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                    {connectedPlatforms.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                📂 Mes creations
              </button>
            </div>

            {/* Mode toggle */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <label className="block text-sm font-medium text-text-secondary mb-3">Mode de creation</label>
              <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setMode('brief')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    mode === 'brief' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Nouveau contenu
                </button>
                <button
                  type="button"
                  onClick={() => setMode('url')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    mode === 'url' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Recreer depuis une URL
                </button>
              </div>

              {mode === 'url' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">URL source *</label>
                  <input
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://example.com/article-ou-video-a-adapter"
                    className={inputStyles}
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Collez l&apos;URL d&apos;un article, une video ou un post a adapter pour vos plateformes
                  </p>
                </div>
              )}
            </div>

            {/* Brief */}
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
                  placeholder="Ex: Entrepreneurs 25-40 ans, actifs sur les reseaux sociaux"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Objectif *</label>
                <input
                  name="objective"
                  value={brief.objective}
                  onChange={handleChange}
                  placeholder="Ex: Augmenter la notoriete de marque et generer des leads"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Mots-cles (optionnel)</label>
                <input
                  name="keywords"
                  value={brief.keywords}
                  onChange={handleChange}
                  placeholder="Ex: innovation, startup, growth, digital"
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
                  placeholder="Ex: Nous sommes une startup SaaS B2B, lancement prevu en mars..."
                  className={inputStyles + ' resize-none'}
                />
              </div>
            </div>

            {/* Content Type */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <ContentTypeSelector selected={contentType} onChange={setContentType} />
            </div>

            {/* Platforms */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <ContentCreatorPlatformSelector selected={platforms} onChange={setPlatforms} />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!brief.subject || !brief.targetAudience || !brief.objective || !contentType || platforms.length === 0 || (mode === 'url' && !sourceUrl)}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {mode === 'url' ? 'Recreer le contenu' : 'Generer le contenu'} ({platforms.length} plateforme{platforms.length > 1 ? 's' : ''})
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
              {mode === 'url' ? 'Recreation' : 'Generation'} en cours pour {platforms.length} plateforme{platforms.length > 1 ? 's' : ''}...
            </p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Contenu genere !</h2>
              <p className="text-text-secondary text-sm">
                Copiez, generez des images et sauvegardez vos creations
              </p>
            </div>

            <ContentCreatorResults
              data={result}
              onGenerateImage={handleGenerateImage}
              generatedImages={generatedImages}
              imageLoading={imageLoading}
              connectedPlatforms={connectedPlatforms}
              onPublish={handlePublish}
            />

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Nouvelle creation
              </button>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saved ? '✓ Sauvegarde !' : saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="px-6 py-2.5 bg-surface border border-border rounded-xl text-text-secondary font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                Mes creations
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Modal historique */}
      {showHistory && user && (
        <CreationHistory
          userId={user.id}
          onLoad={handleLoadCreation}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Modal gestion cles API */}
      {showKeysManager && user && (
        <SocialKeysManager
          userId={user.id}
          onClose={() => setShowKeysManager(false)}
          onKeysUpdate={setConnectedPlatforms}
        />
      )}
    </div>
  )
}
