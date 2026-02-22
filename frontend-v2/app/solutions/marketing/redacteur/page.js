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
import BriefTip from '@/components/marketing/BriefTips'

import { generateContent, regeneratePlatform, suggestKeywords } from '@/lib/api/marketingApi'
import { saveHistoryEntry, getHistory, deleteHistoryEntry } from '@/lib/api/historyApi'
import { TONE_OPTIONS, OBJECTIVE_SUGGESTIONS, BRIEF_TEMPLATES } from '@/lib/constants/redacteur'

const STEPS = [
  { n: 1, label: 'Brief' },
  { n: 2, label: 'Generation' },
  { n: 3, label: 'Resultats' }
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
  const [customTone, setCustomTone] = useState('')
  const [showCustomTone, setShowCustomTone] = useState(false)
  const [platforms, setPlatforms] = useState([])
  const [processing, setProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [keywordSuggestions, setKeywordSuggestions] = useState([])
  const [loadingKeywords, setLoadingKeywords] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState(null)

  // History
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

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

  // Build the actual brief sent to API (use custom tone if set)
  const getApiBrief = () => ({
    ...brief,
    tone: showCustomTone && customTone.trim() ? customTone.trim() : brief.tone
  })

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }

    setError('')
    setProcessing(true)
    setProgress(0)
    setStep(2)

    const apiBrief = getApiBrief()

    try {
      const [apiResult] = await Promise.all([
        generateContent(apiBrief, platforms),
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

      // Auto-save to history
      if (user?.id) {
        try {
          await saveHistoryEntry({
            userId: user.id,
            toolType: 'redacteur',
            title: brief.subject,
            inputSummary: { brief: apiBrief, platforms },
            resultSummary: apiResult
          })
        } catch (e) {
          console.error('Erreur sauvegarde historique:', e)
        }
      }
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
    setCustomTone('')
    setShowCustomTone(false)
    setKeywordSuggestions([])
    setActiveTemplate(null)
    setBrief({ subject: '', tone: 'Professionnel', targetAudience: '', objective: '', keywords: '', context: '' })
  }

  // Template selection
  const handleTemplateSelect = (template) => {
    if (activeTemplate === template.id) {
      setActiveTemplate(null)
      setBrief({ subject: '', tone: 'Professionnel', targetAudience: '', objective: '', keywords: '', context: '' })
    } else {
      setActiveTemplate(template.id)
      setBrief({
        subject: template.subject,
        tone: template.tone,
        targetAudience: template.targetAudience,
        objective: template.objective,
        keywords: template.keywords,
        context: template.context
      })
      setShowCustomTone(false)
      setCustomTone('')
    }
  }

  // Tone selection
  const handleToneSelect = (tone) => {
    setShowCustomTone(false)
    setCustomTone('')
    setBrief({ ...brief, tone })
  }

  const handleCustomToneToggle = () => {
    setShowCustomTone(!showCustomTone)
    if (!showCustomTone) {
      setBrief({ ...brief, tone: '' })
    } else {
      setCustomTone('')
      setBrief({ ...brief, tone: 'Professionnel' })
    }
  }

  // Keyword suggestions
  const handleSuggestKeywords = async () => {
    if (!brief.subject.trim()) return
    setLoadingKeywords(true)
    try {
      const data = await suggestKeywords(brief.subject, brief.targetAudience)
      setKeywordSuggestions(data.keywords || [])
    } catch (e) {
      console.error('Erreur suggestion mots-cles:', e)
    } finally {
      setLoadingKeywords(false)
    }
  }

  const handleAddKeyword = (kw) => {
    const current = brief.keywords ? brief.keywords.split(',').map(k => k.trim()).filter(Boolean) : []
    if (!current.includes(kw)) {
      setBrief({ ...brief, keywords: [...current, kw].join(', ') })
    }
  }

  // Editable results
  const handleDataChange = (platformId, field, value) => {
    if (!result?.platforms) return
    setResult(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platformId]: {
          ...prev.platforms[platformId],
          [field]: value
        }
      }
    }))
  }

  // Regenerate single platform
  const handleRegenerate = async (platformId) => {
    try {
      const apiBrief = getApiBrief()
      const data = await regeneratePlatform(apiBrief, platformId)
      if (data?.content) {
        setResult(prev => ({
          ...prev,
          platforms: {
            ...prev.platforms,
            [platformId]: data.content
          }
        }))
      }
    } catch (e) {
      setError(e.message || 'Erreur lors de la regeneration')
    }
  }

  // History
  const handleToggleHistory = async () => {
    if (!showHistory && user?.id && history.length === 0) {
      setLoadingHistory(true)
      try {
        const data = await getHistory(user.id, { toolType: 'redacteur', limit: 20 })
        setHistory(data || [])
      } catch (e) {
        console.error('Erreur historique:', e)
      } finally {
        setLoadingHistory(false)
      }
    }
    setShowHistory(!showHistory)
  }

  const handleLoadHistory = (entry) => {
    const input = entry.input_summary || {}
    const resultData = entry.result_summary || {}

    if (input.brief) {
      setBrief(input.brief)
      if (input.brief.tone && !TONE_OPTIONS.includes(input.brief.tone)) {
        setShowCustomTone(true)
        setCustomTone(input.brief.tone)
      }
    }
    if (input.platforms) setPlatforms(input.platforms)
    if (resultData.platforms) {
      setResult(resultData)
      setStep(3)
    }
  }

  const handleDeleteHistory = async (entryId) => {
    if (!user?.id) return
    try {
      await deleteHistoryEntry(entryId, user.id)
      setHistory(prev => prev.filter(h => h.id !== entryId))
    } catch (e) {
      console.error('Erreur suppression:', e)
    }
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

            {/* Templates de brief */}
            <div className="bg-surface rounded-xl border border-border p-4">
              <p className="text-sm font-medium text-text-secondary mb-3">Partir d'un template</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BRIEF_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTemplateSelect(t)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      activeTemplate === t.id
                        ? 'bg-primary/20 border border-primary text-primary'
                        : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Plateformes EN PREMIER */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <PlatformSelector selected={platforms} onChange={setPlatforms} />
            </div>

            {/* Brief form */}
            <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
              <h2 className="text-lg font-semibold text-text-primary">Votre brief</h2>

              {/* Sujet */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Sujet *</label>
                <input
                  name="subject"
                  value={brief.subject}
                  onChange={handleChange}
                  placeholder="Ex: Lancement de notre nouvelle gamme de produits bio"
                  className={inputStyles}
                />
                <BriefTip field="subject" platforms={platforms} />
              </div>

              {/* Ton */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Ton *</label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleToneSelect(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        !showCustomTone && brief.tone === t
                          ? 'bg-primary text-white'
                          : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleCustomToneToggle}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      showCustomTone
                        ? 'bg-primary text-white'
                        : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80 border border-dashed border-border'
                    }`}
                  >
                    Personnalise...
                  </button>
                </div>
                {showCustomTone && (
                  <input
                    value={customTone}
                    onChange={(e) => setCustomTone(e.target.value)}
                    placeholder="Ex: Sarcastique et decale, Corporate chic, Street marketing..."
                    className={`${inputStyles} mt-2`}
                  />
                )}
                <BriefTip field="tone" platforms={platforms} />
              </div>

              {/* Audience */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Audience cible *</label>
                <input
                  name="targetAudience"
                  value={brief.targetAudience}
                  onChange={handleChange}
                  placeholder="Ex: Femmes 25-45 ans, sensibles a l'ecologie"
                  className={inputStyles}
                />
                <BriefTip field="audience" platforms={platforms} />
              </div>

              {/* Objectif */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Objectif *</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {OBJECTIVE_SUGGESTIONS.map(obj => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => setBrief({ ...brief, objective: obj })}
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                        brief.objective === obj
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-surface-elevated text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
                <input
                  name="objective"
                  value={brief.objective}
                  onChange={handleChange}
                  placeholder="Ex: Generer du trafic vers notre site et des preinscriptions"
                  className={inputStyles}
                />
                <BriefTip field="objective" platforms={platforms} />
              </div>

              {/* Mots-cles */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-text-secondary">Mots-cles (optionnel)</label>
                  <button
                    type="button"
                    onClick={handleSuggestKeywords}
                    disabled={!brief.subject.trim() || loadingKeywords}
                    className="text-xs text-primary hover:text-primary-hover disabled:text-text-muted disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    {loadingKeywords ? 'Suggestion...' : 'Suggerer par IA'}
                  </button>
                </div>
                <input
                  name="keywords"
                  value={brief.keywords}
                  onChange={handleChange}
                  placeholder="Ex: bio, naturel, zero dechet, sante"
                  className={inputStyles}
                />
                {keywordSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {keywordSuggestions.map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddKeyword(kw)}
                        className="px-2.5 py-1 rounded-md text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        + {kw}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Contexte */}
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

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!brief.subject || !brief.targetAudience || !brief.objective || platforms.length === 0}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Generer le contenu ({platforms.length} plateforme{platforms.length > 1 ? 's' : ''})
            </button>

            {/* Historique */}
            <div className="bg-surface rounded-xl border border-border">
              <button
                type="button"
                onClick={handleToggleHistory}
                className="w-full flex items-center justify-between px-6 py-4 cursor-pointer"
              >
                <span className="text-sm font-medium text-text-secondary">Historique des generations</span>
                <span className={`text-text-muted text-xs transition-transform ${showHistory ? 'rotate-180' : ''}`}>&#9660;</span>
              </button>

              {showHistory && (
                <div className="px-6 pb-4">
                  {loadingHistory ? (
                    <p className="text-xs text-text-muted text-center py-4">Chargement...</p>
                  ) : history.length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-4">Aucune generation precedente</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {history.map(entry => {
                        const platformEmojis = {
                          linkedin: '💼', instagram: '📸', twitter: '🐦',
                          blog: '📝', video_script: '🎬', newsletter: '📧'
                        }
                        const entryPlatforms = entry.input_summary?.platforms || []
                        const date = new Date(entry.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })

                        return (
                          <div key={entry.id} className="flex items-center justify-between bg-surface-elevated rounded-lg px-4 py-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-text-primary truncate">{entry.title || 'Sans titre'}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-text-muted">{date}</span>
                                <span className="text-xs">{entryPlatforms.map(p => platformEmojis[p] || '').join(' ')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <button
                                onClick={() => handleLoadHistory(entry)}
                                className="text-xs text-primary hover:text-primary-hover cursor-pointer"
                              >
                                Charger
                              </button>
                              <button
                                onClick={() => handleDeleteHistory(entry.id)}
                                className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
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
              <p className="text-text-secondary text-sm">Modifiez, copiez et publiez directement sur vos plateformes</p>
            </div>

            <ContentResults
              data={result}
              onDataChange={handleDataChange}
              brief={getApiBrief()}
              onRegenerate={handleRegenerate}
            />

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
