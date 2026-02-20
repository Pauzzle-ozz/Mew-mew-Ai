export const CREATOR_PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼', desc: 'Post professionnel' },
  { id: 'instagram', name: 'Instagram', emoji: '📸', desc: 'Caption + Reels + hashtags' },
  { id: 'twitter', name: 'Twitter/X', emoji: '🐦', desc: 'Thread percutant' },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵', desc: 'Script viral + caption' },
  { id: 'youtube', name: 'YouTube', emoji: '▶️', desc: 'Script + description SEO' },
  { id: 'facebook', name: 'Facebook', emoji: '👥', desc: 'Post + stories' },
  { id: 'blog', name: 'Blog SEO', emoji: '📝', desc: 'Article optimise' },
  { id: 'newsletter', name: 'Newsletter', emoji: '📧', desc: 'Email marketing' },
  { id: 'video_script', name: 'Script Video', emoji: '🎬', desc: 'Reels generique' }
]

export default function ContentCreatorPlatformSelector({ selected = [], onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(p => p !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const selectAll = () => {
    if (selected.length === CREATOR_PLATFORMS.length) {
      onChange([])
    } else {
      onChange(CREATOR_PLATFORMS.map(p => p.id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-text-secondary">
          Plateformes cibles
        </label>
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-primary hover:text-primary/80 cursor-pointer transition-colors"
        >
          {selected.length === CREATOR_PLATFORMS.length ? 'Tout deselectionner' : 'Tout selectionner'}
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {CREATOR_PLATFORMS.map(p => {
          const isSelected = selected.includes(p.id)
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface hover:border-primary/40'
              }`}
            >
              <div className="text-2xl mb-1">{p.emoji}</div>
              <div className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                {p.name}
              </div>
              <div className="text-xs text-text-muted">{p.desc}</div>
            </button>
          )
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-text-muted mt-2">Selectionnez au moins une plateforme</p>
      )}
      {selected.length > 0 && (
        <p className="text-xs text-text-muted mt-2">{selected.length} plateforme{selected.length > 1 ? 's' : ''} selectionnee{selected.length > 1 ? 's' : ''}</p>
      )}
    </div>
  )
}
