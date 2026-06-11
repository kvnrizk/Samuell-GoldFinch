/* eslint-disable */
// @ts-nocheck
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes';
import config from '@/payload.config';
import { ensurePayloadRuntimeReady } from '@/lib/server-env';

const withPayloadEnv = <T extends (...args: any[]) => any>(handler: T): T => {
  return (async (...args: Parameters<T>) => {
    await ensurePayloadRuntimeReady();
    return handler(...args);
  }) as T;
};

export const GET = withPayloadEnv(REST_GET(config));
export const POST = withPayloadEnv(REST_POST(config));
export const DELETE = withPayloadEnv(REST_DELETE(config));
export const PATCH = withPayloadEnv(REST_PATCH(config));
export const PUT = withPayloadEnv(REST_PUT(config));
export const OPTIONS = withPayloadEnv(REST_OPTIONS(config));