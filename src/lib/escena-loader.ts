// Stub de WP0: lo sustituye WP2 (§5.4). Sin escena todavía: ruta SVG.
import { estado, emit } from './estado.ts';
import type { EscenaAPI } from '../three/escena.ts';

export type Paso = 'fuentes' | 'three' | 'moto' | 'texturas' | 'shaders' | 'benchmark';

export async function cargarEscena(o: { contenedor: HTMLElement; progreso: (fraccion: number, paso: Paso) => void; limiteMs: number }): Promise<void> {
  void o.contenedor; void o.limiteMs;
  o.progreso(1, 'benchmark');
  const anterior = estado.fuente;
  estado.fuente = 'svg';
  document.documentElement.classList.add('fuente-svg');
  emit('tier', { tier: estado.modo.tier });
  emit('fuente', { fuente: 'svg', anterior });
  emit('listo', { fuente: 'svg' });
}

export function escena(): EscenaAPI | null {
  return null;
}
