export default function PlatformSelector({ selected = [], onChange }) {
  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', emoji: '💼', desc: 'Post professionnel' },
    { id: 'instagram', name: 'Instagram', emoji: '📸', desc: 'Caption + hashtags' },
    { id: 'twitter', name: 'Twitter/X', emoji: '🐦', desc: 'Thread percutant' },
    { id: 'blog', name: 'Blog SEO', emoji: '📝', desc: 'Article optimise' },
    { id: 'video_script', name: 'Script Video', emoji: '🎬', desc: 'Reels / TikTok' },
    { id: 'newsletter', name: 'Newsletter', emoji: '📧', desc: 'Email marketing' }
  ]

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(p => p !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-3">
        Plateformes cibles
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {platforms.map(p => {
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
    </div>
  )
}
