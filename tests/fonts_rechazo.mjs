// Comprueba el cambio 1: si document.fonts.ready RECHAZA, el morph debe
// arrancar igualmente. Antes del cambio, el rechazo dejaba las letras nuevas
// en opacidad 0 para siempre.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { dist } from './_raiz.mjs';
const file = fs.readdirSync(dist).find((f) => f.startsWith('Nav'));
const crudo = fs.readFileSync(path.join(dist, file), 'utf8');
// El bundle esta minificado (run pasa a ser I), asi que el control negativo
// se hace sobre el patron .then(X,X) -> .then(X), no sobre los nombres.
const src = process.env.VIEJO ? crudo.replace(/\.then\(([A-Za-z_$][\w$]*),\s*\1\)/, '.then($1)') : crudo;
if (process.env.VIEJO && src === crudo) { console.error('AVISO: el control negativo NO se aplico, el bundle no contiene .then(X,X)'); process.exit(2); }

function escenario(rechaza) {
  const crearEl = (etiqueta, attrs = {}, texto = '') => ({
    tagName: etiqueta.toUpperCase(),
    dataset: { ...attrs },
    style: {},
    classList: { _c: new Set(), add(c) { this._c.add(c); }, remove(c) { this._c.delete(c); }, contains(c) { return this._c.has(c); } },
    children: [],
    _text: texto,
    get textContent() { return this.children.length ? this.children.map((c) => c.textContent).join('') : this._text; },
    set textContent(v) { this._text = v; },
    getBoundingClientRect: () => ({ top: 0, bottom: 24, left: 0, right: 132, width: 132, height: 24, x: 0, y: 0 }),
    appendChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); this.children.push(c); return c; },
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {},
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k]; },
  });

  const NOMBRE = 'Neftalí Domínguez';
  const letras = [...NOMBRE];
  const slots = Array.from({ length: 32 }, (_, i) => crearEl('span', {}, i < letras.length ? letras[i] : ''));
  const label = crearEl('span', { nombre: NOMBRE });
  label.children = slots;
  label.querySelectorAll = () => slots;
  label.getBoundingClientRect = () => ({ top: 0, bottom: 24, left: 0, right: 140, width: 140, height: 24, x: 0, y: 0 });

  let reloj = 0;
  const win = {
    innerHeight: 773,
    innerWidth: 1280,
    scrollY: 1500,
    matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
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
      // aqui esta la diferencia entre los dos escenarios
      fonts: rechaza
        ? { status: 'loading', ready: Promise.reject(new Error('fallo de red al cargar la fuente')) }
        : { status: 'loaded', ready: Promise.resolve() },
      getElementById: (id) => (id === 'nav-label' ? label : null),
      createElement: crearEl,
      querySelectorAll: (sel) => {
        if (sel.includes('nav-slot')) return slots;
        if (sel.includes('data-nav-label')) return [crearEl('p', { navLabel: 'Desarrollador Full Stack Junior' })];
        return [];
      },
      addEventListener() {},
    },
  };
  win.window = win;
  win.globalThis = win;

  const ctx = vm.createContext(win);
  for (const k of ['document', 'matchMedia', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'performance', 'getComputedStyle']) ctx[k] = win[k];
  ctx.IntersectionObserver = function () { this.observe = () => {}; this.unobserve = () => {}; };

  vm.runInContext(src, ctx, { filename: file });
  if (win._ev?.scroll) win._ev.scroll();
  (win._timers ??= []).forEach((fn) => fn());

  const pendientes = () => (win._raf ?? []).length;
  const avanzar = (pasos = 400) => {
    let f = 0;
    while ((win._raf ?? []).length && f < pasos) {
      const cola = win._raf;
      win._raf = [];
      reloj += 16.7;
      f++;
      cola.forEach((fn) => fn(reloj));
    }
    return f;
  };
  return { slots, pendientes, avanzar };
}

// Sin manejador de rechazo, el bundle viejo deja un rechazo sin capturar: en el
// navegador eso es un error en consola y el morph no arranca. Se absorbe para
// que el test lo verifique en vez de morir.
process.on('unhandledRejection', () => {});

// fonts.ready es una promesa: run() queda en un microtask, asi que hay que
// drenarlos antes de mirar si el morph arranco.
const drenar = () => new Promise((r) => setImmediate(r));

const mal = [];
for (const rechaza of [false, true]) {
  const nombre = rechaza ? 'fonts.ready RECHAZA' : 'fonts.ready resuelve';
  const { slots, pendientes, avanzar } = escenario(rechaza);
  await drenar();
  const arranca = pendientes();

  if (arranca === 0) {
    mal.push(nombre);
    console.log(`FALLA  ${nombre}: el morph no arranco, las letras nuevas se quedarian en opacidad 0`);
    continue;
  }
  const f = avanzar();
  const visibles = slots.filter((s) => s.style.opacity === '1').length;
  console.log(`PASA  ${nombre}: arranco, ${f} frames, ${visibles} letras visibles`);
}

console.log(mal.length ? `\n${mal.length} FALLOS` : '\nTODO OK');
process.exit(mal.length ? 1 : 0);