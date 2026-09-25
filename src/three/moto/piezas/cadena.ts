// Cadena (§4.2): 110 eslabones instanciados (un draw call) sobre el recorrido
// piñón r 0,045 en (−0,10; 0,34) ↔ corona r 0,10 en el eje trasero. Las
// placas alternan de grosor (interior/exterior) para que se lea como cadena.
// Va en z 0,10 (no 0,12): en 0,12 atravesaba el brazo izquierdo del basculante.
import * as THREE from 'three';
import { cajaChaflan, type Calidad, type Lote } from '../geo.ts';
import { EJE_TRAS, Z_CADENA } from './basculante.ts';

interface Tramo { largo: number; en(s: number): { p: THREE.Vector2; t: THREE.Vector2 } }

export function recorridoCadena(): { tramos: Tramo[]; largo: number } {
  const C1 = new THREE.Vector2(-0.10, 0.34), r1 = 0.045;
  const C2 = new THREE.Vector2(EJE_TRAS.x, EJE_TRAS.y), r2 = 0.10;
  const D = C1.clone().sub(C2);
  const d = D.length();
  const phi = Math.atan2(D.y, D.x);
  const alfa = Math.acos((r2 - r1) / d);
  const thU = phi + alfa, thL = phi - alfa;
  const pol = (c: THREE.Vector2, r: number, th: number) => new THREE.Vector2(c.x + r * Math.cos(th), c.y + r * Math.sin(th));
  const recta = (a: THREE.Vector2, b: THREE.Vector2): Tramo => {
    const t = b.clone().sub(a).normalize();
    return { largo: a.distanceTo(b), en: (s) => ({ p: a.clone().addScaledVector(t, s), t }) };
  };
  // Arco horario (ángulo decreciente) de th0 a th1.
  const arco = (c: THREE.Vector2, r: number, th0: number, th1: number): Tramo => ({
    largo: r * (th0 - th1),
    en: (s) => {
      const th = th0 - s / r;
      return { p: pol(c, r, th), t: new THREE.Vector2(Math.sin(th), -Math.cos(th)) };
    },
  });
  const tramos = [
    recta(pol(C2, r2, thU), pol(C1, r1, thU)),
    arco(C1, r1, thU, thL),
    recta(pol(C1, r1, thL), pol(C2, r2, thL)),
    arco(C2, r2, thL, thU - Math.PI * 2),
  ];
  return { tramos, largo: tramos.reduce((s, t) => s + t.largo, 0) };
}

export function cadena(_q: Calidad, l: Lote): void {
  const { tramos, largo } = recorridoCadena();
  const n = 110;
  const mats: THREE.Matrix4[] = [];
  const zAx = new THREE.Vector3(0, 0, 1);
  for (let k = 0; k < n; k++) {
    let s = (k / n) * largo;
    let i = 0;
    while (i < tramos.length - 1 && s > tramos[i].largo) { s -= tramos[i].largo; i++; }
    const { p, t } = tramos[i].en(Math.min(s, tramos[i].largo));
    const quat = new THREE.Quaternion().setFromAxisAngle(zAx, Math.atan2(t.y, t.x));
    const grueso = k % 2 === 0 ? 1.0 : 1.35;
    mats.push(new THREE.Matrix4().compose(new THREE.Vector3(p.x, p.y, Z_CADENA), quat, new THREE.Vector3(1, k % 2 === 0 ? 1 : 0.92, grueso)));
  }
  // Eslabón: RoundedBox 0,016 × 0,009 × 0,010 (§4.2), con aPieza en la geometría base.
  const eslabon = cajaChaflan(0.016, 0.009, 0.010, 0.0022);
  l.instancias('cadena', 'trasera', 'resto', 'metal_disco', eslabon, mats);
}
