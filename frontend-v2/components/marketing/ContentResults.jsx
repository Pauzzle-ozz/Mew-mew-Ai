'use client'

import { useState } from 'react'
import CharacterCounter from './CharacterCounter'
import { PLATFORM_LIMITS } from '@/lib/constants/redacteur'

const PLATFORM_META = {
  linkedin: { name: 'LinkedIn', emoji: '💼' },
  instagram: { name: 'Instagram', emoji: '📸' },
  twitter: { name: 'Twitter/X', emoji: '🐦' },
  blog: { name: 'Blog SEO', emoji: '📝' },
  video_script: { name: 'Script Video', emoji: '🎬' },
  newsletter: { name: 'Newsletter', emoji: '📧' }
}

function QualityBadge({ score }) {
  if (!score && score !== 0) return null
  const color = score >= 75 ? 'bg-green-900/30 text-green-400' : score >= 50 ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{score}/100</span>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer bg-surface-elevated text-text-secondary hover:text-primary hover:bg-primary/10"
    >
      {copied ? '✓ Copie !' : 'Copier'}
    </button>
  )
}

function RegenerateButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer bg-surface-elevated text-text-secondary hover:text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? '⟳ Regeneration...' : '⟳ Regenerer'}
    </button>
  )
}

const editableTextareaStyles = 'w-full bg-surface-elevated rounded-lg p-4 text-sm text-text-primary font-sans resize-none border border-transparent focus:border-primary/30 focus:outline-none transition-colors'

