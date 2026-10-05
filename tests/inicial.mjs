// Comprueba el estado inicial: las casillas se pintan en el servidor sin
// data-char, asi que el primer morph no puede emparejar ni saber que se van.
import fs from 'node:fs';
import path from 'node:path';
import { distHtml } from './_raiz.mjs';

const html = fs.readFileSync(path.join(distHtml, 'es/index.html'), 'utf8');
const m = /<span id="nav-label"[^>]*>(.*?)<\/span><\/span>/s.exec(html);
const inner = m ? m[1] : '';
const slots = [...inner.matchAll(/<span class="nav-slot"(?: data-char="([^"]*)")?>(.*?)<\/span>/gs)].map((x) => ({ texto: x[2], char: x[1] }));

const NOMBRE = 'Neftalí Domínguez';
const ROL = 'Desarrollador Full Stack Junior';

console.log('casillas pintadas por el servidor:', slots.length);
console.log('con texto                        :', slots.filter((s) => s.texto.length > 0).length);
console.log('con data-char en el markup      :', /data-char/.test(inner));

// El matching real compara slots[i].dataset.char === char.
// Con dataset.char undefined en las 32, no hay ni una sola coincidencia.
const datasetChar = slots.map((s) => (s.char === undefined ? undefined : s.char));
const taken = new Set();
const assign = new Array([...ROL].length).fill(-1);
[...ROL].forEach((char, j) => {
  for (let i = 0; i < slots.length && assign[j] === -1; i++) {
    if (!taken.has(i) && datasetChar[i] === char) { assign[j] = i; taken.add(i); }
  }
});
const reutilizadas = assign.filter((a) => a !== -1).length;
console.log('');
console.log('PRIMER morph (nombre -> rol)');
console.log('  reutilizadas :', reutilizadas, reutilizadas === 0 ? ' <-- ninguna viaja' : '');
console.log('  nacen        :', [...ROL].length - reutilizadas);
const conChar = slots.filter((s) => s.char !== undefined && s.char !== '');
const seVan = conChar.length - reutilizadas;
console.log('  se van       :', seVan, seVan > 0 ? '(ahora sí se marcan is-out)' : '(nadie se marca: ninguna sale)');

const ok = reutilizadas > 0 && seVan > 0;
console.log(ok ? '\nPASA  el primer morph reutiliza letras y marca las que se van' : '\nFALLA  el primer morph no reutiliza letras o no marca ninguna salida');
process.exit(ok ? 0 : 1);