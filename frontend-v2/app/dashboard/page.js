'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/shared/Header'
import Logo from '@/components/shared/Logo'

const CATEGORIES = [
  { id: 'emploi', label: 'Emploi', icon: BriefcaseIcon },
  { id: 'marketing', label: 'Marketing', icon: MegaphoneIcon },
  { id: 'fiscalite', label: 'Fiscalite', icon: BuildingIcon },
  { id: 'finance', label: 'Finance', icon: ChartIcon },
  { id: 'agents-ia', label: 'Agents IA', icon: SparklesIcon },
]

const SOLUTIONS = {
  emploi: [
    { href: '/solutions/analyse-cv', title: 'Analyseur de CV', desc: 'Analysez votre CV et decouvrez les metiers qui vous correspondent', tags: ['PDF', 'Formulaire', 'IA'], icon: DocIcon },
    { href: '/solutions/optimiseur-cv', title: 'Optimiseur de CV', desc: 'Optimisez votre CV pour les ATS et generez des versions pro', tags: ['Score ATS', 'Export PDF'], icon: SparkleIcon },
    { href: '/solutions/portfolio', title: 'Portfolio Pro', desc: 'Creez votre site web personnel avec medias et lien partageable', tags: ['URL unique', 'Medias', 'QR Code'], icon: GlobeIcon },
    { href: '/solutions/matcher-offres', title: "Matcher d'Offres", desc: 'Generez CV personnalise, CV ideal et lettre pour chaque offre', tags: ['3 documents', 'PDF'], icon: TargetIcon },
    { href: '/solutions/candidature-spontanee', title: 'Candidature Spontanee', desc: "L'IA redige et prepare un email percutant avec votre CV", tags: ['Email', 'CV joint'], icon: MailIcon },
  ],
  marketing: [
    { href: '/solutions/marketing/strategie', title: 'Strategie de Contenu', desc: 'Generez un calendrier editorial sur 30 jours', tags: ['30 jours', 'Multi-canaux'], icon: CalendarIcon },
    { href: '/solutions/marketing/veille', title: 'Veille Sectorielle', desc: 'Identifiez les sources et tendances de votre secteur', tags: ['Sources', 'Tendances'], icon: RadarIcon },
    { href: '/solutions/marketing/concurrence', title: 'Analyseur Concurrence', desc: 'Analysez le positionnement de vos concurrents', tags: ['Benchmark', 'Scraping'], icon: SearchIcon },
    { href: '/solutions/marketing/seo', title: 'Audit SEO', desc: 'Analysez le SEO de votre site et obtenez des quick wins', tags: ['Score', 'Recommandations'], icon: SearchIcon },
  ],
  fiscalite: [
    { href: '/solutions/fiscalite/audit', title: 'Audit Fiscal', desc: 'Analysez votre conformite et identifiez les optimisations', tags: ['Score', 'References legales'], icon: ShieldIcon },
    { href: '/solutions/fiscalite/assistant', title: 'Assistant Fiscal', desc: 'Declarations, calendrier fiscal et preparation controle', tags: ['Declarations', 'Calendrier'], icon: ClipboardIcon },
    { href: '/solutions/fiscalite/simulateur', title: 'Simulateur Strategie', desc: 'Comparez les regimes fiscaux et optimisez votre remuneration', tags: ['Comparaison', 'Projections'], icon: CalculatorIcon },
  ],
  finance: [
    { href: '/solutions/finance/fondamentale', title: 'Analyse Fondamentale', desc: "Evaluez la sante financiere d'une entreprise ou actif", tags: ['Ratios', 'SWOT'], icon: ChartBarIcon },
    { href: '/solutions/finance/technique', title: 'Analyse Technique', desc: 'Analysez les graphiques et indicateurs de marche', tags: ['RSI', 'MACD', 'Bollinger'], icon: ChartLineIcon },
    { href: '/solutions/finance/trading', title: 'Bot Trading', desc: 'Recommandations combinees fondamentale + technique', tags: ['Signaux', 'Risque'], icon: BotIcon },
  ],
  'agents-ia': [
    { href: '/solutions/agents-ia/fiscalite', title: 'Agent Fiscalite', desc: 'Votre expert-comptable IA : questions, documents, simulations', tags: ['Chat', 'Documents', 'Calculs'], icon: SparklesIcon },
    { href: '#', title: 'Agent Marketing', desc: 'Consultant strategie marketing expert (bientot)', tags: ['Bientot'], icon: MegaphoneIcon, disabled: true },
    { href: '#', title: 'Agent Finance', desc: 'Analyste financier IA multi-marches (bientot)', tags: ['Bientot'], icon: ChartIcon, disabled: true },
  ],
}

