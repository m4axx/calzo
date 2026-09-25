// Ruta de sustitución por un GLB real (§4.11): mismo contrato MotoRig que la
// moto procedural. Este módulo solo debe cargarse con import() dinámico desde
// fuera, para que GLTFLoader y DRACOLoader vivan en su propio chunk y no
// pesen en la ruta base.
//
// Requisitos del archivo: metros, +X delante, +Y arriba, origen entre
// contactos, huella en y = 0,006; nodos vacíos `suspendida`, `delantera` y
// `trasera`; nodos de pieza con nombre (se hornea aPieza a partir de ellos);
// empties de las anclas (si falta alguno se crea en su cota de §4.3);
// materiales con nombre de rol, que se sustituyen por los de materiales.ts.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  ANCLAS, ANCLAS_SUSPENDIDAS, APOYO_HUELLA, PIEZA_NUM, anguloHorquilla,
  type AnclaId, type MotoRig, type OpcionesMoto, type PiezaId,
} from '../contrato-tipos.ts';
import { crearMateriales, inyectarComun } from './materiales.ts';
import { prepararPieza } from './preparar.ts';
import { crearTexturas } from './texturas.ts';
import type { Rol } from './geo.ts';

/** Nodo de pieza del GLB → id de pieza del foco (§4.3). Lo que no está aquí es 'resto'. */
const PIEZA_DE_NODO: Readonly<Record<string, PiezaId>> = {
  tija: 'tija', mandos: 'mandos', rueda_del: 'rueda_del',
  horquilla_barras: 'horquilla', horquilla_botellas: 'horquilla', deposito: 'deposito', motor: 'motor',
};

function piezaDe(ob: THREE.Object3D): PiezaId {
  for (let o: THREE.Object3D | null = ob; o; o = o.parent) {
    const p = PIEZA_DE_NODO[o.name];
    if (p) return p;
  }
  return 'resto';
}

export async function cargarGLB(url: string, o: OpcionesMoto & { draco?: string }): Promise<MotoRig> {
  const loader = new GLTFLoader();
  let draco: DRACOLoader | null = null;
  if (o.draco !== undefined) {
    draco = new DRACOLoader();
    draco.setDecoderPath(o.draco || '/draco/');
    loader.setDRACOLoader(draco);
  }
  const gltf = await loader.loadAsync(url, (e) => { if (e.total) o.progreso?.(0.8 * (e.loaded / e.total)); });
  draco?.dispose();
  const escena = gltf.scene;

  const nodo = (nombre: string) => {
    const n = escena.getObjectByName(nombre);
    if (!n) throw new Error(`calzo/glb: falta el nodo «${nombre}»`);
    return n;
  };
  const suspendida = nodo('suspendida') as THREE.Group;
  const delantera = nodo('delantera') as THREE.Group;
  const trasera = nodo('trasera') as THREE.Group;

  const tex = await crearTexturas(o.renderer, o.tier);
  const mats = crearMateriales(o.U, tex, o.tier);
  const ajenos: THREE.Material[] = [];
  escena.updateMatrixWorld(true);
  escena.traverse((ob) => {
    const m = ob as THREE.Mesh;
    if (!m.isMesh) return;
    m.geometry = prepararPieza(m.geometry, piezaDe(m));
    const sustituir = (mat: THREE.Material): THREE.Material => {
      const rol = mat.name as Rol;
      if (rol in mats) { mat.dispose(); return mats[rol]; }
      // Material sin rol: se queda, pero con la misma inyección (foco y barrido).
      inyectarComun(mat, o.U, 'moto');
      ajenos.push(mat);
      return mat;
    };
    m.material = Array.isArray(m.material) ? m.material.map(sustituir) : sustituir(m.material);
    m.castShadow = true;
    m.receiveShadow = true;
  });
  o.progreso?.(0.9);

  const root = new THREE.Group();
  root.name = 'moto';
  root.add(escena);
  let pivote = escena.getObjectByName('pivote_suspension') ?? null;
  if (!pivote) {
    pivote = new THREE.Group();
    pivote.name = 'pivote_suspension';
    pivote.position.set(...ANCLAS.pivote_suspension);
    escena.add(pivote);
  }
  // La suspendida cuelga del pivote conservando su posición en el mundo.
  escena.updateMatrixWorld(true);
  pivote.attach(suspendida);

  const anclas = {} as Record<AnclaId, THREE.Object3D>;
  for (const id of Object.keys(ANCLAS) as AnclaId[]) {
    if (id === 'pivote_suspension') { anclas[id] = pivote; continue; }
    let a = escena.getObjectByName(id);
    if (!a) {
      a = new THREE.Object3D();
      a.name = id;
      a.position.set(...ANCLAS[id]);
      (ANCLAS_SUSPENDIDAS.has(id) ? suspendida : escena).add(a);
    } else if (ANCLAS_SUSPENDIDAS.has(id) && !estaDentro(a, suspendida)) {
      suspendida.attach(a);
    }
    anclas[id] = a;
  }
  root.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(root);
  const giro0 = pivote.rotation.z;
  o.progreso?.(1);

  return {
    root, grupos: { suspendida, delantera, trasera }, anclas, caja,
    setHorquilla(t: number) { pivote.rotation.z = giro0 - anguloHorquilla(t); },
    setFoco(pieza: PiezaId | null, mezcla: number) {
      o.U.uFoco.value = pieza === null ? -1 : PIEZA_NUM[pieza];
      o.U.uAtenuacion.value = 1 + (0.15 - 1) * mezcla;
    },
    setApoyo(y: number) { root.position.y = y - APOYO_HUELLA; },
    dispose() {
      root.traverse((ob) => { if ((ob as THREE.Mesh).isMesh) (ob as THREE.Mesh).geometry.dispose(); });
      for (const m of Object.values(mats)) m.dispose();
      for (const m of ajenos) m.dispose();
      tex.dispose();
    },
  };
}

function estaDentro(a: THREE.Object3D, padre: THREE.Object3D): boolean {
  for (let o: THREE.Object3D | null = a.parent; o; o = o.parent) if (o === padre) return true;
  return false;
}
