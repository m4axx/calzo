// Horquilla (§4.2): botellas anodizadas Ø 0,056 (t 0,02–0,36, grupo
// delantera) y barras de cromo Ø 0,043 (t 0,36–0,70, grupo suspendido). Al
// comprimir, el grupo suspendido gira y las barras entran en las botellas.
import * as THREE from 'three';
import { D_HORQ, ejeHorquilla, facetar, orientar, redondear, seg, torno, type Calidad, type Lote } from '../geo.ts';

export const Z_HORQ = 0.10;
export const R_BARRA = 0.0215;
export const R_BOTELLA = 0.028;

export function horquilla(q: Calidad, l: Lote): void {
  const rad = seg(q, 32, 10);
  for (const z of [Z_HORQ, -Z_HORQ]) {
    const base = ejeHorquilla(0, 0, z);
    // Botella: pie redondeado bajo el eje, cuerpo, cuello y guardapolvos.
    const bot = torno(redondear([
      [0, -0.045, 0], [0.018, -0.045, 0.012], [R_BOTELLA, -0.02, 0.02], [R_BOTELLA, 0.30, 0.004],
      [R_BOTELLA - 0.002, 0.335, 0.01], [R_BOTELLA - 0.002, 0.348, 0.002], [0.0235, 0.352, 0.002], [0.0235, 0.345, 0],
    ], 4), rad);
    orientar(bot, base, D_HORQ);
    l.add('delantera', 'horquilla', 'anodizado', bot);
    // Anillo del reten (goma) arriba de la botella.
    const reten = torno(redondear([[0.022, 0.349, 0], [0.0255, 0.350, 0.002], [0.0255, 0.362, 0.003], [0.022, 0.364, 0]], 2), rad);
    orientar(reten, base, D_HORQ);
    l.add('delantera', 'horquilla', 'goma_puno', reten);
    // Pie de eje: bosse transversal y tuerca/pinza en la cara exterior.
    const bosse = torno(redondear([[0, -0.03, 0], [0.021, -0.03, 0.004], [0.021, 0.03, 0.004], [0, 0.03, 0]], 3), seg(q, 24, 8));
    orientar(bosse, new THREE.Vector3(base.x, base.y, z), [0, 0, 1]);
    l.add('delantera', 'horquilla', 'anodizado', bosse);

    // Barra de cromo: entra 30 mm en la botella y sale sobre la tija superior con su tapón.
    const barra = torno(redondear([
      [0, 0.33, 0], [R_BARRA, 0.33, 0.002], [R_BARRA, 0.695, 0.002], [0.0165, 0.70, 0.002], [0, 0.70, 0],
    ], 2), rad);
    orientar(barra, base, D_HORQ);
    l.add('suspendida', 'horquilla', 'cromo', barra);
    // Tapón superior (aluminio, hexagonal con regulador).
    const tapon = torno(redondear([
      [0, 0.690, 0], [0.0195, 0.690, 0.001], [0.0195, 0.708, 0.002], [0.012, 0.712, 0.002], [0.008, 0.712, 0.001],
      [0.008, 0.722, 0.001], [0, 0.722, 0],
    ], 2), 6);
    l.add('suspendida', 'horquilla', 'anodizado', facetar(orientar(tapon, base, D_HORQ)));
  }
  // Eje delantero: pasa de lado a lado con tuercas en los extremos.
  const eje = torno(redondear([
    [0, -0.135, 0], [0.012, -0.135, 0.002], [0.012, -0.128, 0.001], [0.009, -0.126, 0], [0.009, 0.126, 0],
    [0.012, 0.128, 0.001], [0.012, 0.135, 0.002], [0, 0.135, 0],
  ], 2), seg(q, 16, 8));
  orientar(eje, new THREE.Vector3(0.725, 0.31, 0), [0, 0, 1]);
  l.add('delantera', 'rueda_del', 'aluminio', eje);
}