const CAT_META = {
  emploi: { title: "Recherche d'emploi", desc: 'Optimisez votre profil et trouvez le job parfait', gradient: 'from-orange-500/8 to-amber-500/4' },
  marketing: { title: 'Marketing & Communication', desc: 'Creez du contenu, planifiez et analysez votre marche', gradient: 'from-emerald-500/8 to-teal-500/4' },
  fiscalite: { title: 'Fiscalite & Comptabilite', desc: 'Auditez, simulez et optimisez votre fiscalite', gradient: 'from-violet-500/8 to-purple-500/4' },
  finance: { title: 'Finance & Investissement', desc: 'Analysez les marches et optimisez vos investissements', gradient: 'from-blue-500/8 to-sky-500/4' },
  'agents-ia': { title: 'Agents IA', desc: 'Des experts autonomes, prets a travailler pour vous', gradient: 'from-rose-500/8 to-pink-500/4' },
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DashboardContent />
    </Suspense>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Logo size="md" link={false} />
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function DashboardContent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  const validTabs = ['emploi', 'marketing', 'fiscalite', 'finance', 'agents-ia']
  const paramTab = searchParams.get('tab')
  const initialTab = validTabs.includes(paramTab) ? paramTab : 'emploi'
  const [category, setCategory] = useState(initialTab)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else { setUser(user); setLoading(false) }
    }
    check()
  }, [router])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (validTabs.includes(tab)) setCategory(tab)
  }, [searchParams])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    router.replace(`/dashboard?tab=${cat}`, { scroll: false })
  }

  if (loading) return <LoadingScreen />

  const meta = CAT_META[category]
  const solutions = SOLUTIONS[category] || []

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: meta.title }]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const active = category === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Category header */}
        <div className={`rounded-2xl bg-gradient-to-r ${meta.gradient} p-8 mb-8 animate-fade-in`}>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">{meta.title}</h1>
          <p className="text-text-secondary">{meta.desc}</p>
        </div>

        {/* Solution cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solutions.map((sol, i) => (
            <SolutionCard key={sol.href + sol.title} sol={sol} index={i} />
          ))}
        </div>

        {/* Other categories */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="font-display text-lg font-bold text-text-primary mb-4">Autres univers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.filter(c => c.id !== category).map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-elevated transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-text-primary">{cat.label}</div>
                    <div className="text-xs text-text-muted">
                      {(SOLUTIONS[cat.id] || []).length} outil{(SOLUTIONS[cat.id] || []).length > 1 ? 's' : ''}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

/* ── Solution Card ── */
function SolutionCard({ sol, index }) {
  const Icon = sol.icon
  const content = (
    <div className={`group relative rounded-2xl p-6 bg-surface border border-border/60 h-full transition-all duration-300 ${
      sol.disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5'
    } animate-fade-in-up`} style={{ animationDelay: `${index * 80}ms` }}>
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-primary" />
      </div>

      {/* Content */}
      <h3 className="font-display text-lg font-bold text-text-primary mb-1.5 group-hover:text-primary transition-colors">
        {sol.title}
      </h3>
      <p className="text-sm text-text-muted mb-4 leading-relaxed">{sol.desc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {sol.tags.map(tag => (
          <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            tag === 'Bientot' ? 'bg-warning/10 text-warning' : 'bg-surface-elevated text-text-secondary'
          }`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Action */}
      {sol.disabled ? (
        <span className="text-xs text-text-muted font-medium">Bientot disponible</span>
      ) : (
        <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Utiliser
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      )}
    </div>
  )

  if (sol.disabled) return <div>{content}</div>
  return <Link href={sol.href}>{content}</Link>
}

/* ── Icons ── */
function BriefcaseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}

function MegaphoneIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
    </svg>
  )
}

function BuildingIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  )
}

function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  )
}

function SparklesIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  )
}

function DocIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function SparkleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  )
}

function GlobeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  )
}

function TargetIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function MailIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function RadarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function ClipboardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  )
}

function CalculatorIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
    </svg>
  )
}

function ChartBarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}

function ChartLineIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v-5.5m0 0L12 3m-3 2.75L9.5 3" />
    </svg>
  )
}

function BotIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  )
}
