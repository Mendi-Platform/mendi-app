import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from './session'
import { cache } from 'react'

 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.username) {
    return { isAuth: false, username: null }
  }
 
  return { isAuth: true, username: session.username }
})