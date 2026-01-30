'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useCVOptimizer } from '@/hooks/useCVOptimizer'
import { validatePDF } from '@/lib/utils/fileHelpers'
import { downloadGeneratedCV } from '@/lib/utils/fileHelpers'
import { cvApi } from '@/lib/api/cvApi'
import ErrorMessage from '@/components/shared/ErrorMessage'
import CVTemplateSelector from '@/components/cv/CVTemplateSelector'
import TemplatePreview from '@/components/cv/TemplatePreview'

export default function OptimiseurCVPage() {
  const { user, loading } = useAuth()
  const { processing, result, error, optimizeWithForm, optimizeWithPDF } = useCVOptimizer()

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
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Mew</Link>
              <span className="text-gray-400">/</span>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Emploi</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Optimiseur CV</span>
            </div>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">← Retour</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Info box */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-purple-800">
            ℹ️ <strong>Comment ça marche :</strong> Upload ton CV PDF pour une optimisation automatique,
            ou remplis le formulaire manuellement. L'IA optimisera ton CV avec des verbes d'action, quantifications et mots-clés ATS.
          </p>
        </div>

        {/* ÉTAPE 1 : Input + Optimisation */}
        {step === 1 && (
          <>
            {/* Choix de la méthode */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comment veux-tu créer ton CV optimisé ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInputMethod('form')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'form'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-3">✍️</div>
                  <h4 className="font-semibold text-lg mb-2">Formulaire manuel</h4>
                  <p className="text-sm text-gray-600">
                    Remplis tes informations et l'IA les optimisera automatiquement.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMethod('upload')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'upload'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-4xl mb-3">📤</div>
                  <h4 className="font-semibold text-lg mb-2">Upload CV PDF</h4>
                  <p className="text-sm text-gray-600">
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
                
                {/* IDENTITÉ */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Informations personnelles</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Prénom *"
                      value={cvData.prenom}
                      onChange={(e) => handleChange('prenom', e.target.value)}
                      required
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Nom *"
                      value={cvData.nom}
                      onChange={(e) => handleChange('nom', e.target.value)}
                      required
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Intitulé du poste souhaité * (ex: Développeur Full Stack)"
                      value={cvData.titre_poste}
                      onChange={(e) => handleChange('titre_poste', e.target.value)}
                      required
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone (ex: 06 12 34 56 78)"
                      value={cvData.telephone}
                      onChange={(e) => handleChange('telephone', e.target.value)}
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={cvData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Localisation (ex: Paris, France)"
                      value={cvData.adresse}
                      onChange={(e) => handleChange('adresse', e.target.value)}
                      className="px-4 py-3 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn (optionnel)"
                      value={cvData.linkedin}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                      className="px-4 py-3 border rounded-lg"
                    />
                  </div>
                </div>

                {/* RÉSUMÉ */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Résumé professionnel</h3>
                  <textarea
                    rows={4}
                    placeholder="Présentez-vous en quelques lignes (ex: Développeur Full Stack passionné avec 5 ans d'expérience...)"
                    value={cvData.resume}
                    onChange={(e) => handleChange('resume', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                {/* EXPÉRIENCES */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">💼 Expériences professionnelles</h3>
                    <button
                      type="button"
                      onClick={() => addArrayItem('experiences', {
                        poste: '', entreprise: '', localisation: '', date_debut: '', date_fin: '', description: ''
                      })}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      + Ajouter
                    </button>
                  </div>
                  {cvData.experiences.map((exp, i) => (
                    <div key={i} className="p-4 border-2 rounded-lg space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-600">Expérience #{i + 1}</span>
                        {cvData.experiences.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem('experiences', i)} className="text-red-600 text-sm">Supprimer</button>
                        )}
                      </div>
                      <input placeholder="Intitulé du poste" value={exp.poste} onChange={(e) => handleArrayChange('experiences', i, 'poste', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Employeur" value={exp.entreprise} onChange={(e) => handleArrayChange('experiences', i, 'entreprise', e.target.value)} className="px-4 py-2 border rounded-lg" />
                        <input placeholder="Localisation" value={exp.localisation || ''} onChange={(e) => handleArrayChange('experiences', i, 'localisation', e.target.value)} className="px-4 py-2 border rounded-lg" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Date début (ex: Jan 2020)" value={exp.date_debut || ''} onChange={(e) => handleArrayChange('experiences', i, 'date_debut', e.target.value)} className="px-4 py-2 border rounded-lg" />
                        <input placeholder="Date fin (ex: Déc 2023)" value={exp.date_fin || ''} onChange={(e) => handleArrayChange('experiences', i, 'date_fin', e.target.value)} className="px-4 py-2 border rounded-lg" />
                      </div>
                      <textarea rows={4} placeholder="Description (ex: • Développé une app avec React...)" value={exp.description} onChange={(e) => handleArrayChange('experiences', i, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  ))}
                </div>

                {/* FORMATIONS */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">🎓 Formation</h3>
                    <button
                      type="button"
                      onClick={() => addArrayItem('formations', {
                        diplome: '', etablissement: '', localisation: '', date_debut: '', date_fin: '', description: ''
                      })}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      + Ajouter
                    </button>
                  </div>
                  {cvData.formations.map((form, i) => (
                    <div key={i} className="p-4 border-2 rounded-lg space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-600">Formation #{i + 1}</span>
                        {cvData.formations.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem('formations', i)} className="text-red-600 text-sm">Supprimer</button>
                        )}
                      </div>
                      <input placeholder="Nom de l'école" value={form.etablissement} onChange={(e) => handleArrayChange('formations', i, 'etablissement', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Localisation" value={form.localisation || ''} onChange={(e) => handleArrayChange('formations', i, 'localisation', e.target.value)} className="px-4 py-2 border rounded-lg" />
                        <input placeholder="Diplôme" value={form.diplome} onChange={(e) => handleArrayChange('formations', i, 'diplome', e.target.value)} className="px-4 py-2 border rounded-lg" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input placeholder="Date début" value={form.date_debut || ''} onChange={(e) => handleArrayChange('formations', i, 'date_debut', e.target.value)} className="px-4 py-2 border rounded-lg" />
                        <input placeholder="Date fin" value={form.date_fin || ''} onChange={(e) => handleArrayChange('formations', i, 'date_fin', e.target.value)} className="px-4 py-2 border rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* COMPÉTENCES */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Compétences</h3>
                  <div className="space-y-4">
                    <textarea rows={3} placeholder="Compétences techniques (ex: JavaScript, React, Python...)" value={cvData.competences_techniques} onChange={(e) => handleChange('competences_techniques', e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                    <textarea rows={2} placeholder="Soft skills (ex: Leadership, Communication...)" value={cvData.competences_soft} onChange={(e) => handleChange('competences_soft', e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                    <input placeholder="Langues (ex: Français (natif), Anglais (C1)...)" value={cvData.langues} onChange={(e) => handleChange('langues', e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                  </div>
                </div>

                {/* BOUTON SUBMIT */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg shadow-lg disabled:opacity-50"
                >
                  {processing ? '🔄 Optimisation en cours...' : '🚀 Optimiser mon CV'}
                </button>
              </form>
            )}

            {/* MODE UPLOAD */}
            {inputMethod === 'upload' && (
              <form onSubmit={handlePdfOptimization} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Upload ton CV (PDF)</h3>
                
                <div className="mb-6">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm border border-gray-300 rounded-lg bg-gray-50 p-3"
                  />
                  <p className="mt-2 text-xs text-gray-500">Format PDF uniquement, maximum 2 Mo</p>
                </div>

                {cvFile && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">✓ Fichier : <strong>{cvFile.name}</strong></p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!cvFile || processing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg shadow-lg disabled:opacity-50"
                >
                  {processing ? '🔄 Optimisation en cours...' : '🚀 Optimiser mon CV'}
                </button>
              </form>
            )}
          </>
        )}

       {/* ÉTAPE 2 : Template */}
{step === 2 && cvDataOptimized && (
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold mb-2">Choisissez votre template</h2>
    <p className="text-gray-600 mb-8">Votre CV a été optimisé ! Sélectionnez maintenant le design.</p>

    <CVTemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />

    {/* NOUVELLE PARTIE : Preview */}
    {selectedTemplate && (
      <div className="mt-8">
        <TemplatePreview template={selectedTemplate} cvData={cvDataOptimized} />
      </div>
    )}

    <div className="flex justify-between mt-8">
      <button onClick={() => setStep(1)} className="px-6 py-3 border-2 rounded-lg">← Retour</button>
      <button
        onClick={() => setStep(3)}
        disabled={!selectedTemplate}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        Continuer →
      </button>
    </div>
  </div>
)}

        {/* ÉTAPE 3 : Génération */}
        {step === 3 && cvDataOptimized && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">Générer votre CV optimisé</h2>
            <p className="text-gray-600 mb-8">Votre CV sera généré en format PDF professionnel</p>

            <div className="bg-white rounded-xl shadow p-8">
              
              {/* Info PDF */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="text-4xl mr-4">📄</div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">Format PDF - Optimisé pour les ATS</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ Format universel accepté par tous les recruteurs</li>
                      <li>✓ Compatible avec les systèmes de tracking (ATS)</li>
                      <li>✓ Mise en page professionnelle et épurée</li>
                      <li>✓ Prêt à être envoyé par email ou uploadé sur les sites d'emploi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <ErrorMessage message={localError} onClose={() => setLocalError(null)} />

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setStep(2)} 
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  ← Retour au template
                </button>
                <button
                  onClick={handleGenerateCV}
                  disabled={generatingCV}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {generatingCV ? (
                    <>
                      <span className="inline-block animate-spin mr-2">🔄</span>
                      Génération en cours...
                    </>
                  ) : (
                    '📥 Télécharger mon CV (PDF)'
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