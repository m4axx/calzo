// Moto de maqueta (§5.1): cajas con los mismos grupos, anclas, aPieza,
// setHorquilla, setFoco y setApoyo que la moto real. Sirve para integrar la
// coreografía antes de que llegue WP1. Solo va en el chunk 3D.
import * as THREE from 'three';
import {
  ANCLAS, ANCLAS_SUSPENDIDAS, PIEZA_NUM, APOYO_HUELLA, anguloHorquilla,
  type AnclaId, type CrearMoto, type MotoRig, type PiezaId,
} from './contrato-tipos.ts';

type Grupo = 'suspendida' | 'delantera' | 'trasera';

function caja(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, pieza: PiezaId): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).toNonIndexed();
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const n = g.getAttribute('position').count;
  g.setAttribute('aPieza', new THREE.Float32BufferAttribute(new Float32Array(n).fill(PIEZA_NUM[pieza]), 1));
  return g;
}

function rueda(x: number, ancho: number, pieza: PiezaId): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(0.31, 0.31, ancho, 32).toNonIndexed();
  g.rotateX(Math.PI / 2);
  g.translate(x, 0.31, 0);
  const n = g.getAttribute('position').count;
  g.setAttribute('aPieza', new THREE.Float32BufferAttribute(new Float32Array(n).fill(PIEZA_NUM[pieza]), 1));
  return g;
}

function fusionar(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  // Fusión mínima sin BufferGeometryUtils: posiciones, normales y aPieza.
  const total = geos.reduce((s, g) => s + g.getAttribute('position').count, 0);
  const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), pie = new Float32Array(total);
  let o = 0;
  for (const g of geos) {
    const p = g.getAttribute('position'), n = g.getAttribute('normal'), a = g.getAttribute('aPieza');
    pos.set(p.array as Float32Array, o * 3);
    nor.set(n.array as Float32Array, o * 3);
    pie.set(a.array as Float32Array, o);
    o += p.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('aPieza', new THREE.BufferAttribute(pie, 1));
  out.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(total * 2), 2));
  return out;
}

export const crearMotoMaqueta: CrearMoto = async (o) => {
  const U = o.U;
  const mat = new THREE.MeshStandardMaterial({ color: 0x26272a, metalness: 0.5, roughness: 0.45 });
  mat.onBeforeCompile = (s) => {
    s.uniforms.uFoco = U.uFoco;
    s.uniforms.uAtenuacion = U.uAtenuacion;
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aPieza;\nvarying float vPieza;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPieza = aPieza;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vPieza;\nuniform float uFoco;\nuniform float uAtenuacion;')
      .replace('#include <tonemapping_fragment>', `
        float esFoco = step(abs(vPieza - uFoco), 0.5);
        gl_FragColor.rgb *= mix(1.0, mix(uAtenuacion, 1.0, esFoco), step(0.0, uFoco));
        #include <tonemapping_fragment>`);
  };
  mat.customProgramCacheKey = () => 'calzo-maqueta';

  const piezas: Record<Grupo, THREE.BufferGeometry[]> = { suspendida: [], delantera: [], trasera: [] };
  // Suspendida: depósito, asiento, motor, chasis, tijas y manillar.
  piezas.suspendida.push(
    caja(-0.13, 0.78, -0.16, 0.40, 1.0, 0.16, 'deposito'),
    caja(-0.62, 0.80, -0.13, -0.12, 0.88, 0.13, 'resto'),
    caja(-0.20, 0.24, -0.15, 0.25, 0.52, 0.15, 'motor'),
    caja(0.43, 0.75, -0.14, 0.58, 0.78, 0.14, 'tija'),
    caja(0.38, 0.89, -0.14, 0.50, 0.92, 0.14, 'tija'),
    caja(0.38, 0.95, -0.38, 0.46, 0.99, 0.38, 'mandos'),
    caja(0.54, 0.80, -0.09, 0.66, 0.96, 0.09, 'resto'),
  );
  // Delantera: botellas y rueda.
  piezas.delantera.push(
    caja(0.55, 0.30, -0.13, 0.62, 0.72, -0.07, 'horquilla'),
    caja(0.55, 0.30, 0.07, 0.62, 0.72, 0.13, 'horquilla'),
    rueda(0.725, 0.12, 'rueda_del'),
  );
  // Trasera: rueda y basculante.
  piezas.trasera.push(
    rueda(-0.725, 0.17, 'resto'),
    caja(-0.72, 0.29, -0.14, -0.20, 0.33, 0.14, 'resto'),
  );

  const root = new THREE.Group();
  root.name = 'moto';
  const pivote = new THREE.Group();
  pivote.name = 'pivote_suspension';
  const [px, py, pz] = ANCLAS.pivote_suspension;
  pivote.position.set(px, py, pz);
  root.add(pivote);

  const grupos = {} as MotoRig['grupos'];
  for (const nombre of ['suspendida', 'delantera', 'trasera'] as Grupo[]) {
    const g = new THREE.Group();
    g.name = nombre;
    const m = new THREE.Mesh(fusionar(piezas[nombre]), mat);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    grupos[nombre] = g;
    o.progreso?.(nombre === 'suspendida' ? 0.4 : nombre === 'delantera' ? 0.7 : 1);
    await new Promise((r) => setTimeout(r, 0));
  }
  // La suspendida cuelga del pivote para girar a su alrededor.
  grupos.suspendida.position.set(-px, -py, -pz);
  pivote.add(grupos.suspendida);
  root.add(grupos.delantera, grupos.trasera);

  const anclas = {} as Record<AnclaId, THREE.Object3D>;
  for (const id of Object.keys(ANCLAS) as AnclaId[]) {
    if (id === 'pivote_suspension') { anclas[id] = pivote; continue; }
    const a = new THREE.Object3D();
    a.name = id;
    const [x, y, z] = ANCLAS[id];
    a.position.set(x, y, z);
    (ANCLAS_SUSPENDIDAS.has(id) ? grupos.suspendida : root).add(a);
    anclas[id] = a;
  }

  const caja3 = new THREE.Box3(new THREE.Vector3(-1.06, 0, -0.38), new THREE.Vector3(1.04, 1.04, 0.38));

  return {
    root, grupos, anclas, caja: caja3,
    setHorquilla(t: number) {
      pivote.rotation.z = -anguloHorquilla(t);
    },
    setFoco(pieza: PiezaId | null, mezcla: number) {
      U.uFoco.value = pieza === null ? -1 : PIEZA_NUM[pieza];
      U.uAtenuacion.value = 1 + (0.15 - 1) * mezcla;
    },
    setApoyo(y: number) {
      root.position.y = y - APOYO_HUELLA;
    },
    dispose() {
      root.traverse((ob) => { if ((ob as THREE.Mesh).isMesh) (ob as THREE.Mesh).geometry.dispose(); });
      mat.dispose();
    },
  };
};
