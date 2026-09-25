// Medición propia de capítulos, sin ScrollTrigger (§5.3, §5.4).
// e: progreso de entrada; p: progreso fijo; activo: el capítulo que contiene
// la línea central del viewport.
import { estado, emit, on, medirViewport, CAPITULOS, type CapId } from './estado.ts';
import { onFrame, lenis, irA } from './motion.ts';
import { clamp, muelleCritico } from '../guion/util.ts';

interface Medida { el: HTMLElement; top: number; alto: number; altoPista: number | null }
const medidas = new Map<CapId, Medida>();
let pendiente = false;
let yPrev = -1;
let tPrev = 0;
// En táctil el scroll es nativo, con inercia: un gesto recorre varias
// pantallas de golpe. La coreografía (e, p, activo) sigue a una y suavizada
// con un muelle crítico, como hace Lenis con la rueda en escritorio. La
// página se sigue moviendo con el dedo; solo la animación va detrás.
const OMEGA_TACTIL = 7;
let yCoreo = -1;
let vCoreo = 0;

export function medir(): void {
  medirViewport();
  for (const id of CAPITULOS) {
    const el = document.querySelector<HTMLElement>(`section.cap[data-cap="${id}"]`);
    if (!el) { medidas.delete(id); continue; }
    const y0 = scrollActual();
    const top = el.getBoundingClientRect().top + y0;
    const pista = el.querySelector<HTMLElement>(':scope > .cap__pista');
    medidas.set(id, { el, top, alto: el.offsetHeight, altoPista: pista ? pista.offsetHeight : null });
  }
  actualizar();
  emit('medidas', {});
}

function scrollActual(): number {
  const l = lenis();
  return l ? l.scroll : window.scrollY;
}

/** Datos crudos de la última medición (para módulos que cachean posiciones). */
export function medidaDe(cap: CapId): Readonly<Medida> | undefined {
  return medidas.get(cap);
}

/** px de scroll para un valor v de e o p de un capítulo (§5.4). */
export function scrollDe(cap: CapId, v: number, fase: 'e' | 'p' = 'p'): number {
  const m = medidas.get(cap);
  if (!m) return 0;
  const hs = estado.vp.hs;
  if (fase === 'e') return m.top - hs + v * hs;
  return m.top + v * Math.max(1, (m.altoPista ?? m.alto) - hs);
}

function actualizar(): void {
  const y = yCoreo >= 0 ? yCoreo : scrollActual();
  const hs = estado.vp.hs || window.innerHeight;
  for (const id of CAPITULOS) {
    const m = medidas.get(id);
    const c = estado.cap[id];
    if (!m) { c.e = 0; c.p = 0; continue; }
    c.e = clamp((y - (m.top - hs)) / hs);
    if (m.altoPista !== null) c.p = clamp((y - m.top) / Math.max(1, m.altoPista - hs));
    else c.p = m.alto > hs ? clamp((y - m.top) / (m.alto - hs)) : c.e;
  }
  const centro = y + estado.vp.h / 2;
  let activo: CapId = estado.activo;
  let encontrado = false;
  for (const id of CAPITULOS) {
    const m = medidas.get(id);
    if (m && centro >= m.top && centro < m.top + m.alto) { activo = id; encontrado = true; break; }
  }
  if (!encontrado) {
    // Por encima del primero o en el pie: el más cercano.
    const primero = medidas.get(CAPITULOS[0]);
    activo = primero && centro < primero.top ? CAPITULOS[0] : CAPITULOS[CAPITULOS.length - 1];
  }
  if (activo !== estado.activo) {
    const anterior = estado.activo;
    estado.activo = activo;
    emit('capitulo', { id: activo, anterior });
  }
}

function programarMedicion(): void {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(() => { pendiente = false; medir(); });
}

export function iniciarCapitulos(): void {
  medir();

  onFrame((t) => {
    const y = scrollActual();
    const l = lenis();
    if (yPrev < 0) { yPrev = y; tPrev = t; }
    const dt = t - tPrev;
    if (l) estado.scroll.vel = l.velocity * 60;
    else if (dt > 0) estado.scroll.vel = (y - yPrev) / dt;
    if (y !== yPrev) estado.scroll.dir = y > yPrev ? 1 : -1;
    estado.scroll.y = y;
    yPrev = y;
    tPrev = t;
    if (estado.modo.tactil && !estado.modo.reducido) {
      const salto = yCoreo < 0 || estado.scroll.saltando || dt <= 0 || Math.abs(y - yCoreo) > 3 * estado.vp.h;
      if (salto) { yCoreo = y; vCoreo = 0; }
      else [yCoreo, vCoreo] = muelleCritico(yCoreo, vCoreo, y, OMEGA_TACTIL, Math.min(dt, 0.05));
      if (Math.abs(yCoreo - y) < 0.5 && Math.abs(vCoreo) < 1) { yCoreo = y; vCoreo = 0; }
    }
    actualizar();
  }, 10);

  void document.fonts?.ready.then(() => medir());
  on('listo', () => medir());

  const main = document.querySelector('main');
  if (main && 'ResizeObserver' in window) {
    new ResizeObserver(() => programarMedicion()).observe(main);
  }

  let wPrev = window.innerWidth, hPrev = window.innerHeight;
  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    // En táctil, cambios solo de alto < 150 px son la barra de URL: no se remide la pista.
    if (estado.modo.tactil && w === wPrev && Math.abs(h - hPrev) < 150) {
      estado.vp.h = h;
      emit('medidas', {});
      return;
    }
    wPrev = w; hPrev = h;
    programarMedicion();
  });

  // Foco dentro de un escenario fijo: se lleva el scroll a la p donde su fase es visible.
  document.addEventListener('focusin', (ev) => {
    const el = ev.target as HTMLElement | null;
    if (!el?.closest) return;
    const conP = el.closest<HTMLElement>('[data-fase-p]');
    const sec = el.closest<HTMLElement>('section.cap--fija');
    if (!conP || !sec) return;
    if (!document.documentElement.classList.contains('js') || estado.modo.reducido) return;
    const cap = sec.dataset.cap as CapId;
    const p = Number(conP.dataset.faseP);
    const m = medidas.get(cap);
    if (!m) return;
    const y = scrollActual();
    const destino = scrollDe(cap, p);
    // Si el escenario ya está pegado y la fase del elemento está visible, no se mueve nada.
    const pistaFin = m.top + (m.altoPista ?? m.alto) - estado.vp.hs;
    const fase = el.closest<HTMLElement>('.fase');
    if (y >= m.top - 1 && y <= pistaFin + 1 && (!fase || fase.classList.contains('es-visible'))) return;
    void irA(destino, { inmediato: true });
  });

  // Posición para volver atrás / recargar (nunca unload: rompe la bfcache).
  window.addEventListener('pagehide', () => {
    try { sessionStorage.setItem('calzo:pos', String(Math.round(scrollActual()))); } catch { /* sin storage */ }
  });
}
