// Ensamblado de la moto procedural (§4.3): construye pieza a pieza cediendo
// el hilo entre piezas (ninguna tarea > 50 ms), prepara cada geometría
// (sin índice, aPieza), fusiona por material dentro de cada grupo y monta el
// rig con las anclas del contrato. Intercambiable con crearMotoMaqueta.
import * as THREE from 'three';
import {
  ANCLAS, ANCLAS_SUSPENDIDAS, APOYO_HUELLA, PIEZA_NUM, anguloHorquilla,
  type AnclaId, type CrearMoto, type MotoRig, type PiezaId,
} from '../contrato-tipos.ts';
import { Lote, type Constructor, type Grupo, type Rol } from './geo.ts';
import { crearMateriales } from './materiales.ts';
import { fusionar, prepararPieza } from './preparar.ts';
import { crearTexturas } from './texturas.ts';
import { neumatico } from './piezas/neumatico.ts';
import { llanta } from './piezas/llanta.ts';
import { discoDel, discoTras } from './piezas/disco.ts';
import { horquilla } from './piezas/horquilla.ts';
import { tijaInferior, tijaSuperior } from './piezas/tijas.ts';
import { manillar } from './piezas/manillar.ts';
import { faro } from './piezas/faro.ts';
import { deposito } from './piezas/deposito.ts';
import { colin, tapasLaterales, tapizado } from './piezas/asiento.ts';
import { chasis } from './piezas/chasis.ts';
import { motor } from './piezas/motor.ts';
import { escape } from './piezas/escape.ts';
import { basculante } from './piezas/basculante.ts';
import { amortiguadores } from './piezas/amortiguador.ts';
import { cadena } from './piezas/cadena.ts';
import { guardabarros, latiguillos, mandosPie } from './piezas/detalles.ts';

const CONSTRUCTORES: readonly (readonly [string, Constructor])[] = [
  ['neumatico.del', (q, l) => l.add('delantera', 'rueda_del', 'goma', neumatico(q, 0.725, 0.12))],
  ['neumatico.tras', (q, l) => l.add('trasera', 'resto', 'goma', neumatico(q, -0.725, 0.17))],
  ['llanta.del', (q, l) => llanta(q, l, 0.725, 0.046, 0.13, 'delantera', 'rueda_del')],
  ['llanta.tras', (q, l) => llanta(q, l, -0.725, 0.066, 0.17, 'trasera', 'resto')],
  ['disco.del.I', (q, l) => discoDel(q, l, 0.07)], ['disco.del.D', (q, l) => discoDel(q, l, -0.07)], ['disco.tras', discoTras], ['horquilla', horquilla],
  ['tija.inf', tijaInferior], ['tija.sup', tijaSuperior], ['manillar', manillar], ['faro', faro], ['deposito', deposito], ['asiento', tapizado], ['colin', colin], ['tapas', tapasLaterales],
  ['chasis', chasis], ['motor', motor], ['escape', escape], ['basculante', basculante],
  ['amortiguador', amortiguadores], ['cadena', cadena],
  ['guardabarros', guardabarros], ['latiguillos', latiguillos], ['mandos.pie', mandosPie],
];

const GRUPOS: readonly Grupo[] = ['suspendida', 'delantera', 'trasera'];

/** Cede el hilo: scheduler.yield si existe (mantiene la prioridad), si no setTimeout(0). */
function ceder(): Promise<void> {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  return s?.yield ? s.yield() : new Promise((r) => setTimeout(r, 0));
}

/** Medidas de la construcción (ms por tarea), para el taller y el informe. */
export interface MedidasMoto { tareas: Record<string, number>; maxMs: number; triangulos: number; mallas: number; trisPieza: Record<string, number> }

