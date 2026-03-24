'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'

const UNIVERSES = [
  {
    id: 'emploi', tab: 'emploi', title: "Recherche d'emploi",
    desc: 'CV, portfolio professionnel et matching d\'offres.',
    tools: ['Analyseur CV', 'Optimiseur CV', 'Portfolio', 'Matcher', 'Candidature'],
    gradient: 'from-orange-500/10 to-amber-500/5',
  },
  {
    id: 'marketing', tab: 'marketing', title: 'Marketing & Communication',
    desc: 'Contenu, strategie, veille sectorielle et concurrence.',
    tools: ['Strategie 30j', 'Veille', 'Concurrence', 'SEO'],
    gradient: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    id: 'fiscalite', tab: 'fiscalite', title: 'Fiscalite & Comptabilite',
    desc: 'Audit fiscal, declarations et simulation de strategie.',
    tools: ['Audit fiscal', 'Assistant', 'Simulateur'],
    gradient: 'from-violet-500/10 to-purple-500/5',
  },
  {
    id: 'finance', tab: 'finance', title: 'Finance & Investissement',
    desc: 'Analyse fondamentale, technique et trading.',
    tools: ['Fondamentale', 'Technique', 'Bot trading'],
    gradient: 'from-blue-500/10 to-sky-500/5',
  },
  {
    id: 'agents', tab: 'agents-ia', title: 'Agents IA',
    desc: 'Des agents autonomes experts a votre service.',
    tools: ['Agent Fiscalite'],
    gradient: 'from-rose-500/10 to-pink-500/5',
  },
]

export default function SolutionsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/login')
      else { setUser(session.user); setLoading(false) }
    }
    check()
  }, [router])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Logo size="md" link={false} />
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} breadcrumbs={[{ label: 'Solutions' }]} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Choisissez votre univers</h1>
          <p className="text-text-secondary">Selectionnez un domaine pour acceder aux outils correspondants.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {UNIVERSES.map((u, i) => (
            <Link key={u.id} href={`/dashboard?tab=${u.tab}`} className="group">
              <div className={`bg-gradient-to-br ${u.gradient} rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
                <h2 className="font-display text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {u.title}
                </h2>
                <p className="text-sm text-text-secondary mb-4">{u.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {u.tools.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-surface/80 text-xs text-text-secondary font-medium">{t}</span>
                  ))}
                </div>
                <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ouvrir
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
