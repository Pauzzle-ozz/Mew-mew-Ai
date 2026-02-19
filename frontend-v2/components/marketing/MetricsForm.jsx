'use client'

const PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'twitter', label: 'Twitter/X', emoji: '🐦' },
  { id: 'facebook', label: 'Facebook', emoji: '👥' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { id: 'youtube', label: 'YouTube', emoji: '▶️' },
  { id: 'blog', label: 'Blog/SEO', emoji: '📝' },
  { id: 'newsletter', label: 'Newsletter', emoji: '📧' }
]

const PLATFORM_CONTENT_TYPES = {
  linkedin: ['Post organique', 'Publicite payante', 'Carrousel', 'Article', 'Newsletter'],
  instagram: ['Post organique', 'Story', 'Reel', 'Carrousel', 'Publicite payante'],
  twitter: ['Tweet', 'Thread', 'Publicite payante'],
  facebook: ['Post organique', 'Publicite payante', 'Story', 'Video', 'Carrousel'],
  tiktok: ['Video organique', 'Publicite payante'],
  youtube: ['Video longue', 'Short', 'Publicite payante'],
  blog: ['Article de blog'],
  newsletter: ['Newsletter']
}

const PLATFORM_METRICS = {
  linkedin: [
    { key: 'impressions', label: 'Impressions', type: 'number', placeholder: '12 450' },
    { key: 'clicks', label: 'Clics', type: 'number', placeholder: '342' },
    { key: 'likes', label: 'Likes', type: 'number', placeholder: '89' },
    { key: 'comments', label: 'Commentaires', type: 'number', placeholder: '23' },
    { key: 'shares', label: 'Partages', type: 'number', placeholder: '15' },
    { key: 'followers', label: 'Abonnes gagnes', type: 'number', placeholder: '45' },
    { key: 'ctr', label: 'CTR (%)', type: 'text', placeholder: '2.74%' }
  ],
  instagram: [
    { key: 'impressions', label: 'Impressions', type: 'number', placeholder: '18 200' },
    { key: 'reach', label: 'Portee', type: 'number', placeholder: '9 500' },
    { key: 'likes', label: 'Likes', type: 'number', placeholder: '320' },
    { key: 'comments', label: 'Commentaires', type: 'number', placeholder: '45' },
    { key: 'saves', label: 'Sauvegardes', type: 'number', placeholder: '78' },
    { key: 'shares', label: 'Partages', type: 'number', placeholder: '32' },
    { key: 'followers', label: 'Abonnes gagnes', type: 'number', placeholder: '60' },
    { key: 'engagementRate', label: "Taux d'engagement (%)", type: 'text', placeholder: '4.2%' }
  ],
  twitter: [
    { key: 'impressions', label: 'Impressions', type: 'number', placeholder: '8 300' },
    { key: 'clicks', label: 'Clics', type: 'number', placeholder: '156' },
    { key: 'likes', label: 'Likes', type: 'number', placeholder: '67' },
    { key: 'retweets', label: 'Retweets', type: 'number', placeholder: '12' },
    { key: 'replies', label: 'Reponses', type: 'number', placeholder: '8' },
    { key: 'followers', label: 'Abonnes gagnes', type: 'number', placeholder: '25' },
    { key: 'ctr', label: 'CTR (%)', type: 'text', placeholder: '1.88%' }
  ],
  facebook: [
    { key: 'reach', label: 'Portee', type: 'number', placeholder: '15 000' },
    { key: 'impressions', label: 'Impressions', type: 'number', placeholder: '22 400' },
    { key: 'clicks', label: 'Clics', type: 'number', placeholder: '280' },
    { key: 'reactions', label: 'Reactions', type: 'number', placeholder: '145' },
    { key: 'comments', label: 'Commentaires', type: 'number', placeholder: '34' },
    { key: 'shares', label: 'Partages', type: 'number', placeholder: '18' },
    { key: 'ctr', label: 'CTR (%)', type: 'text', placeholder: '1.25%' },
    { key: 'cpc', label: 'CPC', type: 'text', placeholder: '0.45 EUR' }
  ],
  tiktok: [
    { key: 'views', label: 'Vues', type: 'number', placeholder: '45 000' },
    { key: 'likes', label: 'Likes', type: 'number', placeholder: '2 300' },
    { key: 'comments', label: 'Commentaires', type: 'number', placeholder: '89' },
    { key: 'shares', label: 'Partages', type: 'number', placeholder: '156' },
    { key: 'avgWatchTime', label: 'Duree moy. visionnage', type: 'text', placeholder: '12s' },
    { key: 'completionRate', label: 'Taux de completion (%)', type: 'text', placeholder: '35%' },
    { key: 'followers', label: 'Abonnes gagnes', type: 'number', placeholder: '120' }
  ],
  youtube: [
    { key: 'views', label: 'Vues', type: 'number', placeholder: '8 500' },
    { key: 'avgWatchTime', label: 'Duree moy. visionnage', type: 'text', placeholder: '4m 32s' },
    { key: 'likes', label: 'Likes', type: 'number', placeholder: '340' },
    { key: 'comments', label: 'Commentaires', type: 'number', placeholder: '56' },
    { key: 'followers', label: 'Abonnes gagnes', type: 'number', placeholder: '85' },
    { key: 'thumbnailCtr', label: 'CTR miniature (%)', type: 'text', placeholder: '5.2%' },
    { key: 'retentionRate', label: 'Taux de retention (%)', type: 'text', placeholder: '42%' }
  ],
  blog: [
    { key: 'uniqueVisitors', label: 'Visiteurs uniques', type: 'number', placeholder: '3 200' },
    { key: 'pageViews', label: 'Pages vues', type: 'number', placeholder: '5 800' },
    { key: 'avgTimeOnPage', label: 'Temps moyen sur page', type: 'text', placeholder: '2m 15s' },
    { key: 'bounceRate', label: 'Taux de rebond (%)', type: 'text', placeholder: '45%' },
    { key: 'rankedKeywords', label: 'Mots-cles positionnes', type: 'number', placeholder: '28' },
    { key: 'backlinks', label: 'Backlinks', type: 'number', placeholder: '12' }
  ],
  newsletter: [
    { key: 'sent', label: 'Envoyes', type: 'number', placeholder: '5 000' },
    { key: 'opened', label: 'Ouverts', type: 'number', placeholder: '1 250' },
    { key: 'clicked', label: 'Cliques', type: 'number', placeholder: '340' },
    { key: 'openRate', label: "Taux d'ouverture (%)", type: 'text', placeholder: '25%' },
    { key: 'clickRate', label: 'Taux de clic (%)', type: 'text', placeholder: '6.8%' },
    { key: 'unsubscribes', label: 'Desabonnements', type: 'number', placeholder: '8' }
  ]
}

