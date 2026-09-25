// Ruta sin WebGL (§7.4): el alzado y la planta de la moto como función de p, igual que el
// director 3D, y la publicación de estado.cinchas2D cuando fuente = 'svg' (§5.6.5).
// Solo escribe atributos cuando cambian. Sin efectos al importarse.
import { estado, on, type Cincha2D, type Punto } from '../lib/estado.ts';
import { onFrame } from '../lib/motion.ts';
import { amarre, type EstadoCincha } from '../guion/amarre.ts';
import { cierre, desatado } from '../guion/cierre.ts';
import { clamp, lerp, loc } from '../guion/util.ts';
import { bordes, esquinaDe } from '../guion/traspaso.ts';
import { ANCLAS, ANCLAS_PLATAFORMA, type PiezaId } from '../three/contrato-tipos.ts';

type V = [number, number];
const sx = (x: number) => 700 + 500 * x;
const sy = (y: number) => 600 - 500 * y;
const PIVOTE: V = [sx(ANCLAS.pivote_suspension[0]), sy(ANCLAS.pivote_suspension[1])];
/** Extremos de las dos cintas del alzado (lado cercano, +z), en unidades del viewBox con la plataforma enrasada. */
const CINTAS: Record<number, { a: V; b: V }> = {
  0: { a: [sx(ANCLAS_PLATAFORMA.anc_anilla_del_I[0]), sy(ANCLAS_PLATAFORMA.anc_anilla_del_I[1])], b: [sx(ANCLAS.anc_cincha_tija_I[0]), sy(ANCLAS.anc_cincha_tija_I[1])] },
  2: { a: [sx(ANCLAS_PLATAFORMA.anc_anilla_tras_I[0]), sy(ANCLAS_PLATAFORMA.anc_anilla_tras_I[1])], b: [sx(ANCLAS.anc_cincha_tras_I[0]), sy(ANCLAS.anc_cincha_tras_I[1])] },
};

