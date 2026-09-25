// Nav (§3.6, §8.3). Dueño: WP4.
// - html.nav-solida cuando el activo no es el héroe (la pone este módulo).
// - Texto del chip al cambiar el cálculo. Su visibilidad es solo CSS sobre
//   html.chip-visible, que pone capitulos/pieza.ts (WP3).
// - Índice: <dialog> nativo con showModal(); Lenis parado mientras está abierto.
import { estado, on } from '../lib/estado.ts';
import { lenis, irA } from '../lib/motion.ts';
import { actual } from '../lib/calc.ts';
import { CARGAS, DESTINOS } from '../data/tarifas.js';
import type { ResultadoPrecio } from '../lib/precio.js';

function textoChip(r: ResultadoPrecio): string {
  const c = CARGAS.find((x) => x.id === r.entrada.carga)?.nombre ?? '';
  const d = DESTINOS.find((x) => x.id === r.entrada.destino)?.nombre ?? '';
  return `${c} · ${d} · ${r.totalTxt}`;
}

export function iniciar(): void {
  const html = document.documentElement;

  // ——— sólida fuera del héroe ———
  const solida = () => html.classList.toggle('nav-solida', estado.activo !== 'pieza');
  solida();
  on('capitulo', solida);

  // ——— chip ———
  const chip = document.querySelector<HTMLAnchorElement>('.nav__chip');
  const chipTxt = chip?.querySelector<HTMLElement>('.nav__chip-txt');
  const pintarChip = (r: ResultadoPrecio) => {
    if (!chip || !chipTxt) return;
    const t = textoChip(r);
    if (chipTxt.textContent !== t) chipTxt.textContent = t;
    chip.setAttribute('aria-label', `Precio: ${t}`);
  };
  const r0 = actual() ?? estado.calc;
  if (r0) pintarChip(r0);
  on('precio', pintarChip);

  // ——— índice ———
  const boton = document.querySelector<HTMLButtonElement>('button[data-indice]');
  const dialogo = document.getElementById('indice') as HTMLDialogElement | null;
  if (!boton || !dialogo || typeof dialogo.showModal !== 'function') return;

  boton.addEventListener('click', () => {
    if (dialogo.open) return;
    dialogo.showModal();
    lenis()?.stop();
  });
  // Esc, «Cerrar» o un enlace: el diálogo nativo devuelve el foco al botón.
  dialogo.addEventListener('close', () => { lenis()?.start(); });
  dialogo.querySelector('[data-indice-cerrar]')?.addEventListener('click', () => dialogo.close());
  // Clic en el fondo (fuera de la caja del diálogo) también cierra.
  dialogo.addEventListener('click', (ev) => {
    if (ev.target !== dialogo) return;
    const r = dialogo.getBoundingClientRect();
    const { clientX: x, clientY: y } = ev as MouseEvent;
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) dialogo.close();
  });

  dialogo.addEventListener('click', (ev) => {
    const a = (ev.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const hash = a.getAttribute('href') ?? '';
    if (!document.getElementById(hash.slice(1))) return;
    // Se adelanta al interceptor de anclas de motion.ts: primero se cierra y se
    // reanuda Lenis; después el salto (irA usa force: true) con foco.
    ev.preventDefault();
    ev.stopPropagation();
    dialogo.close();
    lenis()?.start();
    history.replaceState(null, '', hash);
    void irA(hash, { foco: true });
  });
}
