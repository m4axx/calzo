// Utilidades de geometría de la moto (WP1). Todo en metros y en coordenadas
// del rig en reposo (§4.1): +X delante, +Y arriba, +Z a la izquierda.
// Aquí vive lo que comparten las piezas: perfiles con bisel, tubos con codos
// y tapas, superficies paramétricas (loft) y el lote donde cada pieza deja
// su geometría con su grupo, su material y su id de pieza.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { PiezaId } from '../contrato-tipos.ts';

export type V3 = [number, number, number];
export type Grupo = 'suspendida' | 'delantera' | 'trasera';
export type Rol = 'pintura' | 'cromo' | 'cromo_satinado' | 'aluminio' | 'diamantado' | 'anodizado'
  | 'fundicion' | 'metal_disco' | 'goma' | 'goma_puno' | 'asiento' | 'faro_lente' | 'faro_aro';

export const V = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
const Y = new THREE.Vector3(0, 1, 0);

/** Eje de la horquilla (§4.1): punto a distancia t del eje delantero a lo largo de d. */
export const D_HORQ = new THREE.Vector3(-0.4226, 0.9063, 0).normalize();
/** Perpendicular a d en el plano XY, hacia delante y arriba. */
export const W_HORQ = new THREE.Vector3(0.9063, 0.4226, 0).normalize();
export function ejeHorquilla(t: number, w = 0, z = 0): THREE.Vector3 {
  return new THREE.Vector3(0.725, 0.31, z).addScaledVector(D_HORQ, t).addScaledVector(W_HORQ, w);
}

/** Calidad por tier: f multiplica los segmentos (1 en alto, 0,5 en medio). */
export interface Calidad { f: number }
export function seg(q: Calidad, n: number, min = 3): number {
  return Math.max(min, Math.round(n * q.f));
}

// ————————————————————————————————————————————— perfiles 2D

/**
 * Polilínea con esquinas redondeadas: cada vértice lleva [x, y, r]. r es la
 * distancia de recorte a cada lado de la esquina (el bisel), así ninguna
 * arista queda a 90° viva. Los extremos se conservan tal cual.
 */
export function redondear(pts: readonly (readonly [number, number, number])[], pasos = 4): THREE.Vector2[] {
  const out: THREE.Vector2[] = [];
  for (let i = 0; i < pts.length; i++) {
    const [x, y, r] = pts[i];
    const p = new THREE.Vector2(x, y);
    if (i === 0 || i === pts.length - 1 || r <= 0) { out.push(p); continue; }
    const a = new THREE.Vector2(pts[i - 1][0], pts[i - 1][1]);
    const b = new THREE.Vector2(pts[i + 1][0], pts[i + 1][1]);
    const da = a.sub(p), db = b.sub(p);
    const la = da.length(), lb = db.length();
    const t = Math.min(r, la * 0.5, lb * 0.5);
    const p0 = p.clone().addScaledVector(da, t / la);
    const p1 = p.clone().addScaledVector(db, t / lb);
    for (let k = 0; k <= pasos; k++) {
      const s = k / pasos, s1 = 1 - s;
      out.push(new THREE.Vector2(
        s1 * s1 * p0.x + 2 * s1 * s * p.x + s * s * p1.x,
        s1 * s1 * p0.y + 2 * s1 * s * p.y + s * s * p1.y,
      ));
    }
  }
  return out;
}

/**
 * Torno: LatheGeometry sobre el eje +Y con la v de la uv por longitud de arco
 * (el Lathe de three la reparte por índice de punto y estira el normal map).
 */
export function torno(perfil: THREE.Vector2[], segmentos: number, fase = 0, arco = Math.PI * 2): THREE.BufferGeometry {
  const g = new THREE.LatheGeometry(perfil, segmentos, fase, arco);
  const acum = [0];
  for (let i = 1; i < perfil.length; i++) acum.push(acum[i - 1] + perfil[i].distanceTo(perfil[i - 1]));
  const total = acum[acum.length - 1] || 1;
  const uv = g.getAttribute('uv') as THREE.BufferAttribute;
  const n = perfil.length;
  for (let i = 0; i <= segmentos; i++) {
    for (let j = 0; j < n; j++) uv.setY(i * n + j, acum[j] / total);
  }
  return g;
}

