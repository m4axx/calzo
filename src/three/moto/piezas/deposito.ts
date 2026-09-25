// Depósito en gota (§4.2): loft propio de secciones superelípticas
// (exponente 2,6 arriba) interpoladas con CatmullRom desde la tabla de la
// spec, con tapas redondeadas. Es la superficie que recoge los reflejos de
// tira del estudio: por eso se muestrea fino y con normales analíticas.
import * as THREE from 'three';
import { orientar, redondear, seg, superelipse, superficie, torno, type Calidad, type Lote } from '../geo.ts';

/** Tabla de la spec: x, semiancho, techo, suelo (de delante a atrás). */
const TABLA: readonly (readonly [number, number, number, number])[] = [
  [0.40, 0.08, 0.915, 0.85],
  [0.33, 0.13, 0.955, 0.81],
  [0.25, 0.16, 0.985, 0.79],
  [0.15, 0.17, 1.000, 0.78],
  [0.05, 0.16, 0.995, 0.78],
  [-0.02, 0.135, 0.975, 0.785],   // hueco de rodillas
  [-0.08, 0.14, 0.955, 0.79],
  [-0.13, 0.11, 0.93, 0.80],
];

const curvaA = new THREE.CatmullRomCurve3(TABLA.map(([x, a, t]) => new THREE.Vector3(x, a, t)), false, 'catmullrom', 0.5);
const curvaB = new THREE.CatmullRomCurve3(TABLA.map(([x, , , s]) => new THREE.Vector3(x, s, 0)), false, 'catmullrom', 0.5);

/** Sección del depósito a lo largo de w (0 = delante, 1 = detrás). */
export function seccionDeposito(w: number): { x: number; a: number; techo: number; suelo: number } {
  const p = curvaA.getPoint(w), s = curvaB.getPoint(w);
  return { x: p.x, a: p.y, techo: p.z, suelo: s.y };
}

export function deposito(q: Calidad, l: Lote): void {
  const capF = 0.032, capT = 0.045, c0 = 0.07, c1 = 0.08;
  // Caché por v: la sección solo depende de v y superficie() evalúa cada anillo muchas veces.
  const cache = new Map<number, { x: number; a: number; techo: number; suelo: number }>();
  const secc = (w: number) => {
    let c = cache.get(w);
    if (!c) { c = seccionDeposito(w); cache.set(w, c); }
    return c;
  };
  const f = (u: number, v: number, out: THREE.Vector3) => {
    let w: number, esc: number, dx = 0;
    if (v < c0) {
      const th = (v / c0) * Math.PI / 2;
      w = 0; esc = Math.sin(th); dx = capF * Math.cos(th);
    } else if (v > 1 - c1) {
      const th = ((1 - v) / c1) * Math.PI / 2;
      w = 1; esc = Math.sin(th); dx = -capT * Math.cos(th);
    } else {
      w = (v - c0) / (1 - c0 - c1); esc = 1;
    }
    const sc = secc(w);
    const yc = sc.suelo + 0.52 * (sc.techo - sc.suelo);
    const ang = u * Math.PI * 2;
    const arriba = Math.sin(ang) >= 0;
    const [cz, sy] = superelipse(ang, arriba ? 2.6 : 2.15);
    const b = arriba ? sc.techo - yc : yc - sc.suelo;
    // Las tapas se cierran hacia la línea media alta: la gota «mira» hacia arriba.
    out.set(sc.x + dx, yc + b * sy * esc + (1 - esc) * (sc.techo - yc) * 0.25, sc.a * cz * esc);
  };
  const g = superficie(f, seg(q, 96, 40), seg(q, 56, 24), { uvEscala: [10, 7] });
  l.add('suspendida', 'deposito', 'pintura', g);

  // Tapón de llenado en (0,18; techo): aro cromado y tapa de aluminio con bisagra.
  const sc = seccionDeposito(2.7 / 7);   // x ≈ 0,18
  const base = new THREE.Vector3(0.18, sc.techo - 0.003 + 0.002, 0);
  const aro = torno(redondear([[0.03, -0.004, 0], [0.041, -0.002, 0.003], [0.041, 0.003, 0.002], [0.033, 0.005, 0]], 3), seg(q, 40, 14));
  l.add('suspendida', 'deposito', 'cromo', orientar(aro, base, [0.05, 1, 0]));
  const tapon = torno(redondear([[0.0, 0.002, 0], [0.031, 0.002, 0.002], [0.032, 0.009, 0.004], [0.02, 0.013, 0.004], [0.0, 0.0135, 0]], 3), seg(q, 40, 14));
  l.add('suspendida', 'deposito', 'aluminio', orientar(tapon, base, [0.05, 1, 0]));
}
