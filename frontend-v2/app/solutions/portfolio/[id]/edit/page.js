'use client'

import { useState, useEffect, useReducer, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks/useAuth'
import { portfolioApi } from '@/lib/api/portfolioApi'
import Button from '@/components/shared/Button'
import Logo from '@/components/shared/Logo'

const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
  ssr: false,
  loading: () => <div className="w-[120px] h-[120px] bg-gray-100 animate-pulse rounded" />
})

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

  // State structuré avec useReducer
  const initialState = {
    portfolio: null,
    blocks: [],
    ui: { loading: true, saving: false, error: null, exporting: false },
    modals: {
      showAddBlock: false,
      editingBlock: null,
      showImportModal: false,
      importCVData: '',
      importError: null,
      importing: false,
    },
    password: { input: '', saving: false, msg: null },
  }

  function editorReducer(state, action) {
    switch (action.type) {
      case 'SET_PORTFOLIO':
        return { ...state, portfolio: action.payload }
      case 'SET_BLOCKS':
        return { ...state, blocks: action.payload }
      case 'ADD_BLOCK':
        return { ...state, blocks: [...state.blocks, action.payload] }
      case 'UPDATE_BLOCK':
        return { ...state, blocks: state.blocks.map(b => b.id === action.id ? { ...b, content: action.content } : b) }
      case 'DELETE_BLOCK':
        return { ...state, blocks: state.blocks.filter(b => b.id !== action.id) }
      case 'SET_UI':
        return { ...state, ui: { ...state.ui, ...action.payload } }
      case 'SET_MODAL':
        return { ...state, modals: { ...state.modals, ...action.payload } }
      case 'SET_PASSWORD':
        return { ...state, password: { ...state.password, ...action.payload } }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(editorReducer, initialState)
  const { portfolio, blocks } = state
  const { loading, saving, error, exporting } = state.ui
  const { showAddBlock, editingBlock, showImportModal, importCVData, importError, importing } = state.modals
  const { input: passwordInput, saving: passwordSaving, msg: passwordMsg } = state.password

  // Helpers pour garder la compatibilité avec le code existant
  const setPortfolio = (p) => dispatch({ type: 'SET_PORTFOLIO', payload: typeof p === 'function' ? p(portfolio) : p })
  const setBlocks = (b) => dispatch({ type: 'SET_BLOCKS', payload: typeof b === 'function' ? b(blocks) : b })
  const setSaving = (v) => dispatch({ type: 'SET_UI', payload: { saving: v } })
  const setLoading = (v) => dispatch({ type: 'SET_UI', payload: { loading: v } })
  const setError = (v) => dispatch({ type: 'SET_UI', payload: { error: v } })
  const setExporting = (v) => dispatch({ type: 'SET_UI', payload: { exporting: v } })
  const setShowAddBlock = (v) => dispatch({ type: 'SET_MODAL', payload: { showAddBlock: v } })
  const setEditingBlock = (v) => dispatch({ type: 'SET_MODAL', payload: { editingBlock: v } })
  const setShowImportModal = (v) => dispatch({ type: 'SET_MODAL', payload: { showImportModal: v } })
  const setImportCVData = (v) => dispatch({ type: 'SET_MODAL', payload: { importCVData: v } })
  const setImportError = (v) => dispatch({ type: 'SET_MODAL', payload: { importError: v } })
  const setImporting = (v) => dispatch({ type: 'SET_MODAL', payload: { importing: v } })
  const setPasswordInput = (v) => dispatch({ type: 'SET_PASSWORD', payload: { input: v } })
  const setPasswordSaving = (v) => dispatch({ type: 'SET_PASSWORD', payload: { saving: v } })
  const setPasswordMsg = (v) => dispatch({ type: 'SET_PASSWORD', payload: { msg: v } })

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
  const handleAddBlock = useCallback(async (type) => {
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
  }, [portfolioId, user, blocks])

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
  const handleUpdateBlock = useCallback(async (blockId, content) => {
    try {
      setSaving(true)
      await portfolioApi.updateBlock(blockId, user.id, { content })
      dispatch({ type: 'UPDATE_BLOCK', id: blockId, content })
    } catch (err) {
      console.error('Erreur mise à jour:', err)
      setError('Impossible de sauvegarder')
    } finally {
      setSaving(false)
    }
  }, [user])

  // Supprimer un bloc
  const handleDeleteBlock = useCallback(async (blockId) => {
    if (!confirm('Supprimer ce bloc ?')) return

    try {
      setSaving(true)
      await portfolioApi.deleteBlock(blockId, user.id)
      dispatch({ type: 'DELETE_BLOCK', id: blockId })
      if (editingBlock === blockId) setEditingBlock(null)
    } catch (err) {
      console.error('Erreur suppression:', err)
      setError('Impossible de supprimer')
    } finally {
      setSaving(false)
    }
  }, [user, editingBlock])

  // Déplacer un bloc (haut/bas)
  const handleMoveBlock = useCallback(async (blockId, direction) => {
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
  }, [blocks, portfolioId, user])

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
      alert(`${blocksToCreate.length} blocs importés avec succès !`)

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

// Changer la couleur principale
const handleChangeColor = async (newColor) => {
  try {
    setSaving(true)
    await portfolioApi.updatePortfolio(portfolioId, user.id, { primary_color: newColor })
    setPortfolio({ ...portfolio, primary_color: newColor })
  } catch (err) {
    console.error('Erreur changement couleur:', err)
    setError('Impossible de changer la couleur')
  } finally {
    setSaving(false)
  }
}

// Définir le mot de passe du portfolio
const handleSetPassword = async () => {
  if (!passwordInput || passwordInput.length < 4) {
    setPasswordMsg({ type: 'error', text: 'Le mot de passe doit contenir au moins 4 caractères' })
    return
  }

  try {
    setPasswordSaving(true)
    setPasswordMsg(null)
    await portfolioApi.setPassword(portfolioId, user.id, passwordInput)
    setPortfolio({ ...portfolio, is_protected: true })
    setPasswordInput('')
    setPasswordMsg({ type: 'success', text: 'Mot de passe défini !' })
  } catch (err) {
    console.error('Erreur mot de passe:', err)
    setPasswordMsg({ type: 'error', text: err.message })
  } finally {
    setPasswordSaving(false)
  }
}

// Supprimer la protection par mot de passe
const handleRemovePassword = async () => {
  try {
    setPasswordSaving(true)
    setPasswordMsg(null)
    await portfolioApi.removePassword(portfolioId, user.id)
    setPortfolio({ ...portfolio, is_protected: false })
    setPasswordMsg({ type: 'success', text: 'Protection supprimée' })
  } catch (err) {
    console.error('Erreur suppression mot de passe:', err)
    setPasswordMsg({ type: 'error', text: err.message })
  } finally {
    setPasswordSaving(false)
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

  // Exporter le portfolio en PDF
  const handleExportPDF = async () => {
    try {
      setExporting(true)
      const result = await portfolioApi.exportPDF(portfolioId, user.id)
      const { pdf, filename } = result.data

      // Decoder base64 et telecharger
      const byteCharacters = atob(pdf)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Erreur export PDF:', err)
      setError('Impossible d\'exporter en PDF')
    } finally {
      setExporting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Logo size="md" link={false} />
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">Portfolio non trouvé</p>
          <Link href="/solutions/portfolio" className="text-primary hover:underline">
            ← Retour à mes portfolios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header Éditeur */}
      <header className="bg-surface border-b border-border/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Gauche */}
            <div className="flex items-center space-x-4">
              <Link href="/solutions/portfolio" className="text-text-muted hover:text-text-secondary transition-colors">
                ← Retour
              </Link>
              <div>
                <h1 className="font-display font-bold text-text-primary">{portfolio.title}</h1>
                <p className="text-xs text-text-muted">
                  {saving ? '⏳ Sauvegarde...' : '✅ Sauvegardé'}
                </p>
              </div>
            </div>

            {/* Droite */}
            <div className="flex items-center space-x-3">
              {/* Export PDF */}
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="px-4 py-2 border border-border/60 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-elevated disabled:opacity-50 transition-all"
              >
                {exporting ? '⏳ Export...' : '📄 PDF'}
              </button>

              {/* Prévisualisation */}
              <Link
                href={`/p/${portfolio.slug}`}
                target="_blank"
                className="px-4 py-2 border border-border/60 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-all"
              >
                👁️ Prévisualiser
              </Link>

              {/* Publier */}
              <Button
                onClick={handleTogglePublish}
                disabled={saving}
                variant={portfolio.published ? 'outline' : 'primary'}
                size="sm"
                className={portfolio.published ? '!border-warning !text-warning hover:!bg-warning/10' : ''}
              >
                {portfolio.published ? '📤 Dépublier' : '🚀 Publier'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Erreur */}
      {error && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="p-4 bg-error/10 border border-error/20 text-error rounded-2xl">
            {error}
            <button onClick={() => setError(null)} className="ml-4">✕</button>
          </div>
        </div>
      )}

      {/* Zone d'édition */}
      <main className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">

        {/* Sélecteur de template */}
        <div className="mb-6 p-4 bg-surface rounded-2xl border border-border/60">
          <h3 className="font-display font-bold text-text-primary mb-3">🎨 Design du portfolio</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'moderne', name: 'Moderne', icon: '🎨', color: 'from-blue-600 to-purple-600' },
              { id: 'minimal', name: 'Minimal', icon: '⚪', color: 'from-gray-200 to-gray-300' },
              { id: 'sombre', name: 'Sombre', icon: '🌙', color: 'from-gray-800 to-gray-900' }
            ].map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleChangeTemplate(tpl.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  portfolio.template === tpl.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border/60 hover:border-border-light'
                }`}
              >
                <div className={`h-16 rounded-lg bg-gradient-to-br ${tpl.color} mb-2 flex items-center justify-center`}>
                  <span className="text-2xl">{tpl.icon}</span>
                </div>
                <p className={`text-sm font-medium ${
                  portfolio.template === tpl.id ? 'text-primary' : 'text-text-secondary'
                }`}>
                  {tpl.name}
                </p>
              </button>
            ))}
          </div>
</div>

{/* Sélecteur de couleur principale */}
<div className="mb-6 p-4 bg-surface rounded-2xl border border-border/60">
  <h3 className="font-display font-bold text-text-primary mb-3">🎨 Couleur principale</h3>
  <p className="text-sm text-text-muted mb-4">
    Personnalisez la couleur de votre portfolio (boutons, liens, accents...)
  </p>

  <div className="flex flex-wrap items-center gap-4">

    {/* Couleurs prédéfinies */}
    <div className="flex gap-2">
      {[
        { name: 'Bleu', color: '#3b82f6' },
        { name: 'Violet', color: '#8b5cf6' },
        { name: 'Rose', color: '#ec4899' },
        { name: 'Vert', color: '#10b981' },
        { name: 'Orange', color: '#f97316' },
        { name: 'Rouge', color: '#ef4444' }
      ].map((preset) => (
        <button
          key={preset.color}
          type="button"
          onClick={() => handleChangeColor(preset.color)}
          className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${
            (portfolio.primary_color || '#3b82f6') === preset.color
              ? 'border-primary scale-110 ring-2 ring-primary/20'
              : 'border-border/60 hover:border-border-light'
          }`}
          style={{ backgroundColor: preset.color }}
          title={preset.name}
        />
      ))}
    </div>

    {/* Séparateur visuel */}
    <div className="h-12 w-px bg-border/60"></div>

    {/* Sélecteur personnalisé */}
    <div className="flex items-center gap-3">
      <label className="cursor-pointer">
        <input
          type="color"
          value={portfolio.primary_color || '#3b82f6'}
          onChange={(e) => handleChangeColor(e.target.value)}
          className="w-12 h-12 rounded-xl cursor-pointer border-2 border-border/60"
          title="Choisir une couleur personnalisée"
        />
      </label>
      <div>
        <div className="text-xs text-text-muted">Couleur personnalisée</div>
        <code className="text-sm font-mono text-text-secondary font-medium">
          {portfolio.primary_color || '#3b82f6'}
        </code>
      </div>
    </div>
  </div>
