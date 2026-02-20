'use client'

import { useState, useEffect } from 'react'
import { saveSocialKeys, getSocialKeys, deleteSocialKeys, testSocialConnection } from '@/lib/api/marketingApi'

const PLATFORMS = [
  {
    id: 'twitter',
    name: 'Twitter / X',
    emoji: '🐦',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'Votre API Key (commence par ...)' },
      { key: 'apiSecret', label: 'API Secret', placeholder: 'Votre API Key Secret' },
      { key: 'accessToken', label: 'Access Token', placeholder: 'Votre Access Token' },
      { key: 'accessTokenSecret', label: 'Access Token Secret', placeholder: 'Votre Access Token Secret' }
    ],
    tutorial: {
      steps: [
        'Allez sur developer.twitter.com et connectez-vous',
        'Cliquez sur "Developer Portal" puis "Projects & Apps"',
        'Creez un nouveau projet puis une nouvelle App',
        'Dans les parametres de l\'app, activez les permissions "Read and Write"',
        'Allez dans l\'onglet "Keys and Tokens"',
        'Generez votre API Key et API Secret (notez-les immediatement)',
        'Generez votre Access Token et Access Token Secret',
        'Collez les 4 valeurs dans les champs ci-dessus'
      ],
      link: 'https://developer.twitter.com/en/portal/dashboard',
      note: 'Necessite un compte Developer Twitter (gratuit, acces basique = 1500 tweets/mois)'
    }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    emoji: '💼',
    fields: [
      { key: 'accessToken', label: 'Access Token', placeholder: 'Votre Access Token LinkedIn' }
    ],
    tutorial: {
      steps: [
        'Allez sur linkedin.com/developers et connectez-vous',
        'Cliquez sur "Create App" et remplissez les informations',
        'Associez votre app a une Page LinkedIn (obligatoire)',
        'Dans l\'onglet "Auth", ajoutez le scope "w_member_social"',
        'Dans l\'onglet "Auth", notez votre Client ID et Client Secret',
        'Utilisez l\'outil OAuth 2.0 de LinkedIn pour generer un Access Token',
        'Allez sur linkedin.com/developers/tools/oauth et autorisez votre app',
        'Copiez l\'Access Token genere dans le champ ci-dessus'
      ],
      link: 'https://www.linkedin.com/developers/apps',
      note: 'Le token expire apres 60 jours. Il faudra le renouveler.'
    }
  },
  {
    id: 'facebook',
    name: 'Facebook',
    emoji: '👥',
    fields: [
      { key: 'pageAccessToken', label: 'Page Access Token', placeholder: 'Token d\'acces de votre Page' },
      { key: 'pageId', label: 'Page ID', placeholder: 'ID numerique de votre Page Facebook' }
    ],
    tutorial: {
      steps: [
        'Allez sur developers.facebook.com et connectez-vous',
        'Cliquez sur "Creer une app" > type "Business"',
        'Ajoutez le produit "Facebook Login for Business"',
        'Allez dans "Outils" > "Explorateur de l\'API Graph"',
        'Selectionnez votre App, puis "Obtenir un token d\'utilisateur"',
        'Cochez les permissions : pages_manage_posts, pages_read_engagement',
        'Generez le token, puis selectionnez votre Page dans le menu',
        'Cliquez sur "Obtenir le Page Access Token"',
        'Pour trouver votre Page ID : allez sur votre Page > A propos > transparence'
      ],
      link: 'https://developers.facebook.com/tools/explorer/',
      note: 'Pour un token permanent : convertissez-le via l\'API Graph (endpoint /oauth/access_token)'
    }
  },
  {
    id: 'instagram',
    name: 'Instagram',
    emoji: '📸',
    fields: [
      { key: 'accessToken', label: 'Access Token', placeholder: 'Meme token que Facebook (Page Access Token)' },
      { key: 'igBusinessAccountId', label: 'Instagram Business Account ID', placeholder: 'ID de votre compte Business Instagram' }
    ],
    tutorial: {
      steps: [
        'Prerequis : votre compte Instagram doit etre un compte Business ou Creator',
        'Votre compte Instagram doit etre lie a une Page Facebook',
        'Utilisez le meme Access Token que pour Facebook (voir tuto Facebook)',
        'Pour trouver votre Instagram Business Account ID :',
        'Dans l\'Explorateur Graph API, faites un GET sur /{page-id}?fields=instagram_business_account',
        'L\'ID retourne est votre Instagram Business Account ID',
        'Collez-le dans le champ ci-dessous'
      ],
      link: 'https://developers.facebook.com/tools/explorer/',
      note: 'Instagram necessite OBLIGATOIREMENT une image pour chaque publication. Generez une image DALL-E avant de publier.'
    }
  },
  {
    id: 'youtube',
    name: 'YouTube',
    emoji: '▶️',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'Cle API YouTube Data v3' },
      { key: 'clientId', label: 'Client ID OAuth', placeholder: 'Client ID de votre projet Google' },
      { key: 'clientSecret', label: 'Client Secret', placeholder: 'Client Secret de votre projet' },
      { key: 'refreshToken', label: 'Refresh Token', placeholder: 'Token de rafraichissement OAuth' }
    ],
    tutorial: {
      steps: [
        'Allez sur console.cloud.google.com',
        'Creez un nouveau projet (ou selectionnez un existant)',
        'Dans "APIs & Services" > "Library", activez "YouTube Data API v3"',
        'Dans "APIs & Services" > "Credentials", creez une cle API',
        'Creez aussi des identifiants OAuth 2.0 (type "Application Web")',
        'Ajoutez https://developers.google.com/oauthplayground dans les URIs de redirection',
        'Allez sur developers.google.com/oauthplayground',
        'Cliquez sur la roue dentee, cochez "Use your own OAuth credentials"',
        'Entrez votre Client ID et Client Secret',
        'Dans la liste, selectionnez "YouTube Data API v3" > tous les scopes',
        'Autorisez, puis cliquez sur "Exchange authorization code for tokens"',
        'Copiez le Refresh Token'
      ],
      link: 'https://console.cloud.google.com/',
      note: 'Le Refresh Token est permanent tant que vous ne revoquez pas l\'acces.'
    }
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    emoji: '🎵',
    fields: [
      { key: 'accessToken', label: 'Access Token', placeholder: 'Votre Access Token TikTok' }
    ],
    tutorial: {
      steps: [
        'Allez sur developers.tiktok.com et creez un compte developpeur',
        'Cliquez sur "Manage Apps" puis "Create App"',
        'Selectionnez les produits : "Login Kit" et "Content Posting API"',
        'Configurez votre Redirect URI (ex: https://votre-site.com/callback)',
        'Soumettez votre app pour review (peut prendre quelques jours)',
        'Une fois approuvee, utilisez le flux OAuth pour obtenir un Access Token',
        'L\'URL d\'autorisation est : https://www.tiktok.com/v2/auth/authorize/',
        'Echangez le code d\'autorisation contre un Access Token via l\'API',
        'Collez l\'Access Token dans le champ ci-dessus'
      ],
      link: 'https://developers.tiktok.com/',
      note: 'L\'acces au Content Posting API necessite une validation par TikTok. La publication de texte seul n\'est pas supportee, il faut une video.'
    }
  }
]

