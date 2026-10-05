import { assign } from './physics.mjs';

// Reproduce el emparejado + el reordenado del DOM para cada transición real
// del sitio, y comprueba que el orden del DOM coincide con el texto.
const W = { N:10,e:7.6,f:4.4,t:4.6,a:7.4,l:3.4,í:3.4,D:10,o:7.8,m:12,n:7.8,g:7.8,u:7.8,z:6.6,R:8.6,c:6.8,i:3.4,p:7.8,d:7.8,' ':4,S:8.4,t2:4.6 };
const measure = (t) => { const s=[]; let x=0; for (const ch of t){ const w = W[ch] ?? 7.5; s.push({x,y:0}); x+=w; } return { spots:s, width:x }; };

const SECCIONES = ['Desarrollador Full Stack Junior','RecipeNode','reGIO','Sobre mí','Trayectoria','Contacto'];
const NOMBRE = 'Neftalí Domínguez';
let fallos = 0;

// Estado del DOM = orden de las casillas tras el reordenado
let dom = [];                       // indices de casilla, en orden de DOM
let slots = Array.from({length:32}, ()=>'');
[...NOMBRE].forEach((c,i)=>{ slots[i]=c; });
dom = slots.map((c,i)=>c?i:-1).filter(i=>i>=0);

function morph(texto){
  const { assign: plan, newborn } = assign([...texto], slots.slice());
  // el script escribe el caracter destino en la casilla
  plan.forEach((slotIdx, j) => { if (slotIdx !== -1) slots[slotIdx] = texto[j]; });
  // las que se van se vacian
  plan.forEach(i => {});
  slots.forEach((c,i) => { if (!plan.includes(i)) slots[i] = ''; });
  // reordenado del DOM: assign en orden, y detras las casillas vacias
  const orden = [...plan.filter(i=>i!==-1), ...slots.map((_,i)=>i).filter(i=>!plan.includes(i))];
  return { plan, orden, slots };
}

console.log('DOM inicial      :', slots.filter(Boolean).join(''), ' | orden esperado:', NOMBRE);
console.log();

for (const sec of SECCIONES){
  const { plan, orden, slots: s2 } = morph(sec);
  const textoDom = orden.map(i => s2[i]).join('');
  const ancho = measure(sec).width;
  const anchoReal = ancho + 26;
  const ok = textoDom === sec;
  const overflow = textoDom.length > sec.length;
  if (!ok) fallos++;
  console.log(`${ok?'PASA':'FALLA'}  -> ${sec}`);
  console.log(`        texto DOM = "${textoDom}"  ${ok?'(igual)':'(NO coincide)'}`);
  console.log(`        casillas reordenadas = ${plan.filter(i=>i!==-1).length} + ${32-plan.filter(i=>i!==-1).length} vacias`);
  console.log(`        ancho = ${anchoReal}px (texto ${ancho} + holgura 26)`);
}

console.log(fallos === 0 ? '\nTODO OK' : `\n${fallos} FALLOS`);
