'use client';

import React, { useRef, useEffect } from 'react';
import MuxPlayer from '@mux/mux-player-react';

interface VideoPlayerProps {
  src?: string;
  muxPlaybackId?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  loopEnd?: number;
  className?: string;
  mode?: 'hero' | 'showcase';
}

export default function VideoPlayer({
  src,
  muxPlaybackId,
  poster,
  autoPlay = true,
  loop = true,
  muted = true,
  loopEnd,
  className = '',
  mode = 'hero',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const posterSrc = muxPlaybackId
    ? poster || `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg`
    : poster;

  // For non-Mux sources, keep the intersection observer behavior
  useEffect(() => {
    if (muxPlaybackId) return; // MuxPlayer handles its own lazy play
    const video = videoRef.current;
    if (!video) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && autoPlay) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observerRef.current.observe(video);
    return () => observerRef.current?.disconnect();
  }, [autoPlay, muxPlaybackId]);

  useEffect(() => {
    if (!loopEnd || muxPlaybackId) return;
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.currentTime >= loopEnd) {
        video.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [loopEnd, muxPlaybackId]);

  const handleClick = () => {
    if (mode !== 'showcase') return;
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  // Use MuxPlayer for Mux content — proper HLS adaptive streaming
  if (muxPlaybackId) {
    return (
      <MuxPlayer
        playbackId={muxPlaybackId}
        poster={posterSrc}
        autoPlay={autoPlay ? 'muted' : false}
        loop={loop}
        muted={muted}
        playsInline
        streamType="on-demand"
        primaryColor="#c8a96e"
        secondaryColor="#09090b"
        className={`w-full h-full object-cover ${className}`}
        style={
          mode === 'hero'
            ? ({ '--controls': 'none', '--media-object-fit': 'cover' } as Record<string, string>)
            : ({ '--media-object-fit': 'cover' } as Record<string, string>)
        }
      />
    );
  }

  // Fallback to HTML5 video for local/external sources
  return (
    <video
      ref={videoRef}
      src={src}
      poster={posterSrc}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      onClick={handleClick}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
