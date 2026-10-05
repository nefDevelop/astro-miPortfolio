// Comprueba la recogida de la etiqueta en la barra: la copia de la página se
// atenúa al subir y desaparece antes de entrar, de modo que el header y la
// página nunca muestran el mismo texto pegados.
//
// Se ejecuta sobre el BUNDLE REAL, con las rectangulares controladas. El caso
// que da nombre a esto: a~80 px por debajo de la barra el texto seguía visible
// y se leían las dos copias seguidas.
//
// Comprueba además que el fundido va en su propio requestAnimationFrame: si
// dependiera del temporizador de 90 ms quedaría a saltos.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { dist } from './_raiz.mjs'; // RAIZ/NAV_BUNDLE los lee el helper
const file = fs.readdirSync(dist).find((f) => f.startsWith('Nav'));
const src = fs.readFileSync(path.join(dist, file), 'utf8');

const NOMBRE = 'Neftalí Domínguez';
const ETIQUETAS = ['Desarrollador Full Stack Junior', 'RecipeNode', 'reGIO', 'Sobre mí', 'Trayectoria', 'Contacto'];
const VH = 773;
const ALTO_BARRA = 64;
const COMPLETA = 200;

const ok = [];
const mal = [];
const check = (p, m) => (p ? ok : mal).push(m);

function escenario() {
	const crearEl = (t, attrs = {}, contenido = '') => ({
		tagName: t.toUpperCase(),
		dataset: { ...attrs },
		style: {},
		_text: contenido,
		_rect: { top: 9999, bottom: 10000, height: 36 },
		children: [],
		classList: { _c: new Set(), add(c) { this._c.add(c); }, remove(c) { this._c.delete(c); }, contains(c) { return this._c.has(c); } },
		get textContent() { return this.children.length ? this.children.map((c) => c.textContent).join('') : this._text; },
		set textContent(v) { this._text = v; this.children = []; },
		getBoundingClientRect() { return this._rect; },
		appendChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); this.children.push(c); return c; },
		querySelectorAll: () => [],
		querySelector: () => null,
		addEventListener: () => {},
		setAttribute(k, v) { this[k] = v; },
		getAttribute(k) { return this[k]; },
	});

	const letras = [...NOMBRE];
	const slots = Array.from({ length: 32 }, (_, i) => {
		const el = crearEl('span', i < letras.length ? { char: letras[i] } : {}, i < letras.length ? letras[i] : '');
		return el;
	});
	const label = crearEl('span', { nombre: NOMBRE });
	label.children = [...slots];
	label.querySelectorAll = () => slots;

	const cabecera = crearEl('header');
	cabecera.offsetHeight = ALTO_BARRA;

	const marcadas = ETIQUETAS.map((navLabel) => crearEl('section', { navLabel }));
	const marcadasDeclaradas = new Set(marcadas);

	let reloj = 0;
	const win = {
		innerHeight: VH,
		innerWidth: 1280,
		scrollY: 600,
		location: { search: '' },
		matchMedia: (q) => ({ matches: false, addEventListener() {}, addListener() {} }),
		addEventListener(ev, fn) {
			const caja = (win._ev ??= {});
			// Varias escuchas por evento: el nav registra scroll una vez para
			// el morph y otra para recoger la etiqueta. Con una sola, la segunda
			// machacaba a la primera y el morph dejaba de responder.
			if (!caja[ev]) {
				const cola = [];
				caja[ev] = () => cola.forEach((f) => f());
				caja[ev + '_cola'] = cola;
			}
			caja[ev + '_cola'].push(fn);
		},
		removeEventListener() {},
		setTimeout(fn) { (win._timers ??= []).push(fn); return (win._timers ?? []).length; },
		clearTimeout() {},
		requestAnimationFrame(fn) { (win._raf ??= []).push(fn); return (win._raf ?? []).length; },
		cancelAnimationFrame() {},
		performance: { now: () => reloj },
		getComputedStyle: () => ({ fontSize: '14px' }),
		document: {
			documentElement: { classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, style: {} },
			body: {},
			fonts: { status: 'loaded', ready: Promise.resolve() },
			getElementById: (id) => (id === 'nav-label' ? label : null),
			createElement: crearEl,
			querySelector: (sel) => (win.document.querySelectorAll(sel)[0] ?? null),
			querySelectorAll: (sel) => {
				if (sel.includes('nav-slot')) return slots;
				if (sel.includes('.site-header')) return [cabecera];
				if (sel.includes('data-nav-label')) return marcadas;
				return [];
			},
			addEventListener() {},
		},
	};
	win.window = win;
	win.globalThis = win;

	const ctx = vm.createContext(win);
	for (const k of ['document', 'matchMedia', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'performance', 'getComputedStyle', 'location']) ctx[k] = win[k];
	ctx.IntersectionObserver = function () { this.observe = () => {}; this.unobserve = () => {}; };

	vm.runInContext(src, ctx, { filename: file });

	// Drena el requestAnimationFrame sin tocar los temporizadores: así se ve
	// que la recogida no depende del agrupado de 90 ms.
	const pintar = () => {
		let fotogramas = 0;
		while ((win._raf ?? []).length && fotogramas < 10) {
			const cola = win._raf;
			win._raf = [];
			reloj += 16.7;
			cola.forEach((fn) => fn(reloj));
			fotogramas++;
		}
		return fotogramas;
	};

	/** Coloca todas las etiquetas a `top` del viewport y repinta. */
	const recolocar = (top) => {
		for (const el of marcadas) el._rect = { top, bottom: top + 36, height: 36 };
		win._ev.scroll();
		pintar();
	};

	/** Igual, pero solo etiqueta a `top`, dejando el resto fuera de pantalla. */
	const recolocarUna = (top) => {
		for (const el of marcadas) el._rect = { top: 9999, bottom: 10000, height: 36 };
		marcadas[0]._rect = { top, bottom: top + 36, height: 36 };
		win._ev.scroll();
		pintar();
	};

	const opacidades = () => marcadas.map((el) => el.style.opacity);

	return { marcadasDeclaradas, marcadas, win, pintar, recolocar, recolocarUna, opacidades };
}

