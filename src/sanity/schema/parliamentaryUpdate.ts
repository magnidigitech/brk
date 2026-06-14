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
      title: 'Speech / Media Link (YouTube or Instagram)',
      type: 'url',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Preview Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'images',
      title: 'Slideshow Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
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
