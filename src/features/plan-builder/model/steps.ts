import type { PlanStep, StepId } from './types';

const preference: PlanStep<'preference'> = {
  id: 'preference',
  navLabel: 'Preferences',
  question: 'How do you drink your coffee?',
  options: [
    {
      value: 'capsule',
      label: 'Capsule',
      description: 'Compatible with Nespresso systems and similar brewers',
    },
    {
      value: 'filter',
      label: 'Filter',
      description: 'For pour over or drip methods like Aeropress, Chemex, and V60',
    },
    {
      value: 'espresso',
      label: 'Espresso',
      description: 'Dense and finely ground beans for an intense, flavorful experience',
    },
  ],
};

const beanType: PlanStep<'beanType'> = {
  id: 'beanType',
  navLabel: 'Bean Type',
  question: 'What type of coffee?',
  options: [
    {
      value: 'single-origin',
      label: 'Single Origin',
      description: 'Distinct, high quality coffee from a specific family-owned farm',
    },
    {
      value: 'decaf',
      label: 'Decaf',
      description: 'Just like regular coffee, except the caffeine has been removed',
    },
    {
      value: 'blended',
      label: 'Blended',
      description: 'Combination of two or three dark roasted beans of organic coffees',
    },
  ],
};

const quantity: PlanStep<'quantity'> = {
  id: 'quantity',
  navLabel: 'Quantity',
  question: 'How much would you like?',
  options: [
    {
      value: '250g',
      label: '250g',
      description: 'Perfect for the solo drinker. Yields about 12 delicious cups.',
    },
    {
      value: '500g',
      label: '500g',
      description: 'Perfect option for a couple. Yields about 40 delectable cups.',
    },
    {
      value: '1000g',
      label: '1000g',
      description: 'Perfect for offices and events. Yields about 90 delightful cups.',
    },
  ],
};

const grind: PlanStep<'grind'> = {
  id: 'grind',
  navLabel: 'Grind Option',
  question: 'Want us to grind them?',
  options: [
    {
      value: 'wholebean',
      label: 'Wholebean',
      description: 'Best choice if you cherish the full sensory experience',
    },
    {
      value: 'filter',
      label: 'Filter',
      description: 'For drip or pour-over coffee methods such as V60 or Aeropress',
    },
    {
      value: 'cafetiere',
      label: 'Cafetiére',
      description: 'Course ground beans specially suited for french press coffee',
    },
  ],
};

const delivery: PlanStep<'delivery'> = {
  id: 'delivery',
  navLabel: 'Deliveries',
  question: 'How often should we deliver?',
  // Descriptions depend on the chosen quantity — see `getDeliveryDescription`.
  options: [
    { value: 'weekly', label: 'Every week', description: '' },
    { value: 'biweekly', label: 'Every 2 weeks', description: '' },
    { value: 'monthly', label: 'Every month', description: '' },
  ],
};

export const PLAN_STEPS = [preference, beanType, quantity, grind, delivery] as const;

export function getStep<K extends StepId>(id: K): PlanStep<K> {
  const step = PLAN_STEPS.find((s) => s.id === id);
  if (!step) throw new Error(`Unknown plan step: ${id}`);
  return step as unknown as PlanStep<K>;
}

export function getOptionLabel<K extends StepId>(id: K, value: string | null): string | null {
  if (value === null) return null;
  return getStep(id).options.find((option) => option.value === value)?.label ?? null;
}
