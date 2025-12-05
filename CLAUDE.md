# Mendi App - Development Notes

## Environment Variables

**Important:** Use only `.env` for environment variables. Do NOT create `.env.local` files.

All environment variables should be added to:
- `.env` - Local development (not committed)
- Vercel Dashboard - Production/Preview environments

See `.env.example` for required variables.

## Stripe Webhooks (Local Testing)

To test Stripe webhooks locally:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Forward Stripe events to local
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Copy the webhook signing secret from the CLI output to your `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## Customer.io

Order confirmation emails are sent via Customer.io after successful Stripe payment.

Required env var: `CUSTOMERIO_API_KEY`
Optional: `CUSTOMERIO_ORDER_CONFIRMATION_TEMPLATE_ID` (defaults to 'order_confirmation')
