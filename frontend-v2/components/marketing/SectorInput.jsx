const POPULAR_SECTORS = [
  'Mode', 'Tech / Startups', 'Finance', 'Sante', 'Immobilier',
  'Food / Restauration', 'Sport', 'Luxe', 'Education', 'Environnement',
  'Automobile', 'Tourisme', 'Media / Presse', 'E-commerce', 'Beaute / Cosmetique'
]

const COUNTRIES = [
  'France', 'Belgique', 'Suisse', 'Canada', 'Etats-Unis', 'Royaume-Uni', 'Allemagne', 'Espagne', 'Italie'
]

export default function SectorInput({ sector, country, keywords, onChange }) {
  const inputStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Secteur *</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {POPULAR_SECTORS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ sector: s, country, keywords })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                sector === s
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={sector}
          onChange={(e) => onChange({ sector: e.target.value, country, keywords })}
          placeholder="Ou saisissez votre secteur..."
          className={inputStyles}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Pays *</label>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ sector, country: c, keywords })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                country === c
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Mots-cles (optionnel)</label>
        <input
          value={keywords}
          onChange={(e) => onChange({ sector, country, keywords: e.target.value })}
          placeholder="Ex: streetwear, haute couture, durable..."
          className={inputStyles}
        />
      </div>
    </div>
  )
}
