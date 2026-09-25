// Detalles «de verdad» (§4.2): guardabarros delantero (arco de 130°, ancho
// 0,13, sección curva), latiguillos de freno y cables con catenaria natural y
// tapas, estriberas con estriado, palanca de cambio y pedal de freno.
import * as THREE from 'three';
import {
  cajaR, curvaPuntos, ejeHorquilla, extruir, orientar, poligonoRedondo, redondear, rutaCodos, seg,
  superficie, torno, tubo, type Calidad, type Grupo, type Lote, type V3,
} from '../geo.ts';

function delantero(q: Calidad, l: Lote): void {
  const c = new THREE.Vector3(0.725, 0.31, 0);
  const R = 0.352, th0 = (40 * Math.PI) / 180, th1 = th0 + (130 * Math.PI) / 180;
  const f = (u: number, v: number, out: THREE.Vector3) => {
    // Remates redondeados: la sección se cierra en los extremos.
    const e = 0.035;
    const esc = v < e ? Math.sin((v / e) * Math.PI / 2) : v > 1 - e ? Math.sin(((1 - v) / e) * Math.PI / 2) : 1;
    const th = th0 + (th1 - th0) * v;
    const a = u * Math.PI * 2;
    const s = Math.cos(a) * (0.35 + 0.65 * esc), t = Math.sin(a) * esc;
    const r = R - 0.016 * s * s + 0.0022 * t;
    out.set(c.x + r * Math.cos(th), c.y + r * Math.sin(th), 0.066 * s);
  };
  l.add('delantera', 'resto', 'pintura', superficie(f, seg(q, 28, 12), seg(q, 56, 24), { uvEscala: [1, 4] }));
  // Soportes: taco en el cruce con cada botella y tirante inferior.
  const thB = Math.atan2(0.9063, -0.4226);
  for (const s of [1, -1]) {
    const p = c.clone().add(new THREE.Vector3(Math.cos(thB), Math.sin(thB), 0).multiplyScalar(R - 0.012)).setZ(s * 0.07);
    const taco = cajaR(0.03, 0.02, 0.016, 0.004, [0, 0, 0], q, 2);
    taco.rotateZ(thB);
    taco.translate(p.x, p.y, p.z);
    l.add('delantera', 'resto', 'anodizado', taco);
  }
}

function cable(q: Calidad, l: Lote, grupo: Grupo, pts: V3[], r = 0.003, rol: 'anodizado' | 'goma_puno' = 'anodizado'): void {
  const v = pts.map((p) => new THREE.Vector3(...p));
  l.add(grupo, 'resto', rol, tubo(curvaPuntos(v), r, q, { radial: 7, pasos: 32, tapas: true }));
}

function racor(q: Calidad, l: Lote, grupo: Grupo, p: V3, dir: V3): void {
  const g = torno(redondear([[0.0, -0.006, 0], [0.0055, -0.006, 0.001], [0.0055, 0.008, 0.001], [0.0038, 0.012, 0.001], [0.0, 0.012, 0]], 2), seg(q, 14, 6));
  l.add(grupo, 'resto', 'aluminio', orientar(g, p, dir));
}

/** Guardabarros trasero corto (hugger) sobre la rueda, sujeto al basculante. */
function hugger(q: Calidad, l: Lote): void {
  const c = new THREE.Vector3(-0.725, 0.31, 0);
  const R = 0.345, th0 = (38 * Math.PI) / 180, th1 = (122 * Math.PI) / 180;
  const f = (u: number, v: number, out: THREE.Vector3) => {
    const e = 0.05;
    const esc = v < e ? Math.sin((v / e) * Math.PI / 2) : v > 1 - e ? Math.sin(((1 - v) / e) * Math.PI / 2) : 1;
    const th = th0 + (th1 - th0) * v;
    const a = u * Math.PI * 2;
    const s = Math.cos(a) * (0.35 + 0.65 * esc), t = Math.sin(a) * esc;
    const r = R - 0.022 * s * s + 0.0022 * t;
    out.set(c.x + r * Math.cos(th), c.y + r * Math.sin(th), 0.096 * s);
  };
  l.add('trasera', 'resto', 'pintura', superficie(f, seg(q, 28, 12), seg(q, 40, 16)));
  // Pletina del hugger al brazo izquierdo del basculante (el derecho lleva la pinza).
  const th = (40 * Math.PI) / 180;
  const pf = c.clone().add(new THREE.Vector3(Math.cos(th), Math.sin(th), 0).multiplyScalar(R - 0.02)).setZ(0.09);
  const pb = new THREE.Vector3(-0.50, 0.385, 0.118);
  l.add('trasera', 'resto', 'anodizado', tubo(rutaCodos([pf, pf.clone().setZ(0.11), pb], 0.015), 0.005, q, { radial: 10 }));
}

export function guardabarros(q: Calidad, l: Lote): void {
  delantero(q, l);
  hugger(q, l);
}

