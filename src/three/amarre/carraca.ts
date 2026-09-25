// Carraca (§4.4): cuerpo extruido de 0,07 × 0,04 × 0,03 y palanca extruida
// aparte (2 mallas). Se coloca en el extremo A de su cincha, alineada con la
// cinta; la palanca gira 3° por clic alrededor de su pivote trasero.
import * as THREE from 'three';
import type { MaterialesAmarre } from './plataforma.ts';

function rectRedondo(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// Geometrías compartidas por las cuatro carracas.
let geoCuerpo: THREE.BufferGeometry | null = null;
let geoPalanca: THREE.BufferGeometry | null = null;
function geometrias(): [THREE.BufferGeometry, THREE.BufferGeometry] {
  if (!geoCuerpo) {
    // Perfil 0,07 (a lo largo de la cinta) × 0,03 (alto), extruido 0,04 (ancho).
    geoCuerpo = new THREE.ExtrudeGeometry(rectRedondo(0.07 - 0.004, 0.03 - 0.004, 0.004), {
      depth: 0.04 - 0.004, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2, curveSegments: 3,
    });
    geoCuerpo.translate(0, 0, -(0.04 - 0.004) / 2);
    // Pletina de la palanca: 0,075 × 0,008, 0,03 de ancho; pivote en su extremo trasero.
    geoPalanca = new THREE.ExtrudeGeometry(rectRedondo(0.075, 0.008, 0.003), {
      depth: 0.03 - 0.002, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.001, bevelSegments: 1, curveSegments: 3,
    });
    geoPalanca.translate(0.075 / 2, 0, -(0.03 - 0.002) / 2);
  }
  return [geoCuerpo, geoPalanca!];
}

export interface Carraca {
  grupo: THREE.Group;
  palanca: THREE.Mesh;
  /** Coloca la carraca a lo largo de la cinta, junto a A, con la dirección A → B. */
  colocar(a: THREE.Vector3, b: THREE.Vector3): void;
  setAngulo(rad: number): void;
}

const _x = new THREE.Vector3(), _y = new THREE.Vector3(), _z = new THREE.Vector3(), _m = new THREE.Matrix4();
const REPOSO = -0.10; // la palanca descansa inclinada sobre el cuerpo

export function crearCarraca(m: MaterialesAmarre): Carraca {
  const [gc, gp] = geometrias();
  const grupo = new THREE.Group();
  grupo.name = 'carraca';
  const cuerpo = new THREE.Mesh(gc, m.anodizado);
  cuerpo.castShadow = true;
  const pivote = new THREE.Group();
  pivote.position.set(-0.03, 0.019, 0);
  const palanca = new THREE.Mesh(gp, m.aluminio);
  palanca.castShadow = true;
  pivote.add(palanca);
  pivote.rotation.z = REPOSO;
  grupo.add(cuerpo, pivote);
  grupo.visible = false;

  return {
    grupo, palanca,
    colocar(a, b) {
      _x.subVectors(b, a).normalize();
      _z.set(0, 1, 0).cross(_x).normalize();
      _y.crossVectors(_x, _z).multiplyScalar(-1);
      if (_y.y < 0) { _y.negate(); _z.negate(); }
      _m.makeBasis(_x, _y, _z);
      grupo.quaternion.setFromRotationMatrix(_m);
      grupo.position.copy(a).addScaledVector(_x, 0.06);
    },
    setAngulo(rad) {
      pivote.rotation.z = REPOSO + rad;
    },
  };
}
