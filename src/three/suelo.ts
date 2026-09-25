// Suelo de la sala, junta del elevador y sombra de contacto (§4.4, §4.7).
// «Un objeto apoyado no es un juguete; uno que flota, sí.»
import * as THREE from 'three';
import type { Tier, UniformsCompartidos } from './contrato-tipos.ts';
import { inyectarAtenuacion } from './amarre/plataforma.ts';
import { texturaGPU } from './gpu-textura.ts';

/** Hueco de la junta: 12 mm mayor que la plataforma (2,60 × 0,90) por cada lado. */
export const JUNTA = { x: 1.312, z: 0.462 } as const;

// Alfa radial: el suelo se funde en el carbón antes de su borde (r = 8 m ↔ d = 1).
const FRAG_ALFA = /* glsl */`
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = 1.0 - smoothstep(0.06, 0.5, d);
  gl_FragColor = vec4(vec3(a * a), 1.0);
}`;

// Sombra de contacto (multiplicativa): elipse difusa de 2,0 × 0,5 m y dos
// manchas densas en los contactos (x = ±0,725). El plano mide 2,4 × 0,8 m.
const FRAG_SOMBRA = /* glsl */`
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * vec2(2.4, 0.8);
  float el = exp(-2.2 * dot(p / vec2(1.0, 0.25), p / vec2(1.0, 0.25)));
  vec2 d1 = (p - vec2(0.725, 0.0)) / vec2(0.11, 0.05);
  vec2 d2 = (p - vec2(-0.725, 0.0)) / vec2(0.13, 0.06);
  float s = exp(-dot(d1, d1)) + exp(-dot(d2, d2));
  float k = clamp(0.5 * el + 0.55 * s, 0.0, 0.9);
  gl_FragColor = vec4(vec3(1.0 - k), 1.0);
}`;

export function crearSuelo(renderer: THREE.WebGLRenderer, tier: Tier, U?: UniformsCompartidos): { suelo: THREE.Mesh; sombra: THREE.Mesh; dispose(): void } {
  const lado = tier === 'alto' ? 1024 : 512;

  // Círculo de radio 8 con el hueco rectangular de la junta.
  const forma = new THREE.Shape();
  forma.absarc(0, 0, 8, 0, Math.PI * 2, false);
  const hueco = new THREE.Path();
  hueco.moveTo(-JUNTA.x, -JUNTA.z);
  hueco.lineTo(-JUNTA.x, JUNTA.z);
  hueco.lineTo(JUNTA.x, JUNTA.z);
  hueco.lineTo(JUNTA.x, -JUNTA.z);
  hueco.lineTo(-JUNTA.x, -JUNTA.z);
  forma.holes.push(hueco);
  const geo = new THREE.ShapeGeometry(forma, 48);
  // UV = posición/16 + 0,5 (antes de tumbarlo al plano XZ).
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / 16 + 0.5, pos.getY(i) / 16 + 0.5);
  geo.rotateX(-Math.PI / 2);

  const alfa = texturaGPU(renderer, { frag: FRAG_ALFA, size: lado / 2, espacio: 'lineal' });
  const mat = new THREE.MeshStandardMaterial({
    color: '#0B0D0E', roughness: 0.32, metalness: 0,
    alphaMap: alfa, transparent: true, dithering: true, depthWrite: false,
  });
  inyectarAtenuacion(mat, U, 'suelo');
  const suelo = new THREE.Mesh(geo, mat);
  suelo.name = 'suelo';
  suelo.receiveShadow = true;
  suelo.renderOrder = -1;

  const texSombra = texturaGPU(renderer, { frag: FRAG_SOMBRA, size: 512, espacio: 'lineal' });
  const matSombra = new THREE.MeshBasicMaterial({
    map: texSombra, transparent: true, blending: THREE.MultiplyBlending, premultipliedAlpha: true,
    depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  });
  const geoSombra = new THREE.PlaneGeometry(2.4, 0.8);
  geoSombra.rotateX(-Math.PI / 2);
  const sombra = new THREE.Mesh(geoSombra, matSombra);
  sombra.name = 'sombra-contacto';
  // Vive en el grupo de la plataforma: yApoyo + 1 mm.
  sombra.position.y = 0.001;
  sombra.renderOrder = 1;

  return {
    suelo, sombra,
    dispose() {
      geo.dispose(); mat.dispose(); alfa.dispose();
      geoSombra.dispose(); matSombra.dispose(); texSombra.dispose();
    },
  };
}
