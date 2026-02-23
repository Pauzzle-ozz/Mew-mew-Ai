'use client'

import { useState } from 'react'

const CHANNEL_META = {
  linkedin: { name: 'LinkedIn', emoji: '\uD83D\uDCBC', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  instagram: { name: 'Instagram', emoji: '\uD83D\uDCF8', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  tiktok: { name: 'TikTok', emoji: '\uD83C\uDFB5', color: 'bg-gray-500/10 text-gray-300 border-gray-500/20' },
  youtube: { name: 'YouTube', emoji: '\u25B6\uFE0F', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  facebook: { name: 'Facebook', emoji: '\uD83D\uDC4D', color: 'bg-blue-600/10 text-blue-300 border-blue-600/20' },
  twitter: { name: 'Twitter/X', emoji: '\uD83D\uDC26', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  pinterest: { name: 'Pinterest', emoji: '\uD83D\uDCCC', color: 'bg-red-400/10 text-red-300 border-red-400/20' },
  threads: { name: 'Threads', emoji: '\uD83E\uDDF5', color: 'bg-neutral-500/10 text-neutral-300 border-neutral-500/20' },
  snapchat: { name: 'Snapchat', emoji: '\uD83D\uDC7B', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  blog: { name: 'Blog', emoji: '\uD83D\uDCDD', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  newsletter: { name: 'Newsletter', emoji: '\uD83D\uDCE7', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  podcast: { name: 'Podcast', emoji: '\uD83C\uDF99\uFE0F', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  whatsapp: { name: 'WhatsApp', emoji: '\uD83D\uDCAC', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  video: { name: 'Video', emoji: '\uD83C\uDFA5', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
}

const TYPE_LABELS = {
  educatif: 'Educatif',
  inspirant: 'Inspirant',
  promotionnel: 'Promo',
  'behind-the-scenes': 'Coulisses',
  engagement: 'Engagement',
  storytelling: 'Story',
  actualite: 'Actu',
  divertissement: 'Fun',
  teaser: 'Teaser',
  tutoriel: 'Tuto'
}

const JOURS_SEMAINE = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const MOIS = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec']

function getRealDate(startDate, dayOffset) {
  const d = new Date(startDate)
  d.setDate(d.getDate() + dayOffset)
  return d
}

function formatDate(date) {
  return `${JOURS_SEMAINE[date.getDay()]} ${date.getDate()} ${MOIS[date.getMonth()]}`
}

function formatDateShort(date) {
  return `${date.getDate()} ${MOIS[date.getMonth()]}`
}

// ─── Grille Editoriale ────────────────────────

function EditorialDayCard({ day, date, isExpanded, onToggle }) {
  const hasPosts = day.posts && day.posts.length > 0
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        hasPosts
          ? 'border-border bg-surface hover:border-primary/40 cursor-pointer'
          : isWeekend
            ? 'border-border/30 bg-surface/30'
            : 'border-border/50 bg-surface/50'
      }`}
      onClick={hasPosts ? onToggle : undefined}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="text-left">
            <span className={`text-[10px] block ${isWeekend ? 'text-text-muted/50' : 'text-text-muted'}`}>
              {formatDate(date)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasPosts && day.posts.map((post, i) => {
            const meta = CHANNEL_META[post.channel]
            return meta ? (
              <span key={i} className="text-xs" title={meta.name}>{meta.emoji}</span>
            ) : null
          })}
          {hasPosts && (
            <span className="text-[10px] text-text-muted ml-1">{day.posts.length}</span>
          )}
        </div>
      </div>

      {day.theme && (
        <div className="px-3 pb-2">
          <p className="text-xs text-text-secondary line-clamp-2">{day.theme}</p>
        </div>
      )}

      {isExpanded && hasPosts && (
        <div className="border-t border-border p-3 space-y-2">
          {day.posts.map((post, i) => {
            const meta = CHANNEL_META[post.channel] || { name: post.channel, emoji: '\uD83D\uDCC4', color: 'bg-surface-elevated text-text-secondary border-border' }
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
                {post.estimatedCost && (
                  <div className="mt-1.5 text-[10px] text-amber-400">{post.estimatedCost}</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Grille Production ────────────────────────

function ProductionSessionCard({ session, startDate }) {
  const [expanded, setExpanded] = useState(false)
  const sessionDate = session.date ? new Date(session.date) : getRealDate(startDate, (session.day || 1) - 1)

  const typeColors = {
    'tournage_video': 'border-purple-500/30 bg-purple-500/5',
    'shoot_photo': 'border-pink-500/30 bg-pink-500/5',
    'redaction': 'border-green-500/30 bg-green-500/5',
    'enregistrement_audio': 'border-violet-500/30 bg-violet-500/5',
    'design': 'border-blue-500/30 bg-blue-500/5',
    'montage': 'border-amber-500/30 bg-amber-500/5'
  }

  const typeLabels = {
    'tournage_video': '\uD83C\uDFA5 Tournage video',
    'shoot_photo': '\uD83D\uDCF7 Shoot photo',
    'redaction': '\u270D\uFE0F Redaction',
    'enregistrement_audio': '\uD83C\uDF99\uFE0F Enregistrement audio',
    'design': '\uD83C\uDFA8 Design / creation graphique',
    'montage': '\u2702\uFE0F Montage / post-production'
  }

  const borderColor = typeColors[session.type] || 'border-border bg-surface'

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer ${borderColor}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-primary">
            {formatDate(sessionDate)}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted">
            {session.duration || '?'}
          </span>
        </div>
        <span className="text-xs text-text-muted">
          {expanded ? '\u25B2' : '\u25BC'} {session.items?.length || 0} contenu{(session.items?.length || 0) > 1 ? 's' : ''}
        </span>
      </div>

      <div className="text-sm font-medium text-text-primary mb-1">
        {typeLabels[session.type] || session.type || 'Session'}
      </div>
      {session.title && (
        <p className="text-xs text-text-secondary mb-2">{session.title}</p>
      )}

      {/* Ressources */}
      {session.resources?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {session.resources.map((r, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary border border-border">
              {r}
            </span>
          ))}
        </div>
      )}

      {/* Cout estime */}
      {session.estimatedCost && (
        <div className="text-xs text-amber-400 mb-2">{session.estimatedCost}</div>
      )}

      {/* Contenus a produire */}
      {expanded && session.items?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">Contenus a produire :</p>
          {session.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-primary mt-0.5">&#8250;</span>
              <div>
                <span className="font-medium text-text-primary">{item.title || item}</span>
                {item.forDay && (
                  <span className="text-text-muted ml-1">(publi: {item.forDay})</span>
                )}
                {item.channel && (
                  <span className="ml-1">{CHANNEL_META[item.channel]?.emoji || ''}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {expanded && session.notes && (
        <div className="mt-2 p-2 rounded-lg bg-surface-elevated">
          <p className="text-[10px] text-text-muted italic">{session.notes}</p>
        </div>
      )}
    </div>
  )
}

// ─── Composant Principal ────────────────────────

export default function CalendarView({ data, startDate, budget }) {
  const [expandedDay, setExpandedDay] = useState(null)
  const [activeTab, setActiveTab] = useState('editorial') // 'editorial' | 'production'

  if (!data?.calendar || data.calendar.length === 0) {
    return (
      <div className="text-center text-text-muted py-8">
        Aucun calendrier genere
      </div>
    )
  }

  const baseDate = startDate || new Date().toISOString().split('T')[0]

  const toggleDay = (dayNum) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum)
  }

  const totalPosts = data.strategy?.totalPosts || data.calendar.reduce((acc, d) => acc + (d.posts?.length || 0), 0)
  const productionSessions = data.productionSessions || data.strategy?.productionSessions || []

  // Stats par semaine
  const weeks = []
  for (let i = 0; i < data.calendar.length; i += 7) {
    const weekDays = data.calendar.slice(i, i + 7)
    const weekStart = getRealDate(baseDate, i)
    const weekEnd = getRealDate(baseDate, Math.min(i + 6, data.calendar.length - 1))
    weeks.push({
      label: `${formatDateShort(weekStart)} - ${formatDateShort(weekEnd)}`,
      days: weekDays,
      startIndex: i,
      posts: weekDays.reduce((acc, d) => acc + (d.posts?.length || 0), 0)
    })
  }

  return (
    <div>
      {/* Strategy summary */}
      {data.strategy && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-primary mb-2">Resume de la strategie</h3>
          <p className="text-sm text-text-secondary mb-3">{data.strategy.summary}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">Posts planifies :</span>
              <span className="text-xs font-bold text-primary">{totalPosts}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">Canaux :</span>
              <span className="text-xs font-bold text-primary">{data.strategy.channelsUsed?.join(', ')}</span>
            </div>
            {productionSessions.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text-muted">Sessions de production :</span>
                <span className="text-xs font-bold text-primary">{productionSessions.length}</span>
              </div>
            )}
            {data.strategy.totalEstimatedCost && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text-muted">Cout estime total :</span>
                <span className="text-xs font-bold text-amber-400">{data.strategy.totalEstimatedCost}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="flex items-center gap-1 bg-surface-elevated rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('editorial')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'editorial' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Calendrier Editorial
        </button>
        <button
          onClick={() => setActiveTab('production')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'production' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Planning Production
          {productionSessions.length > 0 && (
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-white/20">
              {productionSessions.length}
            </span>
          )}
        </button>
      </div>

      {/* ─── Onglet Editorial ─── */}
      {activeTab === 'editorial' && (
        <div>
          {weeks.map((week, wi) => (
            <div key={wi} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Semaine {wi + 1} — {week.label}
                </h4>
                <span className="text-[10px] text-text-muted">{week.posts} publication{week.posts > 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {week.days.map((day, di) => {
                  const dayIndex = week.startIndex + di
                  const date = getRealDate(baseDate, dayIndex)
                  return (
                    <EditorialDayCard
                      key={day.day}
                      day={day}
                      date={date}
                      isExpanded={expandedDay === day.day}
                      onToggle={() => toggleDay(day.day)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Onglet Production ─── */}
      {activeTab === 'production' && (
        <div>
          {productionSessions.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs text-text-muted mb-2">
                Sessions de creation planifiees en amont des publications. Chaque session regroupe les contenus a produire ensemble pour optimiser votre temps.
              </p>
              {productionSessions.map((session, i) => (
                <ProductionSessionCard
                  key={i}
                  session={session}
                  startDate={baseDate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              <p className="text-lg mb-2">Aucune session de production planifiee</p>
              <p className="text-sm">Le planning de production sera genere avec le calendrier editorial.</p>
            </div>
          )}
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
