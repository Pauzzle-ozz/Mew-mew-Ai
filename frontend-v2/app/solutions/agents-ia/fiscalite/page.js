'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/shared/Header'
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation'
import ChatMessage from '@/components/agents-ia/ChatMessage'
import ChatInput from '@/components/agents-ia/ChatInput'
import SessionList from '@/components/agents-ia/SessionList'
import * as agentsApi from '@/lib/api/agentsApi'

const SUGGESTIONS = [
  { text: 'Quel statut juridique choisir pour mon activite ?', emoji: '🏢' },
  { text: 'Calculer mon impot sur le revenu 2025', emoji: '🧮' },
  { text: 'Quelles charges puis-je deduire en auto-entrepreneur ?', emoji: '📝' },
  { text: 'Comparer SASU vs EURL pour un freelance', emoji: '⚖️' }
]

export default function AgentFiscalitePage() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  // Sessions
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [activeSessionId, setActiveSessionId] = useState(null)

  // Messages
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sidebar mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const messagesEndRef = useRef(null)

  // Auth check
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
        setAuthLoading(false)
      }
    }
    checkUser()
  }, [router])

  // Charger les sessions
  const loadSessions = useCallback(async () => {
    if (!user) return
    try {
      setSessionsLoading(true)
      const data = await agentsApi.getAgentSessions(user.id)
      setSessions(data)
    } catch (err) {
      console.error('Erreur chargement sessions:', err)
    } finally {
      setSessionsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // Charger les messages quand on change de session
  useEffect(() => {
    if (!activeSessionId || !user) {
      setMessages([])
      return
    }

    const loadMessages = async () => {
      try {
        const data = await agentsApi.getSessionMessages(activeSessionId, user.id)
        setMessages(data)
      } catch (err) {
        console.error('Erreur chargement messages:', err)
        setError('Impossible de charger les messages')
      }
    }
    loadMessages()
  }, [activeSessionId, user])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Envoyer un message
  const handleSend = async (text, file) => {
    if (loading) return
    setError('')
    setLoading(true)

    // Optimistic UI : ajouter le message user immediatement
    const tempUserMessage = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: text,
      metadata: file ? { filename: file.name } : {},
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const result = await agentsApi.sendAgentMessage(
        user.id,
        activeSessionId,
        text,
        file
      )

      // Si nouvelle session creee
      if (!activeSessionId) {
        setActiveSessionId(result.sessionId)
      }

      // Remplacer le message temporaire + ajouter la reponse
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMessage.id)
        return [
          ...withoutTemp,
          { ...tempUserMessage, id: 'user-' + result.messageId },
          {
            id: result.messageId,
            role: 'assistant',
            content: result.message,
            metadata: {},
            created_at: result.createdAt
          }
        ]
      })

      // Rafraichir la liste des sessions (titre mis a jour)
      loadSessions()

    } catch (err) {
      console.error('Erreur envoi message:', err)
      setError(err.message || 'Erreur lors de l\'envoi du message')
      // Retirer le message temporaire
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
    } finally {
      setLoading(false)
    }
  }

  // Nouvelle conversation
  const handleNewSession = () => {
    setActiveSessionId(null)
    setMessages([])
    setError('')
    setSidebarOpen(false)
  }

  // Selectionner une session
  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId)
    setError('')
    setSidebarOpen(false)
  }

  // Supprimer une session
  const handleDeleteSession = async (sessionId) => {
    try {
      await agentsApi.deleteAgentSession(sessionId, user.id)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (activeSessionId === sessionId) {
        setActiveSessionId(null)
        setMessages([])
      }
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }

  // Cliquer sur une suggestion
  const handleSuggestion = (text) => {
    handleSend(text, null)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-text-muted">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Agents IA', href: '/dashboard?tab=agents-ia' },
          { label: 'Agent Fiscalite' }
        ]}
      />

      {/* Bouton sidebar mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-20 left-4 z-30 p-3 bg-primary text-white rounded-full shadow-lg cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'fixed inset-0 z-20 md:relative md:inset-auto' : 'hidden md:block'}`}>
          {/* Overlay mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className={`${sidebarOpen ? 'relative z-30' : ''} h-full`}>
            <SessionList
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              loading={sessionsLoading}
            />
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <div className="max-w-3xl mx-auto">
              {/* Ecran de bienvenue */}
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Agent Fiscalite</h2>
                  <p className="text-text-secondary text-center max-w-md mb-8">
                    Expert-comptable et fiscaliste IA. Posez vos questions sur les impots,
                    la TVA, les statuts juridiques, ou uploadez un document a analyser.
                  </p>

                  {/* Suggestions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s.text)}
                        className="flex items-start gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left cursor-pointer group"
                      >
                        <span className="text-xl">{s.emoji}</span>
                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                          {s.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages de la conversation */}
              {messages.map(m => (
                <ChatMessage key={m.id} message={m} />
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm">🏛️</span>
                    </div>
                    <CatLoadingAnimation label="L'agent reflechit..." />
                  </div>
                </div>
              )}

              {/* Erreur */}
              {error && (
                <div className="flex justify-center mb-4">
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6">
            <ChatInput onSend={handleSend} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
