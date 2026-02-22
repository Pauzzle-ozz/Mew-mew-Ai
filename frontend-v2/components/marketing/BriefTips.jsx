'use client'

import { PLATFORM_TIPS } from '@/lib/constants/redacteur'

const PLATFORM_META = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  twitter: 'Twitter/X',
  blog: 'Blog SEO',
  video_script: 'Script Video',
  newsletter: 'Newsletter'
}

export default function BriefTip({ field, platforms }) {
  if (!platforms || platforms.length === 0) return null

  const tips = platforms
    .map(p => {
      const platformTips = PLATFORM_TIPS[p]
      if (!platformTips || !platformTips[field]) return null
      return { platform: PLATFORM_META[p] || p, tip: platformTips[field] }
    })
    .filter(Boolean)

  if (tips.length === 0) return null

  return (
    <div className="mt-1.5 bg-blue-900/15 border border-blue-800/30 rounded-lg px-3 py-2">
      <div className="space-y-1">
        {tips.map((t, i) => (
          <p key={i} className="text-xs text-blue-300">
            <span className="font-medium">{t.platform}</span> : {t.tip}
          </p>
        ))}
      </div>
    </div>
  )
}
