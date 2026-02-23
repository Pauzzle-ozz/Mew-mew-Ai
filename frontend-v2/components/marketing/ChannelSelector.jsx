export default function ChannelSelector({ selected = [], onChange }) {
  const channels = [
    { id: 'linkedin', name: 'LinkedIn', emoji: '\uD83D\uDCBC', freq: '3-4x/sem', category: 'social' },
    { id: 'instagram', name: 'Instagram', emoji: '\uD83D\uDCF8', freq: '4-5x/sem', category: 'social' },
    { id: 'tiktok', name: 'TikTok', emoji: '\uD83C\uDFB5', freq: '5-7x/sem', category: 'social' },
    { id: 'youtube', name: 'YouTube', emoji: '\u25B6\uFE0F', freq: '1-2x/sem', category: 'video' },
    { id: 'facebook', name: 'Facebook', emoji: '\uD83D\uDC4D', freq: '3-4x/sem', category: 'social' },
    { id: 'twitter', name: 'Twitter/X', emoji: '\uD83D\uDC26', freq: '1-2x/jour', category: 'social' },
    { id: 'pinterest', name: 'Pinterest', emoji: '\uD83D\uDCCC', freq: '3-5x/sem', category: 'social' },
    { id: 'threads', name: 'Threads', emoji: '\uD83E\uDDF5', freq: '3-4x/sem', category: 'social' },
    { id: 'snapchat', name: 'Snapchat', emoji: '\uD83D\uDC7B', freq: '3-5x/sem', category: 'social' },
    { id: 'blog', name: 'Blog / SEO', emoji: '\uD83D\uDCDD', freq: '1-2x/sem', category: 'contenu' },
    { id: 'newsletter', name: 'Newsletter', emoji: '\uD83D\uDCE7', freq: '1x/sem', category: 'contenu' },
    { id: 'podcast', name: 'Podcast', emoji: '\uD83C\uDF99\uFE0F', freq: '1x/sem', category: 'contenu' },
    { id: 'whatsapp', name: 'WhatsApp Business', emoji: '\uD83D\uDCAC', freq: '2-3x/sem', category: 'messaging' }
  ]

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(c => c !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const selectAll = () => {
    if (selected.length === channels.length) {
      onChange([])
    } else {
      onChange(channels.map(c => c.id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-text-secondary">
          Canaux de diffusion *
        </label>
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          {selected.length === channels.length ? 'Tout deselectionner' : 'Tout selectionner'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {channels.map(c => {
          const isSelected = selected.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface hover:border-primary/40'
              }`}
            >
              <div className="text-xl mb-1">{c.emoji}</div>
              <div className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                {c.name}
              </div>
              <div className="text-[10px] text-text-muted">{c.freq}</div>
            </button>
          )
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-text-muted mt-2">Selectionnez au moins un canal</p>
      )}
      {selected.length > 0 && (
        <p className="text-xs text-text-muted mt-2">{selected.length} canal{selected.length > 1 ? 'aux' : ''} selectionne{selected.length > 1 ? 's' : ''}</p>
      )}
    </div>
  )
}
