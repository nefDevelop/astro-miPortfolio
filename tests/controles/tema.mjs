// Control negativo: deja la ventana de tema sin cerrar y comprueba que
// tema.mjs lo detecta. Es el fallo más peligroso porque el tema parece que
// funciona y en cambio TODOS los hovers se quedan a 350 ms para siempre.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { raiz } from '../_raiz.mjs';

import { dist as real } from '../_raiz.mjs';
const file = fs.readdirSync(real).find((f) => f.startsWith('Nav'));
const original = fs.readFileSync(path.join(real, file), 'utf8');

const patron = /(\w+)\.classList\.remove\("theme-changing"\)/;
const m = original.match(patron);
if (!m) {
	console.log('AVISO: el patrón del cierre no aparece en el bundle, el control no vale');
	process.exit(2);
}
const parcheado = original.replace(patron, (_t, var_) => `void ${var_}`);

const destino = fs.mkdtempSync(path.join(os.tmpdir(), 'neg-tema-'));
fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });
fs.writeFileSync(path.join(destino, file), parcheado);

let code = 0;
let out = '';
try {
	out = execFileSync('node', [path.join(raiz, 'tests', 'tema.mjs')],
		{ encoding: 'utf8', env: { ...process.env, RAIZ: raiz, NAV_BUNDLE: destino } });
} catch (e) {
	code = e.status;
	out = e.stdout ?? '';
}
fs.rmSync(destino, { recursive: true, force: true });

const detecta = code !== 0;
console.log(`${detecta ? 'PASA ' : 'FALLA'}  tema.mjs detecta la ventana que no se cierra`);
out.split('\n').filter((l) => l.startsWith('FALLA')).forEach((l) => console.log(`        ${l.trim()}`));
process.exit(detecta ? 0 : 1);
