import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Rutas del proyecto, para no repetir rutas absolutas en cada test.
 *
 * `RAIZ` apunta la misma batería a otra copia del proyecto y `NAV_BUNDLE` a
 * otro directorio con el bundle. Los dos los usan los controles negativos, que
 * patchean una copia del bundle y comprueban que los tests la ven.
 */
export const raiz = process.env.RAIZ ?? fileURLToPath(new URL('../', import.meta.url));
export const dist = process.env.NAV_BUNDLE ?? path.join(raiz, 'dist', '_astro');
export const distHtml = path.join(raiz, 'dist');
