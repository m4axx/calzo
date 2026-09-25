// Discos y pinzas (§4.2). Disco flotante: pista de acero de 5 mm con 18
// taladros, soporte de aluminio con aligeramientos y botones de unión.
// Pinza en caja redondeada detrás de cada disco, a las 8 en punto.
import * as THREE from 'three';
import { cajaR, extruir, orientar, redondear, seg, torno, type Calidad, type Grupo, type Lote } from '../geo.ts';
import type { PiezaId } from '../../contrato-tipos.ts';

function anillo(rExt: number, rInt: number, agujeros: { r: number; n: number; d: number; fase?: number }[]): THREE.Shape {
  const s = new THREE.Shape();
  s.absarc(0, 0, rExt, 0, Math.PI * 2, false);
  const h = new THREE.Path();
  h.absarc(0, 0, rInt, 0, Math.PI * 2, true);
  s.holes.push(h);
  for (const a of agujeros) {
    for (let k = 0; k < a.n; k++) {
      const ang = (k / a.n) * Math.PI * 2 + (a.fase ?? 0);
      const p = new THREE.Path();
      p.absarc(a.r * Math.cos(ang), a.r * Math.sin(ang), a.d / 2, 0, Math.PI * 2, true);
      s.holes.push(p);
    }
  }
  return s;
}

/** Soporte (araña) del disco: anillo con cinco aligeramientos en gota. */
function arana(rExt: number, rInt: number): THREE.Shape {
  const s = new THREE.Shape();
  s.absarc(0, 0, rExt, 0, Math.PI * 2, false);
  const c = new THREE.Path();
  c.absarc(0, 0, rInt, 0, Math.PI * 2, true);
  s.holes.push(c);
  const rm = (rExt + rInt) / 2, ancho = (rExt - rInt) * 0.34;
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + 0.3 + Math.PI / 5;
    const p = new THREE.Path();
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = (i / 12) * Math.PI * 2;
      const rr = rm + Math.cos(t) * ancho;
      const aa = a + Math.sin(t) * 0.36;
      pts.push(new THREE.Vector2(rr * Math.cos(aa), rr * Math.sin(aa)));
    }
    p.setFromPoints(pts.reverse());
    s.holes.push(p);
  }
  return s;
}

function disco(q: Calidad, l: Lote, x: number, z: number, rExt: number, grupo: Grupo, pieza: PiezaId): void {
  const rInt = rExt * 0.72;
  const pista = extruir(anillo(rExt, rInt, [{ r: (rExt + rInt) / 2, n: 18, d: 0.0075 }]), 0.005, 0.0006, q, 64, 1);
  pista.translate(x, 0.31, z);
  l.add(grupo, pieza, 'metal_disco', pista);
  const ar = extruir(arana(rInt + 0.004, 0.05), 0.004, 0.0008, q, 48, 1);
  ar.translate(x, 0.31, z + Math.sign(z) * 0.0015);
  l.add(grupo, pieza, 'aluminio', ar);
  // Botones flotantes entre pista y araña.
  const nB = 10;
  for (let k = 0; k < nB; k++) {
    const a = (k / nB) * Math.PI * 2;
    const r = rInt + 0.002;
    const b = torno(redondear([[0, -0.004, 0], [0.0045, -0.004, 0.001], [0.0045, 0.004, 0.001], [0, 0.004, 0]], 1), seg(q, 10, 6));
    orientar(b, new THREE.Vector3(x + r * Math.cos(a), 0.31 + r * Math.sin(a), z), [0, 0, 1]);
    l.add(grupo, pieza, 'aluminio', b);
  }
}

/** Pinza a las 8 en punto (vista desde la izquierda): detrás y abajo del eje. */
function pinza(q: Calidad, l: Lote, x: number, z: number, rDisco: number, grupo: Grupo, pieza: PiezaId, anclaje: THREE.Vector3): void {
  const a = (210 / 180) * Math.PI;
  const r = rDisco - 0.022;
  const c = new THREE.Vector3(x + r * Math.cos(a), 0.31 + r * Math.sin(a), z);
  const g = cajaR(0.09, 0.05, 0.035, 0.008, [0, 0, 0], q, 2);
  g.rotateZ(a + Math.PI / 2);
  g.translate(c.x, c.y, c.z + Math.sign(z) * 0.004);
  l.add(grupo, pieza, 'anodizado', g);
  // Tapa del pistón y los dos tornillos de anclaje, en la cara exterior.
  const tapaP = torno(redondear([[0, 0, 0], [0.013, 0, 0.002], [0.013, 0.004, 0.0015], [0, 0.004, 0]], 2), seg(q, 16, 8));
  orientar(tapaP, c.clone().setZ(z + Math.sign(z) * 0.0215), [0, 0, Math.sign(z)]);
  l.add(grupo, pieza, 'aluminio', tapaP);
  // Soporte de la pinza hasta su anclaje (botella o basculante).
  const dir = anclaje.clone().sub(c);
  const L = dir.length();
  const brazo = cajaR(L + 0.02, 0.022, 0.012, 0.005, [0, 0, 0], q, 2);
  brazo.rotateZ(Math.atan2(dir.y, dir.x));
  const m = c.clone().add(anclaje).multiplyScalar(0.5);
  brazo.translate(m.x, m.y, z + Math.sign(z) * 0.024);
  l.add(grupo, pieza, 'anodizado', brazo);
}

export function discos(q: Calidad, l: Lote): void {
  for (const z of [0.07, -0.07]) {
    disco(q, l, 0.725, z, 0.16, 'delantera', 'rueda_del');
    // Anclaje de la pinza delantera: la base de la botella, algo por encima del eje.
    pinza(q, l, 0.725, z, 0.16, 'delantera', 'rueda_del', new THREE.Vector3(0.70, 0.36, z));
  }
  disco(q, l, -0.725, -0.06, 0.12, 'trasera', 'resto');
  pinza(q, l, -0.725, -0.06, 0.12, 'trasera', 'resto', new THREE.Vector3(-0.64, 0.30, -0.06));
}
