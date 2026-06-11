import configPromise from '@/payload.config';
import { getPayload as getPayloadInstance } from 'payload';
import { ensurePayloadRuntimeReady } from './server-env';

export const getPayload = async () => {
  await ensurePayloadRuntimeReady();
  return getPayloadInstance({ config: configPromise });
};