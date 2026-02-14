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

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();

    console.log('✅ [PDFService] PDF généré, taille:', pdfBuffer.length);

    // Forcer la conversion en Buffer si nécessaire
    return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
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