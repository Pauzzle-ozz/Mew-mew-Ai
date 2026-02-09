export default function Alert({
  variant = 'info',
  children,
  onClose,
  className = '',
}) {
  const variants = {
    success: 'bg-success/10 border-success/20 text-success',
    error: 'bg-error/10 border-error/20 text-error',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    info: 'bg-info/10 border-info/20 text-info',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${variants[variant]} ${className}`}>
      <div className="flex-1 text-sm">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          &times;
        </button>
      )}
    </div>
  );
}
