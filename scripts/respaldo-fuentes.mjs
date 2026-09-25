// Genera src/styles/respaldos.css (§3.2): una @font-face de respaldo por
// fuente local, con size-adjust y overrides medidos, para que el cambio de
// fuente no mueva la maquetación (CLS ≤ 0,02).
import { writeFileSync } from 'node:fs';
import { fromFile } from '@capsizecss/unpack/fs';
import arial from '@capsizecss/metrics/arial';
import roboto from '@capsizecss/metrics/roboto';
import robotoMono from '@capsizecss/metrics/robotoMono';
import georgia from '@capsizecss/metrics/georgia';
import notoSerif from '@capsizecss/metrics/notoSerif';
import timesNewRoman from '@capsizecss/metrics/timesNewRoman';

// Sin métricas en @capsizecss/metrics: valores de las tablas hhea/OS2 de cada fuente de sistema.
const arialNarrow = { familyName: 'Arial Narrow', unitsPerEm: 2048, ascent: 1854, descent: -434, lineGap: 67, xWidthAvg: 748 };
const consolas = { familyName: 'Consolas', unitsPerEm: 2048, ascent: 1521, descent: -527, lineGap: 0, xWidthAvg: 1126 };
const menlo = { familyName: 'Menlo', unitsPerEm: 2048, ascent: 1901, descent: -483, lineGap: 0, xWidthAvg: 1233 };

const base = 'node_modules/@fontsource-variable';
const fuentes = [
  {
    archivo: `${base}/big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2`,
    respaldos: [['BSD Narrow', 'Arial Narrow', arialNarrow], ['BSD Roboto', 'Roboto', roboto], ['BSD Arial', 'Arial', arial]],
  },
  {
    archivo: `${base}/newsreader/files/newsreader-latin-wght-normal.woff2`,
    respaldos: [['NR Georgia', 'Georgia', georgia], ['NR Noto', 'Noto Serif', notoSerif], ['NR Times', 'Times New Roman', timesNewRoman]],
  },
  {
    archivo: `${base}/overpass-mono/files/overpass-mono-latin-wght-normal.woff2`,
    respaldos: [['OM Consolas', 'Consolas', consolas], ['OM Menlo', 'Menlo', menlo], ['OM Roboto', 'Roboto Mono', robotoMono]],
  },
];

const pct = (n) => `${(n * 100).toFixed(4).replace(/\.?0+$/, '')}%`;
let css = '/* Generado por scripts/respaldo-fuentes.mjs — no editar a mano. */\n';
for (const f of fuentes) {
  const m = await fromFile(f.archivo);
  const anchoWeb = m.xWidthAvg / m.unitsPerEm;
  for (const [nombre, local, r] of f.respaldos) {
    const sizeAdjust = anchoWeb / (r.xWidthAvg / r.unitsPerEm);
    css += `@font-face {
  font-family: '${nombre}';
  src: local('${local}');
  size-adjust: ${pct(sizeAdjust)};
  ascent-override: ${pct(m.ascent / m.unitsPerEm / sizeAdjust)};
  descent-override: ${pct(Math.abs(m.descent) / m.unitsPerEm / sizeAdjust)};
  line-gap-override: ${pct(m.lineGap / m.unitsPerEm / sizeAdjust)};
}
`;
  }
}
writeFileSync('src/styles/respaldos.css', css);
console.log('respaldos.css generado');
