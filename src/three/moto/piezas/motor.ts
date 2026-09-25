// Motor bicilíndrico en línea refrigerado por aire (§4.2). Cárter extruido
// del perfil de la spec (esquinas redondeadas, bisel 8 mm), dos cilindros en
// z ±0,07 inclinados 20° hacia delante con 11 aletas instanciadas cada uno,
// culata, tapa de balancines, tapas laterales de aluminio, carburadores con
// filtros y tornillería. Los filos de las aletas son lo que coge la luz.
import * as THREE from 'three';
import { cajaR, extruir, orientar, poligonoRedondo, redondear, seg, torno, type Calidad, type Lote } from '../geo.ts';
import { matTornillo, tornilloAllen } from './tijas.ts';

const INCL = (20 * Math.PI) / 180;
/** Eje de los cilindros (hacia arriba y adelante) y su perpendicular en el plano XY. */
export const EJE_CIL = new THREE.Vector3(Math.sin(INCL), Math.cos(INCL), 0);
const PERP = new THREE.Vector3(Math.cos(INCL), -Math.sin(INCL), 0);
export const BASE_CIL = new THREE.Vector3(0.10, 0.50, 0);

/** Punto a lo largo del cilindro: a = altura por el eje, p = desplazamiento hacia delante. */
export function enCilindro(a: number, p = 0, z = 0): THREE.Vector3 {
  return BASE_CIL.clone().addScaledVector(EJE_CIL, a).addScaledVector(PERP, p).setZ(z);
}

/** Caja redondeada alineada con el cilindro. */
function cajaCil(w: number, h: number, d: number, r: number, a: number, p: number, z: number, q: Calidad): THREE.BufferGeometry {
  const g = cajaR(w, h, d, r, [0, 0, 0], q, 2);
  g.rotateZ(-INCL);
  const c = enCilindro(a, p, z);
  g.translate(c.x, c.y, c.z);
  return g;
}

export function motor(q: Calidad, l: Lote): void {
  // Cárter.
  const esquinas: [number, number, number][] = [
    [0.22, 0.30, 0.03], [0.25, 0.42, 0.03], [0.10, 0.50, 0.04], [-0.12, 0.52, 0.03], [-0.20, 0.40, 0.04],
    [-0.15, 0.28, 0.04], [0.05, 0.24, 0.05],
  ];
  const carter = extruir(poligonoRedondo(esquinas, 5), 0.30, 0.008, q, 24, 3);
  l.add('suspendida', 'motor', 'fundicion', carter);

  // Tapas laterales Ø 0,16 (alternador a la izquierda, embrague a la derecha) y tornillería.
  const tornillos: THREE.Matrix4[] = [];
  const centroTapa = new THREE.Vector3(0.03, 0.375, 0);
  for (const s of [1, -1]) {
    // Cuerpo de fundición abombado y aro exterior de aluminio pulido: el filo es lo que brilla.
    const tapa = torno(redondear([
      [0.0, 0.004, 0], [0.066, 0.004, 0.006], [0.058, 0.018, 0.012], [0.03, 0.023, 0.02], [0.0, 0.024, 0],
    ], 4), seg(q, 56, 18));
    l.add('suspendida', 'motor', 'fundicion', orientar(tapa, centroTapa.clone().setZ(s * 0.154), [0, 0, s]));
    const aro = torno(redondear([
      [0.064, 0.0, 0], [0.084, 0.0, 0.003], [0.084, 0.009, 0.004], [0.075, 0.013, 0.004], [0.064, 0.012, 0],
    ], 3), seg(q, 56, 18));
    l.add('suspendida', 'motor', 'aluminio', orientar(aro, centroTapa.clone().setZ(s * 0.154), [0, 0, s]));
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2 + 0.2;
      const p = centroTapa.clone().add(new THREE.Vector3(Math.cos(a) * 0.074, Math.sin(a) * 0.074, s * 0.1665));
      tornillos.push(matTornillo(p, new THREE.Vector3(0, 0, s), k));
    }
  }
  // Tapa del piñón (izquierda), por donde sale la cadena.
  const tapaPinon = torno(redondear([[0.0, 0.0, 0], [0.05, 0.0, 0.004], [0.05, 0.012, 0.006], [0.0, 0.014, 0]], 3), seg(q, 36, 12));
  l.add('suspendida', 'motor', 'fundicion', orientar(tapaPinon, [-0.10, 0.34, 0.152], [0, 0, 1]));

  // Cilindros: camisa en torno y aletas instanciadas (11 por cilindro, cada 0,016).
  const aletas: THREE.Matrix4[] = [];
  for (const z of [0.07, -0.07]) {
    const camisa = torno(redondear([[0.044, -0.01, 0], [0.044, 0.185, 0]], 1), seg(q, 28, 10));
    l.add('suspendida', 'motor', 'fundicion', orientar(camisa, BASE_CIL.clone().setZ(z), EJE_CIL));
    for (let k = 0; k < 11; k++) {
      const a = 0.014 + k * 0.016;
      const e = 1 - 0.012 * k;              // escala decreciente hacia la culata
      const c = enCilindro(a, 0, z);
      aletas.push(new THREE.Matrix4().compose(c, new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -INCL), new THREE.Vector3(e, 1, e)));
    }
  }
  const aleta = cajaR(0.13, 0.004, 0.11, 0.0018, [0, 0, 0], q, 2);
  l.instancias('aletas', 'suspendida', 'motor', 'fundicion', aleta, aletas);

  // Culata común con tres aletas propias, y tapa de balancines de aluminio.
  l.add('suspendida', 'motor', 'fundicion', cajaCil(0.13, 0.05, 0.25, 0.01, 0.197, 0, 0, q));
  for (const a of [0.182, 0.197, 0.212]) l.add('suspendida', 'motor', 'fundicion', cajaCil(0.145, 0.004, 0.262, 0.0018, a, 0, 0, q));
  l.add('suspendida', 'motor', 'aluminio', cajaCil(0.10, 0.024, 0.18, 0.009, 0.232, -0.004, 0, q));
  for (const zb of [-0.07, 0.07]) {
    for (const pb of [-0.036, 0.036]) {
      const p = enCilindro(0.2445, pb, zb);
      tornillos.push(matTornillo(p, EJE_CIL.clone(), zb * 40 + pb));
    }
  }

  // Carburadores y filtros de cono detrás de la culata.
  for (const z of [0.062, -0.062]) {
    const toma = enCilindro(0.195, -0.06, z);
    const dir = new THREE.Vector3(-1, -0.12, 0).normalize();
    const carbu = torno(redondear([
      [0.0, -0.005, 0], [0.02, -0.005, 0.003], [0.02, 0.012, 0.003], [0.025, 0.016, 0.004], [0.025, 0.05, 0.006],
      [0.02, 0.056, 0.003], [0.02, 0.07, 0], [0.0, 0.07, 0],
    ], 3), seg(q, 28, 10));
    l.add('suspendida', 'motor', 'aluminio', orientar(carbu, toma, dir));
    const filtro = torno(redondear([
      [0.0, 0.066, 0], [0.021, 0.066, 0.003], [0.028, 0.075, 0.004], [0.028, 0.118, 0.008], [0.0, 0.12, 0],
    ], 4), seg(q, 28, 10));
    l.add('suspendida', 'motor', 'anodizado', orientar(filtro, toma, dir));
  }

  l.instancias('tornillos_motor', 'suspendida', 'motor', 'anodizado', tornilloAllen(q, 0.0042, 0.004), tornillos);
}
