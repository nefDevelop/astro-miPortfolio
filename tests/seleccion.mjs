// Comprueba la selección de la etiqueta del header contra el BUNDLE REAL,
// con geometría controlada.
//
// Este test reemplaza a una copia manual de `actualizar`: si se copiara la
// lógica en el test, un cambio en el componente no lo afectaría y seguiría en
// verde sin probar nada. Aquí se dispatcha un scroll real sobre el bundle
// compilado.
//
// La regla que se comprueba: una etiqueta solo se adopta cuando ha subido
// hasta la franja pegada a la barra (barra + PEGADA). Antes se elegía la más
// cercana al centro sin más, y eso traía dos fallos: adoptaba titulares que
// apenas asomaban por abajo, y ponía el texto en la barra mientras la copia
// seguía legible en la página.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { dist } from './_raiz.mjs'; // RAIZ/NAV_BUNDLE los lee el helper
const file = fs.readdirSync(dist).find((f) => f.startsWith('Nav'));
const src = fs.readFileSync(path.join(dist, file), 'utf8');

const NOMBRE = 'Neftalí Domínguez';
const ETIQUETAS = ['Desarrollador Full Stack Junior', 'RecipeNode', 'reGIO', 'Sobre mí', 'Trayectoria', 'Contacto'];
const VH = 773;

const ok = [];
const mal = [];
const check = (p, m) => (p ? ok : mal).push(m);

/** Configura: valores en coordenadas de viewport, no del documento. */
function escenario() {
	const crearEl = (t, attrs = {}, contenido = '') => ({
		tagName: t.toUpperCase(),
		dataset: { ...attrs },
		style: {},
		_text: contenido,
		_rect: { top: 9999, bottom: 10000, height: 36 },
		children: [],
		classList: { _c: new Set(), add(c) { this._c.add(c); }, remove(c) { this._c.delete(c); }, contains(c) { return this._c.has(c); } },
		get textContent() {
			return this.children.length ? this.children.map((c) => c.textContent).join('') : this._text;
		},
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

	// Las etiquetas del scroll se crean antes de cargar el bundle: `marked` se
	// captura en la primera consulta y luego no vuelve a mirar el DOM.
	const marcadas = ETIQUETAS.map((navLabel) => crearEl('section', { navLabel }));

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

	// Drena toda la cola. Crucial: el timer de 90 ms ejecuta actualizar(), y
	// eso encola los temporizadores que vacían las casillas que se van. Un
	// forEach sobre un array vaciado a mano se come esos que llegan a mitad de
	// recorrido y el texto se queda con letras fantasma.
	const drenarTemporizadores = () => {
		for (let pasada = 0; pasada < 50 && (win._timers ?? []).length > 0; pasada++) {
			const cola = win._timers;
			win._timers = [];
			cola.forEach((fn) => fn());
		}
	};

	/** Coloca las etiquetas y fuerza un recálculo. */
	const recalcular = ({ scrollY = 600, colocar = {} }) => {
		for (const el of marcadas) {
			const top = colocar[el.dataset.navLabel];
			el._rect = top === undefined
				? { top: 9999, bottom: 10000, height: 36 }
				: { top, bottom: top + 36, height: 36 };
		}
		win.scrollY = scrollY;
		win._ev.scroll();
		drenarTemporizadores();

		// dejar que el morph termine para poder leer el texto final
		for (let i = 0; i < 120; i++) {
			const raf = win._raf ?? [];
			if (!raf.length) break;
			win._raf = [];
			reloj += 16.7;
			raf.forEach((fn) => fn(reloj));
			drenarTemporizadores();
		}
		drenarTemporizadores();
		return label.textContent;
	};

	return { recalcular, marcadas };
}

{
	// El mock no trae `.site-header`, así que el código cae en el 64 por
	// defecto, y con PEGADA = 30 la ventana de adopción es top <= 94.
	// Todo lo que se afirma aquí se afirma dentro o fuera de esa franja.
	const VENTANA = 64 + 30;
	const FUERA = VENTANA + 1;
	const PASADA = -100;

	// Un único bundle para todos los escenarios: así se mide también el
	// arrastre del estado de un recálculo a otro.
	const { recalcular } = escenario();

	// 1. Una etiqueta que ha subido hasta la franja: se adopta.
	let t = recalcular({ scrollY: 600, colocar: { RecipeNode: VENTANA } });
	check(t === 'RecipeNode', `una etiqueta pegada a la barra se adopta -> ${t}`);

	// 2. Para lo siguiente hace falta volver al estado inicial.
	t = recalcular({ scrollY: 0, colocar: {} });
	check(t === NOMBRE, `scrollY<200 manda el nombre -> ${t}`);

	// 3. Un píxel más abajo y no se adopta: es el límite exacto de la franja.
	t = recalcular({ scrollY: 600, colocar: { RecipeNode: FUERA } });
	check(t === NOMBRE,
		`1 px por debajo de la franja no se adopta, se mantiene la anterior -> ${t}`);

	// 4. Y a media pantalla, que era el caso del titular que apenas asomaba,
	//    tampoco. Ahora el cambio solo llega pegado a la barra.
	t = recalcular({ scrollY: 600, colocar: { RecipeNode: Math.round(VH * 0.89) } });
	check(t === NOMBRE, `un titular al 89% de la altura no se adopta -> ${t}`);

	// 5. Si ninguna llega a la franja pero una ya se ha pasado del todo, el
	//    header vuelve a esa. Antes devolvía sin hacer nada y se quedaba con
	//    la de abajo mientras se veía el hero otra vez.
	t = recalcular({ scrollY: 600, colocar: { Contacto: VENTANA } });
	check(t === 'Contacto', `preparación: el header queda en Contacto -> ${t}`);

	t = recalcular({
		scrollY: 400,
		colocar: { 'Desarrollador Full Stack Junior': PASADA, Contacto: Math.round(VH * 0.8) },
	});
	check(t === 'Desarrollador Full Stack Junior',
		`sin nada en la franja se vuelve a la que ya pasó -> ${t}`);

	// 6. Y si no hay nada en la franja ni nada pasado, no se toca nada.
	t = recalcular({ scrollY: 600, colocar: { Contacto: VENTANA } });
	check(t === 'Contacto', `preparación: el header queda en Contacto -> ${t}`);
	t = recalcular({ scrollY: 600, colocar: {} });
	check(t === 'Contacto',
		`si no pasa ninguna y ninguna llega a la franja, no se toca -> ${t}`);

	// 7. Dos etiquetas a la vez en la franja no puede pasar: la más cercana al
	//    centro de las candidatas es la que gana, pero solo puede haber una.
	t = recalcular({ scrollY: 600, colocar: { RecipeNode: VENTANA, reGIO: PASADA } });
	check(t === 'RecipeNode',
		`la única que está en la franja es la que manda -> ${t}`);
}

ok.forEach((m) => console.log('PASA  ' + m));
mal.forEach((m) => console.log('FALLA ' + m));
console.log(mal.length ? `\n${mal.length} FALLOS` : '\nTODO OK');
process.exit(mal.length ? 1 : 0);