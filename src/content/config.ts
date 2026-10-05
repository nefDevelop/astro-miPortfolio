import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
	type: 'content',
	// El .md es solo el cuerpo del caso de estudio. Toda la presentación
	// (tipo, descripción, stack, capturas, GitHub) vive en data/portfolio.ts,
	// que es lo que pinta la portada. Antes estaba copiada en los dos sitios
	// y divergía: la portada decía "Recetas Markdown" y el caso "Recetas MD".
	// Los campos que quedan aquí son los de identificación de la ruta.
	schema: () =>
		z.object({
			title: z.string(),
			highlight: z.string().optional(),
			lang: z.enum(['es', 'en']),
			// Segmento de URL sin idioma, p. ej. 'recipenode'. El nombre del archivo
			// lo distingue por idioma (`recipenode-es.md`), pero la URL no debe
			// llevarlo: si lo llevara, cambiar de idioma desde un caso llevaria a
			// /en/projects/recipenode-es, que no existe, y el hreflang alterno
			// apuntaria a un 404. Se llama `route` y no `slug` porque `slug` esta
			// reservado en las colecciones de contenido de Astro.
			route: z.string(),
			order: z.number().default(0),
		}),
});

export const collections = {
	'projects': projectsCollection,
};
