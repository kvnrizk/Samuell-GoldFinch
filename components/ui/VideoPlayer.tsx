'use client';

import React, { useRef, useEffect } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { cloudinaryVideoUrl, cloudinaryVideoPoster } from '@/lib/cloudinary';

interface VideoPlayerProps {
  src?: string;
  muxPlaybackId?: string;
  cloudinaryVideoId?: string;
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
  cloudinaryVideoId,
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

  // Resolve the video source: Cloudinary → Mux → raw src
  const resolvedSrc = cloudinaryVideoId
    ? cloudinaryVideoUrl(cloudinaryVideoId)
    : src;

  const posterSrc = cloudinaryVideoId
    ? poster || cloudinaryVideoPoster(cloudinaryVideoId)
    : muxPlaybackId
      ? poster || `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg`
      : poster;

  const useMux = Boolean(muxPlaybackId) && !cloudinaryVideoId;

  // For non-Mux sources, use intersection observer for lazy play
  useEffect(() => {
    if (useMux) return;
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
  }, [autoPlay, useMux]);

  useEffect(() => {
    if (!loopEnd || useMux) return;
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.currentTime >= loopEnd) {
        video.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [loopEnd, useMux]);

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
  if (useMux) {
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

  // HTML5 video for Cloudinary and local/external sources
  return (
    <video
      ref={videoRef}
      src={resolvedSrc}
      poster={posterSrc ?? undefined}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      onClick={handleClick}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
