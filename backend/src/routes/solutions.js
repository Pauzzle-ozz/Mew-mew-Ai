const express = require('express');
const axios = require('axios');
const multer = require('multer');
const pdf = require('pdf-parse');
const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2 Mo
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptés'));
    }
  }
});

// Route pour l'analyseur de CV avec données structurées
router.post('/analyse-cv', async (req, res) => {
  try {
    const { userId, prenom, nom, niveau_experience, annees_experience, statut, experience, competences_principales, outils, soft_skills, secteur_preferentiel, type_poste } = req.body;

    // Validation basique
    if (!prenom || !nom || !type_poste) {
      return res.status(400).json({
        error: 'Prénom, nom et type de poste sont obligatoires'
      });
    }

    // Appel vers n8n
    const n8nResponse = await axios.post(
      process.env.N8N_WEBHOOK_URL,
      {
        userId,
        prenom,
        nom,
        niveau_experience,
        annees_experience,
        statut,
        experience,
        competences_principales,
        outils,
        soft_skills,
        secteur_preferentiel,
        type_poste
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_SECRET_KEY}`
        }
      }
    );

    // Retour de la réponse n8n au frontend
    res.json({
      success: true,
      data: n8nResponse.data
    });

  } catch (error) {
    console.error('Erreur lors de l\'appel n8n:', error.message);
    res.status(500).json({
      success: false,
      error: 'Une erreur est survenue lors de l\'analyse'
    });
  }
});

// Route pour l'upload et extraction de CV PDF
router.post('/analyse-cv-pdf', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier PDF fourni'
      });
    }

    // Extraction du texte du PDF
    const pdfData = await pdf(req.file.buffer);
    const cvText = pdfData.text;

    // Pour l'instant, on renvoie juste le texte extrait
    // Plus tard, on pourra ajouter de l'IA pour parser automatiquement
    res.json({
      success: true,
      data: {
        texte_extrait: cvText,
        nombre_pages: pdfData.numpages
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'extraction PDF:', error.message);
    res.status(500).json({
      success: false,
      error: 'Impossible de lire le fichier PDF'
    });
  }
});

// Route pour l'analyse complète d'un CV PDF (extraction + analyse n8n)
router.post('/analyse-cv-pdf-complete', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier PDF fourni'
      });
    }

    const { userId } = req.body;

    // Extraction du texte du PDF
    const pdfData = await pdf(req.file.buffer);
    const cvText = pdfData.text;

    // Appel vers n8n avec le texte extrait
    const n8nResponse = await axios.post(
      process.env.N8N_WEBHOOK_PDF_URL,
      {
        userId,
        cv_texte_complet: cvText,
        nombre_pages: pdfData.numpages
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_SECRET_KEY}`
        }
      }
    );

    res.json({
      success: true,
      data: n8nResponse.data
    });

  } catch (error) {
    console.error('Erreur lors de l\'analyse PDF complète:', error.message);
    res.status(500).json({
      success: false,
      error: 'Impossible d\'analyser le CV'
    });
  }
});