// --- 1. Lejos de la barra: sin estilo en línea -----------------------------
// Si hubiera opacidad en línea aquí, ganaría al reveal y el titular aparecería
// antes de que se animara.
{
	const e = escenario();
	e.recolocarUna(COMPLETA + 40);
	const o = e.opacidades()[0];
	check(o === undefined || o === '',
		`a ${COMPLETA + 40}px no queda opacidad en línea, manda el reveal (valor: ${JSON.stringify(o)})`);
}

// --- 2. En el borde de la barra: se ha ido por completo --------------------
{
	const e = escenario();
	e.recolocarUna(ALTO_BARRA);
	check(e.opacidades()[0] === '0.00',
		`en el borde de la barra ya no se ve (valor: ${JSON.stringify(e.opacidades()[0])})`);
}

// --- 3. A la mitad de la franja, al 50% ------------------------------------
{
	const e = escenario();
	e.recolocarUna(ALTO_BARRA + (COMPLETA - ALTO_BARRA) / 2);
	check(e.opacidades()[0] === '0.50',
		`a la mitad de la franja está al 50% (valor: ${JSON.stringify(e.opacidades()[0])})`);
}

// --- 4. El caso que motivó esto: ~80 px bajo la barra ----------------------
// Ahí se leían el texto de la barra y el de la página seguidos.
{
	const e = escenario();
	e.recolocarUna(80);
	const o = Number(e.opacidades()[0]);
	check(o < 0.1, `a 80px bajo la barra apenas se ve: no se leen las dos copias (opacidad ${o})`);
}

// --- 5. Al alejarse se borra el estilo en línea ----------------------------
{
	const e = escenario();
	e.recolocarUna(80);
	e.recolocarUna(COMPLETA + 40);
	const o = e.opacidades()[0];
	check(o === undefined || o === '',
		`al alejarse se borra el estilo para no pisar al reveal (valor: ${JSON.stringify(o)})`);
}

// --- 6. No depende del temporizador de 90 ms -------------------------------
// El morph se agrupa con setTimeout; la recogida va en su propio rAF. Se
// dispara el scroll, solo se pintan fotogramas, y la opacidad ya está aunque
// los temporizadores del morph sigan pendientes.
{
	const e = escenario();
	for (const el of e.marcadas) el._rect = { top: 80, bottom: 116, height: 36 };
	e.win._ev.scroll();
	e.pintar();
	const o = Number(e.opacidades()[0]);
	const timersPendientes = (e.win._timers ?? []).length;
	check(o < 0.1, `la opacidad cambia sin esperar a ningún temporizador (valor ${o})`);
	check(timersPendientes > 0,
		`los temporizadores del morph siguen pendientes, luego no han intervenido (${timersPendientes})`);
}

// --- 7. Se atenúan todas, no solo la del hero ------------------------------
{
	const e = escenario();
	e.recolocar(80);
	const atenuadas = e.opacidades().filter((v) => v !== undefined && v !== '' && Number(v) < 0.5);
	check(atenuadas.length === e.marcadas.length,
		`se atenúan las ${e.marcadas.length} etiquetas, no solo la del hero (${atenuadas.length})`);
}

ok.forEach((m) => console.log('PASA  ' + m));
mal.forEach((m) => console.log('FALLA ' + m));
console.log(mal.length ? `\n${mal.length} FALLOS` : '\nTODO OK');
process.exit(mal.length ? 1 : 0);
