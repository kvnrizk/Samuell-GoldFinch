import { Socket } from 'node:net';

export type ServerEnvName =
  | 'DATABASE_URI'
  | 'PAYLOAD_SECRET'
  | 'NEXT_PUBLIC_SITE_URL'
  | 'CLOUDINARY_CLOUD_NAME'
  | 'CLOUDINARY_API_KEY'
  | 'CLOUDINARY_API_SECRET'
  | 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'
  | 'RESEND_API_KEY';

export class MissingServerEnvError extends Error {
  readonly missing: ServerEnvName[];

  constructor(missing: ServerEnvName[], context: string) {
    super(
      `[env] Missing required ${context} env ${missing.length === 1 ? 'variable' : 'variables'}: ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill the missing value(s).',
    );
    this.name = 'MissingServerEnvError';
    this.missing = missing;
  }
}

export class LocalDatabaseUnavailableError extends Error {
  constructor(host: string, port: number) {
    super(
      `[env] DATABASE_URI points to local MongoDB at ${host}:${port}, but nothing is accepting connections. ` +
        'Start MongoDB locally or replace DATABASE_URI with the MongoDB Atlas connection string.',
    );
    this.name = 'LocalDatabaseUnavailableError';
  }
}

export function getServerEnv(name: ServerEnvName): string {
  return process.env[name]?.trim() || '';
}

export function requireServerEnv(names: ServerEnvName[], context: string): Record<ServerEnvName, string> {
  const missing = names.filter((name) => !getServerEnv(name));
  if (missing.length > 0) {
    throw new MissingServerEnvError(missing, context);
  }

  return names.reduce((env, name) => {
    env[name] = getServerEnv(name);
    return env;
  }, {} as Record<ServerEnvName, string>);
}

export function ensurePayloadRuntimeEnv() {
  return requireServerEnv(['DATABASE_URI', 'PAYLOAD_SECRET'], 'Payload');
}

export async function ensurePayloadRuntimeReady() {
  const env = ensurePayloadRuntimeEnv();
  await ensureLocalMongoReachable(env.DATABASE_URI);
  return env;
}

export function getPayloadConfigEnv() {
  return {
    databaseUri: getServerEnv('DATABASE_URI') || 'mongodb://127.0.0.1:27017/sg-platform-missing-env',
    payloadSecret: getServerEnv('PAYLOAD_SECRET') || 'missing-payload-secret',
    siteUrl: getServerEnv('NEXT_PUBLIC_SITE_URL') || 'http://localhost:3000',
  };
}

export function getCloudinaryServerEnv() {
  return requireServerEnv(
    ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
    'Cloudinary upload',
  );
}

export function getResendApiKey(): string {
  return requireServerEnv(['RESEND_API_KEY'], 'Resend email').RESEND_API_KEY;
}

export function describeError(error: unknown): string {
  if (error instanceof MissingServerEnvError || error instanceof LocalDatabaseUnavailableError) return error.message;
  if (error instanceof Error) return error.message;
  return String(error);
}

function getLocalMongoEndpoint(uri: string): { host: string; port: number } | null {
  if (!uri.startsWith('mongodb://')) return null;

  try {
    const parsed = new URL(uri);
    const host = parsed.hostname;
    const isLocal = host === '127.0.0.1' || host === 'localhost' || host === '::1';
    if (!isLocal) return null;

    return {
      host,
      port: parsed.port ? Number(parsed.port) : 27017,
    };
  } catch {
    return null;
  }
}

async function ensureLocalMongoReachable(uri: string): Promise<void> {
  const endpoint = getLocalMongoEndpoint(uri);
  if (!endpoint) return;

  await new Promise<void>((resolve, reject) => {
    const socket = new Socket();
    const fail = () => {
      socket.destroy();
      reject(new LocalDatabaseUnavailableError(endpoint.host, endpoint.port));
    };

    socket.setTimeout(300);
    socket.once('connect', () => {
      socket.end();
      resolve();
    });
    socket.once('timeout', fail);
    socket.once('error', fail);
    socket.connect(endpoint.port, endpoint.host);
  });
}