// Guion del traspaso (§2.3, §5.6, §5.7): las cuatro cinchas de la X cenital
// bajan a atar el panel del precio. Lo comparten el overlay (#capa-cinchas) y
// las cinchas en flujo del panel: a h = 1 dibujan exactamente los mismos píxeles.
import type { Cincha2D, DestinoCincha, Esquina, Punto } from '../lib/estado.ts';
import { clamp, loc, easeCalzo } from './util.ts';

export function traspaso(e: number): number {
  return easeCalzo(clamp(e / 0.8));
}

export function tension(h: number): number {
  return 1 - 0.3 * Math.sin(Math.PI * clamp(h));
}

export function esquinaDe(a: Punto, centro: Punto): Esquina {
  return ((a[1] < centro[1] ? 't' : 'b') + (a[0] < centro[0] ? 'i' : 'd')) as Esquina;
}

export function destinos(panel: { left: number; top: number; right: number; bottom: number },
  dx: number, dy: number, ancho: number): Record<Esquina, DestinoCincha> {
  const { left, top, right, bottom } = panel;
  return {
    ti: { esquinaPanel: [left, top], anilla: [left - dx, top - dy], ancho },
    td: { esquinaPanel: [right, top], anilla: [right + dx, top - dy], ancho },
    bi: { esquinaPanel: [left, bottom], anilla: [left - dx, bottom + dy], ancho },
    bd: { esquinaPanel: [right, bottom], anilla: [right + dx, bottom + dy], ancho },
  };
}

/**
 * Convención de lados (§4.4), única para 3D, SVG y traspaso: con
 * dir = B − A en px de pantalla y n = (−dir.y, dir.x)/|dir|, el borde
 * «izquierdo» (índice 0) es el que está en +n y el «derecho» (índice 1) en −n.
 */
export function normalDe(a: Punto, b: Punto): Punto {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  return [-dy / l, dx / l];
}

/** Bordes [izquierdo, derecho] de una cinta de ancho `ancho` centrada en `p`, con dirección a → b. */
export function bordes(p: Punto, a: Punto, b: Punto, ancho: number): [Punto, Punto] {
  const n = normalDe(a, b);
  const w = ancho / 2;
  return [[p[0] + n[0] * w, p[1] + n[1] * w], [p[0] - n[0] * w, p[1] - n[1] * w]];
}

/** Ordena dos puntos de borde según la convención (índice 0 en +n). */
export function ordenarLados(p1: Punto, p2: Punto, a: Punto, b: Punto): [Punto, Punto] {
  const n = normalDe(a, b);
  const d = (p1[0] - p2[0]) * n[0] + (p1[1] - p2[1]) * n[1];
  return d >= 0 ? [p1, p2] : [p2, p1];
}

/** Polígono del destino: bordes en la anilla (A) y en la esquina del panel (B). */
export function ladosDestino(d: DestinoCincha): { ladoA: [Punto, Punto]; ladoB: [Punto, Punto] } {
  return {
    ladoA: bordes(d.anilla, d.anilla, d.esquinaPanel, d.ancho),
    ladoB: bordes(d.esquinaPanel, d.anilla, d.esquinaPanel, d.ancho),
  };
}

const f2 = (n: number) => String(Number(n.toFixed(2)) + 0);
const pt = (p: Punto) => `${f2(p[0])} ${f2(p[1])}`;
const mix = (a: Punto, b: Punto, t: number): Punto => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export function carraca(a: Punto, angulo: number, escala: number): string {
  const c = Math.cos(angulo), s = Math.sin(angulo);
  const cx = a[0] + c * 14 * escala, cy = a[1] + s * 14 * escala;
  const tr = (x: number, y: number): string => pt([cx + x * c - y * s, cy + x * s + y * c]);
  const w = 11 * escala, h = 6 * escala, ch = 1.5 * escala;
  // Cuerpo: 22 × 12 con chaflán de 1,5 en las esquinas.
  const cuerpo = `M${tr(-w + ch, -h)} L${tr(w - ch, -h)} L${tr(w, -h + ch)} L${tr(w, h - ch)} L${tr(w - ch, h)} L${tr(-w + ch, h)} L${tr(-w, h - ch)} L${tr(-w, -h + ch)} Z`;
  // Palanca: pletina de 16 × 3 por encima del cuerpo, con el pivote en el extremo trasero.
  const pl = 8 * escala, pa = 1.5 * escala, py = -h - 2.5 * escala;
  const palanca = `M${tr(-pl, py - pa)} L${tr(pl, py - pa)} L${tr(pl, py + pa)} L${tr(-pl, py + pa)} Z`;
  return `${cuerpo} ${palanca}`;
}

export function trazoCincha(desde: Cincha2D | null, hasta: DestinoCincha, h: number,
  asiento?: { arriba: number; abajo: number }): { d: string; carraca: string; textura: number; opacidadCarraca: number } {
  const dest = ladosDestino(hasta);
  let A0: Punto, A1: Punto, B0: Punto, B1: Punto;
  let flecha = 0;
  const final = h >= 1 || desde === null;

  if (final) {
    [A0, A1] = dest.ladoA;
    [B0, B1] = dest.ladoB;
    if (asiento) {
      const arriba = hasta.esquinaPanel[1] > hasta.anilla[1];
      const dy = arriba ? asiento.arriba : asiento.abajo;
      B0 = [B0[0], B0[1] + dy];
      B1 = [B1[0], B1[1] + dy];
    }
  } else {
    const t = clamp(h);
    A0 = mix(desde.ladoA[0], dest.ladoA[0], t);
    A1 = mix(desde.ladoA[1], dest.ladoA[1], t);
    B0 = mix(desde.ladoB[0], dest.ladoB[0], t);
    B1 = mix(desde.ladoB[1], dest.ladoB[1], t);
    const ca = mix(A0, A1, 0.5), cb = mix(B0, B1, 0.5);
    const L = Math.hypot(cb[0] - ca[0], cb[1] - ca[1]);
    flecha = 0.12 * L * Math.pow(Math.max(0, 1 - tension(t)), 1.5);
  }

  const c0: Punto = [(A0[0] + B0[0]) / 2, (A0[1] + B0[1]) / 2 + flecha];
  const c1: Punto = [(B1[0] + A1[0]) / 2, (B1[1] + A1[1]) / 2 + flecha];
  const d = `M${pt(A0)} Q${pt(c0)} ${pt(B0)} L${pt(B1)} Q${pt(c1)} ${pt(A1)} Z`;

  const ca = mix(A0, A1, 0.5), cb = mix(B0, B1, 0.5);
  const angulo = Math.atan2(cb[1] - ca[1], cb[0] - ca[0]);
  const escala = Math.max(0.6, hasta.ancho / 10);
  return {
    d,
    carraca: carraca(ca, angulo, escala),
    textura: final ? 0.35 : 0.35 * loc(h, [0, 0.3]),
    opacidadCarraca: final ? 1 : loc(h, [0, 0.2]),
  };
}

/** Vértices [A0, B0, B1, A1] de un `d` generado por trazoCincha (para QA y pruebas). */
export function verticesDe(d: string): Punto[] {
  const m = d.match(/M(\S+) (\S+) Q\S+ \S+ (\S+) (\S+) L(\S+) (\S+) Q\S+ \S+ (\S+) (\S+) Z/);
  if (!m) return [];
  const n = m.slice(1).map(Number);
  return [[n[0], n[1]], [n[2], n[3]], [n[4], n[5]], [n[6], n[7]]];
}
