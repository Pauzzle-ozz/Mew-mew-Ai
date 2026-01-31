'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { portfolioApi } from '@/lib/api/portfolioApi'
import { QRCodeSVG } from 'qrcode.react'

// Types de blocs disponibles
const BLOCK_TYPES = [
  { type: 'hero', icon: '🦸', label: 'Hero', description: 'Grande bannière d\'accueil' },
  { type: 'text', icon: '📝', label: 'Texte', description: 'Titre, paragraphe, liste' },
  { type: 'image', icon: '🖼️', label: 'Image', description: 'Photo, illustration' },
  { type: 'video', icon: '🎬', label: 'Vidéo', description: 'MP4, YouTube, Vimeo' },
  { type: 'gallery', icon: '🖼️', label: 'Galerie', description: 'Grille d\'images' },
  { type: 'project', icon: '💼', label: 'Projet', description: 'Carte de projet' },
  { type: 'contact', icon: '📧', label: 'Contact', description: 'Formulaire et liens' },
  { type: 'separator', icon: '➖', label: 'Séparateur', description: 'Ligne ou espace' },
]

export default function PortfolioEditorPage() {
  const params = useParams()
  const portfolioId = params.id
  const { user, loading: authLoading } = useAuth()

  const [portfolio, setPortfolio] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importCVData, setImportCVData] = useState('')
  const [importError, setImportError] = useState(null)
  const [importing, setImporting] = useState(false)

  // Charger le portfolio
  useEffect(() => {
    if (user && portfolioId) {
      loadPortfolio()
    }
  }, [user, portfolioId])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      const result = await portfolioApi.getPortfolio(portfolioId, user.id)
      setPortfolio(result.data)
      setBlocks(result.data.blocks || [])
    } catch (err) {
      console.error('Erreur chargement:', err)
      setError('Impossible de charger le portfolio')
    } finally {
      setLoading(false)
    }
  }

  // Ajouter un bloc
  const handleAddBlock = async (type) => {
    try {
      setSaving(true)
      const defaultContent = getDefaultContent(type)
      const result = await portfolioApi.addBlock(portfolioId, user.id, type, defaultContent)
      setBlocks([...blocks, result.data])
      setShowAddBlock(false)
      setEditingBlock(result.data.id)
    } catch (err) {
      console.error('Erreur ajout bloc:', err)
      setError('Impossible d\'ajouter le bloc')
    } finally {
      setSaving(false)
    }
  }

  // Contenu par défaut selon le type
  const getDefaultContent = (type) => {
    switch (type) {
      case 'hero':
        return { 
          title: 'Bienvenue', 
          subtitle: '', 
          backgroundImage: '', 
          buttonText: '', 
          buttonLink: '',
          overlay: true 
        }
      case 'text':
        return { title: '', text: '', style: 'paragraph' }
      case 'image':
        return { url: '', caption: '', size: 'medium' }
      case 'video':
        return { url: '', type: 'upload', caption: '' }
      case 'gallery':
        return { images: [] }
      case 'project':
        return { title: '', description: '', image: '', link: '' }
      case 'contact':
        return { email: '', phone: '', linkedin: '', github: '', message: '' }
      case 'separator':
        return { style: 'line' }
      default:
        return {}
    }
  }

  // Mettre à jour un bloc
  const handleUpdateBlock = async (blockId, content) => {
    try {
      setSaving(true)
      await portfolioApi.updateBlock(blockId, user.id, { content })
      setBlocks(blocks.map(b => b.id === blockId ? { ...b, content } : b))
    } catch (err) {
      console.error('Erreur mise à jour:', err)
      setError('Impossible de sauvegarder')
    } finally {
      setSaving(false)
    }
  }

  // Supprimer un bloc
  const handleDeleteBlock = async (blockId) => {
    if (!confirm('Supprimer ce bloc ?')) return

    try {
      setSaving(true)
      await portfolioApi.deleteBlock(blockId, user.id)
      setBlocks(blocks.filter(b => b.id !== blockId))
      if (editingBlock === blockId) setEditingBlock(null)
    } catch (err) {
      console.error('Erreur suppression:', err)
      setError('Impossible de supprimer')
    } finally {
      setSaving(false)
    }
  }

  // Déplacer un bloc (haut/bas)
  const handleMoveBlock = async (blockId, direction) => {
    const index = blocks.findIndex(b => b.id === blockId)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, removed)
    
    setBlocks(newBlocks)

    try {
      await portfolioApi.reorderBlocks(portfolioId, user.id, newBlocks.map(b => b.id))
    } catch (err) {
      console.error('Erreur réorganisation:', err)
    }
  }

  // Importer les données du CV
  const handleImportCV = async () => {
    try {
      setImporting(true)
      setImportError(null)

      // Parser le JSON
      let cvData
      try {
        cvData = JSON.parse(importCVData)
      } catch (e) {
        throw new Error('JSON invalide. Vérifie le format.')
      }

      // Créer les blocs à partir du CV
      const blocksToCreate = []

      // 1. Bloc Hero avec nom et titre
      if (cvData.prenom || cvData.nom || cvData.titre_poste) {
        blocksToCreate.push({
          type: 'hero',
          content: {
            title: `${cvData.prenom || ''} ${cvData.nom || ''}`.trim(),
            subtitle: cvData.titre_poste || '',
            backgroundImage: '',
            overlay: true
          }
        })
      }

      // 2. Bloc Texte avec le résumé
      if (cvData.resume) {
        blocksToCreate.push({
          type: 'text',
          content: {
            title: 'À propos',
            text: cvData.resume,
            style: 'paragraph'
          }
        })
      }

      // 3. Bloc Texte pour les expériences
      if (cvData.experiences && cvData.experiences.length > 0) {
        const expText = cvData.experiences.map(exp => 
          `**${exp.poste || 'Poste'}** - ${exp.entreprise || 'Entreprise'}\n${exp.periode || exp.date_debut || ''} ${exp.date_fin ? '- ' + exp.date_fin : ''}\n${exp.description || ''}`
        ).join('\n\n')

        blocksToCreate.push({
          type: 'text',
          content: {
            title: 'Expériences professionnelles',
            text: expText,
            style: 'paragraph'
          }
        })
      }

      // 4. Bloc Texte pour les formations
      if (cvData.formations && cvData.formations.length > 0) {
        const formText = cvData.formations.map(form => 
          `**${form.diplome || 'Diplôme'}** - ${form.etablissement || 'Établissement'}\n${form.annee || form.date_fin || ''}`
        ).join('\n\n')

        blocksToCreate.push({
          type: 'text',
          content: {
            title: 'Formation',
            text: formText,
            style: 'paragraph'
          }
        })
      }

      // 5. Bloc Texte pour les compétences
      if (cvData.competences_techniques || cvData.competences_soft) {
        let compText = ''
        if (cvData.competences_techniques) {
          compText += `**Compétences techniques :**\n${cvData.competences_techniques}\n\n`
        }
        if (cvData.competences_soft) {
          compText += `**Soft skills :**\n${cvData.competences_soft}\n\n`
        }
        if (cvData.langues) {
          compText += `**Langues :**\n${cvData.langues}`
        }

        blocksToCreate.push({
          type: 'text',
          content: {
            title: 'Compétences',
            text: compText.trim(),
            style: 'paragraph'
          }
        })
      }

      // 6. Bloc Contact
      if (cvData.email || cvData.telephone || cvData.linkedin) {
        blocksToCreate.push({
          type: 'contact',
          content: {
            email: cvData.email || '',
            phone: cvData.telephone || '',
            linkedin: cvData.linkedin || '',
            github: ''
          }
        })
      }

      // Créer tous les blocs
      for (const blockData of blocksToCreate) {
        const result = await portfolioApi.addBlock(portfolioId, user.id, blockData.type, blockData.content)
        setBlocks(prev => [...prev, result.data])
      }

      // Fermer le modal
      setShowImportModal(false)
      setImportCVData('')
      alert(`✅ ${blocksToCreate.length} blocs importés avec succès !`)

    } catch (err) {
      console.error('Erreur import CV:', err)
      setImportError(err.message)
    } finally {
      setImporting(false)
    }
  }

  // Changer le template
  const handleChangeTemplate = async (newTemplate) => {
    try {
      setSaving(true)
      await portfolioApi.updatePortfolio(portfolioId, user.id, { template: newTemplate })
      setPortfolio({ ...portfolio, template: newTemplate })
    } catch (err) {
      console.error('Erreur changement template:', err)
      setError('Impossible de changer le template')
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublish = async () => {
    try {
      setSaving(true)
      await portfolioApi.togglePublish(portfolioId, user.id, !portfolio.published)
      setPortfolio({ ...portfolio, published: !portfolio.published })
    } catch (err) {
      console.error('Erreur publication:', err)
      setError('Impossible de modifier la publication')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement de l'éditeur...</p>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Portfolio non trouvé</p>
          <Link href="/solutions/portfolio" className="text-blue-600 hover:underline">
            ← Retour à mes portfolios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header Éditeur */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Gauche */}
            <div className="flex items-center space-x-4">
              <Link href="/solutions/portfolio" className="text-gray-500 hover:text-gray-700">
                ← Retour
              </Link>
              <div>
                <h1 className="font-bold text-gray-900">{portfolio.title}</h1>
                <p className="text-xs text-gray-500">
                  {saving ? '⏳ Sauvegarde...' : '✅ Sauvegardé'}
                </p>
              </div>
            </div>

            {/* Droite */}
            <div className="flex items-center space-x-3">
              {/* Prévisualisation */}
              <Link
                href={`/p/${portfolio.slug}`}
                target="_blank"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                👁️ Prévisualiser
              </Link>

              {/* Publier */}
              <button
                onClick={handleTogglePublish}
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  portfolio.published
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {portfolio.published ? '📤 Dépublier' : '🚀 Publier'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Erreur */}
      {error && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-4">✕</button>
          </div>
        </div>
      )}

      {/* Zone d'édition */}
      <main className="max-w-4xl mx-auto py-8 px-4">

        {/* Sélecteur de template */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow">
          <h3 className="font-bold text-gray-900 mb-3">🎨 Design du portfolio</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'moderne', name: 'Moderne', icon: '🎨', color: 'from-blue-600 to-purple-600' },
              { id: 'minimal', name: 'Minimal', icon: '⚪', color: 'from-gray-200 to-gray-300' },
              { id: 'sombre', name: 'Sombre', icon: '🌙', color: 'from-gray-800 to-gray-900' }
            ].map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleChangeTemplate(tpl.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  portfolio.template === tpl.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`h-16 rounded-md bg-gradient-to-br ${tpl.color} mb-2 flex items-center justify-center`}>
                  <span className="text-2xl">{tpl.icon}</span>
                </div>
                <p className={`text-sm font-medium ${
                  portfolio.template === tpl.id ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {tpl.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code & Partage */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow">
          <h3 className="font-bold text-gray-900 mb-3">📱 Partager le portfolio</h3>
          
          <div className="flex items-center gap-6">
            {/* QR Code */}
            <div className="bg-white p-3 rounded-lg border">
              <QRCodeSVG 
                id="qr-code-svg"
                value={`${window.location.origin}/p/${portfolio.slug}`}
                size={120}
                level="M"
                includeMargin={true}
              />
            </div>

            {/* Infos et boutons */}
            <div className="flex-1 space-y-3">
              {/* URL */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Lien du portfolio :</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm truncate">
                    {window.location.origin}/p/{portfolio.slug}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/p/${portfolio.slug}`)
                      alert('✅ Lien copié !')
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    📋 Copier
                  </button>
                </div>
              </div>

              {/* Télécharger QR Code */}
              <button
                onClick={() => {
                  const svg = document.getElementById('qr-code-svg')
                  const svgData = new XMLSerializer().serializeToString(svg)
                  const canvas = document.createElement('canvas')
                  const ctx = canvas.getContext('2d')
                  const img = new Image()
                  img.onload = () => {
                    canvas.width = img.width
                    canvas.height = img.height
                    ctx.drawImage(img, 0, 0)
                    const pngFile = canvas.toDataURL('image/png')
                    const downloadLink = document.createElement('a')
                    downloadLink.download = `qrcode-${portfolio.slug}.png`
                    downloadLink.href = pngFile
                    downloadLink.click()
                  }
                  img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                📥 Télécharger le QR Code
              </button>

              {/* Statut */}
              {!portfolio.published && (
                <p className="text-sm text-orange-600">
                  ⚠️ Publie ton portfolio pour que le lien fonctionne
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Import CV */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow">
          <h3 className="font-bold text-gray-900 mb-3">📄 Importer depuis mon CV</h3>
          <p className="text-sm text-gray-600 mb-4">
            Tu as déjà optimisé ton CV ? Importe tes informations en un clic !
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-700"
            >
              📥 Importer mon CV
            </button>
            
            <Link
              href="/solutions/optimiseur-cv"
              target="_blank"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              ✨ Créer un CV optimisé
            </Link>
          </div>
        </div>

        {/* Modal Import CV */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📄 Importer mon CV</h2>
              
              <p className="text-gray-600 mb-4">
                Colle ici les données JSON de ton CV optimisé, ou upload le fichier JSON.
              </p>

              {/* Zone de texte pour coller le JSON */}
              <textarea
                placeholder='{"prenom": "Jean", "nom": "Dupont", ...}'
                value={importCVData}
                onChange={(e) => setImportCVData(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border rounded-lg font-mono text-sm mb-4"
              />

              {/* Ou upload fichier */}
              <div className="mb-4">
                <label className="block cursor-pointer">
                  <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-600 hover:border-blue-400 hover:text-blue-600">
                    📁 Ou uploader un fichier JSON
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          setImportCVData(event.target.result)
                        }
                        reader.readAsText(file)
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Erreur */}
              {importError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {importError}
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportCVData('')
                    setImportError(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleImportCV}
                  disabled={!importCVData || importing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {importing ? '⏳ Import...' : '📥 Importer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* URL du portfolio */}
        {portfolio.published && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              🌐 Votre portfolio est en ligne : {' '}
              <a 
                href={`/p/${portfolio.slug}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                mew.app/p/{portfolio.slug}
              </a>
            </p>
          </div>
        )}

        {/* Liste des blocs */}
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockEditor
              key={block.id}
              block={block}
              isEditing={editingBlock === block.id}
              onEdit={() => setEditingBlock(block.id)}
              onSave={(content) => handleUpdateBlock(block.id, content)}
              onDelete={() => handleDeleteBlock(block.id)}
              onMoveUp={() => handleMoveBlock(block.id, 'up')}
              onMoveDown={() => handleMoveBlock(block.id, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < blocks.length - 1}
              portfolioId={portfolioId}
              userId={user.id}
            />
          ))}
        </div>

        {/* Bouton ajouter bloc */}
        <div className="mt-6">
          {showAddBlock ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">➕ Ajouter un bloc</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BLOCK_TYPES.map((blockType) => (
                  <button
                    key={blockType.type}
                    onClick={() => handleAddBlock(blockType.type)}
                    disabled={saving}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="text-2xl mb-1">{blockType.icon}</div>
                    <div className="font-medium text-gray-900">{blockType.label}</div>
                    <div className="text-xs text-gray-500">{blockType.description}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddBlock(false)}
                className="mt-4 text-gray-500 hover:text-gray-700"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddBlock(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              ➕ Ajouter un bloc
            </button>
          )}
        </div>

        {/* Message si aucun bloc */}
        {blocks.length === 0 && !showAddBlock && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Commencez à créer !
            </h3>
            <p className="text-gray-600 mb-6">
              Ajoutez des blocs pour construire votre portfolio
            </p>
          </div>
        )}
      </main>
    </div>
  )
}


// ==========================================
// COMPOSANT BLOCK EDITOR
// ==========================================

function BlockEditor({ 
  block, 
  isEditing, 
  onEdit, 
  onSave, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  canMoveUp,
  canMoveDown,
  portfolioId,
  userId
}) {
  const [content, setContent] = useState(block.content || {})
  const [uploading, setUploading] = useState(false)

  const handleChange = (field, value) => {
    const newContent = { ...content, [field]: value }
    setContent(newContent)
  }

  const handleSave = () => {
    onSave(content)
  }

  // Upload image/vidéo
  const handleFileUpload = async (e, field = 'url') => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const result = await portfolioApi.uploadMedia(portfolioId, userId, file)
      handleChange(field, result.data.url)
    } catch (err) {
      console.error('Erreur upload:', err)
      alert('Erreur lors de l\'upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  // Icône du bloc
  const getBlockIcon = () => {
    const icons = {
      hero: '🦸',
      text: '📝',
      image: '🖼️',
      video: '🎬',
      gallery: '🖼️',
      project: '💼',
      contact: '📧',
      separator: '➖'
    }
    return icons[block.type] || '📦'
  }

  return (
    <div className={`bg-white rounded-xl shadow ${isEditing ? 'ring-2 ring-blue-500' : ''}`}>
      
      {/* Header du bloc */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getBlockIcon()}</span>
          <span className="font-medium text-gray-700 capitalize">{block.type}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Déplacer */}
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            title="Monter"
          >
            ⬆️
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            title="Descendre"
          >
            ⬇️
          </button>

          {/* Éditer / Sauvegarder */}
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              ✅ Sauvegarder
            </button>
          ) : (
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              ✏️ Modifier
            </button>
          )}

          {/* Supprimer */}
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-600"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Contenu du bloc */}
      <div className="p-4">
        {isEditing ? (
          // Mode édition
          <div className="space-y-4">
            {block.type === 'hero' && (
              <>
                {/* Aperçu Hero */}
                <div 
                  className="relative h-48 rounded-lg overflow-hidden mb-4 flex items-center justify-center"
                  style={{
                    backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: content.backgroundImage ? 'transparent' : '#4F46E5'
                  }}
                >
                  {content.overlay && content.backgroundImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  )}
                  <div className="relative z-10 text-center text-white p-4">
                    <h2 className="text-2xl font-bold">{content.title || 'Titre'}</h2>
                    {content.subtitle && <p className="mt-2">{content.subtitle}</p>}
                    {content.buttonText && (
                      <span className="inline-block mt-3 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm">
                        {content.buttonText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Titre */}
                <input
                  type="text"
                  placeholder="Titre principal"
                  value={content.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-lg font-bold"
                />

                {/* Sous-titre */}
                <input
                  type="text"
                  placeholder="Sous-titre (optionnel)"
                  value={content.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />

                {/* Image de fond */}
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-gray-700">Image de fond :</p>
                  <label className="block cursor-pointer">
                    <div className="px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium text-sm">
                      {uploading ? '⏳ Upload...' : '📤 Choisir une image de fond'}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => handleFileUpload(e, 'backgroundImage')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {content.backgroundImage && (
                    <button
                      type="button"
                      onClick={() => handleChange('backgroundImage', '')}
                      className="text-red-500 text-sm hover:underline"
                    >
                      🗑️ Supprimer l'image
                    </button>
                  )}
                </div>

                {/* Overlay */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.overlay !== false}
                    onChange={(e) => handleChange('overlay', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Assombrir l'image (meilleure lisibilité)</span>
                </label>

                {/* Bouton d'action */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Texte du bouton (optionnel)"
                    value={content.buttonText || ''}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Lien du bouton"
                    value={content.buttonLink || ''}
                    onChange={(e) => handleChange('buttonLink', e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
              </>
            )}
           
            {block.type === 'text' && (
              <>
                <input
                  type="text"
                  placeholder="Titre (optionnel)"
                  value={content.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Votre texte ici..."
                  value={content.text || ''}
                  onChange={(e) => handleChange('text', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <select
                  value={content.style || 'paragraph'}
                  onChange={(e) => handleChange('style', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="heading">Titre principal</option>
                  <option value="subheading">Sous-titre</option>
                  <option value="paragraph">Paragraphe</option>
                </select>
              </>
            )}

            {block.type === 'image' && (
              <>
                {/* Aperçu image */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {content.url ? (
                    <div>
                      <img src={content.url} alt="" className="max-h-64 mx-auto rounded mb-4" />
                      <button
                        type="button"
                        onClick={() => handleChange('url', '')}
                        className="text-red-500 text-sm hover:underline"
                      >
                        🗑️ Supprimer l'image
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <span className="text-4xl mb-2 block">🖼️</span>
                      <p className="text-gray-500 mb-4">Aucune image sélectionnée</p>
                    </div>
                  )}
                </div>

                {/* Bouton Upload */}
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium">
                      {uploading ? '⏳ Upload en cours...' : '📤 Choisir une image'}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Ou URL externe */}
                <div className="text-center text-gray-400 text-sm">— ou —</div>
                <input
                  type="text"
                  placeholder="Coller une URL d'image"
                  value={content.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />

                {/* Légende */}
                <input
                  type="text"
                  placeholder="Légende (optionnel)"
                  value={content.caption || ''}
                  onChange={(e) => handleChange('caption', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </>
            )}

            {block.type === 'video' && (
              <>
                {/* Type de vidéo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type de vidéo
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleChange('type', 'upload')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                        content.type === 'upload' || !content.type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      📤 Depuis mon PC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('type', 'youtube')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                        content.type === 'youtube'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      ▶️ YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('type', 'vimeo')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                        content.type === 'vimeo'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      🎬 Vimeo
                    </button>
                  </div>
                </div>

                {/* Upload MP4/WEBM */}
                {(content.type === 'upload' || !content.type) && (
                  <>
                    {/* Aperçu vidéo */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {content.url ? (
                        <div>
                          <video src={content.url} controls className="max-h-64 mx-auto rounded mb-4" />
                          <button
                            type="button"
                            onClick={() => handleChange('url', '')}
                            className="text-red-500 text-sm hover:underline"
                          >
                            🗑️ Supprimer la vidéo
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <span className="text-4xl mb-2 block">🎬</span>
                          <p className="text-gray-500 mb-2">Aucune vidéo sélectionnée</p>
                          <p className="text-gray-400 text-sm">Formats acceptés : MP4, WEBM (max 50MB)</p>
                        </div>
                      )}
                    </div>

                    {/* Bouton Upload */}
                    <label className="block cursor-pointer">
                      <div className="px-4 py-3 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 font-medium">
                        {uploading ? '⏳ Upload en cours...' : '📤 Choisir une vidéo (MP4, WEBM)'}
                      </div>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={(e) => handleFileUpload(e)}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </>
                )}

                {/* YouTube URL */}
                {content.type === 'youtube' && (
                  <>
                    <input
                      type="text"
                      placeholder="Coller l'URL YouTube (ex: https://www.youtube.com/watch?v=...)"
                      value={content.url || ''}
                      onChange={(e) => handleChange('url', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {content.url && (
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${content.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] || ''}`}
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                          title="YouTube video"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Vimeo URL */}
                {content.type === 'vimeo' && (
                  <>
                    <input
                      type="text"
                      placeholder="Coller l'URL Vimeo (ex: https://vimeo.com/123456789)"
                      value={content.url || ''}
                      onChange={(e) => handleChange('url', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {content.url && (
                      <div className="aspect-video">
                        <iframe
                          src={`https://player.vimeo.com/video/${content.url.match(/vimeo\.com\/(\d+)/)?.[1] || ''}`}
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                          title="Vimeo video"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Légende */}
                <input
                  type="text"
                  placeholder="Légende (optionnel)"
                  value={content.caption || ''}
                  onChange={(e) => handleChange('caption', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </>
            )}

            {block.type === 'project' && (
              <>
                <input
                  type="text"
                  placeholder="Titre du projet"
                  value={content.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Description du projet"
                  value={content.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="w-full"
                  disabled={uploading}
                />
                {content.image && (
                  <img src={content.image} alt="" className="max-h-32 rounded" />
                )}
                <input
                  type="text"
                  placeholder="Lien vers le projet (optionnel)"
                  value={content.link || ''}
                  onChange={(e) => handleChange('link', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </>
            )}
             
            {block.type === 'gallery' && (
              <>
                {/* Aperçu galerie */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Array.isArray(content.images) && content.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={typeof img === 'string' ? img : img.url} 
                        alt="" 
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...(content.images || [])]
                          newImages.splice(index, 1)
                          handleChange('images', newImages)
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bouton ajouter images */}
                <label className="block cursor-pointer">
                  <div className="px-4 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium">
                    {uploading ? '⏳ Upload en cours...' : '📤 Ajouter des images à la galerie'}
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files)
                      for (const file of files) {
                        try {
                          setUploading(true)
                          const result = await portfolioApi.uploadMedia(portfolioId, userId, file)
                          const newImages = [...(content.images || []), result.data.url]
                          handleChange('images', newImages)
                        } catch (err) {
                          console.error('Erreur upload:', err)
                          alert('Erreur lors de l\'upload: ' + err.message)
                        }
                      }
                      setUploading(false)
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                <p className="text-sm text-gray-500 text-center">
                  {Array.isArray(content.images) ? content.images.length : 0} image(s) dans la galerie
                </p>
              </>
            )}

            {block.type === 'contact' && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={content.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={content.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={content.linkedin || ''}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={content.github || ''}
                  onChange={(e) => handleChange('github', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </>
            )}

            {block.type === 'separator' && (
              <select
                value={content.style || 'line'}
                onChange={(e) => handleChange('style', e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="line">Ligne</option>
                <option value="space">Espace</option>
                <option value="dots">Points</option>
              </select>
            )}
          </div>
        ) : (
          // Mode aperçu
          <BlockPreview block={block} />
        )}
      </div>
    </div>
  )
}

// ==========================================
// COMPOSANT BLOCK PREVIEW
// ==========================================

function BlockPreview({ block }) {
  const content = block.content || {}

  switch (block.type) {
    
    case 'hero':
      return (
        <div 
          className="relative h-32 rounded-lg overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: content.backgroundImage ? 'transparent' : '#4F46E5'
          }}
        >
          {content.overlay && content.backgroundImage && (
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          )}
          <div className="relative z-10 text-center text-white">
            <h2 className="text-xl font-bold">{content.title || 'Hero'}</h2>
            {content.subtitle && <p className="text-sm opacity-90">{content.subtitle}</p>}
          </div>
        </div>
      )

    case 'text':
      return (
        <div>
          {content.title && (
            <h3 className={`font-bold ${content.style === 'heading' ? 'text-2xl' : 'text-lg'} mb-2`}>
              {content.title}
            </h3>
          )}
          <p className="text-gray-700 whitespace-pre-wrap">{content.text || 'Aucun texte'}</p>
        </div>
      )

    case 'image':
      return content.url ? (
        <div>
          <img src={content.url} alt={content.caption || ''} className="max-h-64 rounded-lg" />
          {content.caption && <p className="text-sm text-gray-500 mt-2">{content.caption}</p>}
        </div>
      ) : (
        <p className="text-gray-400">Aucune image</p>
      )

    case 'video':
      if (!content.url) return <p className="text-gray-400">Aucune vidéo</p>
      
      if (content.type === 'youtube') {
        const videoId = content.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]
        return videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full aspect-video rounded-lg"
            allowFullScreen
            title="YouTube preview"
          />
        ) : <p className="text-red-500">URL YouTube invalide</p>
      }
      
      return (
        <video src={content.url} controls className="w-full rounded-lg" />
      )

    case 'gallery':
      return (
        <div className="grid grid-cols-3 gap-2">
          {Array.isArray(content.images) && content.images.map((img, index) => (
            <img 
              key={index}
              src={typeof img === 'string' ? img : img.url} 
              alt="" 
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>
      )

    case 'project':
      return (
        <div className="flex gap-4">
          {content.image && (
            <img src={content.image} alt="" className="w-32 h-24 object-cover rounded" />
          )}
          <div>
            <h4 className="font-bold">{content.title || 'Sans titre'}</h4>
            <p className="text-sm text-gray-600">{content.description}</p>
            {content.link && (
              <a href={content.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                Voir le projet →
              </a>
            )}
          </div>
        </div>
      )

    case 'contact':
      return (
        <div className="flex flex-wrap gap-4">
          {content.email && <span>📧 {content.email}</span>}
          {content.phone && <span>📱 {content.phone}</span>}
          {content.linkedin && <a href={content.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600">LinkedIn</a>}
          {content.github && <a href={content.github} target="_blank" rel="noopener noreferrer" className="text-gray-800">GitHub</a>}
        </div>
      )

    case 'separator':
      if (content.style === 'space') return <div className="h-8" />
      if (content.style === 'dots') return <div className="text-center text-gray-400">• • •</div>
      return <hr className="border-gray-300" />

    default:
      return <p className="text-gray-400">Bloc inconnu</p>
  }
}