// Cinta analítica (§4.4): una malla por cincha con 49 × 2 vértices que se
// reescriben en el mismo Float32Array cada vez que cambia la curva, más el
// lazo en B (toro parcial de 300°) en el mismo búfer. Nada de física: la forma
// es función de A, B y la tensión T.
import * as THREE from 'three';
import type { UniformsCompartidos } from '../contrato-tipos.ts';

export const ANCHO_CINTA = 0.035;
const R_LAZO = 0.028, r_LAZO = 0.0045, ARCO_LAZO = (300 / 360) * Math.PI * 2;
const LAZO_T = 14, LAZO_R = 6;

const FLOJA = new THREE.Color('#2A2F33');   // lineal tras la conversión de three
const TENSA = new THREE.Color('#D2561F');

// Tejido diagonal de la cinta (normal map, 128 px, valores lineales).
export const FRAG_TEJIDO = /* glsl */`
varying vec2 vUv;
void main() {
  float f = 6.28318 * 4.0;
  float a = (vUv.x + vUv.y) * f;
  float b = (vUv.x - vUv.y) * f;
  float h = 0.5 + 0.5 * sin(a) * (0.6 + 0.4 * step(0.0, sin(b)));
  vec2 g = vec2(cos(a), cos(a)) * 0.35;
  vec3 n = normalize(vec3(-g.x, -g.y, 1.0));
  gl_FragColor = vec4(n * 0.5 + 0.5, 1.0);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.5, 0.5, 1.0), 0.15 * h);
}`;

export interface CinchaMaterial extends THREE.MeshStandardMaterial {
  userData: { uReveal: { value: number }; uT: { value: number }; uSinLuz: { value: number }; uCinchaLin: { value: THREE.Color } };
}

export function crearMaterialCincha(tejido: THREE.Texture | null, U?: UniformsCompartidos): CinchaMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color: FLOJA.clone(), roughness: 0.7, metalness: 0, side: THREE.DoubleSide, normalMap: tejido ?? null,
  }) as CinchaMaterial;
  if (tejido) mat.normalScale.set(0.6, 0.6);
  mat.userData = {
    uReveal: { value: 0 }, uT: { value: 0 }, uSinLuz: { value: 0 },
    // three convierte el hex a lineal; la salida sRGB del canvas vuelve a ser #D2561F exacto.
    uCinchaLin: { value: TENSA.clone() },
  };
  const ud = mat.userData;
  const uFoco = U?.uFoco ?? { value: -1 };
  const uAten = U?.uAtenuacion ?? { value: 1 };
  mat.onBeforeCompile = (s) => {
    s.uniforms.uReveal = ud.uReveal;
    s.uniforms.uT = ud.uT;
    s.uniforms.uSinLuz = ud.uSinLuz;
    s.uniforms.uCinchaLin = ud.uCinchaLin;
    s.uniforms.uFoco = uFoco;
    s.uniforms.uAtenuacion = uAten;
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aU;\nvarying float vU;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvU = aU;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>
varying float vU;
uniform float uReveal;
uniform float uT;
uniform float uSinLuz;
uniform vec3 uCinchaLin;
uniform float uFoco;
uniform float uAtenuacion;`)
      .replace('#include <clipping_planes_fragment>', 'if (vU > uReveal) discard;\n#include <clipping_planes_fragment>')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
{
  vec3 Vc = normalize(vViewPosition);
  float fr = pow(1.0 - saturate(abs(dot(normalize(normal), Vc))), 3.0);
  totalEmissiveRadiance += uCinchaLin * fr * clamp(uT, 0.0, 1.0) * 0.8;
}`)
      .replace('#include <tonemapping_fragment>', `gl_FragColor.rgb *= mix(1.0, uAtenuacion, step(0.0, uFoco));
#include <tonemapping_fragment>`)
      // Color exacto en el traspaso (§4.6): tras el tone mapping y antes de la
      // conversión de espacio de color.
      .replace('#include <colorspace_fragment>', `gl_FragColor.rgb = mix(gl_FragColor.rgb, uCinchaLin, uSinLuz);
#include <colorspace_fragment>`);
  };
  mat.customProgramCacheKey = () => 'calzo-cincha';
  return mat;
}

export interface Cincha {
  malla: THREE.Mesh;
  material: CinchaMaterial;
  set(reveal: number, T: number, sinLuz: number): void;
  setLazo(escala: number): void;
  uVisible(camara: THREE.Camera, oclusor: THREE.Object3D): number;
  bordes(u: number): [THREE.Vector3, THREE.Vector3];
  /** Puntos A y B actuales en el mundo. */
  extremos(): [THREE.Vector3, THREE.Vector3];
  lateral: THREE.Vector3;
  dispose(): void;
}

