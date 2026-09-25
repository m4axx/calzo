// Herramienta de QA (§9.2): abre la página en Chromium sin cabeza, con WebGL
// por SwiftShader, evalúa JS y, si se pide, guarda una captura.
//
//   node scripts/navegador.mjs --url "http://localhost:4321/?still=amarre:0.5" \
//        [--w 1440 --h 900] [--esperar 4000] [--eval "expr JS"] [--captura ruta.png] [--movil]
//
// Requiere un servidor ya levantado (npm run preview -- --port 4321, o npm run dev).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const flag = (k) => args.includes(`--${k}`);

const url = opt('url', 'http://localhost:4321/');
const movil = flag('movil');
const w = Number(opt('w', movil ? 390 : 1440));
const h = Number(opt('h', movil ? 844 : 900));
const esperar = Number(opt('esperar', 4000));
const expr = opt('eval', null);
const captura = opt('captura', null);

const navegador = await playwright.chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'],
});
const ctx = await navegador.newContext({
  viewport: { width: w, height: h },
  deviceScaleFactor: 1,
  hasTouch: movil,
  isMobile: movil,
});
const pagina = await ctx.newPage();
const consola = [];
pagina.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') consola.push(`[${m.type()}] ${m.text()}`); });
pagina.on('pageerror', (e) => consola.push(`[pageerror] ${e.message}`));
await pagina.goto(url, { waitUntil: 'load' });
await pagina.waitForTimeout(esperar);
if (expr) {
  const r = await pagina.evaluate(`(async () => { return (${expr}); })()`);
  console.log(typeof r === 'string' ? r : JSON.stringify(r, null, 2));
}
if (captura) {
  await pagina.screenshot({ path: captura });
  console.log(`captura: ${captura}`);
}
if (consola.length) console.log('--- consola ---\n' + consola.join('\n'));
await navegador.close();
