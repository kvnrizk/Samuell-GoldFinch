'use client';

import React, { useRef, useEffect } from 'react';

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

  const videoSrc = muxPlaybackId
    ? `https://stream.mux.com/${muxPlaybackId}.m3u8`
    : src;

  const posterSrc = muxPlaybackId
    ? poster || `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg`
    : poster;

  useEffect(() => {
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
  }, [autoPlay]);

  useEffect(() => {
    if (!loopEnd) return;
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.currentTime >= loopEnd) {
        video.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [loopEnd]);

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

  return (
    <video
      ref={videoRef}
      src={videoSrc}
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
