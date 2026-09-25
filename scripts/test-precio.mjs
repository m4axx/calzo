// Pruebas del cálculo (§9.1). Node puro, sin compilar.
import assert from 'node:assert/strict';
import {
  calcularPrecio, formatoEuros, formatoDuracion, tablaPrecios, mensajeWhatsApp, urlWhatsApp,
} from '../src/lib/precio.js';

const NB = ' ';
let n = 0;
const caso = (nombre, fn) => { fn(); n++; };

const casos = [
  [{ carga: 'moto', destino: 'valencia' }, 205],
  [{ carga: 'moto', destino: 'malaga' }, 280],
  [{ carga: 'moto', destino: 'valladolid' }, 135],
  [{ carga: 'moto', destino: 'palma' }, 525],
  [{ carga: 'moto', destino: 'valencia', vuelta: true }, 335],
  [{ carga: 'moto', destino: 'palma', vuelta: true }, 655],
  [{ carga: 'moto', destino: 'empuriabrava' }, 370],
  [{ carga: 'quad', destino: 'barcelona' }, 380],
  [{ carga: 'barco', destino: 'denia', eslora: 6.4, manga: false }, 545],
  [{ carga: 'barco', destino: 'denia', eslora: 8, manga: true }, 805],
  [{ carga: 'coche', destino: 'sevilla' }, 375],
  [{ carga: 'barco', destino: 'empuriabrava', eslora: 12, manga: true, vuelta: true }, 2355],
];
for (const [entrada, total] of casos) {
  caso(JSON.stringify(entrada), () => {
    const r = calcularPrecio(entrada);
    assert.equal(r.total, total, JSON.stringify(entrada));
    assert.equal(r.totalTxt, formatoEuros(total));
  });
}

caso('duraciones', () => {
  assert.equal(formatoDuracion(195), `2${NB}h 35${NB}min`);
  assert.equal(formatoDuracion(355), `4${NB}h 45${NB}min`);
  assert.equal(formatoDuracion(530), `7${NB}h 05${NB}min`);
  assert.equal(formatoDuracion(620), `8${NB}h 15${NB}min`);
  assert.equal(formatoDuracion(750), `10${NB}h 00${NB}min`);
});

caso('formato de euros', () => {
  assert.equal(formatoEuros(2355), `2.355${NB}€`);
  assert.equal(formatoEuros(205), `205${NB}€`);
  assert.equal(calcularPrecio({ carga: 'barco', destino: 'empuriabrava', eslora: 12, manga: true, vuelta: true }).totalTxt, `2.355${NB}€`);
});

caso('tabla', () => {
  assert.equal(tablaPrecios().length, 25);
});

caso('whatsapp', () => {
  const r = calcularPrecio({ carga: 'moto', destino: 'valencia', vuelta: false });
  assert.equal(
    mensajeWhatsApp(r),
    `Hola. Quiero transportar una moto de Madrid a Valencia, solo ida. La web me da 205${NB}€ orientativos. ¿Qué fecha tenéis?`,
  );
  assert.ok(urlWhatsApp(r).includes('205%C2%A0%E2%82%AC'));
  const b = calcularPrecio({ carga: 'barco', destino: 'denia', eslora: 8, manga: true });
  assert.ok(urlWhatsApp(b).includes('manga%20de%20m%C3%A1s%20de%202%2C55%20m'));
});

caso('desglose', () => {
  const r = calcularPrecio({ carga: 'moto', destino: 'valencia' });
  const t = r.lineas.map((l) => l.txt);
  assert.deepEqual(t, [
    `Salida: 55${NB}€`,
    `355${NB}km × 0,42${NB}€/km = 149,10${NB}€`,
    `Redondeado a 5${NB}€`,
  ]);
  const b = calcularPrecio({ carga: 'barco', destino: 'palma', eslora: 6.4, manga: true, vuelta: true });
  const ids = b.lineas.map((l) => l.id);
  assert.deepEqual(ids, ['base', 'km', 'eslora', 'manga', 'vuelta', 'ferry', 'redondeo']);
  assert.equal(b.lineas[2].txt, `Eslora 6,4${NB}m: +2,4${NB}% (6${NB}% por metro sobre 6${NB}m)`);
  const m = calcularPrecio({ carga: 'moto', destino: 'valladolid' });
  assert.equal(m.lineas.find((l) => l.id === 'minimo'), undefined);
});

caso('sin glifos fuera del subconjunto', () => {
  const todo = [];
  for (const c of ['moto', 'quad', 'barco', 'coche']) {
    for (const f of tablaPrecios()) {
      const r = calcularPrecio({ carga: c, destino: f.id, vuelta: true, eslora: 9, manga: true });
      todo.push(r.totalTxt, r.kmTxt, r.duracionTxt, r.ruta, r.resumen, r.articulo, mensajeWhatsApp(r), ...r.lineas.map((l) => l.txt));
    }
  }
  for (const s of todo) {
    assert.ok(!/[≈→▾]/.test(s), s);
  }
});

console.log(`test-precio: ${n} casos en verde`);
