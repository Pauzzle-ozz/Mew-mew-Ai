'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/shared/Header'

export default function SolutionsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    }
    checkSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-text-muted">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Choisissez votre solution</h1>
          <p className="text-text-secondary">Selectionnez un domaine pour acceder aux outils correspondants.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Emploi */}
          <Link href="/dashboard" className="group">
            <div className="bg-surface rounded-2xl p-7 border border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-200 h-full">
              <div className="text-4xl mb-4">💼</div>
              <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                Recherche d&apos;emploi
              </h2>
              <p className="text-sm text-text-secondary mb-5">
                CV, portfolio professionnel et matching d&apos;offres d&apos;emploi.
              </p>
              <div className="space-y-1.5 text-sm text-text-secondary mb-6">
                <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Analyseur de CV</div>
                <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Optimiseur & Generateur CV</div>
                <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Portfolio en ligne</div>
                <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Matching offres</div>
              </div>
              <div className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                Ouvrir
                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Fiscalite */}
          <div className="opacity-40 cursor-not-allowed">
            <div className="bg-surface rounded-2xl p-7 border border-border h-full">
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-xl font-bold text-text-muted mb-2">Fiscalite & Comptabilite</h2>
              <p className="text-sm text-text-muted mb-5">Declarations, optimisation fiscale et comptabilite.</p>
              <div className="space-y-1.5 text-sm text-text-muted mb-6">
                <div className="flex items-center"><span className="mr-2">&#9675;</span>Assistant fiscal</div>
                <div className="flex items-center"><span className="mr-2">&#9675;</span>Gestion comptable</div>
                <div className="flex items-center"><span className="mr-2">&#9675;</span>Optimisation fiscale</div>
              </div>
              <div className="inline-block px-3 py-1.5 bg-surface-elevated text-text-muted rounded-lg text-xs font-semibold">
                Bientot disponible
              </div>
            </div>
          </div>

          {/* Marketing */}
          <Link href="/dashboard?tab=marketing" className="group">
            <div className="bg-surface rounded-2xl p-7 border border-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-200 h-full">
              <div className="text-4xl mb-4">📢</div>
              <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                Marketing & Communication
              </h2>
              <p className="text-sm text-text-secondary mb-5">
                Contenu multi-format, strategie editoriale et veille sectorielle.
              </p>
              <div className="space-y-1.5 text-sm text-text-secondary mb-6">
                <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Redacteur multi-format</div>
                <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Strategie de contenu</div>
                <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Veille sectorielle</div>
                <div className="flex items-center"><span className="text-primary mr-2">&#10003;</span>Analyse concurrence</div>
              </div>
              <div className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                Ouvrir
                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  )
}
