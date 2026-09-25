// Planos de cámara (§4.9; valores de partida, revisados con la moto real:
// héroe, cierre, am.bajo y am.horquilla se alejan para que la moto quepa). Solo datos y orientaciones
// precalculadas: la resolución (encuadre por setViewOffset y encaje compacto)
// la hace el director, que conoce el rig y el viewport.
import * as THREE from 'three';
import type { Plano, PlanoId, Vec3 } from './contrato-tipos.ts';

export const PLANOS: Readonly<Record<PlanoId, Plano>> = {
  'pieza.a': { pos: [4.03, 1.01, 3.38], mira: [0.00, 0.52, 0.00], fov: 26, punto: 'contactos', encuadre: [0.67, 0.72], encuadreCompacto: [0.5, 0.80], encajeCompacto: 'rig' },
  'pieza.b': { pos: [3.50, 0.57, 2.86], mira: [0.05, 0.50, 0.00], fov: 24, punto: 'contactos', encuadre: [0.67, 0.72], encuadreCompacto: [0.5, 0.80], encajeCompacto: 'rig' },
  'am.bajo': { pos: [3.39, 0.79, 3.05], mira: [0.20, 0.50, 0.00], fov: 24, punto: 'origen', encuadre: [0.62, 0.76], encuadreCompacto: [0.5, 0.64], encajeCompacto: 'rig' },
  'am.rueda': { pos: [1.95, 0.32, 1.05], mira: [0.80, 0.24, 0.00], fov: 22, punto: 'hs_rueda', encuadre: [0.64, 0.52], encuadreCompacto: [0.5, 0.62], encajeCompacto: null, masA: true },
  'am.calzo': { pos: [1.85, 0.32, 0.95], mira: [0.85, 0.15, 0.00], fov: 22, punto: 'anc_calzo', encuadre: [0.64, 0.62], encuadreCompacto: [0.5, 0.66], encajeCompacto: null, masA: true },
  'am.tija': { pos: [1.25, 1.05, 0.70], mira: [0.50, 0.80, 0.02], fov: 20, punto: 'hs_tija', encuadre: [0.64, 0.50], encuadreCompacto: [0.5, 0.60], encajeCompacto: null, masA: true },
  'am.delanteras': { pos: [2.35, 0.85, 1.75], mira: [0.85, 0.40, 0.00], fov: 24, punto: 'mira', encuadre: [0.62, 0.52], encuadreCompacto: [0.64, 0.60], encajeCompacto: 'rig', masA: true },
  'am.traseras': {
    pos: { de: [0.60, 0.75, -3.10], a: [-0.60, 0.75, -3.10] },
    mira: { de: [0.10, 0.40, 0.00], a: [-0.55, 0.38, 0.00] },
    fov: 26, punto: 'mira', encuadre: [0.55, 0.55], encuadreCompacto: [0.5, 0.60], encajeCompacto: 'rig', masA: true,
  },
  'am.horquilla': { pos: [1.78, 0.66, -1.97], mira: [0.62, 0.52, -0.10], fov: 18, punto: 'hs_horquilla', encuadre: [0.60, 0.50], encuadreCompacto: [0.5, 0.58], encajeCompacto: null, masA: true },
  'am.grua1': { pos: [2.00, 2.60, -1.20], mira: [0.00, 0.30, 0.00], fov: 28, punto: 'origen', encuadre: [0.5, 0.5], encajeCompacto: 'x', masA: true },
  'am.cenital': {
    pos: [0.00, 5.50, 0.00], mira: [0.00, 0.00, 0.00], fov: 30, punto: 'origen',
    encuadre: [0.5, 0.46], encuadreCompacto: [0.5, 0.5], arriba: [0, 0, -1], arribaCompacto: [1, 0, 0], encajeCompacto: 'x', masA: true,
  },
  // Fotos del parte: el punto (0; 0,5; 0) de la moto subida, centrado en la captura.
  'parte.A': { pos: [2.30, 0.80, 2.00], mira: [0.30, 0.52, 0.00], fov: 26, punto: [0, 0.5, 0], encuadre: [0.5, 0.5], encajeCompacto: null, masA: true },
  'parte.B': { pos: [-2.10, 0.95, 2.20], mira: [-0.25, 0.55, 0.00], fov: 26, punto: [0, 0.5, 0], encuadre: [0.5, 0.5], encajeCompacto: null, masA: true },
  'parte.C': { pos: [-2.10, 0.95, -2.20], mira: [-0.25, 0.55, 0.00], fov: 26, punto: [0, 0.5, 0], encuadre: [0.5, 0.5], encajeCompacto: null, masA: true },
  'parte.D': { pos: [2.30, 0.80, -2.00], mira: [0.30, 0.52, 0.00], fov: 26, punto: [0, 0.5, 0], encuadre: [0.5, 0.5], encajeCompacto: null, masA: true },
  // La rima con el héroe: pieza.b subido 17,5 cm. El punto es fijo en el mundo:
  // la moto empieza por encima de él (plataforma arriba) y acaba por debajo.
  'cierre.a': { pos: [3.50, 0.74, 2.86], mira: [0.05, 0.675, 0.00], fov: 24, punto: [0, 0.175, 0], encuadre: [0.66, 0.62], encuadreCompacto: [0.5, 0.70], encajeCompacto: 'rig' },
  'cierre.b': { pos: [3.39, 0.74, 2.77], mira: [0.05, 0.675, 0.00], fov: 24, punto: [0, 0.175, 0], encuadre: [0.66, 0.62], encuadreCompacto: [0.5, 0.70], encajeCompacto: 'rig' },
};

