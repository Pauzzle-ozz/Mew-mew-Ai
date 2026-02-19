'use client'

import { useState } from 'react'

const CHANNEL_META = {
  linkedin: { name: 'LinkedIn', emoji: '💼', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  instagram: { name: 'Instagram', emoji: '📸', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  twitter: { name: 'Twitter/X', emoji: '🐦', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  blog: { name: 'Blog', emoji: '📝', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  newsletter: { name: 'Newsletter', emoji: '📧', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  video: { name: 'Video', emoji: '🎬', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
}

const TYPE_LABELS = {
  educatif: 'Educatif',
  inspirant: 'Inspirant',
  promotionnel: 'Promo',
  'behind-the-scenes': 'Coulisses',
  engagement: 'Engagement',
  storytelling: 'Story',
  actualite: 'Actu'
}

function DayCard({ day, isExpanded, onToggle }) {
  const hasPosts = day.posts && day.posts.length > 0

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        hasPosts
          ? 'border-border bg-surface hover:border-primary/40 cursor-pointer'
          : 'border-border/50 bg-surface/50'
      }`}
      onClick={hasPosts ? onToggle : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${hasPosts ? 'text-text-primary' : 'text-text-muted'}`}>
            J{day.day}
          </span>
          {hasPosts && (
            <div className="flex gap-0.5">
              {day.posts.map((post, i) => {
                const meta = CHANNEL_META[post.channel]
                return meta ? (
                  <span key={i} className="text-xs" title={meta.name}>{meta.emoji}</span>
                ) : null
              })}
            </div>
          )}
        </div>
        {hasPosts && (
          <span className="text-xs text-text-muted">{day.posts.length}</span>
        )}
      </div>

      {/* Theme */}
      {day.theme && (
        <div className="px-3 pb-2">
          <p className="text-xs text-text-secondary line-clamp-2">{day.theme}</p>
        </div>
      )}

      {/* Expanded */}
      {isExpanded && hasPosts && (
        <div className="border-t border-border p-3 space-y-2">
          {day.posts.map((post, i) => {
            const meta = CHANNEL_META[post.channel] || { name: post.channel, emoji: '📄', color: 'bg-surface-elevated text-text-secondary border-border' }
            return (
              <div key={i} className={`rounded-lg p-3 border ${meta.color}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{meta.emoji}</span>
                    <span className="text-xs font-semibold">{meta.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.type && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted">
                        {TYPE_LABELS[post.type] || post.type}
                      </span>
                    )}
                    {post.bestTime && (
                      <span className="text-[10px] text-text-muted">{post.bestTime}</span>
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed">{post.description}</p>
                {post.hashtags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {post.hashtags.map((h, j) => (
                      <span key={j} className="text-[10px] opacity-70">{h}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CalendarView({ data }) {
  const [expandedDay, setExpandedDay] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  if (!data?.calendar || data.calendar.length === 0) {
    return (
      <div className="text-center text-text-muted py-8">
        Aucun calendrier genere
      </div>
    )
  }

  const toggleDay = (dayNum) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum)
  }

  return (
    <div>
      {/* Strategy summary */}
      {data.strategy && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-primary mb-2">Resume de la strategie</h3>
          <p className="text-sm text-text-secondary mb-3">{data.strategy.summary}</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">Posts planifies :</span>
              <span className="text-xs font-bold text-primary">{data.strategy.totalPosts}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">Canaux :</span>
              <span className="text-xs font-bold text-primary">{data.strategy.channelsUsed?.join(', ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* View toggle + stats */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Calendrier 30 jours</h3>
        <div className="flex gap-1 bg-surface-elevated rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Grille
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Liste
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {data.calendar.map(day => (
            <DayCard
              key={day.day}
              day={day}
              isExpanded={expandedDay === day.day}
              onToggle={() => toggleDay(day.day)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data.calendar.filter(d => d.posts?.length > 0).map(day => (
            <DayCard
              key={day.day}
              day={day}
              isExpanded={true}
              onToggle={() => {}}
            />
          ))}
        </div>
      )}

      {/* Tips */}
      {data.tips?.length > 0 && (
        <div className="mt-6 bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Conseils pour reussir</h3>
          <div className="space-y-2">
            {data.tips.map((tip, i) => (
              <div key={i} className="flex items-start text-sm text-text-secondary">
                <span className="text-primary mr-2 mt-0.5">&#10003;</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
