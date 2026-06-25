import React from 'react';
import SiteShell from '@/components/layout/SiteShell';

export default function FrenchSiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="fr">{children}</SiteShell>;
}
