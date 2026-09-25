// Chasis de doble cuna (§4.2): tubos Ø 0,025 como CurvePath de rectas con
// codos de radio 0,03 (nada de CatmullRom), collarín en cada unión, placas
// del basculante y soportes del motor. Anodizado, grupo suspendido.
//
// Desviaciones de coordenadas respecto a la tabla (para que ningún tubo
// atraviese el cárter ni el depósito): los largueros nacen en la pipa y pasan
// por (0,25; 0,785); las bajantes bajan por delante del cárter y lo cunan por
// debajo (y 0,215); el subchasis nace del codo del larguero.
import * as THREE from 'three';
import { collarin, ejeHorquilla, extruir, poligonoRedondo, rutaCodos, tubo, type Calidad, type Lote, type V3 } from '../geo.ts';
import { W_PIPA } from './tijas.ts';

export const R_TUBO = 0.0125;

export function chasis(q: Calidad, l: Lote): void {
  const piezas: THREE.CurvePath<THREE.Vector3>[] = [];
  const uniones: { p: THREE.Vector3; t: THREE.Vector3 }[] = [];
  const add = (pts: V3[], rCodo = 0.03, tapas: boolean | [boolean, boolean] = false, collar: [boolean, boolean] = [true, true]) => {
    const ruta = rutaCodos(pts, rCodo);
    piezas.push(ruta);
    l.add('suspendida', 'resto', 'anodizado', tubo(ruta, R_TUBO, q, { radial: 14, pasos: 8, tapas }));
    const t0 = ruta.getTangentAt(0), t1 = ruta.getTangentAt(1);
    if (collar[0]) uniones.push({ p: ruta.getPointAt(0).addScaledVector(t0, 0.01), t: t0 });
    if (collar[1]) uniones.push({ p: ruta.getPointAt(1).addScaledVector(t1, -0.01), t: t1 });
  };
  const pipa = (t: number, z: number): V3 => {
    const p = ejeHorquilla(t, W_PIPA - 0.012, z);
    return [p.x, p.y, p.z];
  };

  for (const s of [1, -1]) {
    // Larguero superior: de la pipa, por debajo del depósito, al pivote.
    add([pipa(0.585, s * 0.018), [0.25, 0.785, s * 0.11], [-0.05, 0.69, s * 0.11], [-0.18, 0.55, s * 0.11], [-0.20, 0.47, s * 0.11]]);
    // Bajante: por delante del cárter, cuna por debajo y sube detrás a la placa.
    add([pipa(0.535, s * 0.02), [0.31, 0.42, s * 0.11], [0.22, 0.215, s * 0.11], [-0.17, 0.215, s * 0.11], [-0.235, 0.36, s * 0.11], [-0.215, 0.43, s * 0.11]]);
    // Riostra del subchasis: de la placa del basculante al carril del asiento.
    add([[-0.215, 0.50, s * 0.108], [-0.55, 0.772, s * 0.10]]);
  }
  // Subchasis en U cerrada por detrás, naciendo del codo de los largueros.
  add([[-0.03, 0.69, 0.11], [-0.12, 0.745, 0.10], [-0.80, 0.80, 0.10], [-0.815, 0.80, 0.0], [-0.80, 0.80, -0.10], [-0.12, 0.745, -0.10], [-0.03, 0.69, -0.11]], 0.04);
  // Travesaños: bajo el asiento, bajo la pipa, bajo el motor y detrás del motor.
  add([[-0.32, 0.765, 0.10], [-0.32, 0.765, -0.10]], 0.03);
  add([[0.40, 0.66, 0.064], [0.40, 0.66, -0.064]], 0.03);
  add([[0.02, 0.215, 0.11], [0.02, 0.215, -0.11]], 0.03);
  add([[-0.19, 0.56, 0.11], [-0.19, 0.56, -0.11]], 0.03);

  for (const u of uniones) l.add('suspendida', 'resto', 'anodizado', collarin(u.p, u.t, R_TUBO, q));

  // Placas del basculante (a cada lado, por fuera de los largueros, tapando las uniones).
  const placa = poligonoRedondo([
    [-0.195, 0.355, 0.015], [-0.214, 0.40, 0.02], [-0.167, 0.47, 0.03], [-0.158, 0.555, 0.03], [-0.205, 0.595, 0.03],
    [-0.258, 0.52, 0.04], [-0.262, 0.38, 0.04], [-0.232, 0.33, 0.03],
  ], 4);
  for (const s of [1, -1]) {
    const g = extruir(placa, 0.012, 0.003, q, 20, 2);
    g.translate(0, 0, s * 0.105);
    l.add('suspendida', 'resto', 'anodizado', g);
  }
  // Soportes delanteros del motor: pletinas de la bajante al cárter.
  for (const s of [1, -1]) {
    const del = poligonoRedondo([
      [0.34, 0.47, 0.012], [0.30, 0.49, 0.012], [0.225, 0.43, 0.015], [0.225, 0.37, 0.015], [0.30, 0.33, 0.012],
    ], 3);
    const g = extruir(del, 0.008, 0.002, q, 12, 1);
    g.translate(0, 0, s * 0.125);
    l.add('suspendida', 'resto', 'anodizado', g);
  }
}
