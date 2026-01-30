/**
 * Composant CVTemplateSelector (Version améliorée avec miniatures)
 * Permet de sélectionner un template de CV avec aperçu visuel
 */

import { CV_TEMPLATES } from '@/lib/constants/templates';

export default function CVTemplateSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {CV_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`group rounded-xl border-2 transition-all text-left overflow-hidden ${
            selected === template.id
              ? 'border-blue-600 bg-blue-50 shadow-xl scale-105'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-102'
          }`}
        >
          {/* Preview visuel miniature */}
          <div 
            className="h-48 p-4 flex items-center justify-center relative"
            style={{ 
              background: `linear-gradient(135deg, ${template.couleur}15 0%, ${template.couleur}05 100%)`
            }}
          >
            {/* Mini CV mockup */}
            <div className="w-full max-w-[140px] bg-white rounded shadow-sm p-3 text-xs">
              <div 
                className="h-1 w-3/4 rounded mb-2"
                style={{ backgroundColor: template.couleur }}
              />
              <div className="h-1 w-1/2 bg-gray-300 rounded mb-3" />
              <div className="space-y-1 mb-2">
                <div className="h-0.5 w-full bg-gray-200 rounded" />
                <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
                <div className="h-0.5 w-4/6 bg-gray-200 rounded" />
              </div>
              <div className="h-1 w-2/3 bg-gray-300 rounded mb-2" />
              <div className="space-y-1">
                <div className="h-0.5 w-full bg-gray-200 rounded" />
                <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Badge icône */}
            <div 
              className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: template.couleur }}
            >
              {template.icone}
            </div>
          </div>

          {/* Infos template */}
          <div className="p-5">
            {/* Nom du template */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-between">
              {template.nom}
              {selected === template.id && (
                <span className="text-blue-600 text-sm">✓</span>
              )}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {template.description}
            </p>

            {/* Secteurs */}
            <div className="flex flex-wrap gap-1.5">
              {template.secteurs.slice(0, 3).map((secteur, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {secteur}
                </span>
              ))}
              {template.secteurs.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                  +{template.secteurs.length - 3}
                </span>
              )}
            </div>

            {/* Indicateur de sélection */}
            {selected === template.id && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center text-blue-600 font-semibold text-sm">
                  <span className="mr-2">✓</span>
                  Template sélectionné
                </div>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}