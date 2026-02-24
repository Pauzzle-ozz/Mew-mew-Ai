'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { validatePDF } from '@/lib/utils/fileHelpers'
import { supabase } from '@/lib/supabase'
import ErrorMessage from '@/components/shared/ErrorMessage'
import Header from '@/components/shared/Header'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import ToolHistory from '@/components/shared/ToolHistory'
import { saveHistoryEntry } from '@/lib/api/historyApi'

/* ─── Stepper ─────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: 'Upload CV' },
  { n: 2, label: 'Résultats' },
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

/* ─── Bouton copier avec feedback ─────────────────────── */
function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback pour les navigateurs qui ne supportent pas clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        copied
          ? 'bg-success/20 text-success border border-success/30'
          : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
      }`}
    >
      {copied ? '✓ Copié !' : `Copier ${label || ''}`}
    </button>
  )
}

/* ─── Section de texte optimisé ───────────────────────── */
function OptimizedSection({ title, icon, originalText, optimizedText }) {
  const [showOriginal, setShowOriginal] = useState(false)

  if (!optimizedText) return null

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <h3 className="font-semibold text-text-primary text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {originalText && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {showOriginal ? '▲ Masquer original' : '▼ Voir original'}
            </button>
          )}
          <CopyButton text={optimizedText} />
        </div>
      </div>

      {/* Original (collapsible) */}
      {showOriginal && originalText && (
        <div className="mb-3 p-3 bg-red-50/5 border border-red-500/15 rounded-lg">
          <div className="text-xs font-bold text-red-400 uppercase mb-1.5">Avant</div>
          <p className="text-xs text-text-muted whitespace-pre-line leading-relaxed">{originalText}</p>
        </div>
      )}

      {/* Optimisé */}
      <div className="p-3 bg-success/5 border border-success/15 rounded-lg">
        {showOriginal && <div className="text-xs font-bold text-success uppercase mb-1.5">Après (optimisé)</div>}
        <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">{optimizedText}</p>
      </div>
    </div>
  )
}

/* ─── Formater les expériences en texte copiable ──────── */
function formatExperiences(experiences) {
  if (!experiences?.length) return ''
  return experiences.map(exp => {
    const lines = []
    if (exp.poste) lines.push(exp.poste)
    const meta = [exp.entreprise, exp.localisation, [exp.date_debut, exp.date_fin].filter(Boolean).join(' - ')].filter(Boolean).join(' | ')
    if (meta) lines.push(meta)
    if (exp.description) lines.push(exp.description)
    return lines.join('\n')
  }).join('\n\n')
}

function formatFormations(formations) {
  if (!formations?.length) return ''
  return formations.map(f => {
    const lines = []
    if (f.diplome) lines.push(f.diplome)
    const meta = [f.etablissement, f.localisation, f.date_fin].filter(Boolean).join(' | ')
    if (meta) lines.push(meta)
    return lines.join('\n')
  }).join('\n\n')
}

/* ─── Page principale ─────────────────────────────────── */
export default function OptimiseurCVPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState(1)

  // Étape 1 : upload
  const [cvFile, setCvFile] = useState(null)
  const [posteCible, setPosteCible] = useState('')
  const [localError, setLocalError] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Étape 2 : résultats
  const [optimResult, setOptimResult] = useState(null)
  const [cvDataOptimized, setCvDataOptimized] = useState(null)

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  /* ── Étape 1 : Upload + Optimisation ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0]; if (!file) return
    setLocalError(null)
    try { validatePDF(file); setCvFile(file) } catch (err) { setLocalError(err.message); setCvFile(null) }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    setLocalError(null)
    try { validatePDF(file); setCvFile(file) } catch (err) { setLocalError(err.message); setCvFile(null) }
  }

  const _goToStep2 = (data) => {
    setOptimResult({ score_ats: data.score_ats, points_forts: data.points_forts, ameliorations: data.ameliorations })
    setCvDataOptimized(data.cvData_optimise)
    setProcessing(false)
    setStep(2)

    // Sauvegarde historique (fire-and-forget)
    const nom = data.cvData_optimise?.prenom || ''
    const prenom = data.cvData_optimise?.nom || ''
    saveHistoryEntry({
      userId: user.id,
      toolType: 'optimiseur-cv',
      title: `Optimisation CV - ${nom} ${prenom}`.trim(),
      inputSummary: { poste_cible: posteCible || data.cvData_optimise?.titre_poste, methode: 'upload' },
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Chargement...</div>

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} breadcrumbs={[{ label: 'Emploi', href: '/dashboard' }, { label: 'Optimiseur CV' }]} />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
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
            ÉTAPE 1 : UPLOAD PDF + OPTIMISATION
        ═══════════════════════════════════════ */}
        {step === 1 && (
          <>
            {processing && (
              <div className="bg-surface rounded-xl shadow-lg shadow-black/20 p-6">
                <CatLoadingAnimation label="Analyse et optimisation du CV en cours" />
              </div>
            )}

            {!processing && (
              <>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary">
                    <strong>Comment ça marche :</strong> Upload ton CV PDF (fait sur Canva, CV Maker, etc.).
                    L'IA analyse et optimise le texte pour les ATS, puis te donne les sections optimisées à copier-coller dans ton éditeur.
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

                <ErrorMessage message={localError} onClose={() => setLocalError(null)} />

                {/* Zone upload PDF drag & drop */}
                <form onSubmit={handlePdfOptimization} className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Upload ton CV (PDF)</h3>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-4 ${
                      isDragging ? 'border-primary bg-primary/5' :
                      cvFile ? 'border-success bg-success/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => document.getElementById('cv-upload').click()}
                  >
                    <input id="cv-upload" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                    {cvFile ? (
                      <div className="space-y-2">
                        <div className="text-3xl">📄</div>
                        <p className="text-sm font-medium text-success">{cvFile.name}</p>
                        <p className="text-xs text-text-muted">{(cvFile.size / 1024).toFixed(0)} Ko — Cliquer pour changer</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-4xl">📎</div>
                        <p className="font-medium text-text-primary">Glisse ton CV PDF ici</p>
                        <p className="text-sm text-text-muted">ou clique pour sélectionner — Max 2 Mo</p>
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={!cvFile || processing} className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg shadow-lg shadow-black/20 disabled:opacity-50 hover:bg-primary-hover transition-colors">
                    Optimiser mon CV avec l'IA
                  </button>
                </form>
              </>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════
            ÉTAPE 2 : RÉSULTATS (texte par section + copier)
        ═══════════════════════════════════════ */}
        {step === 2 && optimResult && cvDataOptimized && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-1">Résultats de l'optimisation</h2>
              <p className="text-text-muted">Copie chaque section optimisée dans ton éditeur de CV (Canva, CV Maker, etc.).</p>
            </div>

            {/* Score ATS + Points forts + Améliorations */}
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

            {/* Sections optimisées */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Texte optimisé par section</h3>
                <CopyButton
                  text={[
                    cvDataOptimized.titre_poste && `Titre: ${cvDataOptimized.titre_poste}`,
                    cvDataOptimized.resume && `\nRésumé:\n${cvDataOptimized.resume}`,
                    cvDataOptimized.experiences?.length && `\nExpériences:\n${formatExperiences(cvDataOptimized.experiences)}`,
                    cvDataOptimized.formations?.length && `\nFormations:\n${formatFormations(cvDataOptimized.formations)}`,
                    cvDataOptimized.competences_techniques && `\nCompétences techniques:\n${cvDataOptimized.competences_techniques}`,
                    cvDataOptimized.competences_soft && `\nSoft skills / Qualifications:\n${cvDataOptimized.competences_soft}`,
                    cvDataOptimized.langues && `\nLangues:\n${cvDataOptimized.langues}`,
                  ].filter(Boolean).join('\n')}
                  label="tout"
                />
              </div>

              {/* Titre du poste */}
              {cvDataOptimized.titre_poste && (
                <div className="bg-surface rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏷️</span>
                      <h3 className="font-semibold text-text-primary text-sm">Titre du poste</h3>
                    </div>
                    <CopyButton text={cvDataOptimized.titre_poste} />
                  </div>
                  <div className="p-3 bg-success/5 border border-success/15 rounded-lg">
                    <p className="text-sm text-text-secondary font-medium">{cvDataOptimized.titre_poste}</p>
                  </div>
                </div>
              )}

              <OptimizedSection
                title="Résumé professionnel"
                icon="📝"
                optimizedText={cvDataOptimized.resume}
              />

              {cvDataOptimized.experiences?.length > 0 && (
                <OptimizedSection
                  title="Expériences professionnelles"
                  icon="💼"
                  optimizedText={formatExperiences(cvDataOptimized.experiences)}
                />
              )}

              {cvDataOptimized.formations?.length > 0 && (
                <OptimizedSection
                  title="Formations"
                  icon="🎓"
                  optimizedText={formatFormations(cvDataOptimized.formations)}
                />
              )}

              <OptimizedSection
                title="Compétences techniques"
                icon="⚡"
                optimizedText={cvDataOptimized.competences_techniques}
              />

              <OptimizedSection
                title="Soft skills / Qualifications"
                icon="🤝"
                optimizedText={cvDataOptimized.competences_soft}
              />

              <OptimizedSection
                title="Langues"
                icon="🌍"
                optimizedText={cvDataOptimized.langues}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button onClick={() => { setStep(1); setCvFile(null); setOptimResult(null); setCvDataOptimized(null) }}
                className="px-6 py-3 border-2 border-border text-text-secondary rounded-lg hover:bg-surface font-medium">
                Recommencer
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
