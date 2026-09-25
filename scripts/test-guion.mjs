// Pruebas del guion (§9.1). Node sin compilar: importa los .ts directamente.
import assert from 'node:assert/strict';
import { easeCalzo, muelleCritico } from '../src/guion/util.ts';
import { pieza, mezclaPieza } from '../src/guion/pieza.ts';
import { amarre, cincha, opacidadTexto } from '../src/guion/amarre.ts';
import { traspaso, tension, esquinaDe, destinos, trazoCincha, verticesDe, ladosDestino } from '../src/guion/traspaso.ts';
import { cierre, desatado } from '../src/guion/cierre.ts';

let n = 0;
const caso = (nombre, fn) => {
  try { fn(); n++; } catch (e) { console.error(`✗ ${nombre}`); throw e; }
};
const cerca = (a, b, tol = 1e-3) => assert.ok(Math.abs(a - b) <= tol, `${a} ≉ ${b}`);

caso('easeCalzo', () => {
  cerca(easeCalzo(0.5), 0.7631);
  cerca(easeCalzo(0.4025), 0.5);
  assert.equal(easeCalzo(0), 0);
  assert.equal(easeCalzo(1), 1);
});

caso('clac', () => {
  assert.equal(amarre(0.20).clac, true);
  assert.equal(amarre(0.199).clac, false);
});

caso('cincha', () => {
  assert.equal(cincha(0.4).pasos, 0);
  assert.equal(cincha(0.45).pasos, 1);
  assert.equal(cincha(0.95).pasos, 6);
  assert.equal(cincha(1).T, 1);
});

caso('plataforma y calzo', () => {
  assert.equal(amarre(0.06).plataformaY, 0.35);
  assert.equal(amarre(0).plataformaY, 0);
  assert.equal(amarre(0.119).calzoVisible, false);
  assert.equal(amarre(0.12).calzoVisible, true);
});

caso('cinchas pareadas', () => {
  assert.equal(amarre(0.34).cinchas[0].pasos, amarre(0.34).cinchas[1].pasos);
  assert.equal(amarre(0.41).cinchas[0].T, 1);
  assert.equal(amarre(0.5, { compacto: true }).cinchas[2].T, 1);
});

caso('foco', () => {
  assert.equal(amarre(0.10).foco, 'rueda_del');
  assert.equal(amarre(0.23).foco, 'tija');
  assert.equal(amarre(0.56).foco, 'horquilla');
  assert.equal(amarre(0.45).foco, null);
});

caso('grúa y canvas', () => {
  assert.equal(amarre(0.899).camaraExacta, true);
  cerca(amarre(0.95).opacidadCanvas, 0.526);
});

caso('traspaso', () => {
  assert.equal(traspaso(0.8), 1);
  assert.equal(traspaso(0), 0);
  cerca(tension(0.5), 0.7);
});

caso('esquinaDe', () => {
  assert.equal(esquinaDe([10, 10], [50, 50]), 'ti');
  assert.equal(esquinaDe([90, 90], [50, 50]), 'bd');
});

caso('continuidad del traspaso', () => {
  const dest = destinos({ left: 300, top: 200, right: 1100, bottom: 700 }, 80, 60, 10);
  const c = {
    esquina: 'ti', a: [120, 90], b: [520, 380],
    ladoA: [[117, 94], [123, 86]], ladoB: [[517, 384], [523, 376]],
  };
  const t0 = trazoCincha(c, dest.ti, 0);
  const v = verticesDe(t0.d);
  assert.deepEqual(v, [c.ladoA[0], c.ladoB[0], c.ladoB[1], c.ladoA[1]]);
  assert.equal(t0.textura, 0);
  assert.equal(t0.opacidadCarraca, 0);
  assert.equal(trazoCincha(c, dest.ti, 1).d, trazoCincha(null, dest.ti, 1).d);
  // Con h intermedio hay comba hacia abajo.
  const t5 = trazoCincha(c, dest.ti, 0.5);
  const q = t5.d.match(/Q(\S+) (\S+)/);
  assert.ok(q);
  // Los bordes del destino respetan el ancho.
  const l = ladosDestino(dest.bd);
  cerca(Math.hypot(l.ladoA[0][0] - l.ladoA[1][0], l.ladoA[0][1] - l.ladoA[1][1]), 10, 1e-9);
  // El asiento desplaza el extremo del panel.
  const sin = verticesDe(trazoCincha(null, dest.ti, 1).d);
  const con = verticesDe(trazoCincha(null, dest.ti, 1, { arriba: 3, abajo: 3.5 }).d);
  cerca(con[1][1] - sin[1][1], 3, 0.011);
  cerca(con[0][1] - sin[0][1], 0, 1e-9);
  const conB = verticesDe(trazoCincha(null, dest.bd, 1, { arriba: 3, abajo: 3.5 }).d);
  const sinB = verticesDe(trazoCincha(null, dest.bd, 1).d);
  cerca(conB[1][1] - sinB[1][1], 3.5, 0.011);
});

caso('mezclaPieza', () => {
  for (const t of [0, 0.8, 1.6, 5]) {
    assert.equal(mezclaPieza(t, 0.05).clave, pieza(0.05).clave);
  }
  assert.equal(mezclaPieza(0.5, 0.06).barridoI, 0);
});

caso('desatado', () => {
  assert.equal(desatado(0).T, 1);
  assert.equal(desatado(1.4).reveal, 0);
  assert.equal(desatado(1.4).plataformaY, 0);
  assert.equal(cierre(0.29).atado, true);
  assert.equal(cierre(0.30).atado, false);
});

caso('reversibilidad', () => {
  const ps = [];
  for (let i = 0; i <= 400; i++) ps.push(i / 400);
  const ida = ps.map((p) => JSON.stringify(amarre(p)));
  const vuelta = [...ps].reverse().map((p) => JSON.stringify(amarre(p))).reverse();
  assert.deepEqual(ida, vuelta);
});

caso('fases de texto', () => {
  assert.equal(opacidadTexto(0, 'titulo'), 1);
  assert.equal(opacidadTexto(0.13, 'rueda'), 1);
  assert.equal(opacidadTexto(0.13, 'tija'), 0);
  assert.ok(opacidadTexto(0.2, 'tija') > 0 && opacidadTexto(0.2, 'tija') < 1);
});

caso('muelle', () => {
  let x = 0, v = 0;
  for (let i = 0; i < 60; i++) [x, v] = muelleCritico(x, v, 1, 33, 1 / 60);
  cerca(x, 1, 1e-4);
  [x, v] = muelleCritico(0, 0, 1, 33, 0.05);
  assert.ok(x > 0 && x < 1.0001);
});

console.log(`test-guion: ${n} casos en verde`);