export default function SocialKeysManager({ userId, onClose, onKeysUpdate }) {
  const [connectedPlatforms, setConnectedPlatforms] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedPlatform, setExpandedPlatform] = useState(null)
  const [showTutorial, setShowTutorial] = useState(null)
  const [forms, setForms] = useState({})
  const [saving, setSaving] = useState(null)
  const [testing, setTesting] = useState(null)
  const [testResult, setTestResult] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    loadKeys()
  }, [userId])

  const loadKeys = async () => {
    try {
      const keys = await getSocialKeys(userId)
      setConnectedPlatforms(keys || [])
      if (onKeysUpdate) onKeysUpdate(keys || [])
    } catch (err) {
      console.error('Erreur chargement cles:', err)
    } finally {
      setLoading(false)
    }
  }

  const isConnected = (platformId) =>
    connectedPlatforms.some(k => k.platform === platformId)

  const handleFieldChange = (platformId, fieldKey, value) => {
    setForms(prev => ({
      ...prev,
      [platformId]: { ...(prev[platformId] || {}), [fieldKey]: value }
    }))
  }

  const handleSave = async (platformId) => {
    setSaving(platformId)
    setError('')
    try {
      const credentials = forms[platformId]
      if (!credentials || Object.keys(credentials).length === 0) {
        throw new Error('Remplissez tous les champs')
      }
      await saveSocialKeys(userId, platformId, credentials)
      await loadKeys()
      setForms(prev => ({ ...prev, [platformId]: {} }))
      setTestResult(prev => ({ ...prev, [platformId]: null }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(null)
    }
  }

  const handleTest = async (platformId) => {
    setTesting(platformId)
    setTestResult(prev => ({ ...prev, [platformId]: null }))
    try {
      const result = await testSocialConnection(userId, platformId)
      setTestResult(prev => ({ ...prev, [platformId]: { success: true, ...result } }))
    } catch (err) {
      setTestResult(prev => ({ ...prev, [platformId]: { success: false, error: err.message } }))
    } finally {
      setTesting(null)
    }
  }

  const handleDelete = async (platformId) => {
    if (!confirm(`Supprimer les cles ${platformId} ?`)) return
    try {
      await deleteSocialKeys(userId, platformId)
      await loadKeys()
      setTestResult(prev => ({ ...prev, [platformId]: null }))
    } catch (err) {
      setError(err.message)
    }
  }

  const inputStyles = 'w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Cles API - Reseaux Sociaux</h2>
            <p className="text-xs text-text-muted mt-1">Configurez vos cles pour publier directement depuis le createur</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-text-muted hover:text-text-primary cursor-pointer transition-colors"
          >
            &#10005;
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 bg-red-900/20 border border-red-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-red-300">{error}</p>
              <button onClick={() => setError('')} className="text-xs text-red-400 cursor-pointer">&#10005;</button>
            </div>
          </div>
        )}

        {/* Liste des plateformes */}
        <div className="overflow-y-auto flex-1 p-6 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-text-muted">Chargement...</div>
          ) : (
            PLATFORMS.map(platform => {
              const connected = isConnected(platform.id)
              const isExpanded = expandedPlatform === platform.id
              const isTutoOpen = showTutorial === platform.id
              const test = testResult[platform.id]

              return (
                <div key={platform.id} className="bg-surface rounded-xl border border-border overflow-hidden">

                  {/* Platform header */}
                  <button
                    onClick={() => setExpandedPlatform(isExpanded ? null : platform.id)}
                    className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-surface-elevated/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.emoji}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-text-primary">{platform.name}</p>
                        <p className="text-xs text-text-muted">
                          {platform.fields.length} cle{platform.fields.length > 1 ? 's' : ''} requise{platform.fields.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {connected && (
                        <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full font-medium">
                          Connecte
                        </span>
                      )}
                      <svg className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">

                      {/* Tutoriel toggle */}
                      <button
                        onClick={() => setShowTutorial(isTutoOpen ? null : platform.id)}
                        className="text-xs text-primary hover:text-primary/80 cursor-pointer font-medium"
                      >
                        {isTutoOpen ? '▼ Masquer le tutoriel' : '▶ Comment obtenir les cles ?'}
                      </button>

                      {/* Tutoriel */}
                      {isTutoOpen && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                          <div className="space-y-2">
                            {platform.tutorial.steps.map((step, i) => (
                              <div key={i} className="flex items-start text-xs text-text-secondary">
                                <span className="text-primary font-bold mr-2 mt-0.5 min-w-[18px]">{i + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                          {platform.tutorial.note && (
                            <div className="text-xs text-text-muted italic bg-surface-elevated rounded p-2">
                              Note : {platform.tutorial.note}
                            </div>
                          )}
                          <a
                            href={platform.tutorial.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs text-primary hover:underline font-medium"
                          >
                            Ouvrir le portail developpeur ↗
                          </a>
                        </div>
                      )}

                      {/* Formulaire cles */}
                      <div className="space-y-3">
                        {platform.fields.map(field => (
                          <div key={field.key}>
                            <label className="block text-xs font-medium text-text-secondary mb-1">
                              {field.label}
                            </label>
                            <input
                              type="password"
                              value={forms[platform.id]?.[field.key] || ''}
                              onChange={e => handleFieldChange(platform.id, field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className={inputStyles}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Test result */}
                      {test && (
                        <div className={`text-xs rounded-lg p-2 ${
                          test.success
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {test.success
                            ? `Connexion reussie ! Compte : ${test.account || test.name || 'OK'}`
                            : `Echec : ${test.error}`
                          }
                        </div>
                      )}

                      {/* Boutons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(platform.id)}
                          disabled={saving === platform.id}
                          className="px-4 py-2 text-xs font-medium rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {saving === platform.id ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                        {connected && (
                          <>
                            <button
                              onClick={() => handleTest(platform.id)}
                              disabled={testing === platform.id}
                              className="px-4 py-2 text-xs font-medium rounded-lg bg-surface-elevated text-text-secondary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {testing === platform.id ? 'Test...' : 'Tester'}
                            </button>
                            <button
                              onClick={() => handleDelete(platform.id)}
                              className="px-4 py-2 text-xs font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-text-muted text-center">
            {connectedPlatforms.length} plateforme{connectedPlatforms.length !== 1 ? 's' : ''} connectee{connectedPlatforms.length !== 1 ? 's' : ''}
            {' '} &bull; Vos cles sont stockees de maniere securisee
          </p>
        </div>
      </div>
    </div>
  )
}
