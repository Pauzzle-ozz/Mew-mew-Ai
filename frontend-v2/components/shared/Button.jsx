'use client';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background cursor-pointer';

  const variants = {
    primary: 'bg-primary text-gray-900 hover:bg-primary-hover focus:ring-primary/50',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary/50',
    outline: 'border border-border-light text-text-secondary hover:bg-surface-elevated hover:text-text-primary focus:ring-primary/50',
    ghost: 'text-text-muted hover:text-text-primary hover:bg-surface focus:ring-primary/50',
    danger: 'bg-error/10 text-error border border-error/20 hover:bg-error/20 focus:ring-error/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
