import NextAuth from "next-auth"
import { FirestoreAdapter } from "@auth/firebase-adapter"

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
  adapter: FirestoreAdapter(),
})