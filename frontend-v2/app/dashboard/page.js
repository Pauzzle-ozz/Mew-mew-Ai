'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo + Breadcrumb */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Mew
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 font-medium">Recherche d'emploi</span>
            </div>

            {/* User info + Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            💼 Recherche d'emploi
          </h2>
          <p className="text-gray-600">
            Optimisez votre profil et trouvez le job parfait avec nos outils IA
          </p>
        </div>

        {/* Solutions Grid - 4 cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Solution 1 : Analyseur de CV */}
          <Link href="/solutions/analyse-cv" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 h-full">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Analyseur de CV
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Analyse ton CV et te propose des métiers adaptés à ton profil
              </p>
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Analyse intelligente
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Upload PDF
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Note marché
                </div>
              </div>
              <div className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                Utiliser
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Solution 2 : Optimiseur de CV */}
          <Link href="/solutions/optimiseur-cv" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-400 h-full">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Optimiseur de CV
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Crée des CV professionnels avec des templates modernes
              </p>
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  3 templates
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  PDF + DOCX
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Design pro
                </div>
              </div>
              <div className="text-green-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                Utiliser
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Solution 3 : Portfolio Professionnel */}
          <div className="group opacity-60 cursor-not-allowed">
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Portfolio Pro
              </h3>
              <p className="text-gray-500 mb-4 text-sm">
                Site web professionnel avec CV, projets et réalisations
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">○</span>
                  URL unique
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">○</span>
                  Templates
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">○</span>
                  QR Code
                </div>
              </div>
              <div className="inline-block px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold">
                Bientôt disponible
              </div>
            </div>
          </div>

          {/* Solution 4 : Matcher Offre */}
          <div className="group opacity-60 cursor-not-allowed">
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 h-full">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Matcher Offre
              </h3>
              <p className="text-gray-500 mb-4 text-sm">
                Adapte ton CV automatiquement à chaque offre d'emploi
              </p>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">○</span>
                  Analyse offre
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">○</span>
                  CV adapté
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">○</span>
                  Lettre motive
                </div>
              </div>
              <div className="inline-block px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold">
                Bientôt disponible
              </div>
            </div>
          </div>

        </div>

        {/* Limites d'usage */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="text-3xl mr-4">ℹ️</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Utilisation gratuite</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Analyses illimitées</p>
                <p>• Taille max des fichiers : 2 Mo</p>
                <p>• Accès aux 4 solutions de recherche d'emploi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation vers autres univers */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Découvrez nos autres univers</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center opacity-60">
              <span className="text-3xl mr-3">💰</span>
              <div>
                <div className="font-medium text-gray-700">Fiscalité & Comptabilité</div>
                <div className="text-xs text-gray-500">Bientôt disponible</div>
              </div>
            </div>
            <div className="flex items-center opacity-60">
              <span className="text-3xl mr-3">📢</span>
              <div>
                <div className="font-medium text-gray-700">Marketing & Communication</div>
                <div className="text-xs text-gray-500">Bientôt disponible</div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}