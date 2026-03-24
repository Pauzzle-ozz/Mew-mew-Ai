'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import Button from '@/components/shared/Button'
import Alert from '@/components/shared/Alert'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Visual panel (desktop) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-secondary/5 via-primary-light to-accent-light relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-primary/10 blur-3xl animate-float delay-500" />
        </div>
        <div className="relative text-center px-12">
          <div className="font-display text-7xl font-bold text-secondary/20 mb-6">5</div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-3">Univers</h2>
          <p className="text-text-secondary max-w-xs mx-auto">
            Emploi, marketing, fiscalite, finance et agents IA — gratuit, sans limites
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Analyseur CV', 'Strategie', 'Audit fiscal', 'Trading', 'Agent IA'].map(tool => (
              <span key={tool} className="px-3 py-1.5 rounded-full bg-surface/80 text-xs text-text-secondary font-medium border border-border/50">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-10">
            <Logo size="md" />
            <h1 className="font-display text-3xl font-bold text-text-primary mt-8">
              Creer un compte
            </h1>
            <p className="text-text-muted mt-2">
              Acces gratuit a tous les outils, sans carte bancaire
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && <Alert variant="error">{error}</Alert>}
            {success && <Alert variant="success">Compte cree ! Redirection...</Alert>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caracteres minimum"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Creation...' : 'Creer mon compte'}
            </Button>

            <p className="text-center text-sm text-text-muted pt-2">
              Deja un compte ?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