export function latiguillos(q: Calidad, l: Lote): void {
  // Latiguillos: bomba (manillar derecho) → distribuidor bajo la tija → pinzas.
  const bomba: V3 = [0.43, 0.955, -0.19];
  // El distribuidor va detrás del plano de las barras, bajo la tija inferior, pegado a la pipa.
  const pd = ejeHorquilla(0.44, -0.052, 0);
  const distrib: V3 = [pd.x, pd.y, 0];
  // Baja por detrás de la tija superior (nunca a través de ella) y pasa bajo la inferior.
  const cat = [bomba, [0.398, 0.93, -0.172], [0.372, 0.86, -0.125], [0.383, 0.78, -0.08], [pd.x - 0.03, pd.y + 0.02, -0.02], distrib]
    .map((p) => new THREE.Vector3(...(p as V3)));
  l.add('suspendida', 'resto', 'goma_puno', tubo(curvaPuntos(cat), 0.0034, q, { radial: 8, pasos: 48 }));
  racor(q, l, 'suspendida', bomba, [0.2, 1, 0]);
  l.add('suspendida', 'resto', 'aluminio', cajaR(0.02, 0.014, 0.03, 0.004, distrib, q, 2));
  for (const s of [1, -1]) {
    const pinza: V3 = [0.598, 0.285, s * 0.093];
    // Por detrás de cada botella, hasta el racor de la pinza.
    const b1 = ejeHorquilla(0.36, -0.05, s * 0.095), b2 = ejeHorquilla(0.16, -0.05, s * 0.10);
    const pts: V3[] = [[distrib[0], distrib[1] - 0.004, s * 0.012], [distrib[0] - 0.005, distrib[1] - 0.05, s * 0.07], [b1.x, b1.y, b1.z], [b2.x, b2.y, b2.z], pinza];
    l.add('delantera', 'resto', 'goma_puno', tubo(curvaPuntos(pts.map((p) => new THREE.Vector3(...p))), 0.0034, q, { radial: 8, pasos: 48 }));
    racor(q, l, 'delantera', pinza, [0.1, -1, 0]);
    // Guía del latiguillo en la botella.
    const guia = ejeHorquilla(0.26, -0.036, s * 0.10);
    l.add('delantera', 'resto', 'anodizado', cajaR(0.016, 0.02, 0.014, 0.003, [guia.x, guia.y, guia.z], q, 2));
  }

  // Cable de embrague (izquierda) y cables de gas (derecha) con su catenaria.
  // Todos pasan por detrás de la pipa, nunca por delante de las barras.
  cable(q, l, 'suspendida', [[0.425, 0.962, 0.19], [0.40, 0.94, 0.15], [0.39, 0.90, 0.10], [0.392, 0.83, 0.088], [0.39, 0.74, 0.08], [0.34, 0.62, 0.085], [0.22, 0.53, 0.14], [0.10, 0.475, 0.162]]);
  cable(q, l, 'suspendida', [[0.425, 0.958, -0.205], [0.40, 0.925, -0.14], [0.39, 0.87, -0.10], [0.392, 0.80, -0.082], [0.30, 0.745, -0.066], [0.12, 0.72, -0.064]]);
  cable(q, l, 'suspendida', [[0.427, 0.952, -0.215], [0.405, 0.92, -0.15], [0.395, 0.865, -0.112], [0.398, 0.795, -0.094], [0.30, 0.737, -0.078], [0.12, 0.712, -0.07]]);

}

export function mandosPie(q: Calidad, l: Lote): void {
  // Estriberas con su soporte, palanca de cambio (izquierda) y pedal de freno (derecha).
  for (const s of [1, -1]) {
    const soporte = poligonoRedondo([[-0.25, 0.43, 0.01], [-0.16, 0.40, 0.012], [-0.15, 0.345, 0.012], [-0.21, 0.335, 0.012]], 3);
    const g = extruir(soporte, 0.01, 0.002, q, 10, 1);
    g.translate(0, 0, s * 0.127);
    l.add('suspendida', 'resto', 'aluminio', g);
    const peg = cajaR(0.032, 0.022, 0.10, 0.007, [-0.18, 0.36, s * 0.182], q, 3);
    l.add('suspendida', 'resto', 'goma_puno', peg);
    const punta = torno(redondear([[0.0, 0.0, 0], [0.012, 0.0, 0.002], [0.012, 0.006, 0.003], [0.0, 0.008, 0]], 2), seg(q, 16, 8));
    l.add('suspendida', 'resto', 'aluminio', orientar(punta, [-0.18, 0.36, s * 0.232], [0, 0, s]));
    // Palanca / pedal: pletina en el plano XY que avanza hasta delante de la estribera.
    const forma = poligonoRedondo([[-0.17, 0.352, 0.006], [-0.02, 0.33, 0.01], [0.03, 0.345, 0.006], [0.028, 0.358, 0.006], [-0.02, 0.35, 0.01], [-0.17, 0.372, 0.006]], 3);
    const pal = extruir(forma, 0.007, 0.0015, q, 10, 1);
    pal.translate(0, 0, s * 0.147);
    l.add('suspendida', 'resto', 'aluminio', pal);
    const tope = torno(redondear([[0.0, 0.0, 0], [0.008, 0.0, 0.002], [0.008, 0.04, 0.003], [0.0, 0.042, 0]], 2), seg(q, 14, 6));
    l.add('suspendida', 'resto', s > 0 ? 'goma_puno' : 'aluminio', orientar(tope, [0.02, 0.35, s * 0.15], [0, 0, s]));
  }
}
