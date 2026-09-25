// Plataforma elevadora (§4.4): bloque de 2,60 × 0,90 × 0,40 con la cara
// superior en y = 0 del grupo, chapa lagrimada arriba, costados de anodizado
// con carriles en U y cuatro anillas. Dos mallas: chapa + anillas y costados.
// También crea los materiales del amarre (§4.5), que son de WP2.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ANCLAS_PLATAFORMA, type AnclaPlataformaId, type Tier, type UniformsCompartidos } from '../contrato-tipos.ts';
import { texturaGPU } from '../gpu-textura.ts';

// Chapa lagrimada: lágrimas alargadas a ±45° alternas en una rejilla. Normal
// por diferencias centradas de la altura, en espacio tangente (valores lineales).
const FRAG_LAGRIMADO = /* glsl */`
varying vec2 vUv;
uniform float uPaso;
float altura(vec2 uv) {
  vec2 c = uv * 16.0;
  vec2 id = floor(c);
  vec2 f = fract(c) - 0.5;
  float s = mod(id.x + id.y, 2.0) < 0.5 ? 1.0 : -1.0;
  vec2 r = vec2(f.x + s * f.y, f.x - s * f.y) * 0.70710678;
  float d = length(vec2(r.x / 0.34, r.y / 0.085));
  return 1.0 - smoothstep(0.55, 1.0, d);
}
void main() {
  float e = uPaso;
  float hx = altura(vUv + vec2(e, 0.0)) - altura(vUv - vec2(e, 0.0));
  float hy = altura(vUv + vec2(0.0, e)) - altura(vUv - vec2(0.0, e));
  vec3 n = normalize(vec3(-hx * 1.6, -hy * 1.6, 1.0));
  gl_FragColor = vec4(n * 0.5 + 0.5, 1.0);
}`;

export interface MaterialesAmarre {
  plataforma: THREE.MeshPhysicalMaterial;
  anodizado: THREE.MeshPhysicalMaterial;
  aluminio: THREE.MeshPhysicalMaterial;
  goma: THREE.MeshStandardMaterial;
  dispose(): void;
}

/**
 * Aislado (§4.8): en las pausas, lo que no es la pieza en foco se atenúa. La
 * plataforma y el suelo también, para que la chapa bajo la clave no le robe la
 * luz a la pieza. Solo uniforms: nunca recompila.
 */
export function inyectarAtenuacion(mat: THREE.Material, U: UniformsCompartidos | undefined, clave: string): void {
  mat.customProgramCacheKey = () => 'calzo-' + clave;
  if (!U) return;
  mat.onBeforeCompile = (s) => {
    s.uniforms.uFoco = U.uFoco;
    s.uniforms.uAtenuacion = U.uAtenuacion;
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uFoco;\nuniform float uAtenuacion;')
      .replace('#include <tonemapping_fragment>', 'gl_FragColor.rgb *= mix(1.0, uAtenuacion, step(0.0, uFoco));\n#include <tonemapping_fragment>');
  };
}

export function crearMaterialesAmarre(renderer: THREE.WebGLRenderer, tier: Tier, U?: UniformsCompartidos): MaterialesAmarre {
  const lado = tier === 'alto' ? 1024 : 512;
  const lagrimado = texturaGPU(renderer, { frag: FRAG_LAGRIMADO, size: lado, espacio: 'lineal', uniforms: { uPaso: { value: 1 / lado } } });
  // 16 lágrimas por repetición y 2 repeticiones por metro: paso de ~31 mm.
  lagrimado.repeat.set(2, 2);
  lagrimado.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const plataforma = new THREE.MeshPhysicalMaterial({
    color: '#8E9194', metalness: 1, roughness: 0.34, normalMap: lagrimado, anisotropy: 0.4,
  });
  inyectarAtenuacion(plataforma, U, 'plataforma');
  const anodizado = new THREE.MeshPhysicalMaterial({ color: '#1D1F21', metalness: 0.6, roughness: 0.42 });
  inyectarAtenuacion(anodizado, U, 'anodizado');
  // anisotropy > 0 desde la creación: nunca se anima desde 0 (recompilaría).
  const aluminio = new THREE.MeshPhysicalMaterial({ color: '#A7AAAC', metalness: 1, roughness: 0.30, anisotropy: 0.6 });
  aluminio.customProgramCacheKey = () => 'calzo-aluminio';
  const goma = new THREE.MeshStandardMaterial({ color: '#111213', metalness: 0, roughness: 0.9 });
  goma.customProgramCacheKey = () => 'calzo-goma';

  return {
    plataforma, anodizado, aluminio, goma,
    dispose() { lagrimado.dispose(); plataforma.dispose(); anodizado.dispose(); aluminio.dispose(); goma.dispose(); },
  };
}

/** Deja solo position, normal y uv, sin índice, para poder fusionar. */
function limpia(g: THREE.BufferGeometry): THREE.BufferGeometry {
  const n = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') n.deleteAttribute(k);
  if (!n.getAttribute('uv')) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.getAttribute('position').count * 2), 2));
  n.clearGroups();
  return n;
}

