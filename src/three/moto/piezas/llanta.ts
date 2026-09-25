// Llantas (§4.2): labio y canal en torno, cinco radios dobles extruidos
// (forma en V, bisel de 1,5 mm), buje en torno y el labio diamantado como
// anillo aparte. Cuerpo anodizado negro: el filo torneado es lo que brilla.
import * as THREE from 'three';
import { extruir, orientar, redondear, seg, torno, type Calidad, type Grupo, type Lote } from '../geo.ts';
import type { PiezaId } from '../../contrato-tipos.ts';

/** Perfil cerrado de la llanta (r, z), en sentido antihorario para que las normales miren fuera. */
function perfilLlanta(b: number): THREE.Vector2[] {
  const e = 0.006;
  return redondear([
    [0.186, -b - e + 0.004, 0],
    [0.190, -b - e, 0.004],
    [0.226, -b - e, 0.003],
    [0.229, -b + 0.001, 0.003],
    [0.216, -b + 0.008, 0.003],
    [0.216, -b + 0.022, 0.004],
    [0.198, -b + 0.034, 0.006],
    [0.198, b - 0.034, 0.006],
    [0.216, b - 0.022, 0.004],
    [0.216, b - 0.008, 0.003],
    [0.229, b - 0.001, 0.003],
    [0.226, b + e, 0.003],
    [0.190, b + e, 0.004],
    [0.186, b + e - 0.004, 0.003],
    [0.186, -b - e + 0.004, 0],
  ], 2);
}

/** Radio doble en V: dos brazos que nacen juntos en el buje y se abren hacia el aro. */
function formaRadio(): THREE.Shape {
  const r0 = 0.058, r1 = 0.192;
  const delta = (r: number) => 0.175 * Math.pow(Math.max(0, (r - r0) / (r1 - r0)), 1.25);
  const semi = (r: number) => 0.0085 - 0.0017 * (r - r0) / (r1 - r0);
  // Vértice interior de la V: donde los bordes interiores de los brazos se tocan.
  let lo = r0, hi = r1;
  for (let k = 0; k < 30; k++) {
    const m = (lo + hi) / 2;
    if (delta(m) - semi(m) / m > 0) hi = m; else lo = m;
  }
  const rv = hi;
  const pol = (r: number, a: number) => new THREE.Vector2(r * Math.cos(a), r * Math.sin(a));
  const n = 10;
  const pts: THREE.Vector2[] = [];
  // Borde exterior del brazo +, del buje al aro.
  for (let i = 0; i <= n; i++) { const r = r0 + (r1 - r0) * (i / n); pts.push(pol(r, delta(r) + semi(r) / r)); }
  // Borde interior del brazo +, del aro al vértice de la V.
  for (let i = n; i >= 0; i--) { const r = rv + (r1 - rv) * (i / n); pts.push(pol(r, Math.max(0, delta(r) - semi(r) / r))); }
  // Borde interior del brazo −, del vértice al aro.
  for (let i = 1; i <= n; i++) { const r = rv + (r1 - rv) * (i / n); pts.push(pol(r, -Math.max(0, delta(r) - semi(r) / r))); }
  // Borde exterior del brazo −, del aro al buje.
  for (let i = n; i >= 0; i--) { const r = r0 + (r1 - r0) * (i / n); pts.push(pol(r, -(delta(r) + semi(r) / r))); }
  return new THREE.Shape(pts);
}

export function llanta(q: Calidad, l: Lote, x: number, b: number, anchoBuje: number, grupo: Grupo, pieza: PiezaId): void {
  const c = new THREE.Vector3(x, 0.31, 0);
  const segs = seg(q, 72, 24);
  // Aro.
  l.add(grupo, pieza, 'anodizado', orientar(torno(perfilLlanta(b), segs), c, [0, 0, 1]));
  // Labio diamantado: la cara lateral torneada del aro, un anillo apenas saliente.
  for (const s of [-1, 1]) {
    const z = s * (b + 0.0062);
    // Orden del perfil: las normales del torno son (dy, −dx); la cara plana mira hacia fuera en z.
    const perfil = s > 0
      ? [[0.2262, 0, 0], [0.2262, 0.0012, 0.0008], [0.2045, 0.0012, 0.0008], [0.2045, 0, 0]] as const
      : [[0.2045, 0, 0], [0.2045, -0.0012, 0.0008], [0.2262, -0.0012, 0.0008], [0.2262, 0, 0]] as const;
    l.add(grupo, pieza, 'diamantado', orientar(torno(redondear(perfil, 2), segs), new THREE.Vector3(x, 0.31, z), [0, 0, 1]));
  }
  // Radios: cinco en V, centrados en el plano medio.
  const forma = formaRadio();
  for (let k = 0; k < 5; k++) {
    const g = extruir(forma, 0.02, 0.0015, q, 12, 2);
    g.rotateZ((k / 5) * Math.PI * 2 + 0.3);
    g.translate(x, 0.31, 0);
    l.add(grupo, pieza, 'anodizado', g);
  }
  // Buje.
  const h = anchoBuje / 2;
  const buje = redondear([
    [0.0, -h - 0.004, 0], [0.022, -h - 0.004, 0.003], [0.030, -h, 0.003], [0.030, -h + 0.012, 0.004],
    [0.062, -h + 0.02, 0.006], [0.062, h - 0.02, 0.006], [0.030, h - 0.012, 0.004], [0.030, h, 0.003],
    [0.022, h + 0.004, 0.003], [0.0, h + 0.004, 0],
  ], 3);
  l.add(grupo, pieza, 'anodizado', orientar(torno(buje, seg(q, 32, 12)), c, [0, 0, 1]));
}
