'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n';

interface NavLink {
  name: string;
  path: string;
  accent?: boolean;
}

interface MoreLink {
  name: string;
  path: string;
  desc: string;
  icon: React.ReactNode;
}

function corePath(path: string, locale: Locale) {
  return ['/', '/quote', '/contact', '/venues'].includes(path) ? localizedPath(path, locale) : path;
}

export function getNavLinks(locale: Locale): NavLink[] {
  const copy = getDictionary(locale).shell.nav;

  return [
    { name: copy.blaze, path: '/blaze' },
    { name: copy.kolasi, path: '/kolasi' },
    { name: copy.venues, path: corePath('/venues', locale), accent: true },
    { name: copy.quote, path: corePath('/quote', locale) },
    { name: copy.about, path: '/about' },
  ];
}

export function getMoreLinks(locale: Locale): MoreLink[] {
  const copy = getDictionary(locale).shell.nav;

  return [
    {
      name: copy.contact,
      path: corePath('/contact', locale),
      desc: copy.contactDesc,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: copy.showreel,
      path: '/showreel',
      desc: copy.showreelDesc,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
          <polygon points="5 3 19 12 5 21 5 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: copy.journal,
      path: '/journal',
      desc: copy.journalDesc,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: copy.press,
      path: '/press',
      desc: copy.pressDesc,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];
}

export function useHeaderScroll() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
}

export function HeaderBrand({ locale }: { locale: Locale }) {
  return (
    <Link
      href={localizedPath('/', locale)}
      className="text-lg font-serif tracking-tighter uppercase font-medium group"
    >
      Samuell{' '}
      <span className="transition-colors" style={{ color: 'var(--text-secondary)' }}>
        Goldfinch
      </span>
    </Link>
  );
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: 'dark' | 'light';
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative w-14 h-7 rounded-full transition-colors duration-500 flex items-center"
      style={{
        backgroundColor: theme === 'dark'
          ? 'color-mix(in srgb, var(--text-accent) 15%, transparent)'
          : 'color-mix(in srgb, var(--text-accent) 25%, transparent)',
        border: '1px solid color-mix(in srgb, var(--text-accent) 20%, transparent)',
      }}
    >
      <span
        className="absolute w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          left: theme === 'dark' ? '3px' : '29px',
          backgroundColor: 'var(--text-accent)',
          boxShadow: '0 1px 4px color-mix(in srgb, var(--text-accent) 40%, transparent)',
        }}
      >
        {theme === 'dark' ? (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="var(--text-inverse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="var(--text-inverse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </span>
    </button>
  );
}

export function DesktopNav({
  copy,
  moreLinks,
  moreOpen,
  moreRef,
  navLinks,
  pathname,
  setMoreOpen,
  theme,
  toggleTheme,
}: {
  copy: ReturnType<typeof getDictionary>['shell']['nav'];
  moreLinks: MoreLink[];
  moreOpen: boolean;
  moreRef: React.RefObject<HTMLDivElement | null>;
  navLinks: NavLink[];
  pathname: string;
  setMoreOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}) {
  const isMoreActive = moreLinks.some((link) => pathname === link.path);

  return (
    <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-10">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          className="ui-micro font-medium transition-colors"
          style={{
            color: link.accent
              ? pathname === link.path ? 'var(--text-accent)' : 'color-mix(in srgb, var(--text-accent) 70%, transparent)'
              : pathname === link.path ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          {link.name}
        </Link>
      ))}

      <div className="h-4 w-[1px]" style={{ backgroundColor: 'var(--border-subtle)' }} />
      <div ref={moreRef} className="relative">
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="ui-micro font-medium transition-colors flex items-center gap-1.5"
          style={{ color: isMoreActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          aria-expanded={moreOpen}
          aria-controls="header-more-menu"
        >
          {copy.more}
          <svg
            className={`w-3 h-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${moreOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 5l3 3 3-3" />
          </svg>
        </button>

        <div
          id="header-more-menu"
          className={`absolute right-0 top-full mt-6 origin-top-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            moreOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-3 pointer-events-none'
          }`}
        >
          <div
            className="rounded-2xl p-[1px]"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--text-accent) 30%, transparent), color-mix(in srgb, var(--text-accent) 5%, transparent) 50%, color-mix(in srgb, var(--text-accent) 15%, transparent))',
            }}
          >
            <div
              className="rounded-2xl backdrop-blur-2xl overflow-hidden w-72"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--surface-page) 95%, transparent)',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5), 0 0 40px -15px color-mix(in srgb, var(--text-accent) 10%, transparent)',
              }}
            >
              <div className="p-3">
                {moreLinks.map((link, index) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMoreOpen(false)}
                    className="group flex items-start gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 sg-hover-surface"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span
                      className="mt-0.5 shrink-0 transition-colors duration-300"
                      style={{ color: pathname === link.path ? 'var(--text-accent)' : 'var(--text-muted)' }}
                    >
                      {link.icon}
                    </span>
                    <div className="min-w-0">
                      <span
                        className="block ui-kicker font-semibold transition-colors duration-300 sg-group-hover-accent"
                        style={{ color: pathname === link.path ? 'var(--text-accent)' : 'var(--text-primary)' }}
                      >
                        {link.name}
                      </span>
                      <span className="block ui-caption mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {link.desc}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div
                className="mx-3 mb-3 rounded-xl px-4 py-3 flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--surface-page)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span className="ui-micro font-medium" style={{ color: 'var(--text-muted)' }}>
                  {copy.theme}
                </span>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function LanguageLink({ href, locale }: { href: string; locale: Locale }) {
  return (
    <Link
      href={href}
      className="hidden md:block ml-6 ui-micro font-medium transition-colors"
      style={{ color: 'var(--text-muted)' }}
      aria-label={locale === 'fr' ? 'Version francaise' : 'English version'}
    >
      {locale.toUpperCase()}
    </Link>
  );
}

export function MobileToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 relative w-8 h-8 flex flex-col justify-center items-center"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-nav"
    >
      <span
        className={`block w-5 h-[1.5px] transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-[0px]' : '-translate-y-1'
        }`}
        style={{ backgroundColor: 'var(--text-primary)' }}
      />
      <span
        className={`block w-5 h-[1.5px] transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundColor: 'var(--text-primary)' }}
      />
      <span
        className={`block w-5 h-[1.5px] transition-all duration-300 ${
          isOpen ? '-rotate-45 translate-y-[0px]' : 'translate-y-1'
        }`}
        style={{ backgroundColor: 'var(--text-primary)' }}
      />
    </button>
  );
}

