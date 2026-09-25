// Tijas (§4.2): la pieza con más densidad de detalle, porque es el primer
// plano de la pausa `tija`. Placa extruida con bosses alrededor de las barras
// y de la pipa, bisel de 3 mm, orejetas de apriete con su ranura, tornillos
// Allen instanciados, tuerca de dirección y torretas del manillar.
import * as THREE from 'three';
import {
  D_HORQ, W_HORQ, base, cajaR, collarin, ejeHorquilla, extruir, facetar, orientar, redondear, seg, torno, unir,
  type Calidad, type Lote,
} from '../geo.ts';
import { R_BARRA, Z_HORQ } from './horquilla.ts';

export const T_TIJA_INF = 0.50;
export const T_TIJA_SUP = 0.66;
export const W_PIPA = 0;          // la pipa va en el eje de la horquilla (§4.1): el depósito empieza justo detrás
export const R_PIPA = 0.027;
const EX = new THREE.Vector3(0, 0, 1);

/** Base local de una tija: X = z del rig, Y = w (delante), Z = d (eje de la horquilla). */
export function marcoTija(t: number): THREE.Matrix4 {
  return base(ejeHorquilla(t), EX, W_HORQ, D_HORQ);
}

/** Semiancho y saliente de la oreja de apriete delante de cada boss. */
const OREJA_W = 0.022, OREJA_S = 0.012;

/**
 * Contorno de la tija en su plano (X = z, Y = w; +Y hacia delante): barra con
 * bosses alrededor de las barras y de la pipa, y una oreja de apriete delante
 * de cada boss (donde van la ranura y los pernos, a la vista de la cámara).
 */
function formaTija(rBoss: number, rPipa: number): THREE.Shape {
  const s = new THREE.Shape();
  const zf = Z_HORQ, wp = W_PIPA, ow = OREJA_W, ye = rBoss + OREJA_S, f = 0.006;
  const a = (g: number) => (g * Math.PI) / 180;
  const y1 = Math.sqrt(rBoss * rBoss - ow * ow);
  const th1 = Math.atan2(y1, ow);
  s.moveTo(0, rBoss);
  // Oreja del boss izquierdo (+z).
  s.lineTo(zf - ow - f, rBoss);
  s.quadraticCurveTo(zf - ow, rBoss, zf - ow, rBoss + f);
  s.lineTo(zf - ow, ye - f);
  s.quadraticCurveTo(zf - ow, ye, zf - ow + f, ye);
  s.lineTo(zf + ow - f, ye);
  s.quadraticCurveTo(zf + ow, ye, zf + ow, ye - f);
  s.lineTo(zf + ow, y1);
  // Boss izquierdo, pipa y boss derecho por detrás (sentido horario).
  s.absarc(zf, 0, rBoss, th1, a(-65), true);
  s.quadraticCurveTo(0.055, wp - 0.004, rPipa * Math.cos(a(-25)), wp + rPipa * Math.sin(a(-25)));
  s.absarc(0, wp, rPipa, a(-25), a(-155), true);
  s.quadraticCurveTo(-0.055, wp - 0.004, -zf + rBoss * Math.cos(a(-115)), rBoss * Math.sin(a(-115)));
  s.absarc(-zf, 0, rBoss, a(-115), -Math.PI - th1, true);
  // Oreja del boss derecho (−z).
  s.lineTo(-zf - ow, ye - f);
  s.quadraticCurveTo(-zf - ow, ye, -zf - ow + f, ye);
  s.lineTo(-zf + ow - f, ye);
  s.quadraticCurveTo(-zf + ow, ye, -zf + ow, ye - f);
  s.lineTo(-zf + ow, rBoss + f);
  s.quadraticCurveTo(-zf + ow, rBoss, -zf + ow + f, rBoss);
  s.lineTo(0, rBoss);
  // Taladros de las barras y de la tuerca de la pipa (el bisel los cierra 3 mm).
  for (const z of [zf, -zf]) {
    const h = new THREE.Path();
    h.absarc(z, 0, R_BARRA + 0.003, 0, Math.PI * 2, true);
    s.holes.push(h);
  }
  const hp = new THREE.Path();
  hp.absarc(0, wp, 0.011, 0, Math.PI * 2, true);
  s.holes.push(hp);
  return s;
}

