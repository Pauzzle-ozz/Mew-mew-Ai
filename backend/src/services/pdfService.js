const puppeteer = require('puppeteer');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

/**
 * Service de gestion des PDF et DOCX
 * Centralise la génération de documents
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
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    console.log('✅ [PDFService] PDF généré, taille:', pdfBuffer.length);

    // Forcer la conversion en Buffer si nécessaire
    return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
  }

  /**
   * Générer un DOCX
   */
  async generateDOCX(cvData, template) {
    console.log('📄 [PDFService] Génération du DOCX...');

    const color = this.getTemplateColor(template);

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${cvData.prenom} ${cvData.nom}`,
                bold: true,
                size: 32,
                color: color
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: cvData.titre_poste || '',
                size: 24,
                color: '666666'
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `${cvData.email || ''} ${cvData.telephone ? '• ' + cvData.telephone : ''} ${cvData.adresse ? '• ' + cvData.adresse : ''}`,
                size: 20,
                color: '666666'
              }),
            ],
          }),

          // Résumé
          ...(cvData.resume ? [
            new Paragraph({
              text: 'Profil',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            }),
            new Paragraph({
              text: cvData.resume,
              spacing: { after: 300 },
            })
          ] : []),

          // Expériences
          ...(cvData.experiences && cvData.experiences.length > 0 ? [
            new Paragraph({
              text: 'Expérience Professionnelle',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            }),
            ...cvData.experiences.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.poste,
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { before: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.entreprise,
                    bold: true,
                  }),
                  new TextRun({
                    text: exp.periode ? ` • ${exp.periode}` : '',
                    italics: true,
                    color: '666666'
                  }),
                ],
              }),
              ...(exp.description ? [
                new Paragraph({
                  text: exp.description,
                  spacing: { after: 200 },
                })
              ] : []),
            ])
          ] : []),

          // Formations
          ...(cvData.formations && cvData.formations.length > 0 ? [
            new Paragraph({
              text: 'Formation',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            }),
            ...cvData.formations.flatMap(form => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: form.diplome,
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { before: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: form.etablissement,
                    bold: true,
                  }),
                  new TextRun({
                    text: form.annee ? ` • ${form.annee}` : '',
                    italics: true,
                    color: '666666'
                  }),
                ],
                spacing: { after: 200 },
              }),
            ])
          ] : []),

          // Compétences
          ...(cvData.competences_techniques ? [
            new Paragraph({
              text: 'Compétences Techniques',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            }),
            new Paragraph({
              text: cvData.competences_techniques,
              spacing: { after: 200 },
            })
          ] : []),

          ...(cvData.competences_soft ? [
            new Paragraph({
              text: 'Compétences Personnelles',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            }),
            new Paragraph({
              text: cvData.competences_soft,
              spacing: { after: 200 },
            })
          ] : []),

          ...(cvData.langues ? [
            new Paragraph({
              text: 'Langues',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 },
            }),
            new Paragraph({
              text: cvData.langues,
            })
          ] : []),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    console.log('✅ [PDFService] DOCX généré, taille:', buffer.length);

    return buffer;
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
