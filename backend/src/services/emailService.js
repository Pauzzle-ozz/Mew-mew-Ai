const { Resend } = require('resend');

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

      // Envoyer l'email
      const { data, error } = await this.resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>', // Email par défaut de Resend
        to: [portfolioOwnerEmail],
        reply_to: email, // Pour que le propriétaire puisse répondre directement
        subject: `📧 Nouveau message depuis votre portfolio${portfolioTitle ? ` : ${portfolioTitle}` : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">📧 Nouveau message de contact</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>De :</strong> ${name}</p>
              <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
            </div>

            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #374151;">Message :</h3>
              <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>Ce message a été envoyé depuis votre portfolio sur <a href="http://localhost:3000" style="color: #3b82f6;">Mew</a></p>
              <p>Vous pouvez répondre directement à cet email pour contacter ${name}.</p>
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
}

module.exports = new EmailService();