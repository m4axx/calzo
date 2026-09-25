// Entorno PMREM de estudio (§4.7): sala negra con tres tiras emisivas. Los
// reflejos largos de automoción salen de aquí. Se genera una sola vez; los
// barridos se hacen rotando scene.environmentRotation.y.
// Dueño: WP1. Firma estable: crearEntorno(renderer, tier) (la usa WP2).
//
// Añadido de WP1 respecto a la tabla: un rebote de suelo muy tenue (disco con
// degradado radial bajo la moto). Es la luz de la clave devuelta por la
// plataforma: sin él, todo metal vertical (discos, cárter, botellas, llantas)
// refleja la sala negra y sale plano, como plástico negro. Con él, cada pieza
// metálica gana su línea de horizonte, que es lo que lee el ojo como metal.
// La cámara cúbica se coloca a media altura de la moto (0,5 m), no en el suelo.
import * as THREE from 'three';
import type { Tier } from './contrato-tipos.ts';

function tira(w: number, h: number, d: number, x: number, y: number, z: number, color: string, intensidad: number): THREE.Mesh {
  const c = new THREE.Color(color).multiplyScalar(intensidad);
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: c, toneMapped: false }));
  m.position.set(x, y, z);
  return m;
}

/** Rebote del suelo: disco con degradado radial (colores por vértice), del centro al borde. */
function rebote(radio: number, intensidad: number): THREE.Mesh {
  // Anillos concéntricos para que el degradado siga la curva y no sea un cono lineal.
  const g = new THREE.RingGeometry(0.001, radio, 64, 10);
  g.rotateX(-Math.PI / 2);
  const p = g.getAttribute('position') as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3);
  const base = new THREE.Color('#CDD2D5');
  for (let i = 0; i < p.count; i++) {
    const r = Math.hypot(p.getX(i), p.getZ(i)) / radio;
    const k = intensidad * Math.pow(Math.max(0, 1 - r), 1.6);
    col[i * 3] = base.r * k; col[i * 3 + 1] = base.g * k; col[i * 3 + 2] = base.b * k;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
  m.position.y = 0.002;
  return m;
}

export function crearEntorno(renderer: THREE.WebGLRenderer, tier: Tier): THREE.Texture {
  const estudio = new THREE.Scene();
  const sala = new THREE.Mesh(
    new THREE.BoxGeometry(12, 6, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }),
  );
  sala.position.y = 3;
  estudio.add(sala);
  estudio.add(
    tira(5.0, 0.08, 0.5, 0, 4.2, 0, '#EFEEEA', 6),        // T1 cenital longitudinal
    tira(0.4, 2.6, 0.06, 1.5, 1.6, 4.0, '#CDD2D5', 4),    // T2 lateral izquierda
    tira(3.0, 0.4, 0.06, -4.5, 1.2, -1.0, '#CDD2D5', 3),  // T3 contra trasera
    rebote(4.5, 0.55),
  );
  const pmrem = new THREE.PMREMGenerator(renderer);
  const size = tier === 'alto' ? 256 : 128;
  const rt = pmrem.fromScene(estudio, 0.02, 0.1, 100, { size, position: new THREE.Vector3(0, 0.5, 0) });
  pmrem.dispose();
  estudio.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
  });
  return rt.texture;
}
