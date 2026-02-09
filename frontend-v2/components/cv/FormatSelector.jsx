export default function FormatSelector({ selectedFormats, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-text-primary mb-4">Formats de sortie</h3>

      <label className="flex items-center p-4 border border-border rounded-lg hover:bg-surface transition-colors cursor-pointer">
        <input
          type="checkbox"
          checked={selectedFormats.pdf}
          onChange={(e) => onChange({ ...selectedFormats, pdf: e.target.checked })}
          className="w-5 h-5 accent-primary"
        />
        <div className="ml-3">
          <div className="font-medium text-text-primary">Export PDF</div>
          <div className="text-sm text-text-muted">Format universel, parfait pour l&apos;envoi</div>
        </div>
      </label>

      <label className="flex items-center p-4 border border-border rounded-lg hover:bg-surface transition-colors cursor-pointer">
        <input
          type="checkbox"
          checked={selectedFormats.docx}
          onChange={(e) => onChange({ ...selectedFormats, docx: e.target.checked })}
          className="w-5 h-5 accent-primary"
        />
        <div className="ml-3">
          <div className="font-medium text-text-primary">Export DOCX</div>
          <div className="text-sm text-text-muted">Format editable pour modifications ulterieures</div>
        </div>
      </label>
    </div>
  );
}
