export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="p-4 bg-error/10 border border-error/20 text-error rounded-lg flex items-start justify-between">
      <div className="flex-1 text-sm">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-error/60 hover:text-error transition-opacity cursor-pointer"
        >
          &times;
        </button>
      )}
    </div>
  );
}
