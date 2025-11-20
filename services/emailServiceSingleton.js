import EmailService from './emailService.js';

let instance = null;

export default function getEmailService() {
  if (!instance) {
    instance = new EmailService();
  }
  instance.configurar();
  return instance;
}