/** Tornillo Allen de cabeza cilíndrica, mirando a +Y, con el hexágono hundido. */
export function tornilloAllen(q: Calidad, r = 0.0048, h = 0.0048): THREE.BufferGeometry {
  const rs = r * 0.48;
  const cabeza = torno(redondear([
    [r * 0.9, -0.002, 0], [r, -0.0015, 0], [r, h, r * 0.18], [rs * 1.02, h, 0],
  ], 2), seg(q, 12, 8));
  // Hueco hexagonal: paredes de seis caras mirando hacia dentro y fondo mirando arriba
  // (el perfil baja por la pared y entra hacia el eje: normales (dy, −dx) hacia dentro).
  const hueco = facetar(torno([
    new THREE.Vector2(rs, h + 0.0001), new THREE.Vector2(rs, h - h * 0.62), new THREE.Vector2(0, h - h * 0.62),
  ], 6, Math.PI / 6));
  return unir([cabeza, hueco]);
}

/** Matriz para un tornillo con la cabeza en p mirando hacia `dir`. */
export function matTornillo(p: THREE.Vector3, dir: THREE.Vector3, giro = 0): THREE.Matrix4 {
  const qa = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  const qg = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro);
  return new THREE.Matrix4().compose(p, qa.multiply(qg), new THREE.Vector3(1, 1, 1));
}

/** Una tija: placa, collarines, ranuras y pernos. Devuelve su marco local. */
function tija(q: Calidad, l: Lote, t: number, grosor: number, rBoss: number, nPernos: number, tornillos: THREE.Matrix4[]): THREE.Matrix4 {
  const M = marcoTija(t);
  const g = extruir(formaTija(rBoss, 0.031), grosor, 0.003, q, 20, 2);
  g.applyMatrix4(M);
  l.add('suspendida', 'tija', 'aluminio', g);
  // Collarines: aro fino donde cada barra entra y sale de la tija (cara superior e inferior).
  for (const z of [Z_HORQ, -Z_HORQ]) {
    for (const lado of [-1, 1]) {
      const p = new THREE.Vector3(z, 0, lado * (grosor / 2 + 0.0012)).applyMatrix4(M);
      l.add('suspendida', 'tija', 'cromo', collarin(p, D_HORQ, R_BARRA, q, 0.0022));
    }
  }
  // Ranura de apriete: una lámina oscura de 1,6 mm que asoma apenas por delante y por las caras.
  for (const s of [-1, 1]) {
    const largo = rBoss + OREJA_S - R_BARRA;
    const ranura = cajaR(0.0016, largo + 0.001, grosor + 0.0012, 0.0005, [s * Z_HORQ, R_BARRA + largo / 2 + 0.0006, 0], q, 1);
    ranura.applyMatrix4(M);
    l.add('suspendida', 'tija', 'anodizado', ranura);
    // Pernos transversales: cabeza en la cara exterior de la oreja, mirando hacia fuera.
    for (let k = 0; k < nPernos; k++) {
      const dz = nPernos === 1 ? 0 : (k - 0.5) * (grosor * 0.46);
      const p = new THREE.Vector3(s * (Z_HORQ + OREJA_W + 0.0003), rBoss + OREJA_S * 0.45, dz).applyMatrix4(M);
      const dir = new THREE.Vector3(s, 0, 0).transformDirection(M);
      tornillos.push(matTornillo(p, dir, k * 0.4 + s));
    }
  }
  return M;
}

/** Tija inferior (t 0,50; grosor 0,03; dos pernos por lado). */
export function tijaInferior(q: Calidad, l: Lote): void {
  const tornillos: THREE.Matrix4[] = [];
  tija(q, l, T_TIJA_INF, 0.03, 0.036, 2, tornillos);
  l.instancias('tornillos_tija', 'suspendida', 'tija', 'anodizado', tornilloAllen(q), tornillos);
}

