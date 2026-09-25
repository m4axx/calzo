// Rosa de rutas (§2.7, §5.5). JS puro que solo corre en el build de Astro:
// rumbos, longitudes y colocación de etiquetas. En el cliente no se calcula nada.
//
// viewBox 0 0 800 800, Madrid en (400, 400). Cada rayo sale con el rumbo
// geográfico inicial real y mide r = 340·km/750, con los km por carretera de
// tarifas.js: la longitud se lee como distancia de viaje, no como mapa.

import { DESTINOS } from '../data/tarifas.js';
import { COORD, rumbo } from '../data/geo.js';

export const C = 400;
export const R_MAX = 340;
export const KM_MAX = 750;
const KM_FERRY = 260;           // Valencia → Palma por mar, solo para dibujar el tramo punteado
const TAM = 13;                 // cuerpo de las etiquetas, en unidades del viewBox
const TAM_FERRY = 11;
const ALTO = TAM * 1.15;
const HUECO = 14;               // de la punta del rayo a la etiqueta
const PAD = 3;                  // aire mínimo entre cajas y entre caja y rayo
const TOPE = 60;                // desplazamiento máximo respecto a la posición natural
const GUIA = 10;                // a partir de aquí la etiqueta lleva línea guía
const ITER = 200;
const RADIO_PUNTO = 12;       // aire entre una etiqueta y el extremo de un rayo ajeno

// Avance por carácter de Big Shoulders Display a wght 520, en em, medido en
// Chromium con la fuente real (canvas measureText a 100 px). Lo que no está en
// la tabla cuenta como una minúscula media.
const AVANCE = {
  ' ': 0.21, '+': 0.45, a: 0.37, b: 0.38, c: 0.36, d: 0.38, e: 0.36, f: 0.25, g: 0.38, h: 0.39, i: 0.18,
  j: 0.19, l: 0.18, m: 0.6, n: 0.39, o: 0.37, r: 0.26, s: 0.34, t: 0.26, u: 0.39, v: 0.33, y: 0.34, z: 0.3,
  á: 0.37, é: 0.36, í: 0.18, ó: 0.37, ñ: 0.39,
  A: 0.36, B: 0.37, C: 0.37, D: 0.38, E: 0.32, G: 0.37, J: 0.35, M: 0.56, O: 0.38, P: 0.36, S: 0.36, V: 0.37, Z: 0.32,
};
// Margen de redondeo y de hinting por carácter.
const EXTRA = 0.015;
const MEDIA = 0.37;

/** Ancho estimado de un texto, en unidades del viewBox. */
export function anchoTexto(txt, tam = TAM) {
  let w = 0;
  for (const ch of txt) w += (AVANCE[ch] ?? MEDIA) + EXTRA;
  return w * tam;
}

const r1 = (n) => Math.round(n * 10) / 10;
const punto = (theta, r, o = { x: C, y: C }) => {
  const t = (theta * Math.PI) / 180;
  return { x: o.x + r * Math.sin(t), y: o.y - r * Math.cos(t) };
};

/** Centro natural de la caja: la etiqueta se apoya por su lado interior en el punto de anclaje. */
function centroNatural(ancla, theta, w, h) {
  const t = (theta * Math.PI) / 180;
  return { x: ancla.x + (w / 2) * Math.sin(t), y: ancla.y - (h / 2) * Math.cos(t) };
}

/** ¿Corta el segmento a–b la caja (centro c, w, h, con margen)? Liang–Barsky. */
function cortaCaja(a, b, c, w, h, m) {
  const x0 = c.x - w / 2 - m, x1 = c.x + w / 2 + m, y0 = c.y - h / 2 - m, y1 = c.y + h / 2 + m;
  const dx = b.x - a.x, dy = b.y - a.y;
  let t0 = 0, t1 = 1;
  const p = [-dx, dx, -dy, dy];
  const q = [a.x - x0, x1 - a.x, a.y - y0, y1 - a.y];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) { if (q[i] < 0) return false; continue; }
    const r = q[i] / p[i];
    if (p[i] < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
    else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return t0 <= t1;
}

/** Punto de la caja (con margen) más cercano a p: donde acaba la línea guía. */
function bordeCercano(p, c, w, h, m) {
  return {
    x: Math.min(Math.max(p.x, c.x - w / 2 - m), c.x + w / 2 + m),
    y: Math.min(Math.max(p.y, c.y - h / 2 - m), c.y + h / 2 + m),
  };
}

