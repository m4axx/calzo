// Entorno PMREM de estudio (§4.7): sala negra con tres tiras emisivas. Los
// reflejos largos de automoción salen de aquí. Se genera una sola vez; los
// barridos se hacen rotando scene.environmentRotation.y.
// Dueño: WP1 (la versión inicial la deja WP0 para desbloquear WP2).
import * as THREE from 'three';
import type { Tier } from './contrato-tipos.ts';

function tira(w: number, h: number, d: number, x: number, y: number, z: number, color: string, intensidad: number): THREE.Mesh {
  const c = new THREE.Color(color).multiplyScalar(intensidad);
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: c, toneMapped: false }));
  m.position.set(x, y, z);
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
  );
  const pmrem = new THREE.PMREMGenerator(renderer);
  const size = tier === 'alto' ? 256 : 128;
  const rt = pmrem.fromScene(estudio, 0.02, 0.1, 100, { size });
  pmrem.dispose();
  estudio.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
  });
  return rt.texture;
}