/** Tija superior (t 0,66; grosor 0,025; un perno por lado), pipa, tuerca de dirección y torretas. */
export function tijaSuperior(q: Calidad, l: Lote): void {
  const tornillos: THREE.Matrix4[] = [];
  const Ms = tija(q, l, T_TIJA_SUP, 0.025, 0.034, 1, tornillos);

  // Pipa de dirección (chasis) entre las tijas, con sus tazas.
  const pipaBase = ejeHorquilla(0, W_PIPA);
  const pipa = torno(redondear([
    [0.022, T_TIJA_INF + 0.016, 0], [R_PIPA + 0.004, T_TIJA_INF + 0.018, 0.002], [R_PIPA + 0.004, T_TIJA_INF + 0.03, 0.002],
    [R_PIPA, T_TIJA_INF + 0.034, 0.003], [R_PIPA, T_TIJA_SUP - 0.03, 0.003], [R_PIPA + 0.004, T_TIJA_SUP - 0.026, 0.002],
    [R_PIPA + 0.004, T_TIJA_SUP - 0.0135, 0.002], [0.022, T_TIJA_SUP - 0.0125, 0],
  ], 3), seg(q, 32, 12));
  orientar(pipa, pipaBase, D_HORQ);
  l.add('suspendida', 'resto', 'anodizado', pipa);

  // Tuerca de la dirección sobre la tija superior (hexagonal, aluminio) y arandela.
  const tSup = T_TIJA_SUP + 0.0125;
  const arandela = torno(redondear([[0.009, 0, 0], [0.019, 0, 0.001], [0.019, 0.002, 0.0008], [0.009, 0.002, 0]], 1), seg(q, 28, 10));
  orientar(arandela, ejeHorquilla(tSup, W_PIPA), D_HORQ);
  l.add('suspendida', 'tija', 'cromo', arandela);
  const tuerca = torno(redondear([[0.006, 0.0015, 0], [0.0165, 0.0015, 0.0012], [0.0165, 0.013, 0.0016], [0.009, 0.0145, 0.001], [0.006, 0.0145, 0]], 2), 6, Math.PI / 6);
  l.add('suspendida', 'tija', 'aluminio', facetar(orientar(tuerca, ejeHorquilla(tSup, W_PIPA), D_HORQ)));

  // Torretas del manillar: base cilíndrica y abrazadera partida con dos tornillos.
  // El centro del manillar está en (0,44; 0,955; 0).
  const centro = new THREE.Vector3(0.44, 0.955, 0);
  const inv = Ms.clone().invert();
  const cLocal = centro.clone().applyMatrix4(inv);
  for (const s of [-1, 1]) {
    const x = s * 0.042;
    const torreta = torno(redondear([
      [0, 0.0125, 0], [0.0135, 0.0125, 0.002], [0.0125, cLocal.z - 0.012, 0.004], [0.0125, cLocal.z, 0], [0, cLocal.z, 0],
    ], 3), seg(q, 24, 10));
    torreta.translate(0, 0, 0);
    // Torno sobre +Y → lo llevamos a +Z local (d) y a su sitio en la tija.
    torreta.rotateX(Math.PI / 2);
    torreta.translate(x, cLocal.y, 0);
    torreta.applyMatrix4(Ms);
    l.add('suspendida', 'tija', 'anodizado', torreta);
    // Abrazadera (tapa superior) que abraza el manillar.
    const tapaA = cajaR(0.026, 0.03, 0.02, 0.006, [0, 0, 0], q, 3);
    const m = new THREE.Matrix4().makeTranslation(x, cLocal.y, cLocal.z + 0.008);
    tapaA.applyMatrix4(m).applyMatrix4(Ms);
    l.add('suspendida', 'tija', 'aluminio', tapaA);
    for (const dy of [-0.009, 0.009]) {
      const p = new THREE.Vector3(x, cLocal.y + dy, cLocal.z + 0.018).applyMatrix4(Ms);
      tornillos.push(matTornillo(p, D_HORQ.clone(), dy * 100));
    }
  }

  l.instancias('tornillos_tija', 'suspendida', 'tija', 'anodizado', tornilloAllen(q), tornillos);
}
