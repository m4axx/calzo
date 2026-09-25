// Entradas únicas (§1.4): como mucho una por capítulo, disparada una vez al
// 25 % de su entrada y nunca ligada al scroll.
//
//   data-revelar="mascara"  clip-path inset(0 0 100% 0) → inset(0), 0,9 s
//   data-revelar="trazo"    stroke-dashoffset 1 → 0 (el path lleva pathLength="1")
//   data-revelar="fundido"  opacidad 0 → 1, 0,2 s
//
//   data-revelar-dur="s"    duración propia (por defecto 0,9 / 0,9 / 0,2)
//   data-revelar-delay="s"  retardo propio; si falta, stagger por orden de documento
//   section[data-revelar-stagger="s"]  stagger del capítulo (por defecto 0,12)
//
// Con movimiento reducido todo es un fundido de 200 ms. En ráfaga (salto o
// scroll muy rápido) se aplica directamente el estado final.
import { estado, CAPITULOS, type CapId } from './estado.ts';
import { onFrame } from './motion.ts';

const hechos = new Set<CapId>();

function revelar(cap: CapId, sec: HTMLElement, rafaga: boolean): void {
  const els = [...sec.querySelectorAll<HTMLElement | SVGElement>('[data-revelar]')];
  const stagger = Number(sec.dataset.revelarStagger ?? '0.12');
  let i = 0;
  for (const el of els) {
    const tipo = el.dataset.revelar;
    const dur = el.dataset.revelarDur ?? (tipo === 'fundido' ? '0.2' : '0.9');
    const delay = el.dataset.revelarDelay ?? String(tipo === 'mascara' ? i * stagger : 0);
    if (tipo === 'mascara') i++;
    if (rafaga) {
      el.style.transition = 'none';
    } else if (estado.modo.reducido) {
      el.style.transition = 'opacity .2s var(--ease)';
    } else {
      el.style.transitionDuration = `${dur}s`;
      el.style.transitionDelay = `${delay}s`;
    }
    el.classList.add('revelado');
  }
  hechos.add(cap);
}

export function iniciarRevelar(): void {
  const secciones = new Map<CapId, HTMLElement>();
  for (const id of CAPITULOS) {
    const sec = document.querySelector<HTMLElement>(`section.cap[data-cap="${id}"]`);
    if (sec?.querySelector('[data-revelar]')) secciones.set(id, sec);
  }
  if (secciones.size === 0) return;
  const quitar = onFrame(() => {
    const rafaga = estado.scroll.saltando || Math.abs(estado.scroll.vel) > 3000;
    for (const [id, sec] of secciones) {
      if (hechos.has(id)) continue;
      if (estado.cap[id].e >= 0.25) revelar(id, sec, rafaga);
    }
    if (hechos.size === secciones.size) quitar();
  }, 15);
}
