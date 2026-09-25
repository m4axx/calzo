// Asiento, colín y tapas laterales (§4.2). Asiento: loft de 6 secciones de
// (−0,12; 0,84) a (−0,62; 0,86), ancho 0,26, grosor 0,07. Colín corto y
// afilado hasta x −0,80 con el piloto de lente ahumada, sin emisión. Las
// tapas laterales cierran el hueco bajo el asiento (caja de filtro).
import * as THREE from 'three';
import { cajaR, poligonoRedondo, seg, superelipse, superficie, type Calidad, type Lote } from '../geo.ts';

type Seccion = readonly [number, number, number, number];   // x, techo, suelo, semiancho

function loft(tabla: readonly Seccion[], capD: number, capT: number, expArriba: number, expAbajo: number) {
  const curva = new THREE.CatmullRomCurve3(tabla.map(([x, t, s]) => new THREE.Vector3(x, t, s)), false, 'catmullrom', 0.5);
  const anchos = new THREE.CatmullRomCurve3(tabla.map(([x, , , a]) => new THREE.Vector3(x, a, 0)), false, 'catmullrom', 0.5);
  const c0 = 0.08, c1 = 0.08;
  const cache = new Map<number, [THREE.Vector3, number]>();
  return (u: number, v: number, out: THREE.Vector3) => {
    let w: number, esc: number, dx = 0;
    if (v < c0) { const th = (v / c0) * Math.PI / 2; w = 0; esc = Math.sin(th); dx = capD * Math.cos(th); }
    else if (v > 1 - c1) { const th = ((1 - v) / c1) * Math.PI / 2; w = 1; esc = Math.sin(th); dx = -capT * Math.cos(th); }
    else { w = (v - c0) / (1 - c0 - c1); esc = 1; }
    let c = cache.get(w);
    if (!c) { c = [curva.getPoint(w), anchos.getPoint(w).y]; cache.set(w, c); }
    const [p, a] = c;
    const techo = p.y, suelo = p.z, yc = (techo + suelo) / 2, b = (techo - suelo) / 2;
    const ang = u * Math.PI * 2;
    const [cz, sy] = superelipse(ang, Math.sin(ang) >= 0 ? expArriba : expAbajo);
    out.set(p.x + dx, yc + b * sy * Math.pow(esc, 0.6) + (1 - Math.pow(esc, 0.6)) * b * 0.3, a * cz * esc);
  };
}

export function tapizado(q: Calidad, l: Lote): void {
  // Asiento: techo = altura de la tapicería; el grosor de 0,07 baja hasta la base.
  const tabla: Seccion[] = [
    [-0.115, 0.836, 0.786, 0.085],
    [-0.20, 0.832, 0.766, 0.118],
    [-0.30, 0.836, 0.768, 0.13],
    [-0.42, 0.845, 0.776, 0.13],
    [-0.53, 0.853, 0.785, 0.124],
    [-0.62, 0.860, 0.792, 0.112],
  ];
  const g = superficie(loft(tabla, 0.03, 0.03, 4.2, 5), seg(q, 56, 24), seg(q, 36, 16), { uvEscala: [4, 3] });
  l.add('suspendida', 'resto', 'asiento', g);
  // Vivo de la base del asiento: una banda algo más ancha y fina, en pintura oscura.
  const base: Seccion[] = tabla.map(([x, , s, a]) => [x, s + 0.012, s - 0.004, a + 0.004] as const);
  l.add('suspendida', 'resto', 'anodizado', superficie(loft(base, 0.024, 0.024, 6, 6), seg(q, 48, 20), seg(q, 28, 12)));

}

export function colin(q: Calidad, l: Lote): void {
  // Colín: pintura, afilado hacia atrás.
  const colin: Seccion[] = [
    [-0.56, 0.808, 0.752, 0.122],
    [-0.64, 0.838, 0.772, 0.108],
    [-0.72, 0.846, 0.792, 0.084],
    [-0.795, 0.842, 0.81, 0.05],
  ];
  l.add('suspendida', 'resto', 'pintura', superficie(loft(colin, 0.01, 0.018, 3.2, 4), seg(q, 48, 20), seg(q, 28, 12)));
  // Piloto: lente ahumada sin emisión bajo la punta del colín.
  l.add('suspendida', 'resto', 'faro_lente', cajaR(0.02, 0.02, 0.07, 0.008, [-0.8, 0.812, 0], q, 3));

}

export function tapasLaterales(q: Calidad, l: Lote): void {
  // Tapas laterales (pintura) y caja de filtro detrás (anodizado).
  const forma = poligonoRedondo([
    [-0.085, 0.745, 0.02], [-0.36, 0.765, 0.03], [-0.335, 0.60, 0.05], [-0.12, 0.54, 0.05], [-0.075, 0.62, 0.04],
  ], 5);
  for (const s of [1, -1]) l.add('suspendida', 'resto', 'pintura', almohada(forma, 0.125, 0.01, 0.012, s, q));
  l.add('suspendida', 'resto', 'anodizado', cajaR(0.24, 0.17, 0.235, 0.02, [-0.22, 0.665, 0], q, 3));
}

/**
 * Tapa «almohada»: contorno plano con canto redondeado y cara abombada, para
 * que la tapa lateral recoja un degradado de reflejo en vez de un plano negro.
 * s = lado (+1 izquierda). z0 = plano de apoyo.
 */
function almohada(forma: THREE.Shape, z0: number, grosor: number, bombeo: number, s: number, q: Calidad): THREE.BufferGeometry {
  const pts = forma.getSpacedPoints(64);
  pts.pop();
  const c = new THREE.Vector2();
  for (const p of pts) c.add(p);
  c.multiplyScalar(1 / pts.length);
  const n = pts.length;
  const O = (u: number) => {
    const t = (((u % 1) + 1) % 1) * n;
    const i = Math.floor(t), f = t - i;
    return pts[i % n].clone().lerp(pts[(i + 1) % n], f);
  };
  const f = (u: number, v: number, out: THREE.Vector3) => {
    const th = Math.min(1, Math.max(0, v)) * Math.PI / 2;
    const r = Math.pow(Math.cos(th), 2 / 5), h = Math.pow(Math.sin(th), 2 / 5);
    const o = O(u);
    const x = c.x + (o.x - c.x) * r, y = c.y + (o.y - c.y) * r;
    out.set(x, y, s * (z0 + grosor * h + bombeo * (1 - r * r)));
  };
  return superficie(f, seg(q, 64, 24), seg(q, 12, 6));
}
