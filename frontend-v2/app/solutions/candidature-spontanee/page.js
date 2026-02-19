'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation';
import Header from '@/components/shared/Header';
import SpontaneTips from '@/components/shared/SpontaneTips';

import { sendSpontaneousApplication, generateFollowUp, markFollowUpSent } from '@/lib/api/candidatureSpontaneeApi';

// ── Etapes ─────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: 'Saisie' },
  { n: 2, label: 'Envoi' },
  { n: 3, label: 'Confirmation' },
];

export default function CandidatureSpontaneePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  // ── State ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const [recipientEmail, setRecipientEmail] = useState('');
  const [targetPosition, setTargetPosition] = useState('');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');

  const [processing, setProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const [result, setResult] = useState(null);
  const [followUpDraft, setFollowUpDraft] = useState(null);
  const [generatingFollowUp, setGeneratingFollowUp] = useState(false);
  const [copied, setCopied] = useState(false);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data?.user?.id || null));
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────
  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label);
      setProgress(pct);
      await new Promise(r => setTimeout(r, ms));
    }
  };

  const validate = () => {
    if (!cvFile) return 'Veuillez ajouter votre CV (PDF)';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recipientEmail || !emailRegex.test(recipientEmail)) return 'Email recruteur invalide';
    if (!targetPosition.trim()) return 'Poste vise requis';
    return null;
  };

  // ── Handlers ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setError('');
    setProcessing(true);
    setProgress(0);
    setStep(2);

    try {
      const [apiResult] = await Promise.all([
        sendSpontaneousApplication(cvFile, recipientEmail, targetPosition, company, contactName, userId),
        _progressAnim([
          ['Lecture de votre CV...', 15, 1200],
          ["Redaction de l'email par l'IA...", 45, 3000],
          ['Envoi de votre candidature...', 80, 1500],
        ])
      ]);

      setProgress(100);
      setProcessingLabel('Termine !');
      await new Promise(r => setTimeout(r, 600));
      setResult(apiResult);
      setStep(3);
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi");
      setStep(1);
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!result?.application?.id || !userId) return;
    setGeneratingFollowUp(true);
    setError('');
    try {
      const draft = await generateFollowUp(result.application.id, userId);
      setFollowUpDraft(draft);
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingFollowUp(false);
    }
  };

  const handleCopyFollowUp = async () => {
    if (!followUpDraft) return;
    await navigator.clipboard.writeText(`Objet : ${followUpDraft.subject}\n\n${followUpDraft.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (result?.application?.id && userId) {
      try { await markFollowUpSent(result.application.id, userId); } catch {}
    }
  };

  const handleReset = () => {
    setStep(1);
    setCvFile(null);
    setRecipientEmail('');
    setTargetPosition('');
    setCompany('');
    setContactName('');
    setError('');
    setResult(null);
    setFollowUpDraft(null);
    setProgress(0);
    setCopied(false);
  };

  // ── Drag & Drop ────────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      setError('');
    } else {
      setError('Seuls les fichiers PDF sont acceptes');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      setError('');
    } else if (file) {
      setError('Seuls les fichiers PDF sont acceptes');
    }
  };

  // ── Loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <Header
        user={user}
        onLogout={handleLogout}
        breadcrumbs={[
          { label: 'Solutions', href: '/dashboard' },
          { label: 'Candidature spontanee' }
        ]}
        actions={
          <Link
            href="/solutions/matcher-offres/candidatures"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)]/20 transition-colors"
          >
            <span>📋</span>
            <span>Mes candidatures</span>
          </Link>
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Stepper ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s.n
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white/10 text-[var(--color-text-muted)]'
              }`}>
                {step > s.n ? '✓' : s.n}
              </div>
              <span className={`text-xs hidden sm:inline ${
                step >= s.n ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
              }`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 ${step > s.n ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1 : Formulaire ─────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Candidature Spontanee</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Uploadez votre CV, indiquez le poste et l'email du recruteur. L'IA redige un email percutant et l'envoie avec votre CV en piece jointe.
              </p>
            </div>

            {error && (
              <div className="text-red-400 text-sm p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Votre CV (PDF) *
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                    : cvFile
                      ? 'border-green-500/50 bg-green-900/10'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {cvFile ? (
                  <div className="space-y-1">
                    <div className="text-green-400 text-lg">PDF selectionne</div>
                    <div className="text-sm text-[var(--color-text-muted)]">{cvFile.name}</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                      className="text-xs text-red-400 hover:text-red-300 underline mt-1"
                    >
                      Retirer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-3xl">📄</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      Glissez votre CV ici ou <span className="text-[var(--color-primary)] underline">parcourez</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">PDF uniquement, max 5 Mo</div>
                  </div>
                )}
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Email du recruteur *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recrutement@entreprise.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Poste vise *
                </label>
                <input
                  type="text"
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(e.target.value)}
                  placeholder="Developpeur Full-Stack, Chef de projet..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Entreprise <span className="text-[var(--color-text-muted)]">(recommande)</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Google, Ubisoft..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Nom du contact <span className="text-[var(--color-text-muted)]">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Dupont, Martin..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Tips */}
            <SpontaneTips />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Envoyer ma candidature
            </button>
          </div>
        )}

        {/* ── Step 2 : Processing ─────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-6 py-16">
            <CatLoadingAnimation />
            <div className="text-center space-y-2">
              <p className="text-[var(--color-text-secondary)] text-sm">{processingLabel}</p>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{progress}%</p>
            </div>
          </div>
        )}

        {/* ── Step 3 : Confirmation ───────────────────────────────── */}
        {step === 3 && result && (
          <div className="space-y-6">
            {/* Success header */}
            <div className="text-center space-y-2">
              <div className="text-4xl">✅</div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Candidature envoyee !</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Votre email a ete envoye a <span className="font-medium text-[var(--color-primary)]">{recipientEmail}</span> avec votre CV en piece jointe.
              </p>
            </div>

            {/* Email preview */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-3">
              <div className="text-xs text-[var(--color-text-muted)] font-mono">
                <span className="font-semibold text-[var(--color-text-secondary)]">Objet :</span>{' '}
                {result.generatedEmail?.subject}
              </div>
              <hr className="border-white/10" />
              <pre className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap font-sans leading-relaxed">
                {result.generatedEmail?.body}
              </pre>
            </div>

            {/* Follow-up reminder */}
            {result.followUpDate && (
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-lg">⏰</span>
                  <p className="text-sm text-amber-300 font-medium">
                    Relance suggeree le{' '}
                    {new Date(result.followUpDate).toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })}
                  </p>
                </div>

                {!followUpDraft ? (
                  <button
                    onClick={handleGenerateFollowUp}
                    disabled={generatingFollowUp}
                    className="text-sm text-amber-400 hover:text-amber-300 underline disabled:opacity-50 disabled:no-underline"
                  >
                    {generatingFollowUp ? 'Generation en cours...' : 'Generer un email de relance maintenant'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <div className="text-xs text-[var(--color-text-muted)] font-mono">
                        <span className="font-semibold">Objet :</span> {followUpDraft.subject}
                      </div>
                      <hr className="border-white/10" />
                      <pre className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap font-sans leading-relaxed">
                        {followUpDraft.body}
                      </pre>
                    </div>
                    <button
                      onClick={handleCopyFollowUp}
                      className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {copied ? 'Copie !' : 'Copier dans le presse-papiers'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-[var(--color-text-primary)] hover:bg-white/5 transition-colors"
              >
                Nouvelle candidature
              </button>
              <Link
                href="/solutions/matcher-offres/candidatures"
                className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm text-center font-medium hover:opacity-90 transition-opacity"
              >
                Voir mes candidatures
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
