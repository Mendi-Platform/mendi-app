import type { FormData } from '@/types/formData';
import type { OrderFlowStepExpanded, RoutingCondition, RoutingRule } from '@/sanity/lib/types';

export class OrderFlowNavigator {
  private steps: Map<string, OrderFlowStepExpanded>;
  private stepsByGroup: Map<string, OrderFlowStepExpanded[]>;

  constructor(steps: OrderFlowStepExpanded[]) {
    this.steps = new Map(steps.map(s => [s.slug.current, s]));
    this.stepsByGroup = this.groupSteps(steps);
  }

  private groupSteps(steps: OrderFlowStepExpanded[]): Map<string, OrderFlowStepExpanded[]> {
    const grouped = new Map<string, OrderFlowStepExpanded[]>();
    for (const step of steps) {
      const groupId = step.stepGroup._id;
      if (!grouped.has(groupId)) {
        grouped.set(groupId, []);
      }
      grouped.get(groupId)!.push(step);
    }
    return grouped;
  }

  /**
   * Get next step based on current step and form data
   */
  getNextStep(currentStepSlug: string, formData: FormData): string | null {
    const currentStep = this.steps.get(currentStepSlug);
    if (!currentStep) return null;

    // Evaluate routing rules in priority order
    if (currentStep.nextStepRules && currentStep.nextStepRules.length > 0) {
      const sortedRules = [...currentStep.nextStepRules].sort(
        (a, b) => (b.priority || 0) - (a.priority || 0)
      );

      for (const rule of sortedRules) {
        if (this.evaluateRule(rule, formData)) {
          const nextSlug = rule.nextStepSlug;
          if (nextSlug) {
            // Check if next step should be skipped
            const nextStep = this.steps.get(nextSlug);
            if (nextStep && this.shouldSkipStep(nextStep, formData)) {
              // Recursively find next non-skipped step
              return this.getNextStep(nextSlug, formData);
            }
            return nextSlug;
          }
        }
      }
    }

    // Fallback to default next step
    const defaultSlug = currentStep.defaultNextStepSlug;
    if (defaultSlug) {
      const defaultStep = this.steps.get(defaultSlug);
      if (defaultStep && this.shouldSkipStep(defaultStep, formData)) {
        return this.getNextStep(defaultSlug, formData);
      }
      return defaultSlug;
    }

    return null;
  }

  /**
   * Check if a step should be skipped
   */
  private shouldSkipStep(step: OrderFlowStepExpanded, formData: FormData): boolean {
    if (!step.isOptional || !step.skipConditions) return false;

    return step.skipConditions.some(condition =>
      this.evaluateCondition(condition, formData)
    );
  }

  /**
   * Evaluate a routing rule (all conditions must match)
   */
  private evaluateRule(rule: RoutingRule, formData: FormData): boolean {
    if (!rule.conditions || rule.conditions.length === 0) return false;

    return rule.conditions.every(condition =>
      this.evaluateCondition(condition, formData)
    );
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(condition: RoutingCondition, formData: FormData): boolean {
    const fieldValue = formData[condition.formField as keyof FormData] as string;

    switch (condition.operator) {
      case 'equals':
        return condition.values?.[0] === fieldValue;

      case 'in':
        return condition.values?.includes(fieldValue) ?? false;

      case 'notEquals':
        return condition.values?.[0] !== fieldValue;

      case 'notIn':
        return !(condition.values?.includes(fieldValue) ?? false);

      case 'isEmpty':
        return !fieldValue || fieldValue === '';

      case 'isNotEmpty':
        return !!fieldValue && fieldValue !== '';

      default:
        return false;
    }
  }

  /**
   * Build dynamic step order based on current form data
   */
  buildDynamicFlow(formData: FormData, startSlug: string): OrderFlowStepExpanded[] {
    const flow: OrderFlowStepExpanded[] = [];
    const visited = new Set<string>();

    let currentSlug: string | null = startSlug;

    while (currentSlug && !visited.has(currentSlug)) {
      const step = this.steps.get(currentSlug);
      if (!step) break;

      visited.add(currentSlug);

      // Only add if not skipped
      if (!this.shouldSkipStep(step, formData)) {
        flow.push(step);
      }

      currentSlug = this.getNextStep(currentSlug, formData);
    }

    return flow;
  }

  /**
   * Get all steps for a specific group
   */
  getStepsInGroup(groupId: string): OrderFlowStepExpanded[] {
    return this.stepsByGroup.get(groupId) || [];
  }

  /**
   * Calculate progress percentage
   */
  calculateProgress(
    currentStepSlug: string,
    formData: FormData,
    startSlug: string
  ): number {
    const dynamicFlow = this.buildDynamicFlow(formData, startSlug);
    const currentIndex = dynamicFlow.findIndex(s => s.slug.current === currentStepSlug);

    if (currentIndex === -1) return 0;

    return ((currentIndex + 1) / dynamicFlow.length) * 100;
  }
}
