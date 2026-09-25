// 03 · Precio (§2.3, §5.6, §6). Dueño: WP4.
//
// Tres trabajos, y ninguno lee el layout por frame:
//  1. Lectura del panel: cifra con fundido cruzado (180 ms), regla, desglose,
//     testigo y mini-lámina, al evento `precio`.
//  2. Orden 12: `estado.destinoCinchas` para el overlay del traspaso (WP3), a
//     partir de la geometría del marco cacheada en `medidas` menos scroll.y.
//  3. Orden 45: cinchas en flujo (svg.precio__amarre) y asiento del panel. A h = 1
//     dibujan con trazoCincha(null, destino, 1, asiento) exactamente lo mismo que
//     el overlay en ese instante (asiento 0), solo que en coordenadas del marco.
import { estado, on, type Esquina, type DestinoCincha } from '../lib/estado.ts';
import { onFrame, lenis } from '../lib/motion.ts';
import { actual } from '../lib/calc.ts';
import { DESTINOS } from '../data/tarifas.js';
import type { ResultadoPrecio } from '../lib/precio.js';
import { traspaso, destinos, trazoCincha } from '../guion/traspaso.ts';
import { muelleCritico } from '../guion/util.ts';

const ESQUINAS: readonly Esquina[] = ['ti', 'td', 'bi', 'bd'];
const ASIENTO_PX = 3.5;
const COMPRESION = 0.004;   // scaleY 0,996 en asiento completo
const OMEGA = 33;
const RAFAGA_VEL = 3000;    // px/s (§2.0)
const DEBOUNCE_SR = 400;    // ms: el lector de pantalla solo oye el valor final

interface Geo {
  marcoX: number; marcoY: number;   // esquina del marco en px de documento
  w: number; h: number;             // tamaño del marco (viewBox del svg)
  px: number; py: number; pw: number; ph: number; // panel dentro del marco, sin transform
  dx: number; dy: number; ancho: number;
}

let geo: Geo | null = null;
let version = 0;

// muelle del asiento: x normalizado 0 (suelto) → 1 (asentado)
let asX = 0, asV = 0;
let dibujado = { version: -1, x: -1, visible: false };
let yDestino = NaN, versionDestino = -1;

function escribirCifra(el: HTMLOutputElement, r: ResultadoPrecio, animar: boolean): void {
  const vs = el.querySelectorAll<HTMLElement>('.precio__cifra-v');
  if (vs.length < 2) return;
  const activa = vs[0].classList.contains('es-activa') ? vs[0] : vs[1];
  const otra = activa === vs[0] ? vs[1] : vs[0];
  if (activa.textContent === r.totalTxt) return;
  if (!animar || estado.modo.reducido) {
    activa.textContent = r.totalTxt;
    otra.textContent = '';
  } else {
    // Fundido cruzado: la nueva cifra entra en el span oculto y se intercambian
    // las clases; la transición de opacidad (180 ms, --ease) la hace el CSS.
    otra.textContent = r.totalTxt;
    otra.classList.add('es-activa');
    activa.classList.remove('es-activa');
  }
}

