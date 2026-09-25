// Escena WebGL (§4.7, §5.4, §5.6.3, §7.7): renderer, bucle bajo demanda
// colgado del ticker único, presupuesto de píxeles, calidad adaptativa sin
// recompilar, visibilidad del canvas y la implementación de EscenaAPI.
// Todo este módulo vive en el chunk 3D (import() desde escena-loader.ts).
import * as THREE from 'three';
// FUENTE_MOTO (§4.11): cambiar de moto es esta línea. Maqueta de cajas:
//   import { crearMotoMaqueta as FUENTE_MOTO } from './maqueta.ts';
import { crearMoto as FUENTE_MOTO } from './moto/crearMoto.ts';
import type { Tier, PresetId, UniformsCompartidos, AnclaPlataformaId } from './contrato-tipos.ts';
import type { Cincha2D, Punto } from '../lib/estado.ts';
import { estado, on } from '../lib/estado.ts';
import { onFrame, ahora } from '../lib/motion.ts';
import type { Paso } from '../lib/escena-loader.ts';
import { crearEntorno } from './entorno.ts';
import { texturaGPU } from './gpu-textura.ts';
import { crearSuelo } from './suelo.ts';
import { crearMaterialesAmarre, crearPlataforma } from './amarre/plataforma.ts';
import { crearCalzo } from './amarre/calzo.ts';
import { crearCincha, FRAG_TEJIDO } from './amarre/cinchas.ts';
import { crearCarraca } from './amarre/carraca.ts';
import { crearDirector, opacidadCanvas, INTENSIDAD, type Amarre, type Luces, type Cuatro } from './director.ts';
import { crearCapturador, rtComoCanvas } from './captura.ts';
import { esquinaDe, ordenarLados } from '../guion/traspaso.ts';

export interface EscenaAPI {
  tier: Tier;
  renderUnaVez(): void;
  pausar(): void; reanudar(): void;
  cinchasCenitales(w: number, h: number): [Cincha2D, Cincha2D, Cincha2D, Cincha2D];
  capturar(preset: PresetId, o: { w: number; h: number;
    sello?: { serie: 'CARGA'; letra: 'A' | 'B' | 'C' | 'D'; fecha: Date } }): Promise<string>;
  info(): { drawCalls: number; triangulos: number; programas: number; px: number; dpr: number; tier: Tier;
    fpsMediana: number; amarre: { T: [number, number, number, number]; reveal: [number, number, number, number] } };
  pixel(x: number, y: number): Promise<[number, number, number]>;
  destruir(): void;
}

/** Lo que el loader necesita además de la API pública. */
export interface ControlEscena {
  api: EscenaAPI;
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  benchmark(): Promise<{ mediana: number; gpu: boolean; estable30: boolean } | null>;
  bajarAMedio(): Promise<void>;
  activar(): void;
  fundirEntrada(ms: number): void;
  iniciarIntro(): void;
  teletransportar(): void;
  publicarCinchas(): void;
}

export class SinWebGL extends Error {
  constructor(m: string) { super(m); this.name = 'SinWebGL'; }
}

const CINCHAS: Cuatro<[AnclaPlataformaId, 'anc_cincha_tija_I' | 'anc_cincha_tija_D' | 'anc_cincha_tras_I' | 'anc_cincha_tras_D']> = [
  ['anc_anilla_del_I', 'anc_cincha_tija_I'],
  ['anc_anilla_del_D', 'anc_cincha_tija_D'],
  ['anc_anilla_tras_I', 'anc_cincha_tras_I'],
  ['anc_anilla_tras_D', 'anc_cincha_tras_D'],
];

const mediana = (xs: number[]): number => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const cede = () => new Promise<void>((r) => setTimeout(r, 0));

