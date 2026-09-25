// 08 · Se baja igual (§2.8). La frase entra por máscara al cruzar p = 0,45 hacia delante y,
// con la ruta SVG, el reloj del desatado: al cruzar p = 0,30 hacia delante corre de 0 a 1,4 s
// y hacia atrás vuelve a atar (desatado(1,4 − t)). El reloj se publica en
// #contacto[data-desatado] y lo dibuja capitulos/moto-svg.ts. Sin efectos al importarse.
import { escena } from '../lib/escena-loader.ts';
import { estado, on } from '../lib/estado.ts';
import { onFrame } from '../lib/motion.ts';
import { cierre, DESATADO_S } from '../guion/cierre.ts';

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

/** Ráfaga (§2.0): un salto o un scroll muy rápido llevan los efectos por tiempo a su estado final. */
const rafaga = () => estado.scroll.saltando || Math.abs(estado.scroll.vel) > 3000;

export function iniciar(): void {
  const sec = document.getElementById('contacto');
  if (!sec) return;

  if (estado.modo.reducido) {
    const img = sec.querySelector<HTMLImageElement>('img[data-preset]');
    if (img) on('escena:lista', () => pedirQuieto(img));
    return; // sin frase por máscara ni desatado animado (§7.3)
  }

  const frase = sec.querySelector<HTMLElement>('.cierre__frase');
  let vista = false;
  let tDes = 0;          // segundos del desatado, 0..1,4 (0 = atada)
  let tPub = '';

  onFrame((t, dt) => {
    const c = estado.cap.contacto;
    const s = cierre(c.p);
    const salto = rafaga();

    // Frase: entra hacia delante por tiempo; hacia atrás se retira en seco.
    if (frase && s.frase !== vista) {
      vista = s.frase;
      if (vista && salto) {
        frase.style.transition = 'none';
        frase.classList.add('vista');
        void frase.offsetWidth;
        frase.style.transition = '';
      } else if (vista) {
        frase.classList.add('vista');
      } else {
        frase.style.transition = 'none';
        frase.classList.remove('vista');
        void frase.offsetWidth;
        frase.style.transition = '';
      }
    }

    // Reloj del desatado: solo lo necesita la ruta SVG (la escena 3D lleva el suyo en el director).
    if (estado.fuente !== 'svg') return;
    const objetivo = s.atado ? 0 : DESATADO_S;
    if (c.e <= 0) tDes = objetivo;                 // fuera de pantalla no hay nada que animar
    else if (salto) tDes = objetivo;
    else if (tDes !== objetivo) {
      const paso = dt > 0 ? dt : 0;
      tDes = objetivo > tDes ? Math.min(objetivo, tDes + paso) : Math.max(objetivo, tDes - paso);
    }
    const txt = tDes.toFixed(3);
    if (txt !== tPub) { sec.dataset.desatado = txt; tPub = txt; }
    void t;
  }, 15);
}