/**
 * Relajación: las cajas que se solapan se separan (en el eje de menor
 * solape, que en una rosa equivale a separarlas en ángulo o en radio) y las
 * que pisan un rayo ajeno se apartan en perpendicular a él. Cada etiqueta
 * queda a como mucho TOPE unidades de su posición natural y dentro del lienzo.
 */
function relajar(etqs, segmentos, puntos) {
  for (let k = 0; k < ITER; k++) {
    let movido = false;
    for (let i = 0; i < etqs.length; i++) {
      for (let j = i + 1; j < etqs.length; j++) {
        const a = etqs[i], b = etqs[j];
        const dx = b.c.x - a.c.x, dy = b.c.y - a.c.y;
        const ox = (a.w + b.w) / 2 + PAD - Math.abs(dx);
        const oy = (a.h + b.h) / 2 + PAD - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        movido = true;
        if (ox < oy) {
          const s = (dx >= 0 ? 1 : -1) * (ox / 2 + 0.25);
          a.c.x -= s; b.c.x += s;
        } else {
          const s = (dy >= 0 ? 1 : -1) * (oy / 2 + 0.25);
          a.c.y -= s; b.c.y += s;
        }
      }
    }
    for (const e of etqs) {
      for (const s of segmentos) {
        if (!cortaCaja(s.a, s.b, e.c, e.w, e.h, PAD)) continue;
        movido = true;
        // Normal del segmento, hacia el lado donde ya está el centro de la caja.
        const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y;
        const l = Math.hypot(dx, dy) || 1;
        let nx = -dy / l, ny = dx / l;
        const lado = (e.c.x - s.a.x) * nx + (e.c.y - s.a.y) * ny;
        if (lado < 0) { nx = -nx; ny = -ny; }
        const dist = Math.abs(lado);
        const alcance = (Math.abs(nx) * e.w + Math.abs(ny) * e.h) / 2 + PAD;
        const paso = Math.max(0.5, alcance - dist) * 0.5 + 0.25;
        e.c.x += nx * paso; e.c.y += ny * paso;
      }
    }
    // Los extremos de los rayos ajenos: una etiqueta pegada a otro punto se
    // lee como suya. Se aparta del punto hasta dejar RADIO_PUNTO de aire.
    for (const e of etqs) {
      for (const p of puntos) {
        if (p.id === e.id) continue;
        const qx = Math.min(Math.max(p.x, e.c.x - e.w / 2), e.c.x + e.w / 2);
        const qy = Math.min(Math.max(p.y, e.c.y - e.h / 2), e.c.y + e.h / 2);
        let dx = qx - p.x, dy = qy - p.y;
        const d = Math.hypot(dx, dy);
        if (d >= RADIO_PUNTO) continue;
        movido = true;
        if (d < 1e-6) { dx = e.c.x - p.x; dy = e.c.y - p.y; }
        const l = Math.hypot(dx, dy) || 1;
        const paso = (RADIO_PUNTO - d) * 0.5 + 0.25;
        e.c.x += (dx / l) * paso; e.c.y += (dy / l) * paso;
      }
    }
    for (const e of etqs) {
      const dx = e.c.x - e.nat.x, dy = e.c.y - e.nat.y;
      const d = Math.hypot(dx, dy);
      if (d > TOPE) { e.c.x = e.nat.x + (dx / d) * TOPE; e.c.y = e.nat.y + (dy / d) * TOPE; }
      e.c.x = Math.min(Math.max(e.c.x, e.w / 2 + 2), 800 - e.w / 2 - 2);
      e.c.y = Math.min(Math.max(e.c.y, e.h / 2 + 2), 800 - e.h / 2 - 2);
    }
    if (!movido) return k;
  }
  return ITER;
}

/**
 * @returns {{
 *   rayos: Array<{ id: string, nombre: string, km: number, nautico: boolean, maritimo: boolean,
 *     rumbo: number, d: string, fin: {x:number,y:number}, dur: number,
 *     etiqueta: { x: number, y: number, guia: null | [number, number, number, number] },
 *     ferry?: { d: string, dur: number, etiqueta: { x: number, y: number, guia: null | [number, number, number, number] } } }>,
 *   iteraciones: number
 * }}
 */
