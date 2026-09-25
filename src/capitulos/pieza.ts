// Stub de WP0: lo sustituye WP3 (§2.1).
import type { Paso } from '../lib/escena-loader.ts';

export function iniciar(): void {
  /* pendiente */
}

/** Callback de progreso de carga que app.ts pasa a cargarEscena (§5.4). */
export function progresoCarga(fraccion: number, paso: Paso): void {
  void fraccion; void paso;
}
