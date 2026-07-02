'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="text-center px-6">
        <h1 className="text-6xl font-serif mb-6">Something went wrong</h1>
        <p className="text-sm font-light mb-12" style={{ color: 'var(--text-mute)' }}>
          An unexpected error occurred.
        </p>
        <button
          onClick={reset}
          className="px-12 py-4 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
