/**
 * Client API pour le Matcher d'Offres
 * Centralise tous les appels backend pour le matching candidat-offre
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Analyser une offre d'emploi et générer les documents sélectionnés
 * @param {Object} offerData - Données de l'offre d'emploi
 * @param {Object} candidateProfile - Profil du candidat
 * @param {Object} options - Options de génération { generatePersonalizedCV, generateIdealCV, generateCoverLetter }
 * @returns {Promise} - Résultat avec les PDFs demandés
 */
export async function analyzeOffer(offerData, candidateProfile, options = {}, buildConfig = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matcher/analyser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offer: offerData,
        candidate: candidateProfile,
        options,
        buildConfig
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l\'analyse de l\'offre');
    }

    return data;

  } catch (error) {
    console.error('[matcherApi] Erreur:', error);
    throw error;
  }
}

/**
 * Scraper une URL d'offre d'emploi pour extraire les données automatiquement
 * @param {string} url - URL de l'offre d'emploi
 * @returns {Promise} - Données structurées de l'offre { title, company, location, ... }
 */
export async function scrapeOfferUrl(url) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matcher/scraper-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || 'Impossible d\'analyser cette URL');
      error.code = data.code || 'UNKNOWN';
      throw error;
    }

    return data;

  } catch (error) {
    console.error('[matcherApi] Erreur scraping:', error);
    throw error;
  }
}

/**
 * Générer les documents à partir du texte brut scrapé (mode URL)
 * @param {string} rawText - Texte brut de la page web
 * @param {string} url - URL source
 * @param {Object} candidateProfile - Profil du candidat
 * @param {Object} options - Options de génération
 * @returns {Promise} - Résultat avec les PDFs demandés
 */
export async function analyzeScrapedOffer(rawText, url, candidateProfile, options = {}, buildConfig = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matcher/analyser-scraper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rawText,
        url,
        candidate: candidateProfile,
        options,
        buildConfig
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la génération des documents');
    }

    return data;

  } catch (error) {
    console.error('[matcherApi] Erreur scraper:', error);
    throw error;
  }
}

/**
 * Mode Rapide : envoyer le CV PDF + URL de l'offre pour tout générer automatiquement
 * @param {File} cvFile - Fichier PDF du CV
 * @param {string} offerUrl - URL de l'offre d'emploi
 * @param {Object} options - Options de génération { generatePersonalizedCV, generateIdealCV, generateCoverLetter }
 * @returns {Promise} - Résultat avec les PDFs demandés
 */
export async function generateComplete(cvFile, offerUrl, options = {}, buildConfig = {}) {
  try {
    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('offerUrl', offerUrl);
    formData.append('options', JSON.stringify(options));
    formData.append('buildConfig', JSON.stringify(buildConfig));

    const response = await fetch(`${API_BASE_URL}/api/matcher/generer-complet`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || 'Erreur lors de la génération des documents');
      error.code = data.code || 'UNKNOWN';
      throw error;
    }

    return data;

  } catch (error) {
    console.error('[matcherApi] Erreur mode rapide:', error);
    throw error;
  }
}

/**
 * Télécharger tous les documents en ZIP
 * @param {Array} documents - Liste des documents [{pdf: base64, filename: string}]
 * @param {string} zipFilename - Nom du fichier ZIP
 */
export function downloadAllDocuments(documents, zipFilename = 'Candidature_Complete.zip') {
  documents.forEach((doc, index) => {
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${doc.pdf}`;
      link.download = doc.filename;
      link.click();
    }, index * 500);
  });
}

/**
 * Extraire le profil candidat depuis un CV PDF (pour pré-remplir le formulaire)
 * @param {File} cvFile - Fichier PDF du CV
 * @returns {Promise} - Données du candidat extraites { prenom, nom, titre_poste, ... }
 */
export async function extractCandidateFromCVFile(cvFile) {
  try {
    const formData = new FormData();
    formData.append('cv', cvFile);

    const response = await fetch(`${API_BASE_URL}/api/matcher/extraire-candidat-pdf`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Impossible d\'extraire les données du CV');
    }

    return data;

  } catch (error) {
    console.error('[matcherApi] Erreur extraction PDF:', error);
    throw error;
  }
}

/**
 * Mode Découverte : analyser le CV pour trouver les offres correspondantes
 * @param {File} cvFile - Fichier PDF du CV
 * @returns {Promise} - { metiers, offres }
 */
export async function discoverJobs(cvFile) {
  try {
    const formData = new FormData();
    formData.append('cv', cvFile);

    const response = await fetch(`${API_BASE_URL}/api/matcher/decouvrir-offres`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la découverte d\'offres');
    }

    return data;

  } catch (error) {
    console.error('[matcherApi] Erreur découverte:', error);
    throw error;
  }
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
    console.error('[matcherApi] Service indisponible:', error);
    throw error;
  }
}
