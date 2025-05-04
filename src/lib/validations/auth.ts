import { z } from "zod"

export const signupSchema = z.object({
  email: z.string().email("Vennligst skriv inn en gyldig e-postadresse"),
  password: z.string().min(8, "Passordet må være minst 8 tegn"),
  name: z.string().min(2, "Navnet må være minst 2 tegn"),
  phone: z.string().min(8, "Telefonnummeret må være minst 8 tegn"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Du må godta vilkårene for å fortsette",
  }),
}) 