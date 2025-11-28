import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { OrderFlowNavigator } from '@/services/orderFlowNavigation';
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from '@/sanity/lib/types';

interface OrderFlowConfig {
  startStepSlug: string;
  confirmationStepSlug: string;
  allSteps: OrderFlowStepExpanded[];
  stepGroups: SanityOrderStepGroup[];
}

export function useOrderFlow(orderFlowConfig: OrderFlowConfig | null) {
  const pathname = usePathname();
  const { formData } = useCart();

  return useMemo(() => {
    if (!orderFlowConfig) return null;

    const navigator = new OrderFlowNavigator(orderFlowConfig.allSteps);
    const currentSlug = pathname.split('/').pop() || '';
    const currentStep = orderFlowConfig.allSteps.find(s => s.slug.current === currentSlug);

    if (!currentStep) return null;

    // Build dynamic flow based on form data
    const dynamicFlow = navigator.buildDynamicFlow(formData, orderFlowConfig.startStepSlug);
    const currentIndex = dynamicFlow.findIndex(s => s.slug.current === currentSlug);
    const progress = navigator.calculateProgress(currentSlug, formData, orderFlowConfig.startStepSlug);

    return {
      currentStep,
      currentIndex,
      dynamicFlow,
      allSteps: orderFlowConfig.allSteps,
      stepGroups: orderFlowConfig.stepGroups,
      progress,
      navigator
    };
  }, [pathname, formData, orderFlowConfig]);
}
