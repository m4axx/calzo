// Tarifas y distancias — PLACEHOLDER de presentación.
// Los importes son orientativos y los pone el transportista antes de publicar.
// Las distancias sí son reales (km por autovía desde Madrid).

export const ORIGEN = 'Madrid';

export const DESTINOS = [
  { id: 'barcelona',    nombre: 'Barcelona',          km: 620 },
  { id: 'valencia',     nombre: 'Valencia',           km: 355 },
  { id: 'sevilla',      nombre: 'Sevilla',            km: 530 },
  { id: 'malaga',       nombre: 'Málaga',             km: 530 },
  { id: 'alicante',     nombre: 'Alicante',           km: 420 },
  { id: 'murcia',       nombre: 'Murcia',             km: 400 },
  { id: 'bilbao',       nombre: 'Bilbao',             km: 400 },
  { id: 'zaragoza',     nombre: 'Zaragoza',           km: 315 },
  { id: 'vigo',         nombre: 'Vigo',               km: 600 },
  { id: 'coruna',       nombre: 'A Coruña',           km: 595 },
  { id: 'santander',    nombre: 'Santander',          km: 435 },
  { id: 'oviedo',       nombre: 'Oviedo',             km: 450 },
  { id: 'granada',      nombre: 'Granada',            km: 420 },
  { id: 'cordoba',      nombre: 'Córdoba',            km: 400 },
  { id: 'almeria',      nombre: 'Almería',            km: 550 },
  { id: 'cadiz',        nombre: 'Cádiz',              km: 655 },
  { id: 'valladolid',   nombre: 'Valladolid',         km: 195 },
  { id: 'pamplona',     nombre: 'Pamplona',           km: 405 },
  { id: 'sansebastian', nombre: 'San Sebastián',      km: 455 },
  { id: 'denia',        nombre: 'Dénia',              km: 460, nautico: true },
  { id: 'javea',        nombre: 'Jávea',              km: 470, nautico: true },
  { id: 'marbella',     nombre: 'Marbella',           km: 590, nautico: true },
  { id: 'sotogrande',   nombre: 'Sotogrande',         km: 655, nautico: true },
  { id: 'empuriabrava', nombre: 'Empuriabrava',       km: 750, nautico: true },
  { id: 'palma',        nombre: 'Palma de Mallorca',  km: 355, nautico: true, maritimo: true },
];

export const CARGAS = [
  { id: 'moto',  nombre: 'Moto',     base: 55,  km: 0.42, min: 130 },
  { id: 'quad',  nombre: 'Quad/UTV', base: 70,  km: 0.50, min: 160 },
  { id: 'barco', nombre: 'Barco',    base: 140, km: 0.85, min: 290 },
  { id: 'coche', nombre: 'Coche',    base: 85,  km: 0.55, min: 190 },
];

// Por encima de 2,55 m de ancho hace falta autorización complementaria de
// circulación. Eso cuesta dinero y tiempo, y el precio lo tiene que reflejar.
export const MANGA_LIMITE = 2.55;
export const RECARGO_ESPECIAL = 0.35;
export const RECARGO_MARITIMO = 320;   // ferry, tramo Valencia/Barcelona - Palma
export const FACTOR_IDA_VUELTA = 1.65; // la vuelta no cuesta otra ida
export const VELOCIDAD_MEDIA = 75;     // km/h de conjunto cargado, con paradas

// Eslora (barcos). PLACEHOLDER, como el resto de importes.
export const ESLORA_REF = 6;
export const RECARGO_ESLORA_M = 0.06;
export const ESLORA_MIN = 4;
export const ESLORA_MAX = 12;
export const ESLORA_PASO = 0.2;
export const ESLORA_DEFECTO = 6.4;

export const REDONDEO = 5;
export const DESTINO_DEFECTO = 'valencia';
export const CARGA_DEFECTO = 'moto';
export const PROVISIONAL = true;