// Color de la cinta: mezcla lineal de --cincha-floja a --cincha con T^1,2, como el material 3D (§4.4).
const aLineal = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const aSrgb = (v: number) => Math.round(255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055));
const FLOJA = [0x2a, 0x2f, 0x33].map(aLineal);
const TENSA = [0xd2, 0x56, 0x1f].map(aLineal);
function colorCinta(T: number): string {
  const k = clamp(T) ** 1.2;
  const c = FLOJA.map((f, i) => aSrgb(f + (TENSA[i] - f) * k));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

interface Cinta { i: number; path: SVGPathElement; lazo: SVGCircleElement; carraca: SVGGElement; palanca: SVGPathElement }
interface Alzado {
  movs: SVGGElement[]; calzo: SVGGElement | null; susp: SVGElement[];
  piezas: Array<{ el: SVGElement; pieza: string }>; cinchas: SVGGElement | null; cintas: Cinta[];
}

function alzado(svg: SVGSVGElement | null): Alzado | null {
  if (!svg) return null;
  return {
    movs: [...svg.querySelectorAll<SVGGElement>('.ml-mov')],
    calzo: svg.querySelector<SVGGElement>('.ml-calzo'),
    susp: [...svg.querySelectorAll<SVGElement>('.ml-susp')],
    piezas: [...svg.querySelectorAll<SVGElement>('use[data-pieza]')].map((el) => ({ el, pieza: el.dataset.pieza ?? 'resto' })),
    cinchas: svg.querySelector<SVGGElement>('.ml-cinchas'),
    cintas: [...svg.querySelectorAll<SVGGElement>('.ml-cincha')].map((g) => ({
      i: Number(g.dataset.i),
      path: g.querySelector<SVGPathElement>('.ml-cinta')!,
      lazo: g.querySelector<SVGCircleElement>('.ml-lazo')!,
      carraca: g.querySelector<SVGGElement>('.ml-carraca')!,
      palanca: g.querySelector<SVGPathElement>('.ml-palanca')!,
    })),
  };
}

/** Escribe un atributo o una propiedad de estilo (clave 'style.x') solo si cambia. */
const escrito = new WeakMap<Element, Record<string, string>>();
function poner(el: Element, clave: string, valor: string): void {
  let m = escrito.get(el);
  if (!m) { m = {}; escrito.set(el, m); }
  if (m[clave] === valor) return;
  m[clave] = valor;
  if (clave.startsWith('style.')) (el as SVGElement).style.setProperty(clave.slice(6), valor);
  else if (valor === '') el.removeAttribute(clave);
  else el.setAttribute(clave, valor);
}

interface EstadoAlzado {
  plataformaY: number; calzoX: number; calzoVisible: boolean;
  cinchas: [EstadoCincha, EstadoCincha]; horquilla: number;
  foco: PiezaId | null; focoMezcla: number;
}

const f3 = (n: number) => String(Math.round(n * 1000) / 1000);

function aplicarAlzado(z: Alzado, s: EstadoAlzado): void {
  const mover = s.plataformaY ? `translate(0 ${f3(-500 * s.plataformaY)})` : '';
  for (const g of z.movs) poner(g, 'transform', mover);
  if (z.calzo) {
    poner(z.calzo, 'transform', s.calzoX ? `translate(${f3(500 * s.calzoX)} 0)` : '');
    poner(z.calzo, 'style.opacity', s.calzoVisible ? '1' : '0');
  }
  // Compresión de la horquilla: el grupo suspendido gira −θ alrededor del eje trasero (§4.3).
  const θ = s.horquilla * 0.028 * 0.9063 / 1.45;
  const grados = θ * 180 / Math.PI;
  const giro = grados ? `rotate(${f3(grados)} ${PIVOTE[0]} ${PIVOTE[1]})` : '';
  for (const u of z.susp) poner(u, 'transform', giro);

  // Pausas: la pieza en --hueso pleno y el resto al 25 % (§7.4). El calzo acompaña a la rueda.
  const m = s.foco ? s.focoMezcla : 0;
  for (const { el, pieza } of z.piezas) {
    let o = '';
    if (m > 0) {
      const enFoco = pieza === s.foco || (s.foco === 'rueda_del' && pieza === 'calzo');
      o = f3(enFoco ? lerp(0.6, 1, m) : lerp(0.6, 0.25, m));
    }
    poner(el, 'style.stroke-opacity', o);
  }

  if (z.cinchas) poner(z.cinchas, 'style.opacity', '1');
  const cs = Math.cos(θ), sn = Math.sin(θ);
  for (const c of z.cintas) {
    const e = c.i === 0 ? s.cinchas[0] : s.cinchas[1];
    const geo = CINTAS[c.i];
    const a = geo.a;
    // El ancla B va con el grupo suspendido.
    const b: V = [PIVOTE[0] + (geo.b[0] - PIVOTE[0]) * cs - (geo.b[1] - PIVOTE[1]) * sn,
      PIVOTE[1] + (geo.b[0] - PIVOTE[0]) * sn + (geo.b[1] - PIVOTE[1]) * cs];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const ini: V = [a[0] + Math.cos(ang) * 42, a[1] + Math.sin(ang) * 42];
    // Misma curva que la cinta 3D: flecha 0,16·max(0, 1 − T)^1,5 m hacia abajo (§4.4).
    const flecha = 500 * 0.16 * Math.max(0, 1 - e.T) ** 1.5;
    const ctrl: V = [(ini[0] + b[0]) / 2, (ini[1] + b[1]) / 2 + 2 * flecha];
    poner(c.path, 'd', `M${f3(ini[0])} ${f3(ini[1])}Q${f3(ctrl[0])} ${f3(ctrl[1])} ${f3(b[0])} ${f3(b[1])}`);
    poner(c.path, 'style.stroke-dasharray', `${f3(e.reveal)} 2`);
    poner(c.path, 'style.stroke', colorCinta(e.T));
    poner(c.lazo, 'cx', f3(b[0]));
    poner(c.lazo, 'cy', f3(b[1]));
    poner(c.lazo, 'style.opacity', e.reveal >= 0.98 ? '1' : '0');
    poner(c.lazo, 'style.stroke', colorCinta(e.T));
    poner(c.carraca, 'transform', `translate(${f3(a[0])} ${f3(a[1])}) rotate(${f3(ang * 180 / Math.PI)})`);
    // Cada clic de carraca levanta la palanca 3°.
    poner(c.palanca, 'transform', e.pasos ? `rotate(${-3 * e.pasos} 9 -9)` : '');
  }
}

export function iniciar(): void {
  const secAm = document.getElementById('amarre');
  const secCi = document.getElementById('contacto');
  const amAlz = alzado(secAm?.querySelector<SVGSVGElement>('.amarre__alzado') ?? null);
  const planta = secAm?.querySelector<SVGSVGElement>('.amarre__planta') ?? null;
  const ciAlz = alzado(secCi?.querySelector<SVGSVGElement>('.cierre__linea') ?? null);
  const ciMoto = secCi?.querySelector<HTMLElement>('.cierre__moto') ?? null;
  const escAm = secAm?.querySelector<HTMLElement>('.cap__escenario') ?? null;
  const compacto = estado.modo.compacto;

  // En compacto la planta va con el morro arriba, como el cenital 3D (arribaCompacto (1,0,0)).
  const rot = planta?.querySelector<SVGGElement>('.mp-rot') ?? null;
  if (planta && rot && compacto) {
    rot.setAttribute('transform', 'rotate(-90 600 320)');
    planta.setAttribute('viewBox', '280 -280 640 1200');
  }
  const siluetas = planta ? [...planta.querySelectorAll<SVGGElement>('.mp-silueta')] : [];
  const cintasPlanta = planta?.querySelector<SVGGElement>('.mp-cintas') ?? null;
  const cintasDatos = planta ? [...planta.querySelectorAll<SVGPathElement>('.mp-cinta')] : [];

  // ——— estado.cinchas2D con fuente SVG: la X de la planta proyectada al viewport ———
  // Se calcula con el escenario pegado (top = 0), aunque ahora mismo esté en otra parte de la página.
  const publicar = () => {
    if (estado.fuente !== 'svg' || !planta || !rot || !escAm || cintasDatos.length !== 4) return;
    const m = rot.getScreenCTM();
    if (!m) return;
    const dy = escAm.getBoundingClientRect().top;
    const tr = (x: number, y: number): Punto => {
      const p = new DOMPoint(x, y).matrixTransform(m);
      return [p.x, p.y - dy];
    };
    const escala = Math.hypot(m.a, m.b);
    if (!escala) return;
    const ancho = 14 * escala; // 35 mm de cinta a 400 unidades por metro
    const centro = tr(600, 320);
    const lee = (s: string | undefined): V => (s ?? '0 0').split(' ').map(Number) as V;
    const c2 = cintasDatos.map((el): Cincha2D => {
      const a = tr(...lee(el.dataset.a));
      const b = tr(...lee(el.dataset.bvis));
      return { esquina: esquinaDe(a, centro), a, b, ladoA: bordes(a, a, b, ancho), ladoB: bordes(b, a, b, ancho) };
    });
    estado.cinchas2D = [c2[0], c2[1], c2[2], c2[3]];
  };
  on('medidas', publicar);
  on('fuente', ({ fuente }) => { if (fuente === 'svg') publicar(); });
  let hPrev = window.innerHeight;
  window.addEventListener('resize', () => {
    if (window.innerHeight !== hPrev) { hPrev = window.innerHeight; publicar(); }
  });

  if (estado.modo.reducido) return; // con movimiento reducido los dibujos son estáticos

  // ——— orden 20 (el sitio del director): la moto SVG como función de p ———
  let pAm = -1, tCi = '', pCi = -1;
  onFrame(() => {
    if (estado.fuente !== 'svg') { pAm = -1; tCi = ''; pCi = -1; return; }

    // Amarre: solo mientras su escenario puede verse.
    const am = estado.cap.amarre;
    if (amAlz && am.e > 0 && estado.cap.precio.e < 1 && am.p !== pAm) {
      pAm = am.p;
      const s = amarre(am.p, { compacto });
      aplicarAlzado(amAlz, {
        plataformaY: s.plataformaY, calzoX: s.calzoX, calzoVisible: s.calzoVisible,
        cinchas: [s.cinchas[0], s.cinchas[2]], horquilla: s.horquilla, foco: s.foco, focoMezcla: s.focoMezcla,
      });
      // Grúa: fundido del alzado a la planta (g 0,3–0,7); traspaso: la silueta se funde de 0,905 a 1.
      const g = loc(am.p, [0.68, 0.90]);
      const f = loc(g, [0.3, 0.7]);
      const svgAlz = amAlz.movs[0]?.ownerSVGElement;
      if (svgAlz) poner(svgAlz, 'style.opacity', f3(1 - f));
      if (planta) poner(planta, 'style.opacity', f3(f));
      const sil = f3(1 - loc(am.p, [0.905, 1]));
      for (const el of siluetas) poner(el, 'style.opacity', sil);
      if (cintasPlanta) poner(cintasPlanta, 'style.opacity', am.p < 0.905 ? '1' : '0');
    }

    // Cierre: dolly-in del 5 % por p y desatado por tiempo (reloj de capitulos/cierre.ts).
    const ci = estado.cap.contacto;
    if (ciAlz && ci.e > 0) {
      const t = secCi?.dataset.desatado ?? '0';
      if (t !== tCi) {
        tCi = t;
        const d = desatado(Number(t));
        const c: EstadoCincha = { reveal: d.reveal, T: d.T, pasos: Math.round(clamp(d.T) * 6) };
        aplicarAlzado(ciAlz, {
          plataformaY: d.plataformaY, calzoX: d.calzoX, calzoVisible: d.calzoVisible,
          cinchas: [c, c], horquilla: clamp(d.T), foco: null, focoMezcla: 0,
        });
      }
      if (ciMoto && ci.p !== pCi) {
        pCi = ci.p;
        ciMoto.style.transform = `scale(${f3(1 + 0.05 * cierre(ci.p).camT)})`;
      }
    }
  }, 20);
}
