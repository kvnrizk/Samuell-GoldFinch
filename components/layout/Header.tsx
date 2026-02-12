'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Blaze', path: '/blaze' },
  { name: 'Kolasi', path: '/kolasi' },
  { name: 'For Venues', path: '/venues', accent: true },
  { name: 'Quote', path: '/quote' },
  { name: 'About', path: '/about' },
];

const moreLinks = [
  {
    name: 'Contact',
    path: '/contact',
    desc: 'Get in touch with us',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Showreel',
    path: '/showreel',
    desc: 'Watch our latest work',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
        <polygon points="5 3 19 12 5 21 5 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Journal',
    path: '/journal',
    desc: 'Stories & behind the scenes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Press Kit',
    path: '/press',
    desc: 'Logos, bios & media assets',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

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

  const isMoreActive = moreLinks.some((l) => pathname === l.path);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'backdrop-blur-xl py-5 border-b'
          : 'bg-transparent py-10'
      }`}
      style={isScrolled ? { backgroundColor: 'color-mix(in srgb, var(--bg) 90%, transparent)', borderColor: 'var(--border)' } : undefined}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-lg font-serif tracking-tighter uppercase font-medium group"
        >
          Samuell{' '}
          <span className="transition-colors" style={{ color: 'var(--text-dim)' }}>
            Goldfinch
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="text-[10px] uppercase tracking-[0.4em] font-medium transition-colors"
              style={{
                color: link.accent
                  ? pathname === link.path ? '#c8a96e' : 'rgba(200,169,110,0.7)'
                  : pathname === link.path ? 'var(--text)' : 'var(--text-dim)',
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* More dropdown trigger */}
          <div className="h-4 w-[1px]" style={{ backgroundColor: 'var(--border)' }} />
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="text-[10px] uppercase tracking-[0.4em] font-medium transition-colors flex items-center gap-1.5"
              style={{ color: isMoreActive ? 'var(--text)' : 'var(--text-dim)' }}
              aria-expanded={moreOpen}
            >
              More
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

            {/* Mega dropdown */}
            <div
              className={`absolute right-0 top-full mt-6 origin-top-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                moreOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-3 pointer-events-none'
              }`}
            >
              {/* Outer glow border */}
              <div
                className="rounded-2xl p-[1px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,169,110,0.3), rgba(200,169,110,0.05) 50%, rgba(200,169,110,0.15))',
                }}
              >
                <div
                  className="rounded-2xl backdrop-blur-2xl overflow-hidden w-72"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--bg) 95%, transparent)',
                    boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5), 0 0 40px -15px rgba(200,169,110,0.1)',
                  }}
                >
                  {/* Links */}
                  <div className="p-3">
                    {moreLinks.map((link, i) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={() => setMoreOpen(false)}
                        className="group flex items-start gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 hover:bg-white/[0.04]"
                        style={{
                          animationDelay: `${i * 50}ms`,
                        }}
                      >
                        <span
                          className="mt-0.5 shrink-0 transition-colors duration-300"
                          style={{
                            color: pathname === link.path ? '#c8a96e' : 'var(--text-mute)',
                          }}
                        >
                          {link.icon}
                        </span>
                        <div className="min-w-0">
                          <span
                            className="block text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 group-hover:text-[#c8a96e]"
                            style={{
                              color: pathname === link.path ? '#c8a96e' : 'var(--text)',
                            }}
                          >
                            {link.name}
                          </span>
                          <span
                            className="block text-[10px] mt-0.5 tracking-wide leading-relaxed"
                            style={{ color: 'var(--text-mute)' }}
                          >
                            {link.desc}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Theme toggle footer */}
                  <div
                    className="mx-3 mb-3 rounded-xl px-4 py-3 flex items-center justify-between"
                    style={{
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span
                      className="text-[10px] uppercase tracking-[0.2em] font-medium"
                      style={{ color: 'var(--text-mute)' }}
                    >
                      Theme
                    </span>
                    <button
                      onClick={toggleTheme}
                      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                      className="relative w-14 h-7 rounded-full transition-colors duration-500 flex items-center"
                      style={{
                        backgroundColor: theme === 'dark'
                          ? 'rgba(200,169,110,0.15)'
                          : 'rgba(200,169,110,0.25)',
                        border: '1px solid rgba(200,169,110,0.2)',
                      }}
                    >
                      {/* Sliding knob */}
                      <span
                        className="absolute w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          left: theme === 'dark' ? '3px' : '29px',
                          backgroundColor: '#c8a96e',
                          boxShadow: '0 1px 4px rgba(200,169,110,0.4)',
                        }}
                      >
                        {theme === 'dark' ? (
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 relative w-8 h-8 flex flex-col justify-center items-center"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          <span
            className={`block w-5 h-[1.5px] transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-[0px]' : '-translate-y-1'
            }`}
            style={{ backgroundColor: 'var(--text)' }}
          />
          <span
            className={`block w-5 h-[1.5px] transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: 'var(--text)' }}
          />
          <span
            className={`block w-5 h-[1.5px] transition-all duration-300 ${
              isOpen ? '-rotate-45 translate-y-[0px]' : 'translate-y-1'
            }`}
            style={{ backgroundColor: 'var(--text)' }}
          />
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-700 md:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
        style={{ backgroundColor: 'var(--bg)' }}
        aria-hidden={!isOpen}
      >
        {[...navLinks, ...moreLinks].map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={() => setIsOpen(false)}
            className="text-3xl font-serif italic hover:not-italic transition-all uppercase tracking-tighter"
          >
            {link.name}
          </Link>
        ))}
        <button
          onClick={toggleTheme}
          className="mt-4 text-[10px] uppercase tracking-[0.4em] transition-colors flex items-center gap-2"
          style={{ color: 'var(--text-dim)' }}
        >
          {theme === 'dark' ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>
    </header>
  );
}
