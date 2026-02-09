'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCVAnalyzer } from '@/hooks/useCVAnalyzer'
import { validatePDF } from '@/lib/utils/fileHelpers'
import { supabase } from '@/lib/supabase'
import ErrorMessage from '@/components/shared/ErrorMessage'
import ResultsDisplay from '@/components/cv/ResultsDisplay'
import AnalyzerForm from '@/components/cv/AnalyzerForm'
import Header from '@/components/shared/Header'
import CatMascot from '@/components/shared/CatMascot'

export default function AnalyseCVPage() {
  const { user, loading } = useAuth()
  const { processing, result, error, analyzeWithForm, analyzeWithPDF } = useCVAnalyzer()
  const router = useRouter()

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <CatMascot size="lg" animate={true} />
        <p className="text-text-muted">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Emploi', href: '/dashboard' },
          { label: 'Analyseur CV' }
        ]}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Info box */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-primary">
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
            <div className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Comment veux-tu fournir tes informations ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInputMethod('upload')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    inputMethod === 'upload'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-4xl mb-3">📎</div>
                  <h4 className="font-semibold text-lg text-text-primary mb-2">Upload CV PDF</h4>
                  <p className="text-sm text-text-muted">
                    Rapide et automatique. L'IA extrait et analyse ton CV directement.
                  </p>
                </button>

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
                  <h4 className="font-semibold text-lg text-text-primary mb-2">Formulaire manuel</h4>
                  <p className="text-sm text-text-muted">
                    Remplis tes informations pas à pas. Idéal si tu n'as pas de CV PDF.
                  </p>
                </button>
              </div>
            </div>

            {/* Erreurs */}
            <ErrorMessage message={localError || error} onClose={() => setLocalError(null)} />

            {/* MODE UPLOAD */}
            {inputMethod === 'upload' && (
              <form onSubmit={handlePdfAnalysis} className="bg-surface rounded-lg shadow-lg shadow-black/20 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  📎 Upload ton CV (PDF)
                </h3>

                <div className="mb-6">
                  <label className="block">
                    <span className="sr-only">Choisir un fichier CV</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-text-primary border border-border rounded-lg cursor-pointer bg-background focus:outline-none p-3"
                    />
                  </label>
                  <p className="mt-2 text-xs text-text-muted">
                    Format PDF uniquement, maximum 2 Mo
                  </p>
                </div>

                {cvFile && (
                  <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm text-success">
                      ✓ Fichier sélectionné : <strong>{cvFile.name}</strong>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!cvFile || processing}
                  className="w-full px-6 py-4 bg-primary text-gray-900 rounded-lg hover:bg-primary-hover font-bold text-lg shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
