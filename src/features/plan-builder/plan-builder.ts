import {
  buildSummary,
  EMPTY_SELECTION,
  formatPrice,
  getCurrentStep,
  getDeliveryDescription,
  getMonthlyCost,
  isPlanComplete,
  isStepApplicable,
  parseSelection,
  PLAN_STEPS,
  type Delivery,
  type PlanSelection,
  type StepId,
  type SummaryPart,
} from './model';

/**
 * Client controller for the "Create a plan" form.
 * All business rules live in `./model`; this element only syncs the DOM with them.
 */
class PlanBuilderElement extends HTMLElement {
  #selection: PlanSelection = EMPTY_SELECTION;
  #controller = new AbortController();

  #form!: HTMLFormElement;
  #dialog!: HTMLDialogElement;
  #submit!: HTMLButtonElement;

  connectedCallback() {
    this.#form = this.#query('[data-plan-form]');
    this.#dialog = this.#query('[data-checkout-dialog]');
    this.#submit = this.#query('[data-submit]');

    this.#controller = new AbortController();
    const { signal } = this.#controller;

    this.#form.addEventListener('change', (event) => this.#onChange(event), { signal });
    this.#form.addEventListener('submit', (event) => this.#onSubmit(event), { signal });
    this.#form.addEventListener('reset', () => queueMicrotask(() => this.#sync()), { signal });
    this.addEventListener('click', (event) => this.#onClick(event), { signal });
    this.#dialog.addEventListener('close', () => this.#onDialogClose(), { signal });

    this.#sync();
  }

  disconnectedCallback() {
    this.#controller.abort();
  }

  #onChange(event: Event) {
    const previous = this.#selection;
    this.#sync();

    // Guide the user forward: open the next unanswered question.
    const changedStep = (event.target as HTMLInputElement).name as StepId;
    if (previous[changedStep] === null) {
      const next = getCurrentStep(this.#selection);
      if (next) this.#question(next).open = true;
    }
  }

  #onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (isPlanComplete(this.#selection)) this.#dialog.showModal();
  }

  #onClick(event: MouseEvent) {
    const target = event.target as Element;

    // Disabled questions must not expand.
    const summary = target.closest('summary');
    if (summary?.parentElement?.hasAttribute('data-disabled')) {
      event.preventDefault();
      return;
    }

    // Step navigation opens the related question.
    const link = target.closest<HTMLAnchorElement>('[data-step-link]');
    if (link) this.#question(link.dataset.stepLink as StepId).open = true;

    // Click on the backdrop closes the dialog.
    if (target === this.#dialog) this.#dialog.close();
  }

  #onDialogClose() {
    if (this.#dialog.returnValue !== 'confirm') return;
    this.#dialog.returnValue = '';
    this.#form.reset();
    PLAN_STEPS.forEach((step, index) => (this.#question(step.id).open = index === 0));
    this.scrollIntoView({ behavior: 'smooth' });
  }

  /** Re-reads the form and renders every derived piece of UI. */
  #sync() {
    this.#selection = parseSelection(new FormData(this.#form));
    const selection = this.#selection;
    const current = getCurrentStep(selection);

    for (const step of PLAN_STEPS) {
      const enabled = isStepApplicable(step.id, selection);
      const question = this.#question(step.id);

      question.toggleAttribute('data-disabled', !enabled);
      question.querySelector('summary')?.setAttribute('aria-disabled', String(!enabled));
      if (!enabled) question.open = false;

      question.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
        input.disabled = !enabled;
        if (!enabled) input.checked = false;
      });

      const link = this.querySelector<HTMLAnchorElement>(`[data-step-link="${step.id}"]`);
      if (link) {
        link.toggleAttribute('data-complete', selection[step.id] !== null);
        link.setAttribute('aria-disabled', String(!enabled));
        if (step.id === current) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      }
    }

    this.querySelectorAll<HTMLElement>('[data-step="delivery"] [data-option-description]').forEach(
      (el) => {
        el.textContent = getDeliveryDescription(
          el.dataset.optionDescription as Delivery,
          selection.quantity,
        );
      },
    );

    const parts = buildSummary(selection);
    this.querySelectorAll<HTMLElement>('[data-summary]').forEach((el) => renderSummary(el, parts));

    const cost = getMonthlyCost(selection);
    this.querySelectorAll('[data-monthly-cost]').forEach((el) => {
      el.textContent = cost === null ? '' : formatPrice(cost);
    });

    this.#submit.disabled = !isPlanComplete(selection);
  }

  #question(id: StepId) {
    return this.#query<HTMLDetailsElement>(`[data-step="${id}"]`);
  }

  #query<T extends Element>(selector: string): T {
    const el = this.querySelector<T>(selector);
    if (!el) throw new Error(`<plan-builder>: missing element ${selector}`);
    return el;
  }
}

function renderSummary(target: HTMLElement, parts: SummaryPart[]) {
  const nodes = parts.map((part) => {
    if (part.kind === 'text') return document.createTextNode(part.text);
    const span = document.createElement('span');
    span.dataset.filled = String(part.text !== null);
    span.textContent = part.text ?? '_____';
    return span;
  });
  target.replaceChildren(...nodes);
}

if (!customElements.get('plan-builder')) {
  customElements.define('plan-builder', PlanBuilderElement);
}
