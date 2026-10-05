// Conduce el BUCLE REAL del nav (bundle de dist) con un reloj controlado y
// comprueba tres cosas sobre el codigo que de verdad se ejecuta:
//   1. continuidad: ningun salto grande de dx ni de escala entre frames
//   2. cierre: todas las letras terminan en dx 0, escala 1 y opacidad 1
//   3. rendimiento: cuantas escrituras de transform se hacen por frame
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { dist } from './_raiz.mjs';
const file = fs.readdirSync(dist).find((f) => f.startsWith('Nav'));
const src = fs.readFileSync(path.join(dist, file), 'utf8');

let escrituras = 0;
const crearEl = (etiqueta, attrs = {}, texto = '') => {
  const el = {
    tagName: etiqueta.toUpperCase(),
    dataset: { ...attrs },
    style: new Proxy({}, {
      set(o, k, v) { if (k === 'transform') escrituras++; o[k] = v; return true; },
    }),
    classList: { _c: new Set(), add(c) { this._c.add(c); }, remove(c) { this._c.delete(c); }, contains(c) { return this._c.has(c); } },
    children: [],
    _text: texto,
    get textContent() { return this.children.length ? this.children.map((c) => c.textContent).join('') : this._text; },
    set textContent(v) { this._text = v; },
    getBoundingClientRect: () => ({ top: 0, bottom: 24, left: 0, right: 132, width: 132, height: 24, x: 0, y: 0 }),
    appendChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); this.children.push(c); return c; },
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: (ev, fn) => { (el._ev ??= {})[ev] = fn; },
    setAttribute(k, v) { el[k] = v; },
    getAttribute(k) { return el[k]; },
  };
  return el;
};

const NOMBRE = 'Neftalí Domínguez';
const slots = Array.from({ length: 32 }, (_, i) => crearEl('span', {}, i < [...NOMBRE].length ? [...NOMBRE][i] : ''));
const label = crearEl('span', { nombre: NOMBRE });
label.children = slots;
label.querySelectorAll = () => slots;
label.getBoundingClientRect = () => ({ top: 0, bottom: 24, left: 0, right: 132, width: 132, height: 24, x: 0, y: 0 });

// Medidor: devuelve la x de cada letra del texto pedido, medido con una
// fuente de 10px por caracter. El nav usa el ancho real del medidor.
const medir = (texto) => [...texto].map((_, i) => i * 10);

let reloj = 0;
const win = {
  innerHeight: 773, innerWidth: 1280, scrollY: 0,
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
  setTimeout(fn) { (win._timers ??= []).push(fn); return (win._timers || []).length; },
  clearTimeout() {},
  requestAnimationFrame(fn) { (win._raf ??= []).push(fn); return (win._raf || []).length; },
  cancelAnimationFrame() {},
  performance: { now: () => reloj },
  getComputedStyle: () => ({ fontSize: '14px' }),
  document: {
    querySelector: (sel) => (win.document.querySelectorAll(sel)[0] ?? null),
    documentElement: { classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, style: {} },
    body: {}, fonts: { status: 'loaded', ready: Promise.resolve() },
    getElementById: (id) => (id === 'nav-label' ? label : null),
    createElement: (t) => crearEl(t),
    querySelectorAll: (sel) => {
      if (sel.includes('nav-slot')) return slots;
      if (sel.includes('data-nav-label')) return [crearEl('p', { navLabel: 'Desarrollador Full Stack Junior' })];
      return [];
    },
    addEventListener() {},
  },
};
win.window = win; win.globalThis = win;
label.getBoundingClientRect = () => ({ top: 0, bottom: 24, left: 0, right: 140, width: 140, height: 24, x: 0, y: 0 });

const ctx = vm.createContext(win);
for (const k of ['document', 'matchMedia', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'performance', 'getComputedStyle']) ctx[k] = win[k];
ctx.IntersectionObserver = function () { this.observe = () => {}; this.unobserve = () => {}; };

vm.runInContext(src, ctx, { filename: file });

