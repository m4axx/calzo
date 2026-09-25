// 05 · Parte con fotos (§2.5). Dueño: WP5.
// - Rellena la cabecera con la fecha y la hora del visitante.
// - Pide a la escena las cuatro fotos del parte en tiempo ocioso tras
//   `escena:lista` y las coloca cuando llegan (fundido de 200 ms por CSS).
// - Engancha los enlaces «Calcular para…» de #cargas: app.ts no inicia un
//   módulo de cargas y el componente no lleva <script>, así que viven aquí,
//   en el vecino de banda de papel.
import { estado, on } from '../lib/estado.ts';
import { escena } from '../lib/escena-loader.ts';
import { fijar } from '../lib/calc.ts';
import type { PresetId } from '../three/contrato-tipos.ts';
import type { EntradaPrecio } from '../lib/precio.js';

const LETRAS = ['A', 'B', 'C', 'D'] as const;
const PRESETS: readonly PresetId[] = ['parte.A', 'parte.B', 'parte.C', 'parte.D'];

/** dd-mm-aaaa y hh:mm con el reloj y la zona del visitante. */
function sello(fecha: Date): { dia: string; hora: string; iso: string } {
  const partes = (o: Intl.DateTimeFormatOptions) => {
    const r: Record<string, string> = {};
    for (const p of new Intl.DateTimeFormat('es-ES', o).formatToParts(fecha)) r[p.type] = p.value;
    return r;
  };
  const d = partes({ day: '2-digit', month: '2-digit', year: 'numeric' });
  const h = partes({ hour: '2-digit', minute: '2-digit', hour12: false });
  const dia = `${d.day}-${d.month}-${d.year}`;
  return { dia, hora: `${h.hour}:${h.minute}`, iso: `${d.year}-${d.month}-${d.day}` };
}

function colocar(foto: HTMLElement, url: string): void {
  const img = foto.querySelector<HTMLImageElement>('img');
  if (!img || img.getAttribute('src') === url) return;
  img.classList.remove('cargada');
  img.addEventListener('load', () => {
    img.classList.add('cargada');
    foto.classList.add('con-foto');
  }, { once: true });
  img.src = url;
}

function iniciarFotos(hoja: HTMLElement, fecha: Date): void {
  const fotos = new Map<PresetId, HTMLElement>();
  hoja.querySelectorAll<HTMLElement>('.parte__foto[data-k]').forEach((el) => {
    const k = Number(el.dataset.k);
    if (PRESETS[k]) fotos.set(PRESETS[k], el);
  });
  if (fotos.size === 0) return;

  // Lo que ya esté hecho (otra petición, una recarga del módulo) y lo que llegue.
  const aplicarHechas = () => {
    for (const [p, el] of fotos) {
      const url = estado.capturas[p];
      if (url) colocar(el, url);
    }
  };
  aplicarHechas();
  on('captura', ({ preset, url }) => {
    const el = fotos.get(preset);
    if (el) colocar(el, url);
  });

  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    const api = escena();
    if (!api) return;
    pedido = true;
    const compacto = estado.modo.compacto;
    const w = compacto ? 360 : 480;
    const h = compacto ? 270 : 360;
    PRESETS.forEach((p, i) => {
      if (estado.capturas[p]) return;
      api.capturar(p, { w, h, sello: { serie: 'CARGA', letra: LETRAS[i], fecha } })
        .then((url) => { const el = fotos.get(p); if (el) colocar(el, url); })
        .catch((err: unknown) => { console.warn(`[calzo] captura ${p}`, err); });
    });
  };

  on('escena:lista', () => {
    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;
    if (ric) ric(pedir, { timeout: 3000 });
    else setTimeout(pedir, 1);
  });
}

function iniciarCargas(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-fijar-carga]').forEach((a) => {
    // En el propio enlace: corre antes que el interceptor de anclas de
    // motion.ts (en document), que después hace el irA('#precio') con foco.
    a.addEventListener('click', (ev) => {
      if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      const carga = a.dataset.fijarCarga as EntradaPrecio['carga'] | undefined;
      if (carga) fijar({ carga }, 'cargas');
    });
  });
}

export function iniciar(): void {
  iniciarCargas();

  const hoja = document.querySelector<HTMLElement>('#parte .parte__hoja');
  if (!hoja) return;
  const fecha = new Date();
  const s = sello(fecha);
  const dia = hoja.querySelector<HTMLTimeElement>('[data-parte-fecha]');
  const hora = hoja.querySelector<HTMLElement>('[data-parte-hora]');
  if (dia) { dia.textContent = s.dia; dia.dateTime = s.iso; }
  if (hora) hora.textContent = s.hora;

  iniciarFotos(hoja, fecha);
}
