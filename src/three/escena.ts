// Stub de WP0 con el contrato de EscenaAPI (§5.4). Lo implementa WP2.
import type { Tier, PresetId } from './contrato-tipos.ts';
import type { Cincha2D } from '../lib/estado.ts';

export interface EscenaAPI {
  tier: Tier;
  renderUnaVez(): void;
  pausar(): void; reanudar(): void;
  cinchasCenitales(w: number, h: number): [Cincha2D, Cincha2D, Cincha2D, Cincha2D];
  capturar(preset: PresetId, o: { w: number; h: number;
    sello?: { serie: 'CARGA'; letra: 'A' | 'B' | 'C' | 'D'; fecha: Date } }): Promise<string>;
  info(): { drawCalls: number; triangulos: number; programas: number; px: number; dpr: number; tier: Tier;
    fpsMediana: number; amarre: { T: [number, number, number, number]; reveal: [number, number, number, number] } };
  pixel(x: number, y: number): Promise<[number, number, number]>;
  destruir(): void;
}
