'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Composants matcher
import OfferForm from '@/components/matcher/OfferForm';
import CandidateProfileForm from '@/components/matcher/CandidateProfileForm';
import MatcherTransparency from '@/components/matcher/MatcherTransparency';
import OfferDiscovery from '@/components/matcher/OfferDiscovery';
import UrlScraper from '@/components/matcher/UrlScraper';

// Composants CV Builder (réutilisés de l'optimiseur)
import CVShapeSelector from '@/components/cv/CVShapeSelector';
import CVStyleSelector from '@/components/cv/CVStyleSelector';
import CVPreview from '@/components/cv/CVPreview';
import CVBlockEditor from '@/components/cv/CVBlockEditor';
import CatLoadingAnimation from '@/components/shared/CatLoadingAnimation';
import ToolHistory from '@/components/shared/ToolHistory';
import Header from '@/components/shared/Header';

// APIs
import { analyzeOffer, analyzeScrapedOffer, generateComplete, extractCandidateFromCVFile } from '@/lib/api/matcherApi';
import { saveHistoryEntry } from '@/lib/api/historyApi';
import { cvApi } from '@/lib/api/cvApi';
import { createApplication } from '@/lib/api/applicationsApi';
import { downloadGeneratedCV } from '@/lib/utils/fileHelpers';

// Constantes
import { CV_SHAPES, CV_STYLES, CV_PRESETS } from '@/lib/constants/cvBuilder';

// ── Étapes ───────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: 'Saisie' },
  { n: 2, label: 'Analyse' },
  { n: 3, label: 'Design' },
  { n: 4, label: 'Édition' },
  { n: 5, label: 'Résultat' },
];

const BLOCK_LABELS = {
  identity:    { icon: '👤', label: 'Identité' },
  resume:      { icon: '📝', label: 'Résumé' },
  experiences: { icon: '💼', label: 'Expériences' },
  formations:  { icon: '🎓', label: 'Formations' },
  skills:      { icon: '⚡', label: 'Compétences' },
};

