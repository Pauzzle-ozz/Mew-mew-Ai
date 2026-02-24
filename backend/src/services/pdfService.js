const puppeteer = require('puppeteer');

/**
 * Service de gestion des PDF
 * Centralise la génération de documents PDF
 */
class PDFService {
  /**
   * Générer un PDF à partir de HTML
   */
  async generatePDF(html) {
    console.log('📄 [PDFService] Génération du PDF...');

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 30000
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        timeout: 30000
      });

      console.log('✅ [PDFService] PDF généré, taille:', pdfBuffer.length);

      return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * Obtenir la couleur du template
   */
  getTemplateColor(template) {
    const colors = {
      'moderne': '667eea',
      'classique': '2c3e50',
      'creatif': 'f5576c'
    };
    return colors[template] || '2c3e50';
  }
}

module.exports = new PDFService();
