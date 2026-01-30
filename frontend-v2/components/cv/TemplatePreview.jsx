/**
 * Composant TemplatePreview
 * Affiche une prévisualisation visuelle du template sélectionné
 */

export default function TemplatePreview({ template, cvData }) {
  if (!template || !cvData) return null;

  // Couleurs par template
  const templateColors = {
    moderne: { primary: '#667eea', secondary: '#dbeafe', accent: '#2563eb' },
    classique: { primary: '#2c3e50', secondary: '#f3f4f6', accent: '#000000' },
    creatif: { primary: '#ec4899', secondary: '#fdf4ff', accent: '#be185d' },
    tech: { primary: '#10b981', secondary: '#f1f5f9', accent: '#0f172a' },
    executive: { primary: '#1c1c1c', secondary: '#f9fafb', accent: '#000000' },
    minimal: { primary: '#64748b', secondary: '#ffffff', accent: '#111111' }
  };

  const colors = templateColors[template] || templateColors.moderne;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        👁️ Aperçu du CV
        <span className="ml-3 text-sm font-normal text-gray-500">
          (représentation simplifiée)
        </span>
      </h3>

      {/* Mini CV Preview */}
      <div 
        className="border-2 rounded-lg p-6 bg-white"
        style={{ 
          borderColor: colors.primary,
          minHeight: '400px',
          fontFamily: template === 'tech' ? 'monospace' : template === 'classique' ? 'serif' : 'sans-serif'
        }}
      >
        {/* Header */}
        <div 
          className="pb-4 mb-4"
          style={{ 
            borderBottom: `2px solid ${colors.primary}`,
            textAlign: template === 'classique' ? 'center' : 'left'
          }}
        >
          <h1 
            className="font-bold mb-1"
            style={{ 
              color: colors.primary,
              fontSize: '20px',
              letterSpacing: template === 'executive' ? '2px' : 'normal',
              textTransform: template === 'executive' || template === 'moderne' ? 'uppercase' : 'none'
            }}
          >
            {cvData.prenom} {cvData.nom}
          </h1>
          <p className="text-gray-600 text-sm mb-2">{cvData.titre_poste}</p>
          <p className="text-gray-500 text-xs">
            {cvData.email} • {cvData.telephone} • {cvData.adresse}
          </p>
        </div>

        {/* Resume */}
        {cvData.resume && (
          <div className="mb-4">
            <h2 
              className="font-bold text-sm mb-2"
              style={{ 
                color: colors.accent,
                borderBottom: template === 'minimal' ? 'none' : `1px solid ${colors.secondary}`
              }}
            >
              {template === 'tech' ? '# PROFIL' : template === 'executive' ? 'EXECUTIVE SUMMARY' : 'PROFIL PROFESSIONNEL'}
            </h2>
            <p className="text-xs text-gray-700 line-clamp-3">{cvData.resume}</p>
          </div>
        )}

        {/* Experience */}
        {cvData.experiences && cvData.experiences.length > 0 && (
          <div className="mb-4">
            <h2 
              className="font-bold text-sm mb-2"
              style={{ 
                color: colors.accent,
                borderBottom: template === 'minimal' ? 'none' : `1px solid ${colors.secondary}`
              }}
            >
              {template === 'tech' ? '# EXPERIENCE' : template === 'executive' ? 'PROFESSIONAL EXPERIENCE' : 'EXPÉRIENCE PROFESSIONNELLE'}
            </h2>
            {cvData.experiences.slice(0, 2).map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-xs" style={{ color: colors.primary }}>
                    {template === 'tech' && '⚡ '}{exp.poste}
                  </h3>
                  <span className="text-xs text-gray-500">{exp.date_debut} - {exp.date_fin}</span>
                </div>
                <p className="text-xs text-gray-600">{exp.entreprise}</p>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">{exp.description}</p>
              </div>
            ))}
            {cvData.experiences.length > 2 && (
              <p className="text-xs text-gray-500 italic">+ {cvData.experiences.length - 2} autre(s) expérience(s)...</p>
            )}
          </div>
        )}

        {/* Skills Preview */}
        {cvData.competences_techniques && (
          <div>
            <h2 
              className="font-bold text-sm mb-2"
              style={{ 
                color: colors.accent,
                borderBottom: template === 'minimal' ? 'none' : `1px solid ${colors.secondary}`
              }}
            >
              {template === 'tech' ? '# SKILLS' : 'COMPÉTENCES'}
            </h2>
            <p className="text-xs text-gray-700 line-clamp-2">
              <span className="font-semibold" style={{ color: colors.primary }}>Techniques:</span> {cvData.competences_techniques}
            </p>
          </div>
        )}
      </div>

      {/* Info message */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          ℹ️ Ceci est un aperçu simplifié. Le PDF final aura une mise en page complète et optimisée.
        </p>
      </div>
    </div>
  );
}