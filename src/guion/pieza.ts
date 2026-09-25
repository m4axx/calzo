// Guion del desvelado (§2.1, §5.7).
import { clamp, lerp, loc, easeCalzo } from './util.ts';

export function introPieza(t: number): { barridoX: number; clave: number } {
  return {
    barridoX: lerp(-1.45, 1.45, easeCalzo(clamp(t / 1.6))),
    clave: 0.35 * loc(t, [0.8, 1.6]),
  };
}

export function pieza(p: number): { envRot: number; clave: number; camT: number; sueloDOM: number; chip: boolean } {
  return {
    envRot: 0.9 * easeCalzo(loc(p, [0, 0.5])),
    clave: lerp(0.35, 1, easeCalzo(loc(p, [0.5, 1]))),
    camT: 0.5 * loc(p, [0, 0.5]) + 0.5 * easeCalzo(loc(p, [0.5, 1])),
    sueloDOM: 1 - loc(p, [0.10, 0.25]),
    chip: p >= 0.9,
  };
}

export function mezclaPieza(t: number, p: number): { barridoX: number; barridoI: number; clave: number; envRot: number; camT: number } {
  const m = loc(p, [0, 0.05]);
  const introViva = t < 1.6 && p <= 0.05;
  const i = introPieza(t);
  const s = pieza(p);
  return {
    barridoX: i.barridoX,
    barridoI: introViva ? 1.2 * (1 - m) : 0,
    clave: m >= 1 ? s.clave : lerp(i.clave, s.clave, m),
    envRot: s.envRot,
    camT: s.camT,
  };
}
