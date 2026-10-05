import { assign, makeMovers, paint, mournersFor, bezier, clamp01, DRAG } from './physics.mjs';

let fallos = 0;
const check = (nombre, ok, detalle = '') => {
  console.log(`${ok ? 'PASA' : 'FALLA'}  ${nombre}${detalle ? '  -> ' + detalle : ''}`);
  if (!ok) fallos++;
};

// Geometría de "Neftalí Domínguez" -> "RecipeNode" con una fuente proporcional
// aproximada: anchos por glifo en px a 14px.
const W = { N: 10, e: 7.6, f: 4.4, t: 4.6, a: 7.4, l: 3.4, í: 3.4, D: 10, o: 7.8, m: 12, n: 7.8, g: 7.8, u: 7.8, z: 6.6, R: 8.6, c: 6.8, i: 3.4, p: 7.8, d: 7.8 };
const measure = (text) => {
  const spots = [];
  let x = 0;
  for (const ch of text) {
    const w = ch === ' ' ? 4 : W[ch] ?? 7.5;
    spots.push({ x, y: 0 });
    x += w;
  }
  return { spots, width: x };
};

const origenTexto = 'Neftalí Domínguez';
const destinoTexto = 'RecipeNode';
const pool = Array.from({ length: 32 }, () => '');
[...origenTexto].forEach((c, i) => (pool[i] = c));
const origin = measure(origenTexto).spots;

const destino = measure(destinoTexto);
const { assign: plan, newborn } = assign([...destinoTexto], pool.slice());
const movers = makeMovers(plan, newborn, destino.spots, origin, mulberry(7));
const leaving = pool.map((c, i) => ({ c, i })).filter((x) => x.c && !plan.includes(x.i)).map((x) => x.i);
const mourners = mournersFor(movers, leaving, origin);

// 1. Toda letra que se mueve acaba exactamente en su sitio
const total = TRAVELmax();
const at = paint(movers, mourners, total);
const errores = movers.map((m, k) => Math.abs(at[k] - m.to));
check('todas las letras se asientan en su posicion', errores.every((e) => e < 0.5), `max error ${Math.max(...errores).toFixed(3)}px`);

// 2. Las curvas son distintas entre sí: no hay un único easing compartido
const desplazadas = movers.filter((m) => !m.fresh);
const finales = desplazadas.map((m) => m.ease(0.5).toFixed(4));
check('cada letra que se desplaza tiene su propia curva', new Set(finales).size === desplazadas.length, `${new Set(finales).size} curvas distintas de ${desplazadas.length} desplazadas (las ${freshCount(movers)} nacidas comparten la del pop a proposito)`);

function freshCount(ms) { return ms.filter((m) => m.fresh).length; }

// 3. El pop de las recién nacidas se pasa de su sitio y luego vuelve
const fresh = movers.filter((m) => m.fresh);
const overshoot = fresh.map((m, idx) => {
  const k = movers.indexOf(m);
  let max = -Infinity;
  for (let t = 0; t <= TRAVELmax(); t += 8) {
    const v = paint(movers, mourners, t)[k] - m.to;
    if (v > max) max = v;
  }
  return max;
});
check('las recién nacidas se pasan de su sitio', overshoot.length > 0 && overshoot.every((o) => o > 1), `max ${Math.max(...overshoot).toFixed(1)}px`);

// 4. El pop empuja a las vecinas
let maxShove = 0;
for (let t = 0; t <= TRAVELmax(); t += 8) {
  const conPush = paint(movers, mourners, t);
  const sinPush = movers.map((m, k) => {
    const p = clamp01((t - m.delay) / m.dur);
    return m.from + (m.to - m.from) * m.ease(p);
  });
  movers.forEach((m, k) => { if (!m.fresh) maxShove = Math.max(maxShove, Math.abs(conPush[k] - sinPush[k])); });
}
check('el pop desplaza a las letras vecinas', maxShove > 1, `desplazamiento max ${maxShove.toFixed(1)}px`);

// 5. La letra vecina a la que se va sale con ella (peso) y luego se suelta
const conPeso = mourners.filter((m) => m.mourner >= 0);
check('hay vecinas que se van con peso', conPeso.length > 0, `${conPeso.length} vecinas`);
if (conPeso.length) {
  const k = movers.findIndex((m) => m.slot === conPeso[0].mourner);
  const inicio = paint(movers, mourners, 60)[k] - movers[k].to;
  const final = paint(movers, mourners, TRAVELmax())[k] - movers[k].to;
  // El arrastre se mide aislado por letra: el max global mezcla el peso con el
// pop de las recién nacidas, que es otro efecto y va por otro camino.
const TIEMPOS = [0, 100, 200, 300, 400, 500, 560, 700];
const porLetra = conPeso.map((mo) => {
  const kk = movers.findIndex((m) => m.slot === mo.mourner);
  return TIEMPOS.map((t) => {
    const conGente = paint(movers, mourners, t)[kk];
    const base = paint(
      movers.map((m) => (m.fresh ? { ...m, ease: () => 1 } : m)),
      [],
      t
    )[kk];
    return Math.abs(conGente - base);
  });
});
  const peso = porLetra[0];
  // Se mira el tramo en el que la propia letra ya casi ha llegado: el peso tiene
  // que aflojarse de forma monótona hasta cero.
  const cola = porLetra.map((serie) => serie.slice(3, 7));
  const decrece = cola.every((serie) => serie.every((v, i) => i === 0 || v <= serie[i - 1] + 0.01));
check('el peso se suelta progresivamente', decrece, `letra 0: ${peso.map((v) => v.toFixed(0)).join(' > ')}`);
}

