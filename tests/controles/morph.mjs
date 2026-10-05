// Control negativo: reintroduce cada defecto en el bundle MINIFICADO y
// comprueba que salida.mjs lo detecta. Sin esto un test verde no prueba nada.
//
// Los nombres minificados cambian en cada build, así que los patrones localizan
// la forma del código y el replacement se construye con los grupos capturados.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { raiz } from '../_raiz.mjs';

import { dist as real } from '../_raiz.mjs';
const file = fs.readdirSync(real).find((f) => f.startsWith('Nav'));
const original = fs.readFileSync(path.join(real, file), 'utf8');

const destino = fs.mkdtempSync(path.join(os.tmpdir(), 'neg-bundle-'));
fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });

/** Cada caso devuelve el bundle alterado, o null si el patrón no aparece. */
// Prefijo común del bucle de salida. La forma cambió cuando se separaron los
// dos tiempos (movimiento y desvanecido), así que en vez de escribir el
// patrón completo se ancla a `hecho` y se capturan los nombres que el
// minifier asigne cada vez. Si no, el control deja de valer sin ningún aviso
// y seguiría en verde sin comprobar nada.
const progreso = (src) =>
	/if\((\w+)\.hecho\)continue;const (\w+)=(\w+)-(\w+)\.delay,(\w+)=(\w+)\(\2\/\4\.dur\);if\(\5>=1\)/.exec(src);

const casos = {
	// La letra desaparece de golpe en vez de desvanecerse.
	'salida instantanea': (src) => {
		const m = progreso(src);
		return (
			m &&
			src.replace(
				m[0],
				`if(${m[1]}.hecho)continue;const ${m[2]}=${m[3]}-${m[4]}.delay,${m[5]}=${m[2]}>0?1:0;if(${m[5]}>=1)`,
			)
		);
	},
	// Se apaga antes de que el reacomodo haya empezado: 60ms en vez de 420.
	'sin solape con el reacomodo': (src) => {
		const m = progreso(src);
		return (
			m &&
			src.replace(
				m[0],
				`if(${m[1]}.hecho)continue;const ${m[2]}=${m[3]}-${m[4]}.delay,${m[5]}=${m[6]}(${m[2]}/60);if(${m[5]}>=1)`,
			)
		);
	},
	// Todas las del interior caen en el mismo sitio: se quita el peldaño.
	'apiladas': (src) => {
		const m = /const (\w+)=(\w+)\+(\w+)\*(\w+),/.exec(src);
		return m && src.replace(m[0], `const ${m[1]}=${m[2]},`);
	},
	// Caída vertical. Hay dos escrituras de transform parecidas (movers y
	// exiters) y solo importa la de los exiters, pero parcheando las dos el
	// defecto sigue estando y el test tiene que verlo.
	'caida vertical': (src) => {
		const re = /translate3d\(\$\{(\w+)\.toFixed\(2\)\}px, 0, 0\)/g;
		if (!re.test(src)) return null;
		return src.replace(re, (_match, v) => `translate3d(\${${v}.toFixed(2)}px, 6, 0)`);
	},
	// El desvanecido se tumba en un solo frame.
	'desvanecido de golpe': (src) => {
		const m = /String\((\w+)\((\w+)\)\)/.exec(src);
		return m && src.replace(m[0], `String(${m[2]}>.85?0:1)`);
	},
};

let fallos = 0;
for (const [nombre, alterar] of Object.entries(casos)) {
	const parcheado = alterar(original);
	if (!parcheado || parcheado === original) {
		console.log(`AVISO  ${nombre}: el patrón no aparece en el bundle, el control no vale`);
		fallos++;
		continue;
	}
	fs.writeFileSync(path.join(destino, file), parcheado);

	let code = 0;
	let out = '';
	try {
		out = execFileSync('node', [path.join(raiz, 'tests', 'salida.mjs')], {
			encoding: 'utf8',
			env: { ...process.env, NAV_BUNDLE: destino },
		});
	} catch (e) {
		code = e.status;
		out = e.stdout ?? '';
	}

	const detecta = code !== 0;
	console.log(`${detecta ? 'PASA ' : 'FALLA'}  salida.mjs detecta: ${nombre}`);
	if (!detecta) fallos++;
	else out.split('\n').filter((l) => l.startsWith('FALLA')).slice(0, 3).forEach((l) => console.log(`        ${l.trim()}`));
}
fs.rmSync(destino, { recursive: true, force: true });

console.log(fallos ? `\n${fallos} controles no detectan el defecto` : '\nTODOS LOS CONTROLES OK');
process.exit(fallos ? 1 : 0);