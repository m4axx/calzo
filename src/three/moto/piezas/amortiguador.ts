// Amortiguadores traseros dobles (§4.2): cuerpo en torno, vástago de cromo,
// muelle sobre hélice de 9 espiras (radio 0,03, hilo Ø ~9 mm) y ojos de
// anclaje. De (−0,62; 0,385; ±0,13) a (−0,50; 0,78; ±0,12): el ojo inferior
// se sube 2,5 cm para apoyarse sobre el brazo del basculante, no dentro.
import * as THREE from 'three';
import { Helice, cajaR, orientar, redondear, seg, torno, tubo, type Calidad, type Lote } from '../geo.ts';

export function amortiguadores(q: Calidad, l: Lote): void {
  for (const s of [1, -1]) {
    const a = new THREE.Vector3(-0.62, 0.385, s * 0.13), b = new THREE.Vector3(-0.50, 0.78, s * 0.12);
    const eje = b.clone().sub(a);
    const L = eje.length();
    eje.normalize();
    // Cuerpo del amortiguador (abajo) y cápsula superior.
    const cuerpo = torno(redondear([
      [0.0, 0.012, 0], [0.013, 0.012, 0.004], [0.019, 0.03, 0.006], [0.019, 0.21, 0.004], [0.012, 0.222, 0.003], [0.0, 0.224, 0],
    ], 3), seg(q, 28, 10));
    l.add('suspendida', 'resto', 'anodizado', orientar(cuerpo, a, eje));
    const vastago = torno(redondear([[0.0, 0.2, 0], [0.0075, 0.2, 0.001], [0.0075, L - 0.05, 0.001], [0.0, L - 0.05, 0]], 1), seg(q, 16, 8));
    l.add('suspendida', 'resto', 'cromo', orientar(vastago, a, eje));
    const capsula = torno(redondear([
      [0.0, L - 0.07, 0], [0.02, L - 0.07, 0.004], [0.024, L - 0.055, 0.004], [0.024, L - 0.018, 0.006], [0.0, L - 0.012, 0],
    ], 3), seg(q, 28, 10));
    l.add('suspendida', 'resto', 'anodizado', orientar(capsula, a, eje));
    // Platillos del muelle (aluminio): el inferior con su tuerca de precarga.
    for (const [h0, h1] of [[0.058, 0.07], [L - 0.083, L - 0.071]] as const) {
      const plat = torno(redondear([[0.017, h0, 0], [0.037, h0, 0.002], [0.037, h1, 0.002], [0.017, h1, 0]], 2), seg(q, 32, 12));
      l.add('suspendida', 'resto', 'aluminio', orientar(plat, a, eje));
    }
    // Muelle: 9 espiras entre platillos.
    const h0 = a.clone().addScaledVector(eje, 0.075), h1 = a.clone().addScaledVector(eje, L - 0.088);
    const muelle = tubo(new Helice(h0, h1, 0.0295, 9), 0.0045, q, { radial: 8, pasos: 126, tapas: true });
    l.add('suspendida', 'resto', 'cromo', muelle);
    // Ojos de anclaje (eje en z) arriba y abajo.
    for (const p of [a.clone().addScaledVector(eje, 0.004), b.clone().addScaledVector(eje, -0.006)]) {
      const ojo = torno(redondear([[0.0, -0.014, 0], [0.016, -0.014, 0.003], [0.016, 0.014, 0.003], [0.0, 0.014, 0]], 2), seg(q, 24, 10));
      l.add('suspendida', 'resto', 'anodizado', orientar(ojo, p, [0, 0, 1]));
      const perno = torno(redondear([[0.0, 0.0, 0], [0.009, 0.0, 0.001], [0.009, 0.007, 0.0015], [0.0, 0.008, 0]], 2), 6);
      l.add('suspendida', 'resto', 'aluminio', orientar(perno, p.clone().setZ(p.z + s * 0.014), [0, 0, s]));
    }
    // Pletina inferior soldada al brazo del basculante.
    l.add('trasera', 'resto', 'anodizado', cajaR(0.04, 0.03, 0.012, 0.004, [a.x, a.y - 0.016, s * 0.13], q, 2));
  }
}
