import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

// Orquestador de la batería. Cada test es un fichero independiente que termina
// con process.exit, así que se lanzan en procesos aparte y un fallo no deja al
// resto sin ejecutar.
//
//   node tests/run.mjs            → todos
//   node tests/run.mjs unit       → los que no necesitan dist
//   node tests/run.mjs build      → los que leen dist
//   node tests/run.mjs controles  → los que patchean el bundle y comprueban
//                                   que el test correspondiente lo detecta
const aqui = path.dirname(fileURLToPath(import.meta.url));
const grupo = process.argv[2] ?? '';

// _escenario y _raiz son módulos de apoyo, no tests: se ejecutan solos y
// saldrían como pruebas en verde sin comprobar nada.
const ignorar = new Set(['run.mjs', '_raiz.mjs', '_escenario.mjs', 'physics.mjs']);
const ficheros = (dir) =>
	fs.readdirSync(dir)
		.filter((f) => f.endsWith('.mjs') && !ignorar.has(f))
		.sort()
		.map((f) => path.join(dir, f));

const indice = (raiz, f) => path.relative(raiz, f).replace(/\\/g, '/');

let aEjecutar;
let titulo;
if (grupo === 'controles') {
	aEjecutar = ficheros(path.join(aqui, 'controles'));
	titulo = 'controles negativos';
} else {
	const todas = ficheros(aqui);
	// La comprobación tiene que mirar también _escenario.mjs: solape.mjs no
	// importa _raiz directamente, pero el escenario que usa sí. Sin esto se
	// clasificaba como unitaria y se ejecutaba sin haber construido.
	const necesitaDist = (f) => {
		const codigo = fs.readFileSync(f, 'utf8');
		return codigo.includes('./_raiz.mjs') || codigo.includes('./_escenario.mjs');
	};
	aEjecutar = todas.filter((f) =>
		grupo === 'unit' ? !necesitaDist(f) : grupo === 'build' ? necesitaDist(f) : true,
	);
	titulo = grupo || 'suites';
}

// Los que leen dist necesitan haber construido. Si se lanza directo sin pasar
// por `make test-build`, el aviso dice exactamente qué falta.
if (aEjecutar.some((f) => {
	const c = fs.readFileSync(f, 'utf8');
	return c.includes('./_raiz.mjs') || c.includes('./_escenario.mjs');
})) {
	const dist = path.join(aqui, '..', 'dist');
	if (!fs.existsSync(dist)) {
		console.error('Falta dist/: los tests de integración leen el build.');
		console.error('Ejecuta `npm run build` primero, o `make test-build`.');
		process.exit(1);
	}
}

const fallos = [];
for (const f of aEjecutar) {
	try {
		execFileSync('node', [f], { encoding: 'utf8', stdio: 'pipe', timeout: 180_000 });
		console.log(`  PASA  ${indice(aqui, f)}`);
	} catch (e) {
		fallos.push(indice(aqui, f));
		console.log(`  FALLA ${indice(aqui, f)}`);
		const salida = String(e.stdout ?? '').trim();
		if (salida) {
			salida.split('\n').forEach((linea) => console.log(`        ${linea}`));
		}
		if (e.code === null) console.log('        (no terminó a tiempo)');
	}
}

console.log('');
if (fallos.length) {
	console.log(`${fallos.length} de ${aEjecutar.length} ${titulo} han fallado:`);
	fallos.forEach((f) => console.log(`  ${f}`));
	process.exit(1);
}
console.log(`${aEjecutar.length} ${titulo} en verde`);