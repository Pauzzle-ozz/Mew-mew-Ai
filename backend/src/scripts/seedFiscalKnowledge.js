/**
 * Script de peuplement de la base de connaissances fiscales
 *
 * Usage : node backend/src/scripts/seedFiscalKnowledge.js
 *
 * Charge les donnees depuis fiscalKnowledgeData.js,
 * genere les embeddings via OpenAI et insere dans Supabase (table fiscal_knowledge)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fiscalKnowledgeData = require('../data/fiscalKnowledgeData');
const fiscalKnowledgeService = require('../services/fiscalKnowledgeService');

async function seed() {
  console.log('='.repeat(60));
  console.log('  Peuplement base de connaissances fiscales');
  console.log('='.repeat(60));
  console.log(`\n${fiscalKnowledgeData.length} entrees a inserer\n`);

  const result = await fiscalKnowledgeService.seedKnowledge(
    fiscalKnowledgeData,
    (current, total, title, success) => {
      const status = success ? '✅' : '❌';
      const pct = Math.round((current / total) * 100);
      console.log(`${status} [${current}/${total}] (${pct}%) ${title}`);
    }
  );

  console.log('\n' + '='.repeat(60));
  console.log(`  Termine : ${result.success} OK / ${result.errors} erreurs / ${result.total} total`);
  console.log('='.repeat(60));

  process.exit(result.errors > 0 ? 1 : 0);
}

seed().catch(err => {
  console.error('\n❌ Erreur fatale:', err.message);
  process.exit(1);
});
