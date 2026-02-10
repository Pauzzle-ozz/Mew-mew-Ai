'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfferMatcher } from '@/hooks/useOfferMatcher';
import OfferForm from '@/components/matcher/OfferForm';
import CandidateProfileForm from '@/components/matcher/CandidateProfileForm';
import MatcherResults from '@/components/matcher/MatcherResults';

export default function MatcherOffresPage() {
  useAuth();

  // Mode de la page : 'rapide' ou 'detaille'
  const [pageMode, setPageMode] = useState('rapide');

  // ─── MODE RAPIDE ───────────────────────────────────────────────
  const [cvFile, setCvFile] = useState(null);
  const [offerUrl, setOfferUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ─── MODE DÉTAILLÉ (saisie manuelle uniquement) ───────────────
  const [currentTab, setCurrentTab] = useState('offer');
  const [offerData, setOfferData] = useState({
    title: '', company: '', location: '', contract_type: '', salary: '', description: ''
  });
  const [candidateData, setCandidateData] = useState({
    prenom: '', nom: '', titre_poste: '', email: '', telephone: '', adresse: '', linkedin: '',
    experiences: [], formations: [], competences_techniques: '', competences_soft: '', langues: ''
  });

  // ─── OPTIONS COMMUNES ─────────────────────────────────────────
  const [generateOptions, setGenerateOptions] = useState({
    generatePersonalizedCV: true,
    generateIdealCV: true,
    generateCoverLetter: true
  });

  const { isLoading, results, error, progress, currentStep, analyze, generateComplete, reset } = useOfferMatcher();

  // ─── HANDLERS MODE RAPIDE ─────────────────────────────────────

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') setCvFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) setCvFile(file);
  };

  const handleRapideSubmit = async (e) => {
    e.preventDefault();
    await generateComplete(cvFile, offerUrl, generateOptions);
  };

  // ─── HANDLERS MODE DÉTAILLÉ ───────────────────────────────────

  const handleDetailleSubmit = async (e) => {
    e.preventDefault();
    await analyze(offerData, candidateData, generateOptions);
  };

  const handleReset = () => {
    reset();
    setCvFile(null);
    setOfferUrl('');
    setCurrentTab('offer');
  };

  // ─── RÉSULTATS ────────────────────────────────────────────────

  if (results) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Nouvelle analyse</span>
            </button>
          </div>
          <MatcherResults results={results} />
        </div>
      </div>
    );
  }

  // ─── SÉLECTEUR DE DOCUMENTS (partagé entre les 2 modes) ───────

  const DocumentSelector = () => (
    <div className="bg-gray-900 rounded-xl p-6 space-y-4">
      <h3 className="text-base font-semibold text-white">Documents à générer</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
          generateOptions.generatePersonalizedCV ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'
        }`}>
          <input
            type="checkbox"
            checked={generateOptions.generatePersonalizedCV}
            onChange={(e) => setGenerateOptions({ ...generateOptions, generatePersonalizedCV: e.target.checked })}
            className="w-5 h-5 rounded border-gray-600 text-pink-600 mt-0.5"
          />
          <div>
            <div className="font-semibold text-white text-sm">CV personnalisé</div>
            <div className="text-xs text-gray-400 mt-0.5">Votre CV optimisé pour cette offre</div>
          </div>
        </label>

        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
          generateOptions.generateIdealCV ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'
        }`}>
          <input
            type="checkbox"
            checked={generateOptions.generateIdealCV}
            onChange={(e) => setGenerateOptions({ ...generateOptions, generateIdealCV: e.target.checked })}
            className="w-5 h-5 rounded border-gray-600 text-purple-600 mt-0.5"
          />
          <div>
            <div className="font-semibold text-white text-sm">CV idéal</div>
            <div className="text-xs text-gray-400 mt-0.5">Le profil recherché par l'employeur</div>
          </div>
        </label>

        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
          generateOptions.generateCoverLetter ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'
        }`}>
          <input
            type="checkbox"
            checked={generateOptions.generateCoverLetter}
            onChange={(e) => setGenerateOptions({ ...generateOptions, generateCoverLetter: e.target.checked })}
            className="w-5 h-5 rounded border-gray-600 text-blue-600 mt-0.5"
          />
          <div>
            <div className="font-semibold text-white text-sm">Lettre de motivation</div>
            <div className="text-xs text-gray-400 mt-0.5">Lettre personnalisée pour l'offre</div>
          </div>
        </label>
      </div>

      {!generateOptions.generatePersonalizedCV && !generateOptions.generateIdealCV && !generateOptions.generateCoverLetter && (
        <p className="text-sm text-yellow-400">Sélectionnez au moins un document</p>
      )}
    </div>
  );

  // ─── BARRE DE PROGRESSION (partagée) ──────────────────────────

  const ProgressBar = () => (
    <div className="bg-gray-900 rounded-xl p-8 space-y-4 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        <span className="text-lg font-semibold text-white">{currentStep}</span>
      </div>
      <div className="relative w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">{progress}% complété</p>
      <p className="text-xs text-gray-500">⏱️ Cette opération peut prendre 30 à 90 secondes</p>
    </div>
  );

  // ─── MESSAGE D'ERREUR (partagé) ───────────────────────────────

  const ErrorMessage = () => (
    <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">❌</span>
        <div className="flex-1">
          <h3 className="font-semibold text-red-400 mb-1">Erreur</h3>
          <p className="text-sm text-gray-300">{error}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            Matcher d'Offres
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Uploadez votre CV et collez le lien d'une offre — l'IA génère vos documents en quelques secondes.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex bg-gray-900 rounded-lg p-1 gap-1">
            <button
              type="button"
              onClick={() => setPageMode('rapide')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                pageMode === 'rapide' ? 'bg-pink-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚡ Mode Rapide
            </button>
            <button
              type="button"
              onClick={() => setPageMode('detaille')}
              className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                pageMode === 'detaille' ? 'bg-pink-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              ✏️ Mode Détaillé
            </button>
          </div>
        </div>

        {/* ─── MODE RAPIDE ─────────────────────────────────────── */}
        {pageMode === 'rapide' && (
          <form onSubmit={handleRapideSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Upload CV */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Votre CV (PDF)</label>
                <div
                  className={`relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    isDragging
                      ? 'border-pink-500 bg-pink-500/10'
                      : cvFile
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  {cvFile ? (
                    <>
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-sm font-medium text-green-400">{cvFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(cvFile.size / 1024).toFixed(0)} Ko · Cliquez pour changer
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">📄</div>
                      <p className="text-sm font-medium text-white">Glissez votre CV ici</p>
                      <p className="text-xs text-gray-500 mt-1">ou cliquez pour choisir · PDF max 2 Mo</p>
                    </>
                  )}
                </div>
              </div>

              {/* URL de l'offre */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Lien de l'offre d'emploi</label>
                <div className="flex flex-col h-full">
                  <input
                    type="url"
                    value={offerUrl}
                    onChange={(e) => setOfferUrl(e.target.value)}
                    placeholder="https://welcometothejungle.com/..."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Fonctionne avec Welcome to the Jungle, Indeed, Apec, JobTeaser, sites entreprises...
                  </p>
                  <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                    <p className="text-xs text-yellow-400">
                      ⚠️ LinkedIn et Glassdoor bloquent le scraping — utilisez le Mode Détaillé pour ces sites.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents à générer */}
            <DocumentSelector />

            {/* Bouton Générer */}
            {!isLoading && !error && (
              <button
                type="submit"
                disabled={isLoading || !cvFile || !offerUrl}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all duration-300 text-lg"
              >
                ⚡ Générer mes documents
              </button>
            )}

            {isLoading && <ProgressBar />}
            {error && <ErrorMessage />}
          </form>
        )}

        {/* ─── MODE DÉTAILLÉ ───────────────────────────────────── */}
        {pageMode === 'detaille' && (
          <form onSubmit={handleDetailleSubmit} className="space-y-6">

            {/* Documents à générer */}
            <DocumentSelector />

            {/* Onglets offre / profil */}
            <div className="flex items-center gap-4 border-b border-gray-800">
              <button
                type="button"
                onClick={() => setCurrentTab('offer')}
                className={`px-5 py-3 font-semibold border-b-2 transition-colors ${
                  currentTab === 'offer' ? 'border-pink-500 text-pink-500' : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                📋 Offre d'emploi
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('profile')}
                className={`px-5 py-3 font-semibold border-b-2 transition-colors ${
                  currentTab === 'profile' ? 'border-pink-500 text-pink-500' : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                👤 Votre profil
              </button>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              {currentTab === 'offer' && (
                <OfferForm offerData={offerData} setOfferData={setOfferData} />
              )}

              {currentTab === 'profile' && (
                <CandidateProfileForm candidateData={candidateData} setCandidateData={setCandidateData} />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {currentTab === 'profile' && (
                <button
                  type="button"
                  onClick={() => setCurrentTab('offer')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  ← Retour à l'offre
                </button>
              )}

              {currentTab === 'offer' && (
                <button
                  type="button"
                  onClick={() => setCurrentTab('profile')}
                  className="ml-auto px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
                >
                  Suivant : Votre profil →
                </button>
              )}

              {currentTab === 'profile' && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-300"
                >
                  {isLoading ? 'Analyse en cours...' : 'Générer les documents'}
                </button>
              )}
            </div>

            {isLoading && <ProgressBar />}
            {error && <ErrorMessage />}
          </form>
        )}

        {/* Cards info bas de page */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-xl p-5 space-y-1">
            <div className="text-2xl">⚡</div>
            <h3 className="font-semibold text-white text-sm">Rapide</h3>
            <p className="text-xs text-gray-400">Documents générés en moins d'une minute</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 space-y-1">
            <div className="text-2xl">🎯</div>
            <h3 className="font-semibold text-white text-sm">Personnalisé</h3>
            <p className="text-xs text-gray-400">Chaque document adapté spécifiquement à l'offre</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 space-y-1">
            <div className="text-2xl">✨</div>
            <h3 className="font-semibold text-white text-sm">Professionnel</h3>
            <p className="text-xs text-gray-400">Templates optimisés ATS et formats standards</p>
          </div>
        </div>

      </div>
    </div>
  );
}
