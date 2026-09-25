// Itálica del cierre (§3.2): instancia opsz 72 · wght 300 de Newsreader,
// solo con los glifos de «Se baja igual.». Se versiona el resultado.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import subsetFont from 'subset-font';

const origen = readFileSync('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2');
const salida = await subsetFont(origen, 'Se baja igual.', {
  targetFormat: 'woff2',
  variationAxes: { opsz: 72, wght: 300 },
});
mkdirSync('public/fuentes', { recursive: true });
writeFileSync('public/fuentes/newsreader-cierre.woff2', salida);
console.log(`newsreader-cierre.woff2: ${(salida.length / 1024).toFixed(1)} KB`);
