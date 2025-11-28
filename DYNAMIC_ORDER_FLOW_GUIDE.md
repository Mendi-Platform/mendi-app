# Dynamic Order Flow - Implementation Guide

## 🎯 Core Concept

Instead of 18 separate route folders, we use:
- **One dynamic route**: `/order/[slug]`
- **Slug from Sanity**: Each step has a unique slug (e.g., "garment", "service", "cart")
- **Component Registry**: Maps slugs to React components
- **Sanity Configuration**: Defines the entire flow, routing rules, and step order

## 📁 New Architecture

```
src/app/(order)/order/
├── [slug]/
│   └── page.tsx          # Dynamic route handler
├── garment/
│   └── GarmentPageClient.tsx  # Component only
├── service/
│   └── ServicePageClient.tsx  # Component only
├── cart/
│   └── CartClient.tsx         # Component only
└── ...
```

**Key Changes:**
- ✅ Each step folder now contains **only the client component**
- ✅ No more individual `page.tsx` files per step
- ✅ Single `[slug]/page.tsx` handles all routes dynamically
- ✅ Components registered in `orderComponentRegistry.ts`

## 🔧 How It Works

### 1. User navigates to `/order/garment`

### 2. Next.js matches `[slug]/page.tsx` with `slug = "garment"`

### 3. Dynamic page handler:
```typescript
// Fetch order flow config from Sanity
const orderFlowConfig = await getOrderFlow();

// Find step with slug "garment"
const step = orderFlowConfig.allSteps.find(s => s.slug.current === 'garment');

// Get component for this step
const Component = getComponentForSlug(step.componentType);

// Fetch data needed for this component
const data = await fetchDataForComponent(step.componentType);

// Render
return <Component {...data} orderFlowConfig={orderFlowConfig} />;
```

### 4. Navigation uses dynamic slugs:
```typescript
// Instead of: router.push('/order/service')
// Now: navigateToNext('garment')

// Which looks up the next step slug from Sanity and navigates to:
// /order/{nextStepSlug}
```

## 📊 Sanity Configuration Example

### Step Group: "Order Details"
```json
{
  "_type": "orderStepGroup",
  "name": "Order Details",
  "label": { "nb": "Bestillingsdetaljer", "en": "Order Details" },
  "order": 1
}
```

### Order Flow Step: "Garment"
```json
{
  "_type": "orderFlowStep",
  "slug": { "current": "garment" },
  "label": { "nb": "Plagg", "en": "Garment" },
  "componentType": "garment",
  "stepGroupId": "reference-to-order-details",
  "defaultOrder": 1,
  "defaultNextStep": "reference-to-service-step",
  "isOptional": false
}
```

### Order Flow Step: "Service" (with conditional routing)
```json
{
  "_type": "orderFlowStep",
  "slug": { "current": "service" },
  "label": { "nb": "Tjeneste", "en": "Service" },
  "componentType": "service",
  "stepGroupId": "reference-to-order-details",
  "defaultOrder": 2,
  "nextStepRules": [
    {
      "conditions": [
        {
          "formField": "repairTypeSlug",
          "operator": "in",
          "values": ["replace-zipper", "hole"]
        }
      ],
      "nextStep": "reference-to-two-option",
      "priority": 10,
      "description": "Zipper/hole repairs go to two-option page"
    }
  ],
  "defaultNextStep": "reference-to-cart-step"
}
```

## 🎨 Benefits

1. **Single Source of Truth**: Entire flow defined in Sanity
2. **No Code Changes**: Modify flow without touching code
3. **Reusable Components**: Same component can be used for multiple steps
4. **Easy Testing**: Change flow order instantly
5. **Scalable**: Add new steps by creating Sanity documents
6. **Type Safe**: Full TypeScript support

## 🚀 Migration Steps

### ✅ Done:
1. Created Sanity schemas
2. Created OrderFlowNavigator service
3. Created React hooks (useOrderFlow, useOrderNavigation)
4. Created dynamic [slug] route
5. Created component registry

### 🔄 In Progress:
1. Move all client components to just export the component
2. Register all components in orderComponentRegistry
3. Update fetchDataForComponent for all component types

### ⏳ TODO:
1. Remove old individual page.tsx files (keep components)
2. Configure Sanity data (create steps, groups, routing rules)
3. Test the entire flow
4. Update documentation

## 📝 Component Registration Pattern

```typescript
// src/lib/orderComponentRegistry.ts
import GarmentPageClient from '@/app/(order)/order/garment/GarmentPageClient';

export const ORDER_COMPONENT_REGISTRY = {
  'garment': GarmentPageClient,
  'service': ServicePageClient,
  'cart': CartClient,
  // ...
};
```

## 🧪 Testing Checklist

- [ ] Navigate from garment → service
- [ ] Test conditional routing (service → two-option for zipper repairs)
- [ ] Test back navigation
- [ ] Test progress calculation
- [ ] Test both Norwegian and English
- [ ] Test step skipping (if configured)
- [ ] Verify all components receive correct props
- [ ] Check that confirmation page is excluded from progress

## 💡 Advanced Features

### Multiple Steps, Same Component
You could have:
- `slug: "hemming-measurement"` → `componentType: "measurement"`
- `slug: "waist-measurement"` → `componentType: "measurement"`

Both use the same component but appear as different steps in the flow.

### Dynamic Step Insertion
Add a new step by creating a Sanity document - no code changes needed!

### A/B Testing
Create different flows and switch between them in Sanity for testing.

## 🔗 URLs Before vs After

**Before (Static Routes):**
- `/order/garment` → `src/app/(order)/order/garment/page.tsx`
- `/order/service` → `src/app/(order)/order/service/page.tsx`
- 18 separate route files

**After (Dynamic Route):**
- `/order/garment` → `src/app/(order)/order/[slug]/page.tsx` (slug="garment")
- `/order/service` → `src/app/(order)/order/[slug]/page.tsx` (slug="service")
- 1 route file handles all!

The URLs stay the same, but the implementation is now dynamic! 🎉
