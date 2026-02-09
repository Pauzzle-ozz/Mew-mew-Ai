export default function Badge({
  variant = 'default',
  children,
  className = '',
}) {
  const variants = {
    default: 'bg-surface-elevated text-text-muted',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
    primary: 'bg-primary/10 text-primary',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
