'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Logo from '@/components/shared/Logo'
import Button from '@/components/shared/Button'
import Footer from '@/components/shared/Footer'
import ThemeToggle from '@/components/shared/ThemeToggle'

const UNIVERSES = [
  {
    id: 'emploi',
    label: "Emploi",
    tagline: "Trouvez votre prochain poste",
    color: 'from-orange-500/20 to-amber-500/10',
    darkColor: 'dark:from-orange-500/10 dark:to-amber-500/5',
    tools: ['Analyseur CV', 'Optimiseur CV', 'Portfolio Pro', 'Matcher', 'Candidature'],
    count: 5,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: 'marketing',
    label: "Marketing",
    tagline: "Boostez votre visibilite",
    color: 'from-emerald-500/20 to-teal-500/10',
    darkColor: 'dark:from-emerald-500/10 dark:to-teal-500/5',
    tools: ['Strategie 30j', 'Veille sectorielle', 'Concurrence', 'Audit SEO'],
    count: 4,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5L12 12m0 0l3-1.5M12 12V9" />
      </svg>
    ),
  },
  {
    id: 'fiscalite',
    label: "Fiscalite",
    tagline: "Optimisez vos impots",
    color: 'from-violet-500/20 to-purple-500/10',
    darkColor: 'dark:from-violet-500/10 dark:to-purple-500/5',
    tools: ['Audit fiscal', 'Assistant', 'Simulateur'],
    count: 3,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
  },
  {
    id: 'finance',
    label: "Finance",
    tagline: "Investissez mieux",
    color: 'from-blue-500/20 to-sky-500/10',
    darkColor: 'dark:from-blue-500/10 dark:to-sky-500/5',
    tools: ['Fondamentale', 'Technique', 'Bot trading'],
    count: 3,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    id: 'agents-ia',
    label: "Agents IA",
    tagline: "Des experts a votre service",
    color: 'from-rose-500/20 to-pink-500/10',
    darkColor: 'dark:from-rose-500/10 dark:to-pink-500/5',
    tools: ['Agent Fiscalite', 'Conversation', 'Documents'],
    count: 1,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Creez votre compte',
    desc: 'Inscription gratuite en 10 secondes. Pas de carte bancaire.',
  },
  {
    num: '02',
    title: 'Choisissez un outil',
    desc: 'Emploi, marketing, fiscalite, finance ou agents IA.',
  },
  {
    num: '03',
    title: 'Obtenez votre resultat',
    desc: 'Analyse, recommandations et documents en quelques minutes.',
  },
]

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

      {/* ─── HEADER ─── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-surface-glass backdrop-blur-xl border-b border-border/60' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="sm" />

            <nav className="hidden md:flex items-center gap-8">
              <a href="#univers" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">
                Univers
              </a>
              <a href="#comment" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">
                Comment ca marche
              </a>
              {user && (
                <Link href="/dashboard" className="text-sm text-primary hover:text-primary-hover transition-colors font-semibold">
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button variant="primary" size="sm">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>Quitter</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Connexion</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">Commencer</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-16 right-[10%] w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-0 left-[5%] w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none animate-float delay-300" />

        <div className="max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="animate-fade-in-up flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light border border-primary/10 text-sm text-primary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
              Gratuit &middot; 18 outils IA &middot; 5 univers
            </div>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up delay-100 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-center leading-[0.95] tracking-tight text-text-primary">
            L&apos;IA qui vous
            <br />
            <span className="text-primary">propulse.</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-text-secondary text-center mt-6 max-w-2xl mx-auto leading-relaxed">
            Emploi, marketing, fiscalite, finance — une plateforme, des outils IA
            pour chaque etape de votre parcours.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link href={user ? '/dashboard' : '/signup'}>
              <Button variant="primary" size="lg">
                Commencer gratuitement
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
            <a href="#univers">
              <Button variant="outline" size="lg">Decouvrir les outils</Button>
            </a>
          </div>

          {/* Stats row */}
          <div className="animate-fade-in-up delay-500 grid grid-cols-2 sm:grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto">
            {[
              { value: '0 \u20AC', label: 'Gratuit' },
              { value: '5', label: 'Univers' },
              { value: '18', label: 'Outils IA' },
              { value: '~3 min', label: 'Par resultat' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UNIVERS ─── */}
      <section id="univers" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
              Cinq univers, un seul objectif
            </h2>
            <p className="text-text-secondary mt-3 text-lg">
              Choisissez votre domaine et laissez l&apos;IA travailler pour vous
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {UNIVERSES.map((u, i) => (
              <Link
                key={u.id}
                href={user ? `/dashboard?tab=${u.id}` : '/signup'}
                className={`group animate-fade-in-up delay-${(i + 1) * 100}`}
              >
                <div className={`relative rounded-2xl p-6 h-full bg-gradient-to-br ${u.color} ${u.darkColor} border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-text-primary mb-5 group-hover:scale-110 transition-transform shadow-sm">
                    {u.icon}
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {u.label}
                  </h3>
                  <p className="text-sm text-text-secondary mb-5">{u.tagline}</p>

                  {/* Tools list */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {u.tools.map(tool => (
                      <span key={tool} className="px-2.5 py-1 rounded-full bg-surface/80 text-xs text-text-secondary font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs text-text-muted font-medium">{u.count} outil{u.count > 1 ? 's' : ''}</span>
                    <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explorer
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMENT CA MARCHE ─── */}
      <section id="comment" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
              Trois etapes, c&apos;est tout
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className={`animate-fade-in-up delay-${(i + 1) * 200} relative`}>
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-border -translate-x-1/2" style={{ left: 'calc(50% + 3rem)', width: 'calc(100% - 6rem)' }} />
                )}
                <div className="font-display text-6xl font-bold text-primary/10 mb-4 leading-none">
                  {step.num}
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-accent-light to-primary-light p-12 sm:p-16 text-center border border-primary/10 overflow-hidden">
            {/* Decorative */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/10 blur-2xl" />

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4 relative">
              Pret a vous lancer ?
            </h2>
            <p className="text-text-secondary mb-8 text-lg relative">
              Compte gratuit, aucune carte requise. Resultats en minutes.
            </p>
            <Link href={user ? '/dashboard' : '/signup'} className="relative">
              <Button variant="primary" size="lg">
                Commencer maintenant
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
