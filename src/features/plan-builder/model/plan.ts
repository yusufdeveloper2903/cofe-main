import { getOptionLabel, PLAN_STEPS } from './steps';
import type { PlanSelection, StepId, SummaryPart } from './types';

export const EMPTY_SELECTION: Readonly<PlanSelection> = Object.freeze({
  preference: null,
  beanType: null,
  quantity: null,
  grind: null,
  delivery: null,
});

/** Capsules come pre-ground, so the grind step does not apply to them. */
export function isStepApplicable(id: StepId, selection: PlanSelection): boolean {
  return !(id === 'grind' && selection.preference === 'capsule');
}

export function getApplicableSteps(selection: PlanSelection) {
  return PLAN_STEPS.filter((step) => isStepApplicable(step.id, selection));
}

export function isPlanComplete(selection: PlanSelection): boolean {
  return getApplicableSteps(selection).every((step) => selection[step.id] !== null);
}

/** First applicable step that still needs an answer, or `null` when the plan is complete. */
export function getCurrentStep(selection: PlanSelection): StepId | null {
  return getApplicableSteps(selection).find((step) => selection[step.id] === null)?.id ?? null;
}

/** Drops answers that are no longer valid (e.g. grind after switching to capsules). */
export function normalizeSelection(selection: PlanSelection): PlanSelection {
  return isStepApplicable('grind', selection) ? selection : { ...selection, grind: null };
}

/**
 * Reads a selection from untrusted key/value input (e.g. `FormData`),
 * keeping only values that match a known option.
 */
export function parseSelection(input: { get(name: string): unknown }): PlanSelection {
  const selection = { ...EMPTY_SELECTION } as Record<StepId, string | null>;

  for (const step of PLAN_STEPS) {
    const raw = input.get(step.id);
    const match = step.options.find((option) => option.value === raw);
    selection[step.id] = match ? match.value : null;
  }

  return normalizeSelection(selection as PlanSelection);
}

/**
 * Builds the order summary sentence as structured parts so that every
 * renderer (server template, DOM) can highlight the chosen values safely.
 *
 * “I drink my coffee as Filter, with a Decaf type of bean. 250g ground ala Cafetiére, sent to me Every week.”
 */
export function buildSummary(selection: PlanSelection): SummaryPart[] {
  const text = (value: string): SummaryPart => ({ kind: 'text', text: value });
  const value = (id: StepId): SummaryPart => ({
    kind: 'value',
    text: getOptionLabel(id, selection[id]),
  });

  const isCapsule = selection.preference === 'capsule';

  return [
    text(isCapsule ? '“I drink my coffee using ' : '“I drink my coffee as '),
    isCapsule ? { kind: 'value', text: 'Capsules' } : value('preference'),
    text(', with a '),
    value('beanType'),
    text(' type of bean. '),
    value('quantity'),
    ...(isCapsule ? [] : [text(' ground ala '), value('grind')]),
    text(', sent to me '),
    value('delivery'),
    text('.”'),
  ];
}
