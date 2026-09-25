// Barra inferior en compacto (§7.2). Dueño: WP4.
// Visible desde pieza.p > 0,9; oculta mientras #precio ocupa más del 30 % del
// viewport. El botón pasa a fondo cincha desde scrollDe('amarre', 0.90).
// Todo sale de estado y de medidas cacheadas: no se lee el layout por frame.
import { estado, on } from '../lib/estado.ts';
import { onFrame } from '../lib/motion.ts';
import { medidaDe, scrollDe } from '../lib/capitulos.ts';
import { actual } from '../lib/calc.ts';
import { CARGAS, DESTINOS } from '../data/tarifas.js';
import type { ResultadoPrecio } from '../lib/precio.js';

export function iniciar(): void {
  const barra = document.getElementById('barra-movil');
  if (!barra) return;
  const que = barra.querySelector<HTMLElement>('[data-barra-que]');

  const pintar = (r: ResultadoPrecio) => {
    if (!que) return;
    const c = CARGAS.find((x) => x.id === r.entrada.carga)?.nombre ?? '';
    const d = DESTINOS.find((x) => x.id === r.entrada.destino)?.nombre ?? '';
    const t = `${c} a ${d}`;
    if (que.textContent !== t) que.textContent = t;
  };
  const r0 = actual() ?? estado.calc;
  if (r0) pintar(r0);
  on('precio', pintar);

  // Solo existe en compacto; en escritorio no se registra ni el frame.
  if (!estado.modo.compacto) return;

  let yAtada = Infinity;
  let precio = { top: 0, alto: 0 };
  const cachear = () => {
    yAtada = scrollDe('amarre', 0.9);
    const m = medidaDe('precio');
    precio = m ? { top: m.top, alto: m.alto } : { top: 0, alto: 0 };
  };
  cachear();
  on('medidas', cachear);

  let visible = false, atada = false;
  onFrame(() => {
    const y = estado.scroll.y, h = estado.vp.h || window.innerHeight;
    const solape = Math.max(0, Math.min(y + h, precio.top + precio.alto) - Math.max(y, precio.top));
    const v = estado.cap.pieza.p > 0.9 && solape / h <= 0.3;
    const at = y >= yAtada;
    if (v !== visible) { visible = v; barra.classList.toggle('es-visible', v); }
    if (at !== atada) { atada = at; barra.classList.toggle('es-atada', at); }
  }, 15);
}
