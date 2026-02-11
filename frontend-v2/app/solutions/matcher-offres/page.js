'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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

// APIs
import { analyzeOffer, analyzeScrapedOffer, generateComplete } from '@/lib/api/matcherApi';
import { cvApi } from '@/lib/api/cvApi';
import { createApplication } from '@/lib/api/applicationsApi';
import { downloadGeneratedCV } from '@/lib/utils/fileHelpers';

// Constantes
import { CV_SHAPES, CV_STYLES } from '@/lib/constants/cvBuilder';

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
  useAuth();

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
  const [generateOptions, setGenerateOptions] = useState({
    generatePersonalizedCV: true,
    generateIdealCV: false,
    generateCoverLetter: true
  });

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
  const [matchResults, setMatchResults] = useState(null); // { idealCV, coverLetter }

  // ── Step 3 : Design ───────────────────────────────────────────────
  const [selectedShape, setSelectedShape] = useState(() => CV_SHAPES.find(s => s.id === 'classique'));
  const [selectedStyle, setSelectedStyle] = useState(() => CV_STYLES.find(s => s.id === 'anthracite'));

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
    setError('');
    setProcessing(false);
    setCvDataOriginal(null);
    setCvDataOptimized(null);
    setScoreMatching(0);
    setModifications([]);
    setMatchResults(null);
    setSelectedShape(CV_SHAPES.find(s => s.id === 'classique'));
    setSelectedStyle(CV_STYLES.find(s => s.id === 'anthracite'));
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
        if (!candidateData.prenom || !candidateData.nom || !candidateData.titre_poste)
          throw new Error('Prénom, nom et titre du poste sont obligatoires');
        const [apiResp] = await Promise.all([
          analyzeOffer(offerData, candidateData, generateOptions),
          _progressAnim([['Analyse de correspondance...', 30, 800], ['Optimisation IA...', 70, 2000]])
        ]);
        response = apiResp;
      }

      setProgress(100);

      const personal = response.data?.personalizedCV;
      if (!personal?.cvData) throw new Error('L\'IA n\'a pas retourné les données du CV');

      setCvDataOriginal(candidateData.prenom ? { ...candidateData } : personal.cvData);
      setCvDataOptimized({ ...personal.cvData });
      setScoreMatching(personal.score_matching || 0);
      setModifications(personal.modifications_apportees || []);
      setMatchResults({
        idealCV: response.data?.idealCV || null,
        coverLetter: response.data?.coverLetter || null
      });
      setStep(2);

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

  // ════════════════════════════════════════════════════════════════════
  // RENDU
  // ════════════════════════════════════════════════════════════════════

  const buildConfig = { shape: selectedShape?.id, style: selectedStyle?.id, blockStyles };

  // ── Indicateur d'étapes ───────────────────────────────────────────
  const StepIndicator = () => step > 0 && matcherMode === 'matching' ? (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {STEPS.map((s) => (
        <div key={s.n} className="flex items-center gap-1">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            step === s.n ? 'bg-primary text-slate-900' :
            step > s.n ? 'bg-slate-700 text-slate-300' : 'bg-slate-800 text-slate-500'
          }`}>
            {step > s.n && <span className="text-green-400">✓</span>}
            {s.label}
          </div>
          {s.n < 5 && <div className={`w-4 h-px ${step > s.n ? 'bg-slate-500' : 'bg-slate-700'}`} />}
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🎯</span>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
              Matcher d'Offres
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Adaptez votre CV à une offre ou découvrez des postes qui vous correspondent</p>
          {matcherMode && (
            <div className="flex justify-center gap-4 mt-3">
              <Link href="/solutions/matcher-offres/candidatures" className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors">
                Mes candidatures →
              </Link>
              <button onClick={handleReset} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
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
              className="group p-8 rounded-2xl border border-slate-700 bg-slate-900/50 hover:border-pink-500/60 hover:bg-pink-950/20 transition-all text-left"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-lg font-bold text-white mb-2">Adapter mon CV</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                J'ai une offre précise. L'IA optimise mon CV, affiche le score de correspondance, le design est personnalisable.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['PDF+URL', 'URL scraping', 'Formulaire'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{t}</span>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">Commencer →</p>
            </button>

            <button
              onClick={() => { setMatcherMode('decouverte'); setStep(1); }}
              className="group p-8 rounded-2xl border border-slate-700 bg-slate-900/50 hover:border-purple-500/60 hover:bg-purple-950/20 transition-all text-left"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-lg font-bold text-white mb-2">Trouver des offres</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                J'upload mon CV, l'IA identifie mes métiers et scrape les offres réelles qui me correspondent.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['WTTJ', 'France Travail', 'IA matching'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{t}</span>
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
                <div className="flex gap-1 bg-slate-900 rounded-xl p-1 w-fit mx-auto">
                  {[
                    { key: 'rapide', label: '⚡ Rapide' },
                    { key: 'url', label: '🔗 URL' },
                    { key: 'form', label: '✏️ Formulaire' },
                  ].map(m => (
                    <button key={m.key} onClick={() => setInputMode(m.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === m.key ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Mode Rapide */}
                {inputMode === 'rapide' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-300">Votre CV (PDF)</label>
                      <div
                        className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                          isDragging ? 'border-pink-500 bg-pink-950/20' :
                          cvFile ? 'border-green-500 bg-green-950/10' : 'border-slate-700 bg-slate-900 hover:border-slate-500'
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
                          <p className="text-xs text-slate-500 mt-0.5">{(cvFile.size / 1024).toFixed(0)} Ko</p></>
                        ) : (
                          <><div className="text-3xl mb-2">📄</div>
                          <p className="text-sm font-medium text-white">Glissez votre CV ici</p>
                          <p className="text-xs text-slate-500 mt-1">ou cliquez · PDF max 2 Mo</p></>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-300">Lien de l'offre</label>
                      <input type="url" value={offerUrl} onChange={(e) => setOfferUrl(e.target.value)}
                        placeholder="https://welcometothejungle.com/..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors text-sm" />
                      <p className="text-xs text-slate-500">WTTJ, Indeed, APEC, sites entreprises...</p>
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
                      <div className="bg-slate-900 rounded-xl p-6">
                        <h3 className="text-sm font-semibold text-slate-300 mb-4">Votre profil</h3>
                        <CandidateProfileForm candidateData={candidateData} setCandidateData={setCandidateData} />
                      </div>
                    )}
                  </div>
                )}

                {/* Mode Formulaire */}
                {inputMode === 'form' && (
                  <div className="space-y-5">
                    <div className="flex border-b border-slate-800">
                      {[{ key: 'offer', label: '📋 Offre' }, { key: 'profile', label: '👤 Profil' }].map(t => (
                        <button key={t.key} onClick={() => setCurrentTab(t.key)}
                          className={`px-5 py-3 font-semibold text-sm border-b-2 transition-colors -mb-px ${
                            currentTab === t.key ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                          }`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <div className="bg-slate-900 rounded-xl p-6">
                      {currentTab === 'offer' && <OfferForm offerData={offerData} setOfferData={setOfferData} />}
                      {currentTab === 'profile' && <CandidateProfileForm candidateData={candidateData} setCandidateData={setCandidateData} />}
                    </div>
                    {currentTab === 'offer' && (
                      <button onClick={() => setCurrentTab('profile')}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors">
                        Suivant : Votre profil →
                      </button>
                    )}
                  </div>
                )}

                {/* Documents à générer */}
                <div className="bg-slate-900 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Documents à générer</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'generatePersonalizedCV', label: 'CV Personnalisé', desc: 'Votre CV adapté à l\'offre', color: 'pink' },
                      { key: 'generateIdealCV', label: 'CV Idéal', desc: 'Profil parfait recherché', color: 'purple' },
                      { key: 'generateCoverLetter', label: 'Lettre de motivation', desc: 'Lettre sur mesure', color: 'blue' },
                    ].map(d => (
                      <label key={d.key}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          generateOptions[d.key] ? 'border-slate-500 bg-slate-800' : 'border-slate-700 hover:border-slate-600'
                        }`}>
                        <input type="checkbox" checked={generateOptions[d.key]}
                          onChange={(e) => setGenerateOptions({ ...generateOptions, [d.key]: e.target.checked })}
                          className="mt-0.5 accent-pink-500" />
                        <div>
                          <div className="font-semibold text-white text-xs">{d.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{d.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                    <p className="text-sm text-red-300">{error}</p>
                    <button onClick={() => setError('')} className="mt-2 text-xs text-red-400 underline">Fermer</button>
                  </div>
                )}

                {processing ? (
                  <div className="space-y-3 bg-slate-900 rounded-xl p-6 text-center">
                    <CatLoadingAnimation label={processingLabel} />
                    <div className="relative w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-slate-500">⏱️ 30 à 90 secondes</p>
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

            {/* ── STEP 3 : Design ────────────────────────────────────────── */}
            {step === 3 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-xl font-semibold text-center text-white">Choisissez le design de votre CV</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-3">Mise en page</h3>
                    <CVShapeSelector selected={selectedShape} onSelect={setSelectedShape} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-3">Couleurs</h3>
                    <CVStyleSelector selected={selectedStyle} onSelect={setSelectedStyle} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 transition-colors text-sm font-medium">← Retour</button>
                  <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-xl bg-primary text-slate-900 font-semibold hover:brightness-110 transition-all text-sm">Éditer les blocs →</button>
                </div>
              </div>
            )}

            {/* ── STEP 4 : Édition des blocs ─────────────────────────────── */}
            {step === 4 && cvDataOptimized && (
              <div className="flex gap-4 items-start">
                {/* Panel gauche */}
                <div className="w-80 shrink-0 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-300">Sections du CV</h3>
                  <div className="space-y-1">
                    {blockOrder.map((key, idx) => (
                      <div key={key} onClick={() => setActiveBlock(key)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          activeBlock === key ? 'bg-primary/20 border border-primary/40' : 'bg-slate-800 hover:bg-slate-700'
                        }`}>
                        <span className="text-sm">{BLOCK_LABELS[key]?.icon} {BLOCK_LABELS[key]?.label}</span>
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); moveBlock(key, 'up'); }} disabled={idx === 0}
                            className="text-xs px-1 disabled:opacity-20 hover:text-white text-slate-500">↑</button>
                          <button onClick={(e) => { e.stopPropagation(); moveBlock(key, 'down'); }} disabled={idx === blockOrder.length - 1}
                            className="text-xs px-1 disabled:opacity-20 hover:text-white text-slate-500">↓</button>
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
                    <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 transition-colors text-sm">← Design</button>
                    <button onClick={() => setStep(5)} className="flex-1 py-2.5 rounded-xl bg-primary text-slate-900 font-semibold hover:brightness-110 transition-all text-sm">Générer →</button>
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
                <div className="bg-slate-900 rounded-xl p-5 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-1">Design</p>
                    <p className="font-semibold text-white capitalize">{selectedShape?.label} · <span className="text-primary">{selectedStyle?.label}</span></p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: scoreMatching >= 75 ? '#22c55e' : scoreMatching >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {scoreMatching}
                    </div>
                    <p className="text-xs text-slate-500">score</p>
                  </div>
                </div>

                {/* Prévisualisation finale */}
                {generatedConfig && (
                  <div className="flex justify-center">
                    <CVPreview cvData={generatedConfig.cvData} buildConfig={generatedConfig.buildConfig} scale={0.55} />
                  </div>
                )}

                {/* Boutons téléchargement */}
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
                  <div className="space-y-3">
                    <button onClick={handleGenerateCV}
                      className="w-full py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-primary hover:text-primary transition-colors text-sm font-medium">
                      Re-télécharger le CV personnalisé
                    </button>
                    {matchResults?.idealCV && (
                      <button onClick={() => downloadGeneratedCV(matchResults.idealCV)}
                        className="w-full py-3 rounded-xl border border-purple-800/60 text-purple-400 hover:bg-purple-950/20 transition-colors text-sm font-medium">
                        Télécharger le CV Idéal
                      </button>
                    )}
                    {matchResults?.coverLetter && (
                      <button onClick={() => downloadGeneratedCV(matchResults.coverLetter)}
                        className="w-full py-3 rounded-xl border border-blue-800/60 text-blue-400 hover:bg-blue-950/20 transition-colors text-sm font-medium">
                        Télécharger la Lettre de Motivation
                      </button>
                    )}
                  </div>
                )}

                {/* Save candidature */}
                {generatedConfig && !applicationSaved && (
                  <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
                    <h3 className="text-sm font-semibold text-white mb-1">Suivre cette candidature</h3>
                    <p className="text-xs text-slate-400 mb-3">Ajoutez-la à votre tableau de suivi.</p>
                    <button onClick={handleSaveApplication}
                      className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-colors">
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
                  <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 transition-colors text-sm">← Modifier</button>
                  <button onClick={handleReset} className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 transition-colors text-sm">Nouvelle analyse</button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
