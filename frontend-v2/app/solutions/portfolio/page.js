'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { portfolioApi } from '@/lib/api/portfolioApi'
import { supabase } from '@/lib/supabase'
import Header from '@/components/shared/Header'

export default function PortfolioListPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [portfolios, setPortfolios] = useState([])
  const [loadingPortfolios, setLoadingPortfolios] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  // Charger les portfolios
  useEffect(() => {
    if (user) {
      loadPortfolios()
    }
  }, [user])

  const loadPortfolios = async () => {
    try {
      setLoadingPortfolios(true)
      const result = await portfolioApi.getUserPortfolios(user.id)
      setPortfolios(result.data || [])
    } catch (err) {
      console.error('Erreur chargement portfolios:', err)
      setError('Impossible de charger les portfolios')
    } finally {
      setLoadingPortfolios(false)
    }
  }

  // Créer un nouveau portfolio
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      setCreating(true)
      setError(null)
      const result = await portfolioApi.createPortfolio(user.id, newTitle, newDescription)

      // Rediriger vers l'éditeur
      window.location.href = `/solutions/portfolio/${result.data.id}/edit`
    } catch (err) {
      console.error('Erreur création:', err)
      setError(err.message)
      setCreating(false)
    }
  }

  // Supprimer un portfolio
  const handleDelete = async (portfolioId) => {
    if (!confirm('Supprimer ce portfolio ? Cette action est irréversible.')) return

    try {
      await portfolioApi.deletePortfolio(portfolioId, user.id)
      setPortfolios(portfolios.filter(p => p.id !== portfolioId))
    } catch (err) {
      console.error('Erreur suppression:', err)
      setError('Impossible de supprimer le portfolio')
    }
  }

  // Publier / Dépublier
  const handleTogglePublish = async (portfolio) => {
    try {
      await portfolioApi.togglePublish(portfolio.id, user.id, !portfolio.published)
      setPortfolios(portfolios.map(p =>
        p.id === portfolio.id ? { ...p, published: !p.published } : p
      ))
    } catch (err) {
      console.error('Erreur publication:', err)
      setError('Impossible de modifier la publication')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
        breadcrumbs={[
          { label: 'Emploi', href: '/dashboard' },
          { label: 'Portfolio Pro' }
        ]}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Titre + Bouton créer */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Mes Portfolios</h1>
            <p className="text-text-muted mt-1">Créez et gérez vos sites web personnels</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary text-gray-900 rounded-lg font-semibold hover:bg-primary-hover shadow-lg shadow-black/20"
          >
            + Nouveau Portfolio
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-4 text-error">✕</button>
          </div>
        )}

        {/* Liste des portfolios */}
        {loadingPortfolios ? (
          <div className="text-center py-12">
            <p className="text-text-muted">Chargement des portfolios...</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-xl border border-border">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Aucun portfolio</h3>
            <p className="text-text-muted mb-6">Créez votre premier site web personnel !</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-gray-900 rounded-lg font-semibold hover:bg-primary-hover"
            >
              Créer mon premier portfolio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-surface rounded-xl border border-border overflow-hidden hover:border-border-light transition-all">

                {/* Preview placeholder */}
                <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-6xl">🌐</span>
                </div>

                {/* Infos */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-text-primary truncate">{portfolio.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      portfolio.published
                        ? 'bg-success/10 text-success'
                        : 'bg-surface-elevated text-text-muted'
                    }`}>
                      {portfolio.published ? '🟢 En ligne' : '⚪ Brouillon'}
                    </span>
                  </div>

  {/* Affichage des vues et date */}
  <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
    <span className="flex items-center gap-1">
      👁️ {portfolio.views_count || 0} {(portfolio.views_count || 0) > 1 ? 'vues' : 'vue'}
    </span>
    <span className="flex items-center gap-1">
      📅 {new Date(portfolio.created_at).toLocaleDateString('fr-FR')}
    </span>
  </div>

                  {portfolio.description && (
                    <p className="text-text-muted text-sm mb-3 line-clamp-2">{portfolio.description}</p>
                  )}

                  {/* URL */}
                  {portfolio.published && (
                    <div className="mb-3 p-2 bg-background rounded text-sm">
                      <span className="text-text-muted">🔗 </span>
                      <a
                        href={`/p/${portfolio.slug}`}
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        mew.app/p/{portfolio.slug}
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/solutions/portfolio/${portfolio.id}/edit`}
                      className="flex-1 px-3 py-2 bg-primary text-gray-900 text-center rounded-lg text-sm font-medium hover:bg-primary-hover"
                    >
                      ✏️ Éditer
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(portfolio)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        portfolio.published
                          ? 'bg-warning/10 text-warning hover:bg-warning/20'
                          : 'bg-success/10 text-success hover:bg-success/20'
                      }`}
                    >
                      {portfolio.published ? '📤' : '🚀'}
                    </button>
                    <button
                      onClick={() => handleDelete(portfolio.id)}
                      className="px-3 py-2 bg-error/10 text-error rounded-lg text-sm font-medium hover:bg-error/20"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-elevated rounded-xl shadow-xl shadow-black/30 max-w-md w-full mx-4 p-6 border border-border">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Nouveau Portfolio</h2>

            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Titre du portfolio *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Portfolio de Jean Dupont"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary placeholder:text-text-muted"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Une courte description de votre portfolio..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary placeholder:text-text-muted"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-border text-text-secondary rounded-lg font-medium hover:bg-surface"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="flex-1 px-4 py-3 bg-primary text-gray-900 rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50"
                >
                  {creating ? '⏳ Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