export async function crearEscena(o: { contenedor: HTMLElement; tier: Tier; progreso?: (paso: Paso, f: number) => void }): Promise<ControlEscena> {
  let tier: Tier = o.tier;
  const prog = o.progreso ?? (() => { /* sin progreso */ });

  // — renderer (§4.7). WebGL2 se prueba aquí, con el renderer real —
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.display = 'block';
  canvas.style.visibility = 'hidden';
  canvas.style.opacity = '0';
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (err) {
    throw new SinWebGL(err instanceof Error ? err.message : String(err));
  }
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.setClearColor('#0B0D0E', 1);
  renderer.shadowMap.enabled = tier === 'alto';
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  o.contenedor.appendChild(canvas);

  const altoCanvas = () => o.contenedor.clientHeight || window.innerHeight;
  let W = window.innerWidth, HC = altoCanvas(), hVisible = window.innerHeight;
  let base = tier === 'alto' ? { px: 2.3e6, dpr: 1.75 } : { px: 1.2e6, dpr: 1.5 };
  let presupuesto = base.px;
  const dprPara = () => Math.min(window.devicePixelRatio || 1, base.dpr, Math.sqrt(presupuesto / (W * HC)));
  renderer.setPixelRatio(dprPara());
  renderer.setSize(W, HC, false);

  // — texturas GPU, entorno y materiales del amarre —
  prog('texturas', 0);
  const U: UniformsCompartidos = {
    uBarridoX: { value: -1.45 }, uBarridoAncho: { value: 0.18 }, uBarridoI: { value: 0 },
    uColorContra: { value: new THREE.Color('#CDD2D5') }, uFoco: { value: -1 }, uAtenuacion: { value: 1 },
  };
  const escena = new THREE.Scene();
  escena.environment = crearEntorno(renderer, tier);
  escena.environmentIntensity = 0.15;
  const mats = crearMaterialesAmarre(renderer, tier, U);
  const tejido = texturaGPU(renderer, { frag: FRAG_TEJIDO, size: 128, espacio: 'lineal' });
  const suelo = crearSuelo(renderer, tier, U);
  prog('texturas', 1);
  await cede();

  // — moto (troceada por su constructor) —
  const rig = await FUENTE_MOTO({ tier, U, renderer, progreso: (f) => prog('moto', f) });
  rig.setApoyo(0);
  prog('moto', 1);

  // — cámara y luces (fijas desde la carga, §4.7) —
  const camara = new THREE.PerspectiveCamera(24, W / HC, 0.1, 60);
  escena.add(camara);
  const clave = new THREE.SpotLight('#EFEEEA', INTENSIDAD.clave, 0, 0.45, 0.9, 2);
  clave.position.set(2.6, 3.2, 2.4);
  escena.add(clave, clave.target);
  if (tier === 'alto') {
    clave.castShadow = true;
    clave.shadow.mapSize.set(1024, 1024);
    clave.shadow.radius = 3;
    clave.shadow.normalBias = 0.02;
    clave.shadow.bias = -0.0002;
    clave.shadow.camera.near = 2;
    clave.shadow.camera.far = 8;
  }
  const contraA = new THREE.DirectionalLight('#CDD2D5', INTENSIDAD.contraA);
  contraA.position.set(-2.2, 1.6, -1.8);
  contraA.target.position.set(0, 0.6, 0);
  const contraB = new THREE.DirectionalLight('#CDD2D5', INTENSIDAD.contraB);
  contraB.position.set(-1.0, 2.4, 2.2);
  escena.add(contraA, contraA.target, contraB, contraB.target);
  // Flash colgado de la cámara: intensidad 0 salvo en los presets parte.* (mismo nº de luces siempre).
  const flash = new THREE.PointLight('#F1F1EE', 0, 0, 2);
  camara.add(flash);
  const luces: Luces = { clave, contraA, contraB, flash };

  // — plataforma, suelo, calzo, cinchas y carracas —
  const plataforma = crearPlataforma(mats);
  plataforma.grupo.add(suelo.sombra);
  escena.add(suelo.suelo, plataforma.grupo, rig.root);
  const calzo = crearCalzo(mats);
  escena.add(calzo.grupo);
  escena.updateMatrixWorld(true);
  const cinchas = CINCHAS.map(([a, b]) => crearCincha(plataforma.anillas[a], rig.anclas[b], { segmentos: 48, tejido, U })) as Amarre['cinchas'];
  const carracas = CINCHAS.map(() => crearCarraca(mats)) as Amarre['carracas'];
  for (let i = 0; i < 4; i++) escena.add(cinchas[i].malla, carracas[i].grupo);
  const amarreObj: Amarre = { plataforma, calzo: calzo.grupo, cinchas, carracas };

  const director = crearDirector({ escena, camara, rig, amarre: amarreObj, luces, U, renderer, altoCanvas, estado });

  // — precompilación de todos los programas (§4.5): todo visible un momento —
  prog('shaders', 0);
  async function compilarTodo(): Promise<void> {
    const ocultos: THREE.Object3D[] = [];
    escena.traverse((ob) => { if (!ob.visible) { ocultos.push(ob); ob.visible = true; } });
    try {
      // Sin KHR_parallel_shader_compile, compileAsync compila igual en síncrono y avisa por consola.
      if (renderer.extensions.has('KHR_parallel_shader_compile')) await renderer.compileAsync(escena, camara);
      else { renderer.compile(escena, camara); await cede(); }
    } finally { for (const ob of ocultos) ob.visible = false; }
  }
  await compilarTodo();
  prog('shaders', 1);

  // — primer fotograma (también compila la pasada de sombras) —
  {
    const restaurar = director.aplicarPreset('quieto.pieza');
    renderer.shadowMap.needsUpdate = true;
    renderer.render(escena, camara);
    restaurar();
  }

  // — uVisible (§4.4): una vez tras construir, en am.cenital con la cámara objetivo exacta —
  const tmpCam = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const uVis = new Map<boolean, number[]>();
  function colocarTmp(c: { pos: THREE.Vector3; quat: THREE.Quaternion; fov: number; offset: [number, number] }, w: number, hc: number): void {
    tmpCam.position.copy(c.pos);
    tmpCam.quaternion.copy(c.quat);
    tmpCam.fov = c.fov;
    tmpCam.aspect = w / hc;
    tmpCam.setViewOffset(w, hc, c.offset[0], c.offset[1], w, hc);
    tmpCam.updateProjectionMatrix();
    tmpCam.updateMatrixWorld(true);
  }
  function uVisibles(compacto: boolean): number[] {
    let r = uVis.get(compacto);
    if (r) return r;
    r = director.conEstadoCenital(() => {
      const h = estado.vp.h || window.innerHeight;
      colocarTmp(director.resolver('am.cenital', W, h, Math.max(h, HC), compacto), W, Math.max(h, HC));
      return cinchas.map((c) => c.uVisible(tmpCam, rig.root));
    });
    uVis.set(compacto, r);
    return r;
  }
  uVisibles(estado.modo.compacto);

  // — estado del bucle —
  let activo = false;
  let pausada = false;
  let perdido = false;
  let visible = false;
  let sucio = true;
  let forzarRender = true;
  let opEscrita = -1;
  let fundido = { t0: 0, dur: 0 };
  let ultInfo = { calls: 0, tri: 0 };
  let yUlt = NaN, tScroll = performance.now();
  const intervalos: number[] = [];
  let tRenderPrev = 0;
  const ventana: number[] = [];
  let escalon = 0, enfriamiento = 0, buenas = 0;
  const quitar: Array<() => void> = [];

  function render(): void {
    if (perdido) return;
    renderer.render(escena, camara);
    ultInfo = { calls: renderer.info.render.calls, tri: renderer.info.render.triangles };
  }

  function ajustarTamano(inmediato: boolean): void {
    renderer.setPixelRatio(dprPara());
    renderer.setSize(W, HC, false);
    director.forzar();
    forzarRender = true;
    if (inmediato && visible && !perdido) {
      // setSize vacía el búfer: se vuelve a pintar en el mismo frame.
      director.actualizar(estado, ahora(), 0);
      render();
    }
  }

  function aplicarEscalon(): void {
    presupuesto = escalon === 0 ? base.px : escalon >= 3 ? 0.8e6 : Math.max(0.8e6, base.px * 0.75);
    director.congelarSombras(escalon >= 2);
    ajustarTamano(true);
  }

  // Calidad adaptativa (§7.7): solo escalones que no cambian ningún programa.
  function calidad(renderizado: boolean, ms: number): void {
    if (!renderizado) { tRenderPrev = 0; return; }
    if (tRenderPrev) {
      const d = ms - tRenderPrev;
      ventana.push(d);
      intervalos.push(d);
      if (intervalos.length > 60) intervalos.shift();
    }
    tRenderPrev = ms;
    if (ventana.length < 60) return;
    const media = ventana.reduce((s, x) => s + x, 0) / ventana.length;
    ventana.length = 0;
    if (enfriamiento > 0) { enfriamiento--; return; }
    if (media > 20 && escalon < 3) { escalon++; buenas = 0; enfriamiento = 3; aplicarEscalon(); }
    else if (media < 13) {
      if (++buenas >= 5 && escalon > 0) { escalon--; buenas = 0; enfriamiento = 3; aplicarEscalon(); }
    } else buenas = 0;
  }

  function frameDirector(t: number, dt: number): void {
    if (!activo || perdido || pausada) return;
    // Con la ruta SVG o en movimiento reducido el canvas no se ve: el director
    // no trabaja (al volver a mostrarse, frameEscena teletransporta y aplica).
    if (estado.fuente !== 'webgl' || estado.modo.reducido) return;
    if (director.actualizar(estado, t, dt)) sucio = true;
  }

  function frameEscena(t: number, dt: number): void {
    void dt;
    if (!activo || perdido || pausada) return;
    const ms = performance.now();
    if (estado.scroll.y !== yUlt) { yUlt = estado.scroll.y; tScroll = ms; }
    const op = estado.fuente === 'webgl' && !estado.modo.reducido && !document.hidden ? opacidadCanvas(estado) : 0;
    let renderizado = false;
    if (op > 0 && !visible) {
      // Antes de pasar de oculto a visible: estado del capítulo que entra y render en este frame.
      director.teletransportar();
      director.actualizar(estado, t, 0);
      render();
      renderizado = true;
      visible = true;
      canvas.style.visibility = 'visible';
    } else if (op > 0 && (sucio || forzarRender)) {
      render();
      renderizado = true;
    } else if (op <= 0 && visible) {
      visible = false;
      canvas.style.visibility = 'hidden';
    }
    let f = 1;
    if (fundido.dur > 0) {
      f = Math.min(1, (ms - fundido.t0) / fundido.dur);
      if (f >= 1) fundido = { t0: 0, dur: 0 };
    }
    const opFinal = visible ? Math.round(op * f * 1000) / 1000 : 0;
    if (opFinal !== opEscrita) { canvas.style.opacity = String(opFinal); opEscrita = opFinal; }
    estado.escena.visible = visible;
    estado.escena.opacidad = visible ? op : 0;
    sucio = false;
    forzarRender = false;

    // Capturas: como mucho una por frame, con el canvas parado o el scroll quieto ≥ 300 ms.
    if (capturador.pendientes() > 0 && (!visible || ms - tScroll >= 300)) capturador.procesar();

    calidad(renderizado, ms);
  }

  const capturador = crearCapturador({
    renderer, escena, camara,
    aplicarPreset: (p, w, h) => director.aplicarPreset(p, w, h),
    antesDeRender: () => { if (renderer.shadowMap.enabled && !director.sombrasCongeladas()) renderer.shadowMap.needsUpdate = true; },
  });

  function cinchasCenitales(w: number, h: number): [Cincha2D, Cincha2D, Cincha2D, Cincha2D] {
    const compacto = estado.modo.compacto;
    const hc = w === W ? Math.max(h, HC) : h;
    const us = uVisibles(compacto);
    return director.conEstadoCenital(() => {
      colocarTmp(director.resolver('am.cenital', w, h, hc, compacto), w, hc);
      const proj = (v: THREE.Vector3): Punto => {
        const q = v.clone().project(tmpCam);
        return [(q.x + 1) / 2 * w, (1 - q.y) / 2 * hc];
      };
      const centro = proj(new THREE.Vector3(0, 0.35 + 0.006, 0));
      return cinchas.map((c, i) => {
        const [A, B] = c.extremos();
        const a = proj(A);
        const b = proj(A.clone().lerp(B, us[i]));
        const [a0, a1] = c.bordes(0);
        const [b0, b1] = c.bordes(us[i]);
        return {
          esquina: esquinaDe(a, centro),
          a, b,
          ladoA: ordenarLados(proj(a0), proj(a1), a, b),
          ladoB: ordenarLados(proj(b0), proj(b1), a, b),
        };
      }) as [Cincha2D, Cincha2D, Cincha2D, Cincha2D];
    });
  }

  function publicarCinchas(): void {
    if (estado.fuente !== 'webgl' || perdido) return;
    try {
      estado.cinchas2D = cinchasCenitales(estado.vp.w || window.innerWidth, estado.vp.h || window.innerHeight);
    } catch (err) { console.error('[calzo] cinchas2D', err); }
  }

  function alRedimensionar(): void {
    const w = window.innerWidth, h = window.innerHeight, hc = altoCanvas();
    // En táctil, un cambio solo de alto < 150 px es la barra de URL: sin setSize,
    // solo encuadre y viewOffset con el nuevo innerHeight (§7.2).
    if (estado.modo.tactil && w === W && Math.abs(h - hVisible) < 150) {
      hVisible = h;
      director.forzar();
      forzarRender = true;
      publicarCinchas();
      return;
    }
    W = w; HC = hc; hVisible = h;
    uVis.clear();
    ajustarTamano(true);
    publicarCinchas();
  }

  function alPerderContexto(): void { perdido = true; visible = false; canvas.style.visibility = 'hidden'; }
  canvas.addEventListener('webglcontextlost', alPerderContexto);

  let destruida = false;
  function destruir(): void {
    if (destruida) return;
    destruida = true;
    activo = false;
    for (const q of quitar) q();
    quitar.length = 0;
    canvas.removeEventListener('webglcontextlost', alPerderContexto);
    capturador.dispose();
    if (perdido) {
      // Los objetos GL pertenecían al contexto perdido: borrarlos solo produce
      // avisos de WebGL. Se sueltan y los recoge el GC.
      canvas.remove();
      return;
    }
    for (const c of cinchas) c.dispose();
    calzo.dispose();
    plataforma.dispose();
    suelo.dispose();
    mats.dispose();
    tejido.dispose();
    rig.dispose();
    renderer.dispose();
    canvas.remove();
  }

  const api: EscenaAPI = {
    get tier() { return tier; },
    renderUnaVez() {
      if (perdido) return;
      director.forzar();
      director.actualizar(estado, ahora(), 0);
      render();
    },
    pausar() { pausada = true; },
    reanudar() { pausada = false; forzarRender = true; director.forzar(); },
    cinchasCenitales,
    capturar: (preset, op) => capturador.capturar(preset, op),
    info() {
      const E = director.estadoActual();
      return {
        drawCalls: ultInfo.calls, triangulos: ultInfo.tri,
        programas: renderer.info.programs?.length ?? 0,
        px: canvas.width * canvas.height, dpr: renderer.getPixelRatio(), tier,
        fpsMediana: intervalos.length ? Math.round(1000 / mediana(intervalos)) : 0,
        amarre: {
          T: E.cinchas.map((c) => c.T) as [number, number, number, number],
          reveal: E.cinchas.map((c) => c.reveal) as [number, number, number, number],
        },
      };
    },
    async pixel(x, y) {
      const bw = canvas.width, bh = canvas.height, dpr = renderer.getPixelRatio();
      const rt = rtComoCanvas(bw, bh);
      // pixel() es la referencia 3D del overlay: si el traspaso ya ha relevado
      // las cinchas 3D al SVG (p ≥ 0,905), se pintan igualmente para comparar.
      const E = director.estadoActual();
      const forzadas: number[] = [];
      if (!E.cinchas3D) {
        for (let i = 0; i < 4; i++) {
          if (E.cinchas[i].reveal <= 0.001) continue;
          cinchas[i].setLazo(E.lazo[i]);
          cinchas[i].set(E.cinchas[i].reveal, E.cinchas[i].T, E.sinLuz);
          cinchas[i].malla.visible = true;
          forzadas.push(i);
        }
      }
      try {
        renderer.setRenderTarget(rt);
        renderer.render(escena, camara);
      } finally {
        renderer.setRenderTarget(null);
        for (const i of forzadas) cinchas[i].malla.visible = false;
      }
      const buf = new Uint8Array(4);
      const px = Math.min(bw - 1, Math.max(0, Math.floor(x * dpr)));
      const py = Math.min(bh - 1, Math.max(0, bh - 1 - Math.floor(y * dpr)));
      try { await renderer.readRenderTargetPixelsAsync(rt, px, py, 1, 1, buf); } finally { rt.dispose(); }
      return [buf[0], buf[1], buf[2]];
    },
    destruir,
  };

  return {
    api, canvas, renderer,
    async benchmark() {
      // 20 frames de pieza.b al tamaño real con la clave a 0 (§7.1). Nunca con la pestaña oculta.
      if (document.hidden) return null;
      const restaurar = director.aplicarPreset('quieto.pieza');
      clave.intensity = 0;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as { TIME_ELAPSED_EXT: number; GPU_DISJOINT_EXT: number } | null;
      const consultas: WebGLQuery[] = [];
      const tiempos: number[] = [];
      await new Promise<void>((fin) => {
        let n = 0, prev = 0;
        const limite = setTimeout(() => { quitarB(); fin(); }, 4000);
        const quitarB = onFrame(() => {
          if (ext) {
            const q = gl.createQuery();
            if (q) { gl.beginQuery(ext.TIME_ELAPSED_EXT, q); renderer.render(escena, camara); gl.endQuery(ext.TIME_ELAPSED_EXT); consultas.push(q); }
          } else {
            renderer.render(escena, camara);
            const a = performance.now();
            if (prev) tiempos.push(a - prev);
            prev = a;
          }
          if (++n >= 21) { clearTimeout(limite); quitarB(); fin(); }
        }, 31);
      });
      if (ext && consultas.length) {
        const t0 = performance.now();
        while (performance.now() - t0 < 1000) {
          const listas = consultas.every((q) => gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE));
          if (listas) break;
          await new Promise((r) => setTimeout(r, 16));
        }
        const disjunto = gl.getParameter(ext.GPU_DISJOINT_EXT);
        for (const q of consultas) {
          if (!disjunto && gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) tiempos.push(gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6);
          gl.deleteQuery(q);
        }
      }
      restaurar();
      if (!tiempos.length) return null;
      const med = mediana(tiempos);
      const media = tiempos.reduce((s, x) => s + x, 0) / tiempos.length;
      const sd = Math.sqrt(tiempos.reduce((s, x) => s + (x - media) ** 2, 0) / tiempos.length);
      return { mediana: med, gpu: Boolean(ext && consultas.length), estable30: !ext && Math.abs(med - 33.3) <= 1.5 && sd < 2 };
    },
    async bajarAMedio() {
      // Todavía en carga: quitar sombras recompila, pero se conservan geometría y PMREM.
      tier = 'medio';
      renderer.shadowMap.enabled = false;
      clave.castShadow = false;
      escena.traverse((ob) => {
        const m = (ob as THREE.Mesh).material;
        if (m) for (const x of Array.isArray(m) ? m : [m]) x.needsUpdate = true;
      });
      base = { px: 1.2e6, dpr: 1.5 };
      presupuesto = base.px;
      ajustarTamano(false);
      await compilarTodo();
    },
    activar() {
      if (activo) return;
      activo = true;
      quitar.push(onFrame(frameDirector, 20), onFrame(frameEscena, 30));
      quitar.push(on('medidas', () => { publicarCinchas(); director.forzar(); }));
      quitar.push(on('fuente', () => publicarCinchas()));
      window.addEventListener('resize', alRedimensionar);
      quitar.push(() => window.removeEventListener('resize', alRedimensionar));
      publicarCinchas();
    },
    fundirEntrada(ms) { fundido = { t0: performance.now(), dur: ms }; },
    iniciarIntro() { director.iniciarIntro(); },
    teletransportar() { director.teletransportar(); },
    publicarCinchas,
  };
}
