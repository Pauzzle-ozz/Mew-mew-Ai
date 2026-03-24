import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="sm" link={false} />
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Des outils IA pour chaque etape de votre parcours professionnel. Gratuit, rapide, efficace.
            </p>
          </div>

          {/* Outils */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-sm text-text-primary mb-4 uppercase tracking-wider">Outils</h4>
            <ul className="space-y-2.5">
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
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/solutions/matcher-offres" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Matcher
                </Link>
              </li>
            </ul>
          </div>

          {/* Univers */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-sm text-text-primary mb-4 uppercase tracking-wider">Univers</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard?tab=emploi" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Emploi & Carriere
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=marketing" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Marketing & Com
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=fiscalite" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Fiscalite
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=finance" className="text-sm text-text-muted hover:text-primary transition-colors">
                  Finance
                </Link>
              </li>
            </ul>
          </div>

          {/* Compte */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-sm text-text-primary mb-4 uppercase tracking-wider">Compte</h4>
            <ul className="space-y-2.5">
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
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Mew-mew-Ai. Tous droits reserves.
          </p>
          <p className="text-xs text-text-muted">
            Propulse par l&apos;intelligence artificielle
          </p>
        </div>
      </div>
    </footer>
  );
}
