class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.senderEmail = process.env.BREVO_SENDER;
    this.apiUrl = 'https://api.brevo.com/v3/smtp/email';
  }

  configurar() {
    console.log(">> EmailService configurado. API KEY:", this.apiKey ? "OK" : "MISSING");
    console.log(">> Sender:", this.senderEmail);
  }

  async enviar(to, subject, html) {
    if (!this.apiKey) {
      throw new Error("BREVO_API_KEY no está configurada");
    }

    if (!this.senderEmail) {
      throw new Error("BREVO_SENDER no está configurado");
    }

    try {
      const emailData = {
        sender: { 
          email: this.senderEmail, 
          name: 'Mascotas App' 
        },
        to: [{ email: to }],
        subject,
        htmlContent: html
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo API error: ${response.status} - ${errorText}`);
      }

      console.log("✅ Email enviado correctamente a:", to);
      return await response.json();

    } catch (error) {
      console.error("ERROR BREVO:", error.message); 
      throw new Error("No se pudo enviar el correo de activación");
    }
  }
}

export default EmailService;