import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'

// Create a Sanity client with write permissions using the write token
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Do not use CDN cache for write operations
  token: process.env.SANITY_WRITE_TOKEN,
})
