'use client'

import { useState } from 'react'

const PLATFORM_META = {
  linkedin: { name: 'LinkedIn', emoji: '💼' },
  instagram: { name: 'Instagram', emoji: '📸' },
  twitter: { name: 'Twitter/X', emoji: '🐦' },
  blog: { name: 'Blog SEO', emoji: '📝' },
  video_script: { name: 'Script Video', emoji: '🎬' },
  newsletter: { name: 'Newsletter', emoji: '📧' }
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

function LinkedInContent({ data }) {
  return (
    <div className="space-y-4">
      <div className="bg-surface-elevated rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans">{data.content}</pre>
      </div>
      {data.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.hashtags.map((h, i) => (
            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{h}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{data.characterCount || 0} caracteres</span>
        <CopyButton text={data.content + (data.hashtags?.length ? '\n\n' + data.hashtags.join(' ') : '')} />
      </div>
    </div>
  )
}

function InstagramContent({ data }) {
  return (
    <div className="space-y-4">
      <div className="bg-surface-elevated rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans">{data.content}</pre>
      </div>
      {data.hashtags?.length > 0 && (
        <div>
          <p className="text-xs text-text-muted mb-2">Hashtags ({data.hashtags.length})</p>
          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs text-primary break-all">{data.hashtags.join(' ')}</p>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <CopyButton text={data.content + '\n\n.\n.\n.\n\n' + (data.hashtags?.join(' ') || '')} />
      </div>
    </div>
  )
}

function TwitterContent({ data }) {
  return (
    <div className="space-y-3">
      {data.tweets?.map((tweet, i) => (
        <div key={i} className="bg-surface-elevated rounded-lg p-4 border-l-2 border-primary/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-medium">Tweet {i + 1}/{data.tweets.length}</span>
            <CopyButton text={tweet} />
          </div>
          <p className="text-sm text-text-primary">{tweet}</p>
        </div>
      ))}
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

function BlogContent({ data }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-text-muted mb-1">Titre</p>
        <p className="text-lg font-bold text-text-primary">{data.title}</p>
      </div>
      {data.metaDescription && (
        <div>
          <p className="text-xs text-text-muted mb-1">Meta description</p>
          <p className="text-sm text-text-secondary italic">{data.metaDescription}</p>
        </div>
      )}
      <div className="bg-surface-elevated rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">{data.content}</pre>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{data.wordCount || 0} mots</span>
        <CopyButton text={data.content} />
      </div>
    </div>
  )
}

function VideoScriptContent({ data }) {
  return (
    <div className="space-y-4">
      {data.hook && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-xs text-primary font-medium mb-1">Hook (3 premieres secondes)</p>
          <p className="text-sm text-text-primary font-semibold">{data.hook}</p>
        </div>
      )}
      <div className="bg-surface-elevated rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans">{data.script}</pre>
      </div>
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
        <CopyButton text={data.script} />
      </div>
    </div>
  )
}

function NewsletterContent({ data }) {
  return (
    <div className="space-y-4">
      {data.subject && (
        <div>
          <p className="text-xs text-text-muted mb-1">Objet</p>
          <p className="text-sm font-semibold text-text-primary">{data.subject}</p>
        </div>
      )}
      {data.preheader && (
        <div>
          <p className="text-xs text-text-muted mb-1">Preheader</p>
          <p className="text-sm text-text-secondary italic">{data.preheader}</p>
        </div>
      )}
      <div className="bg-surface-elevated rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">{data.content}</pre>
      </div>
      {data.cta && (
        <div className="bg-primary/10 rounded-lg p-3 text-center">
          <p className="text-xs text-text-muted mb-1">Call-to-Action</p>
          <p className="text-sm font-semibold text-primary">{data.cta}</p>
        </div>
      )}
      <div className="flex justify-end">
        <CopyButton text={data.content} />
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

export default function ContentResults({ data }) {
  const availablePlatforms = Object.keys(data?.platforms || {})
  const [activeTab, setActiveTab] = useState(availablePlatforms[0] || '')

  if (!data?.platforms || availablePlatforms.length === 0) {
    return (
      <div className="text-center text-text-muted py-8">
        Aucun contenu genere
      </div>
    )
  }

  const Renderer = RENDERERS[activeTab]
  const platformData = data.platforms[activeTab]

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 mb-6 overflow-x-auto">
        {availablePlatforms.map(p => {
          const meta = PLATFORM_META[p] || { name: p, emoji: '📄' }
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
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{PLATFORM_META[activeTab]?.emoji}</span>
          <h3 className="text-lg font-semibold text-text-primary">{PLATFORM_META[activeTab]?.name}</h3>
        </div>
        {Renderer && platformData ? (
          <Renderer data={platformData} />
        ) : (
          <p className="text-text-muted text-sm">Contenu non disponible pour cette plateforme</p>
        )}
      </div>
    </div>
  )
}
