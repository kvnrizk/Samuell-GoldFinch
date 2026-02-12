import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 border-t relative z-10" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-[10px] uppercase tracking-[0.3em]">
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-dim)' }}>Portfolio</p>
            <div className="space-y-3" style={{ color: 'var(--text-mute)' }}>
              <Link href="/blaze" className="block hover:opacity-100 transition-opacity opacity-70">Blaze Production</Link>
              <Link href="/kolasi" className="block hover:opacity-100 transition-opacity opacity-70">Kolasi Agency</Link>
              <Link href="/showreel" className="block hover:opacity-100 transition-opacity opacity-70">Showreel</Link>
              <Link href="/about" className="block hover:opacity-100 transition-opacity opacity-70">About</Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-dim)' }}>Services</p>
            <div className="space-y-3" style={{ color: 'var(--text-mute)' }}>
              <Link href="/quote" className="block hover:opacity-100 transition-opacity opacity-70">Request a Quote</Link>
              <Link href="/contact" className="block hover:opacity-100 transition-opacity opacity-70">Contact</Link>
              <Link href="/journal" className="block hover:opacity-100 transition-opacity opacity-70">Journal</Link>
              <Link href="/press" className="block hover:opacity-100 transition-opacity opacity-70">Press Kit</Link>
            </div>
          </div>
          <div>
            <p className="text-[#c8a96e]/70 font-medium mb-4">For Venues</p>
            <div className="space-y-3" style={{ color: 'var(--text-mute)' }}>
              <Link href="/venues" className="block hover:text-[#c8a96e] transition-colors">Venue Packages</Link>
              <Link href="/venues#venue-form" className="block hover:text-[#c8a96e] transition-colors">Apply Now</Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-4" style={{ color: 'var(--text-dim)' }}>Follow</p>
            <div className="space-y-3" style={{ color: 'var(--text-mute)' }}>
              <a href="https://instagram.com/samuellgoldfinch" target="_blank" rel="noreferrer" className="block hover:opacity-100 transition-opacity opacity-70">@samuellgoldfinch</a>
              <a href="https://instagram.com/kolasi.paris" target="_blank" rel="noreferrer" className="block hover:opacity-100 transition-opacity opacity-70">@kolasi.paris</a>
              <a href="https://instagram.com/blazeprd" target="_blank" rel="noreferrer" className="block hover:opacity-100 transition-opacity opacity-70">@blazeprd</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t text-[10px] tracking-[0.3em] uppercase" style={{ borderColor: 'var(--border)', color: 'var(--text-mute)' }}>
          <p>&copy; {new Date().getFullYear()} Samuell Goldfinch ~ All Rights Reserved</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity opacity-70">Privacy Policy</Link>
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
