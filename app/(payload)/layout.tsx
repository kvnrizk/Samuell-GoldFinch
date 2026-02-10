/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import config from '@/payload.config';
import { importMap } from './admin/importMap';
import '@payloadcms/next/css';

export const metadata = {
  title: 'Admin — Samuell Goldfinch',
  description: 'Payload CMS Admin Panel',
};

const serverFunctionHandler = async function (args: any) {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunctionHandler}>
      {children}
    </RootLayout>
  );
}
