'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OptimiseurCVPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1) // 1: Choix mode, 2: Formulaire, 3: Template, 4: Aperçu
  const [mode, setMode] = useState(null) // 'nouveau' ou 'import'
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFormats, setSelectedFormats] = useState({
    pdf: true,
    docx: true,
    portfolio: false
  })

  // Données du CV
  const [cvData, setCvData] = useState({
    // Identité
    prenom: '',
    nom: '',
    titre_poste: '',
    email: '',
    telephone: '',
    adresse: '',
    linkedin: '',
    site_web: '',
    
    // Résumé
    resume: '',
    
    // Expériences (tableau)
    experiences: [
      {
        poste: '',
        entreprise: '',
        periode: '',
        description: ''
      }
    ],
    
    // Formation
    formations: [
      {
        diplome: '',
        etablissement: '',
        annee: '',
        description: ''
      }
    ],
    
    // Compétences
    competences_techniques: '',
    competences_soft: '',
    langues: '',
    
    // Centres d'intérêt
    interets: ''
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
    const newArray = cvData[array].filter((_, i) => i !== index)
    setCvData({ ...cvData, [array]: newArray })
  }

  const templates = [
    {
      id: 'moderne',
      nom: 'Moderne',
      description: 'Design épuré et contemporain',
      couleur: 'from-blue-500 to-blue-600',
      icone: '🚀',
      secteurs: 'Tech, Startup, Digital'
    },
    {
      id: 'classique',
      nom: 'Classique',
      description: 'Professionnel et intemporel',
      couleur: 'from-gray-700 to-gray-900',
      icone: '💼',
      secteurs: 'Corporate, Banque, Juridique'
    },
    {
      id: 'creatif',
      nom: 'Créatif',
      description: 'Original et coloré',
      couleur: 'from-purple-500 to-pink-500',
      icone: '🎨',
      secteurs: 'Design, Marketing, Com'
    }
  ]

const handleGenerateCV = async () => {
  setProcessing(true)
  setError(null)

  try {
    // Validation
    if (!cvData.prenom || !cvData.nom || !cvData.titre_poste) {
      setError('Veuillez remplir au minimum votre prénom, nom et titre de poste')
      setProcessing(false)
      return
    }
    if (!selectedFormats.pdf && !selectedFormats.docx) {
      setError('Veuillez sélectionner au moins un format de sortie (PDF ou DOCX)')
      setProcessing(false)
      return
    }
    console.log('🚀 Début de la requête...')

    // Appel au backend
    const response = await fetch('http://localhost:5000/api/solutions/generer-cv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cvData,
        template: selectedTemplate,
        formats: ['pdf', 'docx']
      })
    })

    console.log('📥 Réponse reçue, status:', response.status)

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

  const result = await response.json()
    console.log('📦 Données parsées:', result)

if (result.success && result.data) {
      console.log('✅ Fichiers reçus')
      
      let downloadedFormats = []
      
      // Télécharger le PDF si demandé et présent
      if (selectedFormats.pdf && result.data.pdf) {
        const pdfBlob = base64ToBlob(result.data.pdf, 'application/pdf')
        downloadFile(pdfBlob, `${result.data.filename}.pdf`)
        downloadedFormats.push('PDF')
      }

      // Télécharger le DOCX si demandé et présent
      if (selectedFormats.docx && result.data.docx) {
        const docxBlob = base64ToBlob(result.data.docx, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        downloadFile(docxBlob, `${result.data.filename}.docx`)
        downloadedFormats.push('DOCX')
      }

      if (downloadedFormats.length > 0) {
        alert(`✅ CV généré avec succès ! (${downloadedFormats.join(' + ')} téléchargés)`)
      } else {
        setError('Aucun format sélectionné')
      }
    } else {
      console.error('❌ Données manquantes:', result)
      setError('Le backend n\'a pas retourné les fichiers')
    }
    
  } catch (err) {
    console.error('❌ ERREUR COMPLÈTE:', err)
    setError(`Erreur: ${err.message}`)
  } finally {
    setProcessing(false)
  }
}

