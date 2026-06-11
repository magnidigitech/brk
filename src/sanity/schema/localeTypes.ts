import { defineField, defineType } from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English (Indian)',
      type: 'string'
    }),
    defineField({
      name: 'te',
      title: 'Telugu',
      type: 'string'
    }),
    defineField({
      name: 'ten',
      title: 'Tenglish',
      type: 'string'
    })
  ]
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English (Indian)',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'te',
      title: 'Telugu',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'ten',
      title: 'Tenglish',
      type: 'text',
      rows: 4
    })
  ]
})
