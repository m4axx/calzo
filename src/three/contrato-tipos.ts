// Contrato compartido del 3D (§5.4). Sin three en tiempo de ejecución:
// solo `import type`, para que el bundle inicial nunca arrastre three.
import type * as THREE from 'three';

export type Tier = 'alto' | 'medio' | 'bajo' | 'sin-webgl';

export type PiezaId = 'resto' | 'tija' | 'mandos' | 'rueda_del' | 'horquilla' | 'deposito' | 'motor';
export const PIEZA_NUM: Readonly<Record<PiezaId, number>> = Object.freeze({
  resto: 0, tija: 1, mandos: 2, rueda_del: 3, horquilla: 4, deposito: 5, motor: 6,
});

export type AnclaId = 'hs_tija' | 'hs_rueda' | 'hs_horquilla'
  | 'anc_cincha_tija_I' | 'anc_cincha_tija_D' | 'anc_cincha_tras_I' | 'anc_cincha_tras_D'
  | 'anc_calzo' | 'anc_contacto_del' | 'anc_contacto_tras' | 'anc_deposito' | 'pivote_suspension';

/** Coordenadas del rig en reposo (§4.3). Las del grupo suspendido se mueven con él. */
export const ANCLAS: Readonly<Record<AnclaId, readonly [number, number, number]>> = Object.freeze({
  hs_tija: [0.50, 0.80, 0.02],
  hs_rueda: [0.80, 0.24, 0.00],
  hs_horquilla: [0.62, 0.54, 0.08],
  anc_cincha_tija_I: [0.51, 0.76, 0.145],
  anc_cincha_tija_D: [0.51, 0.76, -0.145],
  anc_cincha_tras_I: [-0.55, 0.62, 0.156],
  anc_cincha_tras_D: [-0.55, 0.62, -0.156],
  anc_calzo: [0.725, 0.006, 0],
  anc_contacto_del: [0.725, 0.006, 0],
  anc_contacto_tras: [-0.725, 0.006, 0],
  anc_deposito: [0.15, 1.00, 0],
  pivote_suspension: [-0.725, 0.31, 0],
});

/** Anclas que pertenecen al grupo suspendido (se mueven con setHorquilla). */
export const ANCLAS_SUSPENDIDAS: ReadonlySet<AnclaId> = new Set<AnclaId>([
  'hs_tija', 'hs_horquilla', 'anc_cincha_tija_I', 'anc_cincha_tija_D',
  'anc_cincha_tras_I', 'anc_cincha_tras_D', 'anc_deposito',
]);

export type AnclaPlataformaId = 'anc_anilla_del_I' | 'anc_anilla_del_D' | 'anc_anilla_tras_I' | 'anc_anilla_tras_D';
/** Coordenadas del grupo de la plataforma (§4.4). */
export const ANCLAS_PLATAFORMA: Readonly<Record<AnclaPlataformaId, readonly [number, number, number]>> = Object.freeze({
  anc_anilla_del_I: [1.20, 0.006, 0.34],
  anc_anilla_del_D: [1.20, 0.006, -0.34],
  anc_anilla_tras_I: [-1.20, 0.006, 0.34],
  anc_anilla_tras_D: [-1.20, 0.006, -0.34],
});

export const APOYO_HUELLA = 0.006;
export const PLATAFORMA_ARRIBA = 0.35;

export type PlanoId = 'pieza.a' | 'pieza.b' | 'am.bajo' | 'am.rueda' | 'am.calzo' | 'am.tija' | 'am.delanteras' | 'am.traseras'
  | 'am.horquilla' | 'am.grua1' | 'am.cenital' | 'parte.A' | 'parte.B' | 'parte.C' | 'parte.D' | 'cierre.a' | 'cierre.b';

export type PresetId = 'parte.A' | 'parte.B' | 'parte.C' | 'parte.D'
  | 'quieto.pieza' | 'quieto.calzo' | 'quieto.cinchas' | 'quieto.horquilla' | 'quieto.cenital' | 'quieto.cierre';

export const PRESETS: readonly PresetId[] = [
  'parte.A', 'parte.B', 'parte.C', 'parte.D',
  'quieto.pieza', 'quieto.calzo', 'quieto.cinchas', 'quieto.horquilla', 'quieto.cenital', 'quieto.cierre',
];

export interface UniformsCompartidos {
  uBarridoX: { value: number }; uBarridoAncho: { value: number }; uBarridoI: { value: number };
  uColorContra: { value: THREE.Color }; uFoco: { value: number }; uAtenuacion: { value: number };
}

export interface MotoRig {
  root: THREE.Group;
  grupos: { suspendida: THREE.Group; delantera: THREE.Group; trasera: THREE.Group };
  anclas: Record<AnclaId, THREE.Object3D>;
  caja: THREE.Box3;                                       // en reposo, coordenadas del rig
  setHorquilla(t: number): void;                          // 0..1
  setFoco(pieza: PiezaId | null, mezcla: number): void;   // solo uniforms
  setApoyo(y: number): void;                              // root.position.y = y − 0.006
  dispose(): void;
}

export interface OpcionesMoto { tier: Tier; U: UniformsCompartidos; renderer: THREE.WebGLRenderer; progreso?: (f: number) => void }
export type CrearMoto = (o: OpcionesMoto) => Promise<MotoRig>;  // troceado: cede el hilo entre piezas (<50 ms por tarea)

export type Vec3 = [number, number, number];
export interface Plano {
  pos: Vec3 | { de: Vec3; a: Vec3 };   // travelling
  mira: Vec3 | { de: Vec3; a: Vec3 };
  fov: number;                                            // ≤ 30 siempre
  punto: AnclaId | 'origen' | 'mira' | 'contactos' | Vec3; // 'contactos' = punto medio de anc_contacto_del/_tras; Vec3 = punto fijo del mundo
  encuadre: [number, number]; encuadreCompacto?: [number, number];
  encajeCompacto?: 'rig' | 'x' | null;
  arriba?: Vec3; arribaCompacto?: Vec3;
  /** Suma el apoyo de la plataforma subida (0,35 m) a la y de pos y mira (§4.9, +A). */
  masA?: boolean;
}

/** θ de setHorquilla (§4.3): t · 0,028 · 0,9063 / 1,45 rad. */
export function anguloHorquilla(t: number): number {
  return t * 0.028 * 0.9063 / 1.45;
}
