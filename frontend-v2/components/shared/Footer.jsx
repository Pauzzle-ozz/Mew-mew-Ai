import Link from 'next/link';
import CatMascot from './CatMascot';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CatMascot size="sm" animate={false} />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Mew-mew-Ai
              </span>
            </div>
            <p className="text-sm text-text-muted">
              L&apos;IA qui propulse votre carriere.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/solutions/analyse-cv" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Analyseur CV
                </Link>
              </li>
              <li>
                <Link href="/solutions/optimiseur-cv" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Optimiseur CV
                </Link>
              </li>
              <li>
                <Link href="/solutions/portfolio" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Portfolio Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Plateforme */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Plateforme</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Univers */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Univers</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-text-muted">Emploi & Carriere</span></li>
              <li><span className="text-sm text-text-muted/50">Fiscalite (bientot)</span></li>
              <li><span className="text-sm text-text-muted/50">Marketing (bientot)</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Mew-mew-Ai. Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  );
}
