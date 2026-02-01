'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { portfolioApi } from '@/lib/api/portfolioApi'

// ✅ FONCTION pour incrémenter les vues
async function incrementViews(portfolioId) {
  try {
    await fetch('http://localhost:5000/api/portfolio-stats/increment-views', {
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

  useEffect(() => {
    if (slug) {
      loadPortfolio()
    }
}, [slug])

// ✅ NOUVEAU : Charger la préférence de mode sombre
useEffect(() => {
  const savedMode = localStorage.getItem('portfolioDarkMode')
  if (savedMode === 'true') {
    setDarkMode(true)
  }
}, [])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      const result = await portfolioApi.getPublicPortfolio(slug)
      setPortfolio(result.data)
      await incrementViews(result.data.id) 
    } catch (err) {
      console.error('Erreur:', err)
      setError('Portfolio non trouvé')
    } finally {
      setLoading(false)
    }
  }

  // ✅ NOUVEAU : Toggle mode sombre
  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('portfolioDarkMode', newMode.toString())
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🌐</div>
          <p className="text-gray-600">Chargement du portfolio...</p>
        </div>
      </div>
    )
  }

  // ✅ NOUVEAU : Créer les styles CSS dynamiques basés sur la couleur du portfolio
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio non trouvé</h1>
          <p className="text-gray-600 mb-6">Ce portfolio n'existe pas ou n'est pas publié.</p>
          <a href="/" className="text-blue-600 hover:underline">
            ← Retour à l'accueil
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
  
  {/* ✅ NOUVEAU : Bouton mode sombre en haut à droite */}
  <button
    onClick={toggleDarkMode}
    className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg"
    title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
  >
    <span className="text-2xl">
      {darkMode ? '☀️' : '🌙'}
    </span>
  </button>

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
          <img 
            src={content.url} 
            alt={content.caption || ''} 
            className="w-full h-auto"
          />
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
              <img 
                key={index}
                src={img.url || img}
                alt=""
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )

    case 'project':
      return (
        <div className={`${styles.cardBg} rounded-xl overflow-hidden`}>
          <div className="md:flex">
            {content.image && (
              <div className="md:w-1/3">
                <img 
                  src={content.image} 
                  alt={content.title || ''} 
                  className="w-full h-48 md:h-full object-cover"
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