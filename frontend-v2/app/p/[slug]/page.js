'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { portfolioApi } from '@/lib/api/portfolioApi'

// ✅ FONCTION pour incrémenter les vues
async function incrementViews(portfolioId) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio-stats/increment-views`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolioId })
    });
  } catch (err) {
    console.error('Erreur incrémentation vues:', err);
  }
}

export default function PublicPortfolioPage() {
  const params = useParams()
  const slug = params.slug

  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (slug) {
      loadPortfolio()
    }
}, [slug])

// Charger la préférence de mode sombre
useEffect(() => {
  const savedMode = localStorage.getItem('portfolioDarkMode')
  if (savedMode === 'true') {
    setDarkMode(true)
  }
}, [])

  const loadPortfolio = async () => {
    try {
      setLoading(true)

      // Vérifier si on a déjà un accès en sessionStorage (token seulement, pas les données)
      const cachedPassword = sessionStorage.getItem(`portfolio_pwd_${slug}`)
      if (cachedPassword) {
        try {
          const result = await portfolioApi.verifyPassword(slug, cachedPassword)
          setPortfolio(result.data)
          await incrementViews(result.data.id)
          return
        } catch (e) {
          // Mot de passe expiré ou invalide, on le supprime
          sessionStorage.removeItem(`portfolio_pwd_${slug}`)
        }
      }

      const result = await portfolioApi.getPublicPortfolio(slug)

      // Si le portfolio est protégé par mot de passe
      if (result.data.is_protected && (!result.data.blocks || result.data.blocks.length === 0)) {
        setPortfolio(result.data)
        setPasswordRequired(true)
        return
      }

      setPortfolio(result.data)
      await incrementViews(result.data.id)
    } catch (err) {
      console.error('Erreur:', err)
      setError('Portfolio non trouvé')
    } finally {
      setLoading(false)
    }
  }

  // Vérifier le mot de passe
  const handleVerifyPassword = async (e) => {
    e.preventDefault()
    if (!passwordInput) return

    try {
      setVerifying(true)
      setPasswordError('')
      const result = await portfolioApi.verifyPassword(slug, passwordInput)

      // Stocker seulement le mot de passe pour re-vérifier côté serveur au rechargement
      sessionStorage.setItem(`portfolio_pwd_${slug}`, passwordInput)

      setPortfolio(result.data)
      setPasswordRequired(false)
      await incrementViews(result.data.id)
    } catch (err) {
      console.error('Erreur vérification:', err)
      setPasswordError('Mot de passe incorrect')
    } finally {
      setVerifying(false)
    }
  }

  // ✅ NOUVEAU : Toggle mode sombre
  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('portfolioDarkMode', newMode.toString())
  }

  // Telecharger le portfolio en PDF
  const handleExportPDF = async () => {
    try {
      setExporting(true)
      const result = await portfolioApi.exportPublicPDF(slug)
      const { pdf, filename } = result.data

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
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-4">🌐</div>
          <p className="text-text-muted">Chargement du portfolio...</p>
        </div>
      </div>
    )
  }

  // Gate mot de passe
  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4">
          <div className="bg-surface rounded-2xl border border-border p-8 text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              {portfolio?.title || 'Portfolio protege'}
            </h1>
            <p className="text-text-muted mb-6">
              Ce portfolio est protege par un mot de passe.
            </p>

            {passwordError && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleVerifyPassword} className="space-y-4" aria-label="Formulaire de mot de passe">
              <input
                type="password"
                placeholder="Entrez le mot de passe"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-center text-lg text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none"
                autoFocus
                aria-label="Mot de passe du portfolio"
              />
              <button
                type="submit"
                disabled={verifying || !passwordInput}
                className="w-full py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: portfolio?.primary_color || '#F59E0B' }}
              >
                {verifying ? 'Verification...' : 'Acceder au portfolio'}
              </button>
            </form>

            <a href="/" className="inline-block mt-6 text-sm text-text-muted hover:text-primary transition-colors">
              &larr; Retour a l&apos;accueil
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Créer les styles CSS dynamiques basés sur la couleur du portfolio
  const customStyles = portfolio?.primary_color ? `
    <style>
      /* Appliquer la couleur personnalisée */
      .custom-color-bg {
        background-color: ${portfolio.primary_color} !important;
      }
      .custom-color-text {
        color: ${portfolio.primary_color} !important;
      }
      .custom-color-border {
        border-color: ${portfolio.primary_color} !important;
      }
      .custom-color-hover:hover {
        background-color: ${portfolio.primary_color} !important;
      }
      
      /* Boutons avec la couleur principale */
      .btn-primary {
        background-color: ${portfolio.primary_color};
        border-color: ${portfolio.primary_color};
      }
      .btn-primary:hover {
        opacity: 0.9;
      }
    </style>
  ` : '';

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Portfolio non trouve</h1>
          <p className="text-text-muted mb-6">Ce portfolio n&apos;existe pas ou n&apos;est pas publie.</p>
          <a href="/" className="text-primary hover:underline">
            &larr; Retour a l&apos;accueil
          </a>
        </div>
      </div>
    )
  }

  // Appliquer le template
const templateStyles = getTemplateStyles(portfolio.template, darkMode)

return (
  <>
    {/* ✅ Injection des styles personnalisés */}
    {customStyles && (
      <div dangerouslySetInnerHTML={{ __html: customStyles }} />
    )}
    
    <div className={`min-h-screen ${templateStyles.background} transition-colors duration-500`}>
      
{/* Header du portfolio */}
<header className={`${templateStyles.header} py-16 px-4 relative transition-colors duration-300`}>
  
  {/* Boutons en haut a droite */}
  <div className="absolute top-4 right-4 flex items-center gap-2">
    {/* Telecharger en PDF */}
    <button
      onClick={handleExportPDF}
      disabled={exporting}
      className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg disabled:opacity-50"
      title="Telecharger en PDF"
      aria-label="Telecharger le portfolio en PDF"
    >
      <span className="text-2xl" aria-hidden="true">{exporting ? '⏳' : '📄'}</span>
    </button>

    {/* Mode sombre */}
    <button
      onClick={toggleDarkMode}
      className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg"
      title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
      aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <span className="text-2xl">
        {darkMode ? '☀️' : '🌙'}
      </span>
    </button>
  </div>

  {/* Titre et description du portfolio (code existant) */}
  <div className="max-w-4xl mx-auto text-center">
    <h1 
      className="text-4xl md:text-5xl font-bold mb-4"
      style={{ 
        color: templateStyles.titleColor.includes('white') 
          ? 'white' 
          : (portfolio?.primary_color || '#1f2937') 
      }}
    >
      {portfolio.title}
    </h1>
    {portfolio.description && (
      <p className={`text-xl ${templateStyles.subtitleColor}`}>
        {portfolio.description}
      </p>
    )}
  </div>
</header>

      {/* Contenu - Blocs */}
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="space-y-12">
          {portfolio.blocks && portfolio.blocks.length > 0 ? (
            portfolio.blocks.map((block) => (
              <PublicBlock 
  key={block.id} 
  block={block} 
  template={portfolio.template}
  styles={templateStyles}
  portfolio={portfolio}
/>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">Ce portfolio est vide pour le moment.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-8 text-center ${templateStyles.footerBg}`}>
        <p className={`text-sm ${templateStyles.footerText}`}>
          Créé avec ❤️ sur <a href="/" className="underline hover:no-underline">Mew</a>
        </p>
