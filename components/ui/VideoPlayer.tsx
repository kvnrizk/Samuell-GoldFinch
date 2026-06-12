'use client';

import React, { useRef, useEffect, useState } from 'react';
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
  lazy?: boolean;
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
  lazy = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [shouldLoad, setShouldLoad] = useState(!lazy);

  // Resolve the video source: Cloudinary -> Mux -> raw src
  const resolvedSrc = cloudinaryVideoId
    ? cloudinaryVideoUrl(cloudinaryVideoId)
    : src;

  const posterSrc = cloudinaryVideoId
    ? poster || cloudinaryVideoPoster(cloudinaryVideoId)
    : muxPlaybackId
      ? poster || `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg`
      : poster;

  const useMux = Boolean(muxPlaybackId) && !cloudinaryVideoId;

  useEffect(() => {
    if (!lazy || shouldLoad) return;
    const container = containerRef.current;
    if (!container) return;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: '400px 0px', threshold: 0.01 },
    );

    loadObserver.observe(container);
    return () => loadObserver.disconnect();
  }, [lazy, shouldLoad]);

  // For non-Mux sources, use intersection observer for viewport play/pause.
  useEffect(() => {
    if (useMux || !shouldLoad) return;
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
  }, [autoPlay, shouldLoad, useMux]);

  useEffect(() => {
    if (!loopEnd || useMux || !shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.currentTime >= loopEnd) {
        video.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [loopEnd, shouldLoad, useMux]);

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

  const mediaClassName = `w-full h-full object-cover ${className}`;

  if (!shouldLoad) {
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className={mediaClassName}
        style={{
          backgroundColor: '#09090b',
          backgroundImage: posterSrc ? `url(${posterSrc})` : undefined,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
    );
  }

  // Use MuxPlayer for Mux content: proper HLS adaptive streaming.
  if (useMux) {
    return (
      <div ref={containerRef} className="w-full h-full">
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
          className={mediaClassName}
          style={
            mode === 'hero'
              ? ({ '--controls': 'none', '--media-object-fit': 'cover' } as Record<string, string>)
              : ({ '--media-object-fit': 'cover' } as Record<string, string>)
          }
        />
      </div>
    );
  }

  // HTML5 video for Cloudinary and local/external sources.
  return (
    <video
      ref={videoRef}
      src={resolvedSrc}
      poster={posterSrc ?? undefined}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload={lazy ? 'none' : 'metadata'}
      onClick={handleClick}
      className={mediaClassName}
    />
  );
}