// Comprueba el comportamiento de las letras que se van, ejecutando el bundle
// real contra un DOM minimo. Ahora la salida la dibuja el bucle rAF, asi que
// ya no hay transiciones CSS que inspeccionar: se mira lo que el bucle escribe.
import { escenario, file, dist, NOMBRE } from './_escenario.mjs'; // RAIZ/NAV_BUNDLE los lee el helper


const ok = [];
const mal = [];
const check = (p, m) => (p ? ok : mal).push(m);
// Hay dos formas de transform en el bundle: los movers escriben
// translate3d(Xpx, Ypx, 0) y los exiters translate3d(Xpx, 0, 0).
//
// Ojo con el sufijo px: en regex, `px?` es "p con x opcional", NO "px opcional".
// Con `px?` hay que escribir un px literal detrás de cada número, así que solo
// casaban los movers y todas las comprobaciones de los exiters pasaban sin
// comprobar nada. Lo correcto es (?:px)?
const parse = (s) => {
	const m = /translate3d\(([-\d.]+)px,\s*([-\d.]+)(?:px)?,\s*([-\d.]+)(?:px)?\)(?:\s*scale\(([\d.]+)\))?/.exec(s || '');
	return m
		? { dx: parseFloat(m[1]), dy: parseFloat(m[2]), scale: m[4] === undefined ? 1 : parseFloat(m[4]) }
		: null;
};

// --- caso normal -----------------------------------------------------------
const { slots, avanzar } = escenario({ reduce: false, semilla: 20260403 });
avanzar();

const conChar = slots.filter((s) => s.dataset.char);
check(conChar.length === 10, `la palabra nueva tiene 10 letras (${conChar.length})`);

// settle() pone el transform a 0 en todas, así que a estas alturas ya no se ve
// dónde pararon. Lo que se comprueba aquí es solo el estado final.
const sinChar = slots.filter((s) => s.dataset.char === '');
check(sinChar.every((s) => s.style.opacity === '0' || s.style.opacity === undefined),
	'las que se van acaban invisibles');
check(conChar.every((s) => s.style.opacity === '1'), 'las que llegan quedan visibles');
check(sinChar.every((s) => !parse(s.style.transform)?.dy), 'ninguna queda con desplazamiento vertical');

// --- lo que pasa EN VUELO: aqui esta el defecto que reportaba el usuario ---
const vuelo = escenario({ reduce: false, semilla: 20260403 });
// Solo son exiters las que tenian letra y se quedan sin destino. Las casillas
// que ya estaban vacías no participan en nada y no deben contarse.
const exiteres = vuelo.slots
	.map((s, k) => ({ k, char: s.dataset.char }))
	.filter((r) => !r.char && vuelo.charInicial[r.k])
	.map((r) => r.k);
check(exiteres.length > 10, `hay letras que se van durante el morph (${exiteres.length})`);

const frames = [];
let f = 0;
while ((vuelo.win._raf ?? []).length && f < 400) { frames.push(vuelo.paso()); f++; }
check(frames.length > 30, `el morph se dibuja durante varias decenas de frames (${frames.length})`);

// 1) se desvanecen de forma gradual: ningun salto grande entre frames
let peorSalto = 0;
for (let i = 1; i < frames.length; i++) {
	for (const k of exiteres) {
		const a = parseFloat(frames[i - 1][k].opacity ?? '1');
		const b = parseFloat(frames[i][k].opacity ?? '1');
		if (Number.isNaN(a) || Number.isNaN(b)) continue;
		peorSalto = Math.max(peorSalto, Math.abs(a - b));
	}
}
check(peorSalto > 0 && peorSalto < 0.12, `el desvanecido es gradual, sin un frame que lo tumbe (peor salto ${peorSalto.toFixed(3)})`);

// 2) se van SOLAPADAS con el reacomodo, no despues: ese era el encargo
let framesConAmbos = 0;
for (const frame of frames) {
	const exiterVisible = exiteres.some((k) => {
		const o = parseFloat(frame[k].opacity ?? '1');
		return o > 0.02 && o < 0.98;
	});
	const moverMovido = frame.some((s, k) => {
		if (!s.char) return false;
		const t = parse(s.transform);
		return t && t.dx !== 0;
	});
	if (exiterVisible && moverMovido) framesConAmbos++;
}
const proporcion = framesConAmbos / frames.length;
check(proporcion > 0.25, `se desvanece y se recompone a la vez durante buena parte del morph (${framesConAmbos} de ${frames.length} frames, ${(proporcion * 100).toFixed(0)}%)`);