/** Gira una geometría construida sobre +Y para que su eje sea `eje` y la lleva a `origen`. */
export function orientar(g: THREE.BufferGeometry, origen: THREE.Vector3 | V3, eje: THREE.Vector3 | V3): THREE.BufferGeometry {
  const e = Array.isArray(eje) ? new THREE.Vector3(...eje) : eje.clone();
  const o = Array.isArray(origen) ? new THREE.Vector3(...origen) : origen;
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Y, e.normalize()));
  g.translate(o.x, o.y, o.z);
  return g;
}

/** Matriz con base (ex, ey, ez) y origen o: lleva el espacio local de una pieza al rig. */
export function base(o: THREE.Vector3, ex: THREE.Vector3, ey: THREE.Vector3, ez: THREE.Vector3): THREE.Matrix4 {
  return new THREE.Matrix4().makeBasis(ex, ey, ez).setPosition(o);
}

/** Caja con cantos redondeados, centrada en c. */
export function cajaR(w: number, h: number, d: number, r: number, c: THREE.Vector3 | V3, q: Calidad, segs = 3): THREE.BufferGeometry {
  const g = new RoundedBoxGeometry(w, h, d, Math.max(1, Math.round(segs * Math.max(q.f, 0.67))), Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4));
  const p = Array.isArray(c) ? c : [c.x, c.y, c.z];
  g.translate(p[0], p[1], p[2]);
  return g;
}

/** Extrusión centrada en z = 0, con bisel en las dos caras. */
export function extruir(forma: THREE.Shape, grosor: number, bisel: number, q: Calidad, curvas = 24, pasosBisel = 2): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(forma, {
    depth: Math.max(1e-4, grosor - 2 * bisel),
    bevelEnabled: bisel > 0,
    bevelThickness: bisel,
    bevelSize: bisel,
    bevelSegments: Math.max(1, Math.round(pasosBisel * Math.max(q.f, 0.5))),
    curveSegments: seg(q, curvas, 4),
  });
  g.translate(0, 0, -(grosor - 2 * bisel) / 2);
  return g;
}

// ————————————————————————————————————————————— rutas y tubos

/**
 * Ruta de rectas con codos (§4.2): LineCurve3 entre vértices y un
 * QuadraticBezierCurve3 en cada esquina, recortado `rCodo` a cada lado.
 * Así las rectas son rectas de verdad, sin la ondulación de un CatmullRom.
 */
export function rutaCodos(pts: (THREE.Vector3 | V3)[], rCodo: number | number[]): THREE.CurvePath<THREE.Vector3> {
  const P = pts.map((p) => (Array.isArray(p) ? new THREE.Vector3(...p) : p.clone()));
  const path = new THREE.CurvePath<THREE.Vector3>();
  let desde = P[0].clone();
  for (let i = 1; i < P.length; i++) {
    const p = P[i];
    if (i === P.length - 1) { path.add(new THREE.LineCurve3(desde, p.clone())); break; }
    const r = Array.isArray(rCodo) ? rCodo[i - 1] : rCodo;
    const a = P[i - 1], b = P[i + 1];
    const la = p.distanceTo(a), lb = p.distanceTo(b);
    const t = Math.min(r, la * 0.45, lb * 0.45);
    const p0 = p.clone().addScaledVector(a.clone().sub(p).normalize(), t);
    const p1 = p.clone().addScaledVector(b.clone().sub(p).normalize(), t);
    if (p0.distanceTo(desde) > 1e-6) path.add(new THREE.LineCurve3(desde, p0));
    path.add(new THREE.QuadraticBezierCurve3(p0, p.clone(), p1));
    desde = p1;
  }
  return path;
}

interface Muestra { p: THREE.Vector3; t: THREE.Vector3 }

