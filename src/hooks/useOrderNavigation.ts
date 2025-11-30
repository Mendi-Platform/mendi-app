import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useOrderFlow } from './useOrderFlow';
import { useCart } from '@/contexts/CartContext';
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from '@/sanity/lib/types';
import type { FormData } from '@/types/formData';

interface OrderFlowConfig {
  startStepSlug: string;
  confirmationStepSlug: string;
  allSteps: OrderFlowStepExpanded[];
  stepGroups: SanityOrderStepGroup[];
}

export function useOrderNavigation(orderFlowConfig: OrderFlowConfig | null) {
  const router = useRouter();
  const { formData } = useCart();
  const flowState = useOrderFlow(orderFlowConfig);

  const navigateToNext = useCallback(
    (currentStepSlug: string, updatedFormData?: Partial<FormData>) => {
      if (!flowState?.navigator) return;

      const mergedFormData = updatedFormData ? { ...formData, ...updatedFormData } : formData;
      const nextSlug = flowState.navigator.getNextStep(currentStepSlug, mergedFormData);

      if (nextSlug) {
        router.push(`/order/${nextSlug}`);
      }
    },
    [flowState, formData, router]
  );

  const navigateToPrevious = useCallback(() => {
    if (!flowState || flowState.currentIndex <= 0) return;

    const prevStep = flowState.dynamicFlow[flowState.currentIndex - 1];
    if (prevStep) {
      router.push(`/order/${prevStep.slug.current}`);
    }
  }, [flowState, router]);

  const navigateToStep = useCallback((stepSlug: string) => {
    router.push(`/order/${stepSlug}`);
  }, [router]);

  return {
    navigateToNext,
    navigateToPrevious,
    navigateToStep,
    canGoBack: (flowState?.currentIndex ?? 0) > 0
  };
}