// 6. Ninguna letra se sale de la caja del texto durante el viaje
const caja = destino.width + 26;
let maxX = 0, minX = 0;
for (let t = 0; t <= TRAVELmax(); t += 8) {
  paint(movers, mourners, t).forEach((x) => { maxX = Math.max(maxX, x); minX = Math.min(minX, x); });
}
check('ninguna letra se sale de la caja', minX > -26 && maxX < caja, `x entre ${minX.toFixed(0)} y ${maxX.toFixed(0)}, caja ${caja.toFixed(0)}`);

// 7. bezier(0.18,1.55,0.4,1) realmente sobrepasa 1 (es lo que hace el pop)
const pop = bezier(0.18, 1.55, 0.4, 1);
let maxY = 0;
for (let p = 0; p <= 1; p += 0.01) maxY = Math.max(maxY, pop(p));
check('la curva del pop sobrepasa 1', maxY > 1.05, `max ${maxY.toFixed(3)}`);

// 8. La curva de movers empieza en 0 y acaba en 1
const e0 = movers[0].ease(0), e1 = movers[0].ease(1);
check('las curvas arrancan en 0 y acaban en 1', Math.abs(e0) < 1e-6 && Math.abs(e1 - 1) < 1e-6);

function TRAVELmax() { return 780 + 260; }
function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


// Diagnóstico: ¿qué DRCorrectamente?
console.log('\n--- distribucion de los pesos de cada vecina ---');
conPeso.forEach((mo, idx) => {
  const kk = movers.findIndex((m) => m.slot === mo.mourner);
  const serie = [0, 60, 120, 200, 300, 400, 500, 520, 700].map((t) => {
    const conGente = paint(movers, mourners, t)[kk];
    const solo = movers[kk].from + (movers[kk].to - movers[kk].from) * movers[kk].ease(clamp01((t - movers[kk].delay) / movers[kk].dur));
    return Math.abs(conGente - solo);
  });
  console.log(`  vecina ${idx} (letra '${movers[kk].slot}') arrastre: ${serie.map((v) => v.toFixed(1)).join(' > ')}`);
});

// --- Comprobaciones del cierre: donde antes estaba el salto -------------------
import { popScale, totalFor } from './physics.mjs';

console.log('\n--- cierre de la animacion ---');

// 1. La escala del pop acaba exactamente en 1
check('la escala del pop acaba en 1 exacto', Math.abs(popScale(1) - 1) < 1e-9, `${popScale(1).toFixed(9)}`);

// 2. La escala sobrepasa 1 (es un pop, no un simple crecimiento)
let pico = 0;
for (let p = 0; p <= 1; p += 0.001) pico = Math.max(pico, popScale(p));
check('la escala se pasa de 1 y vuelve', pico > 1.05 && popScale(0) < 0.9, `pico ${pico.toFixed(3)}, inicio ${popScale(0).toFixed(3)}`);

// 3. El tramo final es continuo: sin escalones entre frames
let maxStep = 0;
for (let p = 0; p < 1; p += 1 / 60) maxStep = Math.max(maxStep, Math.abs(popScale(p + 1 / 60) - popScale(p)));
check('la escala no tiene escalones', maxStep < 0.03, `paso maximo por frame ${maxStep.toFixed(4)}`);

// 4. Ninguna letra sigue en vuelo cuando se cierra el bucle
const totalCierre = totalFor(movers);
let enVuelo = 0;
for (const m of movers) if (m.delay + m.dur > totalCierre) enVuelo++;
check('el bucle dura mas que la letra mas lenta', enVuelo === 0, `total ${totalCierre.toFixed(0)}ms, letra mas lenta ${Math.max(...movers.map((m) => m.delay + m.dur)).toFixed(0)}ms`);

// 5. El ultimo frame painted coincide con el estado que impone settle()
const ultimo = paint(movers, mourners, totalCierre);
const desvio = movers.map((m, k) => Math.abs(ultimo[k] - m.to)).filter((d) => d > 0.5);
check('el ultimo frame ya esta en su sitio', desvio.length === 0, `${desvio.length} letras desviadas`);

// 6. La escala en ese ultimo frame es 1 para todas
const escalas = movers.map((m) => m.scale(clamp01((totalCierre - m.delay) / m.dur)));
check('la escala final es 1 en todas las letras', escalas.every((s) => Math.abs(s - 1) < 1e-9), `max ${Math.max(...escalas.map((s) => Math.abs(s - 1))).toFixed(9)}`);

console.log(fallos === 0 ? '\nTODO OK' : `\n${fallos} FALLOS`);
