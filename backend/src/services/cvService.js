const aiService = require('./aiService');
const { buildPrompt: buildAnalyseFormPrompt } = require('../prompts/analyseCvForm');
const { buildPrompt: buildAnalysePdfPrompt } = require('../prompts/analyseCvPdf');
const { buildPrompt: buildOptimiseFormPrompt } = require('../prompts/optimiseCvForm');
const { buildPrompt: buildOptimisePdfPrompt } = require('../prompts/optimiseCvPdf');
const { buildPrompt: buildFilterCvPrompt } = require('../prompts/filterCv');
const { analysisToJSON, cvToJSON } = require('../prompts/jsonSchemas');

/**
 * Service de gestion des CV
 * Centralise toute la logique métier liée aux CV
 */
class CVService {
  /**
   * Normaliser le nom de categorie retourne par l'IA
   * Evite les problemes d'accents ou de casse
   */
  normalizeCategorie(categorie) {
    if (!categorie) return 'Correspond a mes competences';
    const normalized = categorie
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
      .toLowerCase()
      .trim();
    if (normalized.includes('pourrais tenter') || normalized.includes('pourrait tenter')) {
      return 'Je pourrais tenter';
    }
    return 'Correspond a mes competences';
  }

  /**
   * Valider les données d'un CV
   */
  validateCVData(cvData) {
    if (!cvData) {
      throw new Error('Données du CV requises');
    }

    if (!cvData.prenom || !cvData.nom || !cvData.titre_poste) {
      throw new Error('Prénom, nom et titre du poste sont obligatoires');
    }

    return true;
  }

  /**
   * Analyser un CV avec formulaire structuré
   */
  async analyzeCV(cvData) {
    console.log('🔍 [CVService] Analyse du CV:', cvData.prenom, cvData.nom);

    // Etape 1 : analyse par l'IA
    const analysisPrompt = buildAnalyseFormPrompt(cvData);
    const analysisText = await aiService.generate(analysisPrompt, { model: 'gpt-4.1-mini' });

    // Etape 2 : conversion en JSON
    const jsonPrompt = analysisToJSON(analysisText);
    const parsed = await aiService.generateJSON(jsonPrompt, { model: 'gpt-4.1-mini' });

    // Formatage de la reponse
    const metiers = (parsed.metiers || []).map(m => ({
      ...m,
      categorie: this.normalizeCategorie(m.categorie)
    }));

    return {
      success: true,
      profil: {
        prenom: cvData.prenom || 'Non spécifié',
        nom: cvData.nom || 'Non spécifié',
        niveau_experience: cvData.niveau_experience || 'Non spécifié',
        type_poste: cvData.type_poste || 'Non spécifié'
      },
      metiers_proposes: metiers,
      competences_cles: parsed.competences_cles || [],
      mots_cles_recherche: parsed.mots_cles_recherche || [],
      message: 'Analyse terminée avec succès',
      nombre_metiers: metiers.length
    };
  }

  /**
   * Analyser un CV à partir d'un PDF
   */
  async analyzePDF(cvText, numPages, userId) {
    console.log('🔍 [CVService] Analyse PDF, pages:', numPages);

    // Etape 1 : analyse par l'IA
    const analysisPrompt = buildAnalysePdfPrompt(cvText, numPages);
    const analysisText = await aiService.generate(analysisPrompt, { model: 'gpt-4.1-mini' });

    // Etape 2 : conversion en JSON
    const jsonPrompt = analysisToJSON(analysisText);
    const parsed = await aiService.generateJSON(jsonPrompt, { model: 'gpt-4.1-mini' });

    const metiers = (parsed.metiers || []).map(m => ({
      ...m,
      categorie: this.normalizeCategorie(m.categorie)
    }));

    return {
      success: true,
      profil: {
        prenom: 'Extrait du CV',
        nom: 'PDF',
        niveau_experience: 'Analysé automatiquement',
        type_poste: 'Identifié par l\'IA'
      },
      metiers_proposes: metiers,
      competences_cles: parsed.competences_cles || [],
      mots_cles_recherche: parsed.mots_cles_recherche || [],
      message: 'Analyse terminée avec succès',
      nombre_metiers: metiers.length
    };
  }

  /**
   * Optimiser un CV via formulaire structuré
   */
  async optimizeCVForm(cvData, userId, posteCible) {
    console.log('🤖 [CVService] Optimisation CV formulaire:', cvData.prenom, cvData.nom);

    this.validateCVData(cvData);

    // Etape 1 : optimisation par l'IA
    const optimPrompt = buildOptimiseFormPrompt(cvData, posteCible);
    const optimizedText = await aiService.generate(optimPrompt, { model: 'gpt-4.1-mini' });

    // Etape 2 : conversion en JSON
    const jsonPrompt = cvToJSON(optimizedText);
    const parsed = await aiService.generateJSON(jsonPrompt, { model: 'gpt-4.1-mini' });

    return {
      success: true,
      cvData_optimise: parsed,
      score_ats: parsed.score_ats || null,
      points_forts: parsed.points_forts || [],
      ameliorations: parsed.ameliorations || [],
      message: 'CV optimisé avec succès (formulaire)'
    };
  }

  /**
   * Optimiser un CV via PDF
   */
  async optimizeCVPdf(cvText, numPages, userId, posteCible) {
    console.log('🤖 [CVService] Optimisation CV PDF, pages:', numPages);

    // Etape 1 : extraction + optimisation par l'IA
    const optimPrompt = buildOptimisePdfPrompt(cvText, numPages, posteCible);
    const optimizedText = await aiService.generate(optimPrompt, { model: 'gpt-4.1-mini' });

    // Etape 2 : conversion en JSON
    const jsonPrompt = cvToJSON(optimizedText);
    const parsed = await aiService.generateJSON(jsonPrompt, { model: 'gpt-4.1-mini' });

    return {
      success: true,
      cvData_optimise: parsed,
      score_ats: parsed.score_ats || null,
      points_forts: parsed.points_forts || [],
      ameliorations: parsed.ameliorations || [],
      message: 'CV optimisé avec succès (PDF)'
    };
  }
  /**
   * Filtrer un CV enrichi pour le condenser (étape 2 du pipeline)
   */
  async filterCV(cvData, sections) {
    console.log('🔄 [CVService] Filtrage CV enrichi...', sections?.length ? `sections: ${sections.join(', ')}` : 'toutes sections');

    const filterPrompt = buildFilterCvPrompt(cvData, sections);
    const filtered = await aiService.generateJSON(filterPrompt, { model: 'gpt-4.1-mini' });

    console.log('✅ [CVService] CV filtré avec succès');
    return {
      success: true,
      cvData_filtre: filtered,
      message: 'CV filtré avec succès'
    };
  }
}

module.exports = new CVService();
