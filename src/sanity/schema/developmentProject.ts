import { defineField, defineType } from 'sanity'

export const developmentProject = defineType({
  name: 'developmentProject',
  title: 'Development Project / Initiative',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'localeString',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'localeString',
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'progress',
      title: 'Progress Status',
      type: 'localeString',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
})
