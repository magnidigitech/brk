import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
    }),
    defineField({
      name: 'profileShortName',
      title: 'Profile Name',
      type: 'string',
    }),
    defineField({
      name: 'bioParagraph1',
      title: 'Bio Paragraph 1',
      type: 'text',
    }),
    defineField({
      name: 'bioParagraph2',
      title: 'Bio Paragraph 2',
      type: 'text',
    }),
    defineField({
      name: 'eduTitle',
      title: 'Educational Leadership Title',
      type: 'string',
    }),
    defineField({
      name: 'eduContent',
      title: 'Educational Leadership Content',
      type: 'text',
    }),
    defineField({
      name: 'publicTitle',
      title: 'Public Service Journey Title',
      type: 'string',
    }),
    defineField({
      name: 'publicContent',
      title: 'Public Service Journey Content',
      type: 'text',
    }),
    defineField({
      name: 'focusAreas',
      title: 'Vision Focus Areas',
      type: 'array',
      of: [{ type: 'string' }],
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
            { name: 'name', title: 'Value Name', type: 'string' },
            { name: 'desc', title: 'Value Description', type: 'text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'quoteText',
      title: 'Quote Text',
      type: 'text',
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Quote Author',
      type: 'string',
    }),
    defineField({
      name: 'summaryContent',
      title: 'Profile Summary',
      type: 'text',
    }),
  ],
})