</footer>
    </div>
  </>
  )
}

// ==========================================
// STYLES PAR TEMPLATE
// ==========================================

function getTemplateStyles(template, darkMode) {
  // ✅ Si mode sombre activé, forcer les styles sombres pour tous les templates
  if (darkMode) {
    return {
      background: 'bg-gray-900',
      header: 'bg-gray-800',
      titleColor: 'text-white',
      subtitleColor: 'text-gray-300',
      cardBg: 'bg-gray-800 shadow-xl border border-gray-700',
      textColor: 'text-gray-200',
      accentColor: 'text-blue-400',
      footerBg: 'bg-gray-900 border-t border-gray-800',
      footerText: 'text-gray-400'
    }
  }

  // Sinon, utiliser les styles du template normal
  switch (template) {
    case 'moderne':
      return {
        background: 'bg-white',
        header: 'bg-gradient-to-r from-blue-600 to-purple-600',
        titleColor: 'text-white',
        subtitleColor: 'text-blue-100',
        cardBg: 'bg-white shadow-lg',
        textColor: 'text-gray-800',
        accentColor: 'text-blue-600',
        footerBg: 'bg-gray-100',
        footerText: 'text-gray-600'
      }
    
    case 'minimal':
      return {
        background: 'bg-white',
        header: 'bg-white border-b',
        titleColor: 'text-gray-900',
        subtitleColor: 'text-gray-600',
        cardBg: 'bg-white',
        textColor: 'text-gray-800',
        accentColor: 'text-gray-900',
        footerBg: 'bg-white border-t',
        footerText: 'text-gray-500'
      }
    
    case 'sombre':
      return {
        background: 'bg-gray-900',
        header: 'bg-gray-900',
        titleColor: 'text-white',
        subtitleColor: 'text-gray-400',
        cardBg: 'bg-gray-800',
        textColor: 'text-gray-200',
        accentColor: 'text-purple-400',
        footerBg: 'bg-gray-900 border-t border-gray-800',
        footerText: 'text-gray-500'
      }
    
    default: // moderne par défaut
      return {
        background: 'bg-gray-50',
        header: 'bg-gradient-to-r from-blue-600 to-purple-600',
        titleColor: 'text-white',
        subtitleColor: 'text-blue-100',
        cardBg: 'bg-white shadow-lg',
        textColor: 'text-gray-800',
        accentColor: 'text-blue-600',
        footerBg: 'bg-gray-100',
        footerText: 'text-gray-600'
      }
  }
}