const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

const PERIODS = [
  '7 derniers jours',
  '14 derniers jours',
  '30 derniers jours',
  '3 derniers mois',
  'Campagne specifique'
]

function PlatformEntry({ entry, index, total, onUpdate, onRemove }) {
  const platformInfo = PLATFORMS.find(p => p.id === entry.platform)
  const metrics = entry.platform ? (PLATFORM_METRICS[entry.platform] || []) : []
  const contentTypes = entry.platform ? (PLATFORM_CONTENT_TYPES[entry.platform] || []) : []

  const handleField = (field, value) => {
    onUpdate(index, { ...entry, [field]: value })
  }

  const handleMetric = (key, value) => {
    onUpdate(index, { ...entry, metrics: { ...entry.metrics, [key]: value } })
  }

  const handlePlatformChange = (platformId) => {
    onUpdate(index, { ...entry, platform: platformId, contentType: '', metrics: {}, rawStats: '' })
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-5 space-y-5 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          {platformInfo ? (
            <><span>{platformInfo.emoji}</span> {platformInfo.label}</>
          ) : (
            <>Plateforme {index + 1}</>
          )}
        </h3>
        {total > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-xs text-text-muted hover:text-red-400 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-red-900/20"
          >
            Supprimer
          </button>
        )}
      </div>

      {/* Platform selection */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Plateforme</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePlatformChange(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                entry.platform === p.id
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="mr-1">{p.emoji}</span>{p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content type (only if platform selected) */}
      {entry.platform && contentTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Type de contenu</label>
          {contentTypes.length === 1 ? (
            <p className="text-sm text-text-primary px-4 py-3 bg-surface-elevated rounded-lg">{contentTypes[0]}</p>
          ) : (
            <select
              value={entry.contentType || ''}
              onChange={(e) => handleField('contentType', e.target.value)}
              className={inputStyles}
            >
              <option value="">Selectionner...</option>
              {contentTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Mode toggle + metrics (only if platform selected) */}
      {entry.platform && (
        <>
          <div className="flex gap-1 bg-surface-elevated rounded-lg p-1 w-fit">
            <button
              type="button"
              onClick={() => handleField('mode', 'structured')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                entry.mode === 'structured' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Champs structures
            </button>
            <button
              type="button"
              onClick={() => handleField('mode', 'raw')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                entry.mode === 'raw' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Coller les stats
            </button>
          </div>

          {entry.mode === 'raw' ? (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Collez vos statistiques {platformInfo?.label || ''}
              </label>
              <textarea
                value={entry.rawStats || ''}
                onChange={(e) => handleField('rawStats', e.target.value)}
                rows={6}
                placeholder={`Collez ici vos stats depuis ${platformInfo?.label || 'la plateforme'}...\n\nL'IA analysera vos donnees quel que soit le format`}
                className={inputStyles + ' resize-none font-mono text-sm'}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {metrics.map(m => (
                <div key={m.key}>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{m.label}</label>
                  <input
                    type={m.type}
                    value={entry.metrics[m.key] || ''}
                    onChange={(e) => handleMetric(m.key, e.target.value)}
                    placeholder={m.placeholder}
                    className={inputStyles}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state when no platform */}
      {!entry.platform && (
        <p className="text-sm text-text-muted text-center py-4">
          Selectionnez une plateforme pour voir les metriques correspondantes
        </p>
      )}
    </div>
  )
}

export default function MetricsForm({ entries, onEntriesChange, sector, onSectorChange, period, onPeriodChange }) {
  const handleUpdateEntry = (index, updatedEntry) => {
    const updated = [...entries]
    updated[index] = updatedEntry
    onEntriesChange(updated)
  }

  const handleRemoveEntry = (index) => {
    if (entries.length <= 1) return
    const updated = entries.filter((_, i) => i !== index)
    onEntriesChange(updated)
  }

  const handleAddEntry = () => {
    onEntriesChange([...entries, {
      id: Date.now().toString(),
      platform: '',
      contentType: '',
      mode: 'structured',
      rawStats: '',
      metrics: {}
    }])
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Vos metriques</h2>

      {/* Shared fields: Period + Sector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Periode</label>
          <select
            value={period || ''}
            onChange={(e) => onPeriodChange(e.target.value)}
            className={inputStyles}
          >
            <option value="">Selectionner...</option>
            {PERIODS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Secteur</label>
          <input
            value={sector || ''}
            onChange={(e) => onSectorChange(e.target.value)}
            placeholder="Ex: SaaS B2B, Mode, E-commerce..."
            className={inputStyles}
          />
        </div>
      </div>

      {/* Platform entries */}
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <PlatformEntry
            key={entry.id}
            entry={entry}
            index={i}
            total={entries.length}
            onUpdate={handleUpdateEntry}
            onRemove={handleRemoveEntry}
          />
        ))}
      </div>

      {/* Add platform button */}
      <button
        type="button"
        onClick={handleAddEntry}
        className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-medium text-text-muted hover:text-primary hover:border-primary transition-colors cursor-pointer"
      >
        + Ajouter une plateforme
      </button>
    </div>
  )
}

export { PLATFORMS, PLATFORM_METRICS }
