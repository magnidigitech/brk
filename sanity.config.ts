import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schema'

export default defineConfig({
  name: 'default',
  title: 'Bhashyam Ramakrishna Portal',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cf3wvwse',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
