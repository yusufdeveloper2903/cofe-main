export type Preference = 'capsule' | 'filter' | 'espresso';
export type BeanType = 'single-origin' | 'decaf' | 'blended';
export type Quantity = '250g' | '500g' | '1000g';
export type Grind = 'wholebean' | 'filter' | 'cafetiere';
export type Delivery = 'weekly' | 'biweekly' | 'monthly';

/** Every answer the user can give, keyed by step id. `null` = not answered yet. */
export interface PlanSelection {
  preference: Preference | null;
  beanType: BeanType | null;
  quantity: Quantity | null;
  grind: Grind | null;
  delivery: Delivery | null;
}

export type StepId = keyof PlanSelection;

export interface PlanOption<V extends string = string> {
  value: V;
  label: string;
  description: string;
}

export interface PlanStep<K extends StepId = StepId> {
  id: K;
  /** Short label for the step navigation. */
  navLabel: string;
  question: string;
  options: readonly PlanOption<NonNullable<PlanSelection[K]>>[];
}

export type SummaryPart = { kind: 'text'; text: string } | { kind: 'value'; text: string | null };
