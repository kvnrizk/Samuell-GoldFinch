/* eslint-disable */
// @ts-nocheck
import { importMap } from '../importMap';
import config from '@/payload.config';
import { ensurePayloadRuntimeReady } from '@/lib/server-env';

import { RootPage, generatePageMetadata } from '@payloadcms/next/views';

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = async ({ params, searchParams }: Args) => {
  await ensurePayloadRuntimeReady();
  return generatePageMetadata({ config, params, searchParams, importMap });
};

const Page = async ({ params, searchParams }: Args) => {
  await ensurePayloadRuntimeReady();
  return RootPage({ config, params, searchParams, importMap });
};

export default Page;
