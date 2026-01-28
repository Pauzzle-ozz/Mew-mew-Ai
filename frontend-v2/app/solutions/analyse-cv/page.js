'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AnalyseCVPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const [inputMethod, setInputMethod] = useState('upload') // 'upload' ou 'form'
  const [cvFile, setCvFile] = useState(null)
  
  // Données du formulaire structuré
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
  
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Le fichier est trop volumineux (max 2 Mo)')
        return
      }
      if (file.type !== 'application/pdf') {
        setError('Seuls les fichiers PDF sont acceptés')
        return
      }
      setCvFile(file)
      setError(null)
    }
  }

  // Upload et analyse directe du CV PDF
  const handlePdfAnalysis = async (e) => {
    e.preventDefault()
    
    if (!cvFile) {
      setError('Veuillez sélectionner un fichier CV')
      return
    }

    setProcessing(true)
    setError(null)
    setResult(null)

    const formDataUpload = new FormData()
    formDataUpload.append('cv', cvFile)
    formDataUpload.append('userId', user.id)

    try {
      const response = await fetch('http://localhost:5000/api/solutions/analyse-cv-pdf-complete', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erreur lors de l\'analyse du CV')
    } finally {
      setProcessing(false)
    }
  }

  // Analyse via formulaire manuel
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:5000/api/solutions/analyse-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError('Impossible de contacter le serveur')
    } finally {
      setProcessing(false)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            📄 Analyseur de CV
          </h1>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Retour au dashboard
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Comment ça marche :</strong> Upload ton CV PDF pour une analyse automatique, ou remplis le formulaire manuellement si tu n'as pas de CV en format numérique.
          </p>
        </div>

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
              <div className="text-4xl mb-3">✏️</div>
              <h4 className="font-semibold text-lg mb-2">Formulaire manuel</h4>
              <p className="text-sm text-gray-600">
                Remplis tes informations à la main si tu n'as pas de CV PDF.
              </p>
            </button>
          </div>
        </div>

        {/* Upload CV PDF */}
        {inputMethod === 'upload' && (
          <form onSubmit={handlePdfAnalysis} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionne ton CV (PDF, max 2 Mo)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {cvFile && (
                <p className="mt-2 text-sm text-green-600">
                  ✅ Fichier sélectionné : {cvFile.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={processing || !cvFile}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Analyse en cours...' : 'Analyser mon CV'}
            </button>
          </form>
        )}

        {/* Formulaire manuel */}
        {inputMethod === 'form' && (
          <form onSubmit={handleFormSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            
            {/* Identité */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Identité</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Profil professionnel */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profil professionnel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d'expérience *
                  </label>
                  <select
                    name="niveau_experience"
                    value={formData.niveau_experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Junior">Junior (0-2 ans)</option>
                    <option value="Intermédiaire">Intermédiaire (3-5 ans)</option>
                    <option value="Senior">Senior (5+ ans)</option>
                    <option value="Expert">Expert (10+ ans)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Années d'expérience *
                  </label>
                  <input
                    type="number"
                    name="annees_experience"
                    required
                    min="0"
                    value={formData.annees_experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="En recherche active">En recherche active</option>
                    <option value="En poste, ouvert aux opportunités">En poste, ouvert aux opportunités</option>
                    <option value="En poste, non disponible">En poste, non disponible</option>
                    <option value="Étudiant">Étudiant</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Expérience */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expérience</h3>
              <textarea
                name="experience"
                rows={5}
                required
                value={formData.experience}
                onChange={handleChange}
                placeholder="Décris tes expériences professionnelles principales (postes, entreprises, projets...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Compétences */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compétences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compétences principales *
                  </label>
                  <textarea
                    name="competences_principales"
                    rows={3}
                    required
                    value={formData.competences_principales}
                    onChange={handleChange}
                    placeholder="Ex: JavaScript, React, Node.js, gestion de projet..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outils
                  </label>
                  <textarea
                    name="outils"
                    rows={2}
                    value={formData.outils}
                    onChange={handleChange}
                    placeholder="Ex: Git, Docker, Figma, Jira..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soft skills
                  </label>
                  <textarea
                    name="soft_skills"
                    rows={2}
                    value={formData.soft_skills}
                    onChange={handleChange}
                    placeholder="Ex: Communication, travail d'équipe, adaptabilité..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Préférences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur préférentiel *
                  </label>
                  <input
                    type="text"
                    name="secteur_preferentiel"
                    required
                    value={formData.secteur_preferentiel}
                    onChange={handleChange}
                    placeholder="Ex: Tech, Marketing, Finance..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de poste recherché *
                  </label>
                  <input
                    type="text"
                    name="type_poste"
                    required
                    value={formData.type_poste}
                    onChange={handleChange}
                    placeholder="Ex: Développeur Full Stack, Chef de projet..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Analyse en cours...' : 'Analyser mon profil'}
            </button>
          </form>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            ❌ {error}
          </div>
        )}

{/* Résultat */}
{result && (
  <div className="mt-6 space-y-6">
    
    {/* Header Résultat */}
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">✅</span>
        <h3 className="text-2xl font-bold text-gray-900">
          Analyse terminée !
        </h3>
      </div>
      <p className="text-gray-700 text-lg">
        Nous avons identifié <span className="font-bold text-blue-600">{result.metiers_proposes?.length || 0}</span> métier(s) adapté(s) à ton profil
      </p>
    </div>

    {/* Profil résumé */}
    {result.profil && (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow">
        <h4 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
          <span>📋</span> Ton profil
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Prénom</span>
            <p className="font-bold text-lg text-gray-900 mt-1">{result.profil.prenom}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Nom</span>
            <p className="font-bold text-lg text-gray-900 mt-1">{result.profil.nom}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Niveau</span>
            <p className="font-bold text-lg text-gray-900 mt-1">{result.profil.niveau_experience}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-xs text-gray-500 uppercase font-semibold">Poste recherché</span>
            <p className="font-bold text-lg text-gray-900 mt-1">{result.profil.type_poste}</p>
          </div>
        </div>
      </div>
    )}

    {/* Liste des métiers proposés */}
    {result.metiers_proposes && result.metiers_proposes.length > 0 && (
      <div className="space-y-4">
        <h4 className="font-bold text-xl text-gray-900 flex items-center gap-2">
          <span>🎯</span> Métiers proposés
        </h4>
        
        {result.metiers_proposes.map((metier, index) => (
          <div 
            key={index} 
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all"
          >
            {/* Header du métier */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {metier.priorite}
                  </div>
                  <h5 className="text-2xl font-bold text-gray-900">{metier.intitule}</h5>
                </div>
                
                {/* Catégorie */}
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  metier.categorie === 'Ce que je veux' 
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : metier.categorie === 'Correspond à mes compétences'
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                }`}>
                  {metier.categorie}
                </span>
              </div>

              {/* Note marché */}
              <div className="text-center ml-6 bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-300">
                <div className="text-4xl font-black text-blue-600">{metier.note_marche}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">/ 100</div>
                <div className="text-xs text-gray-500 mt-1">Note marché</div>
              </div>
            </div>

            {/* Justification */}
            <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-800">
                <span className="font-bold text-blue-600">💡 Analyse : </span>
                {metier.justification_note || metier.justification}
              </p>
            </div>

            {/* Mots-clés */}
            {metier.mots_cles && (
              <div>
                <p className="text-xs text-gray-500 mb-3 font-semibold uppercase">🔑 Mots-clés associés</p>
                <div className="flex flex-wrap gap-2">
                  {(typeof metier.mots_cles === 'string' 
                    ? metier.mots_cles.split(',').map(m => m.trim())
                    : metier.mots_cles
                  ).map((motCle, i) => (
                    <span 
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-300 transition-colors"
                    >
                      {motCle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Compétences clés */}
    {result.competences_cles && result.competences_cles.length > 0 && (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow">
        <h4 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
          <span>⭐</span> Tes compétences clés
        </h4>
        <div className="flex flex-wrap gap-3">
          {result.competences_cles.map((comp, i) => (
            <span 
              key={i}
              className="px-5 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 rounded-lg text-sm font-bold border-2 border-blue-300"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Actions */}
    <div className="flex gap-4 justify-center pt-4">
      <button
        onClick={() => {
          setResult(null)
          setError(null)
          if (inputMethod === 'form') {
            setFormData({
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
          } else {
            setCvFile(null)
          }
        }}
        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold shadow-lg hover:shadow-xl transition-all"
      >
        🔄 Faire une nouvelle analyse
      </button>
      
      <button
        onClick={() => window.print()}
        className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-bold shadow-lg hover:shadow-xl transition-all"
      >
        🖨️ Imprimer les résultats
      </button>
    </div>

  </div>
)}

      </main>
    </div>
  )
}