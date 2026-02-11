const aiService = require('./aiService');
const { buildPrompt: buildAnalyseFormPrompt } = require('../prompts/analyseCvForm');
const { buildPrompt: buildAnalysePdfPrompt } = require('../prompts/analyseCvPdf');
const { buildPrompt: buildOptimiseFormPrompt } = require('../prompts/optimiseCvForm');
const { buildPrompt: buildOptimisePdfPrompt } = require('../prompts/optimiseCvPdf');
const { analysisToJSON, cvToJSON } = require('../prompts/jsonSchemas');

/**
 * Service de gestion des CV
 * Centralise toute la logique métier liée aux CV
 */
class CVService {
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

    // Formatage de la reponse (identique a ce que n8n retournait)
    return {
      success: true,
      profil: {
        prenom: cvData.prenom || 'Non spécifié',
        nom: cvData.nom || 'Non spécifié',
        niveau_experience: cvData.niveau_experience || 'Non spécifié',
        type_poste: cvData.type_poste || 'Non spécifié'
      },
      metiers_proposes: parsed.metiers || [],
      message: 'Analyse terminée avec succès',
      nombre_metiers: (parsed.metiers || []).length
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

    return {
      success: true,
      profil: {
        prenom: 'Extrait du CV',
        nom: 'PDF',
        niveau_experience: 'Analysé automatiquement',
        type_poste: 'Identifié par l\'IA'
      },
      metiers_proposes: parsed.metiers || [],
      message: 'Analyse terminée avec succès',
      nombre_metiers: (parsed.metiers || []).length
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
}

module.exports = new CVService();
