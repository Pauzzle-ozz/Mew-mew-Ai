'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'

const CATEGORIES = [
  { id: 'emploi', label: "Recherche d'emploi", emoji: '💼' },
  { id: 'marketing', label: 'Marketing & Com', emoji: '📢' },
  { id: 'fiscalite', label: 'Fiscalite', emoji: '🏛️' },
  { id: 'finance', label: 'Finance', emoji: '💰' }
]

/* ── Solution card helper ── */
function SolutionCard({ href, emoji, title, description, features, disabled }) {
  const content = (
    <div className={`bg-surface rounded-xl p-6 transition-all duration-300 border h-full ${
      disabled ? 'border-border/50 opacity-50' : 'border-border hover:border-primary'
    }`}>
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <span className="text-3xl">{emoji}</span>
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-text-muted mb-4 text-sm">{description}</p>
      <div className="space-y-2 text-sm text-text-secondary mb-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-center">
            <span className={disabled ? 'mr-2 text-text-muted' : 'text-primary mr-2'}>{disabled ? '○' : '✓'}</span>
            {f}
          </div>
        ))}
      </div>
      {disabled ? (
        <div className="inline-block px-3 py-1.5 bg-surface-elevated text-text-muted rounded-lg text-xs font-semibold">
          Bientot disponible
        </div>
      ) : (
        <div className="text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
          Utiliser
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  )

  if (disabled) return <div className="cursor-not-allowed">{content}</div>
  return <Link href={href} className="group">{content}</Link>
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Logo size="md" link={false} />
        <p className="text-text-muted">Chargement...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  const validTabs = ['emploi', 'marketing', 'fiscalite', 'finance']
  const paramTab = searchParams.get('tab')
  const initialTab = validTabs.includes(paramTab) ? paramTab : 'emploi'
  const [category, setCategory] = useState(initialTab)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (validTabs.includes(tab)) {
      setCategory(tab)
    }
  }, [searchParams])

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

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    router.replace(`/dashboard?tab=${cat}`, { scroll: false })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Logo size="md" link={false} />
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
        breadcrumbs={[{ label: CATEGORIES.find(c => c.id === category)?.label || category }]}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category Tabs */}
        <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 w-fit mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                category === cat.id
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {category === 'emploi' ? "Recherche d'emploi" :
             category === 'marketing' ? 'Marketing & Communication' :
             category === 'fiscalite' ? 'Fiscalite & Comptabilite' :
             'Finance & Investissement'}
          </h2>
          <p className="text-text-secondary">
            {category === 'emploi'
              ? 'Optimisez votre profil et trouvez le job parfait avec nos outils IA'
              : category === 'marketing'
              ? 'Creez du contenu, planifiez votre strategie et analysez votre marche'
              : category === 'fiscalite'
              ? 'Auditez votre fiscalite, preparez vos declarations et optimisez votre strategie'
              : 'Analysez les marches, evaluez vos investissements et optimisez votre trading'
            }
          </p>
        </div>

        {/* ═══ EMPLOI ═══ */}
        {category === 'emploi' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <SolutionCard
                href="/solutions/analyse-cv"
                emoji="📄"
                title="Analyseur de CV"
                description="Analyse ton CV et te propose des metiers adaptes a ton profil"
                features={['Analyse intelligente', 'Upload PDF', 'Note marche']}
              />
              <SolutionCard
                href="/solutions/optimiseur-cv"
                emoji="✨"
                title="Optimiseur de CV"
                description="Cree des CV professionnels avec des templates modernes"
                features={['6 templates', 'Export PDF', 'Design pro']}
              />
              <SolutionCard
                href="/solutions/portfolio"
                emoji="🌐"
                title="Portfolio Pro"
                description="Cree ton site web personnel avec videos, images et textes"
                features={['URL unique', 'Blocs personnalisables', 'Images & Videos']}
              />
              <SolutionCard
                href="/solutions/matcher-offres"
                emoji="🎯"
                title={"Matcher d'Offres"}
                description="Genere 3 documents pour chaque offre : CV perso, CV ideal, lettre"
                features={['Analyse IA', '3 documents PDF', 'Matching optimise']}
              />
              <SolutionCard
                href="/solutions/candidature-spontanee"
                emoji="📧"
                title="Candidature Spontanee"
                description="L'IA redige et envoie un email percutant avec ton CV en piece jointe"
                features={['Email automatique', 'CV en piece jointe', 'Relance J+8']}
              />
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
                    <p>&#8226; Acces aux 5 solutions de recherche d&apos;emploi</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ MARKETING ═══ */}
        {category === 'marketing' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <SolutionCard
                href="/solutions/marketing/redacteur"
                emoji="✍️"
                title="Redacteur Multi-Format"
                description="Un brief, du contenu adapte a 6 plateformes differentes"
                features={['6 formats', 'Ton personnalise', 'Pret a publier']}
              />
              <SolutionCard
                href="/solutions/marketing/strategie"
                emoji="📅"
                title="Strategie de Contenu"
                description="Generez un calendrier editorial sur 30 jours par l'IA"
                features={['Calendrier 30j', 'Multi-canaux', 'Hashtags & horaires']}
              />
              <SolutionCard
                href="/solutions/marketing/veille"
                emoji="📡"
                title="Veille Sectorielle"
                description="Identifiez les sources media et tendances de votre secteur"
                features={['Sources media', 'Analyse tendances', 'Idees contenu']}
              />
              <SolutionCard
                href="/solutions/marketing/concurrence"
                emoji="🔎"
                title="Analyseur Concurrence"
                description="Analysez le positionnement et la strategie de vos concurrents"
                features={['Scraping URL', 'Benchmark', 'Opportunites']}
              />
              <SolutionCard
                href="/solutions/marketing/performance"
                emoji="📊"
                title="Analyseur Performance"
                description="Diagnostiquez vos stats et obtenez des recommandations IA"
                features={['Diagnostic', 'Patterns', 'Predictions']}
              />
              <SolutionCard
                href="/solutions/marketing/seo"
                emoji="🔍"
                title="Audit SEO"
                description="Analysez le SEO de votre site et obtenez des recommandations"
                features={['Crawl automatique', 'Score par page', 'Quick wins']}
              />
              <SolutionCard
                href="/solutions/marketing/createur"
                emoji="🎨"
                title="Createur de Contenu"
                description="Creez du contenu optimise pour 9 plateformes avec images IA"
                features={['9 plateformes', 'Images DALL-E', 'Historique creations']}
              />
            </div>

            {/* Info box */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-start">
                <div className="text-3xl mr-4">&#8505;&#65039;</div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Marketing & Communication</h4>
                  <div className="text-sm text-text-secondary space-y-1">
                    <p>&#8226; 7 outils disponibles</p>
                    <p>&#8226; Contenu, strategie, veille, concurrence, performance et SEO</p>
                    <p>&#8226; Scraping et analyse IA en temps reel</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ FISCALITE ═══ */}
        {category === 'fiscalite' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <SolutionCard
                href="/solutions/fiscalite/audit"
                emoji="🔍"
                title="Audit Fiscal"
                description="Analysez votre conformite fiscale et identifiez les optimisations"
                features={['Score conformite', 'Optimisations chiffrees', 'References legales']}
              />
              <SolutionCard
                href="/solutions/fiscalite/assistant"
                emoji="📋"
                title="Assistant Fiscal"
                description="Preparez vos declarations, calendrier fiscal et controles"
                features={['Declarations pre-remplies', 'Calendrier personnalise', 'Preparation controle']}
              />
              <SolutionCard
                href="/solutions/fiscalite/simulateur"
                emoji="🧮"
                title="Simulateur Strategie"
                description="Comparez les regimes fiscaux et optimisez votre remuneration"
                features={['Comparaison statuts', 'Mix salaire/dividendes', 'Projections 5 ans']}
              />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-start">
                <div className="text-3xl mr-4">&#8505;&#65039;</div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Fiscalite & Comptabilite</h4>
                  <div className="text-sm text-text-secondary space-y-1">
                    <p>&#8226; 3 outils d&apos;analyse et simulation fiscale</p>
                    <p>&#8226; Support PDF, Excel, CSV et Google Sheets</p>
                    <p>&#8226; References au Code General des Impots</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ FINANCE ═══ */}
        {category === 'finance' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <SolutionCard
                href="/solutions/finance/fondamentale"
                emoji="📈"
                title="Analyse Fondamentale"
                description="Evaluez la sante financiere d&apos;une entreprise ou actif"
                features={['Ratios financiers', 'Analyse SWOT', 'Verdict d\'investissement']}
              />
              <SolutionCard
                href="/solutions/finance/technique"
                emoji="📉"
                title="Analyse Technique"
                description="Analysez les graphiques et indicateurs de marche"
                features={['RSI, MACD, Bollinger', 'Supports & resistances', '3 horizons temporels']}
              />
              <SolutionCard
                href="/solutions/finance/trading"
                emoji="🤖"
                title="Bot Trading"
                description="Recommandations de trading combinees fondamentale + technique"
                features={['Analyse complete', 'Gestion du risque', 'Analyse portefeuille']}
              />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-start">
                <div className="text-3xl mr-4">&#8505;&#65039;</div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Finance & Investissement</h4>
                  <div className="text-sm text-text-secondary space-y-1">
                    <p>&#8226; Donnees de marche via Yahoo Finance</p>
                    <p>&#8226; Actions, cryptos et ETF supportes</p>
                    <p>&#8226; Ceci n&apos;est pas un conseil en investissement</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Other universes */}
        <div className="mt-8 bg-surface rounded-xl p-6 border border-border">
          <h4 className="font-semibold text-text-primary mb-3">Decouvrez nos autres univers</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.filter(c => c.id !== category).map(cat => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className="flex items-center cursor-pointer hover:bg-surface-elevated rounded-lg p-1 -m-1 transition-colors">
                <span className="text-3xl mr-3">{cat.emoji}</span>
                <div className="text-left">
                  <div className="font-medium text-primary">{cat.label}</div>
                  <div className="text-xs text-text-muted">
                    {cat.id === 'emploi' ? '5 outils' : cat.id === 'marketing' ? '7 outils' : cat.id === 'fiscalite' ? '3 outils' : '3 outils'} disponibles
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
