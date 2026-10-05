import type { Delivery, PlanSelection, Quantity } from './types';

/** Price per shipment in cents. */
const SHIPMENT_PRICE_CENTS: Record<Quantity, Record<Delivery, number>> = {
  '250g': { weekly: 720, biweekly: 960, monthly: 1200 },
  '500g': { weekly: 1300, biweekly: 1750, monthly: 2200 },
  '1000g': { weekly: 2200, biweekly: 3200, monthly: 4200 },
};

const SHIPMENTS_PER_MONTH: Record<Delivery, number> = {
  weekly: 4,
  biweekly: 2,
  monthly: 1,
};

const SHIPPING_TIER: Record<Delivery, string> = {
  weekly: 'first-class',
  biweekly: 'priority',
  monthly: 'priority',
};

/** Quantity used to quote delivery prices before the user has picked one. */
export const DEFAULT_QUANTITY: Quantity = '250g';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatPrice(cents: number): string {
  return currency.format(cents / 100);
}

export function getShipmentPrice(quantity: Quantity, delivery: Delivery): number {
  return SHIPMENT_PRICE_CENTS[quantity][delivery];
}

/** Monthly cost in cents, or `null` while quantity or delivery is still missing. */
export function getMonthlyCost({ quantity, delivery }: PlanSelection): number | null {
  if (!quantity || !delivery) return null;
  return getShipmentPrice(quantity, delivery) * SHIPMENTS_PER_MONTH[delivery];
}

export function getDeliveryDescription(delivery: Delivery, quantity: Quantity | null): string {
  const price = getShipmentPrice(quantity ?? DEFAULT_QUANTITY, delivery);
  return `${formatPrice(price)} per shipment. Includes free ${SHIPPING_TIER[delivery]} shipping.`;
}
