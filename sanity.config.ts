import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schema'
import { TranslateDocumentAction } from './src/sanity/actions/TranslateDocumentAction'

export default defineConfig({
  name: 'default',
  title: 'Bhashyam Rama Krishna Portal',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cf3wvwse',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Add the translation action to the standard list of document actions
      return [...prev, TranslateDocumentAction]
    }
  }
})
