'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Blaze', path: '/blaze' },
  { name: 'Kolasi', path: '/kolasi' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Quote', path: '/quote' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (stored) setTheme(stored);
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
          ? 'bg-black/90 backdrop-blur-xl py-5 border-b border-white/5'
          : 'bg-transparent py-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-lg font-serif tracking-tighter uppercase font-medium group"
        >
          Samuell{' '}
          <span className="text-white/40 group-hover:text-white transition-colors">
            Goldfinch
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-[10px] uppercase tracking-[0.4em] font-medium hover:text-white transition-colors ${
                pathname === link.path ? 'text-white' : 'text-white/40'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-4 w-[1px] bg-white/20" />
          <button
            onClick={toggleTheme}
            className="text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white/70 relative w-8 h-8 flex flex-col justify-center items-center"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-[0px]' : '-translate-y-1'
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${
              isOpen ? '-rotate-45 translate-y-[0px]' : 'translate-y-1'
            }`}
          />
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center space-y-10 transition-transform duration-700 md:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {navLinks.map((link) => (
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
          className="mt-8 text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
        >
          {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>
    </header>
  );
}
