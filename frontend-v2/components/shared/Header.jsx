'use client';

import Link from 'next/link';
import Logo from './Logo';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

export default function Header({
  breadcrumbs = [],
  user = null,
  onLogout,
  showAuth = false,
}) {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Logo size="sm" />

          {breadcrumbs.length > 0 && (
            <nav className="hidden sm:flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2">
                  <span className="text-text-muted">/</span>
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-text-muted hover:text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-text-secondary">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Right: Theme toggle + Auth or User */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {showAuth && !user && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Inscription</Button>
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-muted hidden sm:block">{user.email}</span>
              {onLogout && (
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  Deconnexion
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
