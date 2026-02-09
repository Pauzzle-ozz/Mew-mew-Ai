'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import CatMascot from '@/components/shared/CatMascot'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <CatMascot size="md" />
        <p className="text-text-muted">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        breadcrumbs={[{ label: "Recherche d'emploi" }]}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Recherche d&apos;emploi
          </h2>
          <p className="text-text-secondary">
            Optimisez votre profil et trouvez le job parfait avec nos outils IA
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Solution 1 : Analyseur de CV */}
          <Link href="/solutions/analyse-cv" className="group">
            <div className="bg-surface rounded-xl p-6 transition-all duration-300 border border-border hover:border-primary h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                Analyseur de CV
              </h3>
              <p className="text-text-muted mb-4 text-sm">
                Analyse ton CV et te propose des metiers adaptes a ton profil
              </p>
              <div className="space-y-2 text-sm text-text-secondary mb-4">
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  Analyse intelligente
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  Upload PDF
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  Note marche
                </div>
              </div>
              <div className="text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                Utiliser
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Solution 2 : Optimiseur de CV */}
          <Link href="/solutions/optimiseur-cv" className="group">
            <div className="bg-surface rounded-xl p-6 transition-all duration-300 border border-border hover:border-primary h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">&#10024;</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                Optimiseur de CV
              </h3>
              <p className="text-text-muted mb-4 text-sm">
                Cree des CV professionnels avec des templates modernes
              </p>
              <div className="space-y-2 text-sm text-text-secondary mb-4">
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  6 templates
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  Export PDF
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  Design pro
                </div>
              </div>
              <div className="text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                Utiliser
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Solution 3 : Portfolio Pro */}
          <Link href="/solutions/portfolio" className="group">
            <div className="bg-surface rounded-xl p-6 transition-all duration-300 border border-border hover:border-primary h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                Portfolio Pro
              </h3>
              <p className="text-text-muted mb-4 text-sm">
                Cree ton site web personnel avec videos, images et textes
              </p>
              <div className="space-y-2 text-sm text-text-secondary mb-4">
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  URL unique
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  Blocs personnalisables
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">&#10003;</span>
                  Images & Videos
                </div>
              </div>
              <div className="text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                Utiliser
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Solution 4 : Matcher Offre (disabled) */}
          <div className="group opacity-50 cursor-not-allowed">
            <div className="bg-surface rounded-xl p-6 border border-border h-full">
              <div className="w-14 h-14 bg-surface-elevated rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-text-muted mb-2">
                Matcher Offre
              </h3>
              <p className="text-text-muted mb-4 text-sm">
                Adapte ton CV automatiquement a chaque offre d&apos;emploi
              </p>
              <div className="space-y-2 text-sm text-text-muted mb-4">
                <div className="flex items-center">
                  <span className="text-text-muted/50 mr-2">&#9675;</span>
                  Analyse offre
                </div>
                <div className="flex items-center">
                  <span className="text-text-muted/50 mr-2">&#9675;</span>
                  CV adapte
                </div>
                <div className="flex items-center">
                  <span className="text-text-muted/50 mr-2">&#9675;</span>
                  Lettre motivation
                </div>
              </div>
              <div className="inline-block px-4 py-2 bg-surface-elevated text-text-muted rounded-lg text-sm font-semibold">
                Bientot disponible
              </div>
            </div>
          </div>

        </div>

        {/* Info box */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start">
            <div className="text-3xl mr-4">&#8505;&#65039;</div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Utilisation gratuite</h4>
              <div className="text-sm text-text-secondary space-y-1">
                <p>&#8226; Analyses illimitees</p>
                <p>&#8226; Taille max des fichiers : 2 Mo</p>
                <p>&#8226; Acces aux 4 solutions de recherche d&apos;emploi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Other universes */}
        <div className="mt-8 bg-surface rounded-xl p-6 border border-border">
          <h4 className="font-semibold text-text-primary mb-3">Decouvrez nos autres univers</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center opacity-50">
              <span className="text-3xl mr-3">💰</span>
              <div>
                <div className="font-medium text-text-muted">Fiscalite & Comptabilite</div>
                <div className="text-xs text-text-muted/70">Bientot disponible</div>
              </div>
            </div>
            <div className="flex items-center opacity-50">
              <span className="text-3xl mr-3">📢</span>
              <div>
                <div className="font-medium text-text-muted">Marketing & Communication</div>
                <div className="text-xs text-text-muted/70">Bientot disponible</div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
