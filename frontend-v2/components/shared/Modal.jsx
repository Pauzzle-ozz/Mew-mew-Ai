'use client';

import { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${maxWidth} w-full bg-surface rounded-2xl border border-border/60 shadow-2xl p-6 animate-scale-in`}>
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h2 className="font-display text-xl font-bold text-text-primary">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors ml-auto cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-elevated"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
