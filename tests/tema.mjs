// Comprueba el cambio de tema paulatino: que la ventana se abre, que se cierra
// sola y que no se abre al cargar.
//
// Los tres fallos que busca son distintos y ninguno se ve al mirar el CSS:
//
//   1. Si no se abre, el tema salta de golpe (estado original).
//   2. Si no se cierra, los hovers se quedan a 350 ms para siempre.
//   3. Si se abriera al cargar, la primera visita anima el tema elegido en
//      la head, que es justo lo que no se quiere.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { raiz, dist } from './_raiz.mjs';
// El CSS se lee siempre del dist real: el control solo altera el bundle JS.
const ruta = dist;
const file = fs.readdirSync(ruta).find((f) => f.startsWith('Nav'));
const src = fs.readFileSync(path.join(ruta, file), 'utf8');

const ok = [];
const mal = [];
const check = (p, m) => (p ? ok : mal).push(m);

const crearClase = (inicial = []) => {
	const c = new Set(inicial);
	return {
		add: (x) => c.add(x),
		remove: (x) => c.delete(x),
		toggle: (x, forzar) => {
			const poner = forzar === undefined ? !c.has(x) : forzar;
			poner ? c.add(x) : c.delete(x);
			return poner;
		},
		contains: (x) => c.has(x),
		rellenar: (x) => c.add(x),
		listar: () => [...c],
	};
};

function escenario() {
	const crearEl = (t, attrs = {}, contenido = '') => ({
		tagName: t.toUpperCase(),
		dataset: { ...attrs },
		style: {},
		_text: contenido,
		children: [],
		classList: crearClase(),
		get textContent() { return this.children.length ? this.children.map((c) => c.textContent).join('') : this._text; },
		set textContent(v) { this._text = v; this.children = []; },
		getBoundingClientRect: () => ({ top: 0, bottom: 24, left: 0, right: 140, width: 140, height: 24, x: 0, y: 0 }),
		appendChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); this.children.push(c); return c; },
		querySelectorAll: () => [],
		querySelector: () => null,
		addEventListener(ev, fn) { (this._ev ??= {})[ev] = fn; },
		setAttribute(k, v) { this[k] = v; },
		getAttribute(k) { return this[k]; },
	});

	const raizHtml = crearEl('html');
	const NOMBRE = 'Neftalí Domínguez';
	const letras = [...NOMBRE];
	const slots = Array.from({ length: 32 }, (_, i) => {
		const el = crearEl('span', i < letras.length ? { char: letras[i] } : {}, i < letras.length ? letras[i] : '');
		return el;
	});
	const label = crearEl('span', { nombre: NOMBRE });
	label.children = [...slots];
	label.querySelectorAll = () => slots;

	// El boton de tema tiene que existir para que el click tenga a dónde ir.
	const boton = crearEl('button');

	let reloj = 0;
	const win = {
		innerHeight: 773, innerWidth: 1280, scrollY: 600,
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
		localStorage: { _v: {}, getItem(k) { return this._v[k] ?? null; }, setItem(k, v) { this._v[k] = String(v); } },
		document: {
			documentElement: { classList: raizHtml.classList, style: {}, get className() { return raizHtml.classList.listar().join(' '); } },
			body: {},
			fonts: { status: 'loaded', ready: Promise.resolve() },
			getElementById: (id) => (id === 'nav-label' ? label : null),
			createElement: crearEl,
			querySelector: (sel) => (sel.includes('data-theme-toggle') ? boton : (win.document.querySelectorAll(sel)[0] ?? null)),
			querySelectorAll: (sel) => {
				if (sel.includes('nav-slot')) return slots;
				if (sel.includes('data-theme-toggle')) return [boton];
				if (sel.includes('data-nav-label')) return [crearEl('section', { navLabel: 'Contacto' })];
				return [];
			},
			addEventListener() {},
		},
	};
	win.window = win;
	win.globalThis = win;

	const ctx = vm.createContext(win);
	for (const k of ['document', 'matchMedia', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'performance', 'getComputedStyle', 'location', 'localStorage']) ctx[k] = win[k];
	ctx.IntersectionObserver = function () { this.observe = () => {}; this.unobserve = () => {}; };

	vm.runInContext(src, ctx, { filename: file });

	/** Drena la cola de temporizadores, que es donde está la ventana. */
	const drenar = () => {
		for (let i = 0; i < 50 && (win._timers ?? []).length; i++) {
			const cola = win._timers;
			win._timers = [];
			cola.forEach((fn) => fn());
		}
	};

	return { clases: raizHtml.classList, boton, drenar };
}

// --- 1. Al cargar no debe abrirse la ventana -------------------------------
{
	const { clases } = escenario();
	check(!clases.contains('theme-changing'), 'al cargar no se abre la ventana');
}

// --- 2. Al pulsar se abre, y se cierra sola ---------------------------------
{
	const { clases, boton, drenar } = escenario();
	const oscuraAntes = clases.contains('dark');
	boton._ev?.click?.();
	check(clases.contains('theme-changing'), 'al pulsar se abre la ventana');
	check(clases.contains('dark') !== oscuraAntes, 'la pulsacion alterna el tema');
	drenar();
	check(!clases.contains('theme-changing'), `se cierra sola tras la ventana${clases.listar().length ? ` (queda: ${clases.listar().join(' ')})` : ''}`);
	// y el tema sigue puesto, solo se retira la transicion
	check(clases.listar().join(' ') !== 'theme-changing', 'no queda la ventana marcada tras cerrar');
}

// --- 3. Pulsar dos veces seguidas no deja la ventana huerfana -------------
{
	const { clases, boton, drenar } = escenario();
	boton._ev?.click?.();
	boton._ev?.click?.();
	check(clases.contains('theme-changing'), 'dos pulsaciones seguidas mantienen la ventana abierta');
	drenar();
	check(!clases.contains('theme-changing'), 'tras cerrar no queda nada');
}

// --- 4. El CSS trae la transicion y la anula con movimiento minimo ---------
const css = fs.readdirSync(dist).filter((f) => f.endsWith('.css'))
	.map((f) => fs.readFileSync(path.join(dist, f), 'utf8')).join('\n');

const regla = /html\.theme-changing,[^}]*transition:/m.exec(css);
check(!!regla, 'el CSS declara la transición para la ventana');

const anula = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?html\.theme-changing[\s\S]*?transition:\s*none/);
check(!!anula, 'con movimiento mínimo la ventana no anima');

// --- 5. La cabeza, la que pone el tema inicial, no debe usarla -------------
const html = fs.readFileSync(path.join(raiz, 'dist/es/index.html'), 'utf8');
const cabeza = html.slice(0, html.indexOf('</head>'));
check(!cabeza.includes('theme-changing'), 'la head no abre la ventana al cargar');

ok.forEach((m) => console.log('PASA  ' + m));
mal.forEach((m) => console.log('FALLA ' + m));
console.log(mal.length ? `\n${mal.length} FALLOS` : '\nTODO OK');
process.exit(mal.length ? 1 : 0);