export const crearMoto: CrearMoto = async (o) => {
  // Segmentos por tier (§4.2): medio a la mitad. Las piezas que llevan los primeros
  // planos (depósito, neumáticos, tijas, faro) conservan su densidad; el resto baja un 25 %.
  const base = o.tier === 'alto' ? 1 : 0.5;
  const HEROES = new Set(['neumatico.del', 'neumatico.tras', 'tija.inf', 'tija.sup', 'deposito', 'faro']);
  const medidas: MedidasMoto = { tareas: {}, maxMs: 0, triangulos: 0, mallas: 0, trisPieza: {} };
  const medir = (nombre: string, t0: number) => {
    const ms = performance.now() - t0;
    medidas.tareas[nombre] = Math.round(ms * 10) / 10;
    medidas.maxMs = Math.max(medidas.maxMs, ms);
  };
  const total = CONSTRUCTORES.length + GRUPOS.length + 2;
  let hecho = 0;
  const avance = () => o.progreso?.(Math.min(1, ++hecho / total));

  let t0 = performance.now();
  const tex = await crearTexturas(o.renderer, o.tier, async () => { medir('textura', t0); await ceder(); t0 = performance.now(); });
  const mats = crearMateriales(o.U, tex, o.tier);
  medir('materiales', t0);
  avance();
  await ceder();

  // 1. Piezas: cada constructor deja su geometría en el lote y se prepara ahí mismo.
  const lote = new Lote();
  for (const [nombre, fn] of CONSTRUCTORES) {
    t0 = performance.now();
    const desde = lote.partes.length, desdeI = lote.inst.length;
    fn({ f: base * (HEROES.has(nombre) ? 1 : 0.75) }, lote);
    let tris = 0;
    for (let i = desde; i < lote.partes.length; i++) {
      const p = lote.partes[i];
      p.geo = prepararPieza(p.geo, p.pieza);
      tris += p.geo.getAttribute('position').count / 3;
    }
    for (let i = desdeI; i < lote.inst.length; i++) {
      const ins = lote.inst[i];
      const n = ins.geo.index ? ins.geo.index.count : ins.geo.getAttribute('position').count;
      tris += (n / 3) * ins.matrices.length;
    }
    medidas.trisPieza[nombre] = Math.round(tris);
    medir(nombre, t0);
    avance();
    await ceder();
  }

  // 2. Fusión por material dentro de cada grupo.
  const grupos = {} as MotoRig['grupos'];
  for (const g of GRUPOS) {
    const grupo = new THREE.Group();
    grupo.name = g;
    grupos[g] = grupo;
    const porRol = new Map<Rol, THREE.BufferGeometry[]>();
    for (const p of lote.partes) {
      if (p.grupo !== g) continue;
      const lista = porRol.get(p.rol) ?? [];
      lista.push(p.geo);
      porRol.set(p.rol, lista);
    }
    for (const [rol, geos] of porRol) {
      t0 = performance.now();
      const geo = fusionar(geos, `${g}/${rol}`);
      const malla = new THREE.Mesh(geo, mats[rol]);
      malla.name = `${g}.${rol}`;
      malla.castShadow = true;
      malla.receiveShadow = true;
      grupo.add(malla);
      medir(`fusion ${g}/${rol}`, t0);
      await ceder();
    }
    avance();
  }

  // 3. Instancias (tornillos, aletas, cadena): aPieza en la geometría base.
  t0 = performance.now();
  for (const ins of lote.inst) {
    const geo = prepararPieza(ins.geo, ins.pieza);
    const im = new THREE.InstancedMesh(geo, mats[ins.rol], ins.matrices.length);
    ins.matrices.forEach((m, i) => im.setMatrixAt(i, m));
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    im.name = ins.nombre;
    im.castShadow = true;
    im.receiveShadow = true;
    grupos[ins.grupo].add(im);
  }
  medir('instancias', t0);
  avance();

  // 4. Rig: la suspendida cuelga del pivote para girar a su alrededor (setHorquilla).
  const root = new THREE.Group();
  root.name = 'moto';
  const pivote = new THREE.Group();
  pivote.name = 'pivote_suspension';
  const [px, py, pz] = ANCLAS.pivote_suspension;
  pivote.position.set(px, py, pz);
  root.add(pivote);
  grupos.suspendida.position.set(-px, -py, -pz);
  pivote.add(grupos.suspendida);
  root.add(grupos.delantera, grupos.trasera);

  const anclas = {} as Record<AnclaId, THREE.Object3D>;
  for (const id of Object.keys(ANCLAS) as AnclaId[]) {
    if (id === 'pivote_suspension') { anclas[id] = pivote; continue; }
    const a = new THREE.Object3D();
    a.name = id;
    const [x, y, z] = ANCLAS[id];
    a.position.set(x, y, z);
    (ANCLAS_SUSPENDIDAS.has(id) ? grupos.suspendida : root).add(a);
    anclas[id] = a;
  }

  root.updateMatrixWorld(true);
  const caja = new THREE.Box3().setFromObject(root);
  root.traverse((ob) => {
    const m = ob as THREE.Mesh;
    if (!m.isMesh) return;
    medidas.mallas++;
    const n = m.geometry.index ? m.geometry.index.count : m.geometry.getAttribute('position').count;
    medidas.triangulos += (n / 3) * ((ob as THREE.InstancedMesh).isInstancedMesh ? (ob as THREE.InstancedMesh).count : 1);
  });
  medidas.maxMs = Math.round(medidas.maxMs * 10) / 10;
  root.userData.medidas = medidas;
  avance();

  return {
    root, grupos, anclas, caja,
    setHorquilla(t: number) {
      pivote.rotation.z = -anguloHorquilla(t);
    },
    setFoco(pieza: PiezaId | null, mezcla: number) {
      o.U.uFoco.value = pieza === null ? -1 : PIEZA_NUM[pieza];
      o.U.uAtenuacion.value = 1 + (0.15 - 1) * mezcla;
    },
    setApoyo(y: number) {
      root.position.y = y - APOYO_HUELLA;
    },
    dispose() {
      root.traverse((ob) => { if ((ob as THREE.Mesh).isMesh) (ob as THREE.Mesh).geometry.dispose(); });
      for (const m of Object.values(mats)) m.dispose();
      tex.dispose();
    },
  };
};
