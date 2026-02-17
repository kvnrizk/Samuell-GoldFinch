const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderProps): string {
  const q = quality || 'auto';

  // Full Cloudinary URL — inject transforms before the public ID
  if (src.includes('res.cloudinary.com')) {
    return src.replace('/upload/', `/upload/f_auto,q_${q},w_${width}/`);
  }

  // Non-Cloudinary URL (local /assets/ paths, external) — passthrough
  if (src.startsWith('/') || src.startsWith('http')) {
    return src;
  }

  // Public ID — construct full Cloudinary URL
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_${q},w_${width}/${src}`;
}

export function cloudinaryUrl(
  publicId: string,
  transform: string = 'f_auto,q_auto',
): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

export function lqipUrl(publicId: string): string {
  return cloudinaryUrl(publicId, 'c_fill,w_50,e_blur:800,f_auto,q_30');
}

export const NAMED_TRANSFORMS = {
  thumb: 'c_fill,w_480,h_320,f_auto,q_auto',
  medium: 'c_fill,w_768,f_auto,q_auto',
  large: 'c_fill,w_1200,f_auto,q_auto',
  hero: 'c_fill,w_1920,f_auto,q_auto',
  lqip: 'c_fill,w_50,e_blur:800,f_auto,q_30',
} as const;

/* ── Blur placeholder for Next.js Image (generic dark shimmer) ── */
export const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PGZpbHRlciBpZD0iYiI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTIiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMTExMTE0IiBmaWx0ZXI9InVybCgjYikiLz48L3N2Zz4=';

/* ── Cloudinary Video Helpers ── */

export function cloudinaryVideoUrl(
  publicId: string,
  transform: string = 'f_auto,q_auto',
): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transform}/${publicId}`;
}

export function cloudinaryVideoPoster(
  publicId: string,
  timeSeconds: number = 2,
): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_${timeSeconds},f_jpg,w_1280,q_auto/${publicId}.jpg`;
}
