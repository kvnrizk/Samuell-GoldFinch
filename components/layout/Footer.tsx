import React from 'react';
import Link from 'next/link';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';

function corePath(path: string, locale: Locale) {
  return ['/', '/quote', '/contact', '/venues'].includes(path) ? localizedPath(path, locale) : path;
}

export default function Footer({ locale = 'en' }: { locale?: Locale }) {
  const copy = getDictionary(locale).shell.footer;

  return (
    <footer className="py-20 border-t relative z-10" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'color-mix(in srgb, var(--surface-page) 60%, transparent)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-[0.8rem] tracking-[0.12em] uppercase leading-relaxed">
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{copy.portfolio}</p>
            <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
              <Link href="/blaze" className="block sg-hover-accent transition-colors">Blaze Production</Link>
              <Link href="/kolasi" className="block sg-hover-accent transition-colors">Kolasi Agency</Link>
              <Link href="/showreel" className="block sg-hover-accent transition-colors">Showreel</Link>
              <Link href="/about" className="block sg-hover-accent transition-colors">About</Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{copy.services}</p>
            <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
              <Link href={corePath('/quote', locale)} className="block sg-hover-accent transition-colors">{copy.quote}</Link>
              <Link href={corePath('/contact', locale)} className="block sg-hover-accent transition-colors">{copy.contact}</Link>
              <Link href="/journal" className="block sg-hover-accent transition-colors">Journal</Link>
              <Link href="/press" className="block sg-hover-accent transition-colors">Press Kit</Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-4" style={{ color: 'color-mix(in srgb, var(--text-accent) 70%, transparent)' }}>{copy.venues}</p>
            <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
              <Link href={corePath('/venues', locale)} className="block sg-hover-accent transition-colors">{copy.venuePackages}</Link>
              <Link href={`${corePath('/venues', locale)}#venue-form`} className="block sg-hover-accent transition-colors">{copy.applyNow}</Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{copy.follow}</p>
            <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
              <a href="https://instagram.com/samuellgoldfinch" target="_blank" rel="noreferrer" className="block sg-hover-accent transition-colors">@samuellgoldfinch</a>
              <a href="https://instagram.com/kolasi.paris" target="_blank" rel="noreferrer" className="block sg-hover-accent transition-colors">@kolasi.paris</a>
              <a href="https://instagram.com/blazeprd" target="_blank" rel="noreferrer" className="block sg-hover-accent transition-colors">@blazeprd</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t text-[0.8rem] tracking-[0.1em] uppercase leading-relaxed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <p>&copy; {new Date().getFullYear()} Samuell Goldfinch ~ {copy.rights}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="sg-hover-accent transition-colors">{copy.privacy}</Link>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            <a href="mailto:contact@samuellgoldfinch.com" className="sg-hover-accent transition-colors">
              contact@samuellgoldfinch.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
