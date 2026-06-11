import { describeError } from './server-env';

export async function safeCms<T>(
  promise: Promise<T>,
  fallback: T,
  label = 'CMS fetch',
): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    console.warn(`[cms-safe] ${label} failed; using fallback. ${describeError(err)}`);
    return fallback;
  }
}