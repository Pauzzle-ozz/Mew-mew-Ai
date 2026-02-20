'use client'

import { useState, useEffect } from 'react'
import { getCreationHistory, deleteCreation, updateCreation } from '@/lib/api/marketingApi'
import { CONTENT_TYPES } from './ContentTypeSelector'

const STATUS_LABELS = {
  draft: { label: 'Brouillon', color: 'bg-yellow-500/10 text-yellow-400' },
  published: { label: 'Publie', color: 'bg-green-500/10 text-green-400' },
  archived: { label: 'Archive', color: 'bg-gray-500/10 text-gray-400' }
}

const PLATFORM_EMOJIS = {
  linkedin: '💼', instagram: '📸', twitter: '🐦', tiktok: '🎵',
  youtube: '▶️', facebook: '👥', blog: '📝', newsletter: '📧', video_script: '🎬'
}

export default function CreationHistory({ userId, onLoad, onClose }) {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (userId) loadCreations()
  }, [userId, filterType, filterStatus])

  const loadCreations = async () => {
    setLoading(true)
    try {
      const data = await getCreationHistory(userId, {
        contentType: filterType || undefined,
        status: filterStatus || undefined,
        limit: 50
      })
      setCreations(data || [])
    } catch (err) {
      console.error('Erreur chargement historique:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette creation ?')) return
    try {
      await deleteCreation(id, userId)
      setCreations(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCreation(id, userId, { status: newStatus })
      setCreations(prev => prev.map(c =>
        c.id === id ? { ...c, status: newStatus } : c
      ))
    } catch (err) {
      console.error('Erreur mise a jour:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Mes creations</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-text-muted hover:text-text-primary cursor-pointer transition-colors"
          >
            &#10005;
          </button>
        </div>

        {/* Filtres */}
        <div className="flex gap-3 p-4 border-b border-border">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-sm bg-surface border border-border rounded-lg text-text-primary"
          >
            <option value="">Tous les types</option>
            {CONTENT_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-sm bg-surface border border-border rounded-lg text-text-primary"
          >
            <option value="">Tous les status</option>
            <option value="draft">Brouillon</option>
            <option value="published">Publie</option>
            <option value="archived">Archive</option>
          </select>
        </div>

        {/* Liste */}
        <div className="overflow-y-auto flex-1 p-4">
          {loading ? (
            <div className="text-center py-8 text-text-muted">Chargement...</div>
          ) : creations.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              Aucune creation trouvee
            </div>
          ) : (
            <div className="space-y-3">
              {creations.map(creation => {
                const typeInfo = CONTENT_TYPES.find(t => t.id === creation.content_type)
                const statusInfo = STATUS_LABELS[creation.status] || STATUS_LABELS.draft
                const platforms = creation.platforms || []

                return (
                  <div key={creation.id} className="bg-surface rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{typeInfo?.emoji || '📄'}</span>
                          <h3 className="text-sm font-semibold text-text-primary truncate">
                            {creation.title || 'Sans titre'}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-text-muted">
                            {typeInfo?.name || creation.content_type}
                          </span>
                          <span className="text-xs text-text-muted">
                            {new Date(creation.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {platforms.map(p => (
                            <span key={p} className="text-sm" title={p}>
                              {PLATFORM_EMOJIS[p] || '📄'}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {onLoad && (
                          <button
                            onClick={() => onLoad(creation)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                          >
                            Voir
                          </button>
                        )}
                        <select
                          value={creation.status}
                          onChange={e => handleStatusChange(creation.id, e.target.value)}
                          className="px-2 py-1 text-xs bg-surface-elevated border border-border rounded-lg text-text-secondary"
                        >
                          <option value="draft">Brouillon</option>
                          <option value="published">Publie</option>
                          <option value="archived">Archive</option>
                        </select>
                        <button
                          onClick={() => handleDelete(creation.id)}
                          className="px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                        >
                          &#128465;
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border text-center">
          <p className="text-xs text-text-muted">{creations.length} creation{creations.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  )
}
