// Capturas fuera de pantalla (§5.4, §7.7): WebGLRenderTarget → lectura
// asíncrona → canvas 2D (volteo + sello) → JPEG → objectURL. En cola, como
// mucho una por frame, sin sincronizar el canvas visible.
import * as THREE from 'three';
import type { PresetId } from './contrato-tipos.ts';
import { estado, emit } from '../lib/estado.ts';

export interface Sello { serie: 'CARGA'; letra: 'A' | 'B' | 'C' | 'D'; fecha: Date }
interface Pedido { preset: PresetId; w: number; h: number; sello?: Sello; ok: (url: string) => void; ko: (e: unknown) => void }

/**
 * Render target que produce los mismos bytes que el canvas: con
 * isXRRenderTarget, three aplica el tone mapping y la conversión a sRGB del
 * propio renderer (mismos programas, ninguno nuevo) y el formato interno RGBA8
 * evita una segunda codificación sRGB al escribir.
 */
export function rtComoCanvas(w: number, h: number, muestras = 4): THREE.WebGLRenderTarget {
  const rt = new THREE.WebGLRenderTarget(w, h, {
    type: THREE.UnsignedByteType, format: THREE.RGBAFormat, colorSpace: THREE.SRGBColorSpace,
    samples: muestras, depthBuffer: true, generateMipmaps: false,
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
  });
  rt.texture.internalFormat = 'RGBA8';
  (rt as unknown as { isXRRenderTarget: boolean }).isXRRenderTarget = true;
  return rt;
}

const dosCifras = (n: number) => String(n).padStart(2, '0');

async function sellar(ctx: CanvasRenderingContext2D, h: number, s: Sello): Promise<void> {
  const tam = Math.max(10, Math.round(h * 0.036));
  const familia = `"Overpass Mono Variable", "OM Consolas", "OM Menlo", monospace`;
  try { await document.fonts.load(`500 ${tam}px "Overpass Mono Variable"`); } catch { /* respaldo */ }
  const f = s.fecha;
  const texto = `${s.serie} · ${dosCifras(f.getDate())}-${dosCifras(f.getMonth() + 1)} · ${dosCifras(f.getHours())}:${dosCifras(f.getMinutes())} · ${s.letra}`;
  ctx.font = `500 ${tam}px ${familia}`;
  ctx.textBaseline = 'alphabetic';
  const m = Math.round(tam * 0.9);
  ctx.fillStyle = 'rgba(228, 230, 227, 0.88)';   // --hueso
  ctx.fillText(texto, m, h - m);
}

export interface Capturador {
  capturar(preset: PresetId, o: { w: number; h: number; sello?: Sello }): Promise<string>;
  /** Procesa como mucho un pedido; devuelve true si ha renderizado. */
  procesar(): boolean;
  pendientes(): number;
  dispose(): void;
}

export function crearCapturador(o: {
  renderer: THREE.WebGLRenderer; escena: THREE.Scene; camara: THREE.PerspectiveCamera;
  aplicarPreset: (p: PresetId, w: number, h: number) => () => void;
  antesDeRender?: () => void;
}): Capturador {
  const promesas = new Map<PresetId, Promise<string>>();
  const cola: Pedido[] = [];

  async function terminar(rt: THREE.WebGLRenderTarget, p: Pedido): Promise<void> {
    const { w, h } = p;
    const buf = new Uint8Array(w * h * 4);
    try {
      await o.renderer.readRenderTargetPixelsAsync(rt, 0, 0, w, h, buf);
    } finally {
      rt.dispose();
    }
    const lienzo = document.createElement('canvas');
    lienzo.width = w; lienzo.height = h;
    const ctx = lienzo.getContext('2d');
    if (!ctx) throw new Error('[calzo] captura: sin contexto 2D');
    // WebGL lee de abajo arriba: se voltea fila a fila.
    const img = ctx.createImageData(w, h);
    const fila = w * 4;
    for (let y = 0; y < h; y++) img.data.set(buf.subarray((h - 1 - y) * fila, (h - y) * fila), y * fila);
    ctx.putImageData(img, 0, 0);
    if (p.sello) await sellar(ctx, h, p.sello);
    const blob = await new Promise<Blob | null>((r) => lienzo.toBlob(r, 'image/jpeg', 0.85));
    if (!blob) throw new Error('[calzo] captura: toBlob sin resultado');
    const url = URL.createObjectURL(blob);
    estado.capturas[p.preset] = url;
    emit('captura', { preset: p.preset, url });
    p.ok(url);
  }

  return {
    capturar(preset, op) {
      const ya = promesas.get(preset);
      if (ya) return ya;
      const w = Math.max(16, Math.round(op.w)), h = Math.max(16, Math.round(op.h));
      const pr = new Promise<string>((ok, ko) => { cola.push({ preset, w, h, sello: op.sello, ok, ko }); });
      promesas.set(preset, pr);
      return pr;
    },
    procesar() {
      const p = cola.shift();
      if (!p) return false;
      const r = o.renderer;
      let rt: THREE.WebGLRenderTarget | null = null;
      try {
        const restaurar = o.aplicarPreset(p.preset, p.w, p.h);
        rt = rtComoCanvas(p.w, p.h);
        o.antesDeRender?.();
        const previo = r.getRenderTarget();
        r.setRenderTarget(rt);
        r.render(o.escena, o.camara);
        r.setRenderTarget(previo);
        restaurar();
      } catch (err) {
        rt?.dispose();
        promesas.delete(p.preset);
        p.ko(err);
        return true;
      }
      const rtFinal = rt;
      terminar(rtFinal, p).catch((err) => { promesas.delete(p.preset); p.ko(err); });
      return true;
    },
    pendientes: () => cola.length,
    dispose() {
      cola.length = 0;
      // Los objectURL viven lo que vive el documento (§7.7): no se revocan aquí
      // porque las <img> del parte pueden seguir usándolos.
    },
  };
}
