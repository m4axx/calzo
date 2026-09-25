// 01 · El desvelado (§2.1). Línea de carga y de suelo, barrido de la ruta SVG,
// chip del nav y fotograma quieto con movimiento reducido. Sin efectos al importarse.
import type { Paso } from '../lib/escena-loader.ts';
import { escena } from '../lib/escena-loader.ts';
import { estado, on } from '../lib/estado.ts';
import { onFrame } from '../lib/motion.ts';
import { pieza } from '../guion/pieza.ts';

let suelo: HTMLElement | null = null;
let ultimaCarga = -1;

function lineaSuelo(): HTMLElement | null {
  if (!suelo) suelo = document.querySelector<HTMLElement>('#pieza .pieza__suelo');
  return suelo;
}

/** Callback de progreso de carga que app.ts pasa a cargarEscena (§5.4): la línea crece desde el centro. */
export function progresoCarga(fraccion: number, paso: Paso): void {
  void paso;
  const f = Math.max(0, Math.min(1, fraccion));
  if (f <= ultimaCarga) return; // el progreso real nunca retrocede
  ultimaCarga = f;
  lineaSuelo()?.style.setProperty('--carga', String(f));
}

/** Pide un fotograma quieto a la escena y lo funde al llegar (§7.3). */
function pedirQuieto(img: HTMLImageElement): void {
  const preset = img.dataset.preset as Parameters<NonNullable<ReturnType<typeof escena>>['capturar']>[0];
  const api = escena();
  if (!api || !preset) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.round((img.clientWidth || img.parentElement?.clientWidth || 800) * dpr);
  const h = Math.round(w * (img.height / img.width || 9 / 16));
  api.capturar(preset, { w, h }).then((url) => {
    img.addEventListener('load', () => img.classList.add('cargada'), { once: true });
    img.src = url;
  }).catch((err) => console.error('[calzo] captura', preset, err));
}

export function iniciar(): void {
  const html = document.documentElement;
  const sec = document.getElementById('pieza');
  if (!sec) return;
  const linea = lineaSuelo();
  const moto = sec.querySelector<SVGSVGElement>('.pieza__linea');

  on('listo', ({ fuente }) => {
    // Si la carga acaba antes de los 350 ms, la línea aparece ya entera junto con la moto.
    ultimaCarga = 1;
    linea?.style.setProperty('--carga', '1');
    linea?.classList.add('lista');

    // Barrido de la ruta SVG: un degradado recorre el trazo una vez en 1,6 s (§7.4). Solo si
    // la intro sigue viva (p ≤ 0,05, sin salto en curso): después se da por acabada.
    if (fuente !== 'svg' || estado.modo.reducido || !moto) return;
    if (estado.cap.pieza.p > 0.05 || estado.scroll.saltando || estado.activo !== 'pieza') return;
    const anim = moto.querySelector<SVGAnimateTransformElement>('#ml-barrido animateTransform');
    if (!anim || typeof anim.beginElement !== 'function') return;
    moto.classList.add('barre');
    anim.beginElement();
    window.setTimeout(() => moto.classList.remove('barre'), 1700);
  });

  if (estado.modo.reducido) {
    const img = sec.querySelector<HTMLImageElement>('img[data-preset]');
    if (img) on('escena:lista', () => pedirQuieto(img));
  }

  // Orden 15: la línea de suelo se funde cuando el suelo 3D la sustituye; el chip del nav, a p ≥ 0,9.
  let oPrev = -1;
  let chipPrev: boolean | null = null;
  onFrame(() => {
    const s = pieza(estado.cap.pieza.p);
    const o = estado.modo.reducido ? 0.7 : Math.round(0.7 * s.sueloDOM * 1000) / 1000;
    if (o !== oPrev && linea) { linea.style.setProperty('--suelo-o', String(o)); oPrev = o; }
    if (s.chip !== chipPrev) { html.classList.toggle('chip-visible', s.chip); chipPrev = s.chip; }
  }, 15);
}
