import { defineConfig } from 'astro/config';

// Salida estatica. Cada pagina se sirve ya renderizada: sin SPA, sin
// prerender a posteriori, sin que Google tenga que ejecutar JS para ver texto.
export default defineConfig({
  site: 'https://calzo.es',
});
