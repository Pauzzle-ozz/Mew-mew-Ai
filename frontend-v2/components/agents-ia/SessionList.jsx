'use client'

import { useState } from 'react'

/**
 * Sidebar listant les sessions de conversation de l'agent
 */
export default function SessionList({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  loading
}) {
  const [menuOpen, setMenuOpen] = useState(null)

  return (
    <div className="w-72 border-r border-border h-full flex flex-col bg-surface-elevated shrink-0">
      {/* Header sidebar */}
      <div className="p-4 border-b border-border">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle conversation
        </button>
      </div>

      {/* Liste des sessions */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-text-muted text-sm">Chargement...</div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-text-muted text-sm">
            Aucune conversation
          </div>
        ) : (
          <div className="py-2">
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => { onSelectSession(session.id); setMenuOpen(null) }}
                className={`group flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors relative ${
                  session.id === activeSessionId
                    ? 'bg-primary/10 border-r-2 border-primary'
                    : 'hover:bg-surface'
                }`}
              >
                {/* Icone chat */}
                <svg className={`w-4 h-4 shrink-0 ${
                  session.id === activeSessionId ? 'text-primary' : 'text-text-muted'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>

                {/* Titre + date */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${
                    session.id === activeSessionId ? 'text-primary font-medium' : 'text-text-primary'
                  }`}>
                    {session.title}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {formatRelativeDate(session.updated_at)}
                  </p>
                </div>

                {/* Menu contextuel */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(menuOpen === session.id ? null : session.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-elevated transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {menuOpen === session.id && (
                  <div className="absolute right-2 top-full z-10 bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteSession(session.id)
                        setMenuOpen(null)
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 cursor-pointer flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatRelativeDate(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "A l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
