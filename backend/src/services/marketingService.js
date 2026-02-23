const aiService = require('./aiService');
const { buildPrompt: buildStrategiePrompt } = require('../prompts/strategieContenu');
const { contentStrategyToJSON } = require('../prompts/marketingJsonSchemas');

/**
 * Service Marketing & Communication
 * Gere la generation de contenu multi-format et les strategies de contenu
 */
class MarketingService {

  /**
   * Valide une configuration de strategie
   */
  validateStrategyInput(input) {
    if (!input || !input.sector || !input.targetAudience || !input.objectives) {
      throw new Error('La strategie doit contenir : sector, targetAudience, objectives');
    }
    if (!input.channels || !Array.isArray(input.channels) || input.channels.length === 0) {
      throw new Error('Selectionnez au moins un canal');
    }
    return true;
  }

  /**
   * Genere une strategie de contenu / calendrier editorial 30 jours
   * Pipeline 2 etapes : GPT-4o creatif → GPT-4.1-mini JSON
   */
  async generateContentStrategy(input) {
    console.log(`📅 [MarketingService] Generation strategie 30 jours pour ${input.channels.length} canaux...`);

    this.validateStrategyInput(input);

    const genPrompt = buildStrategiePrompt(input);

    // Appel direct en JSON (1 seul appel au lieu de 2 pour eviter les timeouts)
    const result = await aiService.generateJSON(genPrompt, {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 16000
    });

    console.log(`✅ [MarketingService] Strategie generee : ${result.strategy?.totalPosts || 0} posts planifies`);
    return result;
  }

}

module.exports = new MarketingService();
