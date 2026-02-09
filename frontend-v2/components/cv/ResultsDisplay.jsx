export default function ResultsDisplay({ result }) {
  if (!result) return null;

  const groupedMetiers = {
    'Ce que je veux': [],
    'Correspond a mes competences': [],
    'Je pourrais tenter': []
  };

  result.metiers_proposes?.forEach(metier => {
    const categorie = metier.categorie || 'Correspond a mes competences';
    if (groupedMetiers[categorie]) {
      groupedMetiers[categorie].push(metier);
    }
  });

  const categoryColors = {
    'Ce que je veux': {
      bg: 'bg-info/10',
      border: 'border-info/20',
      text: 'text-info',
      badge: 'bg-info/20 text-info'
    },
    'Correspond a mes competences': {
      bg: 'bg-success/10',
      border: 'border-success/20',
      text: 'text-success',
      badge: 'bg-success/20 text-success'
    },
    'Je pourrais tenter': {
      bg: 'bg-secondary/10',
      border: 'border-secondary/20',
      text: 'text-secondary',
      badge: 'bg-secondary/20 text-secondary'
    }
  };

  const categoryIcons = {
    'Ce que je veux': '🎯',
    'Correspond a mes competences': '&#10003;',
    'Je pourrais tenter': '🚀'
  };

  return (
    <div className="space-y-6">

      {/* Header resultats */}
      <div className="bg-gradient-to-r from-primary to-amber-400 text-gray-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Analyse terminee !</h2>
        <p className="text-gray-900/70">
          Voici {result.metiers_proposes?.length || 0} metiers recommandes pour toi
        </p>
      </div>

      {/* Metiers par categorie */}
      {Object.entries(groupedMetiers).map(([categorie, metiers]) => {
        if (metiers.length === 0) return null;

        const colors = categoryColors[categorie];
        const icon = categoryIcons[categorie];

        return (
          <div key={categorie} className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
              <span className="text-3xl mr-3">{icon}</span>
              {categorie}
              <span className="ml-3 text-sm font-normal text-text-muted">
                ({metiers.length} metier{metiers.length > 1 ? 's' : ''})
              </span>
            </h3>

            <div className="space-y-4">
              {metiers.map((metier, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`text-lg font-bold ${colors.text} mb-1`}>
                        {metier.intitule}
                      </h4>
                      {metier.priorite && (
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.badge}`}>
                          Priorite #{metier.priorite}
                        </span>
                      )}
                    </div>

                    {metier.note_marche !== undefined && (
                      <div className="ml-4 text-right">
                        <div className={`text-3xl font-bold ${colors.text}`}>
                          {metier.note_marche}
                        </div>
                        <div className="text-xs text-text-muted">/ 100</div>
                      </div>
                    )}
                  </div>

                  {metier.justification_note && (
                    <p className="text-sm text-text-secondary mb-3">
                      {metier.justification_note}
                    </p>
                  )}

                  {metier.mots_cles && metier.mots_cles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {metier.mots_cles.map((mot, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-surface-elevated border border-border rounded text-xs text-text-muted"
                        >
                          {mot}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bouton nouvelle analyse */}
      <div className="text-center pt-6">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-gray-900 rounded-lg hover:bg-primary-hover font-medium transition-colors cursor-pointer"
        >
          Faire une nouvelle analyse
        </button>
      </div>
    </div>
  );
}
