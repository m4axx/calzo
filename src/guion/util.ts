// Utilidades puras del guion (§5.7). Sin DOM, sin three. Se prueban en Node.

export function clamp(x: number, a = 0, b = 1): number {
  return x < a ? a : x > b ? b : x;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Progreso local de p dentro de [a, b], recortado a 0..1. */
export function loc(p: number, r: readonly [number, number]): number {
  return clamp((p - r[0]) / (r[1] - r[0]));
}

/** cubic-bezier(x1, y1, x2, y2) como función de x → y. Newton-Raphson con bisección de respaldo. */
export function bezier(x1: number, y1: number, x2: number, y2: number): (x: number) => number {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const resolver = (x: number): number => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-6) return t;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 40; i++) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-6) return t;
      if (v < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  };
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return sy(resolver(x));
  };
}

/** El único ease de marca: arranque pesado y llegada larga (§3.8). */
export const easeCalzo = bezier(0.62, 0, 0.12, 1);

/**
 * Muelle crítico. Solución exacta de x'' = −2ωx' − ω²(x − objetivo): estable
 * con cualquier dt (el ticker puede entregar hasta 50 ms).
 */
export function muelleCritico(x: number, v: number, objetivo: number, omega: number, dt: number): [number, number] {
  const c1 = x - objetivo;
  const c2 = v + omega * c1;
  const e = Math.exp(-omega * dt);
  const nx = objetivo + (c1 + c2 * dt) * e;
  const nv = (c2 - omega * (c1 + c2 * dt)) * e;
  return [nx, nv];
}

/** Rampa de opacidad de una fase activa en [a, b) con bordes de `r` de p (§5.7). */
export function rampa(p: number, a: number, b: number, r = 0.015): number {
  if (p < a - r || p >= b + r) return 0;
  const entra = a <= 0 ? 1 : clamp((p - (a - r)) / (2 * r));
  const sale = clamp(((b + r) - p) / (2 * r));
  return Math.min(entra, sale);
}
