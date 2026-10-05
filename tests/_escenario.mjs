import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { dist } from './_raiz.mjs'; // RAIZ/NAV_BUNDLE los lee el helper
const file = fs.readdirSync(dist).find((f) => f.startsWith('Nav'));
const src = fs.readFileSync(path.join(dist, file), 'utf8');
if (process.env.NAV_BUNDLE) console.log(`bundle: ${dist}/${file}`);

const NOMBRE = 'Desarrollador Full Stack Junior';

/**
 * Semilla para Math.random del bundle: los retardos de nacimiento de las
 * letras usan `Math.random`, y sin fijarlo dos ejecuciones del mismo test dan
 * medidas distintas. Con semilla, si algo pasa de pasar a fallar es por el
 * código y no por la suerte.
 */
const pseudoaleatorio = (semilla) => {
	let s = semilla >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 4294967296;
	};
};

function escenario({ reduce, texto = NOMBRE, semilla = 0 }) {
	const crearEl = (t, attrs = {}, contenido = '') => ({
		tagName: t.toUpperCase(),
		dataset: { ...attrs },
		style: {},
		classList: {
			_c: new Set(),
			add(c) { this._c.add(c); },
			remove(c) { this._c.delete(c); },
			contains(c) { return this._c.has(c); },
		},
		children: [],
		_text: contenido,
		get textContent() {
			return this.children.length ? this.children.map((c) => c.textContent).join('') : this._text;
		},
		set textContent(v) { this._text = v; this.children = []; },
		getBoundingClientRect: () => ({ top: 0, bottom: 24, left: 0, right: 260, width: 260, height: 24, x: 0, y: 0 }),
		appendChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); this.children.push(c); return c; },
		querySelectorAll: () => [],
		querySelector: () => null,
		addEventListener: () => {},
		setAttribute(k, v) { this[k] = v; },
		getAttribute(k) { return this[k]; },
	});

	const letras = [...texto];
	const slots = Array.from({ length: 32 }, (_, i) => {
		const el = crearEl('span', i < letras.length ? { char: letras[i] } : {}, i < letras.length ? letras[i] : '');
		return el;
	});
	// Estado inicial: distingue las casillas que se van (tenian letra) de las
	// que ya estaban vacías y nunca participan en nada.
	const charInicial = slots.map((s) => s.dataset.char ?? '');
	const label = crearEl('span', { nombre: texto });
	label.children = [...slots];
	label.querySelectorAll = () => slots;
	label.getBoundingClientRect = () => ({ top: 0, bottom: 24, left: 0, right: 260, width: 260, height: 24, x: 0, y: 0 });

	let reloj = 0;
	const win = {
		innerHeight: 773,
		innerWidth: 1280,
		scrollY: 1500,
		location: { search: '' },
		matchMedia: (q) => ({ matches: reduce && String(q).includes('reduced-motion'), addEventListener() {}, addListener() {} }),
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
		setTimeout(fn) { (win._timers ??= []).push(fn); return 1; },
		clearTimeout() {},
		requestAnimationFrame(fn) { (win._raf ??= []).push(fn); return (win._raf ?? []).length; },
		cancelAnimationFrame() {},
		performance: { now: () => reloj },
		getComputedStyle: () => ({ fontSize: '14px' }),
		document: {
		  querySelector: (sel) => (win.document.querySelectorAll(sel)[0] ?? null),
			documentElement: { classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, style: {} },
			body: {},
			fonts: { status: 'loaded', ready: Promise.resolve() },
			getElementById: (id) => (id === 'nav-label' ? label : null),
			createElement: crearEl,
			querySelectorAll: (sel) => {
				if (sel.includes('nav-slot')) return slots;
				if (sel.includes('data-nav-label')) return [markedEl];
				return [];
			},
			addEventListener() {},
		},
	};
	const markedEl = crearEl('p', { navLabel: 'RecipeNode' });
	// Colocada dentro de la franja de adopción (barra + PEGADA). Si estuviera
	// a media pantalla el código la descartaría y el morph no arrancaría
	// nunca, que es exactamente lo que le pasó a estos tests al cambiar la regla.
	markedEl.getBoundingClientRect = () => ({ top: 60, bottom: 96, left: 0, right: 100, width: 100, height: 36, x: 0, y: 60 });
	win.window = win;
	win.globalThis = win;

	const ctx = vm.createContext(win);
	for (const k of ['document', 'matchMedia', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'performance', 'getComputedStyle', 'location']) ctx[k] = win[k];
	ctx.IntersectionObserver = function () { this.observe = () => {}; this.unobserve = () => {}; };

	// Math.random vive en el realm del vm, no en el objeto del sandbox, así que
	// no se puede tocar desde fuera: se inyecta como global y se asigna dentro.
	if (semilla) {
		win.__semilla = pseudoaleatorio(semilla);
		vm.runInContext('Math.random = __semilla;', ctx);
	}

	vm.runInContext(src, ctx, { filename: file });
	if (win._ev?.scroll) win._ev.scroll();
	(win._timers ??= []).forEach((fn) => fn());

	const paso = () => {
		const cola = win._raf ?? [];
		if (!cola.length) return null;
		win._raf = [];
		reloj += 16.7;
		cola.forEach((fn) => fn(reloj));
		return slots.map((s) => ({
			char: s.dataset.char,
			transform: s.style.transform ?? '',
			opacity: s.style.opacity,
		}));
	};
	const avanzar = (pasos = 400) => {
		let f = 0;
		while ((win._raf ?? []).length && f < pasos) { paso(); f++; }
		return f;
	};
	return { slots, avanzar, paso, win, charInicial };
}

export { escenario, file, src, dist, NOMBRE };
