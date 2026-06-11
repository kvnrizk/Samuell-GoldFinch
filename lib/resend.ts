import { Resend } from 'resend';
import { getResendApiKey } from './server-env';

let resend: Resend | null = null;

export function getResend() {
  if (!resend) {
    resend = new Resend(getResendApiKey());
  }

  return resend;
}