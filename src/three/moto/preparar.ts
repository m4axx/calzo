// Preparación obligatoria antes de fusionar (§4.3). mergeGeometries exige que
// todas las geometrías de un lote tengan exactamente los mismos atributos y
// el mismo estado de índice: si no, devuelve null y la moto sale a trozos.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PIEZA_NUM, type PiezaId } from '../contrato-tipos.ts';

const PERMITIDOS = new Set(['position', 'normal', 'uv']);

export function prepararPieza(geo: THREE.BufferGeometry, pieza: PiezaId): THREE.BufferGeometry {
  // 1. Sin índice (ExtrudeGeometry no lo tiene; Lathe, Tube, Torus y RoundedBox sí).
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (g !== geo) geo.dispose();
  // 2. Solo position, normal y uv. La uv hace falta aunque sea a cero: la anisotropía la usa.
  for (const nombre of Object.keys(g.attributes)) if (!PERMITIDOS.has(nombre)) g.deleteAttribute(nombre);
  const n = g.getAttribute('position').count;
  if (!g.getAttribute('normal')) g.computeVertexNormals();
  if (!g.getAttribute('uv')) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n * 2), 2));
  // 3. aPieza: un float por vértice con el id de la pieza (§4.3).
  g.setAttribute('aPieza', new THREE.Float32BufferAttribute(new Float32Array(n).fill(PIEZA_NUM[pieza]), 1));
  g.morphAttributes = {};
  g.clearGroups();
  return g;
}

/** Fusión de un lote ya preparado. Nunca falla en silencio (§4.3, paso 4). */
export function fusionar(geos: THREE.BufferGeometry[], nombre: string): THREE.BufferGeometry {
  if (geos.length === 1) return geos[0];
  const m = mergeGeometries(geos, false);
  if (!m) throw new Error(`calzo/moto: mergeGeometries devolvió null al fusionar «${nombre}»`);
  for (const g of geos) g.dispose();
  return m;
}