/** Muestrea una curva: las rectas con sus dos extremos, lo curvo con `pasos` por tramo. */
function muestrear(curva: THREE.Curve<THREE.Vector3>, pasosCurva: number): Muestra[] {
  const tramos = (curva as THREE.CurvePath<THREE.Vector3>).curves ?? [curva];
  const out: Muestra[] = [];
  for (const c of tramos) {
    const recta = (c as THREE.LineCurve3).isLineCurve3;
    const n = recta ? 1 : pasosCurva;
    for (let k = out.length ? 1 : 0; k <= n; k++) {
      const u = k / n;
      out.push({ p: c.getPointAt(u), t: c.getTangentAt(u).normalize() });
    }
  }
  return out;
}

/**
 * Tubo propio sobre una curva con transporte paralelo del marco (sin giros
 * de Frenet en las rectas) y tapas redondeadas en los extremos libres.
 * u de la uv = longitud / (2πr) para que la anisotropía corra a lo largo.
 */
export function tubo(curva: THREE.Curve<THREE.Vector3>, radio: number, q: Calidad, o: {
  radial?: number; pasos?: number; tapas?: boolean | [boolean, boolean];
} = {}): THREE.BufferGeometry {
  const radial = seg(q, o.radial ?? 14, 6);
  const pasos = seg(q, o.pasos ?? 10, 3);
  const m = muestrear(curva, pasos);
  const N = new THREE.Vector3(), B = new THREE.Vector3();
  // Normal inicial: cualquier perpendicular estable a la primera tangente.
  const t0 = m[0].t;
  const ref = Math.abs(t0.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  N.crossVectors(t0, ref).normalize();
  const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = [];
  let largo = 0;
  const q0 = new THREE.Quaternion();
  for (let i = 0; i < m.length; i++) {
    if (i > 0) {
      q0.setFromUnitVectors(m[i - 1].t, m[i].t);
      N.applyQuaternion(q0).normalize();
      largo += m[i].p.distanceTo(m[i - 1].p);
    }
    B.crossVectors(m[i].t, N).normalize();
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const nx = Math.cos(a) * N.x + Math.sin(a) * B.x;
      const ny = Math.cos(a) * N.y + Math.sin(a) * B.y;
      const nz = Math.cos(a) * N.z + Math.sin(a) * B.z;
      pos.push(m[i].p.x + radio * nx, m[i].p.y + radio * ny, m[i].p.z + radio * nz);
      nor.push(nx, ny, nz);
      uv.push(largo / (Math.PI * 2 * radio) * 0.25, j / radial);
    }
  }
  const fila = radial + 1;
  for (let i = 0; i < m.length - 1; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * fila + j, b = (i + 1) * fila + j, c = (i + 1) * fila + j + 1, d = i * fila + j + 1;
      idx.push(a, b, d, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  const tapas = o.tapas ?? true;
  const [ti, tf] = Array.isArray(tapas) ? tapas : [tapas, tapas];
  const partes = [g];
  if (ti) partes.push(tapa(m[0].p, m[0].t.clone().negate(), radio, radial));
  if (tf) partes.push(tapa(m[m.length - 1].p, m[m.length - 1].t, radio, radial));
  return partes.length === 1 ? g : unir(partes);
}

/** Tapa redondeada de un extremo de tubo: un torno corto con bisel, algo metido en el tubo. */
export function tapa(p: THREE.Vector3, haciaFuera: THREE.Vector3, r: number, radial: number): THREE.BufferGeometry {
  const h = r * 0.28;
  const perfil = redondear([[r, -r * 0.1, 0], [r, h, r * 0.35], [0, h, 0]], 3);
  return orientar(torno(perfil, radial), p, haciaFuera);
}

/** Toro fino (collarín) alrededor de un tubo en el punto p con eje `eje`. */
export function collarin(p: THREE.Vector3, eje: THREE.Vector3, rTubo: number, q: Calidad, grueso = 0.0028): THREE.BufferGeometry {
  const g = new THREE.TorusGeometry(rTubo + grueso * 0.35, grueso, seg(q, 6, 4), seg(q, 18, 8));
  // TorusGeometry está en el plano XY: su eje es +Z. Lo pasamos a +Y y orientamos.
  g.rotateX(Math.PI / 2);
  return orientar(g, p, eje);
}

/** Hélice (muelle): radio R, `espiras` vueltas entre a y b. */
export class Helice extends THREE.Curve<THREE.Vector3> {
  a: THREE.Vector3; b: THREE.Vector3; R: number; espiras: number;
  constructor(a: THREE.Vector3, b: THREE.Vector3, R: number, espiras: number) {
    super();
    this.a = a; this.b = b; this.R = R; this.espiras = espiras;
  }
  override getPoint(u: number, out = new THREE.Vector3()): THREE.Vector3 {
    const eje = this.b.clone().sub(this.a);
    const L = eje.length();
    eje.normalize();
    const ref = Math.abs(eje.x) < 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
    const n = new THREE.Vector3().crossVectors(eje, ref).normalize();
    const bn = new THREE.Vector3().crossVectors(eje, n);
    const a = u * this.espiras * Math.PI * 2;
    return out.copy(this.a).addScaledVector(eje, u * L)
      .addScaledVector(n, Math.cos(a) * this.R).addScaledVector(bn, Math.sin(a) * this.R);
  }
}

/** Curva muestreada fina (para catenarias y hélices): la tratamos como curva, no como recta. */
export function curvaPuntos(pts: THREE.Vector3[]): THREE.CurvePath<THREE.Vector3> {
  const c = new THREE.CurvePath<THREE.Vector3>();
  c.add(new THREE.CatmullRomCurve3(pts, false, 'centripetal'));
  return c;
}

/** Catenaria aproximada entre a y b con flecha `f` hacia abajo (latiguillos y cables). */
export function catenaria(a: THREE.Vector3, b: THREE.Vector3, f: number, n = 12, empuje?: THREE.Vector3): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const p = a.clone().lerp(b, u);
    const s = 4 * u * (1 - u);
    p.y -= f * Math.pow(s, 0.9);
    if (empuje) p.addScaledVector(empuje, s);
    out.push(p);
  }
  return out;
}

