// Comprueba la geometria de la salida de las letras que sobran, contra la
// funcion pura calcularSalida de Nav.astro.
//
// Se replica aqui a proposito: si el test importara el componente habria que
// arrancar Astro y un DOM. Lo que se protege son las dos propiedades que
// importan, y que solo se pueden ver en el geometria:
//
//   1. ninguna letra termina dentro de la palabra nueva
//   2. dos letras nunca terminan en la misma x (si no, se apilan)
//
// La 2 la cazó un defecto real: al pasar del rol a RecipeNode, cinco
// letras aterrizaban todas en x = 99.6.

const OUT_EXIT = 18;
const OUT_CLEAR = 10;
const OUT_SPREAD = 11;

// Copia literal de la funcion de Nav.astro, con EXIT_MODE = 'fuera'.
function calcularSalida(x, ancho, peldano) {
	const dentro = x >= 0 && x <= ancho;
	if (!dentro) return { desde: x, hasta: x + (x < ancho / 2 ? -OUT_EXIT : OUT_EXIT) };
	const holgura = OUT_CLEAR + peldano * OUT_SPREAD;
	const hasta = x < ancho / 2 ? -holgura : ancho + holgura;
	return { desde: x, hasta };
}

const ok = [];
const mal = [];
const check = (pass, msg) => (pass ? ok : mal).push(msg);

// Anchos reales medidos en el navegador con Onest cargada.
const ANCHOS = [
	{ etiqueta: 'RecipeNode', ancho: 90.42 },
	{ etiqueta: 'reGIO', ancho: 40.5 },
	{ etiqueta: 'Sobre mí', ancho: 65.8 },
	{ etiqueta: 'Contacto', ancho: 67.63 },
	{ etiqueta: 'Trayectoria', ancho: 84.2 },
	{ etiqueta: 'Desarrollador Full Stack Junior', ancho: 227.08 },
];

// Posiciones reales de partida medidas en el navegador al encoger desde el rol.
const PARTIDAS = [
	59.3, 63.5, 67.6, 70.3, 74.4, 78.2, 86.2, 92.7, 95.7, 102.2, 106.0, 114.2,
	124.0, 128.2, 132.3, 136.1, 144.5, 150.6, 159.5, 167.2, 176.2, 180.0, 184.5,
	194.3, 204.1, 208.3, 217.8,
];

for (const { etiqueta, ancho } of ANCHOS) {
	// Se asigna peldano solo a las que caen dentro, igual que en el componente.
	let peldano = 0;
	const salidas = PARTIDAS.map((x) => {
		const dentro = x >= 0 && x <= ancho;
		const r = calcularSalida(x, ancho, dentro ? peldano++ : 0);
		return { x, ...r, dentro };
	});

	const dentro = salidas.filter((s) => s.hasta >= -0.5 && s.hasta <= ancho + 0.5);
	check(dentro.length === 0, `${etiqueta.padEnd(32)} ninguna termina dentro (${salidas.length} se van)`);

	const llegadas = salidas.map((s) => Math.round(s.hasta * 10) / 10);
	const repetidas = llegadas.filter((v, i) => llegadas.indexOf(v) !== i);
	check(repetidas.length === 0, `${etiqueta.padEnd(32)} ninguna aterriza sobre otra${repetidas.length ? ` (repetidas: ${[...new Set(repetidas)].join(', ')})` : ''}`);
}

// Barrido denso del rango entero, no solo las posiciones medidas: asi el
// invariante se cumple para cualquier letra, no solo para las que se han
// medido a mano.
let fallosDenso = 0;
let apiladasDensas = 0;
for (let ancho = 40; ancho <= 230; ancho += 0.5) {
	const landings = new Set();
	let peldano = 0;
	for (let x = -20; x <= 260; x += 0.5) {
		const dentro = x >= 0 && x <= ancho;
		const { hasta } = calcularSalida(x, ancho, dentro ? peldano++ : 0);
		if (hasta >= -0.001 && hasta <= ancho + 0.001) fallosDenso++;
		// Solo se comparan las que estaban dentro: las de fuera mantienen su
		// separacion alarse todas por igual, asi que no pueden solaparse.
		if (dentro) {
			const clave = Math.round(hasta * 10) / 10;
			if (landings.has(clave)) apiladasDensas++;
			landings.add(clave);
		}
	}
}
check(fallosDenso === 0, `barrido denso (x de -20 a 260, anchos de 40 a 230): ${fallosDenso} landings dentro de la palabra`);
check(apiladasDensas === 0, `barrido denso: ${apiladasDensas} landings repetidos`);

// El destino tiene que estar a un lado coherente: una letra a la izquierda del
// centro sale por la izquierda, y al reves. Si se invirtiera, las letras del
// centro se empujan hacia dentro.
const ancho = 90.42;
const izquierda = calcularSalida(20, ancho, 0);
const derecha = calcularSalida(70, ancho, 0);
check(izquierda.hasta < 0, `una letra a la izquierda sale por la izquierda (${izquierda.hasta})`);
check(derecha.hasta > ancho, `una letra a la derecha sale por la derecha (${derecha.hasta})`);

// La distancia recorrida no puede dispararse: una letra del centro no debería
// volar media pantalla para salir.
const centros = [30, 45, 60].map((x) => Math.abs(calcularSalida(x, ancho, 0).hasta - x));
check(Math.max(...centros) < ancho, `ninguna recorre mas de un ancho de palabra (max ${Math.max(...centros).toFixed(1)} de ${ancho})`);

ok.forEach((m) => console.log('PASA  ' + m));
mal.forEach((m) => console.log('FALLA ' + m));
console.log(mal.length ? `\n${mal.length} FALLOS` : '\nTODO OK');
process.exit(mal.length ? 1 : 0);