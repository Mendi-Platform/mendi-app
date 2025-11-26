export interface CheckoutStep {
  id: string;
  label: string;
  path: string;
}

export const CHECKOUT_STEPS: CheckoutStep[] = [
  { id: 'cart', label: 'Handlekurv', path: '/order/cart' },
  { id: 'address', label: 'Adresse', path: '/order/address-form' },
  { id: 'delivery', label: 'Levering', path: '/order/delivery-choice' },
  { id: 'payment', label: 'Betaling', path: '/order/payment' },
];

export const DELIVERY_STEPS: CheckoutStep[] = [
  { id: 'address', label: 'Adresse', path: '/order/address-form' },
  { id: 'delivery', label: 'Levering', path: '/order/delivery-choice' },
  { id: 'payment', label: 'Betaling', path: '/order/payment' },
];

export const getStepIndex = (steps: CheckoutStep[], currentPath: string): number => {
  const index = steps.findIndex(step => currentPath.includes(step.id));
  return index >= 0 ? index + 1 : 1;
};

export const getStepLabels = (steps: CheckoutStep[]): string[] => {
  return steps.map(step => step.label);
};
