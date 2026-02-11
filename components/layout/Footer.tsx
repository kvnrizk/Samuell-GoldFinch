import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-black/40 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-[10px] uppercase tracking-[0.3em]">
          <div>
            <p className="text-white/50 font-medium mb-4">Portfolio</p>
            <div className="space-y-3 text-white/30">
              <Link href="/blaze" className="block hover:text-white transition-colors">Blaze Production</Link>
              <Link href="/kolasi" className="block hover:text-white transition-colors">Kolasi Agency</Link>
              <Link href="/about" className="block hover:text-white transition-colors">About</Link>
            </div>
          </div>
          <div>
            <p className="text-white/50 font-medium mb-4">Services</p>
            <div className="space-y-3 text-white/30">
              <Link href="/quote" className="block hover:text-white transition-colors">Request a Quote</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-[#c8a96e]/70 font-medium mb-4">For Venues</p>
            <div className="space-y-3 text-white/30">
              <Link href="/venues" className="block hover:text-[#c8a96e] transition-colors">Venue Packages</Link>
              <Link href="/venues#venue-form" className="block hover:text-[#c8a96e] transition-colors">Apply Now</Link>
            </div>
          </div>
          <div>
            <p className="text-white/50 font-medium mb-4">Follow</p>
            <div className="space-y-3 text-white/30">
              <a href="https://instagram.com/samuellgoldfinch" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">@samuellgoldfinch</a>
              <a href="https://instagram.com/kolasi.paris" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">@kolasi.paris</a>
              <a href="https://instagram.com/blazeprd" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">@blazeprd</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t border-white/5 text-[10px] tracking-[0.3em] uppercase text-white/30">
          <p>&copy; {new Date().getFullYear()} Samuell Goldfinch ~ All Rights Reserved</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/10">|</span>
            <a href="mailto:contact@samuellgoldfinch.com" className="hover:text-white transition-colors">
              contact@samuellgoldfinch.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