function LinkedInContent({ data, onChange }) {
  const limit = PLATFORM_LIMITS.linkedin
  return (
    <div className="space-y-4">
      <textarea
        spellCheck={true}
        value={data.content || ''}
        onChange={(e) => onChange('content', e.target.value)}
        rows={8}
        className={editableTextareaStyles}
      />
      {data.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.hashtags.map((h, i) => (
            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{h}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <CharacterCounter current={(data.content || '').length} max={limit.max} unit={limit.unit} />
        <CopyButton text={(data.content || '') + (data.hashtags?.length ? '\n\n' + data.hashtags.join(' ') : '')} />
      </div>
    </div>
  )
}

function InstagramContent({ data, onChange }) {
  const limit = PLATFORM_LIMITS.instagram
  return (
    <div className="space-y-4">
      <textarea
        spellCheck={true}
        value={data.content || ''}
        onChange={(e) => onChange('content', e.target.value)}
        rows={8}
        className={editableTextareaStyles}
      />
      {data.hashtags?.length > 0 && (
        <div>
          <p className="text-xs text-text-muted mb-2">Hashtags ({data.hashtags.length})</p>
          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs text-primary break-all">{data.hashtags.join(' ')}</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <CharacterCounter current={(data.content || '').length} max={limit.max} unit={limit.unit} />
        <CopyButton text={(data.content || '') + '\n\n.\n.\n.\n\n' + (data.hashtags?.join(' ') || '')} />
      </div>
    </div>
  )
}

function TwitterContent({ data, onChange }) {
  const limit = PLATFORM_LIMITS.twitter
  const tweets = data.tweets || []

  const handleTweetChange = (index, value) => {
    const newTweets = [...tweets]
    newTweets[index] = value
    onChange('tweets', newTweets)
  }

  const handleAddTweet = () => {
    onChange('tweets', [...tweets, ''])
  }

  const handleRemoveTweet = (index) => {
    if (tweets.length <= 1) return
    onChange('tweets', tweets.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {tweets.map((tweet, i) => (
        <div key={i} className="bg-surface-elevated rounded-lg p-4 border-l-2 border-primary/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-medium">Tweet {i + 1}/{tweets.length}</span>
            <div className="flex items-center gap-2">
              <CharacterCounter current={(tweet || '').length} max={limit.max} unit={limit.unit} />
              <CopyButton text={tweet} />
              {tweets.length > 1 && (
                <button
                  onClick={() => handleRemoveTweet(i)}
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <textarea
            spellCheck={true}
            value={tweet || ''}
            onChange={(e) => handleTweetChange(i, e.target.value)}
            rows={3}
            className={editableTextareaStyles + ' !p-3'}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddTweet}
        className="w-full py-2 rounded-lg border border-dashed border-border text-xs text-text-muted hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
      >
        + Ajouter un tweet
      </button>
      {data.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.hashtags.map((h, i) => (
            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{h}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function BlogContent({ data, onChange }) {
  const limit = PLATFORM_LIMITS.blog
  const wordCount = (data.content || '').split(/\s+/).filter(Boolean).length
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-text-muted mb-1">Titre</p>
        <input
          spellCheck={true}
          value={data.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full bg-surface-elevated rounded-lg px-4 py-2.5 text-lg font-bold text-text-primary border border-transparent focus:border-primary/30 focus:outline-none transition-colors"
        />
      </div>
      {data.metaDescription !== undefined && (
        <div>
          <p className="text-xs text-text-muted mb-1">Meta description</p>
          <input
            spellCheck={true}
            value={data.metaDescription || ''}
            onChange={(e) => onChange('metaDescription', e.target.value)}
            className="w-full bg-surface-elevated rounded-lg px-4 py-2.5 text-sm text-text-secondary italic border border-transparent focus:border-primary/30 focus:outline-none transition-colors"
          />
          <div className="mt-1">
            <CharacterCounter current={(data.metaDescription || '').length} max={155} unit="caracteres" />
          </div>
        </div>
      )}
      <textarea
        spellCheck={true}
        value={data.content || ''}
        onChange={(e) => onChange('content', e.target.value)}
        rows={16}
        className={editableTextareaStyles + ' leading-relaxed'}
      />
      <div className="flex items-center justify-between">
        <CharacterCounter current={wordCount} max={limit.max} unit={limit.unit} />
        <CopyButton text={data.content || ''} />
      </div>
    </div>
  )
}

function VideoScriptContent({ data, onChange }) {
  return (
    <div className="space-y-4">
      {data.hook !== undefined && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-xs text-primary font-medium mb-1">Hook (3 premieres secondes)</p>
          <input
            spellCheck={true}
            value={data.hook || ''}
            onChange={(e) => onChange('hook', e.target.value)}
            className="w-full bg-transparent text-sm text-text-primary font-semibold border-none focus:outline-none"
          />
        </div>
      )}
      <textarea
        spellCheck={true}
        value={data.script || ''}
        onChange={(e) => onChange('script', e.target.value)}
        rows={10}
        className={editableTextareaStyles}
      />
      {data.visualNotes?.length > 0 && (
        <div>
          <p className="text-xs text-text-muted mb-2">Notes visuelles</p>
          <div className="space-y-1">
            {data.visualNotes.map((note, i) => (
              <div key={i} className="flex items-start text-xs text-text-secondary">
                <span className="text-primary mr-2">&#9658;</span>{note}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{data.duration || '~60s'}</span>
        <CopyButton text={data.script || ''} />
      </div>
    </div>
  )
}

function NewsletterContent({ data, onChange }) {
  const limit = PLATFORM_LIMITS.newsletter
  const wordCount = (data.content || '').split(/\s+/).filter(Boolean).length
  return (
    <div className="space-y-4">
      {data.subject !== undefined && (
        <div>
          <p className="text-xs text-text-muted mb-1">Objet</p>
          <input
            spellCheck={true}
            value={data.subject || ''}
            onChange={(e) => onChange('subject', e.target.value)}
            className="w-full bg-surface-elevated rounded-lg px-4 py-2.5 text-sm font-semibold text-text-primary border border-transparent focus:border-primary/30 focus:outline-none transition-colors"
          />
          <div className="mt-1">
            <CharacterCounter current={(data.subject || '').length} max={50} unit="caracteres" />
          </div>
        </div>
      )}
      {data.preheader !== undefined && (
        <div>
          <p className="text-xs text-text-muted mb-1">Preheader</p>
          <input
            spellCheck={true}
            value={data.preheader || ''}
            onChange={(e) => onChange('preheader', e.target.value)}
            className="w-full bg-surface-elevated rounded-lg px-4 py-2.5 text-sm text-text-secondary italic border border-transparent focus:border-primary/30 focus:outline-none transition-colors"
          />
        </div>
      )}
      <textarea
        spellCheck={true}
        value={data.content || ''}
        onChange={(e) => onChange('content', e.target.value)}
        rows={12}
        className={editableTextareaStyles + ' leading-relaxed'}
      />
      {data.cta !== undefined && (
        <div className="bg-primary/10 rounded-lg p-3 text-center">
          <p className="text-xs text-text-muted mb-1">Call-to-Action</p>
          <input
            spellCheck={true}
            value={data.cta || ''}
            onChange={(e) => onChange('cta', e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-primary text-center border-none focus:outline-none"
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <CharacterCounter current={wordCount} max={limit.max} unit={limit.unit} />
        <CopyButton text={data.content || ''} />
      </div>
    </div>
  )
}

const RENDERERS = {
  linkedin: LinkedInContent,
  instagram: InstagramContent,
  twitter: TwitterContent,
  blog: BlogContent,
  video_script: VideoScriptContent,
  newsletter: NewsletterContent
}

export default function ContentResults({ data, onDataChange, brief, onRegenerate }) {
  const availablePlatforms = Object.keys(data?.platforms || {})
  const [activeTab, setActiveTab] = useState(availablePlatforms[0] || '')
  const [regenerating, setRegenerating] = useState(null)
  const [showMockup, setShowMockup] = useState(false)

  if (!data?.platforms || availablePlatforms.length === 0) {
    return (
      <div className="text-center text-text-muted py-8">
        Aucun contenu genere
      </div>
    )
  }

  const Renderer = RENDERERS[activeTab]
  const platformData = data.platforms[activeTab]

  const handleFieldChange = (field, value) => {
    if (onDataChange) {
      onDataChange(activeTab, field, value)
    }
  }

  const handleRegenerateClick = async () => {
    if (!onRegenerate || regenerating) return
    setRegenerating(activeTab)
    try {
      await onRegenerate(activeTab)
    } finally {
      setRegenerating(null)
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 flex gap-1 bg-surface-elevated rounded-xl p-1 overflow-x-auto">
          {availablePlatforms.map(p => {
            const meta = PLATFORM_META[p] || { name: p, emoji: '📄' }
            const score = data.platforms[p]?.qualityScore
            return (
              <button
                key={p}
                onClick={() => setActiveTab(p)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === p
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <span>{meta.emoji}</span>
                <span className="hidden sm:inline">{meta.name}</span>
                {score > 0 && activeTab !== p && (
                  <span className={`text-xs ml-1 ${score >= 75 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {score}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowMockup(!showMockup)}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            showMockup ? 'bg-primary text-white' : 'bg-surface-elevated text-text-secondary hover:text-primary'
          }`}
          title="Apercu plateforme"
        >
          {showMockup ? '✕ Apercu' : '👁 Apercu'}
        </button>
      </div>

      {/* Content */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{PLATFORM_META[activeTab]?.emoji}</span>
            <h3 className="text-lg font-semibold text-text-primary">{PLATFORM_META[activeTab]?.name}</h3>
            <QualityBadge score={platformData?.qualityScore} />
          </div>
          {onRegenerate && (
            <RegenerateButton onClick={handleRegenerateClick} loading={regenerating === activeTab} />
          )}
        </div>

        {showMockup ? (
          <PlatformMockupWrapper platform={activeTab}>
            {Renderer && platformData ? (
              <Renderer data={platformData} onChange={handleFieldChange} />
            ) : (
              <p className="text-text-muted text-sm">Contenu non disponible pour cette plateforme</p>
            )}
          </PlatformMockupWrapper>
        ) : (
          Renderer && platformData ? (
            <Renderer data={platformData} onChange={handleFieldChange} />
          ) : (
            <p className="text-text-muted text-sm">Contenu non disponible pour cette plateforme</p>
          )
        )}
      </div>
    </div>
  )
}

// Inline mockup wrapper - simple visual frames per platform
function PlatformMockupWrapper({ platform, children }) {
  const mockups = {
    linkedin: (
      <div className="bg-white rounded-lg shadow-lg max-w-lg mx-auto overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <div className="h-3 w-28 bg-gray-300 rounded mb-1.5" />
            <div className="h-2 w-40 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="p-4">{children}</div>
        <div className="flex items-center justify-around py-3 border-t border-gray-200 text-gray-400 text-xs">
          <span>👍 J'aime</span>
          <span>💬 Commenter</span>
          <span>🔄 Partager</span>
          <span>📤 Envoyer</span>
        </div>
      </div>
    ),
    instagram: (
      <div className="bg-black rounded-2xl max-w-sm mx-auto overflow-hidden border border-gray-800">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-black" />
          </div>
          <span className="text-white text-xs font-medium">votre_compte</span>
        </div>
        <div className="aspect-square bg-gray-900 flex items-center justify-center text-gray-600 text-xs">
          Votre visuel ici
        </div>
        <div className="flex items-center gap-4 px-3 py-2">
          <span className="text-white text-lg">♡</span>
          <span className="text-white text-lg">💬</span>
          <span className="text-white text-lg">📤</span>
        </div>
        <div className="px-3 pb-3">{children}</div>
      </div>
    ),
    twitter: (
      <div className="bg-black rounded-xl max-w-lg mx-auto border border-gray-800 overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white text-sm font-bold">Votre nom</span>
              <span className="text-gray-500 text-xs">@handle · 1h</span>
            </div>
            {children}
          </div>
        </div>
        <div className="flex items-center justify-around py-2.5 border-t border-gray-800 text-gray-500 text-xs">
          <span>💬 12</span>
          <span>🔄 34</span>
          <span>♡ 156</span>
          <span>📊 2.4k</span>
        </div>
      </div>
    ),
    blog: (
      <div className="bg-white rounded-lg max-w-2xl mx-auto overflow-hidden shadow-lg">
        <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 bg-white rounded text-xs text-gray-400 px-3 py-1 ml-2">votre-blog.com/article</div>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    ),
    video_script: (
      <div className="bg-black rounded-3xl max-w-xs mx-auto overflow-hidden border-4 border-gray-800 relative">
        <div className="aspect-[9/16] bg-gray-900 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-2xl ml-1">▶</span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
            {children}
          </div>
        </div>
      </div>
    ),
    newsletter: (
      <div className="bg-gray-100 rounded-lg max-w-lg mx-auto overflow-hidden">
        <div className="bg-gray-200 px-4 py-2 text-xs text-gray-600 space-y-1">
          <div><span className="font-medium">De :</span> votre-marque@email.com</div>
          <div><span className="font-medium">A :</span> destinataire@email.com</div>
        </div>
        <div className="bg-white p-6">{children}</div>
        <div className="bg-gray-200 px-4 py-3 text-center">
          <p className="text-xs text-gray-400">Se desinscrire · Politique de confidentialite</p>
        </div>
      </div>
    )
  }

  return mockups[platform] || <div>{children}</div>
}