// ————————————————————————————————————————————— superficies paramétricas

/**
 * Superficie paramétrica en rejilla (loft): f(u, v) con u alrededor (0..1)
 * y v a lo largo. Las normales salen de diferencias centrales; en los polos
 * (anillos que se cierran en un punto) se evalúan un poco dentro para que no
 * degeneren. La orientación de las caras se ajusta a las normales hacia fuera.
 */
export function superficie(f: (u: number, v: number, out: THREE.Vector3) => void, nu: number, nv: number,
  o: { cerradaU?: boolean; uvEscala?: [number, number] } = {}): THREE.BufferGeometry {
  const pos: number[] = [], nor: number[] = [], uv: number[] = [];
  const P = new THREE.Vector3(), A = new THREE.Vector3(), B = new THREE.Vector3(), du = new THREE.Vector3(), dv = new THREE.Vector3();
  const e = 1e-3;
  const [su, sv] = o.uvEscala ?? [1, 1];
  const centro = new THREE.Vector3();
  const pts: THREE.Vector3[] = [];
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const u = i / nu, v = j / nv;
      f(u, v, P);
      pts.push(P.clone());
      centro.add(P);
    }
  }
  centro.multiplyScalar(1 / pts.length);
  let signo = 0;
  const normales: THREE.Vector3[] = [];
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const u = i / nu;
      const vv = Math.min(1 - 2 * e, Math.max(2 * e, j / nv));
      f(u + e, vv, A); f(u - e, vv, B); du.subVectors(A, B);
      f(u, vv + e, A); f(u, vv - e, B); dv.subVectors(A, B);
      const n = new THREE.Vector3().crossVectors(du, dv).normalize();
      normales.push(n);
      const p = pts[j * (nu + 1) + i];
      signo += Math.sign(n.dot(p.clone().sub(centro)));
    }
  }
  const s = signo >= 0 ? 1 : -1;
  for (let k = 0; k < pts.length; k++) {
    const p = pts[k], n = normales[k].multiplyScalar(s);
    pos.push(p.x, p.y, p.z);
    nor.push(n.x, n.y, n.z);
    const i = k % (nu + 1), j = Math.floor(k / (nu + 1));
    uv.push((i / nu) * su, (j / nv) * sv);
  }
  const idx: number[] = [];
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 2, d = a + nu + 1;
      if (s > 0) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/** Superelipse |z/a|^n + |y/b|^n = 1, parametrizada por ángulo. */
