import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const site = defineCollection({
  loader: glob({
    base: './src/content/site',
    pattern: '**/*.json'
  }),
  schema: z.any()
});

export const collections = {
  site
};