/** Extrae los triángulos de un grupo de material de una geometría sin índice. */
function trozo(g: THREE.BufferGeometry, grupo: number): THREE.BufferGeometry {
  const out = new THREE.BufferGeometry();
  const gr = g.groups.filter((x) => x.materialIndex === grupo);
  for (const nombre of ['position', 'normal', 'uv'] as const) {
    const a = g.getAttribute(nombre) as THREE.BufferAttribute;
    const it = a.itemSize;
    const total = gr.reduce((s, x) => s + x.count, 0);
    const arr = new Float32Array(total * it);
    let o = 0;
    for (const x of gr) {
      arr.set((a.array as Float32Array).subarray(x.start * it, (x.start + x.count) * it), o);
      o += x.count * it;
    }
    out.setAttribute(nombre, new THREE.BufferAttribute(arr, it));
  }
  return out;
}

const ANCHO_X = 2.60, ANCHO_Z = 0.90, ALTO = 0.40, BISEL = 0.006, CARRIL = 0.03;

export interface Plataforma {
  grupo: THREE.Group;
  anillas: Record<AnclaPlataformaId, THREE.Object3D>;
  chapa: THREE.Mesh;
  costados: THREE.Mesh;
  dispose(): void;
}

export function crearPlataforma(m: MaterialesAmarre): Plataforma {
  const grupo = new THREE.Group();
  grupo.name = 'plataforma';

  // Cuerpo: rectángulo en planta (x, z) extruido hacia abajo con bisel en las
  // aristas superiores. El núcleo llega a z ±0,42: los 30 mm exteriores de cada
  // costado largo son el carril en U.
  const hx = ANCHO_X / 2 - BISEL, hz = ANCHO_Z / 2 - CARRIL - BISEL;
  const planta = new THREE.Shape();
  planta.moveTo(-hx, -hz); planta.lineTo(hx, -hz); planta.lineTo(hx, hz); planta.lineTo(-hx, hz); planta.lineTo(-hx, -hz);
  const cuerpo = new THREE.ExtrudeGeometry(planta, {
    depth: ALTO - 2 * BISEL, bevelEnabled: true, bevelThickness: BISEL, bevelSize: BISEL, bevelSegments: 2, steps: 1,
  });
  // Shape en XY, extrusión en +Z → planta en XZ y extrusión hacia −Y; tapa superior en y = 0.
  cuerpo.rotateX(Math.PI / 2);
  cuerpo.translate(0, -BISEL, 0);

  // Grupo 0 de ExtrudeGeometry = tapas (la de arriba es la chapa; la de abajo nunca se ve).
  const tapa = trozo(cuerpo, 0);
  const lados = trozo(cuerpo, 1);
  cuerpo.dispose();

  // Carriles en U (perfil en ZY, extruido a lo largo de x): pared exterior de
  // alto completo y ranura de 20 × 20 mm abierta hacia arriba.
  const carriles: THREE.BufferGeometry[] = [];
  for (const lado of [1, -1]) {
    const z0 = lado * (ANCHO_Z / 2 - CARRIL), z1 = lado * (ANCHO_Z / 2), s = lado;
    const perfil = new THREE.Shape();
    perfil.moveTo(z0, -ALTO);
    perfil.lineTo(z1, -ALTO);
    perfil.lineTo(z1, -0.0015);
    perfil.lineTo(z1 - s * 0.0015, 0);
    perfil.lineTo(z1 - s * 0.005, 0);
    perfil.lineTo(z1 - s * 0.005, -0.02);
    perfil.lineTo(z0 + s * 0.005, -0.02);
    perfil.lineTo(z0 + s * 0.005, 0);
    perfil.lineTo(z0, 0);
    perfil.lineTo(z0, -ALTO);
    const g = new THREE.ExtrudeGeometry(perfil, { depth: ANCHO_X, bevelEnabled: false });
    // shape.x → z, shape.y → y; la extrusión (+Z) pasa a −X y se centra.
    g.rotateY(-Math.PI / 2);
    g.translate(ANCHO_X / 2, 0, 0);
    carriles.push(limpia(g));
  }

  // Anillas: toros de pie sobre la chapa, en el plano que contiene la diagonal.
  const anillas = {} as Record<AnclaPlataformaId, THREE.Object3D>;
  const geosAnilla: THREE.BufferGeometry[] = [];
  for (const id of Object.keys(ANCLAS_PLATAFORMA) as AnclaPlataformaId[]) {
    const [x, y, z] = ANCLAS_PLATAFORMA[id];
    const a = new THREE.Object3D();
    a.name = id;
    a.position.set(x, y, z);
    grupo.add(a);
    anillas[id] = a;
    const t = new THREE.TorusGeometry(0.028, 0.006, 10, 28);
    // Anillo de pie, con su plano hacia el centro de la plataforma (la dirección del tiro).
    t.rotateY(Math.atan2(z, -x));
    t.translate(x, 0.028, z);
    geosAnilla.push(limpia(t));
  }

  const geoChapa = mergeGeometries([limpia(tapa), ...geosAnilla], false);
  const geoCostados = mergeGeometries([limpia(lados), ...carriles], false);
  if (!geoChapa || !geoCostados) throw new Error('[calzo] plataforma: no se pudo fusionar la geometría');

  const chapa = new THREE.Mesh(geoChapa, m.plataforma);
  chapa.name = 'plataforma-chapa';
  chapa.receiveShadow = true;
  const costados = new THREE.Mesh(geoCostados, m.anodizado);
  costados.name = 'plataforma-costados';
  costados.receiveShadow = true;
  grupo.add(chapa, costados);

  return {
    grupo, anillas, chapa, costados,
    dispose() { geoChapa.dispose(); geoCostados.dispose(); },
  };
}
