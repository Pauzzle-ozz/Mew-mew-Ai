export default function ChannelSelector({ selected = [], onChange }) {
  const channels = [
    { id: 'linkedin', name: 'LinkedIn', emoji: '💼', freq: '3-4x/sem' },
    { id: 'instagram', name: 'Instagram', emoji: '📸', freq: '4-5x/sem' },
    { id: 'twitter', name: 'Twitter/X', emoji: '🐦', freq: '1-2x/jour' },
    { id: 'blog', name: 'Blog', emoji: '📝', freq: '1-2x/sem' },
    { id: 'newsletter', name: 'Newsletter', emoji: '📧', freq: '1x/sem' },
    { id: 'video', name: 'Video', emoji: '🎬', freq: '2-3x/sem' }
  ]

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(c => c !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-3">
        Canaux de diffusion
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {channels.map(c => {
          const isSelected = selected.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface hover:border-primary/40'
              }`}
            >
              <div className="text-2xl mb-1">{c.emoji}</div>
              <div className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                {c.name}
              </div>
              <div className="text-xs text-text-muted">{c.freq}</div>
            </button>
          )
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-text-muted mt-2">Selectionnez au moins un canal</p>
      )}
    </div>
  )
}
