import React from 'react';
import Link from 'next/link';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';

function corePath(path: string, locale: Locale) {
  return ['/', '/quote', '/contact', '/venues'].includes(path) ? localizedPath(path, locale) : path;
}

export default function Footer({ locale = 'en' }: { locale?: Locale }) {
  const copy = getDictionary(locale).shell.footer;

  return (
    <footer className="py-20 border-t relative z-10" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-[0.8rem] tracking-[0.12em] uppercase leading-relaxed">
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-dim)' }}>{copy.portfolio}</p>
            <div className="space-y-3" style={{ color: 'var(--text-mute)' }}>
              <Link href="/blaze" className="block hover:opacity-100 transition-opacity opacity-70">Blaze Production</Link>
              <Link href="/kolasi" className="block hover:opacity-100 transition-opacity opacity-70">Kolasi Agency</Link>
              <Link href="/showreel" className="block hover:opacity-100 transition-opacity opacity-70">Showreel</Link>
              <Link href="/about" className="block hover:opacity-100 transition-opacity opacity-70">About</Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-dim)' }}>{copy.services}</p>
            <div className="space-y-3" style={{ color: 'var(--text-mute)' }}>
              <Link href={corePath('/quote', locale)} className="block hover:opacity-100 transition-opacity opacity-70">{copy.quote}</Link>
              <Link href={corePath('/contact', locale)} className="block hover:opacity-100 transition-opacity opacity-70">{copy.contact}</Link>
              <Link href="/journal" className="block hover:opacity-100 transition-opacity opacity-70">Journal</Link>
              <Link href="/press" className="block hover:opacity-100 transition-opacity opacity-70">Press Kit</Link>
            </div>
          </div>
          <div>
            <p className="text-[#c8a96e]/70 font-medium mb-4">{copy.venues}</p>
            <div className="space-y-3" style={{ color: 'var(--text-mute)' }}>
              <Link href={corePath('/venues', locale)} className="block hover:text-[#c8a96e] transition-colors">{copy.venuePackages}</Link>
              <Link href={`${corePath('/venues', locale)}#venue-form`} className="block hover:text-[#c8a96e] transition-colors">{copy.applyNow}</Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-dim)' }}>{copy.follow}</p>
            <div className="space-y-3" style={{ color: 'var(--text-mute)' }}>
              <a href="https://instagram.com/samuellgoldfinch" target="_blank" rel="noreferrer" className="block hover:opacity-100 transition-opacity opacity-70">@samuellgoldfinch</a>
              <a href="https://instagram.com/kolasi.paris" target="_blank" rel="noreferrer" className="block hover:opacity-100 transition-opacity opacity-70">@kolasi.paris</a>
              <a href="https://instagram.com/blazeprd" target="_blank" rel="noreferrer" className="block hover:opacity-100 transition-opacity opacity-70">@blazeprd</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t text-[0.8rem] tracking-[0.1em] uppercase leading-relaxed" style={{ borderColor: 'var(--border)', color: 'var(--text-mute)' }}>
          <p>&copy; {new Date().getFullYear()} Samuell Goldfinch ~ {copy.rights}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity opacity-70">{copy.privacy}</Link>
            <span style={{ color: 'var(--border)' }}>|</span>
            <a href="mailto:contact@samuellgoldfinch.com" className="hover:opacity-100 transition-opacity opacity-70">
              contact@samuellgoldfinch.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
