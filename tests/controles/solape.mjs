// Control negativo: deja la salida lineal y comprueba que solape.mjs lo
// detecta. Es el fallo de la captura: dos textos encima en la cabecera.
//
// Sin este control, un verde no prueba nada: la primera versión de la medición
// daba 0 solapes por estar leyendo el estado final en todos los frames.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { dist, raiz } from '../_raiz.mjs';

const file = fs.readdirSync(dist).find((f) => f.startsWith('Nav'));
const original = fs.readFileSync(path.join(dist, file), 'utf8');

// curvaSalida se minifica como `X=a=>1-(1-a)**3`. La se deja lineal.
const patron = /([A-Za-z_$][\w$]*)=([A-Za-z_$][\w$]*)=>1-\(1-\2\)\*\*3/;
const m = original.match(patron);
if (!m) {
	console.log('AVISO: el patrón de la curva no aparece en el bundle, el control no vale');
	process.exit(2);
}
const parcheado = original.replace(patron, (_t, nombre) => `${nombre}=a=>a`);
if (parcheado === original) {
	console.log('AVISO: el parche no cambió nada');
	process.exit(2);
}

const destino = fs.mkdtempSync(path.join(os.tmpdir(), 'neg-solape-'));
fs.writeFileSync(path.join(destino, file), parcheado);

let code = 0;
let out = '';
try {
	out = execFileSync('node', [path.join(raiz, 'tests', 'solape.mjs')], {
		encoding: 'utf8',
		env: { ...process.env, NAV_BUNDLE: destino },
		timeout: 180_000,
	});
} catch (e) {
	code = e.status;
	out = e.stdout ?? '';
}
fs.rmSync(destino, { recursive: true, force: true });

const detecta = code !== 0;
console.log(`${detecta ? 'PASA ' : 'FALLA'}  solape.mjs detecta la salida lineal`);
out
	.split('\n')
	.filter((l) => l.startsWith('FALLA'))
	.forEach((l) => console.log(`        ${l.trim()}`));
process.exit(detecta ? 0 : 1);