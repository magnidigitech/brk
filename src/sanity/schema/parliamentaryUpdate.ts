import { defineField, defineType } from 'sanity'

export const parliamentaryUpdate = defineType({
  name: 'parliamentaryUpdate',
  title: 'Parliamentary Update',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      title: 'Date of Session',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'speechUrl',
      title: 'YouTube Speech Link',
      type: 'url',
    }),
    defineField({
      name: 'document',
      title: 'Official Document (PDF)',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
  ],
})
