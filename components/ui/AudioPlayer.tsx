'use client';

import React, { useRef, useState } from 'react';
import { useAudioPlayer, getSoundCloudEmbedUrl } from '@/components/providers/AudioPlayerProvider';

function formatTime(secs: number): string {
  if (!isFinite(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function isDirectAudioUrl(url: string): boolean {
  if (/\.(mp3|wav|ogg|m4a|aac|flac|webm)(\?|$)/i.test(url)) return true;
  if (url.includes('api.soundcloud.com') && url.includes('/stream')) return true;
  return false;
}

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    toggle,
    seek,
    setVolume,
    close,
  } = useAudioPlayer();

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  // If no track, render nothing
  if (!currentTrack) return null;

  const isDirect = isDirectAudioUrl(currentTrack.url);
  const soundCloudEmbed = !isDirect ? getSoundCloudEmbedUrl(currentTrack.url) : null;
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDirect || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(pct * duration);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !isDirect || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(pct * duration);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] border-t backdrop-blur-xl"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 92%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      {/* SoundCloud iframe embed (hidden visually, provides audio) */}
      {soundCloudEmbed && (
        <iframe
          title="SoundCloud Player"
          src={soundCloudEmbed}
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          allow="autoplay"
          style={{ border: 'none' }}
        />
      )}

      {/* Progress bar (direct audio only) */}
      {isDirect && (
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 right-0 h-1 cursor-pointer group"
          onClick={handleProgressClick}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleProgressDrag}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--border)' }} />
          <div
            className="absolute top-0 left-0 h-full transition-[width] duration-100"
            style={{ width: `${progressPct}%`, backgroundColor: '#c8a96e' }}
          />
          {/* Hover knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#c8a96e] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progressPct}%`, transform: `translate(-50%, -50%)` }}
          />
        </div>
      )}

      {/* Player bar content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
        {/* Play/Pause */}
        {isDirect && (
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors hover:border-[#c8a96e] hover:text-[#c8a96e]"
            style={{ borderColor: 'var(--border-hi)', color: 'var(--text-dim)' }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21" />
              </svg>
            )}
          </button>
        )}

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
            {currentTrack.title}
          </p>
          <p className="text-[10px] truncate" style={{ color: 'var(--text-mute)' }}>
            {currentTrack.artist}
            {isDirect && duration > 0 && (
              <span> &middot; {formatTime(progress)} / {formatTime(duration)}</span>
            )}
            {!isDirect && currentTrack.platform && (
              <span> &middot; Playing on {currentTrack.platform}</span>
            )}
          </p>
        </div>

        {/* Volume (direct audio only) */}
        {isDirect && (
          <div className="hidden md:flex items-center gap-2 relative">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="p-2 transition-colors hover:text-[#c8a96e]"
              style={{ color: 'var(--text-dim)' }}
              aria-label="Volume"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {volume === 0 ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                  </>
                )}
              </svg>
            </button>
            {showVolume && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-[#c8a96e]"
                aria-label="Volume slider"
              />
            )}
          </div>
        )}

        {/* External link for embed tracks */}
        {!isDirect && (
          <a
            href={currentTrack.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 transition-colors hover:text-[#c8a96e] flex-shrink-0"
            style={{ color: 'var(--text-dim)' }}
            aria-label={`Open on ${currentTrack.platform || 'source'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}

        {/* Close */}
        <button
          onClick={close}
          className="p-2 transition-colors hover:text-[#c8a96e] flex-shrink-0"
          style={{ color: 'var(--text-mute)' }}
          aria-label="Close player"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