export function rosa() {
  const madrid = COORD.madrid;
  const valencia = DESTINOS.find((d) => d.id === 'valencia');
  const base = DESTINOS.map((d) => {
    const coord = COORD[d.id];
    if (!coord) throw new Error(`rosa: faltan coordenadas de ${d.id}`);
    // Palma no tiene carretera: su rayo es el de Valencia más el mar.
    const tramo = d.maritimo ? valencia : d;
    const th = rumbo(madrid, COORD[tramo.id]);
    const r = (R_MAX * tramo.km) / KM_MAX;
    return { d, th, r, fin: punto(th, r) };
  });

  const etqs = [];
  const segmentos = [];
  for (const b of base) {
    segmentos.push({ a: { x: C, y: C }, b: b.fin });
  }
  const rayos = base.map((b) => {
    const { d, th, r } = b;
    let fin = b.fin;
    let ferry;
    let rumboEtq = th;
    if (d.maritimo) {
      const thMar = rumbo(COORD.valencia, COORD.palma);
      const finMar = punto(thMar, (R_MAX * KM_FERRY) / KM_MAX, b.fin);
      segmentos.push({ a: b.fin, b: finMar });
      const medio = { x: (b.fin.x + finMar.x) / 2, y: (b.fin.y + finMar.y) / 2 };
      // «+ ferry» del lado norte del tramo de mar.
      const t = (thMar * Math.PI) / 180;
      const n = { x: -Math.cos(t), y: -Math.sin(t) };
      if (n.y > 0) { n.x = -n.x; n.y = -n.y; }
      const w = anchoTexto('+ ferry', TAM_FERRY);
      const h = TAM_FERRY * 1.15;
      const nat = { x: medio.x + n.x * (h / 2 + 6), y: medio.y + n.y * (h / 2 + 6) };
      const ef = { id: 'ferry', ancla: medio, nat: { ...nat }, c: { ...nat }, w, h };
      etqs.push(ef);
      ferry = { finMar, ef };
      fin = finMar;
      rumboEtq = thMar;
    }
    const w = anchoTexto(d.nombre);
    const ancla = punto(rumboEtq, HUECO, fin);
    const nat = centroNatural(ancla, rumboEtq, w, ALTO);
    const e = { id: d.id, ancla: fin, nat: { ...nat }, c: { ...nat }, w, h: ALTO };
    etqs.push(e);
    return { d, th, r, fin, rayoFin: b.fin, e, ferry };
  });

  const puntos = rayos.map((r) => ({ id: r.d.id, x: r.fin.x, y: r.fin.y }));
  const iteraciones = relajar(etqs, segmentos, puntos);

  const etiquetaDe = (e) => {
    const desv = Math.hypot(e.c.x - e.nat.x, e.c.y - e.nat.y);
    let guia = null;
    if (desv > GUIA) {
      const hasta = bordeCercano(e.ancla, e.c, e.w, e.h, 2);
      const dx = hasta.x - e.ancla.x, dy = hasta.y - e.ancla.y;
      const l = Math.hypot(dx, dy) || 1;
      const desde = { x: e.ancla.x + (dx / l) * 5, y: e.ancla.y + (dy / l) * 5 };
      guia = [r1(desde.x), r1(desde.y), r1(hasta.x), r1(hasta.y)];
    }
    return { x: r1(e.c.x), y: r1(e.c.y), w: r1(e.w), h: r1(e.h), guia };
  };

  const durDe = (km) => Math.round((0.4 + (1.2 * km) / KM_MAX) * 1000) / 1000;
  return {
    iteraciones,
    rayos: rayos.map(({ d, th, rayoFin, fin, e, ferry }) => {
      const kmTramo = d.maritimo ? valencia.km : d.km;
      const out = {
        id: d.id,
        nombre: d.nombre,
        km: d.km,
        nautico: Boolean(d.nautico),
        maritimo: Boolean(d.maritimo),
        rumbo: Math.round(th * 10) / 10,
        d: `M${C} ${C}L${r1(rayoFin.x)} ${r1(rayoFin.y)}`,
        fin: { x: r1(fin.x), y: r1(fin.y) },
        dur: durDe(kmTramo),
        etiqueta: etiquetaDe(e),
      };
      if (ferry) {
        out.ferry = {
          d: `M${r1(rayoFin.x)} ${r1(rayoFin.y)}L${r1(ferry.finMar.x)} ${r1(ferry.finMar.y)}`,
          dur: durDe(KM_FERRY),
          etiqueta: etiquetaDe(ferry.ef),
        };
      }
      return out;
    }),
  };
}

/** Rumbo en rosa de 16 puntos, para las pruebas y el control a ojo. */
export function cuarta(grados) {
  const P = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  return P[Math.round(((grados % 360) + 360) % 360 / 22.5) % 16];
}
