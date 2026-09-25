// Cálculo y formato del precio. JS puro: lo usan Astro en el build, el
// cliente y las pruebas de Node. Sin Intl, para que todos den lo mismo.

import {
  ORIGEN, DESTINOS, CARGAS, RECARGO_ESPECIAL, RECARGO_MARITIMO, FACTOR_IDA_VUELTA,
  VELOCIDAD_MEDIA, ESLORA_REF, RECARGO_ESLORA_M, ESLORA_DEFECTO, REDONDEO,
  DESTINO_DEFECTO, CARGA_DEFECTO, PROVISIONAL,
} from '../data/tarifas.js';
import { WA_NUM } from '../data/contacto.js';

/** @typedef {'moto'|'quad'|'barco'|'coche'} CargaId */
/** @typedef {{ carga: CargaId, destino: string, vuelta: boolean, eslora?: number, manga?: boolean }} EntradaPrecio */
/** @typedef {{ id: 'base'|'km'|'minimo'|'eslora'|'manga'|'vuelta'|'ferry'|'redondeo', txt: string }} LineaDesglose */
/** @typedef {{ entrada: EntradaPrecio, total: number, totalTxt: string, km: number, kmTxt: string, duracionTxt: string,
 *   ruta: string, maritimo: boolean, especial: boolean, provisional: boolean, lineas: LineaDesglose[],
 *   articulo: string, resumen: string }} ResultadoPrecio */

const NB = ' ';

const ARTICULO = { moto: 'Una moto', quad: 'Un quad', barco: 'Un barco', coche: 'Un coche' };
const ARTICULO_WA = { moto: 'una moto', quad: 'un quad/UTV', barco: 'un barco', coche: 'un coche' };
const NOMBRE_CORTO = { moto: 'moto', quad: 'quad', barco: 'barco', coche: 'coche' };

/** Punto de miles siempre, sin decimales. */
function miles(n) {
  const s = String(Math.round(Math.abs(n)));
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += '.';
    out += s[i];
  }
  return (n < 0 ? '-' : '') + out;
}

/** Decimal con coma y `dec` decimales, con punto de miles en la parte entera. */
function decimal(n, dec) {
  const f = Math.pow(10, dec);
  const r = Math.round(n * f) / f;
  const ent = Math.trunc(r);
  let frac = String(Math.round(Math.abs(r - ent) * f));
  while (frac.length < dec) frac = '0' + frac;
  return dec > 0 ? `${miles(ent)},${frac}` : miles(ent);
}

/** Número corto con coma: 6.4 → '6,4', 6 → '6', 0.024 → '0,024'. */
function corto(n) {
  return String(Math.round(n * 1000) / 1000).replace('.', ',');
}

export function formatoEuros(n) {
  return `${miles(n)}${NB}€`;
}

export function formatoKm(n) {
  return `${miles(n)}${NB}km`;
}

