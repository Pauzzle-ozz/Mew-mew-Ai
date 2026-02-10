import { useState } from 'react';
import { analyzeOffer, analyzeScrapedOffer } from '@/lib/api/matcherApi';

/**
 * Hook pour gérer le matching candidat-offre
 * Supporte 2 modes : formulaire (offer structurée) et scraper (rawText)
 */
export function useOfferMatcher() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  /**
   * Mode formulaire : analyser l'offre structurée et générer les documents
   */
  const analyze = async (offerData, candidateProfile, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      setResults(null);
      setProgress(0);

      // Validation offre
      if (!offerData.title || !offerData.company || !offerData.description) {
        throw new Error('Veuillez remplir tous les champs obligatoires de l\'offre');
      }

      // Validation candidat
      if (!candidateProfile.prenom || !candidateProfile.nom || !candidateProfile.titre_poste) {
        throw new Error('Veuillez remplir tous les champs obligatoires du profil');
      }

      // Validation options
      const { generatePersonalizedCV, generateIdealCV, generateCoverLetter } = options;
      if (!generatePersonalizedCV && !generateIdealCV && !generateCoverLetter) {
        throw new Error('Veuillez sélectionner au moins un document à générer');
      }

      setCurrentStep('Envoi des données au serveur...');
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 300));

      setCurrentStep('Analyse de l\'offre par l\'IA...');
      setProgress(30);

      const response = await analyzeOffer(offerData, candidateProfile, options);

      setCurrentStep('Génération des documents...');
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));

      setCurrentStep('Finalisation...');
      setProgress(95);
      await new Promise(resolve => setTimeout(resolve, 300));

      setResults(response.data);
      setProgress(100);
      setCurrentStep('Documents générés avec succès !');

    } catch (err) {
      console.error('❌ [useOfferMatcher] Erreur:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'analyse');
      setProgress(0);
      setCurrentStep('');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mode scraper : générer les documents à partir du texte brut scrapé
   */
  const analyzeScraper = async (rawText, url, candidateProfile, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      setResults(null);
      setProgress(0);

      // Validation
      if (!rawText) {
        throw new Error('Texte de l\'offre manquant. Veuillez scraper une URL d\'abord.');
      }

      if (!candidateProfile.prenom || !candidateProfile.nom || !candidateProfile.titre_poste) {
        throw new Error('Veuillez remplir tous les champs obligatoires du profil');
      }

      const { generatePersonalizedCV, generateIdealCV, generateCoverLetter } = options;
      if (!generatePersonalizedCV && !generateIdealCV && !generateCoverLetter) {
        throw new Error('Veuillez sélectionner au moins un document à générer');
      }

      setCurrentStep('Envoi du texte scrapé au serveur...');
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 300));

      setCurrentStep('Extraction de l\'offre et génération par l\'IA...');
      setProgress(25);

      const response = await analyzeScrapedOffer(rawText, url, candidateProfile, options);

      setCurrentStep('Génération des documents...');
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));

      setCurrentStep('Finalisation...');
      setProgress(95);
      await new Promise(resolve => setTimeout(resolve, 300));

      setResults(response.data);
      setProgress(100);
      setCurrentStep('Documents générés avec succès !');

    } catch (err) {
      console.error('❌ [useOfferMatcher] Erreur scraper:', err);
      setError(err.message || 'Une erreur est survenue lors de la génération');
      setProgress(0);
      setCurrentStep('');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
    setProgress(0);
    setCurrentStep('');
  };

  return {
    isLoading,
    results,
    error,
    progress,
    currentStep,
    analyze,
    analyzeScraper,
    reset
  };
}
