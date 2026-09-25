// 07 · Rutas (§2.7). Dueño: WP5. La rosa llega dibujada del build; aquí solo:
// - hover o foco en un rayo lo aísla (resto al 20 %, 150 ms por CSS) y escribe
//   la línea de lectura con la carga del store en vivo;
// - clic: fija el destino, lleva al panel y marca el select con un filo;
// - en compacto la rosa es un dibujo: rayos fuera del árbol de accesibilidad
//   y del orden de tabulación (la interfaz es la tabla #tarifas).
import { estado, on } from '../lib/estado.ts';
import { irA } from '../lib/motion.ts';
import { fijar, actual } from '../lib/calc.ts';
import { calcularPrecio, formatoKm } from '../lib/precio.js';
import { DESTINOS } from '../data/tarifas.js';

const NOMBRE_CARGA: Record<string, string> = { moto: 'moto', quad: 'quad', barco: 'barco', coche: 'coche' };

/** «Madrid – Sevilla · 530 km · unas 7 h 05 min · moto desde 280 €», con la carga actual. */
function lecturaDe(destino: string): string {
  const d = DESTINOS.find((x) => x.id === destino);
  if (!d) return '';
  const entrada = actual()?.entrada ?? { carga: 'moto', destino, vuelta: false };
  const r = calcularPrecio({ ...entrada, destino });
  return `Madrid – ${d.nombre} · ${formatoKm(d.km)} · unas ${r.duracionTxt} · ${NOMBRE_CARGA[r.entrada.carga]} desde ${r.totalTxt}`;
}

/** Filo --aluminio de 600 ms en el select del panel: dónde ha caído el clic. */
function filo(): void {
  const sel = document.querySelector<HTMLSelectElement>('#precio select[data-destino-select]');
  if (!sel || typeof sel.animate !== 'function') return;
  const alu = getComputedStyle(document.documentElement).getPropertyValue('--aluminio').trim() || '#A7AEB3';
  const k = { outlineStyle: 'solid', outlineWidth: '1px', outlineOffset: '2px' };
  sel.animate(
    [
      { ...k, outlineColor: alu },
      { ...k, outlineColor: alu, offset: 0.75 },
      { ...k, outlineColor: 'transparent' },
    ],
    { duration: 600, easing: 'linear' },
  );
}

export function iniciar(): void {
  const rosa = document.querySelector<SVGSVGElement>('#rutas .rutas__rosa');
  const lectura = document.querySelector<HTMLElement>('#rutas .rutas__lectura');
  if (!rosa) return;
  const rayos = [...rosa.querySelectorAll<SVGAElement>('.rutas__rayo[data-destino]')];

  let activo: SVGAElement | null = null;
  const escribir = (txt: string) => { if (lectura && lectura.textContent !== txt) lectura.textContent = txt; };
  const enReposo = () => escribir(lecturaDe(actual()?.entrada.destino ?? 'valencia'));

  enReposo();
  on('precio', () => {
    if (activo) escribir(lecturaDe(activo.dataset.destino ?? ''));
    else enReposo();
  });

  if (estado.modo.compacto) {
    rosa.setAttribute('role', 'img');
    for (const a of rayos) {
      a.setAttribute('aria-hidden', 'true');
      a.setAttribute('tabindex', '-1');
    }
    return;
  }

  const aislar = (a: SVGAElement) => {
    if (activo && activo !== a) activo.classList.remove('es-activo');
    activo = a;
    a.classList.add('es-activo');
    rosa.classList.add('aislando');
    escribir(lecturaDe(a.dataset.destino ?? ''));
  };
  const soltar = (a: SVGAElement) => {
    if (activo !== a) return;
    a.classList.remove('es-activo');
    activo = null;
    rosa.classList.remove('aislando');
    enReposo();
  };

  for (const a of rayos) {
    a.addEventListener('pointerenter', (ev) => { if (ev.pointerType !== 'touch') aislar(a); });
    a.addEventListener('pointerleave', () => { if (document.activeElement !== a) soltar(a); });
    a.addEventListener('focus', () => aislar(a));
    a.addEventListener('blur', () => soltar(a));
    a.addEventListener('click', (ev) => {
      if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      const destino = a.dataset.destino;
      if (!destino) return;
      // Nos quedamos con el clic: el interceptor de anclas de motion.ts lo ve
      // ya con defaultPrevented y no salta dos veces.
      ev.preventDefault();
      fijar({ destino }, 'rutas');
      history.replaceState(null, '', '#precio');
      soltar(a);
      void irA('#precio', { foco: true }).then(filo);
    });
  }
}