export function MobileNav({
  copy,
  isOpen,
  isScrolled,
  languageHref,
  moreLinks,
  navLinks,
  otherLocale,
  pathname,
  setIsOpen,
  theme,
  toggleTheme,
}: {
  copy: ReturnType<typeof getDictionary>['shell']['nav'];
  isOpen: boolean;
  isScrolled: boolean;
  languageHref: string;
  moreLinks: MoreLink[];
  navLinks: NavLink[];
  otherLocale: Locale;
  pathname: string;
  setIsOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}) {
  return (
    <div
      id="mobile-nav"
      className={`fixed left-0 right-0 z-40 md:hidden transition-all duration-400 border-b ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      style={{
        top: isScrolled ? '52px' : '60px',
        backgroundColor: 'color-mix(in srgb, var(--surface-page) 97%, transparent)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--border-subtle)',
      }}
      aria-hidden={!isOpen}
    >
      <nav aria-label="Mobile navigation" className="flex flex-col items-center gap-3 px-6 py-6">
        {[...navLinks, ...moreLinks].map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={() => setIsOpen(false)}
            className="ui-kicker font-medium transition-colors py-1"
            style={{ color: pathname === link.path ? 'var(--text-accent)' : 'var(--text-secondary)' }}
          >
            {link.name}
          </Link>
        ))}
        <div className="mt-2 pt-3 border-t w-24 text-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={toggleTheme}
            className="ui-micro transition-colors flex items-center gap-2 mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            {theme === 'dark' ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="var(--text-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            {theme === 'dark' ? copy.light : copy.dark}
          </button>
          <Link
            href={languageHref}
            onClick={() => setIsOpen(false)}
            className="mt-4 block ui-micro transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            {otherLocale.toUpperCase()}
          </Link>
        </div>
      </nav>
    </div>
  );
}
