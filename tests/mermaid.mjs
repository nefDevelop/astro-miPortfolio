// Comprueba que los bloques ```mermaid llegan crudos al HTML del caso de
// estudio y que solo aparecen donde hay un diagrama.
//
// Es lo que sostiene el render en cliente de [slug].astro: si Shiki volviera a
// envolver el bloque, el selector 'pre > code.language-mermaid' no encontraría
// nada y el diagrama no se dibujaría nunca, sin que se viera ningún fallo en
// la build.
import fs from 'node:fs';
import path from 'node:path';
import { distHtml } from './_raiz.mjs';

const ok = [];
const mal = [];
const check = (pass, msg) => (pass ? ok : mal).push(msg);

const leer = (rel) => {
  const ruta = path.join(distHtml, rel);
  if (!fs.existsSync(ruta)) {
    mal.push(`falta ${rel}`);
    return '';
  }
  return fs.readFileSync(ruta, 'utf8');
};

const recipe = leer('es/projects/recipenode/index.html');
const recipeEn = leer('en/projects/recipenode/index.html');
const regio = leer('es/projects/regio/index.html');

// El bloque existe y conserva el fuente: es el fallback sin JS.
check(/<code class="language-mermaid">/.test(recipe), 'recipenode (es) trae <code class="language-mermaid">');
check(/<code class="language-mermaid">/.test(recipeEn), 'recipenode (en) trae <code class="language-mermaid">');
check(/chokidar/.test(recipe), 'el fuente del diagrama llega al HTML (fallback sin JS)');

// Shiki no debe haber tocado el bloque: si lo envuelve en astro-code, el
// selector del script no lo encuentra.
const m = /<pre([^>]*)><code class="language-mermaid">/.exec(recipe);
check(Boolean(m), 'el bloque vive dentro de un <pre> directo');
check(Boolean(m) && !/astro-code/.test(m[1]), 'el <pre> no está resaltado por Shiki (sin clase astro-code)');

// Un caso de estudio sin diagrama no debe arrastrar marcadores mermaid.
check(!/language-mermaid/.test(regio), 'regio (sin diagrama) no trae bloques mermaid');

// El script de la página es donde vive el render, y los <script> de Astro no
// se type-checkean en build: un fallo de runtime solo se ve en el navegador.
// El que cazó esto fue initialize({ theme, ... }) con la variable mal nombrada
// (ReferenceError en cliente, fuente en pantalla y ningún dibujo); por eso se
// comprueba que el tema viaja con valor explícito y que el selector sigue ahí.
const slug = fs.readdirSync(path.join(distHtml, '_astro')).find((f) => f.startsWith('_slug_') && f.endsWith('.js'));
const js = slug ? fs.readFileSync(path.join(distHtml, '_astro', slug), 'utf8') : '';
const init = /initialize\(\{[^}]*\}/.exec(js);
check(Boolean(init) && /theme:/.test(init[0]), 'el script inicializa mermaid con theme con valor');
check(/pre > code\.language-mermaid/.test(js), 'el script sigue buscando los bloques con el selector esperado');

console.log('');
ok.forEach((msg) => console.log('PASA  ' + msg));
mal.forEach((msg) => console.log('FALLA ' + msg));
console.log('');
if (mal.length) {
  console.log(`${mal.length} comprobaciones han fallado`);
  process.exit(1);
}
console.log(`${ok.length} comprobaciones en verde`);
process.exit(0);
