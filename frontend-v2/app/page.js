'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CatMascot from '@/components/shared/CatMascot'
import Button from '@/components/shared/Button'
import Footer from '@/components/shared/Footer'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <CatMascot size="sm" animate={false} />
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                Mew
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="text-text-secondary hover:text-primary font-medium flex items-center cursor-pointer">
                  Solutions
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div className="absolute top-full left-0 mt-2 w-56 bg-surface-elevated rounded-lg shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/dashboard" className="block px-4 py-3 hover:bg-surface rounded-t-lg transition-colors">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💼</span>
                      <div>
                        <div className="font-semibold text-text-primary">Recherche d&apos;emploi</div>
                        <div className="text-xs text-text-muted">CV, offres, matching</div>
                      </div>
                    </div>
                  </Link>

                  <div className="block px-4 py-3 opacity-50 cursor-not-allowed">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💰</span>
                      <div>
                        <div className="font-semibold text-text-muted">Fiscalite & Compta</div>
                        <div className="text-xs text-text-muted">Bientot disponible</div>
                      </div>
                    </div>
                  </div>

                  <div className="block px-4 py-3 opacity-50 cursor-not-allowed rounded-b-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📢</span>
                      <div>
                        <div className="font-semibold text-text-muted">Marketing & Com</div>
                        <div className="text-xs text-text-muted">Bientot disponible</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Se connecter</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Commencer</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto text-center relative">

          {/* Cat Mascot */}
          <div className="mb-8">
            <CatMascot size="xl" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium mb-8">
            Plateforme IA tout-en-un
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            L&apos;IA qui vous
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent"> propulse</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
            Optimisez votre carriere, votre fiscalite et votre communication grace a l&apos;intelligence artificielle. Simple, rapide, efficace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="primary" size="lg">Commencer gratuitement</Button>
            </Link>
            <a href="#univers">
              <Button variant="outline" size="lg">Decouvrir les solutions</Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-text-muted">Univers de solutions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-text-muted">Propulse par l&apos;IA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">5 min</div>
              <div className="text-sm text-text-muted">Pour commencer</div>
            </div>
          </div>
        </div>
      </section>

      {/* LES 3 UNIVERS */}
      <section id="univers" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Trois univers, une plateforme
            </h2>
            <p className="text-xl text-text-secondary">
              Des outils IA specialises pour chaque aspect de votre vie professionnelle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Univers 1 : Emploi */}
            <Link href="/dashboard" className="group">
              <div className="bg-surface rounded-2xl p-8 hover:shadow-2xl hover:shadow-primary-glow/10 transition-all duration-300 border border-primary/20 hover:border-primary/40 h-full">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                  Recherche d&apos;emploi
                </h3>
                <p className="text-text-secondary mb-6">
                  Analysez votre CV, creez des portfolios professionnels et adaptez votre profil aux offres d&apos;emploi.
                </p>
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex items-center">
                    <span className="text-primary mr-2">&#10003;</span>
                    Analyseur de CV intelligent
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-2">&#10003;</span>
                    Generateur de CV & Portfolio
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary mr-2">&#10003;</span>
                    Matcher offre d&apos;emploi
                  </div>
                </div>
                <div className="mt-6 text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Decouvrir
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Univers 2 : Fiscalite */}
            <div className="group opacity-50 cursor-not-allowed">
              <div className="bg-surface rounded-2xl p-8 border border-border h-full">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-text-muted mb-3">
                  Fiscalite & Comptabilite
                </h3>
                <p className="text-text-muted mb-6">
                  Gerez votre comptabilite, optimisez votre fiscalite et simplifiez vos declarations.
                </p>
                <div className="space-y-2 text-sm text-text-muted">
                  <div className="flex items-center">
                    <span className="text-text-muted/50 mr-2">&#9675;</span>
                    Assistant fiscal intelligent
                  </div>
                  <div className="flex items-center">
                    <span className="text-text-muted/50 mr-2">&#9675;</span>
                    Gestion comptable automatisee
                  </div>
                  <div className="flex items-center">
                    <span className="text-text-muted/50 mr-2">&#9675;</span>
                    Optimisation fiscale
                  </div>
                </div>
                <div className="mt-6 inline-block px-4 py-2 bg-surface-elevated text-text-muted rounded-lg text-sm font-semibold">
                  Bientot disponible
                </div>
              </div>
            </div>

            {/* Univers 3 : Marketing */}
            <div className="group opacity-50 cursor-not-allowed">
              <div className="bg-surface rounded-2xl p-8 border border-border h-full">
                <div className="text-5xl mb-4">📢</div>
                <h3 className="text-2xl font-bold text-text-muted mb-3">
                  Marketing & Communication
                </h3>
                <p className="text-text-muted mb-6">
                  Creez, automatisez et planifiez vos campagnes marketing et communication.
                </p>
                <div className="space-y-2 text-sm text-text-muted">
                  <div className="flex items-center">
                    <span className="text-text-muted/50 mr-2">&#9675;</span>
                    Plans de communication IA
                  </div>
                  <div className="flex items-center">
                    <span className="text-text-muted/50 mr-2">&#9675;</span>
                    Automatisation marketing
                  </div>
                  <div className="flex items-center">
                    <span className="text-text-muted/50 mr-2">&#9675;</span>
                    Creation de contenu
                  </div>
                </div>
                <div className="mt-6 inline-block px-4 py-2 bg-surface-elevated text-text-muted rounded-lg text-sm font-semibold">
                  Bientot disponible
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Simple et efficace
            </h2>
            <p className="text-xl text-text-secondary">
              Commencez en 3 etapes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Creez votre compte
              </h3>
              <p className="text-text-secondary">
                Inscription gratuite en moins de 30 secondes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Choisissez votre univers
              </h3>
              <p className="text-text-secondary">
                Selectionnez la solution adaptee a vos besoins
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Laissez l&apos;IA travailler
              </h3>
              <p className="text-text-secondary">
                Obtenez des resultats professionnels en quelques minutes
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-b border-primary/10" style={{ background: 'linear-gradient(to right, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.03))' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Pret a propulser votre carriere ?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Rejoignez Mew des aujourd&apos;hui et decouvrez la puissance de l&apos;IA
          </p>
          <Link href="/signup">
            <Button variant="primary" size="lg">Commencer gratuitement</Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  )
}
