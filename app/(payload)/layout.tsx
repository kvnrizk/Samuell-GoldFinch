/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import config from '@/payload.config';
import { ensurePayloadRuntimeReady } from '@/lib/server-env';
import { importMap } from './admin/importMap';
import '@payloadcms/next/css';

export const metadata = {
  title: 'Admin — Samuell Goldfinch',
  description: 'Payload CMS Admin Panel',
};

const serverFunctionHandler = async function (args: any) {
  'use server';
  await ensurePayloadRuntimeReady();
  return handleServerFunctions({ ...args, config, importMap });
};

export default async function PayloadLayout({ children }: { children: React.ReactNode }) {
  await ensurePayloadRuntimeReady();
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunctionHandler}>
      {children}
    </RootLayout>
  );
}
