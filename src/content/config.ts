import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    status: z.enum(['open-source', 'saas', 'internal', 'archived']),
    featured: z.boolean().default(false),
    year: z.number(),
    link: z.string().url().optional(),
    github: z.string().url().optional(),
    image: z.string().optional(),
    order: z.number().default(999),
    lang: z.enum(['pt-BR', 'en']).default('pt-BR'),
  }),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    url: z.string().url().optional(),
    platform: z.enum(['medium', 'book', 'blog']),
    featured: z.boolean().default(false),
    tags: z.array(z.string()),
    readingTime: z.string().optional(),
    lang: z.enum(['pt-BR', 'en']).default('pt-BR'),
  }),
});

const talks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    type: z.enum(['talk', 'workshop', 'mentorship', 'community']),
    date: z.date(),
    description: z.string(),
    link: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    lang: z.enum(['pt-BR', 'en']).default('pt-BR'),
  }),
});

export const collections = { projects, articles, talks };
