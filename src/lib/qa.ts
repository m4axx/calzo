// API de QA (§5.8). Solo se importa con ?debug, ?still, ?tier o ?rm.
import { estado, on, CAPITULOS, type CapId } from './estado.ts';
import { pausarTodo, reanudarTodo, irA, lenis, frameManual, onFrame } from './motion.ts';
import { medir as medirCaps, scrollDe } from './capitulos.ts';
import { escena } from './escena-loader.ts';
import { pieza, mezclaPieza } from '../guion/pieza.ts';
import { amarre } from '../guion/amarre.ts';
import { traspaso } from '../guion/traspaso.ts';
import { cierre, desatado } from '../guion/cierre.ts';

type Lectura = { selector: string; opacidad: number; dentro: boolean };

function selectorDe(el: Element): string {
  if (el.id) return `#${el.id}`;
  const partes: string[] = [];
  let e: Element | null = el;
  while (e && e !== document.body && partes.length < 4) {
    let s = e.tagName.toLowerCase();
    if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.');
    partes.unshift(s);
    e = e.parentElement;
  }
  return partes.join(' > ');
}

function opacidadEfectiva(el: Element): number {
  let o = 1;
  let e: Element | null = el;
  while (e) {
    o *= Number(getComputedStyle(e).opacity);
    e = e.parentElement;
  }
  return o;
}

async function ir(cap: CapId, v: number, fase: 'e' | 'p' = 'p'): Promise<void> {
  medirCaps();
  await irA(scrollDe(cap, v, fase), { inmediato: true });
  medirCaps();
  frameManual();
  escena()?.renderUnaVez();
}

const api = {
  estado,
  guion: { pieza, mezclaPieza, amarre, traspaso, cierre, desatado },
  pausar(): void { pausarTodo(); escena()?.pausar(); },
  reanudar(): void { reanudarTodo(); escena()?.reanudar(); },
  ir,
  renderUnaVez(): void { escena()?.renderUnaVez(); },
  info: () => escena()?.info() ?? null,
  pixel: (x: number, y: number) => escena()?.pixel(x, y) ?? Promise.resolve(null),
  async medir(ms: number): Promise<{ mediana: number; p95: number; max: number; largas: number }> {
    const tiempos: number[] = [];
    let largas = 0;
    let obs: PerformanceObserver | null = null;
    try {
      obs = new PerformanceObserver((l) => { largas += l.getEntries().filter((e) => e.duration > 50).length; });
      obs.observe({ type: 'longtask', buffered: false });
    } catch { /* sin longtask */ }
    let prev = performance.now();
    const quitar = onFrame(() => { const t = performance.now(); tiempos.push(t - prev); prev = t; }, 99);
    await new Promise((r) => setTimeout(r, ms));
    quitar();
    obs?.disconnect();
    tiempos.sort((a, b) => a - b);
    const q = (f: number) => tiempos[Math.min(tiempos.length - 1, Math.floor(f * tiempos.length))] ?? 0;
    return { mediana: q(0.5), p95: q(0.95), max: tiempos[tiempos.length - 1] ?? 0, largas };
  },
  recorrido(seg: number): Promise<void> {
    const max = document.documentElement.scrollHeight - innerHeight;
    const l = lenis();
    return new Promise((resolve) => {
      if (l) {
        l.scrollTo(0, { immediate: true, force: true });
        l.scrollTo(max, { duration: seg, easing: (t: number) => t, force: true, onComplete: () => resolve() });
      } else {
        const t0 = performance.now();
        const paso = () => {
          const f = Math.min(1, (performance.now() - t0) / (seg * 1000));
          scrollTo(0, f * max);
          if (f < 1) requestAnimationFrame(paso); else resolve();
        };
        paso();
      }
    });
  },
  async tab(): Promise<Lectura[]> {
    const enfocables = [...document.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea, summary, [tabindex]:not([tabindex="-1"])',
    )].filter((el) => !el.closest('dialog:not([open])') && el.offsetParent !== null);
    const malos: Lectura[] = [];
    for (const el of enfocables) {
      el.focus();
      await new Promise((r) => setTimeout(r, 60));
      frameManual();
      const r = el.getBoundingClientRect();
      const dentro = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
      const opacidad = opacidadEfectiva(el);
      if (opacidad <= 0.9 || !dentro) malos.push({ selector: selectorDe(el), opacidad, dentro });
    }
    return malos;
  },
};

declare global { interface Window { __calzo: typeof api } }
window.__calzo = api;

// ?still=amarre:0.62 · ?still=precio:e0.5
const q = new URLSearchParams(location.search);
const still = q.get('still');
if (still) {
  const [cap, v] = still.split(':');
  if ((CAPITULOS as readonly string[]).includes(cap) && v) {
    const fase = v.startsWith('e') ? 'e' : 'p';
    const num = Number(v.replace(/^[ep]/, ''));
    on('listo', () => {
      setTimeout(async () => {
        await ir(cap as CapId, num, fase);
        // Deja asentar muelles y efectos por tiempo antes de congelar.
        await new Promise((r) => setTimeout(r, 900));
        frameManual();
        escena()?.renderUnaVez();
        api.pausar();
      }, 60);
    });
  }
}

if (q.get('debug') === '1') {
  const r = document.createElement('div');
  r.setAttribute('aria-hidden', 'true');
  r.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99;font:12px/1.3 ui-monospace,monospace;color:#E4E6E3;background:rgb(11 13 14/.85);padding:6px 8px;pointer-events:none;white-space:pre';
  document.body.appendChild(r);
  let n = 0, t0 = performance.now(), fps = 0;
  onFrame(() => {
    n++;
    const t = performance.now();
    if (t - t0 > 500) { fps = Math.round((n * 1000) / (t - t0)); n = 0; t0 = t; }
    const c = estado.cap[estado.activo];
    r.textContent = `${fps} fps · ${estado.activo} e ${c.e.toFixed(3)} p ${c.p.toFixed(3)} · ${estado.fuente} · ${estado.modo.tier}`;
  }, 98);
}
