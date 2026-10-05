// Solape entre las letras que se van y las que se quedan, frame a frame.
//
// Este es el defecto de la captura: dos textos encima en la cabecera. Se
// medía mal la primera vez porque se leía el estado ACTUAL de las casillas
// para todos los frames, que da el resultado final repetido N veces. Aquí se
// usan los snapshots que devuelve el bucle.
//
// El problema real era que la salida iba lineal: a los 100 ms las letras que
// sobraban habían recorrido el 24% de su trayectoria y estaban al 85% de
// opacidad, así que durante ~200 ms había letras a opacidad 1.00 encima de la
// palabra nueva. Ahora el movimiento tiene curva y se va pronto mientras se
// sigue disolviendo despacio.
import { escenario } from './_escenario.mjs';

const ok = [];
const mal = [];
const check = (p, m) => (p ? ok : mal).push(m);

const MS_POR_FRAME = 16.7;
// Media letra: dos letras cuentan como solape si su x está a menos de esto.
const ANCHO = 10;
// Desde aquí el solape con opacidad alta ya no se tolera.
const DESDE_FRAME = Math.round(100 / MS_POR_FRAME); // ~6
// Y este es el techo en pares por frame dentro de esa franja.
const TOPE_PARES = 20;

const vuelo = escenario({ reduce: false, semilla: 20260403 });
const originales = vuelo.charInicial;

// `left` es constante durante un solo morph, así que se lee una sola vez. Leer
// vuelo.slots dentro del bucle devolvería el estado final, no el de cada frame.
const izquierda = vuelo.slots.map((s) => parseFloat(s.style.left) || 0);

const snapshots = [];
let fotogramas = 0;
while ((vuelo.win._raf ?? []).length && fotogramas < 400) {
	snapshots.push(vuelo.paso());
	fotogramas++;
}

const frames = snapshots.map((fr) =>
	fr.map((snap, k) => {
		const t = /translate3d\((-?[\d.]+)px/.exec(snap.transform || '');
		return {
			x: izquierda[k] + (t ? parseFloat(t[1]) : 0),
			op: snap.opacity === '' || snap.opacity === undefined ? 1 : Number(snap.opacity),
			// dataset.char vacío en una casilla que tenía texto = se está yendo
			saliendo: originales[k] !== '' && !snap.char,
			conTexto: snap.char !== '',
		};
	}),
);

const medir = (fr) => {
	const saliendo = fr.filter((x) => x.saliendo && x.op > 0.05);
	const pintan = fr.filter((x) => x.conTexto && !x.saliendo && x.op > 0.05);
	let pares = 0;
	let parMax = { op: 0, p: 0 };
	for (const a of saliendo) {
		for (const b of pintan) {
			if (Math.abs(a.x - b.x) < ANCHO) {
				pares++;
				if (a.op > parMax.op) parMax = { op: a.op, p: pares };
			}
		}
	}
	return { pares, opMax: pares ? parMax.op : 0 };
};

check(frames.length > 40, `el morph se dibuja (${frames.length} frames)`);

// 1. A partir de 100 ms ya no puede haber un montón de letras a opacidad alta
//    encima de la palabra nueva. Con la salida lineal había 88 pares @ 1.00.
const tardios = frames.slice(DESDE_FRAME).map(medir);
const peor = Math.max(...tardios.map((m) => m.pares));
check(peor <= TOPE_PARES,
	`pasados 100 ms casi no queda solape a opacidad alta (pico ${peor} pares, tope ${TOPE_PARES})`);

// 2. Ningún frame tardío con opacidad alta: el solape que queda es tenue.
const conOpAlta = tardios.filter((m) => m.opMax >= 0.9).length;
check(conOpAlta === 0,
	`pasados 100 ms ninguna letra que se va está a opacidad alta (frames: ${conOpAlta})`);

// 3. El solape se resuelve en menos de la mitad del morph: si se alargase hasta
//    el final, la cabecera estaría media vuelta con los dos textos encima.
const resuelto = frames.findIndex((_, i) => i >= DESDE_FRAME && medir(frames[i]).pares === 0);
check(resuelto !== -1 && resuelto < frames.length / 2,
	`el solape se acaba antes de la mitad del morph (frame ${resuelto} de ${frames.length})`);

// 4. Siguen saliendo hacia fuera y sin bajar de la línea: lo que cambia aquí
//    es cuándo se solapan, no hacia dónde van.
const sinVertical = snapshots.every((fr) => fr.every((snap) => {
	const t = /translate3d\(-?[\d.]+px,\s*([-\d.]+)px/.exec(snap.transform || '');
	return !t || parseFloat(t[1]) === 0;
}));
check(sinVertical, 'mientras se van ninguna baja de la línea');

// Resumen para poder juzgar la fuerza del cambio sin abrir el navegador.
console.log('  fotogramas');
console.log(`    ${fotogramas} frames (${Math.round(fotogramas * MS_POR_FRAME)} ms)`);
console.log('    ms : pares solapados @ opacidad máxima');
frames.forEach((fr, i) => {
	if (i % 6 !== 0) return;
	const m = medir(fr);
	console.log(`    ${String(Math.round(i * MS_POR_FRAME)).padStart(4)} : ${String(m.pares).padStart(3)} @ ${m.opMax.toFixed(2)}`);
});

ok.forEach((m) => console.log('PASA  ' + m));
mal.forEach((m) => console.log('FALLA ' + m));
console.log(mal.length ? `\n${mal.length} FALLOS` : '\nTODO OK');
process.exit(mal.length ? 1 : 0);