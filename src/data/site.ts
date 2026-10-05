import Facebook from '@/assets/icons/facebook.svg';
import Instagram from '@/assets/icons/instagram.svg';
import Twitter from '@/assets/icons/twitter.svg';

export const SITE = {
  name: 'Coffeeroasters',
  description:
    'Start your mornings with the world’s best coffees. Try our expertly curated artisan coffees from our best roasters delivered directly to your door, at your schedule.',
  locale: 'en',
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  createPlan: '/create-plan',
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Home', href: ROUTES.home },
  { label: 'About us', href: ROUTES.about },
  { label: 'Create your plan', href: ROUTES.createPlan },
];

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com', icon: Facebook },
  { label: 'Twitter', href: 'https://x.com', icon: Twitter },
  { label: 'Instagram', href: 'https://www.instagram.com', icon: Instagram },
] as const;
