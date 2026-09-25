// Carga de la escena (§2.1, §5.4, §5.6.4, §7.1). Va en el bundle inicial y no
// importa three: todo lo 3D llega en un chunk dinámico (import()). Es el ÚNICO
// escritor de estado.fuente.
import { estado, emit, type Fuente } from './estado.ts';
import { onFrame, registrarTeletransporte } from './motion.ts';
import type { EscenaAPI, ControlEscena } from '../three/escena.ts';
import type { Tier } from '../three/contrato-tipos.ts';

export type Paso = 'fuentes' | 'three' | 'moto' | 'texturas' | 'shaders' | 'benchmark';

/** Pesos del progreso de carga (§2.1). */
const PESOS: Readonly<Record<Paso, number>> = { fuentes: 15, three: 30, moto: 25, texturas: 10, shaders: 15, benchmark: 5 };
const TIERS: readonly Tier[] = ['alto', 'medio', 'bajo', 'sin-webgl'];
/** Capítulos en los que el cambio tardío svg → webgl no se nota (§5.6.4). */
const FRONTERA: ReadonlySet<string> = new Set(['precio', 'cargas', 'parte', 'seguro', 'rutas']);

type ModuloEscena = typeof import('../three/escena.ts');

let ctrl: ControlEscena | null = null;
let modulo: ModuloEscena | null = null;
let contenedorEscena: HTMLElement | null = null;
let listoEmitido = false;
let tierEmitido = false;
let quitarFrontera: (() => void) | null = null;

export function escena(): EscenaAPI | null {
  return ctrl ? ctrl.api : null;
}

function fijarFuente(f: Fuente): void {
  if (estado.fuente === f) return;
  const anterior = estado.fuente;
  estado.fuente = f;
  const cl = document.documentElement.classList;
  cl.toggle('fuente-webgl', f === 'webgl');
  cl.toggle('fuente-svg', f === 'svg');
  emit('fuente', { fuente: f, anterior });
}

function emitirListo(f: 'webgl' | 'svg'): void {
  if (listoEmitido) return;
  listoEmitido = true;
  emit('listo', { fuente: f });
}

/** Entra con la ruta SVG (sin tocar la carga, que puede seguir en segundo plano). */
function entrarSvg(): void {
  if (estado.fuente !== 'webgl') fijarFuente('svg');
  emitirListo('svg');
}

function fijarTier(t: Tier): void {
  estado.modo.tier = t;
  const cl = document.documentElement.classList;
  for (const x of TIERS) cl.toggle(`tier-${x}`, x === t);
  tierEmitido = true;
  emit('tier', { tier: t });
}

function fallo(motivo: string): void {
  estado.escena.fallo = true;
  emit('escena:fallo', { motivo });
}

/** Frontera segura: nunca durante el traspaso (amarre p ≥ 0,90 o precio e < 1). */
function enFronteraSegura(): boolean {
  const a = estado.activo;
  if (a === 'pieza') return estado.cap.pieza.p < 0.02 && estado.cap.amarre.e <= 0;
  if (!FRONTERA.has(a)) return false;
  if (a === 'precio' && estado.cap.precio.e < 1) return false;
  return true;
}

/** Cambio tardío svg → webgl con fundido cruzado de 400 ms, en la primera frontera segura. */
function esperarFrontera(): void {
  if (quitarFrontera) return;
  quitarFrontera = onFrame(() => {
    if (!ctrl || estado.fuente === 'webgl') { quitarFrontera?.(); quitarFrontera = null; return; }
    if (estado.modo.reducido || enFronteraSegura()) {
      quitarFrontera?.();
      quitarFrontera = null;
      ctrl.fundirEntrada(400);
      if (estado.activo === 'pieza') ctrl.iniciarIntro();
      fijarFuente('webgl');
    }
  }, 11);
}

function cortaAmarre(): boolean {
  return estado.cap.amarre.e > 0;
}

