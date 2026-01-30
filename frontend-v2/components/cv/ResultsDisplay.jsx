/**
 * Composant ResultsDisplay
 * Affiche les résultats de l'analyse CV avec les métiers proposés
 */

export default function ResultsDisplay({ result }) {
  if (!result) return null;

  // Grouper les métiers par catégorie
  const groupedMetiers = {
    'Ce que je veux': [],
    'Correspond à mes compétences': [],
    'Je pourrais tenter': []
  };

  result.metiers_proposes?.forEach(metier => {
    const categorie = metier.categorie || 'Correspond à mes compétences';
    if (groupedMetiers[categorie]) {
      groupedMetiers[categorie].push(metier);
    }
  });

  // Couleurs par catégorie
  const categoryColors = {
    'Ce que je veux': {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-700'
    },
    'Correspond à mes compétences': {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      badge: 'bg-green-100 text-green-700'
    },
    'Je pourrais tenter': {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      badge: 'bg-purple-100 text-purple-700'
    }
  };

  // Icônes par catégorie
  const categoryIcons = {
    'Ce que je veux': '🎯',
    'Correspond à mes compétences': '✅',
    'Je pourrais tenter': '🚀'
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête résultats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">✨ Analyse terminée !</h2>
        <p className="text-blue-100">
          Voici {result.metiers_proposes?.length || 0} métiers recommandés pour toi
        </p>
      </div>

      {/* Métiers par catégorie */}
      {Object.entries(groupedMetiers).map(([categorie, metiers]) => {
        if (metiers.length === 0) return null;

        const colors = categoryColors[categorie];
        const icon = categoryIcons[categorie];

        return (
          <div key={categorie} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-3">{icon}</span>
              {categorie}
              <span className="ml-3 text-sm font-normal text-gray-500">
                ({metiers.length} métier{metiers.length > 1 ? 's' : ''})
              </span>
            </h3>

            <div className="space-y-4">
              {metiers.map((metier, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`text-lg font-bold ${colors.text} mb-1`}>
                        {metier.intitule}
                      </h4>
                      {metier.priorite && (
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.badge}`}>
                          Priorité #{metier.priorite}
                        </span>
                      )}
                    </div>
                    
                    {metier.note_marche !== undefined && (
                      <div className="ml-4 text-right">
                        <div className={`text-3xl font-bold ${colors.text}`}>
                          {metier.note_marche}
                        </div>
                        <div className="text-xs text-gray-600">/ 100</div>
                      </div>
                    )}
                  </div>

                  {metier.justification_note && (
                    <p className="text-sm text-gray-700 mb-3">
                      💡 {metier.justification_note}
                    </p>
                  )}

                  {metier.mots_cles && metier.mots_cles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {metier.mots_cles.map((mot, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700"
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
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          🔄 Faire une nouvelle analyse
        </button>
      </div>
    </div>
  );
}