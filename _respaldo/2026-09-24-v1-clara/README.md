# Calzo — home

Maqueta de home para el negocio de transporte de **motos, quads y embarcaciones**.
Base Madrid, radio nacional. Hecha para enseñar al cliente y decidir.

**El nombre y el dominio son provisionales.** `calzo.es` estaba libre el
24-sep-2026 (comprobado por DNS en dos resolutores, pendiente de confirmar en el
registrador). Si el cliente prefiere otro, se cambia en un sitio: ver abajo.

## Arranque

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Stack

- **Astro 5**, salida estática. Sin SPA a propósito: el sitio real va a tener
  40+ páginas de rutas y servicios, y una SPA sin prerenderizar llega tarde a
  Google y duplicada a Bing.
- Sin dependencias de UI. Un `IntersectionObserver` de 12 líneas para las
  entradas y nada más.
- Tipografía: **Archivo** (variable, con eje de anchura) + **IBM Plex Mono**
  para etiquetas y cifras.

## Estructura

```
src/
  data/tarifas.js        distancias reales + tarifas PLACEHOLDER
  layouts/Layout.astro   head, noindex, fuentes, observer de entrada
  styles/global.css      tokens, tipografía, dibujo técnico, utilidades
  components/
    Nav.astro            barra fija
    Hero.astro           titular + CALCULADORA (la pieza clave)
    Cargas.astro         3 dibujos técnicos SVG: moto / quad / barco
    Parte.astro          parte de estado con fotos (bloque oscuro)
    Rutas.astro          tabla de salidas desde Madrid
    Seguro.astro         banda ámbar: valor declarado
    Contacto.astro       CTA + pie
  pages/index.astro      monta las secciones
```

## Decisiones de diseño (y por qué)

- **Sin fotografía.** No hay flota que fotografiar todavía. En vez de stock, que
  se nota, las cargas van en **dibujo técnico vectorial** con las cinchas en
  ámbar. Cuando haya fotos reales entran en `Parte.astro`, donde los marcos ya
  están puestos.
- **Ámbar `#F2A900`.** Es el color del panel de transporte especial, no una
  elección de paleta. El naranja `#E4572E` es el de una cincha de amarre.
- **La calculadora es el producto.** La búsqueda dominante del sector es una
  pregunta de precio. El comparador responde con un formulario; aquí sale un
  número. Por eso ocupa la mitad del hero y no está al final.
- **El aviso de autorización complementaria** aparece solo al marcar manga
  > 2,55 m. Ningún competidor avisa de eso, y es lo que decide el precio.

## Qué hay que cambiar antes de publicar

| Qué | Dónde |
|---|---|
| Tarifas reales (ahora son placeholder) | `src/data/tarifas.js` |
| Teléfono y WhatsApp (`600 000 000`) | `src/components/Nav.astro`, `Contacto.astro` |
| Email `hola@calzo.es` | `src/components/Contacto.astro` |
| Nombre de marca | `Nav.astro`, `Contacto.astro`, `index.astro` (title) |
| Cobertura del seguro (60.000 €) | `src/components/Seguro.astro` |
| Umbrales de transporte especial | confirmar con normativa vigente antes de publicar |

## noindex — leer antes de desplegar

La web lleva `noindex` en dos sitios:

- `src/layouts/Layout.astro` → `<meta name="robots" content="noindex, nofollow">`
- `public/robots.txt` → `Disallow: /`

Es deliberado: **la empresa todavía no existe**. Sin CIF no se puede contratar
nada, y que Google indexe ahora un negocio no contratable es empezar con deuda.
Se quitan los dos el día del alta, no antes.

## Deploy a Vercel

Astro se despliega sin configuración: framework detectado, `npm run build`,
salida en `dist/`. Desde la carpeta del proyecto:

```bash
npx vercel
```

El dominio se conecta después desde el panel de Vercel.
