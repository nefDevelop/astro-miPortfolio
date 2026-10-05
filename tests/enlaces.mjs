// Comprueba que TODOS los enlaces internos del build apuntan a una pagina que
// existe. Un enlace a 404 no se ve en el navegador hasta que lo pulsas, asi que
// esto lo caza antes.
//
// Se ignoran los assets (/_astro/, robots.txt, sitemap): no son paginas.
import fs from 'node:fs';
import path from 'node:path';

import { dist } from './_raiz.mjs';

const ASSETS = /^\/(_astro\/|robots\.txt$|sitemap)/;

const html = [];
const recorrer = (dir) => {
	for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
		const completo = path.join(dir, entrada.name);
		if (entrada.isDirectory()) recorrer(completo);
		else if (entrada.name.endsWith('.html')) html.push(completo);
	}
};
recorrer(dist);

// Paginas que el sitio sirve: cada index.html es una ruta con barra final.
const paginas = new Set(['/404.html']);
for (const f of html) {
	const rel = '/' + path.relative(dist, f).replace(/\\/g, '/');
	paginas.add(rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel);
}

// En formato `directory`, un enlace sin barra final lo redirige el servidor;
// se acepta como válido pero se avisa, porque en estaticos mal configurados es
// un 404.
const rotos = [];
const sinBarra = [];
const vistos = new Set();

for (const f of html) {
	const origen = path.relative(dist, f);
	const s = fs.readFileSync(f, 'utf8');
	for (const [, href] of s.matchAll(/href="(\/[^"#?]*)"/g)) {
		if (ASSETS.test(href)) continue;
		const destino = decodeURIComponent(href);
		if (!destino.endsWith('/') && !destino.endsWith('.html')) sinBarra.push([origen, destino]);
		const normalizado = destino.endsWith('/') ? destino : `${destino}/`;
		vistos.add(normalizado);
		if (!paginas.has(normalizado)) rotos.push([origen, destino]);
	}
}

console.log(`${paginas.size} paginas, ${vistos.size} enlaces internos distintos`);
sinBarra.forEach(([o, h]) => console.log(`  AVISO  ${o} -> ${h} (sin barra final: dependera de un redirect)`));
if (rotos.length) {
	rotos.forEach(([o, h]) => console.log(`  FALLA  ${o} -> ${h}`));
	console.log(`\n${rotos.length} ENLACES ROTOS`);
	process.exit(1);
}
console.log('  ninguno roto');
console.log(sinBarra.length ? '\nTODO OK (con avisos)' : '\nTODO OK');