export default function MatcherOffresPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  // ── Historique ────────────────────────────────────────────────────
  const [showHistory, setShowHistory] = useState(false);

  // ── Navigation ────────────────────────────────────────────────────
  const [matcherMode, setMatcherMode] = useState(null); // null | 'matching' | 'decouverte'
  const [step, setStep] = useState(0);

  // ── Step 1 : Input ────────────────────────────────────────────────
  const [inputMode, setInputMode] = useState('rapide'); // 'rapide' | 'url' | 'form'
  const [cvFile, setCvFile] = useState(null);
  const [offerUrl, setOfferUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);
  const [scrapedData, setScrapedData] = useState(null);
  const [offerData, setOfferData] = useState({
    title: '', company: '', location: '', contract_type: '', salary: '', description: ''
  });
  const [candidateData, setCandidateData] = useState({
    prenom: '', nom: '', titre_poste: '', email: '', telephone: '', adresse: '', linkedin: '',
    experiences: [], formations: [], competences_techniques: '', competences_soft: '', langues: ''
  });
  const [currentTab, setCurrentTab] = useState('offer');
  const [profileMode, setProfileMode] = useState('form'); // 'form' | 'pdf'
  const [formCvFile, setFormCvFile] = useState(null);

  // Options de génération (lettre toujours générée, CV idéal désactivé)
  const generateOptions = { generatePersonalizedCV: true, generateIdealCV: false, generateCoverLetter: true };

  // ── Processing ────────────────────────────────────────────────────
  const [processing, setProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  // ── Step 2 : Transparence ─────────────────────────────────────────
  const [cvDataOriginal, setCvDataOriginal] = useState(null);
  const [cvDataOptimized, setCvDataOptimized] = useState(null);
  const [scoreMatching, setScoreMatching] = useState(0);
  const [modifications, setModifications] = useState([]);
  const [coverLetterResult, setCoverLetterResult] = useState(null);

  // ── Step 3 : Design ───────────────────────────────────────────────
  const [selectedShape, setSelectedShape] = useState(() => CV_SHAPES.find(s => s.id === 'classique'));
  const [selectedStyle, setSelectedStyle] = useState(() => CV_STYLES.find(s => s.id === 'anthracite'));
  const [designMode, setDesignMode] = useState('library');   // 'library' | 'custom'
  const [designSubStep, setDesignSubStep] = useState(0);     // 0=shape, 1=style (custom mode)

  // ── Step 4 : Blocs ────────────────────────────────────────────────
  const [blockStyles, setBlockStyles] = useState({});
  const [activeBlock, setActiveBlock] = useState('identity');
  const [blockOrder, setBlockOrder] = useState(['identity', 'resume', 'experiences', 'formations', 'skills']);

  // ── Step 5 : Génération ───────────────────────────────────────────
  const [generatingCV, setGeneratingCV] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState(null);

  // ── Candidature ───────────────────────────────────────────────────
  const [applicationSaved, setApplicationSaved] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data?.user?.id || null));
  }, []);

  // ─── Reset complet ──────────────────────────────────────────────
  const handleReset = () => {
    setMatcherMode(null);
    setStep(0);
    setCvFile(null);
    setOfferUrl('');
    setScrapedData(null);
    setOfferData({ title: '', company: '', location: '', contract_type: '', salary: '', description: '' });
    setCandidateData({ prenom: '', nom: '', titre_poste: '', email: '', telephone: '', adresse: '', linkedin: '', experiences: [], formations: [], competences_techniques: '', competences_soft: '', langues: '' });
    setProfileMode('form');
    setFormCvFile(null);
    setError('');
    setProcessing(false);
    setCvDataOriginal(null);
    setCvDataOptimized(null);
    setScoreMatching(0);
    setModifications([]);
    setCoverLetterResult(null);
    setSelectedShape(CV_SHAPES.find(s => s.id === 'classique'));
    setSelectedStyle(CV_STYLES.find(s => s.id === 'anthracite'));
    setDesignMode('library');
    setDesignSubStep(0);
    setBlockStyles({});
    setActiveBlock('identity');
    setBlockOrder(['identity', 'resume', 'experiences', 'formations', 'skills']);
    setGeneratedConfig(null);
    setApplicationSaved(false);
  };

  // ─── Handler : Découverte → sélection d'une offre ──────────────
  const handleSelectDiscoveredOffer = (offre) => {
    setOfferData({
      title: offre.titre || '',
      company: offre.entreprise || '',
      location: offre.lieu || '',
      contract_type: offre.contrat || '',
      salary: '',
      description: offre.description || `Offre depuis ${offre.source || 'scraping'}`
    });
    setMatcherMode('matching');
    setInputMode('form');
    setCurrentTab('profile');
    setStep(1);
  };

  // ─── Helper progress animation ───────────────────────────────────
  const _progressAnim = async (steps) => {
    for (const [label, pct, ms] of steps) {
      setProcessingLabel(label);
      setProgress(pct);
      await new Promise(r => setTimeout(r, ms));
    }
  };

  // ─── Lancement de l'analyse (step 1 → step 2) ───────────────────
  const handleSubmitMatching = async () => {
    setError('');
    setProcessing(true);
    setProgress(0);

    try {
      let response;

      if (inputMode === 'rapide') {
        if (!cvFile) throw new Error('Veuillez ajouter votre CV PDF');
        if (!offerUrl) throw new Error('Veuillez saisir l\'URL de l\'offre');
        const [apiResp] = await Promise.all([
          generateComplete(cvFile, offerUrl, generateOptions),
          _progressAnim([
            ['Extraction du CV...', 15, 800],
            ['Analyse du profil candidat...', 35, 1200],
            ['Scraping de l\'offre...', 55, 1500],
            ['Optimisation IA en cours...', 80, 2000],
          ])
        ]);
        response = apiResp;

      } else if (inputMode === 'url') {
        if (!scrapedData) throw new Error('Analysez d\'abord l\'URL de l\'offre');
        if (!candidateData.prenom || !candidateData.nom || !candidateData.titre_poste)
          throw new Error('Renseignez Prénom, Nom et Titre du poste');
        const [apiResp] = await Promise.all([
          analyzeScrapedOffer(scrapedData.rawText, scrapedData.url, candidateData, generateOptions),
          _progressAnim([['Analyse de l\'offre...', 30, 800], ['Optimisation IA...', 70, 2000]])
        ]);
        response = apiResp;

      } else {
        if (!offerData.title || !offerData.company || !offerData.description)
          throw new Error('Titre, entreprise et description de l\'offre sont obligatoires');

        let candidate = candidateData;

        if (profileMode === 'pdf') {
          if (!formCvFile) throw new Error('Veuillez ajouter votre CV PDF');
          const [extracted] = await Promise.all([
            extractCandidateFromCVFile(formCvFile),
            _progressAnim([['Extraction du CV...', 20, 800]])
          ]);
          candidate = extracted.data;
        } else {
          if (!candidateData.prenom || !candidateData.nom || !candidateData.titre_poste)
            throw new Error('Prénom, nom et titre du poste sont obligatoires');
        }

        const [apiResp] = await Promise.all([
          analyzeOffer(offerData, candidate, generateOptions),
          _progressAnim([['Analyse de correspondance...', 55, 800], ['Optimisation IA...', 85, 2000]])
        ]);
        response = apiResp;
        if (profileMode === 'pdf') setCandidateData(candidate);
      }

      setProgress(100);

      const personal = response.data?.personalizedCV;
      if (!personal?.cvData) throw new Error('L\'IA n\'a pas retourné les données du CV');

      setCvDataOriginal(candidateData.prenom ? { ...candidateData } : personal.cvData);
      setCvDataOptimized({ ...personal.cvData });
      setScoreMatching(personal.score_matching || 0);
      setModifications(personal.modifications_apportees || []);
      setCoverLetterResult(response.data?.coverLetter || null);
      setStep(2);

      // Sauvegarde historique (fire-and-forget)
      saveHistoryEntry({
        userId: user.id,
        toolType: 'matcher-offres',
        title: `Match - ${personal.cvData?.titre_poste || 'Offre'}`,
        inputSummary: { poste: personal.cvData?.titre_poste },
        resultSummary: { score_matching: personal.score_matching }
      }).catch(() => {});

    } catch (err) {
      setError(err.message || 'Erreur lors de l\'analyse');
    } finally {
      setProcessing(false);
    }
  };

  // ─── Step 4 : gestion des blocs ─────────────────────────────────
  const moveBlock = (key, dir) => {
    const arr = [...blockOrder];
    const idx = arr.indexOf(key);
    if (dir === 'up' && idx > 0) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    if (dir === 'down' && idx < arr.length - 1) [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    setBlockOrder(arr);
  };

  const handleBlockStyleChange = (key, prop, val) =>
    setBlockStyles(prev => ({ ...prev, [key]: { ...prev[key], [prop]: val } }));

  // ─── Step 5 : générer le PDF final ──────────────────────────────
  const handleGenerateCV = async () => {
    setGeneratingCV(true);
    try {
      const buildConfig = { shape: selectedShape?.id, style: selectedStyle?.id, blockStyles };
      const result = await cvApi.generateCV(cvDataOptimized, buildConfig);
      setGeneratedConfig({ cvData: cvDataOptimized, buildConfig });
      downloadGeneratedCV(result);
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération du PDF');
    } finally {
      setGeneratingCV(false);
    }
  };

  // ─── Sauvegarder candidature ─────────────────────────────────────
  const handleSaveApplication = async () => {
    if (!userId) return;
    try {
      await createApplication(userId, {
        offer_title: offerData.title || cvDataOptimized?.titre_poste || 'Candidature',
        company: offerData.company || '',
        offer_url: offerUrl || scrapedData?.url || '',
        location: offerData.location || '',
        contract_type: offerData.contract_type || '',
        status: 'a_postuler'
      });
      setApplicationSaved(true);
    } catch (err) {
      console.error('Erreur sauvegarde candidature:', err);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDU
  // ═══════════════════════════════════════════════════════════════════

  const buildConfig = { shape: selectedShape?.id, style: selectedStyle?.id, blockStyles };

  // ── Indicateur d'étapes ───────────────────────────────────────────
  const StepIndicator = () => step > 0 && matcherMode === 'matching' ? (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {STEPS.map((s) => (
        <div key={s.n} className="flex items-center gap-1">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            step === s.n ? 'bg-primary text-primary-foreground' :
            step > s.n ? 'bg-border text-text-secondary' : 'bg-surface-elevated text-text-muted'
          }`}>
            {step > s.n && <span className="text-green-400">✓</span>}
            {s.label}
          </div>
          {s.n < 5 && <div className={`w-4 h-px ${step > s.n ? 'bg-border-light' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  ) : null;

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Chargement...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Header avec navigation Mew ── */}
      <Header
        user={user}
        onLogout={handleLogout}
        breadcrumbs={[{ label: 'Emploi', href: '/dashboard' }, { label: 'Matcher d\'Offres' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 cursor-pointer transition-colors"
            >
              Historique
            </button>
            <Link
              href="/solutions/matcher-offres/candidatures"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 text-sm font-medium hover:bg-pink-500/20 transition-colors"
            >
              <span>📋</span>
              <span>Mes candidatures</span>
            </Link>
          </div>
        }
      />

      {showHistory && (
        <ToolHistory
          userId={user.id}
          defaultToolType="matcher-offres"
          onClose={() => setShowHistory(false)}
        />
      )}

      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🎯</span>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
                Matcher d'Offres
              </h1>
            </div>
            <p className="text-text-muted text-sm">Adaptez votre CV à une offre ou découvrez des postes qui vous correspondent</p>
            {matcherMode && (
              <div className="flex justify-center gap-4 mt-3">
                <Link href="/solutions/matcher-offres/candidatures" className="text-xs text-text-muted hover:text-text-secondary underline underline-offset-2 transition-colors">
                  Mes candidatures →
                </Link>
                <button onClick={handleReset} className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                  Recommencer
                </button>
              </div>
            )}
          </div>

          <StepIndicator />

          {/* ─── STEP 0 : Choix du mode ──────────────────────────────────── */}
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => { setMatcherMode('matching'); setStep(1); }}
                className="group p-8 rounded-2xl border border-border bg-surface/50 hover:border-pink-500/60 hover:bg-pink-950/20 transition-all text-left"
              >
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-lg font-bold text-white mb-2">Adapter mon CV</h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  J'ai une offre précise. L'IA optimise mon CV, affiche le score de correspondance, le design est personnalisable.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['PDF+URL', 'URL scraping', 'Formulaire'].map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted">{t}</span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">Commencer →</p>
              </button>

              <button
                onClick={() => { setMatcherMode('decouverte'); setStep(1); }}
                className="group p-8 rounded-2xl border border-border bg-surface/50 hover:border-purple-500/60 hover:bg-purple-950/20 transition-all text-left"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-lg font-bold text-white mb-2">Trouver des offres</h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  J'upload mon CV, l'IA identifie mes métiers et scrape les offres réelles qui me correspondent.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['WTTJ', 'France Travail', 'IA matching'].map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted">{t}</span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">Commencer →</p>
              </button>
            </div>
          )}

          {/* ─── MODE DÉCOUVERTE ─────────────────────────────────────────── */}
          {matcherMode === 'decouverte' && step === 1 && (
            <div className="max-w-xl mx-auto">
              <OfferDiscovery onSelectOffer={handleSelectDiscoveredOffer} />
            </div>
          )}

          {/* ─── MODE MATCHING ───────────────────────────────────────────── */}
          {matcherMode === 'matching' && (
            <>
              {/* ── STEP 1 : Saisie ────────────────────────────────────────── */}
              {step === 1 && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Sélecteur sous-mode */}
                  <div className="flex gap-1 bg-surface rounded-xl p-1 w-fit mx-auto">
                    {[
                      { key: 'rapide', label: '⚡ Rapide' },
                      { key: 'url', label: '🔗 URL' },
                      { key: 'form', label: '✏️ Formulaire' },
                    ].map(m => (
                      <button key={m.key} onClick={() => setInputMode(m.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === m.key ? 'bg-pink-600 text-white' : 'text-text-muted hover:text-white'}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Mode Rapide */}
                  {inputMode === 'rapide' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary">Votre CV (PDF)</label>
                        <div
                          className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                            isDragging ? 'border-pink-500 bg-pink-950/20' :
                            cvFile ? 'border-green-500 bg-green-950/10' : 'border-border bg-surface hover:border-border-light'
                          }`}
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') setCvFile(f); }}
                          onClick={() => fileRef.current?.click()}
                        >
                          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) setCvFile(f); }} />
                          {cvFile ? (
                            <><div className="text-2xl mb-1">✅</div>
                            <p className="text-sm font-medium text-green-400">{cvFile.name}</p>
                            <p className="text-xs text-text-muted mt-0.5">{(cvFile.size / 1024).toFixed(0)} Ko</p></>
                          ) : (
                            <><div className="text-3xl mb-2">📄</div>
                            <p className="text-sm font-medium text-white">Glissez votre CV ici</p>
                            <p className="text-xs text-text-muted mt-1">ou cliquez · PDF max 2 Mo</p></>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary">Lien de l'offre</label>
                        <input type="url" value={offerUrl} onChange={(e) => setOfferUrl(e.target.value)}
                          placeholder="https://welcometothejungle.com/..."
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-pink-500 transition-colors text-sm" />
                        <p className="text-xs text-text-muted">WTTJ, Indeed, APEC, sites entreprises...</p>
                        <div className="p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                          <p className="text-xs text-yellow-400">⚠️ LinkedIn et Glassdoor bloquent le scraping.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode URL */}
                  {inputMode === 'url' && (
                    <div className="space-y-5">
                      <UrlScraper
                        onScrapingComplete={(data) => {
                          setScrapedData(data);
                          if (data.basicOffer) setOfferData(d => ({ ...d, ...data.basicOffer }));
                        }}
                      />
                      {scrapedData && (
                        <div className="bg-surface rounded-xl p-6">
                          <h3 className="text-sm font-semibold text-text-secondary mb-4">Votre profil</h3>
                          <CandidateProfileForm
                            candidateData={candidateData}
                            setCandidateData={setCandidateData}
                            profileMode={profileMode}
                            setProfileMode={setProfileMode}
                            formCvFile={formCvFile}
                            setFormCvFile={setFormCvFile}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode Formulaire */}
                  {inputMode === 'form' && (
                    <div className="space-y-5">
                      <div className="flex border-b border-border">
                        {[{ key: 'offer', label: '📋 Offre' }, { key: 'profile', label: '👤 Profil' }].map(t => (
                          <button key={t.key} onClick={() => setCurrentTab(t.key)}
                            className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors -mb-px ${
                              currentTab === t.key ? 'border-pink-500 text-pink-400' : 'border-transparent text-text-muted hover:text-text-secondary'
                            }`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                      <div className="bg-surface rounded-xl p-6">
                        {currentTab === 'offer' && <OfferForm offerData={offerData} setOfferData={setOfferData} />}
                        {currentTab === 'profile' && <CandidateProfileForm
                            candidateData={candidateData}
                            setCandidateData={setCandidateData}
                            profileMode={profileMode}
                            setProfileMode={setProfileMode}
                            formCvFile={formCvFile}
                            setFormCvFile={setFormCvFile}
                          />}
                      </div>
                      {currentTab === 'offer' && (
                        <button onClick={() => setCurrentTab('profile')}
                          className="w-full py-3 rounded-xl bg-surface-elevated hover:bg-border text-white font-medium text-sm transition-colors">
                          Suivant : Votre profil →
                        </button>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                      <p className="text-sm text-red-300">{error}</p>
                      <button onClick={() => setError('')} className="mt-2 text-xs text-red-400 underline">Fermer</button>
                    </div>
                  )}

                  {processing ? (
                    <div className="space-y-3 bg-surface rounded-xl p-6 text-center">
                      <CatLoadingAnimation label={processingLabel} />
                      <div className="relative w-full bg-surface-elevated rounded-full h-2 overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-text-muted">⏱️ 30 à 90 secondes</p>
                    </div>
                  ) : (
                    <button onClick={handleSubmitMatching} disabled={processing}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 disabled:opacity-50 text-white font-bold text-lg transition-all">
                      ⚡ Analyser et optimiser mon CV
                    </button>
                  )}
                </div>
              )}

              {/* ── STEP 2 : Transparence ──────────────────────────────────── */}
              {step === 2 && (
                <div className="max-w-2xl mx-auto">
                  <MatcherTransparency
                    score={scoreMatching}
                    modifications={modifications}
                    cvDataOriginal={cvDataOriginal}
                    cvDataOptimized={cvDataOptimized}
                    onBack={() => setStep(1)}
                    onContinue={() => setStep(3)}
                  />
                </div>
              )}

              {/* ── STEP 3 : Design ─────────────────────────────────────────── */}
              {step === 3 && (
                <div className="max-w-5xl mx-auto">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">Design de votre CV</h2>
                    <p className="text-text-muted text-sm">Choisissez un style prêt-à-l'emploi ou personnalisez chaque détail.</p>
                  </div>

                  <div className="flex gap-6 items-start">
                    {/* ── Panneau gauche ── */}
                    <div className="flex-1 min-w-0 space-y-5">
                      {/* Toggle bibliothèque / personnalisé */}
                      <div className="flex gap-2 p-1 bg-surface rounded-lg w-fit">
                        <button onClick={() => setDesignMode('library')}
                          className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${designMode === 'library' ? 'bg-primary text-primary-foreground shadow-md' : 'text-text-muted hover:text-text-secondary'}`}>
                          ✨ Bibliothèque
                        </button>
                        <button onClick={() => setDesignMode('custom')}
                          className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${designMode === 'custom' ? 'bg-primary text-primary-foreground shadow-md' : 'text-text-muted hover:text-text-secondary'}`}>
                          🎛️ Personnalisé
                        </button>
                      </div>

                      {/* Mode bibliothèque : presets */}
                      {designMode === 'library' && (
                        <div>
                          <p className="text-xs text-text-muted mb-4">Cliquez sur un design pour le sélectionner, puis continuez.</p>
                          <div className="grid grid-cols-2 gap-4">
                            {CV_PRESETS.map(preset => {
                              const isSelected = selectedShape?.id === preset.shape && selectedStyle?.id === preset.style;
                              return (
                                <button key={preset.id}
                                  onClick={() => { setSelectedShape({ id: preset.shape }); setSelectedStyle({ id: preset.style }); }}
                                  className={`group rounded-xl border-2 overflow-hidden text-left transition-all hover:scale-[1.02] ${isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-border hover:border-primary/40'}`}>
                                  <div className="relative overflow-hidden" style={{ height: '120px', background: '#0a0a0f' }}>
                                    <div style={{ width: '100%', height: '100%', transform: 'scale(0.95)', transformOrigin: 'top left' }}
                                      dangerouslySetInnerHTML={{ __html: preset.preview }} />
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">✓</div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-3 bg-surface">
                                    <div className="font-semibold text-sm text-white">{preset.label}</div>
                                    <div className="text-xs text-text-muted mt-0.5">{preset.desc}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Mode personnalisé : shape + style en 2 sous-étapes */}
                      {designMode === 'custom' && (
                        <div>
                          {/* Sub-step indicator */}
                          <div className="flex items-center gap-0 mb-5">
                            {[{ n: 0, label: 'Mise en page' }, { n: 1, label: 'Couleurs' }].map((s, i) => (
                              <div key={s.n} className="flex items-center">
                                <button onClick={() => setDesignSubStep(s.n)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${s.n === designSubStep ? 'bg-primary text-primary-foreground' : s.n < designSubStep ? 'bg-primary/20 text-primary cursor-pointer' : 'bg-surface-elevated text-text-muted cursor-pointer hover:text-text-secondary'}`}>
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${s.n < designSubStep ? 'bg-primary/40' : s.n === designSubStep ? 'bg-black/15' : 'bg-border'}`}>
                                    {s.n < designSubStep ? '✓' : s.n + 1}
                                  </span>
                                  {s.label}
                                </button>
                                {i < 1 && <div className={`h-0.5 w-4 flex-shrink-0 ${s.n < designSubStep ? 'bg-primary/40' : 'bg-border'}`} />}
                              </div>
                            ))}
                          </div>

                          <div className="min-h-56">
                            {designSubStep === 0 && <CVShapeSelector selected={selectedShape} onSelect={setSelectedShape} />}
                            {designSubStep === 1 && <CVStyleSelector selected={selectedStyle} onSelect={setSelectedStyle} />}
                          </div>

                          <div className="flex justify-between mt-5">
                            <button onClick={() => setDesignSubStep(p => Math.max(0, p - 1))} disabled={designSubStep === 0}
                              className="px-5 py-2.5 border border-border-light text-text-secondary rounded-lg hover:bg-surface-elevated font-medium disabled:opacity-30 text-sm">
                              ← Précédent
                            </button>
                            {designSubStep < 1 && (
                              <button onClick={() => setDesignSubStep(p => p + 1)}
                                className="px-6 py-2.5 bg-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/30 text-sm transition-all">
                                Suivant →
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Résumé sélection */}
                      {(selectedShape || selectedStyle) && (
                        <div className="bg-surface rounded-lg p-3 flex gap-4 flex-wrap text-sm border border-primary/20">
                          {selectedShape && <span><span className="text-text-muted">Mise en page :</span> <strong className="text-white">{selectedShape.label || selectedShape.id}</strong></span>}
                          {selectedStyle && <span><span className="text-text-muted">Style :</span> <strong className="text-primary">{selectedStyle.label || selectedStyle.id}</strong></span>}
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-border-light text-text-secondary hover:border-text-muted transition-colors text-sm font-medium">← Retour</button>
                        <button onClick={() => setStep(4)} disabled={!selectedShape || !selectedStyle}
                          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all text-sm disabled:opacity-50">
                          Éditer les blocs →
                        </button>
                      </div>
                    </div>

                    {/* ── Preview live à droite ── */}
                    <div className="hidden lg:block flex-shrink-0 sticky top-6">
                      <div className="text-xs font-medium text-text-muted mb-2 text-center">Aperçu en temps réel</div>
                      <CVPreview
                        cvData={cvDataOptimized}
                        buildConfig={buildConfig}
                        scale={0.46}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4 : Édition des blocs ─────────────────────────────── */}
              {step === 4 && cvDataOptimized && (
                <div className="flex gap-4 items-start">
                  {/* Panel gauche */}
                  <div className="w-80 shrink-0 space-y-3">
                    <h3 className="text-sm font-semibold text-text-secondary">Sections du CV</h3>
                    <div className="space-y-1">
                      {blockOrder.map((key, idx) => (
                        <div key={key} onClick={() => setActiveBlock(key)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            activeBlock === key ? 'bg-primary/20 border border-primary/40' : 'bg-surface-elevated hover:bg-border'
                          }`}>
                          <span className="text-sm">{BLOCK_LABELS[key]?.icon} {BLOCK_LABELS[key]?.label}</span>
                          <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); moveBlock(key, 'up'); }} disabled={idx === 0}
                              className="text-xs px-1 disabled:opacity-20 hover:text-white text-text-muted">↑</button>
                            <button onClick={(e) => { e.stopPropagation(); moveBlock(key, 'down'); }} disabled={idx === blockOrder.length - 1}
                              className="text-xs px-1 disabled:opacity-20 hover:text-white text-text-muted">↓</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <CVBlockEditor
                      cvData={cvDataOptimized}
                      onCvDataChange={setCvDataOptimized}
                      activeBlock={activeBlock}
                      blockStyles={blockStyles}
                      onBlockStyleChange={handleBlockStyleChange}
                    />

                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-xl border border-border-light text-text-secondary hover:border-text-muted transition-colors text-sm">← Design</button>
                      <button onClick={() => setStep(5)} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all text-sm">Générer →</button>
                    </div>
                  </div>

                  {/* Prévisualisation */}
                  <div className="flex-1 sticky top-6">
                    <CVPreview
                      cvData={cvDataOptimized}
                      buildConfig={buildConfig}
                      scale={0.65}
                      interactive={true}
                      selectedBlock={activeBlock}
                      onBlockClick={setActiveBlock}
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 5 : Génération PDF ─────────────────────────────────── */}
              {step === 5 && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <h2 className="text-xl font-semibold text-center text-white">Votre candidature est prête</h2>

                  {/* Résumé */}
                  <div className="bg-surface rounded-xl p-5 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-text-muted mb-1">Design</p>
                      <p className="font-semibold text-white capitalize">{selectedShape?.label} · <span className="text-primary">{selectedStyle?.label}</span></p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: scoreMatching >= 75 ? '#22c55e' : scoreMatching >= 50 ? '#f59e0b' : '#ef4444' }}>
                        {scoreMatching}
                      </div>
                      <p className="text-xs text-text-muted">concordance</p>
                    </div>
                  </div>

                  {/* Prévisualisation finale */}
                  {generatedConfig && (
                    <div className="flex justify-center">
                      <CVPreview cvData={generatedConfig.cvData} buildConfig={generatedConfig.buildConfig} scale={0.55} />
                    </div>
                  )}

                  {/* ── CV personnalisé ── */}
                  {generatingCV ? (
                    <div className="flex justify-center py-4">
                      <CatLoadingAnimation label="Génération du PDF en cours..." />
                    </div>
                  ) : !generatedConfig ? (
                    <button onClick={handleGenerateCV}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 text-white font-bold text-lg transition-all">
                      Générer et télécharger mon CV
                    </button>
                  ) : (
                    <button onClick={handleGenerateCV}
                      className="w-full py-3 rounded-xl border border-border-light text-text-secondary hover:border-primary hover:text-primary transition-colors text-sm font-medium">
                      Re-télécharger le CV personnalisé
                    </button>
                  )}

                  {/* ── Lettre de motivation (section séparée) ── */}
                  {coverLetterResult && (
                    <div className="bg-surface/60 border border-blue-800/40 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">✉️</span>
                        <h3 className="text-sm font-semibold text-blue-300">Lettre de motivation</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-400">Générée automatiquement</span>
                      </div>
                      <p className="text-xs text-text-muted mb-3">Une lettre personnalisée a été générée pour cette offre.</p>
                      <button onClick={() => downloadGeneratedCV({ data: coverLetterResult })}
                        className="w-full py-2.5 rounded-lg border border-blue-800/60 text-blue-400 hover:bg-blue-950/20 transition-colors text-sm font-medium">
                        Télécharger la lettre de motivation
                      </button>
                    </div>
                  )}

                  {/* Save candidature */}
                  {generatedConfig && !applicationSaved && (
                    <div className="bg-surface rounded-xl p-5 border border-border">
                      <h3 className="text-sm font-semibold text-white mb-1">Suivre cette candidature</h3>
                      <p className="text-xs text-text-muted mb-3">Ajoutez-la à votre tableau de suivi.</p>
                      <button onClick={handleSaveApplication}
                        className="w-full py-2.5 rounded-xl bg-border hover:bg-border-light text-white font-medium text-sm transition-colors">
                        Ajouter au suivi →
                      </button>
                    </div>
                  )}
                  {applicationSaved && (
                    <div className="bg-green-900/20 border border-green-800 rounded-xl p-4 text-center">
                      <p className="text-sm text-green-400">✅ Candidature ajoutée</p>
                      <Link href="/solutions/matcher-offres/candidatures" className="text-xs text-green-500 hover:text-green-300 underline">
                        Voir mes candidatures →
                      </Link>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-xl border border-border-light text-text-secondary hover:border-text-muted transition-colors text-sm">← Modifier</button>
                    <button onClick={handleReset} className="flex-1 py-3 rounded-xl border border-border-light text-text-secondary hover:border-text-muted transition-colors text-sm">Nouvelle analyse</button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
