// Materiales de la moto (§4.5) con la inyección de shader común (§4.6).
// Todas las capas físicas (clearcoat, sheen, anisotropy) nacen activas y no se
// animan desde 0 exacto: activarlas en caliente recompila el programa.
import * as THREE from 'three';
import type { Tier, UniformsCompartidos } from '../contrato-tipos.ts';
import type { Rol } from './geo.ts';
import type { TexturasMoto } from './texturas.ts';

/** Uniforms compartidos por escena (§4.6). Uno solo: lo crea la escena y lo reciben todos. */
export function crearUniforms(): UniformsCompartidos {
  return {
    uBarridoX: { value: -10 },
    uBarridoAncho: { value: 0.18 },
    uBarridoI: { value: 0 },
    uColorContra: { value: new THREE.Color('#CDD2D5') },
    uFoco: { value: -1 },
    uAtenuacion: { value: 1 },
  };
}

/**
 * Inyección común (§4.6): aPieza → vPieza, posición de mundo, fresnel del
 * barrido y atenuación por foco. Sirve para cualquier material estándar o
 * físico de three (también en InstancedMesh). La clave de programa es
 * 'calzo-' + nombre: una por cada inyección distinta, nunca compartida.
 */
export function inyectarComun(material: THREE.Material, U: UniformsCompartidos, nombre: string): void {
  const previo = material.onBeforeCompile;
  material.onBeforeCompile = (s, r) => {
    previo?.call(material, s, r);
    s.uniforms.uBarridoX = U.uBarridoX;
    s.uniforms.uBarridoAncho = U.uBarridoAncho;
    s.uniforms.uBarridoI = U.uBarridoI;
    s.uniforms.uColorContra = U.uColorContra;
    s.uniforms.uFoco = U.uFoco;
    s.uniforms.uAtenuacion = U.uAtenuacion;
    s.vertexShader = s.vertexShader
      .replace('#include <common>', `#include <common>
attribute float aPieza;
varying float vPieza;
varying vec3 vPosMundo;`)
      .replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
vPieza = aPieza;
vec4 calzoPos = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
calzoPos = instanceMatrix * calzoPos;
#endif
vPosMundo = (modelMatrix * calzoPos).xyz;`);
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
varying float vPieza;
varying vec3 vPosMundo;
uniform float uBarridoX;
uniform float uBarridoAncho;
uniform float uBarridoI;
uniform vec3 uColorContra;
uniform float uFoco;
uniform float uAtenuacion;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  vec3 calzoV = normalize(vViewPosition);
  float fres = pow(1.0 - saturate(dot(normalize(normal), calzoV)), 3.0);
  float banda = exp(-pow((vPosMundo.x - uBarridoX) / uBarridoAncho, 2.0));
  totalEmissiveRadiance += uColorContra * fres * banda * uBarridoI;
}`)
      .replace('#include <tonemapping_fragment>', `{
  float esFoco = step(abs(vPieza - uFoco), 0.5);
  gl_FragColor.rgb *= mix(1.0, mix(uAtenuacion, 1.0, esFoco), step(0.0, uFoco));
}
#include <tonemapping_fragment>`);
  };
  material.customProgramCacheKey = () => 'calzo-' + nombre;
}

// La textura de rugosidad compartida vale 0,94 de media: dividimos para que
// la rugosidad media sea exactamente la de la tabla.
const K = 1 / 0.94;

export type MaterialesMoto = Record<Rol, THREE.MeshStandardMaterial>;

export function crearMateriales(U: UniformsCompartidos, tex: TexturasMoto, _tier: Tier): MaterialesMoto {
  const r = tex.rugosidad;
  const fis = (p: THREE.MeshPhysicalMaterialParameters): THREE.MeshPhysicalMaterial =>
    new THREE.MeshPhysicalMaterial({ roughnessMap: r, ...p, roughness: (p.roughness ?? 0.5) * K });

  const m: MaterialesMoto = {
    pintura: fis({
      color: '#26272A', metalness: 0.55, roughness: 0.38,
      clearcoat: 1, clearcoatRoughness: 0.06,
      clearcoatNormalMap: tex.pielNaranja, clearcoatNormalScale: new THREE.Vector2(0.04, 0.04),
    }),
    cromo: fis({ color: '#C9CBCC', metalness: 1, roughness: 0.08 }),
    cromo_satinado: fis({ color: '#B7BABC', metalness: 1, roughness: 0.22 }),
    aluminio: fis({ color: '#A7AAAC', metalness: 1, roughness: 0.30, anisotropy: 0.6 }),
    // Labio diamantado de la llanta (§4.2): aluminio torneado, casi espejo.
    diamantado: fis({ color: '#B4B7B9', metalness: 1, roughness: 0.08 }),
    anodizado: fis({ color: '#1D1F21', metalness: 0.6, roughness: 0.42 }),
    fundicion: fis({ color: '#28292A', metalness: 0.7, roughness: 0.55 }),
    metal_disco: fis({ color: '#6C6E70', metalness: 1, roughness: 0.35 }),
    goma: fis({ color: '#111213', metalness: 0, roughness: 0.9, normalMap: tex.dibujo, normalScale: new THREE.Vector2(1, 1) }),
    goma_puno: fis({ color: '#111213', metalness: 0, roughness: 0.9, normalMap: tex.moleteado, normalScale: new THREE.Vector2(0.8, 0.8) }),
    asiento: fis({
      color: '#151617', metalness: 0, roughness: 0.75,
      sheen: 0.35, sheenColor: new THREE.Color('#3A3D40'), sheenRoughness: 0.8,
    }),
    faro_lente: fis({ color: '#0E0F10', metalness: 0, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03 }),
    faro_aro: new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#EFEEEA', emissiveIntensity: 0.6, roughness: 0.4, metalness: 0 }),
  };
  for (const mat of Object.values(m)) inyectarComun(mat, U, 'moto');
  // Nombre de rol en cada material: cargarGLB sustituye por nombre (§4.11).
  for (const [rol, mat] of Object.entries(m)) mat.name = rol;
  return m;
}
