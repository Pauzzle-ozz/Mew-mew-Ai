'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCVOptimizer } from '@/hooks/useCVOptimizer'
import { validatePDF } from '@/lib/utils/fileHelpers'
import { downloadGeneratedCV } from '@/lib/utils/fileHelpers'
import { cvApi } from '@/lib/api/cvApi'
import { supabase } from '@/lib/supabase'
import ErrorMessage from '@/components/shared/ErrorMessage'
import CVTemplateSelector from '@/components/cv/CVTemplateSelector'
import TemplatePreview from '@/components/cv/TemplatePreview'
import Header from '@/components/shared/Header'
import CatMascot from '@/components/shared/CatMascot'

export default function OptimiseurCVPage() {
  const { user, loading } = useAuth()
  const { processing, result, error, optimizeWithForm, optimizeWithPDF } = useCVOptimizer()
  const router = useRouter()

  const [inputMethod, setInputMethod] = useState('form') // 'form' ou 'upload'
  const [cvFile, setCvFile] = useState(null)
  const [localError, setLocalError] = useState(null)

  // Données du CV optimisé (résultat)
  const [cvDataOptimized, setCvDataOptimized] = useState(null)

  // Étape actuelle (1: Input, 2: Template, 3: Génération)
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [generatingCV, setGeneratingCV] = useState(false)

  // Données du formulaire
  const [cvData, setCvData] = useState({
    prenom: '', nom: '', titre_poste: '', email: '', telephone: '',
    adresse: '', linkedin: '', site_web: '', resume: '',
    experiences: [{
      poste: '',
      entreprise: '',
      localisation: '',
      date_debut: '',
      date_fin: '',
      description: ''
    }],
    formations: [{
      diplome: '',
      etablissement: '',
      localisation: '',
      date_debut: '',
      date_fin: '',
      description: ''
    }],
    competences_techniques: '', competences_soft: '', langues: '', interets: ''
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleChange = (field, value) => {
    setCvData({ ...cvData, [field]: value })
  }

  const handleArrayChange = (array, index, field, value) => {
    const newArray = [...cvData[array]]
    newArray[index][field] = value
    setCvData({ ...cvData, [array]: newArray })
  }

  const addArrayItem = (array, template) => {
    setCvData({ ...cvData, [array]: [...cvData[array], template] })
  }

  const removeArrayItem = (array, index) => {
    setCvData({ ...cvData, [array]: cvData[array].filter((_, i) => i !== index) })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLocalError(null)

    try {
      validatePDF(file)
      setCvFile(file)
    } catch (err) {
      setLocalError(err.message)
      setCvFile(null)
    }
  }

  const handlePdfOptimization = async (e) => {
    e.preventDefault()

    if (!cvFile) {
      setLocalError('Veuillez sélectionner un fichier CV')
      return
    }

    try {
      console.log('📄 [PAGE] Début optimisation PDF...')
      const optimizedData = await optimizeWithPDF(cvFile, user.id)
      console.log('✅ [PAGE] Données optimisées reçues:', optimizedData)
      setCvDataOptimized(optimizedData)
      setStep(2) // Passer à la sélection de template
    } catch (err) {
      console.error('❌ [PAGE] Erreur PDF:', err)
      // Erreur déjà gérée par le hook
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log('📋 [PAGE] Début optimisation formulaire...')
      console.log('📋 [PAGE] Données envoyées:', cvData)
      const optimizedData = await optimizeWithForm(cvData, user.id)
      console.log('✅ [PAGE] Données optimisées reçues:', optimizedData)
      setCvDataOptimized(optimizedData)
      setStep(2) // Passer à la sélection de template
    } catch (err) {
      console.error('❌ [PAGE] Erreur formulaire:', err)
      // Erreur déjà gérée par le hook
    }
  }

 const handleGenerateCV = async () => {
    setGeneratingCV(true)
    setLocalError(null)

    try {
      if (!cvDataOptimized) {
        throw new Error('Aucune donnée optimisée disponible')
      }

      if (!selectedTemplate) {
        throw new Error('Veuillez sélectionner un template')
      }

      console.log('📥 [PAGE] Génération du CV PDF...')
      const result = await cvApi.generateCV(cvDataOptimized, selectedTemplate)

      if (result.success) {
        const format = downloadGeneratedCV(result)
        alert(`✅ CV généré avec succès ! (${format} téléchargé)`)
      }
    } catch (err) {
      console.error('❌ [PAGE] Erreur génération:', err)
      setLocalError(err.message)
    } finally {
      setGeneratingCV(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <Header user={user} onLogout={handleLogout} breadcrumbs={[{ label: 'Emploi', href: '/dashboard' }, { label: 'Optimiseur CV' }]} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Info box */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-primary">
            <strong>Comment ca marche :</strong> Upload ton CV PDF pour une optimisation automatique,
            ou remplis le formulaire manuellement. L'IA optimisera ton CV avec des verbes d'action, quantifications et mots-cles ATS.
          </p>
        </div>

        {/* ETAPE 1 : Input + Optimisation */}
        {step === 1 && (
          <>
            {/* Choix de la methode */}
            <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Comment veux-tu creer ton CV optimise ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInputMethod('form')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'form'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-4xl mb-3">✍️</div>
                  <h4 className="font-semibold text-lg mb-2 text-text-primary">Formulaire manuel</h4>
                  <p className="text-sm text-text-muted">
                    Remplis tes informations et l'IA les optimisera automatiquement.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMethod('upload')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'upload'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-4xl mb-3">📤</div>
                  <h4 className="font-semibold text-lg mb-2 text-text-primary">Upload CV PDF</h4>
                  <p className="text-sm text-text-muted">
                    Upload ton CV et l'IA l'extraira et l'optimisera directement.
                  </p>
                </button>
              </div>
            </div>

            {/* Erreurs */}
            <ErrorMessage message={localError || error} onClose={() => setLocalError(null)} />

            {/* MODE FORMULAIRE */}
            {inputMethod === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-6">

                {/* IDENTITE */}
                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Informations personnelles</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Prenom *"
                      value={cvData.prenom}
                      onChange={(e) => handleChange('prenom', e.target.value)}
                      required
                      className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Nom *"
                      value={cvData.nom}
                      onChange={(e) => handleChange('nom', e.target.value)}
                      required
                      className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Intitule du poste souhaite * (ex: Developpeur Full Stack)"
                      value={cvData.titre_poste}
                      onChange={(e) => handleChange('titre_poste', e.target.value)}
                      required
                      className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none md:col-span-2"
                    />
                    <input
                      type="tel"
                      placeholder="Telephone (ex: 06 12 34 56 78)"
                      value={cvData.telephone}
                      onChange={(e) => handleChange('telephone', e.target.value)}
                      className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={cvData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Localisation (ex: Paris, France)"
                      value={cvData.adresse}
                      onChange={(e) => handleChange('adresse', e.target.value)}
                      className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn (optionnel)"
                      value={cvData.linkedin}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                      className="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none"
                    />
                  </div>
                </div>

                {/* RESUME */}
                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Resume professionnel</h3>
                  <textarea
                    rows={4}
                    placeholder="Presentez-vous en quelques lignes (ex: Developpeur Full Stack passionne avec 5 ans d'experience...)"
                    value={cvData.resume}
                    onChange={(e) => handleChange('resume', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none"
                  />
                </div>

                {/* EXPERIENCES */}
                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Experiences professionnelles</h3>
                    <button
                      type="button"
                      onClick={() => addArrayItem('experiences', {
                        poste: '', entreprise: '', localisation: '', date_debut: '', date_fin: '', description: ''
                      })}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                    >
                      + Ajouter
                    </button>
                  </div>
                  {cvData.experiences.map((exp, i) => (
                    <div key={i} className="p-4 border-2 border-border rounded-lg space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-text-muted">Experience #{i + 1}</span>
                        {cvData.experiences.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem('experiences', i)} className="text-error text-sm">Supprimer</button>
                        )}
                      </div>
                      <input placeholder="Intitule du poste" value={exp.poste} onChange={(e) => handleArrayChange('experiences', i, 'poste', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Employeur" value={exp.entreprise} onChange={(e) => handleArrayChange('experiences', i, 'entreprise', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Localisation" value={exp.localisation || ''} onChange={(e) => handleArrayChange('experiences', i, 'localisation', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Date debut (ex: Jan 2020)" value={exp.date_debut || ''} onChange={(e) => handleArrayChange('experiences', i, 'date_debut', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Date fin (ex: Dec 2023)" value={exp.date_fin || ''} onChange={(e) => handleArrayChange('experiences', i, 'date_fin', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      </div>
                      <textarea rows={4} placeholder="Description (ex: - Developpe une app avec React...)" value={exp.description} onChange={(e) => handleArrayChange('experiences', i, 'description', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                    </div>
                  ))}
                </div>

                {/* FORMATIONS */}
                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Formation</h3>
                    <button
                      type="button"
                      onClick={() => addArrayItem('formations', {
                        diplome: '', etablissement: '', localisation: '', date_debut: '', date_fin: '', description: ''
                      })}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                    >
                      + Ajouter
                    </button>
                  </div>
                  {cvData.formations.map((form, i) => (
                    <div key={i} className="p-4 border-2 border-border rounded-lg space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-text-muted">Formation #{i + 1}</span>
                        {cvData.formations.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem('formations', i)} className="text-error text-sm">Supprimer</button>
                        )}
                      </div>
                      <input placeholder="Nom de l'ecole" value={form.etablissement} onChange={(e) => handleArrayChange('formations', i, 'etablissement', e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Localisation" value={form.localisation || ''} onChange={(e) => handleArrayChange('formations', i, 'localisation', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Diplome" value={form.diplome} onChange={(e) => handleArrayChange('formations', i, 'diplome', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Date debut" value={form.date_debut || ''} onChange={(e) => handleArrayChange('formations', i, 'date_debut', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                        <input placeholder="Date fin" value={form.date_fin || ''} onChange={(e) => handleArrayChange('formations', i, 'date_fin', e.target.value)} className="px-4 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* COMPETENCES */}
                <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Competences</h3>
                  <div className="space-y-4">
                    <textarea rows={3} placeholder="Competences techniques (ex: JavaScript, React, Python...)" value={cvData.competences_techniques} onChange={(e) => handleChange('competences_techniques', e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                    <textarea rows={2} placeholder="Soft skills (ex: Leadership, Communication...)" value={cvData.competences_soft} onChange={(e) => handleChange('competences_soft', e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                    <input placeholder="Langues (ex: Francais (natif), Anglais (C1)...)" value={cvData.langues} onChange={(e) => handleChange('langues', e.target.value)} className="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary placeholder-text-muted outline-none" />
                  </div>
                </div>

                {/* BOUTON SUBMIT */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full px-6 py-4 bg-primary text-gray-900 rounded-lg font-bold text-lg shadow-lg shadow-black/20 disabled:opacity-50 hover:bg-primary-hover transition-colors"
                >
                  {processing ? 'Optimisation en cours...' : 'Optimiser mon CV'}
                </button>
              </form>
            )}

            {/* MODE UPLOAD */}
            {inputMethod === 'upload' && (
              <form onSubmit={handlePdfOptimization} className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Upload ton CV (PDF)</h3>

                <div className="mb-6">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm border border-border rounded-lg bg-surface-elevated text-text-primary p-3"
                  />
                  <p className="mt-2 text-xs text-text-muted">Format PDF uniquement, maximum 2 Mo</p>
                </div>

                {cvFile && (
                  <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm text-success">✓ Fichier : <strong>{cvFile.name}</strong></p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!cvFile || processing}
                  className="w-full px-6 py-4 bg-primary text-gray-900 rounded-lg font-bold text-lg shadow-lg shadow-black/20 disabled:opacity-50 hover:bg-primary-hover transition-colors"
                >
                  {processing ? 'Optimisation en cours...' : 'Optimiser mon CV'}
                </button>
              </form>
            )}
          </>
        )}

       {/* ETAPE 2 : Template */}
{step === 2 && cvDataOptimized && (
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold mb-2 text-text-primary">Choisissez votre template</h2>
    <p className="text-text-muted mb-8">Votre CV a ete optimise ! Selectionnez maintenant le design.</p>

    <CVTemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />

    {/* NOUVELLE PARTIE : Preview */}
    {selectedTemplate && (
      <div className="mt-8">
        <TemplatePreview template={selectedTemplate} cvData={cvDataOptimized} />
      </div>
    )}

    <div className="flex justify-between mt-8">
      <button onClick={() => setStep(1)} className="px-6 py-3 border-2 border-border text-text-secondary rounded-lg hover:bg-surface transition-colors">← Retour</button>
      <button
        onClick={() => setStep(3)}
        disabled={!selectedTemplate}
        className="px-6 py-3 bg-primary text-gray-900 rounded-lg disabled:opacity-50 font-medium hover:bg-primary-hover transition-colors"
      >
        Continuer →
      </button>
    </div>
  </div>
)}

        {/* ETAPE 3 : Generation */}
        {step === 3 && cvDataOptimized && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-text-primary">Generer votre CV optimise</h2>
            <p className="text-text-muted mb-8">Votre CV sera genere en format PDF professionnel</p>

            <div className="bg-surface rounded-xl shadow-lg shadow-black/20 p-8">

              {/* Info PDF */}
              <div className="mb-6 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start">
                  <div className="text-4xl mr-4">📄</div>
                  <div>
                    <h3 className="font-bold text-primary mb-2">Format PDF - Optimise pour les ATS</h3>
                    <ul className="text-sm text-primary/80 space-y-1">
                      <li>✓ Format universel accepte par tous les recruteurs</li>
                      <li>✓ Compatible avec les systemes de tracking (ATS)</li>
                      <li>✓ Mise en page professionnelle et epuree</li>
                      <li>✓ Pret a etre envoye par email ou uploade sur les sites d'emploi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <ErrorMessage message={localError} onClose={() => setLocalError(null)} />

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border-2 border-border text-text-secondary rounded-lg hover:bg-surface font-medium transition-all"
                >
                  ← Retour au template
                </button>
                <button
                  onClick={handleGenerateCV}
                  disabled={generatingCV}
                  className="px-8 py-4 bg-primary text-gray-900 rounded-lg font-bold text-lg shadow-lg shadow-black/20 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {generatingCV ? (
                    <>
                      <span className="inline-block animate-spin mr-2">🔄</span>
                      Generation en cours...
                    </>
                  ) : (
                    'Telecharger mon CV (PDF)'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
