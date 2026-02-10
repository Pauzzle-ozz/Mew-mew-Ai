'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfferMatcher } from '@/hooks/useOfferMatcher';
import OfferForm from '@/components/matcher/OfferForm';
import CandidateProfileForm from '@/components/matcher/CandidateProfileForm';
import MatcherResults from '@/components/matcher/MatcherResults';
import UrlScraper from '@/components/matcher/UrlScraper';

/**
 * Page Matcher d'Offres
 * Permet de matcher un profil candidat avec une offre d'emploi
 * et de générer 3 documents : CV personnalisé, CV idéal, lettre de motivation
 */
export default function MatcherOffresPage() {
  // Authentification
  useAuth();

  // État du formulaire
  const [currentTab, setCurrentTab] = useState('offer'); // 'offer' ou 'profile'
  const [offerInputMode, setOfferInputMode] = useState('url'); // 'url' ou 'manual'
  const [scrapedFields, setScrapedFields] = useState(null); // champs pré-remplis par le scraping
  const [scraperData, setScraperData] = useState(null); // { rawText, url } stocké après scraping

  // Options de génération des documents
  const [generateOptions, setGenerateOptions] = useState({
    generatePersonalizedCV: true,
    generateIdealCV: true,
    generateCoverLetter: true
  });

  // Données de l'offre
  const [offerData, setOfferData] = useState({
    title: '',
    company: '',
    location: '',
    contract_type: '',
    salary: '',
    description: ''
  });

  // Données du candidat
  const [candidateData, setCandidateData] = useState({
    prenom: '',
    nom: '',
    titre_poste: '',
    email: '',
    telephone: '',
    adresse: '',
    linkedin: '',
    experiences: [],
    formations: [],
    competences_techniques: '',
    competences_soft: '',
    langues: ''
  });

  // Hook de matching
  const { isLoading, results, error, progress, currentStep, analyze, analyzeScraper, reset } = useOfferMatcher();

  // Soumettre le formulaire (mode formulaire OU mode scraper)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (scraperData) {
      // Mode scraper : envoyer le rawText aux workflows scraper
      await analyzeScraper(scraperData.rawText, scraperData.url, candidateData, generateOptions);
    } else {
      // Mode formulaire : envoyer les données structurées aux workflows matcher
      await analyze(offerData, candidateData, generateOptions);
    }
  };

  // Recommencer
  const handleReset = () => {
    reset();
    setCurrentTab('offer');
    setScrapedFields(null);
    setScraperData(null);
  };

  // Callback quand le scraping est terminé → stocker rawText + pré-remplir le formulaire
  const handleScrapingComplete = (data) => {
    // Stocker le rawText pour l'envoyer aux workflows scraper lors du submit
    setScraperData({ rawText: data.rawText, url: data.url });

    // Pré-remplir le formulaire avec les données basiques extraites localement
    const basic = data.basicOffer || {};
    setOfferData(prev => ({
      title: basic.title || prev.title,
      company: basic.company || prev.company,
      location: basic.location || prev.location,
      contract_type: basic.contract_type || prev.contract_type,
      salary: basic.salary || prev.salary,
      description: basic.description || prev.description,
    }));

    setScrapedFields(basic);
    // Basculer en saisie manuelle pour que l'utilisateur voie le formulaire pré-rempli
    setOfferInputMode('manual');
  };

  // Si résultats affichés
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

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            Matcher d'Offres
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Analysez une offre d'emploi et générez automatiquement 3 documents professionnels :
            <br />
            <strong className="text-white">CV personnalisé</strong> • <strong className="text-white">CV idéal</strong> • <strong className="text-white">Lettre de motivation</strong>
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Options de génération */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📄</span>
              <span>Documents à générer</span>
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Sélectionnez les documents que vous souhaitez recevoir
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CV Personnalisé */}
              <label className={`relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                generateOptions.generatePersonalizedCV
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}>
                <input
                  type="checkbox"
                  checked={generateOptions.generatePersonalizedCV}
                  onChange={(e) => setGenerateOptions({ ...generateOptions, generatePersonalizedCV: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-pink-600 focus:ring-pink-500 focus:ring-offset-0 focus:ring-2 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">CV personnalisé</div>
                  <div className="text-xs text-gray-400">
                    Votre CV optimisé pour cette offre
                  </div>
                </div>
              </label>

              {/* CV Idéal */}
              <label className={`relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                generateOptions.generateIdealCV
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}>
                <input
                  type="checkbox"
                  checked={generateOptions.generateIdealCV}
                  onChange={(e) => setGenerateOptions({ ...generateOptions, generateIdealCV: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-2 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">CV idéal</div>
                  <div className="text-xs text-gray-400">
                    Le profil recherché par l'employeur
                  </div>
                </div>
              </label>

              {/* Lettre de motivation */}
              <label className={`relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                generateOptions.generateCoverLetter
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}>
                <input
                  type="checkbox"
                  checked={generateOptions.generateCoverLetter}
                  onChange={(e) => setGenerateOptions({ ...generateOptions, generateCoverLetter: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-2 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">Lettre de motivation</div>
                  <div className="text-xs text-gray-400">
                    Lettre personnalisée pour l'offre
                  </div>
                </div>
              </label>
            </div>

            {/* Alerte si aucun document sélectionné */}
            {!generateOptions.generatePersonalizedCV && !generateOptions.generateIdealCV && !generateOptions.generateCoverLetter && (
              <div className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg text-sm text-yellow-400">
                <span>⚠️</span>
                <span>Veuillez sélectionner au moins un document à générer</span>
              </div>
            )}
          </div>

          {/* Onglets */}
          <div className="flex items-center gap-4 border-b border-gray-800">
            <button
              type="button"
              onClick={() => setCurrentTab('offer')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                currentTab === 'offer'
                  ? 'border-pink-500 text-pink-500'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              📋 Offre d'emploi
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('profile')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                currentTab === 'profile'
                  ? 'border-pink-500 text-pink-500'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              👤 Votre profil
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="bg-gray-900 rounded-lg p-8">
            {currentTab === 'offer' && (
              <div className="space-y-6">
                {/* Sous-onglets : Lien / Manuel */}
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setOfferInputMode('url')}
                    className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      offerInputMode === 'url'
                        ? 'bg-pink-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🔗 Coller un lien
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfferInputMode('manual')}
                    className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      offerInputMode === 'manual'
                        ? 'bg-pink-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ✏️ Saisie manuelle
                  </button>
                </div>

                {/* Badge données extraites */}
                {scrapedFields && offerInputMode === 'manual' && (
                  <div className="flex items-center gap-2 p-3 bg-pink-900/20 border border-pink-600/30 rounded-lg text-sm text-pink-400">
                    <span>✨</span>
                    <span>Donn\u00e9es extraites automatiquement — V\u00e9rifiez et compl\u00e9tez si besoin</span>
                  </div>
                )}

                {/* Contenu selon le mode */}
                {offerInputMode === 'url' && (
                  <UrlScraper onScrapingComplete={handleScrapingComplete} />
                )}
                {offerInputMode === 'manual' && (
                  <OfferForm offerData={offerData} setOfferData={setOfferData} />
                )}
              </div>
            )}

            {currentTab === 'profile' && (
              <CandidateProfileForm
                candidateData={candidateData}
                setCandidateData={setCandidateData}
              />
            )}
          </div>

          {/* Navigation entre onglets */}
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
                className="ml-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? 'Analyse en cours...' : 'Générer les documents'}
              </button>
            )}
          </div>

          {/* Barre de progression */}
          {isLoading && (
            <div className="bg-gray-900 rounded-lg p-8 space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <span className="text-lg font-semibold text-white">{currentStep}</span>
              </div>

              <div className="relative w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-center text-sm text-gray-400">
                {progress}% complété
              </div>

              <div className="text-center text-xs text-gray-500 space-y-1">
                <p>⏱️ Cette opération peut prendre 30 à 60 secondes</p>
                <p>🤖 L'IA analyse l'offre et génère 3 documents personnalisés</p>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">❌</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-500 mb-2">Erreur</h3>
                  <p className="text-sm text-gray-300">{error}</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Informations complémentaires */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 space-y-2">
            <div className="text-3xl">⚡</div>
            <h3 className="text-lg font-semibold text-white">Rapide</h3>
            <p className="text-sm text-gray-400">
              3 documents générés en moins d'une minute par l'IA
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 space-y-2">
            <div className="text-3xl">🎯</div>
            <h3 className="text-lg font-semibold text-white">Personnalisé</h3>
            <p className="text-sm text-gray-400">
              Chaque document est adapté spécifiquement à l'offre
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 space-y-2">
            <div className="text-3xl">✨</div>
            <h3 className="text-lg font-semibold text-white">Professionnel</h3>
            <p className="text-sm text-gray-400">
              Templates optimisés ATS et formats standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
