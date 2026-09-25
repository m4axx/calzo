// Presupuesto de peso (§7.6): tamaños gzip -9 de dist/ y comprobación de que
// el bundle inicial no contiene three. Falla (código 1) si algo se pasa.
//
//   node scripts/presupuesto.mjs [dist]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = resolve(process.argv[2] ?? 'dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`presupuesto: no existe ${dist}/index.html (¿falta el build?)`);
  process.exit(1);
}

const KB = 1024;
const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const leer = (p) => readFileSync(p);
const kb = (n) => (n / KB).toFixed(1).padStart(7) + ' KB';

function todos(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...todos(p)); else out.push(p);
  }
  return out;
}

const html = leer(join(dist, 'index.html')).toString();
const archivos = todos(dist);
const jsTodos = archivos.filter((p) => p.endsWith('.js'));

// — grafo de módulos: imports estáticos y dinámicos de cada chunk —
const RX_ESTATICO = /(?:^|[;\n}])\s*import\s*(?:[\w*{}\s,$]+from\s*)?["']([^"']+\.js)["']/g;
const RX_EXPORT_FROM = /export\s*[\w*{}\s,$]*from\s*["']([^"']+\.js)["']/g;
const RX_DINAMICO = /import\(\s*["']([^"']+\.js)["']\s*\)/g;
function deps(archivo) {
  const src = leer(archivo).toString();
  const base = dirname(archivo);
  const res = (e) => resolve(base, e);
  const est = new Set(), din = new Set();
  for (const rx of [RX_ESTATICO, RX_EXPORT_FROM]) for (const m of src.matchAll(rx)) est.add(res(m[1]));
  for (const m of src.matchAll(RX_DINAMICO)) din.add(res(m[1]));
  // Vite también emite `__vite__mapDeps([...])` con rutas de los chunks dinámicos.
  for (const m of src.matchAll(/"(\.?\.?\/?_astro\/[^"]+\.js|\.\/[^"]+\.js)"/g)) {
    const p = m[1].startsWith('_astro') || m[1].startsWith('/_astro') ? join(dist, m[1].replace(/^\//, '')) : res(m[1]);
    if (!est.has(p)) din.add(p);
  }
  return { est: [...est].filter(existsSync), din: [...din].filter(existsSync) };
}
function cierreEstatico(raices) {
  const vistos = new Set();
  const pila = [...raices];
  while (pila.length) {
    const a = pila.pop();
    if (vistos.has(a)) continue;
    vistos.add(a);
    pila.push(...deps(a).est);
  }
  return vistos;
}

// Entradas: los <script type="module" src> del HTML (y los inline que importan chunks).
const entradas = new Set();
for (const m of html.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)) entradas.add(join(dist, m[1].replace(/^\//, '')));
for (const m of html.matchAll(/<script[^>]*type="module"[^>]*>([\s\S]*?)<\/script>/g)) {
  for (const i of m[1].matchAll(/["'](\/_astro\/[^"']+\.js)["']/g)) entradas.add(join(dist, i[1].slice(1)));
}
const inicial = cierreEstatico([...entradas].filter(existsSync));

// Chunk 3D: el que contiene el renderer de three, más sus dependencias estáticas que no estén en el inicial.
const TIENE_THREE = (src) => src.includes('WebGLRenderer') || /\bREVISION\b/.test(src);
const conThree = jsTodos.filter((p) => TIENE_THREE(leer(p).toString()));
const tres = new Set();
for (const p of cierreEstatico(conThree)) if (!inicial.has(p)) tres.add(p);
// Si el chunk 3D reexporta desde otro chunk dinámico (p. ej., qa), no cuenta aquí.
const qa = jsTodos.filter((p) => /qa\./.test(p) && !inicial.has(p) && !tres.has(p));

const suma = (set) => [...set].reduce((s, p) => s + gz(leer(p)), 0);
const gzInicial = suma(inicial);
const gz3D = suma(tres);

const css = archivos.filter((p) => p.endsWith('.css'));
const gzHtmlCss = gz(Buffer.from(html)) + css.reduce((s, p) => s + gz(leer(p)), 0);
// Fuentes iniciales: solo el subconjunto latin de las 3 familias (unicode-range: el resto no se descarga).
const fuentes = archivos.filter((p) => /-latin-wght-normal(\.[\w-]+)?\.woff2$/.test(p));
const bFuentes = fuentes.reduce((s, p) => s + statSync(p).size, 0);
const cierreFuente = archivos.find((p) => p.endsWith('newsreader-cierre.woff2'));
const bCierre = cierreFuente ? statSync(cierreFuente).size : 0;
const imagenes = archivos.filter((p) => /\.(png|jpe?g|webp|avif|gif)$/i.test(p));

const primera = gzHtmlCss + gzInicial + gz3D + bFuentes;

const filas = [
  ['HTML + CSS (gzip)', gzHtmlCss, 60 * KB],
  ['JS inicial (gzip)', gzInicial, 80 * KB],
  ['Chunk 3D (gzip)', gz3D, 200 * KB],
  ['Fuentes iniciales (latin)', bFuentes, 116 * KB],
  ['Itálica del cierre', bCierre, 3 * KB],
  ['Primera visita completa', primera, 460 * KB],
];

let ok = true;
console.log(`presupuesto de ${relative(process.cwd(), dist) || dist}`);
for (const [n, v, lim] of filas) {
  const pasa = v <= lim;
  if (!pasa) ok = false;
  console.log(`  ${pasa ? 'ok ' : 'MAL'}  ${n.padEnd(28)} ${kb(v)}  (límite ${kb(lim).trim()})`);
}
console.log('  JS inicial:');
for (const p of inicial) console.log(`         ${relative(dist, p).padEnd(60)} ${kb(gz(leer(p)))}`);
console.log('  Chunk 3D:');
for (const p of tres) console.log(`         ${relative(dist, p).padEnd(60)} ${kb(gz(leer(p)))}`);
if (qa.length) console.log(`  (fuera del presupuesto: ${qa.map((p) => relative(dist, p)).join(', ')})`);

const threeEnInicial = [...inicial].filter((p) => TIENE_THREE(leer(p).toString()));
if (threeEnInicial.length) {
  ok = false;
  console.log(`  MAL  el bundle inicial contiene three: ${threeEnInicial.map((p) => relative(dist, p)).join(', ')}`);
} else {
  console.log('  ok   el bundle inicial no contiene three');
}
if (!conThree.length) { ok = false; console.log('  MAL  no se encuentra el chunk 3D'); }
if (imagenes.length) { ok = false; console.log(`  MAL  imágenes descargadas: ${imagenes.map((p) => relative(dist, p)).join(', ')}`); }

process.exit(ok ? 0 : 1);
