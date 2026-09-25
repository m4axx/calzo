// Movimiento: gsap core, el único CustomEase de marca, Lenis, el único rAF
// (gsap.ticker) y los saltos de navegación (§3.8, §5.3, §5.4).
// Sin efectos al importarse.
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import { estado } from './estado.ts';
import { easeCalzo, clamp } from '../guion/util.ts';

export { gsap, CustomEase };
export const EASE = 'calzo';

type FnFrame = (t: number, dt: number) => void;
interface Suscripcion { fn: FnFrame; orden: number; id: number }

let _lenis: Lenis | null = null;
let iniciado = false;
let subs: Suscripcion[] = [];
let sigId = 0;
let teletransporte: (() => void) | null = null;
let tUlt = -1;

export function lenis(): Lenis | null {
  return _lenis;
}

/** Registra una función por frame. Orden ascendente; por defecto 15 (§5.3). */
export function onFrame(fn: FnFrame, orden = 15): () => void {
  const s = { fn, orden, id: sigId++ };
  subs = [...subs, s].sort((a, b) => a.orden - b.orden || a.id - b.id);
  return () => { subs = subs.filter((x) => x !== s); };
}

/** El loader de la escena registra aquí director.teletransportar(). */
export function registrarTeletransporte(fn: (() => void) | null): void {
  teletransporte = fn;
}

/** Ejecuta un frame de todos los onFrame con dt = 0 (QA y saltos inmediatos). */
export function frameManual(): void {
  const t = performance.now() / 1000;
  for (const s of subs) {
    try { s.fn(t, 0); } catch (err) { console.error('[calzo] onFrame', err); }
  }
}

function tick(time: number, deltaMs: number): void {
  const dt = Math.min(deltaMs, 50) / 1000;
  tUlt = time;
  if (_lenis) _lenis.raf(time * 1000);
  estado.qa.frames++;
  for (const s of subs) {
    try { s.fn(time, dt); } catch (err) { console.error('[calzo] onFrame', err); }
  }
}

export function iniciarMotion(): void {
  if (iniciado) return;
  iniciado = true;
  gsap.registerPlugin(CustomEase);
  CustomEase.create('calzo', '0.62,0,0.12,1');
  gsap.defaults({ ease: 'calzo', duration: 0.9 });
  gsap.ticker.lagSmoothing(0);

  history.scrollRestoration = 'manual';

  if (!estado.modo.reducido) {
    _lenis = new Lenis({
      lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false, anchors: false, autoRaf: false,
    });
  }

  // gsap.ticker añade el callback después de su propio updateRoot: el orden
  // del frame queda Lenis → tweens → onFrame (§5.3).
  gsap.ticker.add(tick);

  // Anclas internas: sin salto nativo; irA con foco y replaceState.
  document.addEventListener('click', (ev) => {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    const a = (ev.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const hash = a.getAttribute('href') ?? '';
    if (hash.length < 2) return;
    const destino = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!destino) return;
    ev.preventDefault();
    history.replaceState(null, '', hash);
    void irA(destino, { foco: true });
  });
}

function yDe(destino: string | HTMLElement | number): number | null {
  if (typeof destino === 'number') return destino;
  const el = typeof destino === 'string'
    ? document.getElementById(decodeURIComponent(destino.replace(/^#/, '')))
    : destino;
  if (!el) return null;
  const y0 = _lenis ? _lenis.scroll : window.scrollY;
  return el.getBoundingClientRect().top + y0;
}

function enfocar(destino: string | HTMLElement | number): void {
  if (typeof destino === 'number') return;
  const el = typeof destino === 'string'
    ? document.getElementById(decodeURIComponent(destino.replace(/^#/, '')))
    : destino;
  if (!el) return;
  if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
    el.setAttribute('tabindex', '-1');
  }
  el.focus({ preventScroll: true });
}

export function irA(destino: string | HTMLElement | number,
  opts: { inmediato?: boolean; duracion?: number; foco?: boolean } = {}): Promise<void> {
  const y = yDe(destino);
  if (y === null) return Promise.resolve();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const objetivo = clamp(y, 0, Math.max(0, max));
  const actual = _lenis ? _lenis.scroll : window.scrollY;
  const dist = Math.abs(objetivo - actual);

  return new Promise<void>((resolve) => {
    const fin = () => {
      estado.scroll.saltando = false;
      if (opts.foco) enfocar(destino);
      resolve();
    };
    estado.scroll.saltando = true;
    if (opts.inmediato && teletransporte) {
      // Primero el scroll, después el teletransporte (con la nueva p ya medida en el siguiente frame).
      queueMicrotask(() => { try { teletransporte?.(); } catch (err) { console.error(err); } });
    }
    if (_lenis) {
      _lenis.scrollTo(objetivo, {
        force: true,
        immediate: Boolean(opts.inmediato),
        duration: opts.duracion ?? clamp(dist / 2500, 1.1, 2.4),
        easing: easeCalzo,
        lock: false,
        onComplete: () => {
          if (opts.inmediato) {
            frameManual();
            teletransporte?.();
          }
          fin();
        },
      });
      if (opts.inmediato) {
        // Lenis inmediato completa en síncrono en algunas versiones; asegura el cierre.
        setTimeout(() => { if (estado.scroll.saltando) fin(); }, 50);
      }
    } else {
      window.scrollTo({ top: objetivo, behavior: 'instant' as ScrollBehavior });
      requestAnimationFrame(() => {
        if (opts.inmediato) { frameManual(); teletransporte?.(); }
        fin();
      });
    }
  });
}

export function pausarTodo(): void {
  gsap.ticker.sleep();
  _lenis?.stop();
  estado.qa.pausado = true;
  document.documentElement.classList.add('qa-pausa');
}

export function reanudarTodo(): void {
  document.documentElement.classList.remove('qa-pausa');
  estado.qa.pausado = false;
  _lenis?.start();
  gsap.ticker.wake();
}

/** Tiempo del ticker del último frame (s), para módulos que miden por tiempo. */
export function ahora(): number {
  return tUlt >= 0 ? tUlt : performance.now() / 1000;
}
