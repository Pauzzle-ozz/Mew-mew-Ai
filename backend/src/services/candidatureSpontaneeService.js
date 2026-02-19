const pdf = require('pdf-parse');
const aiService = require('./aiService');
const emailService = require('./emailService');
const applicationService = require('./applicationService');

const { buildPrompt: buildEmailPrompt } = require('../prompts/spontaneEmail');
const { buildPrompt: buildFollowUpPrompt } = require('../prompts/spontaneFollowUp');
const { spontaneEmailToJSON } = require('../prompts/jsonSchemas');

const FOLLOW_UP_DAYS = 8;

class CandidatureSpontaneeService {

  /**
   * Pipeline complet : extraire le CV -> generer email IA -> envoyer -> enregistrer
   */
  async sendSpontaneousApplication(cvBuffer, recipientEmail, targetPosition, company, contactName, userId) {
    console.log('[CandidatureSpontanee] Demarrage pipeline...');

    // Etape 1 : extraire le texte du CV
    console.log('[CandidatureSpontanee] Extraction texte PDF...');
    const pdfData = await pdf(cvBuffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length < 50) {
      throw new Error("Impossible de lire le texte du CV. Verifiez que le PDF n'est pas une image scannee.");
    }

    // Etape 2 : generer l'email via IA (pipeline 2 etapes)
    console.log('[CandidatureSpontanee] Generation email IA...');
    const genPrompt = buildEmailPrompt({ cvText, targetPosition, company, contactName });
    const jsonPrompt = spontaneEmailToJSON('{{GENERATED_TEXT}}');

    const emailJSON = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4o', temperature: 0.7 },
      { model: 'gpt-4.1-mini' }
    );

    const { subject, body, candidate_name } = emailJSON;
    if (!subject || !body) {
      throw new Error("L'IA n'a pas pu generer l'email");
    }

    // Etape 3 : construire le nom du fichier CV
    const cvFilename = candidate_name
      ? `CV_${candidate_name.replace(/\s+/g, '_')}.pdf`
      : 'CV.pdf';

    // Etape 4 : envoyer l'email avec le CV en piece jointe
    console.log('[CandidatureSpontanee] Envoi email...');
    const emailResult = await emailService.sendSpontaneousApplication({
      recipientEmail,
      subject,
      body,
      cvBuffer,
      cvFilename
    });

    // Etape 5 : enregistrer la candidature dans le tracker
    let application = null;
    if (userId) {
      console.log('[CandidatureSpontanee] Enregistrement candidature...');
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + FOLLOW_UP_DAYS);

      application = await applicationService.create(userId, {
        offer_title: targetPosition,
        company: company || '',
        offer_url: '',
        location: '',
        contract_type: '',
        status: 'postule',
        notes: `Candidature spontanee envoyee a ${recipientEmail}\nObjet: ${subject}`,
        recipient_email: recipientEmail,
        follow_up_date: followUpDate.toISOString(),
        follow_up_sent: false,
        candidature_type: 'spontanee',
        contact_name: contactName || ''
      });
    }

    console.log('[CandidatureSpontanee] Pipeline termine avec succes');
    return {
      emailResult,
      application,
      generatedEmail: { subject, body, candidate_name },
      followUpDate: application?.follow_up_date || null
    };
  }

  /**
   * Generer un email de relance a la demande (ne l'envoie PAS)
   */
  async generateFollowUp({ originalSubject, targetPosition, company, candidateName, daysSince }) {
    console.log('[CandidatureSpontanee] Generation relance...');

    const genPrompt = buildFollowUpPrompt({ originalSubject, targetPosition, company, candidateName, daysSince });
    const jsonPrompt = spontaneEmailToJSON('{{GENERATED_TEXT}}');

    const result = await aiService.generateThenConvert(
      genPrompt,
      jsonPrompt,
      { model: 'gpt-4.1-mini' },
      { model: 'gpt-4.1-mini' }
    );

    return { subject: result.subject, body: result.body };
  }
}

module.exports = new CandidatureSpontaneeService();
