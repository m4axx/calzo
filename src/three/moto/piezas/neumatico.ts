// Neumáticos (§4.2): torno de sección redondeada (24 puntos: talón, flanco,
// hombro y banda) girado para eje Z. La huella se aplana en y_local 0,006:
// un parche plano de 6 mm, que es lo que hace que la moto «pese».
import * as THREE from 'three';
import { APOYO_HUELLA } from '../../contrato-tipos.ts';
import { orientar, seg, superelipse, torno, type Calidad } from '../geo.ts';

export const R_RUEDA = 0.31;
export const R_TALON = 0.216;

export function neumatico(q: Calidad, x: number, ancho: number): THREE.BufferGeometry {
  // Sección casi elíptica: centro radial rc, semiejes (ar, az). El talón se
  // cierra dentro de la pestaña de la llanta, donde no se ve.
  const az = ancho / 2, ar = 0.056, rc = R_RUEDA - ar;
  const perfil: THREE.Vector2[] = [];
  perfil.push(new THREE.Vector2(R_TALON - 0.007, -az * 0.72));
  const n = 22;
  const a0 = -Math.PI * 0.72, a1 = Math.PI * 0.72;   // de talón a talón pasando por la banda
  for (let i = 0; i < n; i++) {
    const a = a0 + (a1 - a0) * (i / (n - 1));
    // a = 0 es la banda (radio máximo). Exponente 2,3: flanco algo recto.
    const [c, s] = superelipse(a, 2.3);
    perfil.push(new THREE.Vector2(rc + ar * c, az * s));
  }
  // El talón se mete bajo la pestaña de la llanta, donde no se ve.
  perfil.push(new THREE.Vector2(R_TALON - 0.007, az * 0.72));
  const g = torno(perfil, seg(q, 96, 24));
  orientar(g, [x, R_RUEDA, 0], [0, 0, 1]);
  // Huella: todo lo que queda por debajo de 6 mm se aplana y mira abajo.
  const p = g.getAttribute('position') as THREE.BufferAttribute;
  const nr = g.getAttribute('normal') as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    if (p.getY(i) < APOYO_HUELLA) {
      p.setY(i, APOYO_HUELLA);
      nr.setXYZ(i, 0, -1, 0);
    }
  }
  return g;
}
