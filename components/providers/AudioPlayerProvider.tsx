'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

export interface AudioTrack {
  title: string;
  artist: string;
  url: string;
  platform?: string;
}

interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
}

interface AudioPlayerContextValue extends AudioPlayerState {
  play: (track: AudioTrack) => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  close: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}

/**
 * Check if a URL can be played directly via <audio> element.
 * SoundCloud/Mixcloud/Spotify page URLs cannot be played directly.
 */
function isDirectAudioUrl(url: string): boolean {
  // Direct audio file extensions
  if (/\.(mp3|wav|ogg|m4a|aac|flac|webm)(\?|$)/i.test(url)) return true;
  // SoundCloud API streaming URLs
  if (url.includes('api.soundcloud.com') && url.includes('/stream')) return true;
  return false;
}

/**
 * Build a SoundCloud widget embed URL from a track page URL.
 */
export function getSoundCloudEmbedUrl(trackUrl: string): string | null {
  if (!trackUrl.includes('soundcloud.com')) return null;
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&auto_play=true&color=%23c8a96e&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const play = useCallback((track: AudioTrack) => {
    const audio = audioRef.current;

    // If same track, just resume
    if (currentTrack?.url === track.url && audio) {
      audio.play().catch(() => {});
      setIsPlaying(true);
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setDuration(0);

    // Only set audio src if it's a direct audio URL
    if (audio && isDirectAudioUrl(track.url)) {
      audio.src = track.url;
      audio.volume = volume;
      audio.play().catch(() => {});
    }
  }, [currentTrack, volume]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      const audio = audioRef.current;
      if (audio && isDirectAudioUrl(currentTrack.url)) {
        audio.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  }, [isPlaying, pause, currentTrack]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio && isFinite(time)) {
      audio.currentTime = time;
      setProgress(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{ currentTrack, isPlaying, progress, duration, volume, play, pause, toggle, seek, setVolume, close, audioRef }}
    >
      {children}
      <audio ref={audioRef} preload="metadata" />
    </AudioPlayerContext.Provider>
  );
}
