import { createClient } from '@sanity/client'

import { apiVersion, dataset, projectId } from '../env'

// Server-side client with write access for seeding data
// IMPORTANT: This client should only be used in server-side code (API routes, server components)
// The token must be set in environment variable SANITY_API_TOKEN
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Must be false for write operations
  token: process.env.SANITY_API_TOKEN,
})
