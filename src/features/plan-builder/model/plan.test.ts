import { describe, expect, it } from 'vitest';
import {
  buildSummary,
  EMPTY_SELECTION,
  getCurrentStep,
  getDeliveryDescription,
  getMonthlyCost,
  formatPrice,
  isPlanComplete,
  isStepApplicable,
  parseSelection,
  type PlanSelection,
  type SummaryPart,
} from './index';

const fullPlan: PlanSelection = {
  preference: 'filter',
  beanType: 'decaf',
  quantity: '250g',
  grind: 'cafetiere',
  delivery: 'weekly',
};

const toText = (parts: SummaryPart[]) => parts.map((p) => p.text ?? '_____').join('');

describe('parseSelection', () => {
  it('reads known option values', () => {
    const data = new Map(Object.entries(fullPlan));
    expect(parseSelection(data)).toEqual(fullPlan);
  });

  it('ignores unknown or missing values', () => {
    const data = new Map<string, string>([
      ['preference', 'tea'],
      ['quantity', '500g'],
    ]);
    expect(parseSelection(data)).toEqual({ ...EMPTY_SELECTION, quantity: '500g' });
  });

  it('drops the grind answer for capsules', () => {
    const data = new Map(Object.entries({ ...fullPlan, preference: 'capsule' }));
    expect(parseSelection(data).grind).toBeNull();
  });
});

describe('plan progress', () => {
  it('skips the grind step for capsules', () => {
    expect(isStepApplicable('grind', { ...EMPTY_SELECTION, preference: 'capsule' })).toBe(false);
    expect(isStepApplicable('grind', { ...EMPTY_SELECTION, preference: 'filter' })).toBe(true);
  });

  it('is complete only when every applicable step is answered', () => {
    expect(isPlanComplete(EMPTY_SELECTION)).toBe(false);
    expect(isPlanComplete(fullPlan)).toBe(true);
    expect(isPlanComplete({ ...fullPlan, preference: 'capsule', grind: null })).toBe(true);
    expect(isPlanComplete({ ...fullPlan, grind: null })).toBe(false);
  });

  it('reports the first unanswered step', () => {
    expect(getCurrentStep(EMPTY_SELECTION)).toBe('preference');
    expect(getCurrentStep({ ...fullPlan, quantity: null, delivery: null })).toBe('quantity');
    expect(getCurrentStep(fullPlan)).toBeNull();
  });
});

describe('pricing', () => {
  it.each([
    ['250g', 'weekly', 2880],
    ['250g', 'biweekly', 1920],
    ['250g', 'monthly', 1200],
    ['500g', 'weekly', 5200],
    ['1000g', 'biweekly', 6400],
    ['1000g', 'monthly', 4200],
  ] as const)('%s delivered %s costs %i cents a month', (quantity, delivery, expected) => {
    expect(getMonthlyCost({ ...fullPlan, quantity, delivery })).toBe(expected);
  });

  it('returns null while quantity or delivery is missing', () => {
    expect(getMonthlyCost({ ...fullPlan, delivery: null })).toBeNull();
    expect(getMonthlyCost({ ...fullPlan, quantity: null })).toBeNull();
  });

  it('quotes delivery prices for the chosen quantity, falling back to 250g', () => {
    expect(getDeliveryDescription('weekly', null)).toBe(
      '$7.20 per shipment. Includes free first-class shipping.',
    );
    expect(getDeliveryDescription('biweekly', '500g')).toBe(
      '$17.50 per shipment. Includes free priority shipping.',
    );
  });

  it('formats cents as USD', () => {
    expect(formatPrice(2880)).toBe('$28.80');
  });
});

describe('buildSummary', () => {
  it('describes a complete plan', () => {
    expect(toText(buildSummary(fullPlan))).toBe(
      '“I drink my coffee as Filter, with a Decaf type of bean. 250g ground ala Cafetiére, sent to me Every week.”',
    );
  });

  it('uses placeholders for unanswered steps', () => {
    expect(toText(buildSummary(EMPTY_SELECTION))).toBe(
      '“I drink my coffee as _____, with a _____ type of bean. _____ ground ala _____, sent to me _____.”',
    );
  });

  it('omits the grind clause for capsules', () => {
    expect(toText(buildSummary({ ...fullPlan, preference: 'capsule', grind: null }))).toBe(
      '“I drink my coffee using Capsules, with a Decaf type of bean. 250g, sent to me Every week.”',
    );
  });
});
