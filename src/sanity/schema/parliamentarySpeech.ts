import { defineField, defineType } from 'sanity'

export const parliamentarySpeech = defineType({
  name: 'parliamentarySpeech',
  title: 'Parliamentary Speech',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Speech Title',
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
      title: 'Date of Speech',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sessionInfo',
      title: 'Session & House (e.g. 265th Session, Rajya Sabha)',
      type: 'string',
    }),
    defineField({
      name: 'speechUrl',
      title: 'YouTube Video URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Video Duration (e.g. 12:34)',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Speech Description / Summary',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic / Bill / Issue Discussed',
      type: 'string',
    }),
    defineField({
      name: 'document',
      title: 'Official Document / Transcript (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
  ],
})
