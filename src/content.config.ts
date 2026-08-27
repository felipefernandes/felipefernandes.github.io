import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    status: z.enum(['open-source', 'saas', 'internal', 'archived']),
    featured: z.boolean().default(false),
    year: z.number(),
    link: z.url().optional(),
    github: z.url().optional(),
    image: z.string().optional(),
    order: z.number().default(999),
    lang: z.enum(['pt-BR', 'en']).default('pt-BR'),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    url: z.url().optional(),
    platform: z.enum(['medium', 'book', 'blog']),
    featured: z.boolean().default(false),
    tags: z.array(z.string()),
    readingTime: z.string().optional(),
    lang: z.enum(['pt-BR', 'en']).default('pt-BR'),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    type: z.enum(['talk', 'workshop', 'mentorship', 'community']),
    date: z.date(),
    description: z.string(),
    link: z.url().optional(),
    videoUrl: z.url().optional(),
    lang: z.enum(['pt-BR', 'en']).default('pt-BR'),
  }),
});

const archive = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/archive' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    categories: z.array(z.string()),
    description: z.string(),
  }),
});

export const collections = { projects, articles, talks, archive };
