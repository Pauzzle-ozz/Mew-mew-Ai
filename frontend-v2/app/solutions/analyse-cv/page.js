'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useCVAnalyzer } from '@/hooks/useCVAnalyzer'
import { validatePDF } from '@/lib/utils/fileHelpers'
import ErrorMessage from '@/components/shared/ErrorMessage'
import ResultsDisplay from '@/components/cv/ResultsDisplay'
import AnalyzerForm from '@/components/cv/AnalyzerForm'

export default function AnalyseCVPage() {
  const { user, loading } = useAuth()
  const { processing, result, error, analyzeWithForm, analyzeWithPDF } = useCVAnalyzer()

  const [inputMethod, setInputMethod] = useState('upload') // 'upload' ou 'form'
  const [cvFile, setCvFile] = useState(null)
  const [localError, setLocalError] = useState(null)

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    niveau_experience: 'Junior',
    annees_experience: '',
    statut: 'En recherche active',
    experience: '',
    competences_principales: '',
    outils: '',
    soft_skills: '',
    secteur_preferentiel: '',
    type_poste: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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

  const handlePdfAnalysis = async (e) => {
    e.preventDefault()

    if (!cvFile) {
      setLocalError('Veuillez sélectionner un fichier CV')
      return
    }

    try {
      await analyzeWithPDF(cvFile, user.id)
    } catch (err) {
      // Erreur déjà gérée par le hook
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      await analyzeWithForm(formData, user.id)
    } catch (err) {
      // Erreur déjà gérée par le hook
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Mew
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Emploi</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Analyseur CV</span>
            </div>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Retour
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Comment ça marche :</strong> Upload ton CV PDF pour une analyse automatique, 
            ou remplis le formulaire manuellement.
          </p>
        </div>

        {/* Résultats (si présents) */}
        {result ? (
          <ResultsDisplay result={result} />
        ) : (
          <>
            {/* Choix de la méthode */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comment veux-tu fournir tes informations ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInputMethod('upload')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'upload'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-3">📎</div>
                  <h4 className="font-semibold text-lg mb-2">Upload CV PDF</h4>
                  <p className="text-sm text-gray-600">
                    Rapide et automatique. L'IA extrait et analyse ton CV directement.
                  </p>
                </button>

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
                    Remplis tes informations pas à pas. Idéal si tu n'as pas de CV PDF.
                  </p>
                </button>
              </div>
            </div>

            {/* Erreurs */}
            <ErrorMessage message={localError || error} onClose={() => setLocalError(null)} />

            {/* MODE UPLOAD */}
            {inputMethod === 'upload' && (
              <form onSubmit={handlePdfAnalysis} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📎 Upload ton CV (PDF)
                </h3>
                
                <div className="mb-6">
                  <label className="block">
                    <span className="sr-only">Choisir un fichier CV</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-3"
                    />
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    Format PDF uniquement, maximum 2 Mo
                  </p>
                </div>

                {cvFile && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Fichier sélectionné : <strong>{cvFile.name}</strong>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!cvFile || processing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? '🔄 Analyse en cours...' : '🚀 Analyser mon CV'}
                </button>
              </form>
            )}

            {/* MODE FORMULAIRE */}
            {inputMethod === 'form' && (
              <AnalyzerForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleFormSubmit}
                processing={processing}
              />
            )}
          </>
        )}

      </main>
    </div>
  )
}