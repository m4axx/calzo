// Faro redondo (§4.2): carcasa en torno Ø 0,18 × 0,12 en (0,60; 0,88; 0),
// aro cromado, reflector parabólico de cromo visible alrededor de una lente
// central de proyector, y el aro emisivo (luz de posición) junto al bisel.
// Orejas de sujeción a las barras entre las tijas.
import * as THREE from 'three';
import { D_HORQ, collarin, ejeHorquilla, orientar, redondear, rutaCodos, seg, torno, tubo, type Calidad, type Lote } from '../geo.ts';
import { R_BARRA, Z_HORQ } from './horquilla.ts';

export function faro(q: Calidad, l: Lote): void {
  const c = new THREE.Vector3(0.60, 0.88, 0);
  const eje = new THREE.Vector3(1, -0.04, 0).normalize();
  const segs = seg(q, 48, 20);
  // Carcasa: del culo redondeado (y = −0,09) a la boca (y = 0,03), radio 0,09.
  const carcasa = torno(redondear([
    [0.0, -0.092, 0], [0.05, -0.088, 0.03], [0.086, -0.03, 0.03], [0.09, 0.02, 0.004], [0.0855, 0.026, 0],
  ], 6), segs);
  l.add('suspendida', 'resto', 'pintura', orientar(carcasa, c, eje));
  // Aro cromado de la boca.
  const aro = torno(redondear([
    [0.0845, 0.018, 0], [0.0915, 0.02, 0.002], [0.0925, 0.028, 0.003], [0.087, 0.033, 0.002], [0.079, 0.031, 0],
  ], 3), segs);
  l.add('suspendida', 'resto', 'cromo', orientar(aro, c, eje));
  // Reflector parabólico: y = k·r², visto desde delante (normales hacia fuera del cuenco).
  const par: THREE.Vector2[] = [];
  const n = 12;
  for (let i = n; i >= 0; i--) {
    const r = 0.03 + (0.079 - 0.03) * (i / n);
    par.push(new THREE.Vector2(r, 0.028 - (0.079 * 0.079 - r * r) * 5.2));
  }
  l.add('suspendida', 'resto', 'cromo', orientar(torno(par, segs), c, eje));
  // Lente del proyector central, abombada.
  const lente = torno(redondear([[0.031, -0.005, 0], [0.032, 0.0, 0.002], [0.026, 0.012, 0.006], [0.0, 0.016, 0]], 4), seg(q, 40, 14));
  const baseLente = c.clone().addScaledVector(eje, -0.004);
  l.add('suspendida', 'resto', 'faro_lente', orientar(lente, baseLente, eje));
  // Aro emisivo de posición, apenas dentro del bisel.
  const luz = torno(redondear([[0.0765, 0.0265, 0], [0.0765, 0.0285, 0.0005], [0.0715, 0.0285, 0.0005], [0.0715, 0.0265, 0]], 1), segs);
  l.add('suspendida', 'resto', 'faro_aro', orientar(luz, c, eje));

  // Orejas: de una abrazadera en cada barra (t 0,58) al costado de la carcasa.
  for (const s of [1, -1]) {
    const pb = ejeHorquilla(0.585, 0, s * Z_HORQ);
    l.add('suspendida', 'resto', 'anodizado', collarin(pb, D_HORQ, R_BARRA, q, 0.0042));
    const abraz = torno(redondear([[R_BARRA, -0.012, 0], [R_BARRA + 0.004, -0.011, 0.002], [R_BARRA + 0.004, 0.011, 0.002], [R_BARRA, 0.012, 0]], 2), seg(q, 28, 10));
    l.add('suspendida', 'resto', 'anodizado', orientar(abraz, pb, D_HORQ));
    const lado = c.clone().add(new THREE.Vector3(-0.035, -0.004, s * 0.083));
    const salida = pb.clone().add(new THREE.Vector3(0.024, 0, 0));
    const oreja = tubo(rutaCodos([salida, salida.clone().add(new THREE.Vector3(0.03, 0.006, -s * 0.004)), lado], 0.02), 0.0075, q, { radial: 14, tapas: [false, true] });
    l.add('suspendida', 'resto', 'anodizado', oreja);
    // Tornillo de la oreja en el costado de la carcasa.
    const perno = torno(redondear([[0, 0, 0], [0.0085, 0, 0.001], [0.0085, 0.006, 0.002], [0, 0.007, 0]], 2), seg(q, 18, 8));
    l.add('suspendida', 'resto', 'aluminio', orientar(perno, lado.clone().add(new THREE.Vector3(0, 0, s * 0.004)), [0, 0, s]));
  }
}
