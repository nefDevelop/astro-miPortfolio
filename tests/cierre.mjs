import { assign, makeMovers, paint, mournersFor, popScale, totalFor, clamp01 } from './physics.mjs';

const W = { N:10,e:7.6,f:4.4,t:4.6,a:7.4,l:3.4,í:3.4,D:10,o:7.8,m:12,n:7.8,g:7.8,u:7.8,z:6.6,R:8.6,c:6.8,i:3.4,p:7.8,d:7.8,' ':4,S:8.4 };
const measure = (t) => { const s=[]; let x=0; for (const ch of t){ const w=W[ch]??7.5; s.push({x,y:0}); x+=w; } return {spots:s,width:x}; };

function simular(desde, hasta, seed) {
  let a = seed;
  const rnd = () => { a|=0; a=(a+0x6d2b79f5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; };
  const o = measure(desde).spots;
  const pool = Array.from({length:32},()=>''); [...desde].forEach((c,i)=>pool[i]=c);
  const d = measure(hasta);
  const { assign: plan, newborn } = assign([...hasta], pool.slice());
  const movers = makeMovers(plan, newborn, d.spots, o, rnd);
  const leaving = pool.map((c,i)=>({c,i})).filter(x=>x.c && !plan.includes(x.i)).map(x=>x.i);
  const mo = mournersFor(movers, leaving, o);
  const total = totalFor(movers);

  // Serie a 60fps del estado visual de cada letra
  const frames = [];
  for (let t = 0; t <= total + 100; t += 1000/60) {
    const at = paint(movers, mo, t);
    const sc = movers.map((m, k) => m.scale(clamp01((t - m.delay) / m.dur)));
    frames.push({ t, x: at, s: sc });
  }
  return { movers, mo, total, frames };
}

const TRANSICIONES = [
  ['Neftalí Domínguez', 'Desarrollador Full Stack Junior'],
  ['Desarrollador Full Stack Junior', 'RecipeNode'],
  ['RecipeNode', 'reGIO'],
  ['reGIO', 'Sobre mí'],
  ['Sobre mí', 'Trayectoria'],
  ['Trayectoria', 'Contacto'],
];

let fallos = 0;
const check = (n, ok, d='') => { console.log(`${ok?'PASA ':'FALLA'}  ${n}${d?'  -> '+d:''}`); if(!ok) fallos++; };

console.log('=== Continuidad del cierre (60fps) ===\n');
for (const [desde, hasta] of TRANSICIONES) {
  const { movers, total, frames } = simular(desde, hasta, 42);
  const ult = frames[frames.length - 1];

  // 1. Salto de posicion en el ultimo frame
  let maxDx = 0;
  for (let k = 0; k < movers.length; k++) maxDx = Math.max(maxDx, Math.abs(ult.x[k] - movers[k].to));

  // 2. Salto de escala en el ultimo frame
  let maxDs = 0;
  for (let k = 0; k < movers.length; k++) maxDs = Math.max(maxDs, Math.abs(ult.s[k] - 1));

  // 3. Salto entre los dos ultimos frames (continuidad)
  const pen = frames[frames.length - 2];
  let maxStep = 0;
  for (let k = 0; k < movers.length; k++) {
    maxStep = Math.max(maxStep, Math.abs(ult.x[k] - pen.x[k]), Math.abs(ult.s[k] - pen.s[k]) * 20);
  }

  const bien = maxDx < 0.6 && maxDs < 1e-6 && maxStep < 1.2;
  check(`${desde.slice(0,14).padEnd(14)} -> ${hasta.slice(0,14).padEnd(14)}`, bien,
    `dx ${maxDx.toFixed(2)}px  escala ${maxDs.toFixed(6)}  paso ${maxStep.toFixed(2)}  total ${total.toFixed(0)}ms`);
}

console.log();
console.log(fallos === 0 ? 'TODO OK: el cierre es continuo' : `${fallos} FALLOS`);
process.exit(fallos === 0 ? 0 : 1);
