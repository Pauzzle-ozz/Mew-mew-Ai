/**
 * Factory de templates HTML pour les lettres de motivation
 * Style simple et professionnel, optimisé pour Puppeteer
 */
class LetterTemplateFactory {
  /**
   * Générer le HTML d'une lettre de motivation
   * @param {Object} letterData - Contenu de la lettre (greeting, introduction, body, conclusion, closing)
   * @param {Object} candidate - Données du candidat
   * @param {Object} offer - Données de l'offre
   * @returns {String} HTML complet
   */
  getTemplate(letterData, candidate, offer) {
    console.log('📝 [LetterTemplateFactory] Génération lettre de motivation');

    return this.generateProfessionalLetter(letterData, candidate, offer);
  }

  /**
   * Template professionnel pour lettre de motivation
   */
  generateProfessionalLetter(letterData, candidate, offer) {
    const today = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1a1a1a;
            background: white;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm 25mm;
          }

          /* En-tête expéditeur */
          .sender {
            margin-bottom: 20pt;
          }
          .sender-name {
            font-size: 12pt;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 3pt;
          }
          .sender-info {
            font-size: 10pt;
            color: #4b5563;
            line-height: 1.4;
          }

          /* Destinataire */
          .recipient {
            margin-bottom: 20pt;
          }
          .recipient-company {
            font-size: 11pt;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 2pt;
          }
          .recipient-info {
            font-size: 10pt;
            color: #4b5563;
          }

          /* Date et lieu */
          .date-location {
            text-align: right;
            font-size: 10pt;
            color: #6b7280;
            margin-bottom: 25pt;
            font-style: italic;
          }

          /* Objet */
          .subject {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 20pt;
            color: #1f2937;
          }
          .subject-label {
            text-decoration: underline;
          }

          /* Formule d'appel */
          .greeting {
            font-size: 11pt;
            margin-bottom: 15pt;
            color: #1f2937;
          }

          /* Corps de la lettre */
          .body {
            font-size: 11pt;
            line-height: 1.7;
            color: #374151;
            text-align: justify;
            margin-bottom: 20pt;
          }
          .body p {
            margin-bottom: 12pt;
          }
          .body p:last-child {
            margin-bottom: 0;
          }

          /* Formule de politesse */
          .closing {
            font-size: 11pt;
            margin-bottom: 40pt;
            color: #1f2937;
          }

          /* Signature */
          .signature {
            font-size: 11pt;
            font-weight: 600;
            color: #1e40af;
          }

          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { background: white; }
          }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- EN-TÊTE EXPÉDITEUR -->
          <div class="sender">
            <div class="sender-name">${candidate.prenom} ${candidate.nom}</div>
            <div class="sender-info">
              ${candidate.adresse ? `${candidate.adresse}<br>` : ''}
              ${candidate.telephone ? `Tél. : ${candidate.telephone}<br>` : ''}
              ${candidate.email ? `Email : ${candidate.email}` : ''}
            </div>
          </div>

          <!-- DESTINATAIRE -->
          <div class="recipient">
            <div class="recipient-company">${offer.company}</div>
            <div class="recipient-info">
              ${offer.location ? `${offer.location}` : ''}
            </div>
          </div>

          <!-- DATE ET LIEU -->
          <div class="date-location">
            ${offer.location ? `${offer.location.split(',')[0]}, le ` : 'Le '}${today}
          </div>

          <!-- OBJET -->
          <div class="subject">
            <span class="subject-label">Objet :</span> Candidature au poste de ${offer.title}
          </div>

          <!-- FORMULE D'APPEL -->
          <div class="greeting">
            ${letterData.greeting || 'Madame, Monsieur,'}
          </div>

          <!-- CORPS DE LA LETTRE -->
          <div class="body">
            ${this.formatBodyText(letterData.introduction, letterData.body, letterData.conclusion)}
          </div>

          <!-- FORMULE DE POLITESSE -->
          <div class="closing">
            ${letterData.closing || 'Je vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.'}
          </div>

          <!-- SIGNATURE -->
          <div class="signature">
            ${candidate.prenom} ${candidate.nom}
          </div>

        </div>
      </body>
      </html>
    `;
  }

  /**
   * Formater le corps de la lettre en paragraphes HTML
   */
  formatBodyText(introduction, body, conclusion) {
    let html = '';

    if (introduction) {
      html += `<p>${introduction}</p>`;
    }

    if (body) {
      // Si le body contient déjà des paragraphes (séparés par \n\n ou <br><br>)
      const paragraphs = body.split(/\n\n+/);
      paragraphs.forEach(p => {
        if (p.trim()) {
          html += `<p>${p.trim()}</p>`;
        }
      });
    }

    if (conclusion) {
      html += `<p>${conclusion}</p>`;
    }

    return html;
  }
}

module.exports = new LetterTemplateFactory();
