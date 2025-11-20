import SibApiV3Sdk from '@sendinblue/client';

class EmailService {
  constructor() {
    this.client = new SibApiV3Sdk.TransactionalEmailsApi();
    this.client.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );
  }

  async enviar(to, subject, html) {
    try {
      await this.client.sendTransacEmail({
        sender: { 
          email: process.env.BREVO_SENDER, 
          name: 'Mascotas App' 
        },
        to: [{ email: to }],
        subject,
        htmlContent: html
      });

    } catch (error) {
      console.error("ERROR BREVO:", JSON.stringify(error, null, 2)); 
      throw new Error("No se pudo enviar el correo de activación");
    }
  }
}

export default new EmailService();