// Route pour générer un CV (PDF/DOCX)
router.post('/generer-cv', async (req, res) => {
  try {
    const { cvData, template, formats } = req.body;

    // Validation
    if (!cvData || !template) {
      return res.status(400).json({
        error: 'Données du CV et template sont requis'
      });
    }

    const puppeteer = require('puppeteer');
    
    // Générer le HTML selon le template
    const html = generateHTMLTemplate(cvData, template);

    // Générer le PDF avec Puppeteer
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

    // Vérifier le type de pdfBuffer
    console.log('🔍 Type pdfBuffer:', typeof pdfBuffer, 'isBuffer:', Buffer.isBuffer(pdfBuffer))
    
    // Forcer la conversion en Buffer si nécessaire
    let finalPdfBuffer = pdfBuffer;
    if (!Buffer.isBuffer(pdfBuffer)) {
      console.log('⚠️ pdfBuffer n\'est pas un Buffer, conversion...')
      finalPdfBuffer = Buffer.from(pdfBuffer);
    }

    // Générer le DOCX
    console.log('🔄 Génération du DOCX...')
    const docxBuffer = await generateDOCXTemplate(cvData, template);
    console.log('✅ DOCX généré, taille:', docxBuffer.length)

    // Convertir PDF en base64
    const pdfBase64 = finalPdfBuffer.toString('base64');
    console.log('✅ PDF base64 créé, longueur:', pdfBase64.length)
    console.log('✅ Premiers caractères PDF:', pdfBase64.substring(0, 50))

    // Convertir DOCX en base64
    const docxBase64 = docxBuffer.toString('base64');
    console.log('✅ DOCX base64 créé, longueur:', docxBase64.length)

    res.json({
      success: true,
      data: {
        pdf: pdfBase64,
        docx: docxBase64,
        filename: `CV_${cvData.prenom}_${cvData.nom}`
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la génération du CV:', error.message);
    res.status(500).json({
      success: false,
      error: 'Impossible de générer le CV'
    });
  }
});

// Fonction pour générer le HTML selon le template
function generateHTMLTemplate(cvData, template) {
  // Template de base
  const baseStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Arial', sans-serif; font-size: 12px; line-height: 1.6; color: #333; }
      .container { padding: 40px; }
      h1 { font-size: 28px; margin-bottom: 5px; }
      h2 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid; padding-bottom: 5px; }
      h3 { font-size: 14px; margin-top: 10px; margin-bottom: 5px; }
      .contact-info { margin-bottom: 20px; font-size: 11px; }
      .contact-info span { margin-right: 15px; }
      .section { margin-bottom: 20px; }
      .experience-item, .formation-item { margin-bottom: 15px; }
      .period { color: #666; font-style: italic; font-size: 11px; }
      .company { font-weight: bold; }
      ul { padding-left: 20px; }
      li { margin-bottom: 3px; }
    </style>
  `;

  // Template Moderne
  if (template === 'moderne') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${baseStyles}
        <style>
          body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; max-width: 800px; margin: 0 auto; }
          h1 { color: #667eea; }
          h2 { color: #667eea; border-bottom-color: #667eea; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; margin: -40px -40px 30px -40px; }
          .header h1, .header .contact-info { color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${cvData.prenom} ${cvData.nom}</h1>
            <div style="font-size: 16px; margin-bottom: 10px;">${cvData.titre_poste || ''}</div>
            <div class="contact-info">
              ${cvData.email ? `<span>📧 ${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>📱 ${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>📍 ${cvData.adresse}</span>` : ''}
            </div>
          </div>

          ${cvData.resume ? `
            <div class="section">
              <h2>Profil</h2>
              <p>${cvData.resume}</p>
            </div>
          ` : ''}

          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <div class="section">
              <h2>Expérience Professionnelle</h2>
              ${cvData.experiences.map(exp => `
                <div class="experience-item">
                  <h3>${exp.poste}</h3>
                  <div><span class="company">${exp.entreprise}</span> ${exp.periode ? `<span class="period">• ${exp.periode}</span>` : ''}</div>
                  ${exp.description ? `<p style="margin-top: 5px;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${cvData.formations && cvData.formations.length > 0 ? `
            <div class="section">
              <h2>Formation</h2>
              ${cvData.formations.map(form => `
                <div class="formation-item">
                  <h3>${form.diplome}</h3>
                  <div><span class="company">${form.etablissement}</span> ${form.annee ? `<span class="period">• ${form.annee}</span>` : ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${cvData.competences_techniques ? `
            <div class="section">
              <h2>Compétences Techniques</h2>
              <p>${cvData.competences_techniques}</p>
            </div>
          ` : ''}

          ${cvData.competences_soft ? `
            <div class="section">
              <h2>Compétences Personnelles</h2>
              <p>${cvData.competences_soft}</p>
            </div>
          ` : ''}

          ${cvData.langues ? `
            <div class="section">
              <h2>Langues</h2>
              <p>${cvData.langues}</p>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  }

  // Template Classique
  if (template === 'classique') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${baseStyles}
        <style>
          h1 { color: #2c3e50; text-transform: uppercase; letter-spacing: 2px; }
          h2 { color: #2c3e50; border-bottom-color: #2c3e50; text-transform: uppercase; font-size: 14px; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2c3e50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${cvData.prenom} ${cvData.nom}</h1>
            <div style="font-size: 14px; margin: 10px 0; color: #555;">${cvData.titre_poste || ''}</div>
            <div class="contact-info">
              ${cvData.email ? `<span>${cvData.email}</span>` : ''}
              ${cvData.telephone ? `<span>${cvData.telephone}</span>` : ''}
              ${cvData.adresse ? `<span>${cvData.adresse}</span>` : ''}
            </div>
          </div>

          ${cvData.resume ? `
            <div class="section">
              <h2>Résumé Professionnel</h2>
              <p>${cvData.resume}</p>
            </div>
          ` : ''}

          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <div class="section">
              <h2>Expérience Professionnelle</h2>
              ${cvData.experiences.map(exp => `
                <div class="experience-item">
                  <h3>${exp.poste}</h3>
                  <div><span class="company">${exp.entreprise}</span> ${exp.periode ? `<span class="period">| ${exp.periode}</span>` : ''}</div>
                  ${exp.description ? `<p style="margin-top: 5px;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${cvData.formations && cvData.formations.length > 0 ? `
            <div class="section">
              <h2>Formation</h2>
              ${cvData.formations.map(form => `
                <div class="formation-item">
                  <h3>${form.diplome}</h3>
                  <div><span class="company">${form.etablissement}</span> ${form.annee ? `<span class="period">| ${form.annee}</span>` : ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${cvData.competences_techniques ? `
            <div class="section">
              <h2>Compétences</h2>
              <p>${cvData.competences_techniques}</p>
            </div>
          ` : ''}

          ${cvData.langues ? `
            <div class="section">
              <h2>Langues</h2>
              <p>${cvData.langues}</p>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  }

  // Template Créatif
  if (template === 'creatif') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${baseStyles}
        <style>
          body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; }
          .sidebar { background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px 30px; width: 35%; float: left; min-height: 100vh; }
          .main-content { width: 65%; float: right; padding: 40px; }
          .sidebar h1 { color: white; font-size: 24px; }
          .sidebar h2 { color: white; border-bottom-color: white; font-size: 14px; }
          h2 { color: #f5576c; border-bottom-color: #f5576c; }
          .contact-info { color: white; }
        </style>
      </head>
      <body>
        <div class="container" style="overflow: hidden;">
          <div class="sidebar">
            <h1>${cvData.prenom}<br/>${cvData.nom}</h1>
            <div style="font-size: 14px; margin: 15px 0;">${cvData.titre_poste || ''}</div>
            
            <h2 style="margin-top: 30px;">Contact</h2>
            <div class="contact-info" style="font-size: 11px;">
              ${cvData.email ? `<div style="margin-bottom: 8px;">📧 ${cvData.email}</div>` : ''}
              ${cvData.telephone ? `<div style="margin-bottom: 8px;">📱 ${cvData.telephone}</div>` : ''}
              ${cvData.adresse ? `<div style="margin-bottom: 8px;">📍 ${cvData.adresse}</div>` : ''}
            </div>

            ${cvData.competences_techniques ? `
              <h2 style="margin-top: 30px;">Compétences</h2>
              <div style="font-size: 11px;">${cvData.competences_techniques}</div>
            ` : ''}

            ${cvData.langues ? `
              <h2 style="margin-top: 30px;">Langues</h2>
              <div style="font-size: 11px;">${cvData.langues}</div>
            ` : ''}
          </div>

          <div class="main-content">
            ${cvData.resume ? `
              <div class="section">
                <h2>À Propos</h2>
                <p>${cvData.resume}</p>
              </div>
            ` : ''}

            ${cvData.experiences && cvData.experiences.length > 0 ? `
              <div class="section">
                <h2>Expérience</h2>
                ${cvData.experiences.map(exp => `
                  <div class="experience-item">
                    <h3>${exp.poste}</h3>
                    <div><span class="company">${exp.entreprise}</span> ${exp.periode ? `<span class="period">• ${exp.periode}</span>` : ''}</div>
                    ${exp.description ? `<p style="margin-top: 5px;">${exp.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${cvData.formations && cvData.formations.length > 0 ? `
              <div class="section">
                <h2>Formation</h2>
                ${cvData.formations.map(form => `
                  <div class="formation-item">
                    <h3>${form.diplome}</h3>
                    <div><span class="company">${form.etablissement}</span> ${form.annee ? `<span class="period">• ${form.annee}</span>` : ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Fallback
  return '<html><body><h1>Template non trouvé</h1></body></html>';
}
// Fonction pour générer un DOCX
async function generateDOCXTemplate(cvData, template) {
  const docx = require('docx');
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = docx;

  // Créer le document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header avec nom et titre
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${cvData.prenom} ${cvData.nom}`,
              bold: true,
              size: 32,
              color: template === 'moderne' ? '667eea' : template === 'creatif' ? 'f5576c' : '2c3e50'
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

  // Générer le buffer
  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
module.exports = router;