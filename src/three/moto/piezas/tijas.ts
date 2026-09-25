// Tijas (§4.2): la pieza con más densidad de detalle, porque es el primer
// plano de la pausa `tija`. Placa extruida con bosses alrededor de las barras
// y de la pipa, bisel de 3 mm, orejetas de apriete con su ranura, tornillos
// Allen instanciados, tuerca de dirección y torretas del manillar.
import * as THREE from 'three';
import {
  D_HORQ, W_HORQ, base, cajaR, ejeHorquilla, extruir, facetar, orientar, redondear, seg, torno, unir,
  type Calidad, type Lote,
} from '../geo.ts';
import { R_BARRA, Z_HORQ } from './horquilla.ts';

export const T_TIJA_INF = 0.50;
export const T_TIJA_SUP = 0.66;
export const W_PIPA = -0.03;       // la pipa va 3 cm por detrás del plano de las barras
export const R_PIPA = 0.027;
const EX = new THREE.Vector3(0, 0, 1);

/** Base local de una tija: X = z del rig, Y = w (delante), Z = d (eje de la horquilla). */
export function marcoTija(t: number): THREE.Matrix4 {
  return base(ejeHorquilla(t), EX, W_HORQ, D_HORQ);
}

/** Contorno de la tija en su plano (X = z, Y = w), en sentido antihorario. */
function formaTija(rBoss: number, rPipa: number): THREE.Shape {
  const s = new THREE.Shape();
  const zf = Z_HORQ, wp = W_PIPA;
  const a = (g: number) => (g * Math.PI) / 180;
  s.moveTo(zf, rBoss);
  s.lineTo(-zf, rBoss);
  s.absarc(-zf, 0, rBoss, a(90), a(245), false);
  s.quadCurveTo(-0.055, wp - 0.004, rPipa * Math.cos(a(205)), wp + rPipa * Math.sin(a(205)));
  s.absarc(0, wp, rPipa, a(205), a(335), false);
  s.quadCurveTo(0.055, wp - 0.004, zf + rBoss * Math.cos(a(-65)), rBoss * Math.sin(a(-65)));
  s.absarc(zf, 0, rBoss, a(-65), a(90), false);
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
    [r * 0.9, -0.002, 0], [r, -0.0015, 0.0004], [r, h, r * 0.18], [rs * 1.02, h, 0],
  ], 2), seg(q, 20, 10));
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

export function tijas(q: Calidad, l: Lote): void {
  const tornillos: THREE.Matrix4[] = [];
  const tija = (t: number, grosor: number, rBoss: number, nPernos: number) => {
    const M = marcoTija(t);
    const g = extruir(formaTija(rBoss, 0.031), grosor, 0.003, q, 40, 3);
    g.applyMatrix4(M);
    l.add('suspendida', 'tija', 'aluminio', g);
    // Orejetas de apriete detrás de cada boss, partidas por la ranura (1,6 mm).
    for (const s of [-1, 1]) {
      for (const lado of [-1, 1]) {
        const ancho = 0.022;
        const o = cajaR(ancho, 0.026, grosor - 0.002, 0.003, [s * Z_HORQ + lado * (ancho / 2 + 0.0008), -rBoss - 0.006, 0], q, 2);
        o.applyMatrix4(M);
        l.add('suspendida', 'tija', 'aluminio', o);
      }
      // Pernos transversales: cabeza en la cara exterior de la orejeta, mirando hacia fuera.
      for (let k = 0; k < nPernos; k++) {
        const dz = nPernos === 1 ? 0 : (k - 0.5) * (grosor * 0.46);
        const p = new THREE.Vector3(s * (Z_HORQ + 0.0228), -rBoss - 0.007, dz).applyMatrix4(M);
        const dir = new THREE.Vector3(s, 0, 0).transformDirection(M);
        tornillos.push(matTornillo(p, dir, k * 0.4 + s));
      }
    }
    return M;
  };
  tija(T_TIJA_INF, 0.03, 0.036, 2);
  const Ms = tija(T_TIJA_SUP, 0.025, 0.034, 1);

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
    l.add('suspendida', 'tija', 'aluminio', torreta);
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
