import { z } from "zod"

export const deliveryFormSchema = z.object({
  streetAddress: z.string(),
  addressAdditional: z.string(),
  zipCode: z.string(),
  city: z.string(),
}) 