export function iniciar(): void {
  const sec = document.getElementById('precio');
  const marco = sec?.querySelector<HTMLElement>('.precio__marco');
  const panel = sec?.querySelector<HTMLElement>('.precio__panel');
  const svg = sec?.querySelector<SVGSVGElement>('svg.precio__amarre');
  const form = document.getElementById('calc') as HTMLFormElement | null;
  if (!sec || !marco || !panel || !svg || !form) return;
  const html = document.documentElement;

  // ——— lectura ———
  const cifra = sec.querySelector<HTMLOutputElement>('output.precio__cifra')!;
  const sr = cifra.querySelector<HTMLElement>('.sr')!;
  const provisional = sec.querySelector<HTMLElement>('.precio__provisional');
  const regla = sec.querySelector<HTMLElement>('.regla');
  const reglaDestino = sec.querySelector<HTMLElement>('.regla__destino');
  const reglaKm = sec.querySelector<HTMLElement>('.regla__km');
  const porTrayecto = sec.querySelector<HTMLElement>('.precio__por-trayecto');
  const ferry = sec.querySelector<HTMLElement>('.precio__ferry');
  const lineas = sec.querySelector<HTMLOListElement>('.precio__lineas');
  const eslora = sec.querySelector<HTMLOutputElement>('.precio__eslora');
  let tSr = 0;

  const pintar = (r: ResultadoPrecio, animar: boolean) => {
    escribirCifra(cifra, r, animar);
    window.clearTimeout(tSr);
    if (!animar) sr.textContent = r.totalTxt;
    else tSr = window.setTimeout(() => { if (sr.textContent !== r.totalTxt) sr.textContent = r.totalTxt; }, DEBOUNCE_SR);
    if (provisional) provisional.hidden = !r.provisional;

    const d = DESTINOS.find((x) => x.id === r.entrada.destino);
    if (regla) {
      regla.style.setProperty('--f', Math.min(1, r.km / 750).toFixed(4));
      regla.classList.toggle('es-vuelta', r.entrada.vuelta);
    }
    if (reglaDestino && d) reglaDestino.textContent = d.nombre;
    if (reglaKm) reglaKm.textContent = r.kmTxt;
    if (porTrayecto) porTrayecto.hidden = !r.entrada.vuelta;
    if (ferry) ferry.hidden = !r.maritimo;

    if (lineas) {
      const frag = document.createDocumentFragment();
      for (const l of r.lineas) {
        const li = document.createElement('li');
        li.dataset.linea = l.id;
        const igual = l.txt.lastIndexOf(' = ');
        const dos = l.txt.indexOf(': ');
        const i = igual >= 0 ? igual : dos;
        const sep = igual >= 0 ? 3 : 2;
        if (i >= 0) {
          const a = document.createElement('span'); a.textContent = l.txt.slice(0, i);
          const g = document.createElement('span'); g.className = 'precio__guia'; g.setAttribute('aria-hidden', 'true');
          const b = document.createElement('span'); b.textContent = l.txt.slice(i + sep);
          li.append(a, g, b);
        } else {
          const a = document.createElement('span'); a.textContent = l.txt;
          li.append(a);
        }
        frag.append(li);
      }
      lineas.replaceChildren(frag);
    }

    if (eslora) {
      const m = r.entrada.eslora ?? Number((document.getElementById('eslora') as HTMLInputElement | null)?.value ?? 6.4);
      eslora.textContent = `${String(Math.round(m * 10) / 10).replace('.', ',')} m`;
    }
    // BarcoSeccion (WP5) ensancha el casco de la mini-lámina con esta clase (§5.5).
    html.classList.toggle('manga-ancha', r.entrada.carga === 'barco' && Boolean(r.entrada.manga));
  };

  // calc.ts ya pintó y emitió antes de que este módulo arrancara (§5.3): se
  // toma el resultado actual sin animar (p. ej. ?carga=quad&destino=barcelona).
  const r0 = actual() ?? estado.calc;
  if (r0) pintar(r0, false);
  on('precio', (r) => pintar(r, true));

  // El range pinta su lectura mientras se arrastra; calc.ts recalcula en `input`.
  form.addEventListener('submit', (ev) => ev.preventDefault());

  // WhatsApp: pestaña nueva en escritorio; en compacto, la misma (abre la app).
  if (estado.modo.compacto) {
    sec.querySelectorAll<HTMLAnchorElement>('a[data-wa]').forEach((a) => { a.removeAttribute('target'); });
  }

  // ——— tabla de tarifas: abierta en el HTML (sin JS), cerrada con JS ———
  const tarifas = document.getElementById('tarifas') as HTMLDetailsElement | null;
  if (tarifas) {
    if (location.hash !== '#tarifas') tarifas.open = false;
    document.addEventListener('click', (ev) => {
      const a = (ev.target as Element | null)?.closest?.('a[href="#tarifas"]');
      if (a) tarifas.open = true;
    }, true);
  }

  // ——— geometría cacheada en `medidas` ———
  const anillas = svg.querySelectorAll<SVGCircleElement>('.precio__anilla');
  const grupos = [...svg.querySelectorAll<SVGGElement>('.precio__cinchas > g')].map((g) => ({
    cinta: g.querySelector<SVGPathElement>('.precio__cinta')!,
    tejido: g.querySelector<SVGPathElement>('.precio__tejido')!,
    carraca: g.querySelector<SVGPathElement>('.precio__carraca')!,
  }));

  const medirMarco = () => {
    const y0 = lenis()?.scroll ?? window.scrollY;
    const rc = marco.getBoundingClientRect();
    const cs = getComputedStyle(marco);
    // --amarre-dx/dy son clamp() en escritorio: una custom property sin
    // registrar no se resuelve a px, así que se leen del padding del marco,
    // que es exactamente var(--amarre-dx) / var(--amarre-dy).
    const dx = parseFloat(cs.paddingLeft) || 0;
    const dy = parseFloat(cs.paddingTop) || 0;
    const ancho = parseFloat(cs.getPropertyValue('--cincha-ancho')) || (estado.modo.compacto ? 6 : 10);
    geo = {
      marcoX: rc.left + (window.scrollX || 0),
      marcoY: rc.top + y0,
      w: marco.offsetWidth, h: marco.offsetHeight,
      px: panel.offsetLeft, py: panel.offsetTop, pw: panel.offsetWidth, ph: panel.offsetHeight,
      dx, dy, ancho,
    };
    version++;
    svg.setAttribute('viewBox', `0 0 ${geo.w} ${geo.h}`);
    const loc = destinosLocales(geo);
    const rAnilla = Math.max(3.5, geo.ancho * 0.5);
    ESQUINAS.forEach((esq, i) => {
      const c = anillas[i];
      if (!c) return;
      c.setAttribute('cx', String(loc[esq].anilla[0]));
      c.setAttribute('cy', String(loc[esq].anilla[1]));
      c.setAttribute('r', String(rAnilla));
    });
  };
  on('medidas', medirMarco);
  medirMarco();

  // ——— orden 12: destino del traspaso en px de viewport ———
  onFrame(() => {
    if (!geo) return;
    const am = estado.cap.amarre.p, e = estado.cap.precio.e;
    if (!(am >= 0.9 || (e > 0 && e <= 1))) return;
    const y = estado.scroll.y;
    if (y === yDestino && version === versionDestino && estado.destinoCinchas) return;
    yDestino = y; versionDestino = version;
    const top = geo.marcoY - y + geo.py;
    const left = geo.marcoX + geo.px;
    estado.destinoCinchas = destinos(
      { left, top, right: left + geo.pw, bottom: top + geo.ph }, geo.dx, geo.dy, geo.ancho,
    );
  }, 12);

  // ——— orden 45: asiento del panel y cinchas en flujo ———
  onFrame((_t, dt) => {
    if (!geo) return;
    const reducido = estado.modo.reducido;
    const h = traspaso(estado.cap.precio.e);
    const visible = reducido || h >= 1;
    // Con movimiento reducido no hay asiento: las cinchas están en su estado final.
    const objetivo = !reducido && h >= 1 ? 1 : 0;
    const rafaga = estado.scroll.saltando || Math.abs(estado.scroll.vel) > RAFAGA_VEL;
    if (rafaga || reducido) { asX = objetivo; asV = 0; }
    else if (asX !== objetivo || asV !== 0) {
      [asX, asV] = muelleCritico(asX, asV, objetivo, OMEGA, dt);
      if (Math.abs(asX - objetivo) < 1e-4 && Math.abs(asV) < 1e-3) { asX = objetivo; asV = 0; }
    }

    const cambioAsiento = Math.abs(asX - dibujado.x) > 1e-4;
    if (cambioAsiento) {
      const a = ASIENTO_PX * asX, c = 1 - COMPRESION * asX;
      panel.style.transform = asX === 0 ? '' : `translateY(${a.toFixed(3)}px) scaleY(${c.toFixed(5)})`;
    }
    if (visible !== dibujado.visible) svg.classList.toggle('es-visible', visible);
    if (visible && (cambioAsiento || version !== dibujado.version || visible !== dibujado.visible)) {
      dibujarCinchas(grupos, geo, asX);
    }
    dibujado = { version, x: asX, visible };
  }, 45);
}

