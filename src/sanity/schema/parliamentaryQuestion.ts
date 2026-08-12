import { defineField, defineType } from 'sanity'

export const parliamentaryQuestion = defineType({
  name: 'parliamentaryQuestion',
  title: 'Parliamentary Question',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Question Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date Asked',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'questionNumber',
      title: 'Question Number (e.g. Q.No.123)',
      type: 'string',
    }),
    defineField({
      name: 'sessionInfo',
      title: 'Session & House (e.g. 265th Session, Rajya Sabha)',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Question Category',
      type: 'string',
      options: {
        list: [
          { title: 'Starred Question', value: 'starred' },
          { title: 'Unstarred Question', value: 'unstarred' },
          { title: 'Short Notice Question', value: 'short-notice' },
          { title: 'Supplementary Question', value: 'supplementary' },
          { title: 'Zero Hour', value: 'zero-hour' },
          { title: 'Special Mention', value: 'special-mention' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'ministry',
      title: 'Ministry / Department Addressed',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Question Text / Summary',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'officialAnswer',
      title: 'Official Answer / Response',
      type: 'text',
    }),
    defineField({
      name: 'document',
      title: 'Official Document (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'mainImage',
      title: 'Preview Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
