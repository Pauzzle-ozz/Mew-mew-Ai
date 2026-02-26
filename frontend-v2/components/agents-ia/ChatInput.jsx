'use client'

import { useState, useRef } from 'react'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv'
]
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Zone de saisie du chat agent
 * Textarea auto-grow + upload fichier + bouton envoi
 */
export default function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleSubmit = () => {
    if ((!message.trim() && !file) || loading) return
    onSend(message.trim(), file)
    setMessage('')
    setFile(null)
    setFileError('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e) => {
    setMessage(e.target.value)
    // Auto-grow
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px'
  }

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    validateAndSetFile(selected)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) validateAndSetFile(dropped)
  }

  const validateAndSetFile = (f) => {
    setFileError('')
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError('Format non supporte. Utilisez PDF, Excel ou CSV.')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError('Fichier trop volumineux (max 10 Mo)')
      return
    }
    setFile(f)
  }

  return (
    <div
      className="border-t border-border p-4 bg-surface"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Fichier joint */}
      {file && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm">
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span className="text-text-primary truncate flex-1">{file.name}</span>
          <span className="text-text-muted text-xs">{(file.size / 1024).toFixed(0)} Ko</span>
          <button
            onClick={() => setFile(null)}
            className="text-text-muted hover:text-red-500 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Erreur fichier */}
      {fileError && (
        <p className="text-red-500 text-xs mb-2">{fileError}</p>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Bouton upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="p-2.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50"
          title="Joindre un document (PDF, Excel, CSV)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question fiscale..."
          disabled={loading}
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm disabled:opacity-50"
        />

        {/* Bouton envoyer */}
        <button
          onClick={handleSubmit}
          disabled={loading || (!message.trim() && !file)}
          className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-[10px] text-text-muted mt-2 text-center">
        Entree pour envoyer, Shift+Entree pour un retour a la ligne. Glissez un fichier pour le joindre.
      </p>
    </div>
  )
}
