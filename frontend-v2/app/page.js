'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Logo from '@/components/shared/Logo'
import Button from '@/components/shared/Button'
import Footer from '@/components/shared/Footer'
import ThemeToggle from '@/components/shared/ThemeToggle'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Logo size="sm" />

            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="text-text-secondary hover:text-primary font-medium flex items-center cursor-pointer">
                  Solutions
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-surface-elevated rounded-lg shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/solutions" className="block px-4 py-3 hover:bg-surface rounded-t-lg transition-colors">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💼</span>
                      <div>
                        <div className="font-semibold text-text-primary">Recherche d&apos;emploi</div>
                        <div className="text-xs text-text-muted">CV, portfolio, offres</div>
                      </div>
                    </div>
                  </Link>
                  <div className="block px-4 py-3 opacity-40 cursor-not-allowed">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💰</span>
                      <div>
                        <div className="font-semibold text-text-muted">Fiscalite & Compta</div>
                        <div className="text-xs text-text-muted">Bientot</div>
                      </div>
                    </div>
                  </div>
                  <div className="block px-4 py-3 opacity-40 cursor-not-allowed rounded-b-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📢</span>
                      <div>
                        <div className="font-semibold text-text-muted">Marketing & Com</div>
                        <div className="text-xs text-text-muted">Bientot</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              {user ? (
                /* Connecte : juste l'email + deconnexion */
                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-sm text-text-muted">{user.email}</span>
                  <button onClick={handleLogout} className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                    Deconnexion
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Se connecter</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">Commencer</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto text-center relative">

          {/* Logo */}
          <div className="mb-8">
            <Logo size="lg" link={false} />
          </div>

          {/* Titre */}
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-5 tracking-tight">
            Optimisez votre parcours professionnel.
          </h1>

          {/* Sous-titre */}
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            Creez un CV, publiez votre portfolio et trouvez des offres qui vous correspondent — tout au meme endroit.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? '/solutions' : '/signup'}>
              <Button variant="primary" size="lg">Commencer</Button>
            </Link>
            <a href="#outils">
              <Button variant="outline" size="lg">Voir les outils</Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-14 max-w-lg mx-auto">
            <div>
              <div className="text-2xl font-bold text-primary">0€</div>
              <div className="text-sm text-text-muted">Gratuit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">5 min</div>
              <div className="text-sm text-text-muted">Pour un CV pro</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-text-muted">Outils disponibles</div>
            </div>
          </div>
        </div>
      </section>

      {/* LES OUTILS */}
      <section id="outils" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Choisissez votre solution
            </h2>
            <p className="text-text-secondary">
              Trois domaines, chacun avec ses propres outils
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <Link href="/solutions" className="group">
              <div className="bg-surface rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-primary/20 hover:border-primary/40 h-full">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                  Recherche d&apos;emploi
                </h3>
                <p className="text-text-secondary mb-6">
                  Analysez votre profil, creez des CV et portfolios, et adaptez vos candidatures a chaque offre.
                </p>
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Analyseur de CV</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Generateur de CV & Portfolio</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Matching offres d&apos;emploi</div>
                </div>
                <div className="mt-6 text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Acces
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <div className="opacity-50 cursor-not-allowed">
              <div className="bg-surface rounded-2xl p-8 border border-border h-full">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-text-muted mb-3">Fiscalite & Comptabilite</h3>
                <p className="text-text-muted mb-6">Declarations, optimisation fiscale et comptabilite simplifiee.</p>
                <div className="space-y-2 text-sm text-text-muted">
                  <div className="flex items-center"><span className="mr-2">&#9675;</span>Assistant fiscal</div>
                  <div className="flex items-center"><span className="mr-2">&#9675;</span>Gestion comptable</div>
                  <div className="flex items-center"><span className="mr-2">&#9675;</span>Optimisation fiscale</div>
                </div>
                <div className="mt-6 inline-block px-4 py-2 bg-surface-elevated text-text-muted rounded-lg text-sm font-semibold">Bientot disponible</div>
              </div>
            </div>

            <div className="opacity-50 cursor-not-allowed">
              <div className="bg-surface rounded-2xl p-8 border border-border h-full">
                <div className="text-5xl mb-4">📢</div>
                <h3 className="text-2xl font-bold text-text-muted mb-3">Marketing & Communication</h3>
                <p className="text-text-muted mb-6">Campagnes, contenu et strategie de communication.</p>
                <div className="space-y-2 text-sm text-text-muted">
                  <div className="flex items-center"><span className="mr-2">&#9675;</span>Plans de communication</div>
                  <div className="flex items-center"><span className="mr-2">&#9675;</span>Automatisation marketing</div>
                  <div className="flex items-center"><span className="mr-2">&#9675;</span>Creation de contenu</div>
                </div>
                <div className="mt-6 inline-block px-4 py-2 bg-surface-elevated text-text-muted rounded-lg text-sm font-semibold">Bientot disponible</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Comment ca marche</h2>
            <p className="text-text-secondary">Pret en 3 etapes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">1</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Creez votre compte</h3>
              <p className="text-text-secondary text-sm">Inscription gratuite, sans carte bancaire</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">2</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Choisissez un outil</h3>
              <p className="text-text-secondary text-sm">CV, portfolio ou matching selon votre besoin</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">3</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Obtenez votre resultat</h3>
              <p className="text-text-secondary text-sm">Un CV ou portfolio pret en quelques minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-primary/10" style={{ background: 'linear-gradient(to right, var(--primary-light), var(--primary-glow))' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Pret a vous lancer ?</h2>
          <p className="text-text-secondary mb-7">
            Compte gratuit, aucune carte requise.
          </p>
          <Link href={user ? '/solutions' : '/signup'}>
            <Button variant="primary" size="lg">Commencer</Button>
          </Link>
        </div>
      </section>

      <Footer />

    </div>
  )
}
