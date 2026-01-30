/**
 * Composant ErrorMessage
 * Affiche les messages d'erreur de manière cohérente
 */

export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start justify-between">
      <div className="flex-1">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-red-400 hover:text-red-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}