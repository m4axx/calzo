// Escape 2 en 1 (§4.2): dos colectores Ø 0,038 sobre rectas con codos de
// radio ≥ 3 diámetros, caja de unión bajo el motor y silencioso cónico en el
// lado derecho. Cromo satinado.
//
// Desviación: el silencioso de la tabla atravesaba el basculante y el
// amortiguador derecho; va algo más bajo y más abierto, de (−0,33; 0,225;
// −0,175) a (−0,82; 0,275; −0,20), por debajo del brazo.
import * as THREE from 'three';
import { orientar, redondear, rutaCodos, seg, torno, tubo, type Calidad, type Lote, type V3 } from '../geo.ts';
import { enCilindro } from './motor.ts';

const R_COL = 0.019;

export function escape(q: Calidad, l: Lote): void {
  const rc = 3.2 * 2 * R_COL;
  for (const z of [0.07, -0.07]) {
    const puerto = enCilindro(0.184, 0.066, z);
    const zf = z > 0 ? -0.018 : -0.052;
    const pts: V3[] = [
      [puerto.x, puerto.y, z],
      [0.318, 0.43, z],
      [0.185, 0.205, z * 0.85],
      [-0.12, 0.203, zf],
    ];
    l.add('suspendida', 'resto', 'cromo_satinado', tubo(rutaCodos(pts, rc), R_COL, q, { radial: 18, pasos: 12, tapas: [false, false] }));
    // Brida del puerto (aluminio) con su collarín.
    const brida = torno(redondear([[R_COL, -0.004, 0], [R_COL + 0.009, -0.004, 0.002], [R_COL + 0.009, 0.008, 0.002], [R_COL, 0.009, 0]], 2), seg(q, 24, 10));
    const dir0 = new THREE.Vector3(0.318, 0.43, z).sub(puerto).normalize();
    l.add('suspendida', 'motor', 'aluminio', orientar(brida, puerto, dir0));
  }
  // Caja de unión bajo el motor (torno a lo largo de x).
  const caja = torno(redondear([
    [0.0, -0.075, 0], [0.028, -0.075, 0.012], [0.034, -0.05, 0.02], [0.034, 0.03, 0.02], [0.024, 0.06, 0.012], [0.0, 0.062, 0],
  ], 4), seg(q, 32, 12));
  l.add('suspendida', 'resto', 'cromo_satinado', orientar(caja, [-0.155, 0.205, -0.035], [-1, 0, 0]));
  // Tubo de enlace al silencioso.
  const enlace = rutaCodos([[-0.20, 0.205, -0.035], [-0.26, 0.21, -0.12], [-0.345, 0.227, -0.176]], 0.05);
  l.add('suspendida', 'resto', 'cromo_satinado', tubo(enlace, 0.0225, q, { radial: 18, pasos: 10, tapas: false }));

  // Silencioso cónico Ø 0,10 → 0,085, con culote redondeado y tapa trasera con salida.
  const a = new THREE.Vector3(-0.33, 0.225, -0.175), b = new THREE.Vector3(-0.82, 0.275, -0.20);
  const eje = b.clone().sub(a);
  const L = eje.length();
  eje.normalize();
  const sil = torno(redondear([
    [0.0225, -0.02, 0], [0.024, 0.0, 0.01], [0.05, 0.05, 0.04], [0.05, 0.08, 0.01], [0.0425, L - 0.012, 0.01],
    [0.0425, L, 0.006], [0.036, L + 0.004, 0.004], [0.036, L - 0.002, 0],
  ], 6), seg(q, 48, 16));
  l.add('suspendida', 'resto', 'cromo_satinado', orientar(sil, a, eje));
  // Fondo de la salida: disco oscuro dentro de la boca, y el tubo de cola.
  const cola = torno(redondear([[0.017, L - 0.03, 0], [0.017, L + 0.012, 0.003], [0.0135, L + 0.013, 0.002], [0.0135, L - 0.03, 0]], 2), seg(q, 28, 10));
  l.add('suspendida', 'resto', 'cromo_satinado', orientar(cola, a, eje));
  const fondo = torno([new THREE.Vector2(0.036, L - 0.002), new THREE.Vector2(0.0, L - 0.002)], seg(q, 28, 10));
  l.add('suspendida', 'resto', 'anodizado', orientar(fondo, a, eje));
  // Soporte del silencioso: del lomo del silencioso a la riostra del subchasis.
  const soporte = rutaCodos([[-0.56, 0.30, -0.19], [-0.50, 0.52, -0.17], [-0.46, 0.70, -0.108]], 0.04);
  l.add('suspendida', 'resto', 'anodizado', tubo(soporte, 0.0075, q, { radial: 12 }));
}
