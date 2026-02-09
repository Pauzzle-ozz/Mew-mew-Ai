/**
 * Client API pour le Matcher d'Offres
 * Centralise tous les appels backend pour le matching candidat-offre
 */

const API_BASE_URL = 'http://localhost:5000';

/**
 * Analyser une offre d'emploi et générer les documents sélectionnés
 * @param {Object} offerData - Données de l'offre d'emploi
 * @param {Object} candidateProfile - Profil du candidat
 * @param {Object} options - Options de génération { generatePersonalizedCV, generateIdealCV, generateCoverLetter }
 * @returns {Promise} - Résultat avec les PDFs demandés
 */
export async function analyzeOffer(offerData, candidateProfile, options = {}) {
  try {
    console.log('🔍 [matcherApi] Envoi de l\'offre pour analyse...');
    console.log('⚙️ [matcherApi] Options:', options);

    const response = await fetch(`${API_BASE_URL}/api/matcher/analyser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offer: offerData,
        candidate: candidateProfile,
        options: options
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l\'analyse de l\'offre');
    }

    console.log('✅ [matcherApi] Analyse terminée avec succès');
    return data;

  } catch (error) {
    console.error('❌ [matcherApi] Erreur:', error);
    throw error;
  }
}

/**
 * Télécharger tous les documents en ZIP
 * @param {Array} documents - Liste des documents [{pdf: base64, filename: string}]
 * @param {string} zipFilename - Nom du fichier ZIP
 */
export function downloadAllDocuments(documents, zipFilename = 'Candidature_Complete.zip') {
  // Note: Cette fonction nécessitera JSZip pour créer le ZIP côté client
  // Pour l'instant, on télécharge les documents individuellement
  console.log('📦 [matcherApi] Téléchargement de', documents.length, 'documents');

  documents.forEach((doc, index) => {
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${doc.pdf}`;
      link.download = doc.filename;
      link.click();
    }, index * 500); // Délai de 500ms entre chaque téléchargement
  });
}

/**
 * Vérifier la santé du service matcher
 * @returns {Promise} - Status du service
 */
export async function checkMatcherHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matcher/health`);
    return await response.json();
  } catch (error) {
    console.error('❌ [matcherApi] Service indisponible:', error);
    throw error;
  }
}