const _v = new THREE.Vector3(), _t = new THREE.Vector3(), _n = new THREE.Vector3(), _p = new THREE.Vector3();

export function crearCincha(a: THREE.Object3D, b: THREE.Object3D,
  o: { segmentos: 48; tejido?: THREE.Texture | null; U?: UniformsCompartidos }): Cincha {
  const N = o.segmentos + 1;             // 49 puntos a lo largo
  const nCinta = N * 2;
  const nLazo = (LAZO_T + 1) * (LAZO_R + 1);
  const total = nCinta + nLazo;

  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  const uv = new Float32Array(total * 2);
  const aU = new Float32Array(total);
  const idx: number[] = [];
  for (let i = 0; i < N - 1; i++) {
    const i0 = i * 2, i1 = i0 + 1, i2 = i0 + 2, i3 = i0 + 3;
    idx.push(i0, i2, i1, i1, i2, i3);
  }
  for (let i = 0; i < N; i++) aU[i * 2] = aU[i * 2 + 1] = i / (N - 1);
  // Lazo: aU = 0 para que el recorte por reveal nunca lo toque.
  for (let i = 0; i < LAZO_T; i++) {
    for (let j = 0; j < LAZO_R; j++) {
      const k0 = nCinta + i * (LAZO_R + 1) + j, k1 = k0 + LAZO_R + 1;
      idx.push(k0, k1, k0 + 1, k0 + 1, k1, k1 + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  const aPos = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage);
  const aNor = new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage);
  const aUv = new THREE.BufferAttribute(uv, 2).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', aPos);
  geo.setAttribute('normal', aNor);
  geo.setAttribute('uv', aUv);
  geo.setAttribute('aU', new THREE.BufferAttribute(aU, 1));
  geo.setIndex(idx);

  const material = crearMaterialCincha(o.tejido ?? null, o.U);
  const malla = new THREE.Mesh(geo, material);
  malla.name = 'cincha';
  malla.frustumCulled = false;
  malla.castShadow = false;
  malla.receiveShadow = false;
  malla.visible = false;

  const A = new THREE.Vector3(), B = new THREE.Vector3();
  const leer = () => { a.getWorldPosition(A); b.getWorldPosition(B); };
  leer();
  // Vector lateral fijo por cincha: se calcula una vez para que no degenere.
  const lateral = new THREE.Vector3().subVectors(B, A).cross(new THREE.Vector3(0, 1, 0)).normalize();

  let ultT = NaN, ultLazo = NaN;
  const ultA = new THREE.Vector3(NaN), ultB = new THREE.Vector3(NaN);
  let lazo = 0;

  /** P(u) = lerp(A, B, u) + abajo · s · 4u(1−u) + lateral · l · sin(πu). */
  function punto(u: number, s: number, l: number, dest: THREE.Vector3): THREE.Vector3 {
    dest.lerpVectors(A, B, u);
    dest.y -= s * 4 * u * (1 - u);
    return dest.addScaledVector(lateral, l * Math.sin(Math.PI * u));
  }

  function reescribir(T: number): void {
    const f = Math.max(0, 1 - T);
    const s = 0.16 * Math.pow(f, 1.5);
    const l = 0.03 * f;
    const L = A.distanceTo(B);
    const w = ANCHO_CINTA / 2;
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      punto(u, s, l, _p);
      // Tangente analítica: dP/du.
      _t.subVectors(B, A);
      _t.y -= s * 4 * (1 - 2 * u);
      _t.addScaledVector(lateral, l * Math.PI * Math.cos(Math.PI * u));
      _n.crossVectors(lateral, _t).normalize();
      if (_n.y < 0) _n.negate();
      for (let j = 0; j < 2; j++) {
        const k = i * 2 + j;
        const sg = j === 0 ? 1 : -1;   // 0: borde en +lateral; 1: en −lateral
        pos[k * 3] = _p.x + lateral.x * w * sg;
        pos[k * 3 + 1] = _p.y + lateral.y * w * sg;
        pos[k * 3 + 2] = _p.z + lateral.z * w * sg;
        nor[k * 3] = _n.x; nor[k * 3 + 1] = _n.y; nor[k * 3 + 2] = _n.z;
        uv[k * 2] = (u * L) / ANCHO_CINTA;
        uv[k * 2 + 1] = j;
      }
    }
    escribirLazo();
    aPos.needsUpdate = true; aNor.needsUpdate = true; aUv.needsUpdate = true;
  }

  const _ex = new THREE.Vector3(), _ey = new THREE.Vector3();
  function escribirLazo(): void {
    // Toro parcial alrededor del eje lateral, con la abertura de 60° hacia A.
    _ex.subVectors(A, B); _ex.addScaledVector(lateral, -_ex.dot(lateral)).normalize();
    _ey.crossVectors(lateral, _ex).normalize();
    const e = lazo;
    const inicio = (Math.PI * 2 - ARCO_LAZO) / 2;
    for (let i = 0; i <= LAZO_T; i++) {
      const fi = inicio + ARCO_LAZO * (i / LAZO_T);
      const cf = Math.cos(fi), sf = Math.sin(fi);
      for (let j = 0; j <= LAZO_R; j++) {
        const th = (j / LAZO_R) * Math.PI * 2;
        const ct = Math.cos(th), st = Math.sin(th);
        // Centro del tubo en el plano (ex, ey); sección en (radial, lateral).
        const rx = cf, ry = sf;
        const cx = R_LAZO * rx, cy = R_LAZO * ry;
        const nx = rx * ct, ny = ry * ct, nz = st;
        const px = cx + r_LAZO * nx, py = cy + r_LAZO * ny, pz = r_LAZO * nz;
        const k = nCinta + i * (LAZO_R + 1) + j;
        pos[k * 3] = B.x + (_ex.x * px + _ey.x * py + lateral.x * pz) * e;
        pos[k * 3 + 1] = B.y + (_ex.y * px + _ey.y * py + lateral.y * pz) * e;
        pos[k * 3 + 2] = B.z + (_ex.z * px + _ey.z * py + lateral.z * pz) * e;
        nor[k * 3] = _ex.x * nx + _ey.x * ny + lateral.x * nz;
        nor[k * 3 + 1] = _ex.y * nx + _ey.y * ny + lateral.y * nz;
        nor[k * 3 + 2] = _ex.z * nx + _ey.z * ny + lateral.z * nz;
        uv[k * 2] = i / LAZO_T; uv[k * 2 + 1] = j / LAZO_R;
      }
    }
  }

  const color = new THREE.Color();

  return {
    malla, material, lateral,
    set(reveal, T, sinLuz) {
      const ud = material.userData;
      ud.uReveal.value = reveal;
      ud.uT.value = T;
      ud.uSinLuz.value = sinLuz;
      color.copy(FLOJA).lerp(TENSA, Math.pow(Math.min(1, Math.max(0, T)), 1.2));
      material.color.copy(color);
      leer();
      if (T !== ultT || lazo !== ultLazo || !A.equals(ultA) || !B.equals(ultB)) {
        reescribir(T);
        ultT = T; ultLazo = lazo; ultA.copy(A); ultB.copy(B);
      }
    },
    setLazo(escala) {
      lazo = Math.max(0, Math.min(1, escala));
    },
    uVisible(camara, oclusor) {
      leer();
      oclusor.updateMatrixWorld(true);
      const origen = camara.getWorldPosition(new THREE.Vector3());
      const ray = new THREE.Raycaster();
      const tapado = (u: number): boolean => {
        _v.lerpVectors(A, B, u);
        const d = _v.sub(origen);
        const dist = d.length();
        ray.set(origen, d.normalize());
        ray.near = 0; ray.far = dist - 1e-3;
        return ray.intersectObject(oclusor, true).length > 0;
      };
      const M = 20;
      let prev = 0, hit = -1;
      for (let k = 0; k < M; k++) {
        const u = k / (M - 1);
        if (tapado(u)) { hit = u; break; }
        prev = u;
      }
      if (hit < 0) return 1;
      if (hit === 0) return 0;
      // Refina el cruce de la silueta por bisección.
      let lo = prev, hi = hit;
      for (let i = 0; i < 8; i++) {
        const m = (lo + hi) / 2;
        if (tapado(m)) hi = m; else lo = m;
      }
      return (lo + hi) / 2;
    },
    bordes(u) {
      leer();
      const c = _p.lerpVectors(A, B, u);
      return [c.clone().addScaledVector(lateral, ANCHO_CINTA / 2), c.clone().addScaledVector(lateral, -ANCHO_CINTA / 2)];
    },
    extremos() { leer(); return [A.clone(), B.clone()]; },
    dispose() { geo.dispose(); material.dispose(); },
  };
}
