// 02 · Cómo se ata (§2.2) y overlay del traspaso en #capa-cinchas (§5.6.7).
// Las fases de texto son función de p (rampas de §5.7); el overlay dibuja las cuatro cintas
// de estado.cinchas2D camino de las esquinas del panel. Sin efectos al importarse.
import { escena } from '../lib/escena-loader.ts';
import { estado, on, type Cincha2D, type DestinoCincha } from '../lib/estado.ts';
import { onFrame } from '../lib/motion.ts';
import { opacidadTexto, type TextoAmarre } from '../guion/amarre.ts';
import { traspaso, trazoCincha } from '../guion/traspaso.ts';

const SVGNS = 'http://www.w3.org/2000/svg';
const FASES: readonly TextoAmarre[] = ['titulo', 'rueda', 'tija', 'horquilla'];

function pedirQuieto(img: HTMLImageElement): void {
  const preset = img.dataset.preset as Parameters<NonNullable<ReturnType<typeof escena>>['capturar']>[0];
  const api = escena();
  if (!api || !preset) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.round((img.clientWidth || img.parentElement?.clientWidth || 800) * dpr);
  const h = Math.round(w * (img.height / img.width || 3 / 4));
  api.capturar(preset, { w, h }).then((url) => {
    img.addEventListener('load', () => img.classList.add('cargada'), { once: true });
    img.src = url;
  }).catch((err) => console.error('[calzo] captura', preset, err));
}

interface Trazo { g: SVGGElement; cinta: SVGPathElement; tejido: SVGPathElement; carraca: SVGPathElement; anilla: SVGCircleElement; d: string; dc: string; t: string; oc: string; an: string }

/** Crea en #capa-cinchas las cuatro cintas con el mismo estilo que las del panel (WP4). */
function crearOverlay(capa: SVGSVGElement): Trazo[] {
  capa.replaceChildren();
  const trazos: Trazo[] = [];
  for (let i = 0; i < 4; i++) {
    const g = document.createElementNS(SVGNS, 'g');
    const cinta = document.createElementNS(SVGNS, 'path');
    cinta.setAttribute('data-cincha', String(i));
    cinta.setAttribute('fill', 'var(--cincha)');
    cinta.style.fill = 'var(--cincha)';
    const tejido = document.createElementNS(SVGNS, 'path');
    tejido.setAttribute('fill', 'url(#tejido)');
    tejido.style.opacity = '0';
    const carraca = document.createElementNS(SVGNS, 'path');
    carraca.style.cssText = 'fill:var(--grafito-alto);stroke:var(--aluminio);stroke-width:1;stroke-linejoin:round;opacity:0';
    const anilla = document.createElementNS(SVGNS, 'circle');
    anilla.style.cssText = 'fill:none;stroke:var(--aluminio);stroke-width:1.5;opacity:0';
    g.append(cinta, tejido, carraca, anilla);
    capa.append(g);
    trazos.push({ g, cinta, tejido, carraca, anilla, d: '', dc: '', t: '', oc: '', an: '' });
  }
  return trazos;
}

/** Destino ficticio para dibujar el polígono de partida cuando aún no hay panel (h = 0 exacto). */
function sinDestino(c: Cincha2D): DestinoCincha {
  const w = Math.hypot(c.ladoA[0][0] - c.ladoA[1][0], c.ladoA[0][1] - c.ladoA[1][1]);
  return { anilla: c.a, esquinaPanel: c.b, ancho: w || 10 };
}

export function iniciar(): void {
  const sec = document.getElementById('amarre');
  if (!sec) return;
  const reducido = estado.modo.reducido;

  if (reducido) {
    const imgs = [...sec.querySelectorAll<HTMLImageElement>('img[data-preset]')];
    on('escena:lista', () => imgs.forEach(pedirQuieto));
  } else {
    // ——— orden 15: opacidad de las fases de texto y .es-visible (≥ 0,5) ———
    const fases = FASES.map((f) => sec.querySelector<HTMLElement>(`.fase[data-fase="${f}"]`));
    const previas = FASES.map(() => -1);
    onFrame(() => {
      const p = estado.cap.amarre.p;
      for (let i = 0; i < FASES.length; i++) {
        const el = fases[i];
        if (!el) continue;
        const o = Math.round(opacidadTexto(p, FASES[i]) * 1000) / 1000;
        if (o === previas[i]) continue;
        previas[i] = o;
        el.style.opacity = String(o);
        el.classList.toggle('es-visible', o >= 0.5);
      }
    }, 15);
  }

  // ——— orden 40: overlay del traspaso ———
  const capa = document.getElementById('capa-cinchas') as SVGSVGElement | null;
  if (!capa) return;
  const trazos = crearOverlay(capa);
  let visible = false;
  const mostrar = (v: boolean) => {
    if (v === visible) return;
    visible = v;
    capa.style.visibility = v ? 'visible' : 'hidden';
  };
  onFrame(() => {
    const c2 = estado.cinchas2D;
    const h = traspaso(estado.cap.precio.e);
    const dest = estado.destinoCinchas;
    const ver = !reducido && c2 !== null && estado.fuente !== 'ninguna'
      && estado.cap.amarre.p >= 0.9 && h < 1 && (dest !== null || h === 0);
    mostrar(ver);
    if (!ver || !c2) return;
    for (let i = 0; i < 4; i++) {
      const c = c2[i];
      const hasta = dest ? dest[c.esquina] : sinDestino(c);
      const r = trazoCincha(c, hasta, dest ? h : 0);
      const tr = trazos[i];
      if (r.d !== tr.d) { tr.cinta.setAttribute('d', r.d); tr.tejido.setAttribute('d', r.d); tr.d = r.d; }
      const t = String(Math.round(r.textura * 1000) / 1000);
      if (t !== tr.t) { tr.tejido.style.opacity = t; tr.t = t; }
      if (r.carraca !== tr.dc) { tr.carraca.setAttribute('d', r.carraca); tr.dc = r.carraca; }
      const oc = String(Math.round(r.opacidadCarraca * 1000) / 1000);
      if (oc !== tr.oc) { tr.carraca.style.opacity = oc; tr.oc = oc; }
      // La anilla del destino, como la dibuja el panel en flujo, en cuanto la cinta viaja.
      const an = dest && h > 0 ? `${hasta.anilla[0]} ${hasta.anilla[1]} ${Math.max(3.5, hasta.ancho / 2)}` : '';
      if (an !== tr.an) {
        tr.an = an;
        if (an) {
          const [x, y, rr] = an.split(' ');
          tr.anilla.setAttribute('cx', x); tr.anilla.setAttribute('cy', y); tr.anilla.setAttribute('r', rr);
          tr.anilla.style.opacity = '1';
        } else tr.anilla.style.opacity = '0';
      }
    }
  }, 40);
}
