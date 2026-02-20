export const CONTENT_TYPES = [
  { id: 'publicitaire', name: 'Publicitaire', emoji: '📢', desc: 'Vente directe, promotion produit' },
  { id: 'entrepreneurial', name: 'Entrepreneurial', emoji: '🚀', desc: 'Marque, parcours, behind the scenes' },
  { id: 'educatif', name: 'Educatif', emoji: '🎓', desc: 'Tutoriels, conseils, how-to' },
  { id: 'viral', name: 'Viral / Choc', emoji: '💥', desc: 'Polarisant, partages maximises' },
  { id: 'storytelling', name: 'Storytelling', emoji: '📖', desc: 'Recit narratif, emotions' },
  { id: 'inspirant', name: 'Inspirant', emoji: '✨', desc: 'Motivation, reussite, transformation' },
  { id: 'engagement', name: 'Engagement', emoji: '💬', desc: 'Questions, debats, sondages' },
  { id: 'actualite', name: 'Actualite', emoji: '📰', desc: 'Tendances, newsjacking' }
]

export default function ContentTypeSelector({ selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-3">
        Type de contenu
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CONTENT_TYPES.map(t => {
          const isSelected = selected === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface hover:border-primary/40'
              }`}
            >
              <div className="text-2xl mb-1">{t.emoji}</div>
              <div className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                {t.name}
              </div>
              <div className="text-xs text-text-muted">{t.desc}</div>
            </button>
          )
        })}
      </div>
      {!selected && (
        <p className="text-xs text-text-muted mt-2">Selectionnez un type de contenu</p>
      )}
    </div>
  )
}