// ==========================================
// COMPOSANT PUBLIC BLOCK
// ==========================================

function PublicBlock({ block, template, styles, portfolio }) {
  const content = block.content || {}

  switch (block.type) {
    
case 'hero':
  return (
    <div 
      className="relative h-80 md:h-96 rounded-xl overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: content.backgroundImage ? 'transparent' : (portfolio?.primary_color || '#4F46E5')
      }}
    >
      {content.overlay && content.backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      )}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
        {content.subtitle && (
          <p className="text-xl md:text-2xl opacity-90 mb-6">{content.subtitle}</p>
        )}
        {content.buttonText && content.buttonLink && (
          <a 
            href={content.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {content.buttonText}
          </a>
        )}
      </div>
    </div>
  )
  
case 'text':
  return (
    <div className={`${styles.cardBg} rounded-xl p-8`}>
      {content.title && (
        <h2 
          className={`font-bold mb-4 ${
            content.style === 'heading' ? 'text-3xl' : 'text-xl'
          }`}
          style={{ color: portfolio?.primary_color || styles.accentColor }}
        >
          {content.title}
        </h2>
      )}
      {content.text && (
        <p className={`${styles.textColor} whitespace-pre-wrap leading-relaxed`}>
          {content.text}
        </p>
      )}
    </div>
  )

    case 'image':
      if (!content.url) return null
      return (
        <div className={`${styles.cardBg} rounded-xl overflow-hidden`}>
          <div className="relative w-full" style={{ minHeight: '200px' }}>
            <Image
              src={content.url}
              alt={content.caption || ''}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 896px"
              unoptimized
            />
          </div>
          {content.caption && (
            <p className={`p-4 text-sm ${styles.textColor} opacity-75`}>
              {content.caption}
            </p>
          )}
        </div>
      )

    case 'video':
      if (!content.url) return null
      
      // YouTube
      if (content.type === 'youtube') {
        const videoId = content.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]
        if (!videoId) return null
        return (
          <div className={`${styles.cardBg} rounded-xl overflow-hidden`}>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            {content.caption && (
              <p className={`p-4 text-sm ${styles.textColor} opacity-75`}>
                {content.caption}
              </p>
            )}
          </div>
        )
      }
      
      // Vimeo
      if (content.type === 'vimeo') {
        const videoId = content.url.match(/vimeo\.com\/(\d+)/)?.[1]
        if (!videoId) return null
        return (
          <div className={`${styles.cardBg} rounded-xl overflow-hidden`}>
            <div className="aspect-video">
              <iframe
                src={`https://player.vimeo.com/video/${videoId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            {content.caption && (
              <p className={`p-4 text-sm ${styles.textColor} opacity-75`}>
                {content.caption}
              </p>
            )}
          </div>
        )
      }
      
      // MP4/WEBM upload
      return (
        <div className={`${styles.cardBg} rounded-xl overflow-hidden`}>
          <video 
            src={content.url} 
            controls 
            className="w-full"
          />
          {content.caption && (
            <p className={`p-4 text-sm ${styles.textColor} opacity-75`}>
              {content.caption}
            </p>
          )}
        </div>
      )

    case 'gallery':
      if (!content.images || content.images.length === 0) return null
      return (
        <div className={`${styles.cardBg} rounded-xl p-4`}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {content.images.map((img, index) => (
              <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                <Image
                  src={img.url || img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )

    case 'project':
      return (
        <div className={`${styles.cardBg} rounded-xl overflow-hidden`}>
          <div className="md:flex">
            {content.image && (
              <div className="md:w-1/3 relative h-48 md:h-auto" style={{ minHeight: '192px' }}>
                <Image
                  src={content.image}
                  alt={content.title || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                  unoptimized
                />
              </div>
            )}
            <div className={`p-6 ${content.image ? 'md:w-2/3' : 'w-full'}`}>
              <h3 className={`text-xl font-bold mb-2 ${styles.accentColor}`}>
                {content.title || 'Projet'}
              </h3>
              {content.description && (
                <p className={`${styles.textColor} mb-4`}>
                  {content.description}
                </p>
              )}
              {content.link && (
                <a 
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center ${styles.accentColor} font-medium hover:underline`}
                >
                  Voir le projet →
                </a>
              )}
            </div>
          </div>
        </div>
      )

