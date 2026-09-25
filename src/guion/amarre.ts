// Guion del amarre (§2.2, §5.7). Todo es función pura de p: hacia arriba se
// deshace clic a clic sin historial.
import type { PiezaId, PlanoId } from '../three/contrato-tipos.ts';
import { clamp, lerp, loc, easeCalzo, rampa } from './util.ts';

export const TRAMOS = {
  plataforma: [0, 0.06], rueda: [0.06, 0.12], calzo: [0.12, 0.20], tija: [0.20, 0.27],
  delanteras: [0.27, 0.41], traseras: [0.41, 0.53], horquilla: [0.53, 0.59], compresion: [0.59, 0.68],
  grua: [0.68, 0.90], traspaso: [0.90, 1],
} as const;
export type Tramo = keyof typeof TRAMOS;
const ORDEN: readonly Tramo[] = ['plataforma', 'rueda', 'calzo', 'tija', 'delanteras', 'traseras', 'horquilla', 'compresion', 'grua', 'traspaso'];

export type EstadoCincha = { reveal: number; pasos: number; T: number };

export function cincha(u: number): EstadoCincha {
  const pasos = clamp(Math.floor(((u - 0.4) / 0.6) * 6 + 0.5 + 1e-9), 0, 6); // 1e-9: los clics caen justo en u = 0,45 · 0,55…
  return { reveal: easeCalzo(clamp(u / 0.4)), pasos, T: pasos / 6 };
}

export type TextoAmarre = 'titulo' | 'rueda' | 'tija' | 'horquilla';
export const FASES_TEXTO: Readonly<Record<TextoAmarre, readonly [number, number]>> = {
  titulo: [0, 0.06], rueda: [0.06, 0.20], tija: [0.20, 0.53], horquilla: [0.53, 0.68],
};

/** Opacidad de cada fase de texto (rampas de 0,015 de p en sus bordes). */
export function opacidadTexto(p: number, fase: TextoAmarre): number {
  const [a, b] = FASES_TEXTO[fase];
  return rampa(p, a, b, 0.015);
}

const PLANO_DE: Readonly<Record<Tramo, PlanoId | 'spline'>> = {
  plataforma: 'am.bajo', rueda: 'am.rueda', calzo: 'am.calzo', tija: 'am.tija', delanteras: 'am.delanteras',
  traseras: 'am.traseras', horquilla: 'am.horquilla', compresion: 'am.horquilla', grua: 'spline', traspaso: 'am.cenital',
};

export interface EstadoAmarre {
  tramo: Tramo; plano: PlanoId | 'spline'; u: number;
  foco: PiezaId | null; focoMezcla: number;
  plataformaY: number; calzoX: number; calzoVisible: boolean; clac: boolean;
  cinchas: [EstadoCincha, EstadoCincha, EstadoCincha, EstadoCincha]; // del_I, del_D, tras_I, tras_D
  horquilla: number; grua: number; envRotExtra: number; clave: number; entorno: number; contras: number; sinLuz: number;
  camaraExacta: boolean; cinchas3D: boolean; cinchasSVG: boolean; opacidadCanvas: number;
  texto: TextoAmarre | null;
}

export function tramoDe(p: number): Tramo {
  const q = clamp(p);
  for (const t of ORDEN) {
    if (q < TRAMOS[t][1]) return t;
  }
  return 'traspaso';
}

export function amarre(p: number, o?: { compacto?: boolean }): EstadoAmarre {
  const tramo = tramoDe(p);
  const u = loc(p, TRAMOS[tramo]);

  let foco: PiezaId | null = null;
  let focoMezcla = 0;
  if (p >= 0.06 && p < 0.20) { foco = 'rueda_del'; focoMezcla = loc(p, [0.06, 0.08]) - loc(p, [0.18, 0.20]); }
  else if (p >= 0.20 && p < 0.30) { foco = 'tija'; focoMezcla = loc(p, [0.20, 0.22]) - loc(p, [0.27, 0.30]); }
  else if (p >= 0.53 && p < 0.62) { foco = 'horquilla'; focoMezcla = loc(p, [0.53, 0.55]) - loc(p, [0.59, 0.62]); }
  if (focoMezcla <= 0) { foco = null; focoMezcla = 0; }

  const del = cincha(loc(p, TRAMOS.delanteras));
  let tras = cincha(loc(p, TRAMOS.traseras));
  if (o?.compacto) tras = p >= 0.41 ? { reveal: 1, pasos: 6, T: 1 } : { reveal: 0, pasos: 0, T: 0 };

  const g = loc(p, TRAMOS.grua);
  const grua = easeCalzo(g);

  let texto: TextoAmarre | null = null;
  if (p < 0.06) texto = 'titulo';
  else if (p < 0.20) texto = 'rueda';
  else if (p < 0.53) texto = 'tija';
  else if (p < 0.68) texto = 'horquilla';

  return {
    tramo, plano: PLANO_DE[tramo], u,
    foco, focoMezcla,
    plataformaY: 0.35 * easeCalzo(loc(p, TRAMOS.plataforma)),
    calzoX: 0.55 * (1 - easeCalzo(loc(p, TRAMOS.calzo))),
    calzoVisible: p >= 0.12,
    clac: p >= 0.20,
    cinchas: [del, { ...del }, tras, { ...tras }],
    horquilla: easeCalzo(loc(p, TRAMOS.compresion)),
    grua,
    envRotExtra: 1.2 * grua,
    clave: 1 - loc(g, [0, 0.5]),
    entorno: lerp(0.5, 0.05, loc(g, [0, 0.5])),
    contras: lerp(1, 0.35, loc(g, [0, 0.6])),
    sinLuz: loc(g, [0.2, 0.6]),
    camaraExacta: g > 0.85 || p >= 0.90,
    cinchas3D: p < 0.905,
    cinchasSVG: p >= 0.90,
    opacidadCanvas: 1 - loc(p, [0.905, 1]),
    texto,
  };
}