// Dispara el morph al rol largo
if (win._ev?.scroll) { win.scrollY = 1500; win._ev.scroll(); }
(win._timers ?? []).forEach((fn) => fn());

// Corre el bucle con un reloj de 16.7ms, capturando el estado en cada frame
const parse = (s) => {
  // paint escribe translate3d(dx,0,0) scale(s) y settle escribe
  // translate3d(0px,0,0) a secas. Hay que cubrir los dos o el estado final
  // parsea como null y las comprobaciones pasan sin comprobar nada.
  const m = /translate3d\(([-\d.]+)px, 0, 0\)(?: scale\(([-\d.]+)\))?/.exec(s || '');
  return m ? { dx: parseFloat(m[1]), scale: m[2] === undefined ? 1 : parseFloat(m[2]) } : null;
};
const estados = [];
let frames = 0;
while ((win._raf ?? []).length && frames < 400) {
  const cola = win._raf;
  win._raf = [];
  reloj += 16.7;
  const antes = escrituras;
  cola.forEach((fn) => fn(reloj));
  estados.push({
    t: reloj,
    escrituras: escrituras - antes,
    letras: slots.map((s) => ({ ...parse(s.style.transform), op: s.style.opacity, out: s.classList.contains('is-out') })),
  });
  frames++;
}

const ok = [];
const mal = [];
const check = (pass, msg) => (pass ? ok : mal).push(msg);

// 1. Continuidad entre frames consecutivos
let peorDx = 0, peorEscala = 0;
for (let i = 1; i < estados.length; i++) {
  for (let k = 0; k < estados[i].letras.length; k++) {
    const a = estados[i - 1].letras[k], b = estados[i].letras[k];
    if (!a || !b || a.dx === undefined || b.dx === undefined) continue;
    peorDx = Math.max(peorDx, Math.abs(b.dx - a.dx));
    peorEscala = Math.max(peorEscala, Math.abs(b.scale - a.scale));
  }
}
check(peorDx < 30, `sin saltos de posicion (peor paso ${peorDx.toFixed(2)}px)`);
check(peorEscala < 0.09, `sin saltos de escala (peor paso ${peorEscala.toFixed(4)})`);

// 2. Cierre: todo en su sitio y visible
const fin = estados[estados.length - 1].letras;
const vivos = fin.filter((l) => l.dx !== undefined);
check(vivos.every((l) => Math.abs(l.dx) < 0.01), `todas las letras en su sitio (max dx ${Math.max(...vivos.map((l) => Math.abs(l.dx))).toFixed(3)}px)`);
check(vivos.every((l) => Math.abs(l.scale - 1) < 0.001), `escala final 1 en todas (max ${Math.max(...vivos.map((l) => Math.abs(l.scale - 1))).toFixed(6)})`);
const bajas = fin.filter((l) => l.op !== '1');
console.log('  detalle: ' + JSON.stringify(bajas.map((l) => ({ dx: l.dx, op: l.op, out: l.out }))));
check(bajas.every((l) => l.out || l.op === undefined), `las que no llegan a opacidad 1 son las que se van o nunca se usaron (${bajas.length})`);
check(fin.every((l) => !l.out), 'ninguna letra queda en is-out');

// 3. Las recién nacidas se ven (el bug de fonts.ready)
const nacidas = estados[estados.length - 1].letras.filter((l) => l.op !== undefined && l.op === '1').length;
check(nacidas > 0, `las letras nacidas llegan a opacidad 1 (${nacidas})`);

// 4. Rendimiento: escrituras por frame una vez asentado todo
const ultimos = estados.slice(-8);
const media = ultimos.reduce((s, e) => s + e.escrituras, 0) / ultimos.length;
check(media < 31, `tras asentar ya no se reescribe todo (media ${media.toFixed(1)} escrituras/frame de 31 letras)`);

ok.forEach((m) => console.log('PASA  ' + m));
mal.forEach((m) => console.log('FALLA ' + m));
console.log(`\nframes=${frames} escrituras totales=${escrituras}`);
console.log(mal.length ? `\n${mal.length} FALLOS` : '\nTODO OK');
process.exit(mal.length ? 1 : 0);