case 'contact':
  return <ContactForm content={content} styles={styles} portfolio={portfolio} />

    case 'separator':
      if (content.style === 'space') {
        return <div className="h-12" />
      }
      if (content.style === 'dots') {
        return (
          <div className="text-center py-4">
            <span className={`text-2xl ${styles.textColor} opacity-30`}>• • •</span>
          </div>
        )
      }
      return <hr className="border-gray-300 my-8" />

    default:
      return null
  }
}

// ==========================================
// COMPOSANT FORMULAIRE DE CONTACT
// ==========================================

function ContactForm({ content, styles, portfolio }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle, sending, success, error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          portfolioOwnerEmail: portfolio.owner_email,
          portfolioTitle: portfolio.title
        })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('Erreur envoi contact:', err)
      setStatus('error')
      setErrorMsg(err.message || 'Impossible d\'envoyer le message')
    }
  }

  return (
    <div className={`${styles.cardBg} rounded-xl p-8`}>
      {content.title && (
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: portfolio?.primary_color || undefined }}
        >
          {content.title}
        </h2>
      )}

      {/* Liens de contact directs */}
      {(content.email || content.phone || content.linkedin || content.github) && (
        <div className="flex flex-wrap gap-4 mb-8">
          {content.email && (
            <a
              href={`mailto:${content.email}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${styles.textColor} hover:opacity-80 transition-opacity`}
              style={{ backgroundColor: portfolio?.primary_color ? `${portfolio.primary_color}20` : undefined }}
            >
              <span>✉️</span> {content.email}
            </a>
          )}
          {content.phone && (
            <a
              href={`tel:${content.phone}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${styles.textColor} hover:opacity-80 transition-opacity`}
              style={{ backgroundColor: portfolio?.primary_color ? `${portfolio.primary_color}20` : undefined }}
            >
              <span>📞</span> {content.phone}
            </a>
          )}
          {content.linkedin && (
            <a
              href={content.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${styles.textColor} hover:opacity-80 transition-opacity`}
              style={{ backgroundColor: portfolio?.primary_color ? `${portfolio.primary_color}20` : undefined }}
            >
              <span>💼</span> LinkedIn
            </a>
          )}
          {content.github && (
            <a
              href={content.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${styles.textColor} hover:opacity-80 transition-opacity`}
              style={{ backgroundColor: portfolio?.primary_color ? `${portfolio.primary_color}20` : undefined }}
            >
              <span>🐙</span> GitHub
            </a>
          )}
        </div>
      )}

      {/* Message de succes */}
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Votre message a bien ete envoye ! Merci pour votre contact.
        </div>
      )}

      {/* Message d'erreur */}
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Formulaire */}
      {portfolio.owner_email ? (
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulaire de contact">
          <div>
            <label className={`block text-sm font-medium mb-1 ${styles.textColor}`}>
              Votre nom
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none text-gray-900"
              style={{ focusRingColor: portfolio?.primary_color }}
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${styles.textColor}`}>
              Votre email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none text-gray-900"
              placeholder="jean@exemple.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${styles.textColor}`}>
              Message
            </label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none text-gray-900 resize-vertical"
              placeholder="Votre message..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: portfolio?.primary_color || '#3b82f6' }}
          >
            {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      ) : (
        <p className={`text-sm ${styles.textColor} opacity-60`}>
          Le formulaire de contact n'est pas disponible pour ce portfolio.
        </p>
      )}
    </div>
  )
}