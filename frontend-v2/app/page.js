'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-white">
      
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Mew
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                  Solutions
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown */}
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/dashboard" className="block px-4 py-3 hover:bg-gray-50 rounded-t-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💼</span>
                      <div>
                        <div className="font-semibold text-gray-900">Recherche d'emploi</div>
                        <div className="text-xs text-gray-500">CV, offres, matching</div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="block px-4 py-3 opacity-50 cursor-not-allowed">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💰</span>
                      <div>
                        <div className="font-semibold text-gray-400">Fiscalité & Compta</div>
                        <div className="text-xs text-gray-400">Bientôt disponible</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="block px-4 py-3 opacity-50 cursor-not-allowed rounded-b-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📢</span>
                      <div>
                        <div className="font-semibold text-gray-400">Marketing & Com</div>
                        <div className="text-xs text-gray-400">Bientôt disponible</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Se connecter
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 animate-pulse">
            🚀 Plateforme IA tout-en-un
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            L'IA qui vous
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"> propulse</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Optimisez votre carrière, votre fiscalité et votre communication grâce à l'intelligence artificielle. Simple, rapide, efficace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Commencer gratuitement
            </Link>
            <a 
              href="#univers" 
              className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-lg border-2 border-gray-200 transition-all"
            >
              Découvrir les solutions
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Univers de solutions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">Propulsé par l'IA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">5 min</div>
              <div className="text-sm text-gray-600">Pour commencer</div>
            </div>
          </div>
        </div>
      </section>

      {/* LES 3 UNIVERS */}
      <section id="univers" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trois univers, une plateforme
            </h2>
            <p className="text-xl text-gray-600">
              Des outils IA spécialisés pour chaque aspect de votre vie professionnelle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Univers 1 : Emploi */}
            <Link href="/dashboard" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 h-full">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Recherche d'emploi
                </h3>
                <p className="text-gray-600 mb-6">
                  Analysez votre CV, créez des portfolios professionnels et adaptez votre profil aux offres d'emploi.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Analyseur de CV intelligent
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Générateur de CV & Portfolio
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Matcher offre d'emploi
                  </div>
                </div>
                <div className="mt-6 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Découvrir
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Univers 2 : Fiscalité */}
            <div className="group opacity-60 cursor-not-allowed">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 h-full">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  Fiscalité & Comptabilité
                </h3>
                <p className="text-gray-500 mb-6">
                  Gérez votre comptabilité, optimisez votre fiscalité et simplifiez vos déclarations.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Assistant fiscal intelligent
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Gestion comptable automatisée
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Optimisation fiscale
                  </div>
                </div>
                <div className="mt-6 inline-block px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold">
                  Bientôt disponible
                </div>
              </div>
            </div>

            {/* Univers 3 : Marketing */}
            <div className="group opacity-60 cursor-not-allowed">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 h-full">
                <div className="text-5xl mb-4">📢</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  Marketing & Communication
                </h3>
                <p className="text-gray-500 mb-6">
                  Créez, automatisez et planifiez vos campagnes marketing et communication.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Plans de communication IA
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Automatisation marketing
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">○</span>
                    Création de contenu
                  </div>
                </div>
                <div className="mt-6 inline-block px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold">
                  Bientôt disponible
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple et efficace
            </h2>
            <p className="text-xl text-gray-600">
              Commencez en 3 étapes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Créez votre compte
              </h3>
              <p className="text-gray-600">
                Inscription gratuite en moins de 30 secondes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Choisissez votre univers
              </h3>
              <p className="text-gray-600">
                Sélectionnez la solution adaptée à vos besoins
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Laissez l'IA travailler
              </h3>
              <p className="text-gray-600">
                Obtenez des résultats professionnels en quelques minutes
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à propulser votre carrière ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez Mew dès aujourd'hui et découvrez la puissance de l'IA
          </p>
          <Link 
            href="/signup" 
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-4">
                Mew
              </div>
              <p className="text-sm">
                L'IA qui propulse votre réussite professionnelle
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Recherche d'emploi</Link></li>
                <li><span className="opacity-50">Fiscalité & Compta</span></li>
                <li><span className="opacity-50">Marketing & Com</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © 2026 Mew. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  )
}