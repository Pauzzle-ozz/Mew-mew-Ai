const aiService = require('./aiService');
const { buildPrompt: buildRedacteurPrompt } = require('../prompts/redacteurMultiFormat');
const { buildPrompt: buildStrategiePrompt } = require('../prompts/strategieContenu');
const { multiFormatContentToJSON, contentStrategyToJSON } = require('../prompts/marketingJsonSchemas');

/**
 * Service Marketing & Communication
 * Gere la generation de contenu multi-format et les strategies de contenu
 */
class MarketingService {

  /**
   * Valide un brief de contenu
   */
  validateBrief(brief) {
    if (!brief || !brief.subject || !brief.tone || !brief.targetAudience || !brief.objective) {
      throw new Error('Le brief doit contenir : subject, tone, targetAudience, objective');
    }
    return true;
  }

  /**
   * Valide les plateformes selectionnees
   */
  validatePlatforms(platforms) {
    const validPlatforms = ['linkedin', 'instagram', 'twitter', 'blog', 'video_script', 'newsletter'];
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      throw new Error('Selectionnez au moins une plateforme');
    }
    const invalid = platforms.filter(p => !validPlatforms.includes(p));
    if (invalid.length > 0) {
      throw new Error(`Plateformes invalides : ${invalid.join(', ')}`);
    }
    return true;
  }

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
   * Genere du contenu adapte a plusieurs plateformes
   * Pipeline 2 etapes : GPT-4o creatif → GPT-4.1-mini JSON
   */
  async generateMultiFormatContent(brief, platforms) {
    console.log(`📢 [MarketingService] Generation multi-format pour ${platforms.length} plateformes...`);

    this.validateBrief(brief);
    this.validatePlatforms(platforms);

    const genPrompt = buildRedacteurPrompt(brief, platforms);
    const jsonPrompt = multiFormatContentToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 4000 },
      { model: 'gpt-4.1-mini' }
    );

    console.log(`✅ [MarketingService] Contenu genere pour : ${Object.keys(result.platforms || {}).join(', ')}`);
    return result;
  }

  /**
   * Genere une strategie de contenu / calendrier editorial 30 jours
   * Pipeline 2 etapes : GPT-4o creatif → GPT-4.1-mini JSON
   */
  async generateContentStrategy(input) {
    console.log(`📅 [MarketingService] Generation strategie 30 jours pour ${input.channels.length} canaux...`);

    this.validateStrategyInput(input);

    const genPrompt = buildStrategiePrompt(input);
    const jsonPrompt = contentStrategyToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    console.log(`✅ [MarketingService] Strategie generee : ${result.strategy?.totalPosts || 0} posts planifies`);
    return result;
  }
}

module.exports = new MarketingService();
