import { notFound } from 'next/navigation';
import { getOrderFlow } from '@/sanity/lib/queries';
import UnifiedOrderClient from '@/components/order/UnifiedOrderClient';
import { fetchDataForSection } from '@/lib/fetchOrderData';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const orderFlowData = await getOrderFlow();
  const step = orderFlowData?.orderFlowConfig.allSteps.find(
    s => s.slug.current === slug
  );

  return {
    title: step?.label.nb || 'Order Step',
    description: 'Complete your order',
  };
}

export default async function DynamicOrderPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch order flow configuration
  const orderFlowData = await getOrderFlow();
  const orderFlowConfig = orderFlowData?.orderFlowConfig || null;

  if (!orderFlowConfig) {
    notFound();
  }

  // Verify slug exists in flow
  const step = orderFlowConfig.allSteps.find(s => s.slug.current === slug);
  if (!step) {
    notFound();
  }

  // Fetch data required for this section
  const sectionData = await fetchDataForSection(slug);

  return (
    <UnifiedOrderClient
      slug={slug}
      orderFlowConfig={orderFlowConfig}
      {...sectionData}
    />
  );
}

// Generate static params for all steps
export async function generateStaticParams() {
  try {
    const orderFlowData = await getOrderFlow();

    if (!orderFlowData?.orderFlowConfig?.allSteps) {
      return [];
    }

    return orderFlowData.orderFlowConfig.allSteps.map((step) => ({
      slug: step.slug.current,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
