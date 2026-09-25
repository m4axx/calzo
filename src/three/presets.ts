// Estado completo de la escena y presets de captura (§5.4). Cada preset fija
// el plano y el estado usando las funciones del guion, sin estados inventados.
import type { AnclaId, PiezaId, PlanoId, PresetId } from './contrato-tipos.ts';
import { PLATAFORMA_ARRIBA } from './contrato-tipos.ts';
import { pieza } from '../guion/pieza.ts';
import { amarre, type EstadoAmarre } from '../guion/amarre.ts';
import { desatado } from '../guion/cierre.ts';
import { clamp } from '../guion/util.ts';

export interface CinchaEscena { reveal: number; T: number; pasos: number }

/** Todo lo que el director escribe en la escena, salvo la cámara. */
export interface EstadoEscena {
  apoyo: number;                 // cara superior de la plataforma (= plataformaY)
  asiento: number;               // desplazamiento extra del rig (muelle del calzo, ≤ 0)
  horquilla: number;
  foco: PiezaId | null; focoMezcla: number;
  calzoVisible: boolean; calzoX: number;
  cinchas: [CinchaEscena, CinchaEscena, CinchaEscena, CinchaEscena];
  palanca: [number, number, number, number];   // rad
  lazo: [number, number, number, number];      // escala del lazo en B
  cinchas3D: boolean;
  sinLuz: number;
  clave: number;                 // 0..1 (× intensidad de partida)
  claveA: AnclaId | 'origen';    // blanco de la clave
  claveMezcla: number;           // 0 = origen, 1 = ancla
  entorno: number;
  contras: number;               // 0..1 (× intensidades de partida)
  envRot: number;
  barridoX: number; barridoI: number;
  flash: number;
}

const GRADO = Math.PI / 180;
export const PALANCA_PASO = 3 * GRADO;

export function estadoBase(): EstadoEscena {
  const c = (): CinchaEscena => ({ reveal: 0, T: 0, pasos: 0 });
  return {
    apoyo: 0, asiento: 0, horquilla: 0, foco: null, focoMezcla: 0,
    calzoVisible: false, calzoX: 0.55,
    cinchas: [c(), c(), c(), c()], palanca: [0, 0, 0, 0], lazo: [0, 0, 0, 0],
    cinchas3D: false, sinLuz: 0,
    clave: 1, claveA: 'origen', claveMezcla: 0, entorno: 0.5, contras: 1, envRot: 0.9,
    barridoX: -1.45, barridoI: 0, flash: 0,
  };
}

export function copiarEstado(e: EstadoEscena): EstadoEscena {
  return {
    ...e,
    cinchas: e.cinchas.map((c) => ({ ...c })) as EstadoEscena['cinchas'],
    palanca: [...e.palanca] as EstadoEscena['palanca'],
    lazo: [...e.lazo] as EstadoEscena['lazo'],
  };
}

const ANCLA_FOCO: Partial<Record<PiezaId, AnclaId>> = { rueda_del: 'hs_rueda', tija: 'hs_tija', horquilla: 'hs_horquilla' };

/** Estado de escena del amarre en p (valores objetivo, sin muelles). */
export function desdeAmarre(A: EstadoAmarre): EstadoEscena {
  const e = estadoBase();
  e.apoyo = A.plataformaY;
  e.horquilla = A.horquilla;
  e.foco = A.foco; e.focoMezcla = A.focoMezcla;
  e.calzoVisible = A.calzoVisible; e.calzoX = A.calzoX;
  e.cinchas = A.cinchas.map((c) => ({ reveal: c.reveal, T: c.T, pasos: c.pasos })) as EstadoEscena['cinchas'];
  e.palanca = A.cinchas.map((c) => c.pasos * PALANCA_PASO) as EstadoEscena['palanca'];
  e.lazo = A.cinchas.map((c) => (c.reveal >= 0.98 ? 1 : 0)) as EstadoEscena['lazo'];
  e.cinchas3D = A.cinchas3D;
  e.sinLuz = A.sinLuz;
  e.clave = A.clave;
  const ancla = A.foco ? ANCLA_FOCO[A.foco] : undefined;
  e.claveA = ancla ?? 'origen';
  e.claveMezcla = ancla ? clamp(A.focoMezcla) : 0;
  e.entorno = A.entorno;
  e.contras = A.contras;
  e.envRot = 0.9 + A.envRotExtra;
  return e;
}

/** Estado de escena del cierre para un instante t del desatado (0 = atada). */
export function desdeCierre(t: number): EstadoEscena {
  const d = desatado(t);
  const e = estadoBase();
  e.apoyo = d.plataformaY;
  // Atada, la horquilla está comprimida; al soltar la tensión vuelve a extenderse.
  e.horquilla = clamp(d.T);
  e.calzoVisible = d.calzoVisible; e.calzoX = d.calzoX;
  const c = { reveal: d.reveal, T: d.T, pasos: 6 };
  e.cinchas = [{ ...c }, { ...c }, { ...c }, { ...c }];
  e.palanca = [6, 6, 6, 6].map((n) => n * PALANCA_PASO * clamp(d.T)) as EstadoEscena['palanca'];
  e.lazo = [0, 1, 2, 3].map(() => (d.reveal >= 0.98 ? 1 : 0)) as EstadoEscena['lazo'];
  e.cinchas3D = true;
  e.clave = 0.8; e.entorno = 0.45; e.contras = 1; e.envRot = 0.9;
  return e;
}

/** Estado de escena del desvelado (clave, barrido y giro del entorno). */
export function desdePieza(m: { barridoX: number; barridoI: number; clave: number; envRot: number }, p: number): EstadoEscena {
  const e = estadoBase();
  e.clave = m.clave;
  e.entorno = 0.15 + (0.6 - 0.15) * clamp(p);
  e.envRot = m.envRot;
  e.barridoX = m.barridoX; e.barridoI = m.barridoI;
  e.contras = 1;
  return e;
}

export interface Preset { plano: PlanoId; estado: EstadoEscena; compactoPermitido: boolean }

export function preset(id: PresetId, compacto: boolean): Preset {
  switch (id) {
    case 'parte.A': case 'parte.B': case 'parte.C': case 'parte.D': {
      const e = estadoBase();
      e.apoyo = PLATAFORMA_ARRIBA;
      e.calzoVisible = true; e.calzoX = 0;
      e.clave = 0.15; e.entorno = 0.1; e.contras = 0.5; e.flash = 12; e.envRot = 0.9;
      return { plano: id, estado: e, compactoPermitido: false };
    }
    case 'quieto.pieza': {
      const s = pieza(1);
      return { plano: 'pieza.b', estado: desdePieza({ barridoX: -1.45, barridoI: 0, clave: s.clave, envRot: s.envRot }, 1), compactoPermitido: true };
    }
    case 'quieto.calzo': return { plano: 'am.calzo', estado: desdeAmarre(amarre(0.20, { compacto })), compactoPermitido: true };
    case 'quieto.cinchas': return { plano: 'am.delanteras', estado: desdeAmarre(amarre(0.53, { compacto })), compactoPermitido: true };
    case 'quieto.horquilla': return { plano: 'am.horquilla', estado: desdeAmarre(amarre(0.68, { compacto })), compactoPermitido: true };
    case 'quieto.cenital': return { plano: 'am.cenital', estado: desdeAmarre(amarre(0.90, { compacto })), compactoPermitido: true };
    case 'quieto.cierre': return { plano: 'cierre.b', estado: desdeCierre(1.4), compactoPermitido: true };
  }
}