export function formatoDuracion(km) {
  const minutos = Math.round((km / VELOCIDAD_MEDIA) * 60 / 5) * 5;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}${NB}h ${String(m).padStart(2, '0')}${NB}min`;
}

function destinoDe(id) {
  return DESTINOS.find((d) => d.id === id) ?? DESTINOS.find((d) => d.id === DESTINO_DEFECTO);
}

function cargaDe(id) {
  return CARGAS.find((c) => c.id === id) ?? CARGAS.find((c) => c.id === CARGA_DEFECTO);
}

/**
 * @param {Partial<EntradaPrecio>} entradaParcial
 * @returns {ResultadoPrecio}
 */
export function calcularPrecio(entradaParcial = {}) {
  const c = cargaDe(entradaParcial.carga);
  const d = destinoDe(entradaParcial.destino);
  const esBarco = c.id === 'barco';
  /** @type {EntradaPrecio} */
  const entrada = {
    carga: /** @type {CargaId} */ (c.id),
    destino: d.id,
    vuelta: Boolean(entradaParcial.vuelta),
  };
  if (esBarco) {
    entrada.eslora = typeof entradaParcial.eslora === 'number' && Number.isFinite(entradaParcial.eslora)
      ? entradaParcial.eslora : ESLORA_DEFECTO;
    entrada.manga = Boolean(entradaParcial.manga);
  }

  /** @type {LineaDesglose[]} */
  const lineas = [];
  const porKm = d.km * c.km;
  let x = c.base + porKm;
  lineas.push({ id: 'base', txt: `Salida: ${formatoEuros(c.base)}` });
  lineas.push({ id: 'km', txt: `${formatoKm(d.km)} × ${decimal(c.km, 2)}${NB}€/km = ${decimal(porKm, 2)}${NB}€` });
  if (x < c.min) {
    x = c.min;
    lineas.push({ id: 'minimo', txt: `Mínimo aplicado: ${formatoEuros(c.min)}` });
  }
  if (esBarco) {
    const extra = Math.max(0, (entrada.eslora ?? ESLORA_DEFECTO) - ESLORA_REF);
    if (extra > 0) {
      const pct = extra * RECARGO_ESLORA_M;
      x *= 1 + pct;
      lineas.push({
        id: 'eslora',
        txt: `Eslora ${corto(entrada.eslora ?? ESLORA_DEFECTO)}${NB}m: +${corto(pct * 100)}${NB}% (${corto(RECARGO_ESLORA_M * 100)}${NB}% por metro sobre ${corto(ESLORA_REF)}${NB}m)`,
      });
    }
    if (entrada.manga) {
      x *= 1 + RECARGO_ESPECIAL;
      lineas.push({
        id: 'manga',
        txt: `Manga > 2,55${NB}m: +${corto(RECARGO_ESPECIAL * 100)}${NB}% (autorización complementaria de circulación)`,
      });
    }
  }
  if (entrada.vuelta) {
    x *= FACTOR_IDA_VUELTA;
    lineas.push({ id: 'vuelta', txt: `Ida y vuelta: ×${corto(FACTOR_IDA_VUELTA)}` });
  }
  if (d.maritimo) {
    x += RECARGO_MARITIMO;
    lineas.push({ id: 'ferry', txt: `Ferry a Palma: +${formatoEuros(RECARGO_MARITIMO)}` });
  }
  const total = Math.round(x / REDONDEO) * REDONDEO;
  lineas.push({ id: 'redondeo', txt: `Redondeado a ${formatoEuros(REDONDEO)}` });

  const totalTxt = formatoEuros(total);
  const ruta = `${ORIGEN}–${d.nombre}`;
  return {
    entrada,
    total,
    totalTxt,
    km: d.km,
    kmTxt: formatoKm(d.km),
    duracionTxt: formatoDuracion(d.km),
    ruta,
    maritimo: Boolean(d.maritimo),
    especial: Boolean(esBarco && entrada.manga),
    provisional: PROVISIONAL,
    lineas,
    articulo: ARTICULO[c.id],
    resumen: `${NOMBRE_CORTO[c.id]} · ${ruta} · ${totalTxt}`,
  };
}

/** @param {ResultadoPrecio} r */
export function mensajeWhatsApp(r) {
  const e = r.entrada;
  const d = destinoDe(e.destino);
  let extra = '';
  if (e.carga === 'barco') {
    extra += `, eslora ${corto(e.eslora ?? ESLORA_DEFECTO)} m`;
    if (e.manga) extra += ', manga de más de 2,55 m';
  }
  return `Hola. Quiero transportar ${ARTICULO_WA[e.carga]} de ${ORIGEN} a ${d.nombre}, ${e.vuelta ? 'ida y vuelta' : 'solo ida'}${extra}. La web me da ${r.totalTxt} orientativos. ¿Qué fecha tenéis?`;
}

/** @param {ResultadoPrecio} r */
export function urlWhatsApp(r) {
  return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(mensajeWhatsApp(r))}`;
}

export function tablaPrecios() {
  return DESTINOS.map((d) => {
    const p = (carga) => calcularPrecio({ carga, destino: d.id, vuelta: false });
    return {
      id: d.id,
      nombre: d.nombre,
      km: d.km,
      kmTxt: formatoKm(d.km),
      duracionTxt: formatoDuracion(d.km),
      moto: p('moto').totalTxt,
      quad: p('quad').totalTxt,
      coche: p('coche').totalTxt,
      nautico: Boolean(d.nautico),
      maritimo: Boolean(d.maritimo),
    };
  });
}
