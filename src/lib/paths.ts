import type { Locale } from '../i18n/translations';

/**
 * Ruta local sin prefijo de idioma, con barra final.
 *
 * Astro genera las páginas en formato `directory`, así que la URL canónica de
 * `/es/projects/recipenode` es `.../recipenode/`. Si un enlace omite la barra,
 * el servidor responde con un 301 en el mejor caso. Se normaliza aquí una sola
 * vez en vez de repetir el mismo parche en el header, el layout y la página de
 * caso, que ya se han desincronizado entre ellos.
 *
 * `path` va sin barra inicial ni final, y `''` significa la portada.
 */
export function localePath(locale: Locale, path = ''): string {
	const limpio = path.replace(/^\/+|\/+$/g, '');
	return limpio ? `/${locale}/${limpio}/` : `/${locale}/`;
}