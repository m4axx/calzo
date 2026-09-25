// Director (§5.6.2, orden 20): estado + guion → cámara, luces, uniforms, rig y
// amarre. Es el único que escribe la escena y nunca toca el DOM. Devuelve
// `sucio` para que escena.ts solo renderice cuando algo ha cambiado.
import * as THREE from 'three';
import type { Estado } from '../lib/estado.ts';
import {
  ANCLAS, ANCLAS_PLATAFORMA, PLATAFORMA_ARRIBA,
  type AnclaId, type MotoRig, type PlanoId, type PresetId, type UniformsCompartidos,
} from './contrato-tipos.ts';
import { medidaDe } from '../lib/capitulos.ts';
import { ahora } from '../lib/motion.ts';
import { mezclaPieza } from '../guion/pieza.ts';
import { amarre, type EstadoAmarre } from '../guion/amarre.ts';
import { cierre, DESATADO_S } from '../guion/cierre.ts';
import { clamp, lerp, loc, easeCalzo, muelleCritico } from '../guion/util.ts';
import { PLANOS, SPLINE_IZQ, SPLINE_DER, posMira, quatPlano, apoyoEncaje, ALTURA_A } from './planos.ts';
import { preset, desdeAmarre, desdeCierre, desdePieza, copiarEstado, estadoBase, type EstadoEscena } from './presets.ts';
import type { Cincha } from './amarre/cinchas.ts';
import type { Carraca } from './amarre/carraca.ts';
import type { Plataforma } from './amarre/plataforma.ts';

export type Cuatro<T> = [T, T, T, T];
export interface Amarre {
  plataforma: Plataforma;
  calzo: THREE.Group;
  cinchas: Cuatro<Cincha>;      // del_I, del_D, tras_I, tras_D
  carracas: Cuatro<Carraca>;
}
export interface Luces {
  clave: THREE.SpotLight;
  contraA: THREE.DirectionalLight;
  contraB: THREE.DirectionalLight;
  flash: THREE.PointLight;
}
/** Intensidades de partida (§4.7); el guion da factores 0..1. */
export const INTENSIDAD = { clave: 35, contraA: 1.2, contraB: 0.8 } as const;

export interface CamaraPlano { pos: THREE.Vector3; quat: THREE.Quaternion; fov: number; offset: [number, number] }

const LAMBDA_CAMARA = 6;
const OMEGA_ASIENTO = 33;
const OMEGA_CLIC = 40;          // muelle de tensión por clic: asentado en ~120 ms
const LAZO_S = 0.12;
const EPS = 1e-4;

/** ¿Qué capítulos 3D cortan el viewport ahora? (medidas cacheadas; sin layout por frame). */
export function cortes(e: Estado): { pieza: boolean; amarre: boolean; contacto: boolean } {
  const y = e.scroll.y, h = e.vp.h || window.innerHeight;
  const corta = (id: 'pieza' | 'amarre' | 'contacto'): boolean => {
    const m = medidaDe(id);
    if (!m) return false;
    return y + h > m.top && y < m.top + m.alto;
  };
  return { pieza: corta('pieza'), amarre: corta('amarre'), contacto: corta('contacto') };
}

/** Opacidad del canvas (§5.6.3): la del amarre si lo corta; 1 con pieza o contacto; 0 si no. */
export function opacidadCanvas(e: Estado): number {
  const c = cortes(e);
  if (c.amarre) return amarre(e.cap.amarre.p, { compacto: e.modo.compacto }).opacidadCanvas;
  if (c.pieza || c.contacto) return 1;
  return 0;
}

type Modo = 'pieza' | 'amarre' | 'cierre';

