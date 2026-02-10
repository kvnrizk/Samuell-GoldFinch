const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderProps): string {
  const q = quality || 'auto';
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
