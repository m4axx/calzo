// Coordenadas reales (centro urbano o puerto deportivo, grados decimales WGS84)
// de Madrid y de los 25 destinos de tarifas.js. Solo las usa la rosa de rutas
// en el build (lib/rosa.js): el rumbo del rayo es el geográfico real y su
// longitud, los km por carretera de tarifas.js (no la distancia en línea recta).

/** @type {Readonly<Record<string, { lat: number, lon: number }>>} */
export const COORD = {
  madrid:       { lat: 40.4168, lon: -3.7038 },
  barcelona:    { lat: 41.3874, lon: 2.1686 },
  valencia:     { lat: 39.4699, lon: -0.3763 },
  sevilla:      { lat: 37.3891, lon: -5.9845 },
  malaga:       { lat: 36.7213, lon: -4.4214 },
  alicante:     { lat: 38.3452, lon: -0.4810 },
  murcia:       { lat: 37.9922, lon: -1.1307 },
  bilbao:       { lat: 43.2630, lon: -2.9350 },
  zaragoza:     { lat: 41.6488, lon: -0.8891 },
  vigo:         { lat: 42.2406, lon: -8.7207 },
  coruna:       { lat: 43.3623, lon: -8.4115 },
  santander:    { lat: 43.4623, lon: -3.8099 },
  oviedo:       { lat: 43.3614, lon: -5.8593 },
  granada:      { lat: 37.1773, lon: -3.5986 },
  cordoba:      { lat: 37.8882, lon: -4.7794 },
  almeria:      { lat: 36.8340, lon: -2.4637 },
  cadiz:        { lat: 36.5271, lon: -6.2886 },
  valladolid:   { lat: 41.6523, lon: -4.7245 },
  pamplona:     { lat: 42.8125, lon: -1.6458 },
  sansebastian: { lat: 43.3183, lon: -1.9812 },
  denia:        { lat: 38.8408, lon: 0.1057 },
  javea:        { lat: 38.7896, lon: 0.1661 },
  marbella:     { lat: 36.5101, lon: -4.8825 },
  sotogrande:   { lat: 36.2870, lon: -5.2800 },
  empuriabrava: { lat: 42.2466, lon: 3.1206 },
  palma:        { lat: 39.5696, lon: 2.6502 },
};

const RAD = Math.PI / 180;
const R_TIERRA = 6371;

/**
 * Rumbo inicial (ortodrómico) de a hacia b, en grados desde el norte y en
 * sentido horario: 0 = N, 90 = E.
 * @param {{ lat: number, lon: number }} a
 * @param {{ lat: number, lon: number }} b
 */
export function rumbo(a, b) {
  const f1 = a.lat * RAD;
  const f2 = b.lat * RAD;
  const dl = (b.lon - a.lon) * RAD;
  const y = Math.sin(dl) * Math.cos(f2);
  const x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
  return (Math.atan2(y, x) / RAD + 360) % 360;
}

/**
 * Distancia ortodrómica en km (haversine). Solo sirve de control: la rosa
 * dibuja los km por carretera.
 * @param {{ lat: number, lon: number }} a
 * @param {{ lat: number, lon: number }} b
 */
export function distanciaKm(a, b) {
  const df = (b.lat - a.lat) * RAD;
  const dl = (b.lon - a.lon) * RAD;
  const h = Math.sin(df / 2) ** 2 + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dl / 2) ** 2;
  return 2 * R_TIERRA * Math.asin(Math.min(1, Math.sqrt(h)));
}
