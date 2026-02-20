const aiService = require('./aiService');
const documentParser = require('./documentParserService');
const { buildAuditPrompt } = require('../prompts/fiscaliteAudit');
const { auditFiscalToJSON } = require('../prompts/fiscaliteJsonSchemas');

/**
 * Service d'audit fiscal
 * Analyse la conformite et propose des optimisations
 */
class FiscaliteAuditService {

  validateInput(data) {
    if (!data.type || !['entreprise', 'independant', 'particulier'].includes(data.type)) {
      throw new Error('Le type de profil est requis (entreprise, independant, particulier)');
    }
    return true;
  }

  /**
   * Audit fiscal complet
   */
  async auditFiscal(data, file) {
    console.log(`🔍 [FiscaliteAudit] Lancement audit fiscal pour ${data.type}/${data.statut || 'non precise'}`);

    this.validateInput(data);

    // Parser le document si fourni
    let documentText = '';
    if (file) {
      console.log(`📄 [FiscaliteAudit] Parsing document : ${file.originalname}`);
      const parsed = await documentParser.parseDocument(file);
      documentText = documentParser.formatForAI(parsed);
    }

    // Construire les prompts
    const genPrompt = buildAuditPrompt({ ...data, documentText });
    const jsonPrompt = auditFiscalToJSON('{{GENERATED_TEXT}}');

    // Pipeline 2 etapes
    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.3, maxTokens: 6000 },
      { model: 'gpt-4.1-mini', maxTokens: 8000 }
    );

    console.log(`✅ [FiscaliteAudit] Audit termine - Score: ${result.score_conformite}/100`);
    return result;
  }
}

module.exports = new FiscaliteAuditService();
