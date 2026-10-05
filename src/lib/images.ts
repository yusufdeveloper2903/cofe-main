import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/** Builds an optimised `srcset` (1x + 0.5x of the source) for art-directed `<picture>` sources. */
export async function getResponsiveSource(src: ImageMetadata) {
  const widths = [...new Set([Math.round(src.width / 2), src.width])];
  const image = await getImage({ src, widths, format: 'webp' });
  return { src: image.src, srcset: image.srcSet.attribute };
}