// Y cada letra tiene que pasar un numero de frames en opacidad intermedia:
// si no se desvanece en absoluto, se apaga de golpe.
const framesIntermedios = exiteres.map((k) => frames.filter((fr) => {
	const o = parseFloat(fr[k].opacity ?? '1');
	return o > 0.02 && o < 0.98;
}).length);
check(Math.min(...framesIntermedios) >= 10, `cada letra se desvanece a lo largo de varios frames (minimo ${Math.min(...framesIntermedios)})`);

// 3) ninguna se va por debajo de la linea
const conVertical = frames.flatMap((fr) => exiteres.map((k) => parse(fr[k].transform)))
	.filter((t) => t && t.dy !== 0);
check(conVertical.length === 0, 'mientras se van, ninguna baja de la linea');

// 4) se desplazan de verdad, y no se apilan.
//
// Para el apilamiento hay que comparar el punto de LLEGADA de cada una, no su
// primer desplazamiento: a mitad del vuelo todas están en posiciones distintas
// aunque varias vayan a acabar en el mismo sitio.
const recorridos = exiteres.map((k) => {
	let maximo = 0;
	for (const fr of frames) {
		const t = parse(fr[k].transform);
		if (t) maximo = Math.max(maximo, Math.abs(t.dx));
	}
	return maximo;
}).filter((v) => v > 0);

check(recorridos.length > 0, `las que estaban dentro se desplazan de verdad (${recorridos.length} con recorrido)`);

// El apilamiento se mide en x ABSOLUTA, no en desplazamiento: dos letras con
// destinos distintos salen de sitios distintos, asi que sus desplazamientos
// difieren aunque las dos acaben apiladas.
//
// Y se mide con tolerancia, no por igualdad exacta. El ultimo frame escrito de
// cada letra no es su punto de llegada sino un instante antes, y como cada una
// arranca en un momento distinto (el peldaño de la onda), los valores caen en
// décimas diferentes. Dos letras de verdad apiladas acabarian a menos de 1px;
// dos que van a sitios distintos distan al menos OUT_SPREAD (11px). El umbral
// se queda entre esos dos.
const UMBRAL = 3;
const leftDe = (k) => parseFloat(/left:\s*([-\d.]+)px/.exec(vuelo.slots[k].style.left ?? '')?.[1] ?? '0');

const llegadas = exiteres.map((k) => {
	let maximo = 0;
	for (const fr of frames) {
		const t = parse(fr[k].transform);
		if (t && Math.abs(t.dx) > Math.abs(maximo)) maximo = t.dx;
	}
	return leftDe(k) + maximo;
}).filter((v) => Math.abs(v - leftDe(0)) > 0.5);

let apiladas = 0;
for (let i = 0; i < llegadas.length; i++) {
	for (let j = i + 1; j < llegadas.length; j++) {
		if (Math.abs(llegadas[i] - llegadas[j]) < UMBRAL) apiladas++;
	}
}
check(apiladas === 0, `ninguna aterriza sobre otra${apiladas ? ` (${apiladas} pares a menos de ${UMBRAL}px: ${llegadas.map((v) => v.toFixed(1)).join(', ')})` : ` (${llegadas.length} salidas distintas)`}`);

const opacidades = frames.flatMap((fr) => exiteres.map((k) => parseFloat(fr[k].opacity ?? '1')))
	.filter((o) => !Number.isNaN(o));
check(opacidades.every((o) => o >= 0 && o <= 1), 'las opacidades se quedan en 0..1');

// --- reduced motion -------------------------------------------------------
// --- reduced motion -------------------------------------------------------
const rm = escenario({ reduce: true, semilla: 20260403 });
rm.avanzar();
const salRm = rm.slots.filter((s) => s.dataset.char === '' && s.style.opacity !== undefined);
check(salRm.length > 10, `con reduced-motion también se vacían las casillas (${salRm.length})`);
check(salRm.every((s) => s.style.opacity === '0'), 'con reduced-motion se apagan de golpe, sin quedar a medias');
check(salRm.every((s) => !parse(s.style.transform)?.dx), 'con reduced-motion nadie se desplaza');
const conCharRm = rm.slots.filter((s) => s.dataset.char);
check(conCharRm.every((s) => s.style.opacity === '1'), 'con reduced-motion las que llegan son visibles');

ok.forEach((m) => console.log('PASA  ' + m));
mal.forEach((m) => console.log('FALLA ' + m));
console.log(mal.length ? `\n${mal.length} FALLOS` : '\nTODO OK');
process.exit(mal.length ? 1 : 0);