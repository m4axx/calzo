// Única entrada de la página (§5.3). Orden de arranque fijo; cada paso en
// try/catch. Los módulos de capítulo no tienen efectos al importarse.
import { iniciarEstado, estado } from './estado.ts';
import { iniciarMotion, irA } from './motion.ts';
import { iniciarCapitulos, medir } from './capitulos.ts';
import { iniciarCalc } from './calc.ts';
import { iniciarRevelar } from './revelar.ts';
import { cargarEscena } from './escena-loader.ts';
import * as pieza from '../capitulos/pieza.ts';
import * as amarre from '../capitulos/amarre.ts';
import * as precio from '../capitulos/precio.ts';
import * as parte from '../capitulos/parte.ts';
import * as rutas from '../capitulos/rutas.ts';
import * as cierre from '../capitulos/cierre.ts';
import * as contactoCta from '../capitulos/contacto-cta.ts';
import * as nav from '../capitulos/nav.ts';
import * as barra from '../capitulos/barra.ts';
import * as motoSvg from '../capitulos/moto-svg.ts';

const html = document.documentElement;

function paso(nombre: string, fn: () => void, critico = false): boolean {
  try {
    fn();
    return true;
  } catch (err) {
    console.error(`[calzo] fallo en ${nombre}`, err);
    if (critico) html.classList.remove('js');
    return false;
  }
}

function arrancar(): void {
  paso('estado', iniciarEstado);
  if (!paso('motion', iniciarMotion, true)) return;
  if (!paso('capitulos', iniciarCapitulos, true)) return;
  paso('calc', () => { iniciarCalc(); });
  paso('revelar', iniciarRevelar);

  const modulos: Array<[string, { iniciar(): void }]> = [
    ['pieza', pieza], ['amarre', amarre], ['precio', precio], ['parte', parte], ['rutas', rutas],
    ['cierre', cierre], ['contacto-cta', contactoCta], ['nav', nav], ['barra', barra], ['moto-svg', motoSvg],
  ];
  for (const [nombre, m] of modulos) paso(nombre, () => m.iniciar());

  html.classList.add('app-viva');

  const q = new URLSearchParams(location.search);
  const visto = (() => { try { return sessionStorage.getItem('calzo:visto') === '1'; } catch { return false; } })();
  const contenedor = document.getElementById('capa-escena');
  if (contenedor) {
    void cargarEscena({
      contenedor,
      progreso: pieza.progresoCarga,
      limiteMs: visto || location.hash ? 600 : 2200,
    });
  }
  try { sessionStorage.setItem('calzo:visto', '1'); } catch { /* sin storage */ }

  // Restaurar posición: hash → ancla; back/forward o reload → última posición; si no, arriba.
  const nav0 = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  requestAnimationFrame(() => {
    medir();
    if (location.hash.length > 1 && !q.has('still')) {
      void irA(location.hash, { inmediato: true });
    } else if (nav0 && (nav0.type === 'back_forward' || nav0.type === 'reload')) {
      let y = 0;
      try { y = Number(sessionStorage.getItem('calzo:pos') ?? '0'); } catch { /* sin storage */ }
      if (y > 0) void irA(y, { inmediato: true });
    }
  });

  if (q.has('debug') || q.has('still') || q.has('tier') || q.has('rm')) {
    void import('./qa.ts');
  }
  void estado;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar, { once: true });
else arrancar();
