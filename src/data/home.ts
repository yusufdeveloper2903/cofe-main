import type { ImageMetadata } from 'astro';
import type { SvgComponent } from 'astro/types';
import BenefitPerks from '@/assets/icons/benefit-perks.svg';
import BenefitQuality from '@/assets/icons/benefit-quality.svg';
import BenefitShipping from '@/assets/icons/benefit-shipping.svg';
import danche from '@/assets/images/home/coffee-danche.png';
import granEspresso from '@/assets/images/home/coffee-gran-espresso.png';
import piccollo from '@/assets/images/home/coffee-piccollo.png';
import planalto from '@/assets/images/home/coffee-planalto.png';

export interface Coffee {
  name: string;
  description: string;
  image: ImageMetadata;
}

export const COLLECTION: readonly Coffee[] = [
  {
    name: 'Gran Espresso',
    description: 'Light and flavorful blend with cocoa and black pepper for an intense experience.',
    image: granEspresso,
  },
  {
    name: 'Planalto',
    description: 'Brazilian dark roast with rich and velvety body, and hints of fruits and nuts.',
    image: planalto,
  },
  {
    name: 'Piccollo',
    description: 'Mild and smooth blend featuring notes of toasted almond and dried cherry.',
    image: piccollo,
  },
  {
    name: 'Danche',
    description: 'Ethiopian hand-harvested blend densely packed with vibrant fruit notes.',
    image: danche,
  },
];

export interface Benefit {
  title: string;
  description: string;
  icon: SvgComponent;
}

export const BENEFITS: readonly Benefit[] = [
  {
    title: 'Best quality',
    description:
      'Discover an endless variety of the world’s best artisan coffee from each of our roasters.',
    icon: BenefitQuality,
  },
  {
    title: 'Exclusive benefits',
    description:
      'Special offers and swag when you subscribe, including 30% off your first shipment.',
    icon: BenefitPerks,
  },
  {
    title: 'Free shipping',
    description: 'We cover the cost and coffee is delivered fast. Peak freshness: guaranteed.',
    icon: BenefitShipping,
  },
];
