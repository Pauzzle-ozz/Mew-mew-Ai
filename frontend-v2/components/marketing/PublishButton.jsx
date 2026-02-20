'use client'

import { useState } from 'react'

const PUBLISHABLE_PLATFORMS = ['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok']

const PLATFORM_NAMES = {
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok'
}

export function isPublishable(platform) {
  return PUBLISHABLE_PLATFORMS.includes(platform)
}

export default function PublishButton({ platform, isConnected, onPublish }) {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [postUrl, setPostUrl] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isPublishable(platform) || !isConnected) return null

  const handlePublish = async () => {
    setStatus('loading')
    setErrorMsg('')
    setPostUrl(null)

    try {
      const result = await onPublish(platform)
      setPostUrl(result?.postUrl || null)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Erreur publication')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-green-400 font-medium">Publie !</span>
        {postUrl && (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Voir le post ↗
          </a>
        )}
        <button
          onClick={() => { setStatus('idle'); setPostUrl(null) }}
          className="text-xs text-text-muted hover:text-text-secondary cursor-pointer"
        >
          Republier
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400 truncate max-w-[200px]" title={errorMsg}>{errorMsg}</span>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs text-text-muted hover:text-text-secondary cursor-pointer whitespace-nowrap"
        >
          Reessayer
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handlePublish}
      disabled={status === 'loading'}
      className="px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer bg-green-500/10 text-green-400 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {status === 'loading' ? 'Publication...' : `Publier sur ${PLATFORM_NAMES[platform] || platform}`}
    </button>
  )
}
