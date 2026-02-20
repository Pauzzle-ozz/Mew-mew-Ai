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
                  <Link href={user ? '/dashboard?tab=emploi' : '/signup'} className="block px-4 py-3 hover:bg-surface rounded-t-lg transition-colors">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💼</span>
                      <div>
                        <div className="font-semibold text-text-primary">Recherche d&apos;emploi</div>
                        <div className="text-xs text-text-muted">CV, portfolio, offres</div>
                      </div>
                    </div>
                  </Link>
                  <Link href={user ? '/dashboard?tab=marketing' : '/signup'} className="block px-4 py-3 hover:bg-surface transition-colors">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📢</span>
                      <div>
                        <div className="font-semibold text-text-primary">Marketing & Com</div>
                        <div className="text-xs text-text-muted">Contenu, strategie, veille</div>
                      </div>
                    </div>
                  </Link>
                  <Link href={user ? '/dashboard?tab=fiscalite' : '/signup'} className="block px-4 py-3 hover:bg-surface transition-colors">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏛️</span>
                      <div>
                        <div className="font-semibold text-text-primary">Fiscalite</div>
                        <div className="text-xs text-text-muted">Audit, declarations, simulation</div>
                      </div>
                    </div>
                  </Link>
                  <Link href={user ? '/dashboard?tab=finance' : '/signup'} className="block px-4 py-3 hover:bg-surface rounded-b-lg transition-colors">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💰</span>
                      <div>
                        <div className="font-semibold text-text-primary">Finance</div>
                        <div className="text-xs text-text-muted">Analyse, technique, trading</div>
                      </div>
                    </div>
                  </Link>
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
            L&apos;IA qui vous propulse.
          </h1>

          {/* Sous-titre */}
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            Emploi, marketing, fiscalite, finance — des outils IA pour chaque etape de votre parcours professionnel.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? '/dashboard' : '/signup'}>
              <Button variant="primary" size="lg">Commencer</Button>
            </Link>
            <a href="#outils">
              <Button variant="outline" size="lg">Voir les outils</Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-14 max-w-xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-primary">0€</div>
              <div className="text-sm text-text-muted">Gratuit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-text-muted">Univers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">18</div>
              <div className="text-sm text-text-muted">Outils IA</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">5 min</div>
              <div className="text-sm text-text-muted">Pour un resultat</div>
            </div>
          </div>
        </div>
      </section>

      {/* LES OUTILS */}
      <section id="outils" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Choisissez votre univers
            </h2>
            <p className="text-text-secondary">
              Quatre domaines, 18 outils IA a votre service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <Link href={user ? '/dashboard?tab=emploi' : '/signup'} className="group">
              <div className="bg-surface rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-primary/20 hover:border-primary/40 h-full">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  Recherche d&apos;emploi
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  CV, portfolio, matching d&apos;offres et candidatures spontanees.
                </p>
                <div className="space-y-1.5 text-sm text-text-secondary">
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Analyseur de CV</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Optimiseur & Generateur CV</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Portfolio pro</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Matcher d&apos;offres</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Candidature spontanee</div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">5 outils</span>
                  <div className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center text-sm">
                    Acces
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            <Link href={user ? '/dashboard?tab=marketing' : '/signup'} className="group">
              <div className="bg-surface rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-primary/20 hover:border-primary/40 h-full">
                <div className="text-4xl mb-3">📢</div>
                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  Marketing & Com
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Contenu, strategie, veille, concurrence et performance.
                </p>
                <div className="space-y-1.5 text-sm text-text-secondary">
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Redacteur multi-format</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Strategie de contenu 30j</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Veille sectorielle</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Analyseur concurrence</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Audit SEO & Performance</div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">7 outils</span>
                  <div className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center text-sm">
                    Acces
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            <Link href={user ? '/dashboard?tab=fiscalite' : '/signup'} className="group">
              <div className="bg-surface rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-primary/20 hover:border-primary/40 h-full">
                <div className="text-4xl mb-3">🏛️</div>
                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  Fiscalite
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Audit fiscal, declarations, calendrier et simulation de strategie.
                </p>
                <div className="space-y-1.5 text-sm text-text-secondary">
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Audit fiscal complet</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Assistant fiscal</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Simulateur strategie</div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">3 outils</span>
                  <div className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center text-sm">
                    Acces
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            <Link href={user ? '/dashboard?tab=finance' : '/signup'} className="group">
              <div className="bg-surface rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-primary/20 hover:border-primary/40 h-full">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  Finance
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Analyse fondamentale, technique et recommandations trading.
                </p>
                <div className="space-y-1.5 text-sm text-text-secondary">
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Analyse fondamentale</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Analyse technique</div>
                  <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Bot trading IA</div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">3 outils</span>
                  <div className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center text-sm">
                    Acces
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

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
              <p className="text-text-secondary text-sm">Emploi, marketing, fiscalite ou finance</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">3</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Obtenez votre resultat</h3>
              <p className="text-text-secondary text-sm">Analyse, recommandations et documents en quelques minutes</p>
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
          <Link href={user ? '/dashboard' : '/signup'}>
            <Button variant="primary" size="lg">Commencer</Button>
          </Link>
        </div>
      </section>

      <Footer />

    </div>
  )
}
