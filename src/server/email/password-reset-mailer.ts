import nodemailer from 'nodemailer';
import { PASSWORD_RESET_TTL_MINUTES } from '@/domain/password-reset';

export interface PasswordResetEmail {
  to: string;
  name: string | null;
  resetUrl: string;
}

export class EmailNotConfiguredError extends Error {
  constructor() {
    super('Falta configurar GMAIL_USER y GMAIL_APP_PASSWORD para enviar correos.');
    this.name = 'EmailNotConfiguredError';
  }
}

const DEFAULT_LOCAL_URL = 'http://localhost:3000';

// La URL no sale de los headers de la petición: un Host falso podría generar enlaces hacia otro sitio.
export function getAppBaseUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return DEFAULT_LOCAL_URL;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function buildEmailBodies({ name, resetUrl }: PasswordResetEmail) {
  const greeting = name ? `Hola ${name},` : 'Hola,';
  const text = [
    greeting,
    '',
    'Recibimos una solicitud para restablecer tu clave de FinWell.',
    `Abre este enlace (vale ${PASSWORD_RESET_TTL_MINUTES} minutos): ${resetUrl}`,
    '',
    'Si no fuiste tú, ignora este correo: tu clave no cambiará.',
  ].join('\n');
  const html = `<p>${escapeHtml(greeting)}</p>
<p>Recibimos una solicitud para restablecer tu clave de FinWell.</p>
<p><a href="${escapeHtml(resetUrl)}">Crear una clave nueva</a> (el enlace vale ${PASSWORD_RESET_TTL_MINUTES} minutos).</p>
<p>Si no fuiste tú, ignora este correo: tu clave no cambiará.</p>`;
  return { text, html };
}

export async function sendPasswordResetEmail(email: PasswordResetEmail): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    // En desarrollo se muestra el enlace en consola para probar sin configurar Gmail.
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[FinWell] Enlace para restablecer la clave de ${email.to}: ${email.resetUrl}`);
      return;
    }
    throw new EmailNotConfiguredError();
  }

  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  const { text, html } = buildEmailBodies(email);
  await transporter.sendMail({
    from: `FinWell <${user}>`,
    to: email.to,
    subject: 'Restablece tu clave de FinWell',
    text,
    html,
  });
}
