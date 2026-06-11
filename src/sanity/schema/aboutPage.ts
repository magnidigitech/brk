import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'localeString',
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'localeString',
    }),
    defineField({
      name: 'badgeText',
      title: 'Badge Text',
      type: 'localeString',
    }),
    defineField({
      name: 'profileShortName',
      title: 'Profile Name',
      type: 'localeString',
    }),
    defineField({
      name: 'bioParagraph1',
      title: 'Bio Paragraph 1',
      type: 'localeText',
    }),
    defineField({
      name: 'bioParagraph2',
      title: 'Bio Paragraph 2',
      type: 'localeText',
    }),
    defineField({
      name: 'eduTitle',
      title: 'Educational Leadership Title',
      type: 'localeString',
    }),
    defineField({
      name: 'eduContent',
      title: 'Educational Leadership Content',
      type: 'localeText',
    }),
    defineField({
      name: 'publicTitle',
      title: 'Public Service Journey Title',
      type: 'localeString',
    }),
    defineField({
      name: 'publicContent',
      title: 'Public Service Journey Content',
      type: 'localeText',
    }),
    defineField({
      name: 'focusAreas',
      title: 'Vision Focus Areas',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'values',
      title: 'Leadership Values',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'valueItem',
          title: 'Value Item',
          fields: [
            { name: 'name', title: 'Value Name', type: 'localeString' },
            { name: 'desc', title: 'Value Description', type: 'localeText' },
          ],
        },
      ],
    }),
    defineField({
      name: 'quoteText',
      title: 'Quote Text',
      type: 'localeText',
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Quote Author',
      type: 'localeString',
    }),
    defineField({
      name: 'summaryContent',
      title: 'Profile Summary',
      type: 'localeText',
    }),
  ],
})
