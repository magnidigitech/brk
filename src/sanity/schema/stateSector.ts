import { defineField, defineType } from 'sanity'

export const stateSector = defineType({
  name: 'stateSector',
  title: 'State Focus Sector',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Sector Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'short',
      title: 'Short Description',
      type: 'string',
    }),
    defineField({
      name: 'iconName',
      title: 'Icon Name (Lucide)',
      type: 'string',
      description: 'E.g. BookOpen, HeartPulse, Sprout, Navigation, Briefcase, Users, Cpu, Leaf',
    }),
    defineField({
      name: 'vision',
      title: 'Development Vision',
      type: 'text',
    }),
    defineField({
      name: 'concerns',
      title: 'Key Focus Points & Concerns',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
})
