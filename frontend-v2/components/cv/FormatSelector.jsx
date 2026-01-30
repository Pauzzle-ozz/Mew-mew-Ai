/**
 * Composant FormatSelector
 * Permet de sélectionner les formats de sortie (PDF/DOCX)
 */

export default function FormatSelector({ selectedFormats, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 mb-4">Formats de sortie</h3>
      
      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
        <input 
          type="checkbox" 
          checked={selectedFormats.pdf}
          onChange={(e) => onChange({ ...selectedFormats, pdf: e.target.checked })}
          className="w-5 h-5 text-blue-600" 
        />
        <div className="ml-3">
          <div className="font-medium text-gray-900">Export PDF</div>
          <div className="text-sm text-gray-600">Format universel, parfait pour l'envoi</div>
        </div>
      </label>

      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
        <input 
          type="checkbox" 
          checked={selectedFormats.docx}
          onChange={(e) => onChange({ ...selectedFormats, docx: e.target.checked })}
          className="w-5 h-5 text-blue-600" 
        />
        <div className="ml-3">
          <div className="font-medium text-gray-900">Export DOCX</div>
          <div className="text-sm text-gray-600">Format éditable pour modifications ultérieures</div>
        </div>
      </label>
    </div>
  );
}