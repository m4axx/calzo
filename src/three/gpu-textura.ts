// Texturas procedurales en GPU (§7.7): un solo render de un shader a un
// WebGLRenderTarget. Sin lectura a CPU, sin canvas 2D en el hilo principal.
import * as THREE from 'three';

const VERT = /* glsl */`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export function texturaGPU(renderer: THREE.WebGLRenderer, o: {
  frag: string;
  size: number | [number, number];
  uniforms?: Record<string, { value: unknown }>;
  mipmaps?: boolean;
  espacio?: 'srgb' | 'lineal';
}): THREE.Texture {
  const [w, h] = typeof o.size === 'number' ? [o.size, o.size] : o.size;
  const mip = o.mipmaps ?? true;
  const rt = new THREE.WebGLRenderTarget(w, h, {
    type: THREE.UnsignedByteType,
    format: THREE.RGBAFormat,
    generateMipmaps: mip,
    minFilter: mip ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    depthBuffer: false,
    stencilBuffer: false,
    colorSpace: o.espacio === 'srgb' ? THREE.SRGBColorSpace : THREE.NoColorSpace,
  });
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: o.frag,
    uniforms: o.uniforms ?? {},
    depthTest: false,
    depthWrite: false,
  });
  const geo = new THREE.PlaneGeometry(2, 2);
  const malla = new THREE.Mesh(geo, mat);
  malla.frustumCulled = false;
  const escena = new THREE.Scene();
  escena.add(malla);
  const cam = new THREE.Camera();

  const rtPrevio = renderer.getRenderTarget();
  const tmPrevio = renderer.toneMapping;
  const autoClear = renderer.autoClear;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.autoClear = true;
  renderer.setRenderTarget(rt);
  renderer.render(escena, cam);
  renderer.setRenderTarget(rtPrevio);
  renderer.toneMapping = tmPrevio;
  renderer.autoClear = autoClear;

  geo.dispose();
  mat.dispose();
  const tex = rt.texture;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
