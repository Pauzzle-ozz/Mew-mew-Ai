'use client';

import { forwardRef } from 'react';

const Input = forwardRef(function Input({
  label,
  error,
  className = '',
  as = 'input',
  ...props
}, ref) {
  const Component = as === 'textarea' ? 'textarea' : 'input';

  const baseStyles = 'w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200';
  const errorStyles = error ? 'border-error focus:ring-error/50 focus:border-error' : '';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <Component
        ref={ref}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

export default Input;
