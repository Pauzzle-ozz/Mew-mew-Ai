'use client'

export default function CompetitorForm({ competitors, onChange }) {
  const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

  const addCompetitor = () => {
    if (competitors.length >= 5) return
    onChange([...competitors, { name: '', url: '' }])
  }

  const removeCompetitor = (index) => {
    onChange(competitors.filter((_, i) => i !== index))
  }

  const updateCompetitor = (index, field, value) => {
    const updated = [...competitors]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-secondary">
          Concurrents a analyser ({competitors.length}/5)
        </label>
        {competitors.length < 5 && (
          <button
            type="button"
            onClick={addCompetitor}
            className="text-xs text-primary font-medium hover:text-primary-hover transition-colors cursor-pointer"
          >
            + Ajouter un concurrent
          </button>
        )}
      </div>

      <div className="space-y-3">
        {competitors.map((comp, i) => (
          <div key={i} className="bg-surface-elevated rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-muted">Concurrent {i + 1}</span>
              {competitors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCompetitor(i)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Supprimer
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Nom de la marque *</label>
                <input
                  value={comp.name}
                  onChange={(e) => updateCompetitor(i, 'name', e.target.value)}
                  placeholder="Ex: Nike, Zara, Apple..."
                  className={inputStyles}
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">URL du site (optionnel, pour scraping)</label>
                <input
                  value={comp.url}
                  onChange={(e) => updateCompetitor(i, 'url', e.target.value)}
                  placeholder="https://www.example.com"
                  className={inputStyles}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {competitors.length === 0 && (
        <button
          type="button"
          onClick={addCompetitor}
          className="w-full py-4 border-2 border-dashed border-border rounded-xl text-text-muted hover:border-primary/40 hover:text-text-secondary transition-colors cursor-pointer"
        >
          + Ajouter votre premier concurrent
        </button>
      )}

      <p className="text-xs text-text-muted">
        L&apos;URL permet une analyse plus precise via scraping. Sans URL, l&apos;analyse se base sur les connaissances de l&apos;IA.
      </p>
    </div>
  )
}
