import { Resend } from 'resend';
import { getEnv } from './env';

let resend: Resend | null = null;

export function getResend() {
  if (!resend) {
    resend = new Resend(getEnv('RESEND_API_KEY'));
  }

  return resend;
}
