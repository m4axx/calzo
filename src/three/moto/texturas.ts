// Texturas procedurales de la moto, todas en GPU con texturaGPU() (§7.7):
// un render de un shader a un RenderTarget cada una, sin canvas 2D ni
// lectura a CPU. Son cuatro de las ocho del presupuesto (§7.6): rugosidad,
// piel de naranja, dibujo del neumático y moleteado.
import * as THREE from 'three';
import { texturaGPU } from '../gpu-textura.ts';
import type { Tier } from '../contrato-tipos.ts';

// Ruido de valor periódico: con frecuencias enteras la textura enlaza sin costura.
const RUIDO = /* glsl */`
varying vec2 vUv;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vruido(vec2 p, vec2 per) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(mod(i, per)), b = hash(mod(i + vec2(1.0, 0.0), per));
  float c = hash(mod(i + vec2(0.0, 1.0), per)), d = hash(mod(i + vec2(1.0, 1.0), per));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 uv, float f0) {
  float s = 0.0, a = 0.5, f = f0;
  for (int k = 0; k < 5; k++) { s += a * vruido(uv * f, vec2(f)); f *= 2.0; a *= 0.5; }
  return s;
}
`;

// Normal a partir de un campo de alturas h(uv) por diferencias centrales.
const NORMAL = (alto: string, texel: string, fuerza: number): string => /* glsl */`
void main() {
  vec2 e = ${texel};
  float hx = ${alto.replace('UV', '(vUv + vec2(e.x, 0.0))')} - ${alto.replace('UV', '(vUv - vec2(e.x, 0.0))')};
  float hy = ${alto.replace('UV', '(vUv + vec2(0.0, e.y))')} - ${alto.replace('UV', '(vUv - vec2(0.0, e.y))')};
  vec3 n = normalize(vec3(-hx * ${fuerza.toFixed(3)}, -hy * ${fuerza.toFixed(3)}, 1.0));
  gl_FragColor = vec4(n * 0.5 + 0.5, 1.0);
}`;

export interface TexturasMoto {
  rugosidad: THREE.Texture;
  pielNaranja: THREE.Texture;
  dibujo: THREE.Texture;
  moleteado: THREE.Texture;
  dispose(): void;
}

/** Crea las cuatro texturas; `ceder` se llama entre una y otra para trocear la carga. */
export async function crearTexturas(renderer: THREE.WebGLRenderer, tier: Tier, ceder: () => Promise<void> = async () => {}): Promise<TexturasMoto> {
  const alto = tier === 'alto';

  // Rugosidad compartida (§4.5): variación suave de ±6 % alrededor de 0,94 que
  // rompe la perfección de CG. Los materiales dividen su roughness por 0,94.
  const rugosidad = texturaGPU(renderer, {
    size: 256, espacio: 'lineal',
    frag: RUIDO + /* glsl */`
void main() {
  float n = fbm(vUv, 6.0) * 0.7 + fbm(vUv + 0.37, 24.0) * 0.3;
  gl_FragColor = vec4(vec3(0.88 + 0.12 * n), 1.0);
}`,
  });

  await ceder();

  // Piel de naranja del barniz: ruido fino, se aplica con normalScale 0,04.
  const pielNaranja = texturaGPU(renderer, {
    size: 256, espacio: 'lineal',
    frag: RUIDO + /* glsl */`
float h(vec2 p) { return vruido(p * 64.0, vec2(64.0)) * 0.7 + vruido(p * 128.0, vec2(128.0)) * 0.3; }
` + NORMAL('h(UV)', 'vec2(1.0 / 256.0)', 1.2),
  });

  await ceder();

  // Dibujo del neumático (1024×256): u alrededor de la rueda, v a lo largo del
  // perfil (por longitud de arco). Banda de rodadura en v 0,3..0,7 con surcos
  // en espiga, 42 repeticiones por vuelta, y el flanco con estrías finas.
  const dibujo = texturaGPU(renderer, {
    size: alto ? [1024, 256] : [512, 128], espacio: 'lineal',
    frag: RUIDO + /* glsl */`
float h(vec2 p) {
  float v = p.y - 0.5;
  float av = abs(v);
  float banda = 1.0 - smoothstep(0.17, 0.19, av);
  // Espiga: surcos inclinados que se abren hacia el hombro.
  float g = fract(p.x * 42.0 + sign(v) * av * 2.2);
  float surco = smoothstep(0.0, 0.03, g) * (1.0 - smoothstep(0.13, 0.16, g));
  surco *= smoothstep(0.035, 0.05, av) * (1.0 - smoothstep(0.15, 0.17, av));
  // Surco central continuo.
  float central = 1.0 - smoothstep(0.006, 0.012, av);
  float r = 1.0 - max(surco, central) * banda;
  // Flanco: estrías concéntricas muy suaves.
  float flanco = (1.0 - banda) * 0.08 * sin(av * 520.0);
  return r * 0.6 + flanco;
}
` + NORMAL('h(UV)', alto ? 'vec2(1.0 / 1024.0, 1.0 / 256.0)' : 'vec2(1.0 / 512.0, 1.0 / 128.0)', 2.2),
  });

  await ceder();

  // Moleteado de puños y estriberas: rombos en diagonal.
  const moleteado = texturaGPU(renderer, {
    size: 256, espacio: 'lineal',
    frag: RUIDO + /* glsl */`
float h(vec2 p) {
  float a = abs(fract(p.x * 36.0 + p.y * 12.0) - 0.5);
  float b = abs(fract(p.x * 36.0 - p.y * 12.0) - 0.5);
  return smoothstep(0.05, 0.3, min(a, b));
}
` + NORMAL('h(UV)', 'vec2(1.0 / 256.0)', 1.4),
  });

  return {
    rugosidad, pielNaranja, dibujo, moleteado,
    dispose() { rugosidad.dispose(); pielNaranja.dispose(); dibujo.dispose(); moleteado.dispose(); },
  };
}
