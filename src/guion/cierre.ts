// Guion del cierre (§2.8, §5.7).
import { loc, easeCalzo } from './util.ts';

export const DESATADO_S = 1.4;

export function cierre(p: number): { camT: number; atado: boolean; frase: boolean } {
  return { camT: easeCalzo(loc(p, [0, 0.3])), atado: p < 0.30, frase: p >= 0.45 };
}

/** t en s desde el cruce hacia delante de p = 0,30 (0..1,4). Para volver a atar: desatado(1.4 − t). */
export function desatado(t: number): { T: number; reveal: number; calzoX: number; calzoVisible: boolean; plataformaY: number } {
  const tt = Math.max(0, Math.min(DESATADO_S, t));
  const T = tt >= DESATADO_S ? 0 : Math.max(-0.15, Math.exp(-7 * tt) * (Math.cos(11 * tt) + (7 / 11) * Math.sin(11 * tt)));
  return {
    T,
    reveal: 1 - easeCalzo(loc(tt, [0.5, 1.2])),
    calzoX: 0.55 * easeCalzo(loc(tt, [0.6, 1.2])),
    calzoVisible: tt < 1.2,
    plataformaY: 0.35 * (1 - easeCalzo(loc(tt, [0.9, 1.4]))),
  };
}