/** Spline izquierdo y derecho del amarre (§4.9). Entre ellos, el corte seco de traseras. */
export const SPLINE_IZQ: readonly PlanoId[] = ['am.bajo', 'am.rueda', 'am.calzo', 'am.tija', 'am.delanteras'];
export const SPLINE_DER: readonly PlanoId[] = ['am.traseras', 'am.horquilla', 'am.grua1', 'am.cenital'];

/** Subida de la plataforma que suman los planos +A. */
export const ALTURA_A = 0.35;

/** Apoyo con el que se calcula el encaje por caja (el rig «en su sitio» para ese plano). */
export function apoyoEncaje(id: PlanoId): number {
  const p = PLANOS[id];
  if (p.masA || id === 'cierre.a' || id === 'cierre.b') return ALTURA_A;
  return 0;
}

function interp(v: Vec3 | { de: Vec3; a: Vec3 }, u: number): Vec3 {
  if (Array.isArray(v)) return v;
  return [v.de[0] + (v.a[0] - v.de[0]) * u, v.de[1] + (v.a[1] - v.de[1]) * u, v.de[2] + (v.a[2] - v.de[2]) * u];
}

/** pos y mira del plano (con +A sumado), en u del travelling si lo tiene. */
export function posMira(id: PlanoId, u = 0, destPos = new THREE.Vector3(), destMira = new THREE.Vector3()): [THREE.Vector3, THREE.Vector3] {
  const p = PLANOS[id];
  const dy = p.masA ? ALTURA_A : 0;
  const a = interp(p.pos, u), b = interp(p.mira, u);
  destPos.set(a[0], a[1] + dy, a[2]);
  destMira.set(b[0], b[1] + dy, b[2]);
  return [destPos, destMira];
}

// Cuaterniones precalculados una vez por plano y modo: durante los tramos solo
// se hace slerp entre ellos (nada de lookAt ni de interpolar `up`), así el
// cenital no degenera ni da vuelcos.
const cacheQ = new Map<string, THREE.Quaternion>();
const _m = new THREE.Matrix4();
function quatExtremo(id: PlanoId, compacto: boolean, extremo: 0 | 1): THREE.Quaternion {
  const k = `${id}|${compacto ? 1 : 0}|${extremo}`;
  let q = cacheQ.get(k);
  if (!q) {
    const p = PLANOS[id];
    const [pos, mira] = posMira(id, extremo);
    const up = (compacto && p.arribaCompacto) ? p.arribaCompacto : (p.arriba ?? [0, 1, 0]);
    _m.lookAt(pos, mira, new THREE.Vector3(up[0], up[1], up[2]));
    q = new THREE.Quaternion().setFromRotationMatrix(_m);
    cacheQ.set(k, q);
  }
  return q;
}

/** Orientación del plano; en un travelling, slerp entre sus dos extremos. */
export function quatPlano(id: PlanoId, compacto: boolean, u = 0, dest = new THREE.Quaternion()): THREE.Quaternion {
  const p = PLANOS[id];
  const viaje = !Array.isArray(p.pos);
  if (!viaje) return dest.copy(quatExtremo(id, compacto, 0));
  return dest.copy(quatExtremo(id, compacto, 0)).slerp(quatExtremo(id, compacto, 1), u);
}