// Fonction helper pour télécharger un fichier
const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Fonction helper pour convertir base64 en Blob
const base64ToBlob = (base64, type) => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type })
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
              <span className="text-gray-900 font-medium">Optimiseur CV</span>
            </div>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Retour
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Mode' },
              { num: 2, label: 'Informations' },
              { num: 3, label: 'Template' },
              { num: 4, label: 'Génération' }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className={`flex items-center ${i < 3 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`ml-2 font-medium ${
                    step >= s.num ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ÉTAPE 1 : Choix du mode */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Comment souhaitez-vous créer votre CV ?
            </h2>
            <p className="text-gray-600 mb-8">
              Choisissez votre méthode préférée
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Nouveau CV */}
              <button
                onClick={() => {
                  setMode('nouveau')
                  setStep(2)
                }}
                className="group bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all text-left"
              >
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Créer un nouveau CV
                </h3>
                <p className="text-gray-600 mb-4">
                  Remplissez un formulaire et laissez l'IA structurer votre CV de manière professionnelle
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Formulaire guidé
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Suggestions IA
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Templates professionnels
                  </div>
                </div>
              </button>

              {/* Import CV */}
              <button
                onClick={() => {
                  setMode('import')
                  alert('⚠️ Fonctionnalité "Import CV" en développement. Utilisez "Créer un nouveau CV" pour l\'instant.')
                }}
                className="group bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all text-left opacity-60"
              >
                <div className="text-5xl mb-4">📤</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  Importer un CV existant
                </h3>
                <p className="text-gray-500 mb-4">
                  Uploadez votre CV actuel et améliorez-le avec nos templates
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Upload PDF/DOCX
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Extraction automatique
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Optimisation IA
                  </div>
                </div>
                <div className="mt-4 inline-block px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold">
                  Bientôt disponible
                </div>
              </button>

            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Formulaire */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Vos informations
            </h2>
            <p className="text-gray-600 mb-8">
              Remplissez vos informations professionnelles
            </p>

            <div className="bg-white rounded-xl shadow p-8 space-y-8">
              
              {/* Identité */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Identité</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Prénom *"
                    value={cvData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Nom *"
                    value={cvData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Titre du poste recherché *"
                    value={cvData.titre_poste}
                    onChange={(e) => handleChange('titre_poste', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={cvData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={cvData.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Adresse (ville)"
                    value={cvData.adresse}
                    onChange={(e) => handleChange('adresse', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn (optionnel)"
                    value={cvData.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Résumé */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Résumé professionnel</h3>
                <textarea
                  rows={4}
                  placeholder="Décrivez-vous en quelques phrases (votre profil, vos objectifs...)"
                  value={cvData.resume}
                  onChange={(e) => handleChange('resume', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Expériences */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Expériences professionnelles</h3>
                  <button
                    onClick={() => addArrayItem('experiences', { poste: '', entreprise: '', periode: '', description: '' })}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm"
                  >
                    + Ajouter
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.experiences.map((exp, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-gray-600">Expérience #{index + 1}</span>
                        {cvData.experiences.length > 1 && (
                          <button
                            onClick={() => removeArrayItem('experiences', index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Poste"
                        value={exp.poste}
                        onChange={(e) => handleArrayChange('experiences', index, 'poste', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Entreprise"
                          value={exp.entreprise}
                          onChange={(e) => handleArrayChange('experiences', index, 'entreprise', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Période (ex: 2020-2023)"
                          value={exp.periode}
                          onChange={(e) => handleArrayChange('experiences', index, 'periode', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Description de vos missions et réalisations"
                        value={exp.description}
                        onChange={(e) => handleArrayChange('experiences', index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Formation */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Formation</h3>
                  <button
                    onClick={() => addArrayItem('formations', { diplome: '', etablissement: '', annee: '', description: '' })}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm"
                  >
                    + Ajouter
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.formations.map((form, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-gray-600">Formation #{index + 1}</span>
                        {cvData.formations.length > 1 && (
                          <button
                            onClick={() => removeArrayItem('formations', index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Diplôme"
                        value={form.diplome}
                        onChange={(e) => handleArrayChange('formations', index, 'diplome', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Établissement"
                          value={form.etablissement}
                          onChange={(e) => handleArrayChange('formations', index, 'etablissement', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Année"
                          value={form.annee}
                          onChange={(e) => handleArrayChange('formations', index, 'annee', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compétences */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Compétences</h3>
                <div className="space-y-4">
                  <textarea
                    rows={3}
                    placeholder="Compétences techniques (ex: JavaScript, React, Python...)"
                    value={cvData.competences_techniques}
                    onChange={(e) => handleChange('competences_techniques', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    rows={2}
                    placeholder="Soft skills (ex: Leadership, Communication...)"
                    value={cvData.competences_soft}
                    onChange={(e) => handleChange('competences_soft', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Langues (ex: Français (natif), Anglais (courant)...)"
                    value={cvData.langues}
                    onChange={(e) => handleChange('langues', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Boutons navigation */}
              <div className="flex justify-between pt-6 border-t">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  ← Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Continuer →
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Choix du template */}
        {step === 3 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Choisissez votre template
            </h2>
            <p className="text-gray-600 mb-8">
              Sélectionnez le style qui correspond à votre secteur
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`bg-white rounded-xl p-6 border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 shadow-xl'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`w-full h-64 bg-gradient-to-br ${template.couleur} rounded-lg mb-4 flex items-center justify-center text-6xl`}>
                    {template.icone}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {template.nom}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {template.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Idéal pour : {template.secteurs}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                ← Retour
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedTemplate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Génération */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Générer votre CV
            </h2>
            <p className="text-gray-600 mb-8">
              Choisissez les formats de sortie
            </p>

            <div className="bg-white rounded-xl shadow p-8">
              
              {/* Résumé */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-3">Récapitulatif</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Nom :</span>
                    <span className="ml-2 font-medium">{cvData.prenom} {cvData.nom}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Poste :</span>
                    <span className="ml-2 font-medium">{cvData.titre_poste}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Template :</span>
                    <span className="ml-2 font-medium">
                      {templates.find(t => t.id === selectedTemplate)?.nom}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Expériences :</span>
                    <span className="ml-2 font-medium">{cvData.experiences.length}</span>
                  </div>
                </div>
              </div>

              {/* Options de génération */}
              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Formats de sortie</h3>
                
<label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedFormats.pdf}
                    onChange={(e) => setSelectedFormats({...selectedFormats, pdf: e.target.checked})}
                    className="w-5 h-5 text-blue-600" 
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Export PDF</div>
                    <div className="text-sm text-gray-600">Format universel, parfait pour l'envoi</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedFormats.docx}
                    onChange={(e) => setSelectedFormats({...selectedFormats, docx: e.target.checked})}
                    className="w-5 h-5 text-blue-600" 
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">Export DOCX</div>
                    <div className="text-sm text-gray-600">Format éditable pour modifications ultérieures</div>
                  </div>
                </label>


              </div>

              {/* Erreur */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {/* Boutons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleGenerateCV}
                  disabled={processing}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {processing ? 'Génération en cours...' : '🚀 Générer mon CV'}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  )
}