import type { SvgComponent } from 'astro/types';
import HqAustralia from '@/assets/icons/hq-australia.svg';
import HqCanada from '@/assets/icons/hq-canada.svg';
import HqUk from '@/assets/icons/hq-uk.svg';

export interface Headquarters {
  country: string;
  addressLines: readonly string[];
  phone: string;
  icon: SvgComponent;
}

export const HEADQUARTERS: readonly Headquarters[] = [
  {
    country: 'United Kingdom',
    addressLines: ['68 Asfordby Rd', 'Alcaston', 'SY6 1YA'],
    phone: '+44 1241 918425',
    icon: HqUk,
  },
  {
    country: 'Canada',
    addressLines: ['1528 Eglinton Avenue', 'Toronto', 'Ontario M4P 1A6'],
    phone: '+1 416 485 2997',
    icon: HqCanada,
  },
  {
    country: 'Australia',
    addressLines: ['36 Swanston Street', 'Kewell', 'Victoria'],
    phone: '+61 4 9928 3629',
    icon: HqAustralia,
  },
];
