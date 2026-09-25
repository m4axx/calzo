// Basculante (§4.2): brazos extruidos de sección cajón 0,05 × 0,035 (bisel
// 4 mm) del pivote (−0,20; 0,47) al eje (−0,725; 0,31) en z ±0,13, travesaño,
// bujes del pivote, tensores de cadena, eje trasero y corona. Grupo trasera.
import * as THREE from 'three';
import { cajaR, extruir, facetar, orientar, poligonoRedondo, redondear, rutaCodos, seg, torno, tubo, type Calidad, type Lote } from '../geo.ts';

export const PIVOTE = new THREE.Vector3(-0.20, 0.47, 0);
export const EJE_TRAS = new THREE.Vector3(-0.725, 0.31, 0);
export const Z_BASC = 0.13;
export const Z_CADENA = 0.10;

/** Punto del eje del brazo a una x dada. */
export function brazoEn(x: number, z = Z_BASC): THREE.Vector3 {
  const u = (x - PIVOTE.x) / (EJE_TRAS.x - PIVOTE.x);
  return PIVOTE.clone().lerp(EJE_TRAS, u).setZ(z);
}

function corona(rTip: number, dientes: number): THREE.Shape {
  const pts: THREE.Vector2[] = [];
  const rRaiz = rTip - 0.008;
  for (let k = 0; k < dientes; k++) {
    const a0 = (k / dientes) * Math.PI * 2, da = (Math.PI * 2) / dientes;
    for (const [f, r] of [[0.0, rRaiz], [0.2, rRaiz], [0.36, rTip], [0.64, rTip], [0.8, rRaiz]] as const) {
      const a = a0 + f * da;
      pts.push(new THREE.Vector2(r * Math.cos(a), r * Math.sin(a)));
    }
  }
  const s = new THREE.Shape(pts);
  const c = new THREE.Path();
  c.absarc(0, 0, 0.034, 0, Math.PI * 2, true);
  s.holes.push(c);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + 0.3;
    const pts: THREE.Vector2[] = [];
    for (let i = 16; i > 0; i--) { const t = (i / 16) * Math.PI * 2; pts.push(new THREE.Vector2(0.062 * Math.cos(a) + 0.017 * Math.cos(t), 0.062 * Math.sin(a) + 0.017 * Math.sin(t))); }
    s.holes.push(new THREE.Path(pts));
  }
  return s;
}

export function basculante(q: Calidad, l: Lote): void {
  const dir = EJE_TRAS.clone().sub(PIVOTE).normalize();
  const n = new THREE.Vector3(-dir.y, dir.x, 0);
  const zAx = new THREE.Vector3(0, 0, 1);
  const L = PIVOTE.distanceTo(EJE_TRAS) + 0.055;
  const seccion = poligonoRedondo([[-0.025, -0.0175, 0.006], [0.025, -0.0175, 0.006], [0.025, 0.0175, 0.006], [-0.025, 0.0175, 0.006]], 3);
  for (const s of [1, -1]) {
    const g = extruir(seccion, L, 0.004, q, 8, 2);
    const centro = PIVOTE.clone().addScaledVector(dir, L / 2 - 0.02).setZ(s * Z_BASC);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(n, zAx, dir).setPosition(centro));
    l.add('trasera', 'resto', 'anodizado', g);
    // Buje del pivote y tuerca.
    const buje = torno(redondear([[0.0, -0.022, 0], [0.024, -0.022, 0.004], [0.024, 0.022, 0.004], [0.0, 0.022, 0]], 3), seg(q, 28, 10));
    l.add('trasera', 'resto', 'anodizado', orientar(buje, PIVOTE.clone().setZ(s * Z_BASC), zAx));
    const tuerca = torno(redondear([[0.0, 0.0, 0], [0.014, 0.0, 0.001], [0.014, 0.01, 0.0015], [0.0, 0.011, 0]], 2), 6);
    l.add('trasera', 'resto', 'aluminio', facetar(orientar(tuerca, PIVOTE.clone().setZ(s * (Z_BASC + 0.021)), [0, 0, s])));
    // Tensor de cadena: taco de aluminio en la punta del brazo y tuerca del eje.
    const tensor = cajaR(0.03, 0.036, 0.012, 0.004, [0, 0, 0], q, 2);
    tensor.rotateZ(Math.atan2(dir.y, dir.x));
    const pt = EJE_TRAS.clone().addScaledVector(dir, 0.028).setZ(s * (Z_BASC + 0.021));
    tensor.translate(pt.x, pt.y, pt.z);
    l.add('trasera', 'resto', 'aluminio', tensor);
    const tEje = torno(redondear([[0.0, 0.0, 0], [0.016, 0.0, 0.001], [0.016, 0.012, 0.0015], [0.0, 0.013, 0]], 2), 6);
    l.add('trasera', 'resto', 'aluminio', facetar(orientar(tEje, EJE_TRAS.clone().setZ(s * (Z_BASC + 0.0175)), [0, 0, s])));
  }
  // Travesaño entre brazos, por delante de la rueda.
  const pT = brazoEn(-0.30, 0);
  l.add('trasera', 'resto', 'anodizado', tubo(rutaCodos([pT.clone().setZ(0.12), pT.clone().setZ(-0.12)], 0.02), 0.018, q, { radial: 20, tapas: false }));
  // Eje trasero.
  const eje = torno(redondear([[0, -0.16, 0], [0.01, -0.16, 0.002], [0.01, 0.16, 0.002], [0, 0.16, 0]], 2), seg(q, 16, 8));
  l.add('trasera', 'resto', 'aluminio', orientar(eje, EJE_TRAS, zAx));
  // Corona (38 dientes) en el lado de la cadena.
  const cor = extruir(corona(0.104, 38), 0.006, 0.0008, q, 16, 1);
  cor.translate(EJE_TRAS.x, EJE_TRAS.y, Z_CADENA);
  l.add('trasera', 'resto', 'aluminio', cor);
}
