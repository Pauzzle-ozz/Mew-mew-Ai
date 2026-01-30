import { useState } from 'react';
import { cvApi } from '@/lib/api/cvApi';

/**
 * Hook personnalisé pour l'optimisation de CV
 * Gère l'état et la logique d'optimisation
 */
export function useCVOptimizer() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const optimizeCV = async (cvData) => {
    setProcessing(true);
    setError(null);

    try {
      console.log('🤖 [useCVOptimizer] Début optimisation...');
      
      const result = await cvApi.optimizeCV(cvData);
      
      console.log('✅ [useCVOptimizer] Optimisation réussie');
      
      if (result.success && result.data.cvData_optimise) {
        return result.data.cvData_optimise;
      } else {
        throw new Error('Données optimisées manquantes');
      }
    } catch (err) {
      console.error('❌ [useCVOptimizer] Erreur:', err);
      
      // Messages d'erreur personnalisés
      let errorMessage = 'Une erreur est survenue lors de l\'optimisation';
      
      if (err.message.includes('indisponible')) {
        errorMessage = '⚠️ Service d\'optimisation indisponible. Vérifiez que n8n est démarré.';
      } else if (err.message.includes('timeout')) {
        errorMessage = '⏱️ L\'optimisation a pris trop de temps. Réessayez.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = '🔌 Impossible de contacter le serveur. Vérifiez que le backend est démarré.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return { optimizeCV, processing, error };
}