export function superelipse(ang: number, n: number): [number, number] {
  const c = Math.cos(ang), s = Math.sin(ang);
  return [Math.sign(c) * Math.pow(Math.abs(c), 2 / n), Math.sign(s) * Math.pow(Math.abs(s), 2 / n)];
}

// ————————————————————————————————————————————— lote

/** Une geometrías sueltas en una sola (sin índice), conservando position/normal/uv. */
export function unir(gs: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const planas = gs.map((g) => {
    const p = g.index ? g.toNonIndexed() : g;
    if (!p.getAttribute('uv')) p.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(p.getAttribute('position').count * 2), 2));
    return p;
  });
  let total = 0;
  for (const g of planas) total += g.getAttribute('position').count;
  const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), uv = new Float32Array(total * 2);
  let o = 0;
  for (const g of planas) {
    const p = g.getAttribute('position') as THREE.BufferAttribute;
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    const n = g.getAttribute('normal') as THREE.BufferAttribute;
    const t = g.getAttribute('uv') as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      pos[(o + i) * 3] = p.getX(i); pos[(o + i) * 3 + 1] = p.getY(i); pos[(o + i) * 3 + 2] = p.getZ(i);
      nor[(o + i) * 3] = n.getX(i); nor[(o + i) * 3 + 1] = n.getY(i); nor[(o + i) * 3 + 2] = n.getZ(i);
      uv[(o + i) * 2] = t.getX(i); uv[(o + i) * 2 + 1] = t.getY(i);
    }
    o += p.count;
  }
  for (const g of gs) g.dispose();
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return out;
}

export interface Parte { geo: THREE.BufferGeometry; rol: Rol; grupo: Grupo; pieza: PiezaId }
export interface Instancias { nombre: string; geo: THREE.BufferGeometry; rol: Rol; grupo: Grupo; pieza: PiezaId; matrices: THREE.Matrix4[] }

/** Donde cada constructor de pieza deja lo que ha hecho. crearMoto lo fusiona por grupo y material. */
export class Lote {
  partes: Parte[] = [];
  inst: Instancias[] = [];
  add(grupo: Grupo, pieza: PiezaId, rol: Rol, ...geos: THREE.BufferGeometry[]): void {
    for (const geo of geos) this.partes.push({ geo, rol, grupo, pieza });
  }
  instancias(nombre: string, grupo: Grupo, pieza: PiezaId, rol: Rol, geo: THREE.BufferGeometry, matrices: THREE.Matrix4[]): void {
    this.inst.push({ nombre, geo, rol, grupo, pieza, matrices });
  }
}

export type Constructor = (q: Calidad, l: Lote) => void;

/** Normales planas (tuercas hexagonales y piezas de caras): sin índice, una normal por cara. */
export function facetar(g: THREE.BufferGeometry): THREE.BufferGeometry {
  const n = g.index ? g.toNonIndexed() : g;
  if (n !== g) g.dispose();
  n.deleteAttribute('normal');
  n.computeVertexNormals();
  return n;
}

/** Polígono cerrado con todas las esquinas redondeadas (empieza y acaba a mitad de una arista). */
export function poligonoRedondo(esquinas: readonly (readonly [number, number, number])[], pasos = 4): THREE.Shape {
  const u = esquinas[esquinas.length - 1], v0 = esquinas[0];
  const medio = [(u[0] + v0[0]) / 2, (u[1] + v0[1]) / 2, 0] as const;
  const pts = redondear([medio, ...esquinas, medio], pasos);
  pts.pop();
  return new THREE.Shape(pts);
}
