import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'candidateName',
      title: 'Candidate Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'roleBadge',
      title: 'Role Badge Text',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'partyName',
      title: 'Party Name',
      type: 'string',
    }),
    defineField({
      name: 'stateRepresented',
      title: 'State Represented',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'youtube', title: 'YouTube URL', type: 'url' },
        { name: 'twitter', title: 'X / Twitter URL', type: 'url' },
      ],
    }),
    defineField({
      name: 'delhiOffice',
      title: 'New Delhi Office',
      type: 'object',
      fields: [
        { name: 'address', title: 'Address', type: 'text' },
        { name: 'phone', title: 'Phone Number', type: 'string' },
        { name: 'email', title: 'Email Address', type: 'string' },
      ],
    }),
    defineField({
      name: 'stateOffice',
      title: 'State Camp Office',
      type: 'object',
      fields: [
        { name: 'address', title: 'Address', type: 'text' },
        { name: 'phone', title: 'Phone Number', type: 'string' },
        { name: 'email', title: 'Email Address', type: 'string' },
      ],
    }),
  ],
})
