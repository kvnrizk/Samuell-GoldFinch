import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="text-center px-6">
        <h1 className="text-8xl font-serif mb-6">404</h1>
        <p className="text-sm font-light mb-12" style={{ color: 'var(--text-mute)' }}>
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="px-12 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
