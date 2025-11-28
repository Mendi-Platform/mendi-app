"use client";

import { useEffect, useState } from 'react';
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from '@/sanity/lib/types';
import { SECTION_LOADERS, type SectionComponent } from '@/lib/orderSectionConfig';

interface SharedOrderClientProps {
  slug: string;
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
  [key: string]: unknown; // Additional data passed from server
}

export default function SharedOrderClient({
  slug,
  orderFlowConfig,
  ...sectionData
}: SharedOrderClientProps) {
  const [SectionComponent, setSectionComponent] = useState<SectionComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Dynamically load the section component
    const loadSection = async () => {
      try {
        setIsLoading(true);
        const loader = SECTION_LOADERS[slug];

        if (!loader) {
          throw new Error(`No section loader found for slug: ${slug}`);
        }

        const loadedModule = await loader();
        setSectionComponent(() => loadedModule.default);
        setError(null);
      } catch (err) {
        console.error('Error loading section:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    loadSection();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006EFF]" />
      </div>
    );
  }

  if (error || !SectionComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-semibold mb-4">Section not found</h1>
        <p className="text-gray-600">
          {error?.message || `No section registered for "${slug}"`}
        </p>
      </div>
    );
  }

  return (
    <SectionComponent
      orderFlowConfig={orderFlowConfig}
      {...sectionData}
    />
  );
}
