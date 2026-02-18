import { useState } from 'react';
import { cvApi } from '@/lib/api/cvApi';

/**
 * Hook personnalisé pour l'optimisation de CV
 * Gère l'état et la logique d'optimisation (formulaire + PDF)
 */
export function useCVOptimizer() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Optimiser un CV via formulaire structuré
   */
  const optimizeWithForm = async (cvData, userId) => {
    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await cvApi.optimizeCVForm(cvData, userId);

      if (response.success) {
        setResult(response.data);
        return response.data.cvData_optimise;
      } else {
        throw new Error(response.error || 'Erreur lors de l\'optimisation');
      }
    } catch (err) {
      console.error('[useCVOptimizer] Erreur:', err);

      let errorMessage = 'Une erreur est survenue lors de l\'optimisation';

      if (err.message.includes('indisponible') || err.message.includes('surchargé')) {
        errorMessage = 'Service d\'optimisation temporairement indisponible. Réessayez dans quelques instants.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'L\'optimisation a pris trop de temps. Réessayez.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  /**
   * Optimiser un CV via upload PDF
   */
  const optimizeWithPDF = async (file, userId) => {
    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await cvApi.optimizeCVPDF(file, userId);

      if (response.success) {
        setResult(response.data);
        return response.data.cvData_optimise;
      } else {
        throw new Error(response.error || 'Erreur lors de l\'optimisation du PDF');
      }
    } catch (err) {
      console.error('[useCVOptimizer] Erreur PDF:', err);

      let errorMessage = 'Erreur lors de l\'optimisation du CV';

      if (err.message.includes('indisponible')) {
        errorMessage = 'Service d\'optimisation indisponible.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Impossible de contacter le serveur.';
      }

      setError(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  /**
   * Réinitialiser les résultats
   */
  const reset = () => {
    setResult(null);
    setError(null);
    setProcessing(false);
  };

  return {
    processing,
    result,
    error,
    optimizeWithForm,
    optimizeWithPDF,
    reset
  };
}
