import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateOrderStatus } from '@/lib/orders';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  let body: string;

  try {
    body = await request.text();
  } catch (err) {
    console.error('Failed to read request body:', err);
    return NextResponse.json(
      { error: 'Failed to read request body' },
      { status: 400 }
    );
  }

  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    console.error('Signature received:', signature?.substring(0, 20) + '...');
    console.error('Body length:', body.length);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const customerEmail = session.customer_details?.email || session.customer_email || undefined;

      if (orderId) {
        try {
          await updateOrderStatus(orderId, 'paid', {
            stripeSessionId: session.id,
            customerEmail,
          });
          console.log(`Order ${orderId} marked as paid${customerEmail ? ` for ${customerEmail}` : ''}`);
        } catch (error) {
          console.error(`Failed to update order ${orderId}:`, error);
        }
      } else {
        console.warn('No orderId found in session metadata');
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        try {
          await updateOrderStatus(orderId, 'failed', { stripeSessionId: session.id });
          console.log(`Order ${orderId} marked as failed (session expired)`);
        } catch (error) {
          console.error(`Failed to update order ${orderId}:`, error);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed for payment intent: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