export function crearDirector(ctx: {
  escena: THREE.Scene; camara: THREE.PerspectiveCamera; rig: MotoRig;
  amarre: Amarre; luces: Luces; U: UniformsCompartidos;
  renderer?: THREE.WebGLRenderer; altoCanvas?: () => number; estado?: Estado;
}) {
  const { escena, camara, rig, luces, U } = ctx;
  const am = ctx.amarre;
  const altoCanvas = ctx.altoCanvas ?? (() => window.innerHeight);

  // — utilidades de resolución de planos —
  const tmp = new THREE.PerspectiveCamera(24, 1, 0.1, 60);
  const _v = new THREE.Vector3(), _w = new THREE.Vector3();

  function puntosEncaje(tipo: 'rig' | 'x', apoyo: number): THREE.Vector3[] {
    const c = rig.caja, dy = apoyo - 0.006;
    const pts: THREE.Vector3[] = [];
    for (const x of [c.min.x, c.max.x]) for (const y of [c.min.y, c.max.y]) for (const z of [c.min.z, c.max.z]) {
      pts.push(new THREE.Vector3(x, y + dy, z));
    }
    if (tipo === 'x') {
      for (const a of Object.values(ANCLAS_PLATAFORMA)) pts.push(new THREE.Vector3(a[0], a[1] + apoyo, a[2]));
    }
    return pts;
  }

  function puntoMundo(id: PlanoId, mira: THREE.Vector3, dest: THREE.Vector3): THREE.Vector3 {
    const P = PLANOS[id];
    const dy = P.masA ? ALTURA_A : 0;
    const pt = P.punto;
    if (Array.isArray(pt)) return dest.set(pt[0], pt[1] + dy, pt[2]);
    if (pt === 'origen') return dest.set(0, dy, 0);
    if (pt === 'mira') return dest.copy(mira);
    if (pt === 'contactos') {
      rig.anclas.anc_contacto_del.getWorldPosition(dest);
      rig.anclas.anc_contacto_tras.getWorldPosition(_w);
      return dest.add(_w).multiplyScalar(0.5);
    }
    return rig.anclas[pt as AnclaId].getWorldPosition(dest);
  }

  function prepararTmp(pos: THREE.Vector3, q: THREE.Quaternion, fov: number, w: number, hc: number): void {
    tmp.position.copy(pos);
    tmp.quaternion.copy(q);
    tmp.fov = fov;
    tmp.aspect = w / hc;
    tmp.clearViewOffset();
    tmp.updateProjectionMatrix();
    tmp.updateMatrixWorld(true);
  }

  /**
   * Resolución pura de un plano: posición (con encaje compacto por caja),
   * cuaternión precalculado, fov y desplazamiento de vista para que su punto
   * caiga en el encuadre, en fracciones del viewport visible (w × h). El canvas
   * mide w × hc (100lvh).
   */
  function resolver(id: PlanoId, w: number, h: number, hc: number, compacto: boolean, u = 0): CamaraPlano {
    const P = PLANOS[id];
    const [pos, mira] = posMira(id, u);
    const quat = quatPlano(id, compacto, u);
    const fov = Math.min(30, P.fov);
    if (compacto && P.encajeCompacto) {
      const pts = puntosEncaje(P.encajeCompacto, apoyoEncaje(id));
      const dir = _w.subVectors(mira, pos);
      let d = dir.length();
      dir.normalize();
      for (let it = 0; it < 2; it++) {
        prepararTmp(_v.copy(mira).addScaledVector(dir, -d), quat, fov, w, hc);
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const p of pts) {
          const q = p.clone().project(tmp);
          const px = (q.x + 1) / 2 * w, py = (1 - q.y) / 2 * hc;
          x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
        }
        const k = Math.max(1, (x1 - x0) / (0.9 * w), (y1 - y0) / (0.9 * h));
        if (k <= 1.0001) break;
        d *= k;
      }
      pos.copy(mira).addScaledVector(dir, -d);
    }
    prepararTmp(pos, quat, fov, w, hc);
    const pt = puntoMundo(id, mira, new THREE.Vector3()).project(tmp);
    const px = (pt.x + 1) / 2 * w, py = (1 - pt.y) / 2 * hc;
    const e = compacto && P.encuadreCompacto ? P.encuadreCompacto : P.encuadre;
    return { pos: pos.clone(), quat: quat.clone(), fov, offset: [px - e[0] * w, py - e[1] * h] };
  }

  function mezclar(a: CamaraPlano, b: CamaraPlano, k: number): CamaraPlano {
    return {
      pos: a.pos.clone().lerp(b.pos, k),
      quat: a.quat.clone().slerp(b.quat, k),
      fov: lerp(a.fov, b.fov, k),
      offset: [lerp(a.offset[0], b.offset[0], k), lerp(a.offset[1], b.offset[1], k)],
    };
  }

  /** Cámara sobre un spline centrípeto de planos, en s (índice fraccionario) y con respiración r. */
  function enSpline(lista: readonly PlanoId[], s: number, r: number, w: number, h: number, hc: number, compacto: boolean): CamaraPlano {
    const cams = lista.map((id) => resolver(id, w, h, hc, compacto, id === 'am.traseras' ? 1 : 0));
    const n = lista.length;
    const sc = clamp(s, 0, n - 1);
    const i0 = Math.min(n - 2, Math.floor(sc)), f = sc - i0;
    const curva = new THREE.CatmullRomCurve3(cams.map((c) => c.pos), false, 'centripetal');
    const pos = curva.getPoint(sc / (n - 1));
    const c = mezclar(cams[i0], cams[i0 + 1], f);
    c.pos.copy(pos);
    if (r > 0) {
      const m0 = posMira(lista[i0], lista[i0] === 'am.traseras' ? 1 : 0)[1];
      const m1 = posMira(lista[i0 + 1])[1];
      const mira = m0.lerp(m1, f);
      c.pos.lerp(mira, 0.03 * r);   // dolly-in del 3 %
      c.fov -= r;                   // fov −1°
    }
    return c;
  }

  const arr = (u: number) => easeCalzo(loc(u, [0, 0.35]));
  const resp = (u: number) => loc(u, [0.35, 1]);

  /** Cámara objetivo del amarre en p (§4.9): llegada en el 35 %, respiración, corte de traseras, grúa. */
  function camaraAmarre(A: EstadoAmarre, p: number, w: number, h: number, hc: number, compacto: boolean): { cam: CamaraPlano; lado: string } {
    const u = A.u;
    switch (A.tramo) {
      case 'plataforma': return { cam: enSpline(SPLINE_IZQ, 0, resp(u), w, h, hc, compacto), lado: 'izq' };
      case 'rueda': case 'calzo': case 'tija': case 'delanteras': {
        const base = { rueda: 0, calzo: 1, tija: 2, delanteras: 3 }[A.tramo];
        const r = u < 0.35 ? 1 - arr(u) : resp(u);
        return { cam: enSpline(SPLINE_IZQ, base + arr(u), r, w, h, hc, compacto), lado: 'izq' };
      }
      case 'traseras':
        // Corte seco al entrar y travelling lateral de delante hacia atrás.
        return { cam: resolver('am.traseras', w, h, hc, compacto, u), lado: 'tras' };
      case 'horquilla': case 'compresion': {
        const uh = loc(p, [0.53, 0.59]);
        const r = loc(p, [0.53 + 0.35 * 0.06, 0.68]);
        return { cam: enSpline(SPLINE_DER, arr(uh), r, w, h, hc, compacto), lado: 'der' };
      }
      case 'grua':
        return { cam: enSpline(SPLINE_DER, 1 + 2 * A.grua, 1 - A.grua, w, h, hc, compacto), lado: 'der' };
      case 'traspaso':
      default:
        return { cam: resolver('am.cenital', w, h, hc, compacto), lado: 'der' };
    }
  }

  // — estado interno —
  let modoPrev: Modo | null = null;
  let ladoPrev = '';
  let teleport = true;
  let forzar = true;
  let ultimo: EstadoEscena = estadoBase();
  let introT0 = -Infinity;
  let sombrasCongeladas = false;
  let yPrev = NaN, wPrev = 0, hPrev = 0, hcPrev = 0;
  let clacPrev = false;
  let td = 0, tAhoraPrev = ahora();
  const camX = { pos: [0, 0, 0], quat: [0, 0, 0, 1], fov: [24], off: [0, 0] };
  const camV = { pos: [0, 0, 0], quat: [0, 0, 0, 0], fov: [0], off: [0, 0] };
  const blanco = { x: [0, 0, 0], v: [0, 0, 0] };
  const T = { x: [0, 0, 0, 0], v: [0, 0, 0, 0] };
  const pal = { x: [0, 0, 0, 0], v: [0, 0, 0, 0] };
  const lazo = [0, 0, 0, 0];
  const asiento = { x: 0, v: 0 };
  const ancCalzoX = ANCLAS.anc_calzo[0];

  function muelleArr(x: number[], v: number[], obj: number[], omega: number, dt: number): boolean {
    let activo = false;
    for (let i = 0; i < x.length; i++) {
      const [nx, nv] = muelleCritico(x[i], v[i], obj[i], omega, dt);
      if (Math.abs(nx - obj[i]) < EPS * 0.1 && Math.abs(nv) < EPS) { x[i] = obj[i]; v[i] = 0; }
      else { x[i] = nx; v[i] = nv; activo = true; }
    }
    return activo;
  }
  const fijarArr = (x: number[], v: number[], obj: number[]) => { for (let i = 0; i < x.length; i++) { x[i] = obj[i]; v[i] = 0; } };

  const origenClave = new THREE.Vector3();
  function objetivoClave(E: EstadoEscena, dest: THREE.Vector3): THREE.Vector3 {
    origenClave.set(0, E.apoyo, 0);
    if (E.claveA === 'origen' || E.claveMezcla <= 0) return dest.copy(origenClave);
    rig.anclas[E.claveA].getWorldPosition(dest);
    return dest.lerpVectors(origenClave, dest, E.claveMezcla);
  }

  const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _tc = new THREE.Vector3();

  /** Escribe un EstadoEscena en la escena (sin muelles). */
  function aplicarEstado(E: EstadoEscena, blancoClave?: THREE.Vector3): void {
    const prev = ultimo;
    luces.clave.intensity = INTENSIDAD.clave * E.clave;
    luces.contraA.intensity = INTENSIDAD.contraA * E.contras;
    luces.contraB.intensity = INTENSIDAD.contraB * E.contras;
    luces.flash.intensity = E.flash;
    escena.environmentIntensity = E.entorno;
    escena.environmentRotation.y = E.envRot;
    U.uBarridoX.value = E.barridoX;
    U.uBarridoI.value = E.barridoI;

    rig.setApoyo(E.apoyo + E.asiento);
    rig.setHorquilla(E.horquilla);
    rig.setFoco(E.foco, E.focoMezcla);
    am.plataforma.grupo.position.y = E.apoyo;
    am.calzo.visible = E.calzoVisible;
    am.calzo.position.set(ancCalzoX + E.calzoX, E.apoyo, 0);
    escena.updateMatrixWorld(true);

    luces.clave.target.position.copy(blancoClave ?? objetivoClave(E, _tc));
    luces.clave.target.updateMatrixWorld(true);

    for (let i = 0; i < 4; i++) {
      const c = am.cinchas[i], k = am.carracas[i], ce = E.cinchas[i];
      const vis = E.cinchas3D && ce.reveal > 0.001;
      c.malla.visible = vis;
      k.grupo.visible = vis;
      if (vis) {
        c.setLazo(E.lazo[i]);
        c.set(ce.reveal, ce.T, E.sinLuz);
        const [a, b] = c.extremos();
        _a.copy(a); _b.copy(b);
        k.colocar(_a, _b);
        k.setAngulo(E.palanca[i]);
      }
    }

    // Sombras: solo se vuelven a calcular si cambia algo que las proyecta (§5.7).
    const r = ctx.renderer;
    if (r && r.shadowMap.enabled && !sombrasCongeladas) {
      const cambia = forzar || E.apoyo !== prev.apoyo || E.asiento !== prev.asiento || E.horquilla !== prev.horquilla
        || E.calzoX !== prev.calzoX || E.calzoVisible !== prev.calzoVisible
        || E.palanca.some((x, i) => x !== prev.palanca[i]) || E.cinchas.some((c, i) => (c.reveal > 0.001) !== (prev.cinchas[i].reveal > 0.001))
        || !luces.clave.target.position.equals(blancoPrev);
      if (cambia) r.shadowMap.needsUpdate = true;
    }
    blancoPrev.copy(luces.clave.target.position);
    ultimo = copiarEstado(E);
  }
  const blancoPrev = new THREE.Vector3(NaN);

  function aplicarCamara(pos: ArrayLike<number>, q: ArrayLike<number>, fov: number, off: ArrayLike<number>, w: number, hc: number): void {
    camara.position.set(pos[0], pos[1], pos[2]);
    camara.quaternion.set(q[0], q[1], q[2], q[3]).normalize();
    camara.fov = fov;
    camara.aspect = w / hc;
    camara.setViewOffset(w, hc, off[0], off[1], w, hc);
    camara.updateProjectionMatrix();
    camara.updateMatrixWorld(true);
  }

  function modoDe(e: Estado): Modo | null {
    const c = cortes(e);
    if (c.contacto) return 'cierre';
    if (c.amarre && e.cap.amarre.e >= 0.5) return 'amarre';
    if (c.pieza || c.amarre) return 'pieza';
    return null;
  }

  function actualizar(e: Estado, t: number, dt: number): boolean {
    const modo = modoDe(e);
    if (!modo) { modoPrev = null; return false; }
    const compacto = e.modo.compacto;
    const w = e.vp.w || window.innerWidth, h = e.vp.h || window.innerHeight, hc = Math.max(h, altoCanvas());
    const rafaga = e.scroll.saltando || Math.abs(e.scroll.vel) > 3000;
    const tAhora = ahora();
    const dtT = Math.max(0, Math.min(0.05, tAhora - tAhoraPrev));
    tAhoraPrev = tAhora;

    let sucio = forzar || teleport;
    if (e.scroll.y !== yPrev || w !== wPrev || h !== hPrev || hc !== hcPrev) sucio = true;
    yPrev = e.scroll.y; wPrev = w; hPrev = h; hcPrev = hc;

    let E: EstadoEscena;
    let lado: string = modo;
    let exacta = false;
    let usarMuelles = false;
    // La cámara se resuelve después de aplicar el rig (las anclas se mueven con él).
    let cam: () => CamaraPlano;

    if (modo === 'pieza') {
      const p = e.cap.pieza.p;
      const ti = Math.max(0, t - introT0);
      const m = mezclaPieza(ti, p);
      E = desdePieza(m, p);
      if (ti < 1.7 && p <= 0.05) sucio = true;
      cam = () => mezclar(resolver('pieza.a', w, h, hc, compacto), resolver('pieza.b', w, h, hc, compacto), m.camT);
    } else if (modo === 'amarre') {
      const p = e.cap.amarre.p;
      const A = amarre(p, { compacto });
      E = desdeAmarre(A);
      usarMuelles = true;
      exacta = A.camaraExacta;
      // Asiento del calzo: solo al cruzar p = 0,20 hacia delante, con impulso (baja 3 mm y vuelve).
      if (A.clac && !clacPrev && e.scroll.dir === 1 && modoPrev === 'amarre' && !teleport && !rafaga) {
        asiento.x = 0; asiento.v = -0.003 * OMEGA_ASIENTO * Math.E;
      }
      clacPrev = A.clac;
      lado = 'amarre:' + (A.tramo === 'traseras' ? 'tras' : ['plataforma', 'rueda', 'calzo', 'tija', 'delanteras'].includes(A.tramo) ? 'izq' : 'der');
      cam = () => camaraAmarre(A, p, w, h, hc, compacto).cam;
    } else {
      const p = e.cap.contacto.p;
      const C = cierre(p);
      if (modo !== modoPrev || teleport || rafaga) td = C.atado ? 0 : DESATADO_S;
      else td = clamp(td + (C.atado ? -dtT : dtT), 0, DESATADO_S);
      if (td > 0 && td < DESATADO_S) sucio = true;
      E = desdeCierre(td);
      cam = () => mezclar(resolver('cierre.a', w, h, hc, compacto), resolver('cierre.b', w, h, hc, compacto), C.camT);
    }
    if (modo !== 'amarre') clacPrev = modo === 'cierre';

    const corte = teleport || modo !== modoPrev || lado !== ladoPrev;
    modoPrev = modo; ladoPrev = lado;

    // — muelles de estado —
    if (corte || rafaga || !usarMuelles) {
      fijarArr(T.x, T.v, E.cinchas.map((c) => c.T));
      fijarArr(pal.x, pal.v, E.palanca);
      for (let i = 0; i < 4; i++) lazo[i] = E.lazo[i];
      if (corte || rafaga) { asiento.x = 0; asiento.v = 0; }
    } else {
      if (muelleArr(T.x, T.v, E.cinchas.map((c) => c.T), OMEGA_CLIC, dt)) sucio = true;
      if (muelleArr(pal.x, pal.v, E.palanca, OMEGA_CLIC, dt)) sucio = true;
      for (let i = 0; i < 4; i++) {
        const obj = E.lazo[i];
        if (lazo[i] !== obj) {
          lazo[i] = obj > lazo[i] ? Math.min(obj, lazo[i] + dt / LAZO_S) : Math.max(obj, lazo[i] - dt / LAZO_S);
          sucio = true;
        }
      }
    }
    if (asiento.x !== 0 || asiento.v !== 0) {
      const [nx, nv] = muelleCritico(asiento.x, asiento.v, 0, OMEGA_ASIENTO, dt);
      if (Math.abs(nx) < 1e-6 && Math.abs(nv) < 1e-4) { asiento.x = 0; asiento.v = 0; } else { asiento.x = nx; asiento.v = nv; }
      sucio = true;
    }
    for (let i = 0; i < 4; i++) {
      E.cinchas[i].T = T.x[i];
      E.palanca[i] = pal.x[i];
      E.lazo[i] = lazo[i];
    }
    E.asiento = asiento.x;

    // — rig y amarre; después la clave y la cámara (dependen de las anclas) —
    const blancoObj = objetivoClave(E, new THREE.Vector3());
    if (corte) { blanco.x = blancoObj.toArray(); blanco.v = [0, 0, 0]; }
    else if (muelleArr(blanco.x, blanco.v, blancoObj.toArray(), LAMBDA_CAMARA, dt)) sucio = true;
    aplicarEstado(E, _v.fromArray(blanco.x));

    const c = cam();
    const obj = { pos: c.pos.toArray(), quat: c.quat.toArray(), fov: [c.fov], off: c.offset.slice() };
    // Mismo hemisferio para que el muelle del cuaternión tome el camino corto.
    const dotQ = obj.quat[0] * camX.quat[0] + obj.quat[1] * camX.quat[1] + obj.quat[2] * camX.quat[2] + obj.quat[3] * camX.quat[3];
    if (dotQ < 0) for (let i = 0; i < 4; i++) obj.quat[i] = -obj.quat[i];
    if (corte || exacta) {
      fijarArr(camX.pos, camV.pos, obj.pos); fijarArr(camX.quat, camV.quat, obj.quat);
      fijarArr(camX.fov, camV.fov, obj.fov); fijarArr(camX.off, camV.off, obj.off);
    } else {
      let activo = muelleArr(camX.pos, camV.pos, obj.pos, LAMBDA_CAMARA, dt);
      activo = muelleArr(camX.quat, camV.quat, obj.quat, LAMBDA_CAMARA, dt) || activo;
      activo = muelleArr(camX.fov, camV.fov, obj.fov, LAMBDA_CAMARA, dt) || activo;
      activo = muelleArr(camX.off, camV.off, obj.off, LAMBDA_CAMARA, dt) || activo;
      if (activo) sucio = true;
    }
    aplicarCamara(camX.pos, camX.quat, camX.fov[0], camX.off, w, hc);

    teleport = false;
    forzar = false;
    return sucio;
  }

  function camaraDePlano(id: PlanoId, w: number, h: number, compacto: boolean, u?: number): CamaraPlano {
    return resolver(id, w, h, h, compacto, u ?? 0);
  }

  function aplicarPreset(p: PresetId, w?: number, h?: number): () => void {
    const snap = {
      E: copiarEstado(ultimo), blanco: luces.clave.target.position.clone(),
      pos: camara.position.clone(), quat: camara.quaternion.clone(), fov: camara.fov, aspect: camara.aspect,
      view: camara.view ? { ...camara.view } : null,
    };
    const e = ctx.estado;
    const compactoModo = e ? e.modo.compacto : false;
    const pr = preset(p, compactoModo);
    const compacto = compactoModo && pr.compactoPermitido;
    aplicarEstado(pr.estado);
    const W = w ?? (e?.vp.w || window.innerWidth);
    const H = h ?? (e?.vp.h || window.innerHeight);
    const HC = w !== undefined ? H : Math.max(H, altoCanvas());
    const c = resolver(pr.plano, W, H, HC, compacto);
    aplicarCamara(c.pos.toArray(), c.quat.toArray(), c.fov, c.offset, W, HC);
    return () => {
      aplicarEstado(snap.E, snap.blanco);
      camara.position.copy(snap.pos);
      camara.quaternion.copy(snap.quat);
      camara.fov = snap.fov;
      camara.aspect = snap.aspect;
      if (snap.view) camara.setViewOffset(snap.view.fullWidth, snap.view.fullHeight, snap.view.offsetX, snap.view.offsetY, snap.view.width, snap.view.height);
      else camara.clearViewOffset();
      camara.updateProjectionMatrix();
      camara.updateMatrixWorld(true);
      forzar = true;
    };
  }

  /** Estado del amarre en p = 0,90 (plataforma arriba, horquilla comprimida) para cálculos puntuales. */
  function conEstadoCenital<T>(fn: () => T): T {
    const E0 = copiarEstado(ultimo), b0 = luces.clave.target.position.clone();
    const prevCongeladas = sombrasCongeladas;
    sombrasCongeladas = true;
    const E = desdeAmarre(amarre(0.90));
    E.asiento = 0;
    rig.setApoyo(PLATAFORMA_ARRIBA);
    rig.setHorquilla(E.horquilla);
    am.plataforma.grupo.position.y = PLATAFORMA_ARRIBA;
    escena.updateMatrixWorld(true);
    try { return fn(); } finally {
      rig.setApoyo(E0.apoyo + E0.asiento);
      rig.setHorquilla(E0.horquilla);
      am.plataforma.grupo.position.y = E0.apoyo;
      escena.updateMatrixWorld(true);
      luces.clave.target.position.copy(b0);
      sombrasCongeladas = prevCongeladas;
    }
  }

  return {
    actualizar,
    camaraDePlano,
    aplicarPreset,
    teletransportar(): void { teleport = true; forzar = true; },
    // — extras para escena.ts —
    resolver,
    conEstadoCenital,
    forzar(): void { forzar = true; },
    iniciarIntro(): void { introT0 = ahora(); forzar = true; },
    congelarSombras(v: boolean): void { sombrasCongeladas = v; },
    estadoActual: (): EstadoEscena => ultimo,
    aplicarEstado,
  };
}

export type Director = ReturnType<typeof crearDirector>;
