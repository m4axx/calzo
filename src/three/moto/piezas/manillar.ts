// Manillar y mandos (§4.2): tubo Ø 0,022 sobre rectas y codos, puños con
// moleteado, contrapesos, piñas, bomba de freno (derecha, −z), maneta de
// embrague (izquierda, +z) y reloj. Todo en el grupo suspendido.
import * as THREE from 'three';
import {
  cajaR, extruir, orientar, redondear, rutaCodos, seg, torno, tubo,
  type Calidad, type Lote,
} from '../geo.ts';

const R_MAN = 0.011;

/** Punto y dirección del tramo recto exterior del manillar, lado s (+1 izquierda, −1 derecha). */
function tramoExterior(s: number): { a: THREE.Vector3; b: THREE.Vector3; dir: THREE.Vector3 } {
  const a = new THREE.Vector3(0.43, 0.97, s * 0.20), b = new THREE.Vector3(0.40, 0.99, s * 0.38);
  return { a, b, dir: b.clone().sub(a).normalize() };
}

/** Punto del tramo exterior a una z dada (|z| entre 0,20 y 0,38). */
function enZ(s: number, z: number): THREE.Vector3 {
  const { a, b } = tramoExterior(s);
  return a.clone().lerp(b, (Math.abs(z) - 0.20) / 0.18);
}

/** Maneta: hoja fina con bola en la punta, vista en planta; extruida 7 mm. */
function formaManeta(): THREE.Shape {
  const s = new THREE.Shape();
  const pts = redondear([
    [0.0, -0.012, 0], [0.03, -0.014, 0.01], [0.07, -0.006, 0.02], [0.15, 0.0, 0.02], [0.165, 0.006, 0.006],
    [0.16, 0.013, 0.006], [0.07, 0.006, 0.02], [0.028, 0.012, 0.01], [0.0, 0.012, 0],
  ], 4);
  s.setFromPoints(pts);
  return s;
}

export function manillar(q: Calidad, l: Lote): void {
  const ruta = rutaCodos([
    [0.40, 0.99, 0.38], [0.43, 0.97, 0.20], [0.44, 0.955, 0], [0.43, 0.97, -0.20], [0.40, 0.99, -0.38],
  ], 0.06);
  l.add('suspendida', 'mandos', 'cromo', tubo(ruta, R_MAN, q, { radial: 18, pasos: 12 }));

  for (const s of [1, -1]) {
    const { dir } = tramoExterior(s);
    // Puño Ø 0,032 × 0,13 con reborde interior, del extremo hacia dentro.
    const p0 = enZ(s, 0.38 - 0.132);
    const puno = torno(redondear([
      [R_MAN, -0.002, 0], [0.0205, 0.0, 0.002], [0.0205, 0.008, 0.002], [0.016, 0.012, 0.003], [0.016, 0.124, 0.004],
      [0.0145, 0.132, 0.003], [0.0118, 0.132, 0],
    ], 3), seg(q, 28, 12));
    l.add('suspendida', 'mandos', 'goma_puno', orientar(puno, p0, dir));
    // Contrapeso del extremo (tapa del manillar).
    const pF = enZ(s, 0.38);
    const peso = torno(redondear([
      [0.0, 0.0, 0], [0.0145, 0.0, 0.002], [0.0165, 0.004, 0.003], [0.0165, 0.018, 0.004], [0.0, 0.022, 0],
    ], 3), seg(q, 24, 10));
    l.add('suspendida', 'mandos', 'aluminio', orientar(peso, pF.clone().addScaledVector(dir, -0.0015), dir));

    // Piña de mandos, abrazando el manillar por dentro del puño.
    const pc = enZ(s, 0.228);
    const pina = cajaR(0.05, 0.04, 0.035, 0.009, [0, 0, 0], q, 3);
    pina.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, s), dir));
    pina.translate(pc.x, pc.y - 0.003, pc.z);
    l.add('suspendida', 'mandos', 'anodizado', pina);

    // Soporte de maneta (bomba a la derecha, embrague a la izquierda).
    const ps = enZ(s, 0.19);
    const cuerpo = cajaR(0.034, 0.03, s < 0 ? 0.05 : 0.036, 0.007, [0, 0, 0], q, 2);
    cuerpo.translate(ps.x + 0.006, ps.y, ps.z);
    l.add('suspendida', 'mandos', s < 0 ? 'aluminio' : 'anodizado', cuerpo);
    if (s < 0) {
      // Depósito de líquido de frenos sobre la bomba.
      const dep = torno(redondear([
        [0, 0, 0], [0.016, 0, 0.003], [0.016, 0.022, 0.004], [0.0, 0.024, 0],
      ], 3), seg(q, 20, 10));
      l.add('suspendida', 'mandos', 'aluminio', orientar(dep, new THREE.Vector3(ps.x + 0.004, ps.y + 0.014, ps.z - 0.004), [-0.2, 1, 0]));
    }
    // Maneta: sale del soporte hacia fuera, por delante del puño.
    const man = extruir(formaManeta(), 0.007, 0.0015, q, 20, 2);
    // Base de la maneta: X a lo largo del puño (algo abierta hacia delante), Y hacia delante, Z el grosor.
    const L = dir.clone().add(new THREE.Vector3(0.1, -0.02, 0)).normalize();
    const F = new THREE.Vector3(1, 0, 0).addScaledVector(L, -L.x).normalize();
    const U3 = new THREE.Vector3().crossVectors(L, F);
    man.applyMatrix4(new THREE.Matrix4().makeBasis(L, F, U3).setPosition(ps.x + 0.03, ps.y - 0.008, ps.z));
    l.add('suspendida', 'mandos', 'aluminio', man);
  }

  // Reloj Ø 0,11 en (0,46; 1,02; 0), mirando al piloto y arriba.
  const eje = new THREE.Vector3(-0.55, 0.84, 0).normalize();
  const c = new THREE.Vector3(0.46, 1.02, 0);
  const cuerpoR = torno(redondear([
    [0.0, -0.035, 0], [0.034, -0.035, 0.012], [0.052, -0.012, 0.01], [0.055, 0.0, 0.003], [0.049, 0.004, 0],
  ], 4), seg(q, 48, 16));
  l.add('suspendida', 'mandos', 'pintura', orientar(cuerpoR, c, eje));
  const bisel = torno(redondear([
    [0.0485, 0.002, 0], [0.0555, 0.0, 0.0015], [0.0565, 0.006, 0.002], [0.051, 0.009, 0.0015], [0.046, 0.007, 0],
  ], 2), seg(q, 48, 16));
  l.add('suspendida', 'mandos', 'cromo', orientar(bisel, c, eje));
  const cristal = torno(redondear([[0.047, 0.004, 0], [0.03, 0.0065, 0], [0.0, 0.0075, 0]], 2), seg(q, 48, 16));
  l.add('suspendida', 'mandos', 'faro_lente', orientar(cristal, c, eje));
  // Soporte del reloj a la tija superior.
  const soporte = tubo(rutaCodos([c.clone().addScaledVector(eje, -0.03), [0.45, 0.935, 0]], 0.01), 0.008, q, { radial: 12 });
  l.add('suspendida', 'mandos', 'anodizado', soporte);
}
