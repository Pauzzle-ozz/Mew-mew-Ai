const pdfParse = require('pdf-parse');
const XLSX = require('xlsx');
const { parse: csvParse } = require('csv-parse/sync');
const axios = require('axios');

/**
 * Service de parsing universel de documents comptables
 * Supporte : PDF, Excel (.xlsx/.xls), CSV, Google Sheets (URL publique)
 */
class DocumentParserService {

  /**
   * Detecte le type de fichier et parse automatiquement
   * @param {Object} file - Fichier multer (buffer, mimetype, originalname)
   * @returns {Object} { type, text, data, pages }
   */
  async parseDocument(file) {
    if (!file || !file.buffer) {
      throw new Error('Aucun fichier fourni');
    }

    const ext = (file.originalname || '').split('.').pop().toLowerCase();
    const mime = file.mimetype || '';

    if (mime === 'application/pdf' || ext === 'pdf') {
      return await this.parsePDF(file.buffer);
    }

    if (mime.includes('spreadsheet') || mime.includes('excel') || ['xlsx', 'xls'].includes(ext)) {
      return this.parseExcel(file.buffer);
    }

    if (mime === 'text/csv' || ext === 'csv') {
      return this.parseCSV(file.buffer);
    }

    throw new Error(`Format non supporte : ${ext || mime}. Formats acceptes : PDF, Excel (.xlsx/.xls), CSV`);
  }

  /**
   * Parse un fichier PDF et extrait le texte
   */
  async parsePDF(buffer) {
    const result = await pdfParse(buffer);
    return {
      type: 'pdf',
      text: result.text,
      data: null,
      pages: result.numpages
    };
  }

  /**
   * Parse un fichier Excel et retourne les donnees structurees
   */
  parseExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const allData = [];
    let fullText = '';

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      const textData = XLSX.utils.sheet_to_csv(sheet);

      allData.push({
        sheet: sheetName,
        rows: jsonData,
        rowCount: jsonData.length
      });

      fullText += `=== Feuille: ${sheetName} ===\n${textData}\n\n`;
    }

    return {
      type: 'excel',
      text: fullText,
      data: allData,
      pages: workbook.SheetNames.length
    };
  }

  /**
   * Parse un fichier CSV et retourne les donnees structurees
   */
  parseCSV(buffer) {
    const content = buffer.toString('utf-8');

    // Detecter le separateur (virgule, point-virgule, tab)
    const firstLine = content.split('\n')[0] || '';
    let delimiter = ',';
    if (firstLine.split(';').length > firstLine.split(',').length) delimiter = ';';
    if (firstLine.split('\t').length > firstLine.split(delimiter).length) delimiter = '\t';

    const records = csvParse(content, {
      columns: true,
      skip_empty_lines: true,
      delimiter,
      relax_column_count: true
    });

    return {
      type: 'csv',
      text: content,
      data: [{ sheet: 'CSV', rows: records, rowCount: records.length }],
      pages: 1
    };
  }

  /**
   * Parse un Google Sheets public via son URL
   * @param {string} url - URL du Google Sheet (doit etre public)
   */
  async parseGoogleSheets(url) {
    // Convertir l'URL en format CSV export
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('URL Google Sheets invalide. Format attendu : https://docs.google.com/spreadsheets/d/...');
    }

    const sheetId = match[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    try {
      const response = await axios.get(csvUrl, { timeout: 15000 });
      const buffer = Buffer.from(response.data, 'utf-8');
      const result = this.parseCSV(buffer);
      result.type = 'google_sheets';
      return result;
    } catch (error) {
      throw new Error('Impossible de lire le Google Sheet. Verifiez qu\'il est bien public (partage avec "Tous les utilisateurs disposant du lien").');
    }
  }

  /**
   * Formate les donnees parsees en texte lisible pour l'IA
   */
  formatForAI(parsed) {
    if (parsed.type === 'pdf') {
      return parsed.text;
    }

    // Pour Excel/CSV/Sheets : formater en texte tabulaire lisible
    let output = '';
    for (const sheet of (parsed.data || [])) {
      if (sheet.rows.length === 0) continue;

      output += `--- ${sheet.sheet} (${sheet.rowCount} lignes) ---\n`;
      const headers = Object.keys(sheet.rows[0]);
      output += headers.join(' | ') + '\n';
      output += headers.map(() => '---').join(' | ') + '\n';

      for (const row of sheet.rows.slice(0, 500)) {
        output += headers.map(h => String(row[h] || '')).join(' | ') + '\n';
      }

      if (sheet.rowCount > 500) {
        output += `\n[... ${sheet.rowCount - 500} lignes supplementaires tronquees]\n`;
      }
      output += '\n';
    }
    return output;
  }
}

module.exports = new DocumentParserService();
