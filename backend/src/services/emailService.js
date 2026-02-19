const { Resend } = require('resend');

/**
 * Échappe les caractères HTML pour prévenir les attaques XSS
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Service d'envoi d'emails
 * Utilise Resend pour envoyer des emails depuis le formulaire de contact
 */
class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * Envoyer un email depuis le formulaire de contact
   */
  async sendContactEmail(formData) {
    console.log('📧 [EmailService] Envoi email de contact...');

    try {
      const { name, email, message, portfolioOwnerEmail, portfolioTitle } = formData;

      // Validation
      if (!name || !email || !message) {
        throw new Error('Nom, email et message sont obligatoires');
      }

      if (!portfolioOwnerEmail) {
        throw new Error('Email du propriétaire du portfolio requis');
      }

      // Échapper les inputs utilisateur pour prévenir le XSS
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
      const safeTitle = escapeHtml(portfolioTitle || '');

      // Envoyer l'email
      const { data, error } = await this.resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [portfolioOwnerEmail],
        reply_to: email,
        subject: `Nouveau message depuis votre portfolio${safeTitle ? ` : ${safeTitle}` : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Nouveau message de contact</h2>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>De :</strong> ${safeName}</p>
              <p><strong>Email :</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            </div>

            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #374151;">Message :</h3>
              <p style="line-height: 1.6; color: #4b5563;">${safeMessage}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>Ce message a été envoyé depuis votre portfolio sur Mew</p>
              <p>Vous pouvez répondre directement à cet email pour contacter ${safeName}.</p>
            </div>
          </div>
        `
      });

      if (error) {
        console.error('❌ [EmailService] Erreur Resend:', error);
        throw new Error('Impossible d\'envoyer l\'email');
      }

      console.log('✅ [EmailService] Email envoyé avec succès, ID:', data.id);
      return { success: true, messageId: data.id };

    } catch (error) {
      console.error('❌ [EmailService] Erreur:', error);
      throw error;
    }
  }
  /**
   * Envoyer une candidature spontanee avec le CV en piece jointe
   */
  async sendSpontaneousApplication({ recipientEmail, subject, body, cvBuffer, cvFilename }) {
    console.log('[EmailService] Envoi candidature spontanee vers:', recipientEmail);

    if (!recipientEmail || !subject || !body || !cvBuffer) {
      throw new Error('Email destinataire, objet, corps et CV sont obligatoires');
    }

    const safeBody = escapeHtml(body).replace(/\n/g, '<br>');

    const { data, error } = await this.resend.emails.send({
      from: 'Candidature <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; line-height: 1.6; color: #374151;">
          <p>${safeBody}</p>
        </div>
      `,
      attachments: [
        {
          filename: cvFilename || 'CV.pdf',
          content: cvBuffer
        }
      ]
    });

    if (error) {
      console.error('[EmailService] Erreur envoi candidature spontanee:', error);
      throw new Error("Impossible d'envoyer l'email de candidature");
    }

    console.log('[EmailService] Candidature spontanee envoyee, ID:', data.id);
    return { success: true, messageId: data.id };
  }
}

module.exports = new EmailService();