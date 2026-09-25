// Bloque CTA del cierre (§2.8). Dueño: WP4.
// «Copiar» del email con aviso en aria-live (1,4 s) y el resumen del cálculo,
// que solo aparece si hay un cálculo del usuario (guardado, por URL o hecho en
// esta visita), no el valor por defecto que la página ya enseña arriba.
import { estado, on } from '../lib/estado.ts';

const AVISO_MS = 1400;

async function copiar(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(texto); return true; }
  } catch { /* permiso denegado: se prueba el respaldo */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch { return false; }
}

export function iniciar(): void {
  const cta = document.querySelector<HTMLElement>('.cta');
  if (!cta) return;

  // WhatsApp: pestaña nueva solo en escritorio (§5.3).
  if (estado.modo.compacto) {
    cta.querySelectorAll<HTMLAnchorElement>('a[data-wa]').forEach((a) => a.removeAttribute('target'));
  }

  // ——— copiar email ———
  const boton = cta.querySelector<HTMLButtonElement>('[data-copiar]');
  const aviso = cta.querySelector<HTMLElement>('.cta__aviso');
  if (boton && aviso) {
    boton.hidden = false; // sin JS no hay botón que no haga nada
    let t = 0;
    boton.addEventListener('click', async () => {
      const ok = await copiar(boton.dataset.copiar ?? '');
      window.clearTimeout(t);
      aviso.textContent = ok ? 'Copiado' : '';
      t = window.setTimeout(() => { aviso.textContent = ''; }, AVISO_MS);
    });
  }

  // ——— resumen «Tu cálculo» ———
  const resumen = cta.querySelector<HTMLElement>('[data-cta-resumen]');
  if (resumen) {
    let propio = false;
    try { propio = localStorage.getItem('calzo:calc') !== null; } catch { /* sin storage */ }
    const q = new URLSearchParams(location.search);
    if (q.has('carga') || q.has('destino') || q.has('vuelta')) propio = true;
    resumen.hidden = !propio;
    // Cualquier cálculo hecho en esta visita (héroe, panel, rutas, cargas) cuenta.
    on('precio', () => { resumen.hidden = false; });
  }
}
