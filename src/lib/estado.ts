// Estado único + bus de eventos con eventos pegajosos (§5.4).
// Sin efectos al importarse salvo crear el objeto.
import type { Tier, PresetId } from '../three/contrato-tipos.ts';
import type { ResultadoPrecio } from './precio.js';

export type CapId = 'pieza' | 'amarre' | 'precio' | 'cargas' | 'parte' | 'seguro' | 'rutas' | 'contacto';
export const CAPITULOS: readonly CapId[] = ['pieza', 'amarre', 'precio', 'cargas', 'parte', 'seguro', 'rutas', 'contacto'];
export const CAP_3D: ReadonlySet<CapId> = new Set<CapId>(['pieza', 'amarre', 'contacto']);
export type Fuente = 'ninguna' | 'webgl' | 'svg';
export type Esquina = 'ti' | 'td' | 'bi' | 'bd';
export type Punto = [number, number];

export interface Cincha2D {
  esquina: Esquina;          // cuadrante de pantalla de su extremo A respecto al centro de la X (esquinaDe)
  a: Punto;                  // eje en la anilla
  b: Punto;                  // eje donde la cinta sale de la silueta (bVisible)
  ladoA: [Punto, Punto];     // bordes de la cinta en A: [izquierdo, derecho] (convención de guion/traspaso.ts)
  ladoB: [Punto, Punto];     // ídem en B. Polígono = [ladoA[0], ladoB[0], ladoB[1], ladoA[1]]
}
export interface DestinoCincha { anilla: Punto; esquinaPanel: Punto; ancho: number }

export interface CapEstado { e: number; p: number }

export interface Estado {
  modo: { tier: Tier; reducido: boolean; tactil: boolean; compacto: boolean };
  fuente: Fuente;
  vp: { w: number; h: number; hs: number };
  scroll: { y: number; vel: number; dir: 1 | -1; saltando: boolean };
  cap: Record<CapId, CapEstado>;
  activo: CapId;
  escena: { lista: boolean; fallo: boolean; visible: boolean; opacidad: number };
  cinchas2D: null | [Cincha2D, Cincha2D, Cincha2D, Cincha2D];
  destinoCinchas: null | Record<Esquina, DestinoCincha>;
  capturas: Partial<Record<PresetId, string>>;
  calc: ResultadoPrecio;
  qa: { pausado: boolean; frames: number };
}

const capInicial = (): Record<CapId, CapEstado> => {
  const r = {} as Record<CapId, CapEstado>;
  for (const c of CAPITULOS) r[c] = { e: 0, p: 0 };
  return r;
};

export const estado: Estado = {
  modo: { tier: 'alto', reducido: false, tactil: false, compacto: false },
  fuente: 'ninguna',
  vp: { w: 0, h: 0, hs: 0 },
  scroll: { y: 0, vel: 0, dir: 1, saltando: false },
  cap: capInicial(),
  activo: 'pieza',
  escena: { lista: false, fallo: false, visible: false, opacidad: 0 },
  cinchas2D: null,
  destinoCinchas: null,
  capturas: {},
  calc: null as unknown as ResultadoPrecio, // lo rellena iniciarCalc() antes que nadie lo lea
  qa: { pausado: false, frames: 0 },
};

export interface Eventos {
  'listo': { fuente: 'webgl' | 'svg' };
  'escena:lista': { tier: Tier };
  'escena:fallo': { motivo: string };
  'tier': { tier: Tier };
  'fuente': { fuente: Fuente; anterior: Fuente };
  'medidas': Record<string, never>;
  'capitulo': { id: CapId; anterior: CapId };
  'precio': ResultadoPrecio;
  'captura': { preset: PresetId; url: string };
}

const PEGAJOSOS: ReadonlySet<keyof Eventos> = new Set<keyof Eventos>(['listo', 'escena:lista', 'escena:fallo', 'tier', 'fuente']);
const oyentes = new Map<keyof Eventos, Set<(d: unknown) => void>>();
const ultimos = new Map<keyof Eventos, unknown>();

/** Si ev es pegajoso y ya se emitió, fn se llama de forma síncrona con el último valor antes de devolver. */
export function on<E extends keyof Eventos>(ev: E, fn: (d: Eventos[E]) => void): () => void {
  let set = oyentes.get(ev);
  if (!set) { set = new Set(); oyentes.set(ev, set); }
  const f = fn as (d: unknown) => void;
  set.add(f);
  if (PEGAJOSOS.has(ev) && ultimos.has(ev)) {
    try { fn(ultimos.get(ev) as Eventos[E]); } catch (err) { console.error(`[calzo] oyente de ${ev}`, err); }
  }
  return () => { set!.delete(f); };
}

export function emit<E extends keyof Eventos>(ev: E, d: Eventos[E]): void {
  if (PEGAJOSOS.has(ev)) ultimos.set(ev, d);
  const set = oyentes.get(ev);
  if (!set) return;
  for (const f of [...set]) {
    try { f(d); } catch (err) { console.error(`[calzo] oyente de ${ev}`, err); }
  }
}

/** ¿Ya se emitió este evento pegajoso? */
export function emitido(ev: keyof Eventos): boolean {
  return ultimos.has(ev);
}

/** Paso 1 del arranque: modo desde las clases de <html> y sonda de 100svh. */
export function iniciarEstado(): void {
  const cl = document.documentElement.classList;
  const tier = (['alto', 'medio', 'bajo', 'sin-webgl'] as Tier[]).find((t) => cl.contains(`tier-${t}`)) ?? 'alto';
  estado.modo = {
    tier,
    reducido: cl.contains('reducido'),
    tactil: cl.contains('tactil'),
    compacto: cl.contains('compacto'),
  };
  medirViewport();
}

let sonda: HTMLDivElement | null = null;
/** innerWidth/innerHeight y 100svh medido con una sonda (no cambia con la barra de URL). */
export function medirViewport(): void {
  if (!sonda) {
    sonda = document.createElement('div');
    sonda.setAttribute('aria-hidden', 'true');
    sonda.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:100svh;visibility:hidden;pointer-events:none;';
    document.body.appendChild(sonda);
  }
  estado.vp.w = window.innerWidth;
  estado.vp.h = window.innerHeight;
  estado.vp.hs = sonda.offsetHeight || window.innerHeight;
}
