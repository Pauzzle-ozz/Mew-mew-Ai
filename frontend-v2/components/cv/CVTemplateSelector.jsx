/**
 * Composant CVTemplateSelector
 * Permet de sélectionner un template de CV
 */

import { templates } from '@/lib/constants/templates';

export default function CVTemplateSelector({ selected, onSelect }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`bg-white rounded-xl p-6 border-2 transition-all ${
            selected === template.id
              ? 'border-blue-500 shadow-xl'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className={`w-full h-64 bg-gradient-to-br ${template.couleur} rounded-lg mb-4 flex items-center justify-center text-6xl`}>
            {template.icone}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {template.nom}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {template.description}
          </p>
          <p className="text-xs text-gray-500">
            Idéal pour : {template.secteurs}
          </p>
        </button>
      ))}
    </div>
  );
}