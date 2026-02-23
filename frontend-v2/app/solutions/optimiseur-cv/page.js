'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { validatePDF, downloadGeneratedCV } from '@/lib/utils/fileHelpers'
import { cvApi } from '@/lib/api/cvApi'
import { supabase } from '@/lib/supabase'
import ErrorMessage from '@/components/shared/ErrorMessage'
import Header from '@/components/shared/Header'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import ToolHistory from '@/components/shared/ToolHistory'
import { saveHistoryEntry } from '@/lib/api/historyApi'
import CVBlockEditor from '@/components/cv/CVBlockEditor'
import CVPreview from '@/components/cv/CVPreview'

/* ─── Stepper ─────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: 'Saisie & Optimisation' },
  { n: 2, label: 'Résultats IA' },
  { n: 3, label: 'Édition CV' },
  { n: 4, label: 'Génération PDF' },
]

function Stepper({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            s.n === current ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
            : s.n < current ? 'bg-primary/20 text-primary'
            : 'bg-surface text-text-muted'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              s.n < current ? 'bg-primary/40 text-primary' : s.n === current ? 'bg-gray-900/20' : 'bg-border'
            }`}>
              {s.n < current ? '✓' : s.n}
            </div>
            {s.label}
          </div>
          {i < STEPS.length - 1 && <div className={`h-0.5 w-4 flex-shrink-0 ${s.n < current ? 'bg-primary/40' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  )
}

/* ─── Score ATS visuel ────────────────────────────────── */
function ATSScore({ score }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Bon' : 'À améliorer'
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 60" className="w-32 h-20">
        <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#2a2a3e" strokeWidth="10" strokeLinecap="round" />
        <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${score * 1.257} 200`} style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x="50" y="54" textAnchor="middle" fill={color} fontSize="18" fontWeight="bold">{score}</text>
      </svg>
      <div className="text-sm font-bold mt-1" style={{ color }}>{label}</div>
      <div className="text-xs text-text-muted">Score ATS /100</div>
    </div>
  )
}

/* ─── Page principale ─────────────────────────────────── */
export default function OptimiseurCVPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState(1)

  // Étape 1 : saisie
  const [inputMethod, setInputMethod] = useState('form')
  const [cvFile, setCvFile] = useState(null)
  const [posteCible, setPosteCible] = useState('')
  const [localError, setLocalError] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  // CV original (avant optim)
  const [cvDataOriginal, setCvDataOriginal] = useState(null)

  // Formulaire
  const [cvData, setCvData] = useState({
    prenom: '', nom: '', titre_poste: '', email: '', telephone: '',
    adresse: '', linkedin: '', resume: '',
    experiences: [{ poste: '', entreprise: '', localisation: '', date_debut: '', date_fin: '', description: '' }],
    formations: [{ diplome: '', etablissement: '', localisation: '', date_fin: '', description: '' }],
    competences_techniques: '', competences_soft: '', langues: '', interets: ''
  })

  // Étape 2 : résultats IA
  const [optimResult, setOptimResult] = useState(null)
  const [cvDataOptimized, setCvDataOptimized] = useState(null)
  const [showComparison, setShowComparison] = useState(false)

  // Étape 3 : blocs éditables + blockStyles + bloc actif + filtrage IA
  const [blockStyles, setBlockStyles] = useState({})
  const [filtering, setFiltering] = useState(false)
  const [filterSections, setFilterSections] = useState([])
  const [activeBlock, setActiveBlock] = useState(null)

  const BLOCK_ORDER_DEFAULT = ['identity', 'resume', 'experiences', 'formations', 'competences']
  const [blockOrder, setBlockOrder] = useState(BLOCK_ORDER_DEFAULT)

  // Étape 4 : génération + aperçu résultat
  const [generatingCV, setGeneratingCV] = useState(false)
  const [generatedConfig, setGeneratedConfig] = useState(null)

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  /* ── Form helpers ── */
  const handleChange = (f, v) => setCvData(prev => ({ ...prev, [f]: v }))
  const handleArrayChange = (arr, i, f, v) => {
    const a = [...cvData[arr]]; a[i] = { ...a[i], [f]: v }
    setCvData(prev => ({ ...prev, [arr]: a }))
  }
  const addArrayItem = (arr, tpl) => setCvData(prev => ({ ...prev, [arr]: [...prev[arr], tpl] }))
  const removeArrayItem = (arr, i) => setCvData(prev => ({ ...prev, [arr]: prev[arr].filter((_, j) => j !== i) }))

  /* ── Étape 1 : Optimisation ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0]; if (!file) return
    setLocalError(null)
    try { validatePDF(file); setCvFile(file) } catch (err) { setLocalError(err.message); setCvFile(null) }
  }

  const _goToStep2 = (data) => {
    setOptimResult({ score_ats: data.score_ats, points_forts: data.points_forts, ameliorations: data.ameliorations })
    setCvDataOptimized(data.cvData_optimise)
    setProcessing(false)
    setStep(2)

    // Sauvegarde historique (fire-and-forget)
    const nom = data.cvData_optimise?.prenom || cvData.prenom || ''
    const prenom = data.cvData_optimise?.nom || cvData.nom || ''
    saveHistoryEntry({
      userId: user.id,
      toolType: 'optimiseur-cv',
      title: `Optimisation CV - ${nom} ${prenom}`.trim(),
      inputSummary: { poste_cible: posteCible || cvData.titre_poste, methode: inputMethod },
      resultSummary: {
        score_ats: data.score_ats,
        fullResult: {
          score_ats: data.score_ats,
          points_forts: data.points_forts,
          ameliorations: data.ameliorations,
          cvData_optimise: data.cvData_optimise
        }
      }
    }).catch(() => {})
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault(); setLocalError(null)
    setCvDataOriginal({ ...cvData })
    setProcessing(true)
    try {
      const fullResp = await cvApi.optimizeCVForm(cvData, user.id, posteCible || undefined)
      if (fullResp.success) { _goToStep2(fullResp.data) }
      else throw new Error(fullResp.error || 'Erreur lors de l\'optimisation')
    } catch (err) { setProcessing(false); setLocalError(err.message) }
  }

  const handlePdfOptimization = async (e) => {
    e.preventDefault(); setLocalError(null)
    if (!cvFile) { setLocalError('Veuillez sélectionner un fichier CV'); return }
    setProcessing(true)
    try {
      const formData = new FormData()
      formData.append('cv', cvFile)
      formData.append('userId', user.id)
      if (posteCible) formData.append('posteCible', posteCible)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/solutions/optimiser-cv-pdf`, { method: 'POST', body: formData })
      const data = await response.json()
      if (data.success) { _goToStep2(data.data) }
      else throw new Error(data.error || 'Erreur lors de l\'optimisation')
    } catch (err) { setProcessing(false); setLocalError(err.message) }
  }

  /* ── Étape 3 : réordonnancement des blocs ── */
  const moveBlock = (key, dir) => {
    setBlockOrder(prev => {
      const idx = prev.indexOf(key)
      if (idx < 0) return prev
      const next = [...prev]
      const swap = idx + dir
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }

  const BLOCK_LABELS = {
    identity:    { label: 'Identité & Contact', icon: '👤' },
    resume:      { label: 'Résumé Profil',      icon: '📝' },
    experiences: { label: 'Expériences',        icon: '💼' },
    formations:  { label: 'Formations',         icon: '🎓' },
    competences: { label: 'Compétences',        icon: '⚡' },
  }

  /* ── Bloc styles ── */
  const handleBlockStyleChange = (key, prop, val) => {
    setBlockStyles(prev => ({ ...prev, [key]: { ...(prev[key] || {}), [prop]: val } }))
  }

  /* ── Étape 4 : Génération ── */
  const handleGenerateCV = async () => {
    setGeneratingCV(true); setLocalError(null)
    try {
      const buildConfig = { shape: 'classique', style: 'ardoise', blockStyles }
      const result = await cvApi.generateCV(cvDataOptimized, buildConfig)
      if (result.success) {
        setGeneratedConfig({ cvData: cvDataOptimized, buildConfig })
        downloadGeneratedCV(result)
      }
    } catch (err) { setLocalError(err.message) }
    finally { setGeneratingCV(false) }
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Chargement...</div>

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} breadcrumbs={[{ label: 'Emploi', href: '/dashboard' }, { label: 'Optimiseur CV' }]} />

      <main className={`mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all ${step === 3 ? 'max-w-7xl' : 'max-w-4xl'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1" />
          <button
            onClick={() => setShowHistory(true)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
          >
            Historique
          </button>
        </div>

        {showHistory && (
          <ToolHistory
            userId={user.id}
            defaultToolType="optimiseur-cv"
            onClose={() => setShowHistory(false)}
            onLoad={(entry) => {
              const full = entry.result_summary?.fullResult
              if (full) {
                setOptimResult({ score_ats: full.score_ats, points_forts: full.points_forts, ameliorations: full.ameliorations })
                setCvDataOptimized(full.cvData_optimise)
                setStep(2)
                setShowHistory(false)
              }
            }}
          />
        )}

        <Stepper current={step} />

        {/* ═══════════════════════════════════════
            ÉTAPE 1 : SAISIE + OPTIMISATION
        ═══════════════════════════════════════ */}
        {step === 1 && (
          <>
            {/* Animation discrète pendant le traitement */}
            {processing && (
              <div className="bg-surface rounded-xl shadow-lg shadow-black/20 p-6">
                <CatLoadingAnimation label={inputMethod === 'upload' ? 'Analyse du PDF en cours' : 'Optimisation en cours'} />
              </div>
            )}

            {!processing && (
              <>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary">
                    <strong>Comment ça marche :</strong> Upload ton CV PDF ou remplis le formulaire.
                    L'IA optimise le contenu pour les ATS, te donne un score et prépare ton CV pour la mise en page.
                  </p>
                </div>

                {/* Champ poste ciblé */}
                <div className="bg-surface rounded-xl border border-primary/30 shadow-lg shadow-black/10 p-5 mb-6">
                  <h3 className="text-sm font-bold text-primary mb-1">Poste ciblé (optionnel mais recommandé)</h3>
                  <p className="text-xs text-text-muted mb-3">Si tu postules à une offre précise, indique-le ici. L'IA adaptera les mots-clés et le résumé spécifiquement pour ce poste.</p>
                  <input
                    type="text"
                    placeholder="Ex: Développeur Full Stack React / Chef de projet digital chez Airbus / Stage marketing digital"
                    value={posteCible}
                    onChange={e => setPosteCible(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
                  />
                </div>

                {/* Choix méthode */}
                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Comment veux-tu saisir ton CV ?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button type="button" onClick={() => setInputMethod('form')} className={`p-6 rounded-lg border-2 transition-all ${inputMethod === 'form' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                      <div className="text-4xl mb-3">✍️</div>
                      <h4 className="font-semibold text-lg mb-2 text-text-primary">Formulaire manuel</h4>
                      <p className="text-sm text-text-muted">Remplis tes informations et l'IA les optimisera.</p>
                    </button>
                    <button type="button" onClick={() => setInputMethod('upload')} className={`p-6 rounded-lg border-2 transition-all ${inputMethod === 'upload' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <div className="text-4xl mb-3">📤</div>
                      <h4 className="font-semibold text-lg mb-2 text-text-primary">Upload CV PDF</h4>
                      <p className="text-sm text-text-muted">Upload ton CV et l'IA l'extraira et l'optimisera.</p>
                    </button>
                  </div>
                </div>

                <ErrorMessage message={localError} onClose={() => setLocalError(null)} />
              </>
            )}

            {/* MODE FORMULAIRE */}
            {!processing && inputMethod === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Informations personnelles</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Prénom *" value={cvData.prenom} onChange={e => handleChange('prenom', e.target.value)} required className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 outline-none" />
                    <input type="text" placeholder="Nom *" value={cvData.nom} onChange={e => handleChange('nom', e.target.value)} required className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 outline-none" />
                    <input type="text" placeholder="Intitulé du poste souhaité *" value={cvData.titre_poste} onChange={e => handleChange('titre_poste', e.target.value)} required className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 outline-none md:col-span-2" />
                    <input type="email" placeholder="Email *" value={cvData.email} onChange={e => handleChange('email', e.target.value)} required className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 outline-none" />
                    <input type="tel" placeholder="Téléphone" value={cvData.telephone} onChange={e => handleChange('telephone', e.target.value)} className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                    <input type="text" placeholder="Localisation (ex: Paris, France)" value={cvData.adresse} onChange={e => handleChange('adresse', e.target.value)} className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                    <input type="text" placeholder="LinkedIn (optionnel)" value={cvData.linkedin} onChange={e => handleChange('linkedin', e.target.value)} className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                  </div>
                </div>

                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Résumé professionnel</h3>
                  <textarea rows={4} placeholder="Présentez-vous en quelques lignes..." value={cvData.resume} onChange={e => handleChange('resume', e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                </div>

                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Expériences professionnelles</h3>
                    <button type="button" onClick={() => addArrayItem('experiences', { poste: '', entreprise: '', localisation: '', date_debut: '', date_fin: '', description: '' })} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">+ Ajouter</button>
                  </div>
                  {cvData.experiences.map((exp, i) => (
                    <div key={i} className="p-4 border-2 border-border rounded-lg space-y-3 mb-4">
                      <div className="flex justify-between"><span className="text-sm font-semibold text-text-muted">Expérience #{i + 1}</span>{cvData.experiences.length > 1 && <button type="button" onClick={() => removeArrayItem('experiences', i)} className="text-error text-sm">Supprimer</button>}</div>
                      <input placeholder="Intitulé du poste" value={exp.poste} onChange={e => handleArrayChange('experiences', i, 'poste', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Employeur" value={exp.entreprise} onChange={e => handleArrayChange('experiences', i, 'entreprise', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Localisation" value={exp.localisation || ''} onChange={e => handleArrayChange('experiences', i, 'localisation', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Date début (ex: Jan 2020)" value={exp.date_debut || ''} onChange={e => handleArrayChange('experiences', i, 'date_debut', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Date fin (ex: Dec 2023)" value={exp.date_fin || ''} onChange={e => handleArrayChange('experiences', i, 'date_fin', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      </div>
                      <textarea rows={4} placeholder="Description (bullets, réalisations chiffrées...)" value={exp.description} onChange={e => handleArrayChange('experiences', i, 'description', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                    </div>
                  ))}
                </div>

                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Formation</h3>
                    <button type="button" onClick={() => addArrayItem('formations', { diplome: '', etablissement: '', localisation: '', date_fin: '', description: '' })} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">+ Ajouter</button>
                  </div>
                  {cvData.formations.map((form, i) => (
                    <div key={i} className="p-4 border-2 border-border rounded-lg space-y-3 mb-4">
                      <div className="flex justify-between"><span className="text-sm font-semibold text-text-muted">Formation #{i + 1}</span>{cvData.formations.length > 1 && <button type="button" onClick={() => removeArrayItem('formations', i)} className="text-error text-sm">Supprimer</button>}</div>
                      <input placeholder="Diplôme" value={form.diplome} onChange={e => handleArrayChange('formations', i, 'diplome', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="École / Université" value={form.etablissement} onChange={e => handleArrayChange('formations', i, 'etablissement', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Localisation" value={form.localisation || ''} onChange={e => handleArrayChange('formations', i, 'localisation', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Année / Date fin" value={form.date_fin || ''} onChange={e => handleArrayChange('formations', i, 'date_fin', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Compétences</h3>
                  <div className="space-y-4">
                    <textarea rows={3} placeholder="Compétences techniques (ex: JavaScript, React, Python...)" value={cvData.competences_techniques} onChange={e => handleChange('competences_techniques', e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                    <textarea rows={2} placeholder="Soft skills (ex: Leadership, Communication...)" value={cvData.competences_soft} onChange={e => handleChange('competences_soft', e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                    <input placeholder="Langues (ex: Français natif, Anglais C1)" value={cvData.langues} onChange={e => handleChange('langues', e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                  </div>
                </div>

                <button type="submit" disabled={processing} className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg shadow-lg shadow-black/20 disabled:opacity-50 hover:bg-primary-hover transition-colors">
                  Optimiser mon CV avec l'IA
                </button>
              </form>
            )}

            {/* MODE UPLOAD */}
            {!processing && inputMethod === 'upload' && (
              <form onSubmit={handlePdfOptimization} className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Upload ton CV (PDF)</h3>
                <div className="mb-6">
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-sm border border-border rounded-lg bg-surface-elevated text-text-primary p-3" />
                  <p className="mt-2 text-xs text-text-muted">Format PDF uniquement, maximum 2 Mo</p>
                </div>
                {cvFile && <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg"><p className="text-sm text-success">✓ Fichier : <strong>{cvFile.name}</strong></p></div>}
                <button type="submit" disabled={!cvFile || processing} className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg disabled:opacity-50 hover:bg-primary-hover transition-colors">
                  Optimiser mon CV avec l'IA
                </button>
              </form>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════
            ÉTAPE 2 : RÉSULTATS IA (score + avant/après)
        ═══════════════════════════════════════ */}
        {step === 2 && optimResult && cvDataOptimized && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-1">Résultats de l'optimisation</h2>
              <p className="text-text-muted">L'IA a analysé et optimisé ton CV pour maximiser les chances de passer les ATS.</p>
            </div>

            <div className="bg-surface rounded-xl shadow-lg shadow-black/20 p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {optimResult.score_ats && (
                  <div className="flex-shrink-0">
                    <ATSScore score={optimResult.score_ats} />
                  </div>
                )}
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  {optimResult.points_forts?.length > 0 && (
                    <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                      <div className="font-bold text-success text-sm mb-2">Points forts conservés</div>
                      <ul className="space-y-1">
                        {optimResult.points_forts.map((p, i) => (
                          <li key={i} className="text-xs text-text-secondary flex gap-2"><span className="text-success">✓</span><span>{p}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {optimResult.ameliorations?.length > 0 && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="font-bold text-primary text-sm mb-2">Améliorations apportées</div>
                      <ul className="space-y-1">
                        {optimResult.ameliorations.map((a, i) => (
                          <li key={i} className="text-xs text-text-secondary flex gap-2"><span className="text-primary">+</span><span>{a}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {cvDataOriginal?.resume && cvDataOptimized?.resume && (
              <div className="bg-surface rounded-xl shadow-lg shadow-black/20 p-6">
                <button onClick={() => setShowComparison(!showComparison)} className="flex items-center justify-between w-full">
                  <h3 className="font-bold text-text-primary">Comparaison avant / après</h3>
                  <span className="text-text-muted text-sm">{showComparison ? '▲ Masquer' : '▼ Voir les changements'}</span>
                </button>
                {showComparison && (
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-red-50/5 border border-red-500/20 rounded-lg">
                      <div className="text-xs font-bold text-red-400 uppercase mb-2">Avant</div>
                      <p className="text-xs text-text-muted leading-relaxed">{cvDataOriginal.resume}</p>
                    </div>
                    <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                      <div className="text-xs font-bold text-success uppercase mb-2">Après (optimisé)</div>
                      <p className="text-xs text-text-secondary leading-relaxed">{cvDataOptimized.resume}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 border-2 border-border text-text-secondary rounded-lg hover:bg-surface font-medium">← Modifier</button>
              <button onClick={() => setStep(3)} className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover">
                Éditer mon CV →
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            ÉTAPE 3 : ÉDITEUR LIVE — GRAND CV + PANEL
        ═══════════════════════════════════════ */}
        {step === 3 && cvDataOptimized && (
          <div>
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Édite ton CV</h2>
              <p className="text-text-muted text-sm">Clique sur une zone du CV pour éditer la section correspondante. Les modifications s'affichent en temps réel.</p>
            </div>

            <div className="flex gap-6 items-start">
              {/* ── Panel gauche : sections + éditeur ── */}
              <div className="w-80 flex-shrink-0 space-y-3">

                {/* Sélecteur de sections */}
                <div className="bg-surface rounded-xl border border-border p-3">
                  <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2.5 px-1">Sections</div>
                  <div className="space-y-1">
                    {blockOrder.map((key, idx) => {
                      const b = BLOCK_LABELS[key]
                      const isActive = activeBlock === key
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-all ${isActive ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20' : 'border-transparent hover:border-border hover:bg-surface-elevated'}`}
                          onClick={() => setActiveBlock(isActive ? null : key)}
                        >
                          <span className="text-base leading-none">{b.icon}</span>
                          <span className={`flex-1 text-sm font-medium ${isActive ? 'text-primary' : 'text-text-secondary'}`}>{b.label}</span>
                          <div className="flex flex-col gap-0 opacity-50 hover:opacity-100">
                            <button
                              onClick={e => { e.stopPropagation(); moveBlock(key, -1) }}
                              disabled={idx === 0}
                              className="w-5 h-4 text-text-muted hover:text-primary disabled:opacity-20 text-xs leading-none flex items-center justify-center"
                            >▲</button>
                            <button
                              onClick={e => { e.stopPropagation(); moveBlock(key, 1) }}
                              disabled={idx === blockOrder.length - 1}
                              className="w-5 h-4 text-text-muted hover:text-primary disabled:opacity-20 text-xs leading-none flex items-center justify-center"
                            >▼</button>
                          </div>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-text-muted mt-2.5 px-1 opacity-60">
                    Clique pour éditer · ▲▼ pour réordonner
                  </p>
                </div>

                {/* Éditeur de bloc actif */}
                <CVBlockEditor
                  cvData={cvDataOptimized}
                  blockStyles={blockStyles}
                  onCvDataChange={setCvDataOptimized}
                  onBlockStyleChange={handleBlockStyleChange}
                  activeBlock={activeBlock}
                />

                {/* Filtrage IA par section */}
                <div className="bg-surface-elevated border border-border rounded-xl p-3 space-y-2">
                  <div className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Condenser avec l'IA</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'resume', label: 'Résumé' },
                      { id: 'experiences', label: 'Expériences' },
                      { id: 'competences', label: 'Compétences' },
                      { id: 'qualifications', label: 'Qualifications' },
                      { id: 'formations', label: 'Formations' },
                    ].map(s => {
                      const active = filterSections.includes(s.id)
                      return (
                        <button key={s.id}
                          onClick={() => setFilterSections(prev => active ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${active ? 'bg-amber-500/20 text-amber-600 border-amber-500/40' : 'bg-transparent text-text-muted border-border hover:border-amber-500/30 hover:text-amber-600'}`}
                        >{s.label}</button>
                      )
                    })}
                  </div>
                  <button
                    onClick={async () => {
                      setFiltering(true)
                      try {
                        const res = await cvApi.filterCV(cvDataOptimized, filterSections)
                        if (res.success && res.data) {
                          setCvDataOptimized(res.data)
                        }
                      } catch (e) {
                        console.error('Erreur filtrage:', e)
                      } finally {
                        setFiltering(false)
                      }
                    }}
                    disabled={filtering}
                    className="w-full px-4 py-2 bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-lg font-semibold text-sm hover:bg-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {filtering
                      ? <><CatLoadingAnimation label="" /><span>Condensation...</span></>
                      : <><span>🔄</span><span>{filterSections.length ? `Condenser ${filterSections.length} section${filterSections.length > 1 ? 's' : ''}` : 'Tout condenser'}</span></>
                    }
                  </button>
                  <p className="text-xs text-text-muted text-center opacity-60">
                    {filterSections.length ? 'Seules les sections sélectionnées seront condensées' : 'Sélectionne des sections ou condense tout'}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-1">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 border-2 border-border text-text-secondary rounded-lg hover:bg-surface font-medium text-sm">← Retour</button>
                  <button onClick={() => setStep(4)} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover text-sm">
                    Générer PDF →
                  </button>
                </div>
              </div>

              {/* ── Grand CV interactif ── */}
              <div className="flex-1 min-w-0 flex flex-col items-center sticky top-6">
                <div className="text-xs font-medium text-text-muted mb-2 text-center">
                  {activeBlock
                    ? <span className="text-primary font-semibold">✏ Édition : {BLOCK_LABELS[activeBlock]?.label}</span>
                    : 'Clique sur une zone pour l\'éditer'
                  }
                </div>
                <CVPreview
                  cvData={cvDataOptimized}
                  buildConfig={{ shape: 'classique', style: 'ardoise', blockStyles }}
                  scale={0.68}
                  maxPages={2}
                  interactive
                  selectedBlock={activeBlock}
                  onBlockClick={setActiveBlock}
                />
                <p className="text-xs text-text-muted text-center mt-2 opacity-50">Se met à jour en temps réel</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            ÉTAPE 4 : GÉNÉRATION PDF
        ═══════════════════════════════════════ */}
        {step === 4 && cvDataOptimized && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-1">Générer ton CV</h2>
              <p className="text-text-muted">Ton CV va être généré en PDF haute qualité, prêt à envoyer.</p>
            </div>

            {optimResult?.score_ats && (
              <div className="bg-surface rounded-xl shadow-lg shadow-black/20 p-6 flex items-center gap-6">
                <ATSScore score={optimResult.score_ats} />
                <div>
                  <h3 className="font-bold text-text-primary mb-1">Template Classique ATS</h3>
                  <p className="text-sm text-text-muted">Optimisé pour les systèmes de recrutement automatisés.</p>
                </div>
              </div>
            )}

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex gap-4">
              <div className="text-3xl">📄</div>
              <div>
                <h3 className="font-bold text-primary mb-1">Format PDF — Optimisé ATS</h3>
                <ul className="text-sm text-primary/80 space-y-1">
                  <li>✓ Format A4 universel, accepté par tous les recruteurs</li>
                  <li>✓ Compatible avec les systèmes ATS (Applicant Tracking Systems)</li>
                  <li>✓ Mise en page professionnelle basée sur tes choix</li>
                  <li>✓ Prêt à envoyer ou uploader sur les jobboards</li>
                </ul>
              </div>
            </div>

            <ErrorMessage message={localError} onClose={() => setLocalError(null)} />

            {generatedConfig && (
              <div className="bg-surface rounded-xl shadow-lg shadow-black/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text-primary text-lg">Aperçu de ton CV final</h3>
                  <span className="text-xs text-success bg-success/10 border border-success/20 rounded-full px-3 py-1 font-medium">✓ Généré</span>
                </div>
                <div className="flex justify-center overflow-auto">
                  <CVPreview
                    cvData={generatedConfig.cvData}
                    buildConfig={generatedConfig.buildConfig}
                    scale={0.65}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="px-6 py-3 border-2 border-border text-text-secondary rounded-lg hover:bg-surface font-medium">← Modifier les blocs</button>
              <div className="flex gap-3">
                {generatedConfig && (
                  <button onClick={() => { setGeneratedConfig(null); setStep(1); setProcessing(false) }}
                    className="px-6 py-3 border-2 border-border text-text-secondary rounded-lg hover:bg-surface font-medium text-sm">
                    🔄 Recommencer
                  </button>
                )}
                <button onClick={handleGenerateCV} disabled={generatingCV} className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {generatingCV ? <span className="flex items-center gap-2"><span className="inline-block animate-spin">⟳</span> Génération en cours...</span> : generatedConfig ? '⬇ Re-télécharger' : 'Télécharger mon CV (PDF)'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
