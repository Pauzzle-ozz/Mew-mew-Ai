const aiService = require('./aiService');
const documentParser = require('./documentParserService');
const { buildDeclarationsPrompt, buildCalendrierPrompt, buildControlePrompt, buildQuestionPrompt } = require('../prompts/fiscaliteAssistant');
const { declarationToJSON, calendrierToJSON, controleToJSON, questionToJSON } = require('../prompts/fiscaliteJsonSchemas');

/**
 * Service assistant fiscal
 * Declarations, calendrier, preparation controle, questions
 */
class FiscaliteAssistantService {

  /**
   * Preparer une declaration fiscale
   */
  async preparerDeclaration(data, file) {
    console.log(`📋 [FiscaliteAssistant] Preparation declaration ${data.type_declaration}`);

    if (!data.type_declaration) {
      throw new Error('Le type de declaration est requis');
    }

    const validTypes = ['tva_ca3', 'tva_ca12', 'is', 'ir', 'cfe', 'cvae', 'das2'];
    if (!validTypes.includes(data.type_declaration)) {
      throw new Error(`Type de declaration invalide. Types acceptes : ${validTypes.join(', ')}`);
    }

    let documentText = '';
    if (file) {
      console.log(`📄 [FiscaliteAssistant] Parsing document : ${file.originalname}`);
      const parsed = await documentParser.parseDocument(file);
      documentText = documentParser.formatForAI(parsed);
    }

    const genPrompt = buildDeclarationsPrompt({ ...data, documentText });
    const jsonPrompt = declarationToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.2, maxTokens: 5000 },
      { model: 'gpt-4.1-mini', maxTokens: 6000 }
    );

    console.log(`✅ [FiscaliteAssistant] Declaration ${data.type_declaration} preparee`);
    return result;
  }

  /**
   * Generer un calendrier fiscal personnalise
   */
  async genererCalendrier(data) {
    console.log(`📅 [FiscaliteAssistant] Generation calendrier fiscal pour ${data.statut_juridique || 'profil non precise'}`);

    if (!data.statut_juridique) {
      throw new Error('Le statut juridique est requis pour generer le calendrier');
    }

    const genPrompt = buildCalendrierPrompt(data);
    const jsonPrompt = calendrierToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.2, maxTokens: 5000 },
      { model: 'gpt-4.1-mini', maxTokens: 6000 }
    );

    console.log(`✅ [FiscaliteAssistant] Calendrier genere : ${result.echeances?.length || 0} echeances`);
    return result;
  }

  /**
   * Preparer un controle fiscal
   */
  async preparerControle(data, file) {
    console.log(`🛡️ [FiscaliteAssistant] Preparation controle fiscal`);

    let documentText = '';
    if (file) {
      console.log(`📄 [FiscaliteAssistant] Parsing document : ${file.originalname}`);
      const parsed = await documentParser.parseDocument(file);
      documentText = documentParser.formatForAI(parsed);
    }

    const genPrompt = buildControlePrompt({ ...data, documentText });
    const jsonPrompt = controleToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.3, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    console.log(`✅ [FiscaliteAssistant] Preparation controle terminee - Risque: ${result.niveau_risque}/100`);
    return result;
  }

  /**
   * Repondre a une question fiscale
   */
  async repondreQuestion(question, contexte) {
    console.log(`❓ [FiscaliteAssistant] Question fiscale recue`);

    if (!question || typeof question !== 'string' || !question.trim()) {
      throw new Error('La question est requise');
    }

    const genPrompt = buildQuestionPrompt(question.trim(), contexte);
    const jsonPrompt = questionToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.3, maxTokens: 4000 },
      { model: 'gpt-4.1-mini', maxTokens: 5000 }
    );

    console.log(`✅ [FiscaliteAssistant] Reponse generee`);
    return result;
  }
}

module.exports = new FiscaliteAssistantService();
