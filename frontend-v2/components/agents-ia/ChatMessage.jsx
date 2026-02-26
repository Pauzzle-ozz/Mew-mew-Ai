'use client'

/**
 * Bulle de message dans le chat agent
 * Gere l'affichage user (droite) et assistant (gauche)
 * Formate le markdown basique (gras, listes, titres, code)
 */
export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  // Formater le contenu (supprimer le texte du document joint pour l'affichage)
  const displayContent = isUser
    ? message.content.split('\n\n[DOCUMENT JOINT')[0]
    : message.content

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Avatar assistant */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1 shrink-0">
          <span className="text-sm">🏛️</span>
        </div>
      )}

      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-primary text-white'
          : 'bg-surface border border-border text-text-primary'
      }`}>
        {/* Badge fichier joint */}
        {isUser && message.metadata?.filename && (
          <div className={`flex items-center gap-1.5 text-xs mb-2 pb-2 border-b ${
            isUser ? 'border-white/20 text-white/80' : 'border-border text-text-muted'
          }`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {message.metadata.filename}
          </div>
        )}

        {/* Contenu du message */}
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
        ) : (
          <div className="text-sm prose-agent" dangerouslySetInnerHTML={{ __html: formatMarkdown(displayContent) }} />
        )}

        {/* Timestamp */}
        <div className={`text-[10px] mt-2 ${
          isUser ? 'text-white/50' : 'text-text-muted'
        }`}>
          {formatTime(message.created_at)}
        </div>
      </div>

      {/* Avatar user */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-3 mt-1 shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  )
}

/**
 * Formate le markdown basique en HTML
 */
function formatMarkdown(text) {
  if (!text) return ''

  let html = text
    // Escaper les caracteres HTML dangereux
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Titres
  html = html.replace(/^### (.+)$/gm, '<h4 class="font-semibold text-text-primary mt-3 mb-1">$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3 class="font-bold text-text-primary mt-4 mb-2 text-base">$1</h3>')

  // Gras
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')

  // Italique
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Code inline
  html = html.replace(/`([^`]+)`/g, '<code class="bg-surface-elevated px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')

  // Listes a puces
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$1. $2</li>')

  // Paragraphes (double saut de ligne)
  html = html.replace(/\n\n/g, '</p><p class="mb-2">')
  html = '<p class="mb-2">' + html + '</p>'

  // Sauts de ligne simples
  html = html.replace(/\n/g, '<br/>')

  return html
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
