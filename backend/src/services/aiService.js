const OpenAI = require('openai');

/**
 * Service IA centralise
 * Point unique de communication avec l'API OpenAI
 */
class AIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000
    });
  }

  /**
   * Generer du texte libre via OpenAI
   * @param {string} prompt - Le prompt complet
   * @param {Object} options - { model, temperature, maxTokens }
   * @returns {string} Le texte genere
   */
  async generate(prompt, options = {}) {
    const {
      model = 'gpt-4.1-mini',
      temperature,
      maxTokens
    } = options;

    const params = {
      model,
      messages: [{ role: 'user', content: prompt }]
    };

    if (temperature !== undefined) params.temperature = temperature;
    if (maxTokens) params.max_tokens = maxTokens;

    const response = await this.client.chat.completions.create(params);
    return response.choices[0].message.content;
  }

  /**
   * Generer du JSON via OpenAI (avec response_format + retry auto)
   * @param {string} prompt - Le prompt (doit demander du JSON)
   * @param {Object} options - { model, temperature, maxTokens }
   * @returns {Object} Le JSON parse
   */
  async generateJSON(prompt, options = {}) {
    const {
      model = 'gpt-4.1-mini',
      temperature,
      maxTokens
    } = options;

    const params = {
      model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    };

    if (temperature !== undefined) params.temperature = temperature;
    if (maxTokens) params.max_tokens = maxTokens;

    const response = await this.client.chat.completions.create(params);
    const text = response.choices[0].message.content;

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('⚠️ [AIService] JSON parse echoue, retry...');
      // Retry avec instruction stricte
      const retryParams = {
        ...params,
        messages: [{
          role: 'user',
          content: `Reponds UNIQUEMENT avec du JSON valide. Aucun texte, aucun markdown.\n\n${prompt}`
        }]
      };
      const retryResponse = await this.client.chat.completions.create(retryParams);
      return JSON.parse(retryResponse.choices[0].message.content);
    }
  }

  /**
   * Pipeline 2 etapes : generer du texte creatif puis convertir en JSON
   * Utilise pour les workflows matcher/scraper ou la qualite du texte compte
   * @param {string} generationPrompt - Prompt pour la generation de texte
   * @param {string} jsonConversionPrompt - Prompt pour la conversion JSON (contient {{GENERATED_TEXT}})
   * @param {Object} genOptions - Options pour l'etape 1 (model, temperature, maxTokens)
   * @param {Object} convOptions - Options pour l'etape 2
   * @returns {Object} Le JSON parse
   */
  async generateThenConvert(generationPrompt, jsonConversionPrompt, genOptions = {}, convOptions = {}) {
    // Etape 1 : generation de texte creatif
    const generatedText = await this.generate(generationPrompt, genOptions);

    // Etape 2 : conversion en JSON structure
    const fullPrompt = jsonConversionPrompt.replace('{{GENERATED_TEXT}}', generatedText);
    return await this.generateJSON(fullPrompt, {
      model: 'gpt-4.1-mini',
      ...convOptions
    });
  }
}

module.exports = new AIService();
