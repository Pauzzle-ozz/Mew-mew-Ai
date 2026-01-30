'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useCVOptimizer } from '@/hooks/useCVOptimizer'
import { cvApi } from '@/lib/api/cvApi'
import { parseCV, countExtractedFields } from '@/lib/utils/cvParser'
import { validatePDF, downloadGeneratedCV } from '@/lib/utils/fileHelpers'
import ProgressBar from '@/components/shared/ProgressBar'
import ErrorMessage from '@/components/shared/ErrorMessage'
import CVTemplateSelector from '@/components/cv/CVTemplateSelector'
import CVFormIdentity from '@/components/cv/CVFormIdentity'
import FormatSelector from '@/components/cv/FormatSelector'

export default function OptimiseurCVPage() {
  const { user, loading } = useAuth()
  const { optimizeCV, processing, error: optimizerError } = useCVOptimizer()
  
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [error, setError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [generatingCV, setGeneratingCV] = useState(false)
  
  const [selectedFormats, setSelectedFormats] = useState({ pdf: true, docx: true })

  const [cvData, setCvData] = useState({
    prenom: '', nom: '', titre_poste: '', email: '', telephone: '',
    adresse: '', linkedin: '', site_web: '', resume: '',
    experiences: [{ poste: '', entreprise: '', periode: '', description: '' }],
    formations: [{ diplome: '', etablissement: '', annee: '', description: '' }],
    competences_techniques: '', competences_soft: '', langues: '', interets: ''
  })

  const handleChange = (field, value) => setCvData({ ...cvData, [field]: value })

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError(null)
    try {
      validatePDF(file)
      const result = await cvApi.extractCV(file)
      
      if (result.success) {
        const parsedData = parseCV(result.data.texte_brut)
        setCvData({ ...cvData, ...parsedData })
        setUploadSuccess(true)
        alert(`✅ CV extrait avec succès !\n\n${countExtractedFields(parsedData)} champs pré-remplis.`)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleOptimize = async () => {
    try {
      const optimizedData = await optimizeCV(cvData)
      setCvData(optimizedData)
      
      alert(
        '✅ CV optimisé avec succès !\n\n' +
        '🎯 Améliorations appliquées :\n' +
        '• Verbes d\'action ajoutés\n' +
        '• Résultats quantifiés\n' +
        '• Mots-clés ATS intégrés\n' +
        '• Résumé optimisé'
      )
      
      setStep(4)
    } catch (err) {
      // Erreur gérée par le hook
    }
  }

  const handleGenerateCV = async () => {
    setGeneratingCV(true)
    setError(null)

    try {
      if (!cvData.prenom || !cvData.nom || !cvData.titre_poste) {
        throw new Error('Prénom, nom et titre de poste sont obligatoires')
      }

      if (!selectedFormats.pdf && !selectedFormats.docx) {
        throw new Error('Sélectionnez au moins un format')
      }

      const result = await cvApi.generateCV(cvData, selectedTemplate, ['pdf', 'docx'])

      if (result.success) {
        const downloaded = downloadGeneratedCV(result, selectedFormats)
        if (downloaded.length > 0) {
          alert(`✅ CV généré avec succès ! (${downloaded.join(' + ')})`)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setGeneratingCV(false)
    }
  }

  const steps = [
    { num: 1, label: 'Mode' },
    { num: 2, label: 'Données' },
    { num: 3, label: 'IA' },
    { num: 4, label: 'Template' },
    { num: 5, label: 'Génération' }
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

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

      <ProgressBar currentStep={step} steps={steps} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ÉTAPE 1 : Mode */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Comment souhaitez-vous créer votre CV ?</h2>
            <p className="text-gray-600 mb-8">Choisissez votre méthode préférée</p>

            <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => { setMode('nouveau'); setStep(2); }} className="group bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all text-left">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600">Créer un nouveau CV</h3>
                <p className="text-gray-600">Remplissez un formulaire et laissez l'IA structurer votre CV</p>
              </button>

              <button onClick={() => { setMode('import'); setStep(2); }} className="group bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all text-left">
                <div className="text-5xl mb-4">📤</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600">Importer un CV existant</h3>
                <p className="text-gray-600">Uploadez votre CV et l'IA l'améliorera automatiquement</p>
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Données */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'nouveau' ? 'Vos informations' : 'Importer votre CV'}
            </h2>
            <p className="text-gray-600 mb-8">
              {mode === 'nouveau' ? 'Remplissez vos informations' : 'Uploadez votre CV'}
            </p>

            {mode === 'import' && (
              <div className="bg-white rounded-xl shadow p-8">
                <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl mb-6">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">📤 Importer votre CV</h3>
                  <input type="file" accept=".pdf" onChange={handleFileUpload} className="block w-full text-sm border border-purple-300 rounded-lg bg-white p-3" />
                </div>

                <ErrorMessage message={error} onClose={() => setError(null)} />

                <div className="flex justify-between pt-6 border-t">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">← Retour</button>
                  <button onClick={() => setStep(3)} disabled={!uploadSuccess} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Continuer →</button>
                </div>
              </div>
            )}

            {mode === 'nouveau' && (
              <div className="bg-white rounded-xl shadow p-8 space-y-8">
                <CVFormIdentity data={cvData} onChange={handleChange} />

                <div>
                  <h3 className="text-xl font-bold mb-4">Résumé professionnel</h3>
                  <textarea rows={4} placeholder="Décrivez-vous..." value={cvData.resume} onChange={(e) => handleChange('resume', e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                </div>

                {/* Expériences (version compacte) */}
                <div>
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Expériences</h3>
                    <button onClick={() => addArrayItem('experiences', { poste: '', entreprise: '', periode: '', description: '' })} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">+ Ajouter</button>
                  </div>
                  {cvData.experiences.map((exp, i) => (
                    <div key={i} className="p-4 border-2 rounded-lg space-y-3 mb-4">
                      <input placeholder="Poste" value={exp.poste} onChange={(e) => handleArrayChange('experiences', i, 'poste', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                      <input placeholder="Entreprise" value={exp.entreprise} onChange={(e) => handleArrayChange('experiences', i, 'entreprise', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                      <textarea placeholder="Description" value={exp.description} onChange={(e) => handleArrayChange('experiences', i, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-6 border-t">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">← Retour</button>
                  <button onClick={() => setStep(3)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Continuer →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 3 : IA */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">🤖 Optimisation IA</h2>
            <p className="text-gray-600 mb-8">L'IA va améliorer votre CV</p>

            <div className="bg-white rounded-xl shadow p-8">
              <div className="text-center py-8">
                <button onClick={handleOptimize} disabled={processing} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg shadow-lg disabled:opacity-50">
                  {processing ? '🔄 En cours...' : '🚀 Lancer l\'optimisation'}
                </button>
              </div>

              <ErrorMessage message={optimizerError} />

              <div className="flex justify-between pt-6 border-t">
                <button onClick={() => setStep(2)} className="px-6 py-3 border-2 rounded-lg">← Retour</button>
                <button onClick={() => setStep(4)} className="px-6 py-3 bg-gray-600 text-white rounded-lg">Passer →</button>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Template */}
        {step === 4 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">Choisissez votre template</h2>
            <p className="text-gray-600 mb-8">Sélectionnez le style</p>

            <CVTemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(3)} className="px-6 py-3 border-2 rounded-lg">← Retour</button>
              <button onClick={() => setStep(5)} disabled={!selectedTemplate} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">Continuer →</button>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : Génération */}
        {step === 5 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">Générer votre CV</h2>
            <p className="text-gray-600 mb-8">Choisissez les formats</p>

            <div className="bg-white rounded-xl shadow p-8">
              <FormatSelector selectedFormats={selectedFormats} onChange={setSelectedFormats} />

              <ErrorMessage message={error} onClose={() => setError(null)} />

              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(4)} className="px-6 py-3 border-2 rounded-lg">← Retour</button>
                <button onClick={handleGenerateCV} disabled={generatingCV} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold shadow-lg disabled:opacity-50">
                  {generatingCV ? 'Génération...' : '🚀 Générer'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}