</div>

{/* QR Code & Partage */}
        <div className="mb-6 p-4 bg-surface rounded-2xl border border-border/60">
          <h3 className="font-display font-bold text-text-primary mb-3">📱 Partager le portfolio</h3>

          <div className="flex items-center gap-6">
            {/* QR Code - keep bg-white for QR readability */}
            <div className="bg-white p-3 rounded-xl border border-border/60">
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
                <p className="text-sm text-text-muted mb-1">Lien du portfolio :</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-surface-elevated rounded-xl text-sm truncate text-text-secondary">
                    {window.location.origin}/p/{portfolio.slug}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/p/${portfolio.slug}`)
                      alert('Lien copié !')
                    }}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary-hover transition-all"
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
                className="px-4 py-2 bg-success text-white rounded-xl text-sm font-medium hover:bg-success/80 transition-all"
              >
                📥 Télécharger le QR Code
              </button>

              {/* Statut */}
              {!portfolio.published && (
                <p className="text-sm text-warning">
                  ⚠️ Publie ton portfolio pour que le lien fonctionne
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Protection par mot de passe */}
        <div className="mb-6 p-4 bg-surface rounded-2xl border border-border/60">
          <h3 className="font-display font-bold text-text-primary mb-3">🔒 Protection par mot de passe</h3>
          <p className="text-sm text-text-muted mb-4">
            Protège ton portfolio avec un mot de passe. Les visiteurs devront le saisir pour voir le contenu.
          </p>

          {/* Message de feedback */}
          {passwordMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${
              passwordMsg.type === 'success'
                ? 'bg-success/10 border border-success/20 text-success'
                : 'bg-error/10 border border-error/20 text-error'
            }`}>
              {passwordMsg.text}
            </div>
          )}

          {portfolio.is_protected ? (
            <div>
              <div className="flex items-center gap-3 mb-4 p-3 bg-warning/10 border border-warning/20 rounded-xl">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="font-medium text-warning">Portfolio protégé</p>
                  <p className="text-sm text-warning/80">Les visiteurs doivent entrer un mot de passe pour voir le contenu.</p>
                </div>
              </div>

              <div className="flex gap-3">
                {/* Changer le mot de passe */}
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Nouveau mot de passe (min. 4 car.)"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button
                      onClick={handleSetPassword}
                      disabled={passwordSaving}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-all"
                    >
                      {passwordSaving ? '...' : 'Changer'}
                    </button>
                  </div>
                </div>

                {/* Supprimer la protection */}
                <button
                  onClick={handleRemovePassword}
                  disabled={passwordSaving}
                  className="px-4 py-2 bg-error/10 text-error rounded-xl text-sm font-medium hover:bg-error/20 disabled:opacity-50 transition-all"
                >
                  🔓 Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Mot de passe (min. 4 caractères)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button
                onClick={handleSetPassword}
                disabled={passwordSaving}
                className="px-4 py-2 bg-warning text-primary-foreground rounded-xl text-sm font-medium hover:bg-warning/80 disabled:opacity-50 transition-all"
              >
                {passwordSaving ? '...' : '🔒 Activer la protection'}
              </button>
            </div>
          )}
        </div>

        {/* Import CV */}
        <div className="mb-6 p-4 bg-surface rounded-2xl border border-border/60">
          <h3 className="font-display font-bold text-text-primary mb-3">📄 Importer depuis mon CV</h3>
          <p className="text-sm text-text-muted mb-4">
            Tu as déjà optimisé ton CV ? Importe tes informations en un clic !
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowImportModal(true)}
              variant="primary"
              size="sm"
            >
              📥 Importer mon CV
            </Button>
            <Link
              href="/solutions/optimiseur-cv"
              target="_blank"
              className="px-4 py-2 border border-border/60 text-text-secondary rounded-xl font-medium hover:bg-surface-elevated transition-all"
            >
              ✨ Créer un CV optimisé
            </Link>
          </div>
        </div>

        {/* Modal Import CV */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Importer un CV">
            <div className="bg-surface rounded-2xl border border-border/60 shadow-xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="font-display text-xl font-bold text-text-primary mb-4">📄 Importer mon CV</h2>

              <p className="text-text-muted mb-4">
                Colle ici les données JSON de ton CV optimisé, ou upload le fichier JSON.
              </p>

              {/* Zone de texte pour coller le JSON */}
              <textarea
                placeholder='{"prenom": "Jean", "nom": "Dupont", ...}'
                value={importCVData}
                onChange={(e) => setImportCVData(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl font-mono text-sm mb-4 text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />

              {/* Ou upload fichier */}
              <div className="mb-4">
                <label className="block cursor-pointer">
                  <div className="px-4 py-2 border-2 border-dashed border-border/60 rounded-xl text-center text-text-muted hover:border-primary hover:text-primary transition-all">
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
                <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error rounded-xl text-sm">
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
                  className="flex-1 px-4 py-2 border border-border/60 text-text-secondary rounded-xl font-medium hover:bg-surface-elevated transition-all"
                >
                  Annuler
                </button>
                <Button
                  onClick={handleImportCV}
                  disabled={!importCVData || importing}
                  loading={importing}
                  className="flex-1 !rounded-xl"
                >
                  {importing ? 'Import...' : '📥 Importer'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* URL du portfolio */}
        {portfolio.published && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-2xl">
            <p className="text-sm text-success">
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
            <div className="bg-surface rounded-2xl border border-border/60 p-6">
              <h3 className="font-display font-bold text-text-primary mb-4">➕ Ajouter un bloc</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BLOCK_TYPES.map((blockType) => (
                  <button
                    key={blockType.type}
                    onClick={() => handleAddBlock(blockType.type)}
                    disabled={saving}
                    className="p-4 border-2 border-border/60 rounded-xl hover:border-primary hover:bg-primary-light transition-all text-left"
                  >
                    <div className="text-2xl mb-1">{blockType.icon}</div>
                    <div className="font-medium text-text-primary">{blockType.label}</div>
                    <div className="text-xs text-text-muted">{blockType.description}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddBlock(false)}
                className="mt-4 text-text-muted hover:text-text-secondary transition-colors"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddBlock(true)}
              className="w-full py-4 border-2 border-dashed border-border/60 rounded-2xl text-text-muted hover:border-primary hover:text-primary transition-all"
            >
              ➕ Ajouter un bloc
            </button>
          )}
        </div>

        {/* Message si aucun bloc */}
        {blocks.length === 0 && !showAddBlock && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
              Commencez à créer !
            </h3>
            <p className="text-text-muted mb-6">
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

  // Input style constant for reuse in this component
  const inputClass = "w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
  const inputClassSm = "w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"

  return (
    <div className={`bg-surface rounded-2xl border ${isEditing ? 'ring-2 ring-primary border-primary' : 'border-border/60'}`}>

      {/* Header du bloc */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-surface-elevated rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getBlockIcon()}</span>
          <span className="font-medium text-text-secondary capitalize">{block.type}</span>
        </div>

        <div className="flex items-center space-x-1">
          {/* Déplacer */}
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 text-text-muted hover:text-text-secondary disabled:opacity-30 transition-colors"
            title="Monter"
            aria-label="Monter le bloc"
          >
            <span aria-hidden="true">⬆️</span>
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 text-text-muted hover:text-text-secondary disabled:opacity-30 transition-colors"
            title="Descendre"
            aria-label="Descendre le bloc"
          >
            <span aria-hidden="true">⬇️</span>
          </button>

          {/* Éditer / Sauvegarder */}
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-xl hover:bg-primary-hover transition-all"
            >
              ✅ Sauvegarder
            </button>
          ) : (
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-surface-elevated text-text-secondary text-sm rounded-xl hover:bg-border border border-border/60 transition-all"
            >
              ✏️ Modifier
            </button>
          )}

          {/* Supprimer */}
          <button
            onClick={onDelete}
            className="p-1 text-error/60 hover:text-error transition-colors"
            title="Supprimer"
            aria-label="Supprimer le bloc"
          >
            <span aria-hidden="true">🗑️</span>
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
                  className="relative h-48 rounded-xl overflow-hidden mb-4 flex items-center justify-center"
                  style={{
                    backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: content.backgroundImage ? 'transparent' : '#4F46E5'
                  }}
                >
                  {content.overlay && content.backgroundImage && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                  )}
                  <div className="relative z-10 text-center text-white p-4">
                    <h2 className="font-display text-2xl font-bold">{content.title || 'Titre'}</h2>
                    {content.subtitle && <p className="mt-2">{content.subtitle}</p>}
                    {content.buttonText && (
                      <span className="inline-block mt-3 px-4 py-2 bg-white text-gray-900 rounded-xl text-sm">
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
                  className={`${inputClass} text-lg font-bold`}
                />

                {/* Sous-titre */}
                <input
                  type="text"
                  placeholder="Sous-titre (optionnel)"
                  value={content.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className={inputClass}
                />

                {/* Image de fond */}
                <div className="p-3 bg-surface-elevated rounded-xl space-y-2">
                  <p className="text-sm font-medium text-text-secondary">Image de fond :</p>
                  <label className="block cursor-pointer">
                    <div className="px-4 py-2 bg-primary text-primary-foreground text-center rounded-xl hover:bg-primary-hover font-medium text-sm transition-all">
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
                      className="text-error text-sm hover:underline"
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
                  <span className="text-sm text-text-secondary">Assombrir l'image (meilleure lisibilité)</span>
                </label>

                {/* Bouton d'action */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Texte du bouton (optionnel)"
                    value={content.buttonText || ''}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Lien du bouton"
                    value={content.buttonLink || ''}
                    onChange={(e) => handleChange('buttonLink', e.target.value)}
                    className={inputClass}
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
                  className={inputClass}
                />
                <textarea
                  placeholder="Votre texte ici..."
                  value={content.text || ''}
                  onChange={(e) => handleChange('text', e.target.value)}
                  rows={4}
                  className={inputClass}
                />
                <select
                  value={content.style || 'paragraph'}
                  onChange={(e) => handleChange('style', e.target.value)}
                  className="px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
                <div className="border-2 border-dashed border-border/60 rounded-xl p-6 text-center">
                  {content.url ? (
                    <div>
                      <img src={content.url} alt="" className="max-h-64 mx-auto rounded-xl mb-4" />
                      <button
                        type="button"
                        onClick={() => handleChange('url', '')}
                        className="text-error text-sm hover:underline"
                      >
                        🗑️ Supprimer l'image
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <span className="text-4xl mb-2 block">🖼️</span>
                      <p className="text-text-muted mb-4">Aucune image sélectionnée</p>
                    </div>
                  )}
                </div>

                {/* Bouton Upload */}
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-3 bg-primary text-primary-foreground text-center rounded-xl hover:bg-primary-hover font-medium transition-all">
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
                <div className="text-center text-text-muted text-sm">— ou —</div>
                <input
                  type="text"
                  placeholder="Coller une URL d'image"
                  value={content.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  className={inputClass}
                />

                {/* Légende */}
                <input
                  type="text"
                  placeholder="Légende (optionnel)"
                  value={content.caption || ''}
                  onChange={(e) => handleChange('caption', e.target.value)}
                  className={inputClass}
                />
              </>
            )}

            {block.type === 'video' && (
              <>
                {/* Type de vidéo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-secondary">
                    Type de vidéo
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleChange('type', 'upload')}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 font-medium transition-all ${
                        content.type === 'upload' || !content.type
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border/60 hover:border-border-light text-text-secondary'
                      }`}
                    >
                      📤 Depuis mon PC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('type', 'youtube')}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 font-medium transition-all ${
                        content.type === 'youtube'
                          ? 'border-error bg-error/10 text-error'
                          : 'border-border/60 hover:border-border-light text-text-secondary'
                      }`}
                    >
                      ▶️ YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('type', 'vimeo')}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 font-medium transition-all ${
                        content.type === 'vimeo'
                          ? 'border-info bg-info/10 text-info'
                          : 'border-border/60 hover:border-border-light text-text-secondary'
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
                    <div className="border-2 border-dashed border-border/60 rounded-xl p-6 text-center">
                      {content.url ? (
                        <div>
                          <video src={content.url} controls className="max-h-64 mx-auto rounded-xl mb-4" />
                          <button
                            type="button"
                            onClick={() => handleChange('url', '')}
                            className="text-error text-sm hover:underline"
                          >
                            🗑️ Supprimer la vidéo
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <span className="text-4xl mb-2 block">🎬</span>
                          <p className="text-text-muted mb-2">Aucune vidéo sélectionnée</p>
                          <p className="text-text-muted text-sm">Formats acceptés : MP4, WEBM (max 50MB)</p>
                        </div>
                      )}
                    </div>

                    {/* Bouton Upload */}
                    <label className="block cursor-pointer">
                      <div className="px-4 py-3 bg-secondary text-white text-center rounded-xl hover:bg-secondary/80 font-medium transition-all">
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
                      className={inputClass}
                    />
                    {content.url && (
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${content.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] || ''}`}
                          className="w-full h-full rounded-xl"
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
                      className={inputClass}
                    />
                    {content.url && (
                      <div className="aspect-video">
                        <iframe
                          src={`https://player.vimeo.com/video/${content.url.match(/vimeo\.com\/(\d+)/)?.[1] || ''}`}
                          className="w-full h-full rounded-xl"
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
                  className={inputClass}
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
                  className={inputClass}
                />
                <textarea
                  placeholder="Description du projet"
                  value={content.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className={inputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="w-full text-text-muted"
                  disabled={uploading}
                />
                {content.image && (
                  <img src={content.image} alt="" className="max-h-32 rounded-xl" />
                )}
                <input
                  type="text"
                  placeholder="Lien vers le projet (optionnel)"
                  value={content.link || ''}
                  onChange={(e) => handleChange('link', e.target.value)}
                  className={inputClass}
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
                        className="w-full h-24 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...(content.images || [])]
                          newImages.splice(index, 1)
                          handleChange('images', newImages)
                        }}
                        className="absolute top-1 right-1 bg-error text-white rounded-full w-6 h-6 text-xs hover:bg-error/80 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bouton ajouter images */}
                <label className="block cursor-pointer">
                  <div className="px-4 py-3 bg-success text-white text-center rounded-xl hover:bg-success/80 font-medium transition-all">
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

                <p className="text-sm text-text-muted text-center">
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
                  className={inputClass}
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={content.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={content.linkedin || ''}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={content.github || ''}
                  onChange={(e) => handleChange('github', e.target.value)}
                  className={inputClass}
                />
              </>
            )}

            {block.type === 'separator' && (
              <select
                value={content.style || 'line'}
                onChange={(e) => handleChange('style', e.target.value)}
                className="px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
          className="relative h-32 rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: content.backgroundImage ? 'transparent' : '#4F46E5'
          }}
        >
          {content.overlay && content.backgroundImage && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          )}
          <div className="relative z-10 text-center text-white">
            <h2 className="font-display text-xl font-bold">{content.title || 'Hero'}</h2>
            {content.subtitle && <p className="text-sm opacity-90">{content.subtitle}</p>}
          </div>
        </div>
      )

    case 'text':
      return (
        <div>
          {content.title && (
            <h3 className={`font-display font-bold ${content.style === 'heading' ? 'text-2xl' : 'text-lg'} mb-2 text-text-primary`}>
              {content.title}
            </h3>
          )}
          <p className="text-text-secondary whitespace-pre-wrap">{content.text || 'Aucun texte'}</p>
        </div>
      )

    case 'image':
      return content.url ? (
        <div>
          <img src={content.url} alt={content.caption || ''} className="max-h-64 rounded-xl" />
          {content.caption && <p className="text-sm text-text-muted mt-2">{content.caption}</p>}
        </div>
      ) : (
        <p className="text-text-muted">Aucune image</p>
      )

    case 'video':
      if (!content.url) return <p className="text-text-muted">Aucune vidéo</p>

      if (content.type === 'youtube') {
        const videoId = content.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]
        return videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full aspect-video rounded-xl"
            allowFullScreen
            title="YouTube preview"
          />
        ) : <p className="text-error">URL YouTube invalide</p>
      }

      return (
        <video src={content.url} controls className="w-full rounded-xl" />
      )

    case 'gallery':
      return (
        <div className="grid grid-cols-3 gap-2">
          {Array.isArray(content.images) && content.images.map((img, index) => (
            <img
              key={index}
              src={typeof img === 'string' ? img : img.url}
              alt=""
              className="w-full h-24 object-cover rounded-xl"
            />
          ))}
        </div>
      )

    case 'project':
      return (
        <div className="flex gap-4">
          {content.image && (
            <img src={content.image} alt="" className="w-32 h-24 object-cover rounded-xl" />
          )}
          <div>
            <h4 className="font-display font-bold text-text-primary">{content.title || 'Sans titre'}</h4>
            <p className="text-sm text-text-muted">{content.description}</p>
            {content.link && (
              <a href={content.link} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                Voir le projet →
              </a>
            )}
          </div>
        </div>
      )

    case 'contact':
      return (
        <div className="flex flex-wrap gap-4 text-text-secondary">
          {content.email && <span>📧 {content.email}</span>}
          {content.phone && <span>📱 {content.phone}</span>}
          {content.linkedin && <a href={content.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary">LinkedIn</a>}
          {content.github && <a href={content.github} target="_blank" rel="noopener noreferrer" className="text-text-primary">GitHub</a>}
        </div>
      )

    case 'separator':
      if (content.style === 'space') return <div className="h-8" />
      if (content.style === 'dots') return <div className="text-center text-text-muted">• • •</div>
      return <hr className="border-border/60" />

    default:
      return <p className="text-text-muted">Bloc inconnu</p>
  }
}