/** Destinos en coordenadas del marco (1 unidad = 1 px), sin asiento. */
function destinosLocales(g: Geo): Record<Esquina, DestinoCincha> {
  return destinos({ left: g.px, top: g.py, right: g.px + g.pw, bottom: g.py + g.ph }, g.dx, g.dy, g.ancho);
}

type Grupo = { cinta: SVGPathElement; tejido: SVGPathElement; carraca: SVGPathElement };
function dibujarCinchas(grupos: Grupo[], g: Geo, x: number): void {
  const dest = destinosLocales(g);
  const a = ASIENTO_PX * x;
  const c = 1 - COMPRESION * x;
  // transform-origin 50 % 100 %: el borde de abajo baja `a`; el de arriba, además,
  // lo que se comprime el alto (§5.6.9).
  const asiento = { arriba: a + (1 - c) * g.ph, abajo: a };
  ESQUINAS.forEach((esq, i) => {
    const gr = grupos[i];
    if (!gr) return;
    const t = trazoCincha(null, dest[esq], 1, asiento);
    gr.cinta.setAttribute('d', t.d);
    gr.tejido.setAttribute('d', t.d);
    gr.tejido.style.opacity = String(t.textura);
    gr.carraca.setAttribute('d', t.carraca);
    gr.carraca.style.opacity = String(t.opacidadCarraca);
  });
}
