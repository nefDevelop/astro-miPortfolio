import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		highlight: z.string().optional(),
		type: z.string(),
		desc: z.string(),
		image: z.union([image(), z.string()]),
		imageAlt: z.string().optional(),
		imagePosition: z.string().optional(),
		color: z.string(),
		lang: z.enum(['es', 'en']),
		order: z.number().default(0),
		github: z.string().optional(),
	}),
});

export const collections = {
	'projects': projectsCollection,
};
