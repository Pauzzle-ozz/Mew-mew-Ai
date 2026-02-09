import { useState } from 'react';
import { analyzeOffer } from '@/lib/api/matcherApi';

/**
 * Hook pour gérer le matching candidat-offre
 * Gère les états de chargement, résultats et erreurs
 */
export function useOfferMatcher() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  /**
   * Analyser l'offre et générer les documents
   */
  const analyze = async (offerData, candidateProfile, options = {}) => {
    try {
      // Reset
      setIsLoading(true);
      setError(null);
      setResults(null);
      setProgress(0);

      // Validation
      if (!offerData.title || !offerData.company || !offerData.description) {
        throw new Error('Veuillez remplir tous les champs obligatoires de l\'offre');
      }

      if (!candidateProfile.prenom || !candidateProfile.nom || !candidateProfile.titre_poste) {
        throw new Error('Veuillez remplir tous les champs obligatoires du profil');
      }

      // Validation options (au moins un document doit être sélectionné)
      const { generatePersonalizedCV, generateIdealCV, generateCoverLetter } = options;
      if (!generatePersonalizedCV && !generateIdealCV && !generateCoverLetter) {
        throw new Error('Veuillez sélectionner au moins un document à générer');
      }

      // Étapes de progression
      setCurrentStep('Envoi des données au serveur...');
      setProgress(10);

      await new Promise(resolve => setTimeout(resolve, 300));

      setCurrentStep('Analyse de l\'offre par l\'IA...');
      setProgress(30);

      // Appel API avec options
      const response = await analyzeOffer(offerData, candidateProfile, options);

      setCurrentStep('Génération des documents...');
      setProgress(60);

      await new Promise(resolve => setTimeout(resolve, 300));

      setCurrentStep('Finalisation...');
      setProgress(95);

      await new Promise(resolve => setTimeout(resolve, 300));

      // Succès
      setResults(response.data);
      setProgress(100);
      setCurrentStep('Documents générés avec succès !');

      console.log('✅ [useOfferMatcher] Analyse terminée:', response.data);

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
   * Reset les résultats
   */
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
    reset
  };
}
