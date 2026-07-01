const CORE_PRODUCTION_ENV = [
  'DATABASE_URI',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SITE_URL',
] as const;

export const SERVER_ENV_VARS = [
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CRON_SECRET',
  'DATABASE_URI',
  'MUX_TOKEN_ID',
  'MUX_TOKEN_SECRET',
  'PAYLOAD_SECRET',
  'RESEND_API_KEY',
  'SAM_WHATSAPP_NUMBER',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_FROM',
] as const;

export const PUBLIC_ENV_VARS = [
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_GA4_ID',
  'NEXT_PUBLIC_META_PIXEL_ID',
  'NEXT_PUBLIC_SITE_URL',
] as const;

type EnvSource = Record<string, string | undefined>;

export function getEnv(name: string, env: EnvSource = process.env): string | undefined {
  const value = env[name];
  return value && value.trim() ? value : undefined;
}

export function getRequiredProductionEnv(
  name: (typeof CORE_PRODUCTION_ENV)[number],
  env: EnvSource = process.env,
): string {
  const value = getEnv(name, env);

  if (!value && env.NODE_ENV === 'production') {
    throw new Error(`[env] Missing required production environment variable: ${name}`);
  }

  return value || '';
}

export function validateProductionEnv(env: EnvSource = process.env) {
  const missing = env.NODE_ENV === 'production'
    ? CORE_PRODUCTION_ENV.filter((name) => !getEnv(name, env))
    : [];

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required production environment variables: ${missing.join(', ')}`,
    );
  }

  return {
    ok: true,
    missing,
    required: [...CORE_PRODUCTION_ENV],
    public: [...PUBLIC_ENV_VARS],
    server: [...SERVER_ENV_VARS],
  };
}
