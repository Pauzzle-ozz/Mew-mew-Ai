export default function Card({
  children,
  hover = false,
  className = '',
  padding = 'p-6',
  ...props
}) {
  const baseStyles = 'bg-surface rounded-xl border border-border';
  const hoverStyles = hover ? 'hover:border-border-light hover:shadow-lg hover:shadow-primary-glow/5 transition-all duration-300' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
}
