import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateOrderStatus } from '@/lib/orders';
import type { CartItemWithMeta } from '@/lib/orders';

interface CheckoutRequestBody {
  orderId: string;
  items: CartItemWithMeta[];
  shippingCost: number;
  total: number;
  customerEmail?: string;
}

// Helper to get repair type label for Stripe line item
function getRepairTypeLabel(slug: string): string {
  const labels: Record<string, string> = {
    '': 'Service',
    'replace-zipper': 'Bytte glidelås',
    'sew-button': 'Sy på ny knapp',
    'hole': 'Hull',
    'small-hole': 'Lite hull',
    'big-hole': 'Stort hull',
    'belt-loops': 'Fest på beltehemper',
    'hemming': 'Legge opp',
    'adjust-waist': 'Ta inn i livet',
    'other-request': 'Annen forespørsel',
  };
  return labels[slug] || 'Reparasjon';
}

// Helper to get garment label for Stripe line item
function getGarmentLabel(slug: string): string {
  const labels: Record<string, string> = {
    '': '',
    'upper-body': 'Overdel',
    'lower-body': 'Underdel',
    'kjole': 'Kjole',
    'dress': 'Dress',
    'outer-wear': 'Jakke/Yttertøy',
    'leather-items': 'Skinnplagg',
    'curtains': 'Gardiner',
  };
  return labels[slug] || '';
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { orderId, items, shippingCost, customerEmail } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Get origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create line items for Stripe
    const lineItems = items.map(item => {
      const repairLabel = getRepairTypeLabel(item.repairTypeSlug);
      const garmentLabel = getGarmentLabel(item.garmentSlug);
      const name = garmentLabel
        ? `${repairLabel} - ${garmentLabel}`
        : repairLabel;

      return {
        price_data: {
          currency: 'nok',
          product_data: {
            name,
            description: item.categorySlug === 'premium' ? 'Premium' : 'Standard',
          },
          unit_amount: Math.round((item.price || 0) * 100), // Stripe expects amounts in cents/øre
        },
        quantity: 1,
      };
    });

    // Add shipping as a line item if there's a cost
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'nok',
          product_data: {
            name: 'Frakt',
            description: 'Leveringskostnad',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/payment`,
      customer_email: customerEmail,
      metadata: {
        orderId,
      },
    });

    // Update order with Stripe session ID
    await updateOrderStatus(orderId, 'pending', session.id);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
