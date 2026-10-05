// Comprueba que todas las utilidades de estado que se usan en el codigo
// existen de verdad en el CSS compilado, y que hover y focus-visible van en
// pareja.
//
// Esto existe porque `bg-ink/5` se descartaba en silencio: Tailwind no puede
// inyectar alfa en un color declarado como `var(--ink)`, asi que la utilidad no
// se generaba y los seis hovers de los botones fantasma no existian. El build
// no daba ningun error, la clase aparecia en el HTML, y no habia forma de
// enterarse salvo mirando el CSS a mano.
import fs from 'node:fs';
import path from 'node:path';

import { raiz } from './_raiz.mjs'; // RAIZ/NAV_BUNDLE los lee el helper

const fuente = [];
const recorrer = (dir) => {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) recorrer(p);
		else if (/\.astro$/.test(e.name)) fuente.push(p);
	}
};
recorrer(path.join(raiz, 'src'));

const css = fs
	.readdirSync(path.join(raiz, 'dist/_astro'))
	.filter((f) => f.endsWith('.css'))
	.map((f) => fs.readFileSync(path.join(raiz, 'dist/_astro', f), 'utf8'))
	.join('\n');

// Las clases que dependen de una combinacion de variantes se empirically
// filtran: se listing con la forma exacta que genera Tailwind.
const clases = new Map(); // clase -> [archivos]
const VARIANTES = /^(hover|focus-visible|focus|active|group-hover|group-focus-visible):/;

for (const f of fuente) {
	const s = fs.readFileSync(f, 'utf8');
	for (const [, attr] of s.matchAll(/class="([^"]*)"/g)) {
		// Los class: de Astro traen expresiones dentro; se limpian los signos
		for (const token of attr.split(/\s+/)) {
			const limpio = token.replace(/^\$\{.*\}$/, '').trim();
			if (!limpio || !VARIANTES.test(limpio)) continue;
			// Se descartan los valores arbitrarios: su selector compilado es
			// distinto y no se puede predecir sin el motor.
			if (limpio.includes('[') || limpio.includes('(')) continue;
			if (!clases.has(limpio)) clases.set(limpio, new Set());
			clases.get(limpio).add(path.relative(raiz, f));
		}
	}
}

// Como escaparia Tailwind el selector de una clase.
const escapar = (c) => c.replace(/([:/.[\]%#])/g, '\\$1');

const faltan = [];
for (const [clase, archivos] of clases) {
	const selector = '.' + escapar(clase);
	if (!css.includes(selector)) faltan.push([clase, [...archivos]]);
}

// Paridad: si algo responde al puntero, tiene que responder al teclado.
const base = (c) => c.replace(/^(hover|focus|focus-visible|active|group-hover|group-focus-visible):/, '');
const conHover = new Set([...clases.keys()].filter((c) => c.startsWith('hover:')).map(base));
const conFoco = new Set([...clases.keys()].filter((c) => c.startsWith('focus-visible:')).map(base));
const sinPareja = [...conHover].filter((b) => !conFoco.has(b));

console.log(`${fuente.length} ficheros, ${clases.size} utilidades de estado`);

if (faltan.length) {
	console.log('\nUTILIDADES QUE NO EXISTEN EN EL CSS:');
	for (const [clase, archivos] of faltan) {
		console.log(`  ${clase}`);
		console.log(`      ${archivos.join(', ')}`);
	}
}
if (sinPareja.length) {
	console.log('\nSIN EQUIVALENTE DE FOCO:');
	sinPareja.forEach((b) => console.log(`  ${b}`));
}

if (faltan.length || sinPareja.length) {
	console.log(`\n${faltan.length + sinPareja.length} PROBLEMAS`);
	process.exit(1);
}
console.log('  todas existen en el CSS');
console.log('  hover y focus-visible van en pareja');
console.log('\nTODO OK');