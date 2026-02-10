import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-black/40 text-center relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-xs tracking-[0.4em] uppercase text-white/30">
          <p>&copy; {new Date().getFullYear()} Samuell Goldfinch ~ All Rights Reserved</p>
          <div className="flex space-x-8">
            <a
              href="https://instagram.com/samuellgoldfinch"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://instagram.com/kolasi.paris"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Kolasi IG
            </a>
            <a
              href="https://instagram.com/blazeprd"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Blaze IG
            </a>
            <a
              href="mailto:contact@samuellgoldfinch.com"
              className="hover:text-white transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
