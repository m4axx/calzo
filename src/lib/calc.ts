// Store del cálculo (§5.4, §6). Sincroniza todos los mandos de la página
// (frase del héroe, panel, chip, barra móvil, CTA) con un único resultado.
import { calcularPrecio, urlWhatsApp, type EntradaPrecio, type ResultadoPrecio } from './precio.js';
import { DESTINOS, CARGAS, ESLORA_MIN, ESLORA_MAX } from '../data/tarifas.js';
import { estado, emit } from './estado.ts';

type Origen = 'heroe' | 'panel' | 'rutas' | 'cargas' | 'url';
let entrada: EntradaPrecio = { carga: 'moto', destino: 'valencia', vuelta: false };
let resultado: ResultadoPrecio;
const CLAVE = 'calzo:calc';

function leerGuardado(): Partial<EntradaPrecio> {
  try {
    const s = localStorage.getItem(CLAVE);
    return s ? JSON.parse(s) as Partial<EntradaPrecio> : {};
  } catch { return {}; }
}

function guardar(): void {
  try { localStorage.setItem(CLAVE, JSON.stringify(entrada)); } catch { /* sin storage */ }
}

function validar(p: Partial<EntradaPrecio>): Partial<EntradaPrecio> {
  const out: Partial<EntradaPrecio> = {};
  if (p.carga && CARGAS.some((c) => c.id === p.carga)) out.carga = p.carga;
  if (p.destino && DESTINOS.some((d) => d.id === p.destino)) out.destino = p.destino;
  if (typeof p.vuelta === 'boolean') out.vuelta = p.vuelta;
  if (typeof p.eslora === 'number' && Number.isFinite(p.eslora)) out.eslora = Math.min(ESLORA_MAX, Math.max(ESLORA_MIN, p.eslora));
  if (typeof p.manga === 'boolean') out.manga = p.manga;
  return out;
}

function desdeURL(): Partial<EntradaPrecio> {
  const q = new URLSearchParams(location.search);
  const p: Partial<EntradaPrecio> = {};
  const carga = q.get('carga');
  if (carga) p.carga = carga as EntradaPrecio['carga'];
  const destino = q.get('destino');
  if (destino) p.destino = destino;
  if (q.has('vuelta')) p.vuelta = q.get('vuelta') === '1';
  const eslora = q.get('eslora');
  if (eslora) p.eslora = Number(eslora.replace(',', '.'));
  if (q.has('manga')) p.manga = q.get('manga') === '1';
  return p;
}

function pintar(r: ResultadoPrecio, origen: Origen | 'inicio'): void {
  const txt: Record<string, string> = {
    total: r.totalTxt, km: r.kmTxt, duracion: r.duracionTxt, ruta: r.ruta, articulo: r.articulo, resumen: r.resumen,
  };
  document.querySelectorAll<HTMLElement>('[data-precio]').forEach((el) => {
    const k = el.dataset.precio ?? '';
    if (k in txt && el.textContent !== txt[k]) el.textContent = txt[k];
  });
  document.querySelectorAll<HTMLSelectElement>('select[data-destino-select]').forEach((s) => {
    if (s.value !== r.entrada.destino) s.value = r.entrada.destino;
  });
  document.querySelectorAll<HTMLInputElement>('input[name="carga"]').forEach((i) => {
    i.checked = i.value === r.entrada.carga;
  });
  document.querySelectorAll<HTMLInputElement>('input[name="viaje"]').forEach((i) => {
    i.checked = (i.value === 'vuelta') === r.entrada.vuelta;
  });
  const eslora = document.getElementById('eslora') as HTMLInputElement | null;
  if (eslora && r.entrada.eslora !== undefined && Number(eslora.value) !== r.entrada.eslora && origen !== 'panel') {
    eslora.value = String(r.entrada.eslora);
  }
  const manga = document.getElementById('manga') as HTMLInputElement | null;
  if (manga && r.entrada.manga !== undefined) manga.checked = r.entrada.manga;
  const wa = urlWhatsApp(r);
  document.querySelectorAll<HTMLAnchorElement>('a[data-wa]').forEach((a) => { a.href = wa; });
  const cl = document.documentElement.classList;
  for (const c of CARGAS) cl.toggle(`carga-${c.id}`, c.id === r.entrada.carga);
}

function aplicar(parcial: Partial<EntradaPrecio>, origen: Origen | 'inicio'): ResultadoPrecio {
  entrada = { ...entrada, ...validar(parcial) };
  resultado = calcularPrecio(entrada);
  entrada = { ...resultado.entrada };
  estado.calc = resultado;
  pintar(resultado, origen);
  if (origen !== 'inicio') guardar();
  emit('precio', resultado);
  return resultado;
}

export function fijar(parcial: Partial<EntradaPrecio>, origen: Origen): ResultadoPrecio {
  return aplicar(parcial, origen);
}

export function actual(): ResultadoPrecio {
  return resultado;
}

/** Por defecto moto·valencia·ida; después localStorage y, por encima, ?carga=&destino=&vuelta=1. */
export function iniciarCalc(): ResultadoPrecio {
  const r = aplicar({ ...leerGuardado(), ...desdeURL() }, 'inicio');

  // Mandos de cualquier parte de la página, por delegación.
  const alCambiar = (ev: Event) => {
    const t = ev.target as HTMLElement | null;
    if (!t) return;
    const origen: Origen = t.closest('form#calc') ? 'panel' : 'heroe';
    if (t instanceof HTMLSelectElement && t.matches('[data-destino-select]')) {
      aplicar({ destino: t.value }, origen);
    } else if (t instanceof HTMLInputElement) {
      if (t.name === 'carga' && t.checked) aplicar({ carga: t.value as EntradaPrecio['carga'] }, origen);
      else if (t.name === 'viaje' && t.checked) aplicar({ vuelta: t.value === 'vuelta' }, origen);
      else if (t.id === 'eslora') aplicar({ eslora: Number(t.value) }, 'panel');
      else if (t.id === 'manga') aplicar({ manga: t.checked }, 'panel');
    }
  };
  document.addEventListener('change', alCambiar);
  document.addEventListener('input', (ev) => {
    const t = ev.target as HTMLElement | null;
    if (t && (t.id === 'eslora')) alCambiar(ev);
  });
  return r;
}
