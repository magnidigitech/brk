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
    defineField({
      name: 'introVideoUrl',
      title: 'Intro Video YouTube URL',
      type: 'url',
      description: 'The URL of the YouTube video to show above the profile intro.',
    }),
    defineField({
      name: 'introVideoTitle',
      title: 'Intro Video Title',
      type: 'string',
      description: 'The title to display above the video player (e.g. "Featured Video" or "Intro Video"). Defaults to "Featured Video".',
    }),
    defineField({
      name: 'showIntroVideo',
      title: 'Show Intro Video',
      type: 'boolean',
      description: 'Toggle to show or hide the intro video player on the Home Page.',
      initialValue: false,
    }),
    defineField({
      name: 'customEmbedCode',
      title: 'Custom Embed HTML Code',
      type: 'text',
      description: 'Paste any HTML/iframe embed code here to display above the YouTube video player.',
    }),
    defineField({
      name: 'showCustomEmbed',
      title: 'Show Custom Embed Block',
      type: 'boolean',
      description: 'Toggle to show or hide the custom embed block on the Home Page.',
      initialValue: false,
    }),
  ],
})
