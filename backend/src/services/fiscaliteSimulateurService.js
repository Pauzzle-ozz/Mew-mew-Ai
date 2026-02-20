const aiService = require('./aiService');
const documentParser = require('./documentParserService');
const { buildSimulateurPrompt } = require('../prompts/fiscaliteSimulateur');
const { simulateurToJSON } = require('../prompts/fiscaliteJsonSchemas');

/**
 * Service simulateur de strategie juridique et fiscale
 * Compare les regimes, simule les changements de statut
 */
class FiscaliteSimulateurService {

  validateInput(data) {
    const sit = data.situation_actuelle;
    if (!sit || !sit.statut) {
      throw new Error('Le statut juridique actuel est requis');
    }
    if (!sit.ca || isNaN(Number(sit.ca))) {
      throw new Error('Le chiffre d\'affaires annuel est requis (nombre)');
    }
    return true;
  }

  /**
   * Simulation complete de strategie
   */
  async simuler(data, file) {
    console.log(`🧮 [FiscaliteSimulateur] Simulation pour ${data.situation_actuelle?.statut} - CA: ${data.situation_actuelle?.ca} EUR`);

    this.validateInput(data);

    let documentText = '';
    if (file) {
      console.log(`📄 [FiscaliteSimulateur] Parsing document : ${file.originalname}`);
      const parsed = await documentParser.parseDocument(file);
      documentText = documentParser.formatForAI(parsed);
    }

    const genPrompt = buildSimulateurPrompt({ ...data, documentText });
    const jsonPrompt = simulateurToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.3, maxTokens: 8000 },
      { model: 'gpt-4.1-mini', maxTokens: 10000 }
    );

    console.log(`✅ [FiscaliteSimulateur] Simulation terminee - ${result.comparaison_regimes?.length || 0} regimes compares`);
    return result;
  }
}

module.exports = new FiscaliteSimulateurService();
