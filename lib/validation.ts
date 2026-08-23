import { z } from 'zod';

export const EVENT_CATEGORIES = [
  'Community Outreach',
  'Networking',
  'Tech Conference',
  'Workshop',
  'Hackathon',
] as const;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  tagline: z.string().trim().min(1, 'Tagline is required').max(160),
  description: z.string().trim().min(1, 'Short description is required').max(500),
  content: z.string().trim().max(5000).optional().or(z.literal('')),
  techStack: z.string().trim().max(300).optional().or(z.literal('')),
  liveUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.coerce.boolean().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const eventSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().min(1, 'Short description is required').max(500),
  story: z.string().trim().max(5000).optional().or(z.literal('')),
  category: z.enum(EVENT_CATEGORIES),
  date: z.string().trim().optional().or(z.literal('')),
  location: z.string().trim().max(160).optional().or(z.literal('')),
});

export type EventInput = z.infer<typeof eventSchema>;

export { slugify };