function engancharContexto(c: ControlEscena, tier: Tier): void {
  c.canvas.addEventListener('webglcontextlost', (ev) => {
    ev.preventDefault();   // permite webglcontextrestored
    // La ruta SVG es función de p: retoma en cualquier punto del capítulo.
    fijarFuente('svg');
    if (!listoEmitido) emitirListo('svg');
  });
  c.canvas.addEventListener('webglcontextrestored', () => {
    // Se reconstruye en tiempo ocioso con un renderer nuevo y se vuelve a
    // 'webgl' en la siguiente frontera segura.
    const ocioso = (window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback
      ?? ((f: () => void) => window.setTimeout(f, 50));
    ocioso(() => { void reconstruir(c, tier); }, { timeout: 2000 });
  });
}

async function reconstruir(viejo: ControlEscena, tier: Tier): Promise<void> {
  if (!modulo || !contenedorEscena) return;
  if (ctrl === viejo) ctrl = null;
  try { viejo.api.destruir(); } catch (err) { console.error('[calzo] destruir escena', err); }
  try {
    const nuevo = await modulo.crearEscena({ contenedor: contenedorEscena, tier });
    ctrl = nuevo;
    registrarTeletransporte(() => ctrl?.teletransportar());
    engancharContexto(nuevo, tier);
    nuevo.activar();
    esperarFrontera();
  } catch (err) {
    console.error('[calzo] reconstrucción de la escena', err);
  }
}

export async function cargarEscena(o: { contenedor: HTMLElement; progreso: (fraccion: number, paso: Paso) => void; limiteMs: number }): Promise<void> {
  contenedorEscena = o.contenedor;
  const q = new URLSearchParams(location.search);
  const tierForzado = q.has('tier');
  // QA (§5.8): con ?still o ?tier la captura debe ser del 3D, no de la ruta de
  // espera; en SwiftShader la carga tarda más que el límite de producción.
  const limite = q.has('still') || tierForzado ? Math.max(o.limiteMs, 20000) : o.limiteMs;
  let tier: Tier = estado.modo.tier;

  // Progreso ponderado y monótono.
  const hecho: Record<Paso, number> = { fuentes: 0, three: 0, moto: 0, texturas: 0, shaders: 0, benchmark: 0 };
  let ultimo = 0;
  const avanzar = (paso: Paso, f: number) => {
    hecho[paso] = Math.max(hecho[paso], Math.min(1, Math.max(0, f)));
    let s = 0;
    for (const k of Object.keys(PESOS) as Paso[]) s += PESOS[k] * hecho[k];
    const frac = Math.min(1, s / 100);
    if (frac > ultimo) { ultimo = frac; try { o.progreso(frac, paso); } catch (err) { console.error(err); } }
  };

  // Si el usuario entra en el amarre sin fuente, se fija 'svg' en ese frame (§5.6.4).
  const quitarVigia = onFrame(() => {
    if (estado.fuente === 'ninguna' && cortaAmarre()) entrarSvg();
    if (listoEmitido) quitarVigia();
  }, 11);

  if (tier === 'bajo' || tier === 'sin-webgl') {
    fijarTier(tier);
    for (const k of Object.keys(PESOS) as Paso[]) avanzar(k, 1);
    entrarSvg();
    fallo(`tier-${tier}`);
    return;
  }

  const temporizador = window.setTimeout(() => { if (!listoEmitido) entrarSvg(); }, limite);
  const alError = () => { if (!listoEmitido) entrarSvg(); };
  window.addEventListener('error', alError);
  window.addEventListener('unhandledrejection', alError);

  try {
    const fuentes = Promise.all([
      '400 1em "Big Shoulders Display Variable"', '400 1em "Newsreader Variable"', '400 1em "Overpass Mono Variable"',
    ].map((f) => document.fonts?.load(f).catch(() => []) ?? Promise.resolve([])))
      .then(() => avanzar('fuentes', 1));
    modulo = await import('../three/escena.ts');
    avanzar('three', 1);
    await fuentes;

    const c = await modulo.crearEscena({ contenedor: o.contenedor, tier, progreso: (paso, f) => avanzar(paso, f) });
    ctrl = c;
    engancharContexto(c, tier);

    // Benchmark (§7.1): solo antes de listo; después el tier ya no cambia.
    if (!tierForzado && !listoEmitido) {
      const b = await c.benchmark();
      if (b) {
        const lento = b.gpu ? b.mediana > (tier === 'alto' ? 9 : 14) : (!b.estable30 && b.mediana > 24);
        if (tier === 'alto' && (lento || b.estable30)) {
          await c.bajarAMedio();
          tier = 'medio';
        } else if (tier === 'medio' && lento) {
          tier = 'bajo';
        }
      }
    }
    avanzar('benchmark', 1);

    if (tier === 'bajo') {
      // Benchmark lento en medio: ruta SVG y fuera la escena.
      c.api.destruir();
      ctrl = null;
      fijarTier('bajo');
      entrarSvg();
      fallo('benchmark');
      return;
    }

    fijarTier(tier);
    registrarTeletransporte(() => ctrl?.teletransportar());
    c.activar();
    estado.escena.lista = true;
    if (!listoEmitido) {
      fijarFuente('webgl');
      c.iniciarIntro();
      emitirListo('webgl');
    } else if (estado.fuente !== 'webgl') {
      esperarFrontera();
    }
    emit('escena:lista', { tier });
  } catch (err) {
    const sinWebgl = err instanceof Error && err.name === 'SinWebGL';
    if (sinWebgl) tier = 'sin-webgl';
    else console.error('[calzo] carga de la escena', err);
    if (ctrl) { try { ctrl.api.destruir(); } catch { /* ya está rota */ } ctrl = null; }
    if (!tierEmitido) fijarTier(tier);
    entrarSvg();
    fallo(sinWebgl ? 'sin-webgl' : err instanceof Error ? err.message : String(err));
  } finally {
    window.clearTimeout(temporizador);
    window.removeEventListener('error', alError);
    window.removeEventListener('unhandledrejection', alError);
  }
}
