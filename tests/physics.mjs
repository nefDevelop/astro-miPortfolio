// Réplica exacta de la física de Nav.astro, sin DOM, para poder verificarla.
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const bezier = (x1, y1, x2, y2) => {
	const A = (a, b) => 1 - 3 * b + 3 * a;
	const B = (a, b) => 3 * b - 6 * a;
	const C = (a) => 3 * a;
	const value = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
	const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);

	return (x) => {
		if (x <= 0) return 0;
		if (x >= 1) return 1;
		let t = x;
		for (let i = 0; i < 8; i++) {
			const d = slope(t, x1, x2);
			if (Math.abs(d) < 1e-6) break;
			const err = value(t, x1, x2) - x;
			if (Math.abs(err) < 1e-6) break;
			t -= err / d;
		}
		return value(t, y1, y2);
	};
};

export const TRAVEL = 780;
export const DRAG = 520;
export const SPARE = 26;

// Escala del pop: 0.78 -> 1.13 -> 1 exacto. El final exacto es lo que evita
// el salto cuando settle() impone el estado final.
export const POP_PEAK = 0.42;
export const POP_MAX = 1.13;
export const popScale = (p) => {
	const v = clamp01(p);
	if (v <= POP_PEAK) return 0.78 + (POP_MAX - 0.78) * (v / POP_PEAK);
	const u = (v - POP_PEAK) / (1 - POP_PEAK);
	return POP_MAX + (1 - POP_MAX) * Math.sin(u * Math.PI * 0.5);
};

// Duracion total real de una tanda: la letra mas lenta manda, con un margen.
export function totalFor(movers) {
	return movers.reduce((max, m) => Math.max(max, m.delay + m.dur), 0) + 40;
}

// Emparejamiento: cada letra nueva reutiliza la primera casilla libre con el
// mismo glifo. Es lo que hace que la D de Domínguez acabe siendo la D de
// Desarrollador.
export function assign(chars, slots) {
	const taken = new Set();
	const assign = new Array(chars.length).fill(-1);
	chars.forEach((char, j) => {
		for (let i = 0; i < slots.length && assign[j] === -1; i++) {
			if (!taken.has(i) && slots[i] === char) {
				assign[j] = i;
				taken.add(i);
			}
		}
	});
	const spare = slots.map((_, i) => i).filter((i) => !taken.has(i));
	let nextSpare = 0;
	const newborn = [];
	chars.forEach((char, j) => {
		if (assign[j] !== -1) return;
		const slot = spare[nextSpare++];
		if (slot === undefined) return;
		assign[j] = slot;
		newborn.push(slot);
		slots[slot] = char;
	});
	return { assign, newborn };
}

export function makeMovers(assign, newborn, spots, origin, rnd = Math.random) {
	const movers = [];
	assign.forEach((slotIndex, j) => {
		if (slotIndex === -1) return;
		const spot = spots[j];
		const fresh = newborn.includes(slotIndex);
		movers.push({
			slot: slotIndex,
			y: spot.y,
			from: fresh ? spot.x - 18 : origin[slotIndex].x,
			to: spot.x,
			delay: fresh ? rnd() * 120 : rnd() * 180,
			dur: TRAVEL * (fresh ? 0.62 + rnd() * 0.3 : 0.72 + rnd() * 0.45),
			ease: fresh ? bezier(0.18, 1.55, 0.4, 1) : bezier(0.2 + rnd() * 0.45, 0.08 + rnd() * 0.35, 0.18 + rnd() * 0.35, 1),
			fresh,
			scale: fresh ? popScale : () => 1,
		});
	});
	return movers;
}

// Un frame del paint de Nav.astro, sin escribir en el DOM.
export function paint(movers, mourners, t) {
	const at = new Array(movers.length).fill(0);
	movers.forEach((mover, k) => {
		const p = clamp01((t - mover.delay) / mover.dur);
		at[k] = mover.from + (mover.to - mover.from) * mover.ease(p);
	});
	movers.forEach((mover, k) => {
		if (!mover.fresh) return;
		const p = clamp01((t - mover.delay) / mover.dur);
		if (p <= 0 || p >= 1) return;
		const shove = (at[k] - mover.to) * 0.55;
		for (let n = k - 1; n <= k + 1; n += 2) {
			if (n < 0 || n >= movers.length) continue;
			at[n] += shove;
		}
	});
	mourners.forEach(({ mourner, goneFrom }) => {
		if (mourner < 0) return;
		const k = movers.findIndex((m) => m.slot === mourner);
		if (k < 0) return;
		at[k] += (goneFrom - movers[k].from) * 0.28 * (1 - clamp01(t / DRAG));
	});
	return at;
}

export function mournersFor(movers, leavingSlots, origin) {
	const claimed = new Set();
	return leavingSlots.map((i) => {
		let best = -1;
		let bestDist = Infinity;
		for (const mover of movers) {
			if (claimed.has(mover.slot)) continue;
			const d = Math.abs(origin[mover.slot].x - origin[i].x);
			if (d < bestDist) {
				bestDist = d;
				best = mover.slot;
			}
		}
		if (best >= 0) claimed.add(best);
		return { mourner: best, goneFrom: origin[i].x };
	});
}