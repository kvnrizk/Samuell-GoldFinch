'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { alternateLocalePath, getDictionary, type Locale } from '@/lib/i18n';
import { DesktopNav, HeaderBrand, LanguageSwitcher, MobileNav, MobileToggle, ThemeToggle, getMoreLinks, getNavLinks, useHeaderScroll } from './header-structure';

export default function Header({ locale = 'en' }: { locale?: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isScrolled = useHeaderScroll();
  const copy = getDictionary(locale).shell.nav;
  const navLinks = getNavLinks(locale);
  const moreLinks = getMoreLinks(locale);
  const otherLocale: Locale = locale === 'fr' ? 'en' : 'fr';
  const languageHref = alternateLocalePath(pathname, otherLocale);

  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(next);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'backdrop-blur-xl py-3 md:py-5 border-b'
          : 'backdrop-blur-md py-4 md:py-8'
      }`}
      style={{
        backgroundColor: isScrolled
          ? 'color-mix(in srgb, var(--surface-page) 90%, transparent)'
          : 'color-mix(in srgb, var(--surface-page) 72%, transparent)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <HeaderBrand locale={locale} />

        <DesktopNav
          copy={copy}
          moreLinks={moreLinks}
          moreOpen={moreOpen}
          moreRef={moreRef}
          navLinks={navLinks}
          pathname={pathname}
          setMoreOpen={setMoreOpen}
        />

        <div className="hidden md:flex items-center gap-4">
          <div className="h-4 w-[1px]" style={{ backgroundColor: 'var(--border-subtle)' }} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <LanguageSwitcher locale={locale} pathname={pathname} />
        </div>

        <MobileToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      </div>

      <MobileNav
        copy={copy}
        isOpen={isOpen}
        isScrolled={isScrolled}
        languageHref={languageHref}
        moreLinks={moreLinks}
        navLinks={navLinks}
        otherLocale={otherLocale}
        pathname={pathname}
        setIsOpen={setIsOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </header>
  );
}
