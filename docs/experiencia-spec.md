# Calzo — Especificación definitiva de la experiencia

Versión 2.0 · 24-sep-2026 · Dirección creativa + lead de frontend creativo · Estado: **cerrada para implementación**. Incorpora la revisión del red team (§11).

Reglas de lectura:

- Lo marcado como *valor de partida* se puede ajustar ±10 % en la revisión de fotograma.
- Nombres, ids, `data-*`, eventos, firmas, rangos de scroll y reparto de archivos **no se tocan** sin pasar por el lead (WP0).
- Todo dato de negocio sale de `src/data/tarifas.js` y `src/data/contacto.js`. Lo provisional se enseña como provisional.
- **Lo que no está en la lista cerrada de §1.4 no se construye.** La tabla «NO SE CONSTRUYE» (§10.4) no es una lista de recortes opcionales: esos elementos están fuera por defecto.

---

## 1. Concepto y momento WOW

### 1.1 Idea central: «La pieza y el estuche»

La web es **la presentación de una moto que no está a la venta**. El Acto I la trata como un lanzamiento de automoción: una sala a oscuras y un solo barrido de luz. El Acto II enseña lo que Calzo vende de verdad, **el estuche**. La moto se ata delante del usuario con su propio scroll, con una pausa en cada pieza por la que se agarra. Al terminar, la moto se retira y las mismas cuatro cinchas se quedan y atan el precio. Después vienen, en calma, los papeles (cargas y parte con fotos), el seguro y las rutas. El cierre la desata idéntica: «Se baja igual.»

El lema se escenifica literalmente. La moto está sobre una plataforma enrasada en el suelo de la sala. En el amarre, la plataforma **sube** 35 cm con ella («se sube») y allí se ata. En el cierre, la plataforma **baja** con la moto ya desatada («se baja igual»).

Tres reglas de dirección de arte mandan sobre todo lo demás:

1. **Solo la moto tiene volumen.** Todo lo demás es luz, línea o tipografía. Quads, barcos, rutas y seguro son dibujo o texto. No hay fotografía de stock. Las líneas técnicas (cotas, plantas, secciones) viven solo en las láminas de la banda de papel y en la ruta sin WebGL. **Nunca hay retículas, cajetines ni interfaz tipo HUD sobre el 3D.**
2. **Un solo color cálido: el naranja de una cincha tensada** (`--cincha #D2561F`). Todo lo demás es grafito frío, plata, hueso y papel. El naranja solo aparece cuando algo queda atado:
   - la cincha 3D en tensión;
   - las cinchas que sujetan el panel de precio;
   - el botón de WhatsApp de la calculadora y el de la barra móvil, este último solo a partir del traspaso;
   - el subrayado del CTA final;
   - el testigo de manga > 2,55 m;
   - las cinchas de las láminas.

   Nunca va en titulares ni en fondos, y nunca como fondo de un bloque mayor que un botón de 56 px.
3. **Contención.** Hay tres momentos. El resto está quieto (§1.4).

Arco emocional: **suelta → estudiada pieza a pieza → atada → con precio → documentada → asegurada → en ruta → se baja igual.**

### 1.2 Qué siente el usuario

| Momento | Qué pasa | Qué siente |
|---|---|---|
| 0–5 s | El H1, la línea de servicio y un precio real (205 € a Valencia) están pintados desde el primer fotograma. La línea del suelo crece con la carga real | «Sé qué es y cuánto cuesta» |
| 5–15 s | Un único barrido de luz saca la moto de la oscuridad, de pie sobre esa misma línea. Con el scroll, los reflejos resbalan por la pintura | «Esto no es una web de transportes» |
| **~15–45 % (WOW)** | La moto se ata con el scroll del usuario. Sube la plataforma y la rueda entra en el calzo. Las cinchas van a la tija y se tensan clic a clic, de grafito a naranja: es el primer color de la web. La horquilla se comprime lo justo y la grúa sube a cenital. Entonces la moto se retira y **las cuatro cinchas se quedan**: bajan con una ligera comba, enganchan las esquinas de la calculadora y se tensan, y el panel se asienta bajo su tensión | «¿Cómo han hecho esto?» |
| 45–80 % | El precio, sin coreografía. Una banda de papel con las láminas y el parte, con fotos hechas por la propia web. Después, el seguro y las rutas | Confianza |
| 80–100 % | La moto atada vuelve, en el mismo encuadre del principio, y se desata sola. «Se baja igual.» y el WhatsApp | Cierre |

### 1.3 Por qué el WOW es memorable

- **Agencia.** El usuario hace el trabajo: cada clic de carraca sale de su scroll.
- **El color como recompensa.** Durante ~250 vh solo hay grafito, plata y hueso. El naranja aparece por primera vez cuando una cincha delantera queda tensa.
- **El traspaso se ve y se siente.** Las cinchas no desaparecen ni se encogen en adornos. La moto se disuelve debajo de ellas, las cintas siguen ahí (misma anchura, mismo naranja, con su carraca y su tejido) y bajan a buscar el panel. Al engancharse se tensan, y el panel **cede 3–4 px bajo la tensión**, con la misma física que el calzo y la horquilla. Se percibe porque se mueve con peso, no porque se oculte.
- **Verdad del oficio.** Todo lo que se ve es técnica real del transportista: rueda calzada, cinchas a la tija y nunca a los mandos, horquilla comprimida lo justo.
- **Nada compite.** Antes del WOW el usuario ha visto exactamente un efecto: un barrido de luz.

### 1.4 Contención: lista cerrada de movimiento

Esta tabla es el **inventario completo** de lo que se mueve en la web. Si algo no está aquí, no se construye.

| Momento | Elementos (y nada más) |
|---|---|
| **1 · Desvelado** (`#pieza`) | (1) La línea de suelo crece con la carga real. (2) Un barrido de luz por tiempo (1,6 s) saca la moto de la oscuridad. (3) Por scroll: giro del entorno (los reflejos resbalan), dolly de cámara y subida de la luz clave |
| **2 · Amarre + traspaso** (`#amarre` → `#precio`) | (4) La plataforma sube. (5) Pausas de pieza: la cámara se acerca y la pieza queda aislada con luz. (6) El calzo encaja y el rig se asienta 3 mm. (7) Las cinchas nacen de la carraca y dan 6 clics: palanca, color y flecha. (8) La horquilla se comprime. (9) Grúa a cenital: los reflejos corren, la moto queda en silueta y el naranja sale exacto. (10) Traspaso: la moto se retira, las cinchas atan el panel y el panel se asienta |
| **3 · Desatado** (`#contacto`) | (11) Dolly-in. (12) Desatado por tiempo: tensión, recogida, calzo fuera y plataforma abajo. (13) «Se baja igual.» por máscara (la única itálica de la web) |
| Resto de capítulos | **Como mucho una entrada por capítulo**, disparada una vez por tiempo al 25 % de su entrada y **nunca ligada al scroll**: cargas, las dos láminas por máscara; parte, las cuatro fotos por máscara; rutas, los rayos crecen desde Madrid. Precio y seguro no tienen ninguna. Los titulares ya están visibles, sin animación |
| Microinteracciones (estado, no espectáculo) | El chip del nav aparece con un fundido de 200 ms. La cifra del precio cambia con un fundido cruzado de 180 ms. El bloque de eslora se despliega en 260 ms. El rayo de la rosa se aísla en 150 ms. El subrayado del CTA final se tensa en hover (200 ms). Foco visible |
| Transiciones entre capítulos | **Una sola de firma: el traspaso** (amarre → precio). El resto: el corte seco de cámara héroe → amarre (sin parpadeo) y el propio borde de la página al hacer scroll |

### 1.5 Injertos de las otras propuestas y descartes

Injertos que se mantienen:

| Procedencia | Idea injertada | Dónde vive |
|---|---|---|
| Ficha de carga | Frase-precio con cifra real en la primera pantalla, que persiste como chip del nav (con un fundido, sin Flip) | Héroe, nav |
| Ficha de carga | Patrón de estado único: la coreografía son funciones puras del progreso y el render solo lee | Arquitectura (§5) |
| CARRACA | La hoja del parte en papel claro, ampliada a una **banda de papel** (cargas + parte) | Cargas, parte |
| CARRACA | Barra inferior móvil con precio + WhatsApp | Compacto |
| Nocturno Km 0 | Los reflejos que corren por la pintura durante la grúa (rotación del entorno) | Amarre |
| Nocturno Km 0 | «Incluye parte con fotos y seguro por valor declarado» junto al precio | Calculadora |
| Jurado de negocio | H1 con la keyword de servicio; nav e índice en lenguaje de cliente | Héroe, nav |
| Jurado técnico | Fotos del parte generadas por el mismo motor (ahora fuera de pantalla), sin EffectComposer | Parte, escena |

Injertos retirados en la revisión (motivos en §11): el cajetín con escala, el «Detalle» circular, la cincha pulsable, la prueba de frenada con fantasma, «Todo se mueve. / Ella, no.» y la barra de progreso-cincha.

**Descartado a propósito:**

- **Tropos:** partículas (también el polvo en el haz), glitch, aberración cromática, neón, rejillas holográficas, HUD, cursor propio, luz que sigue al cursor, giro de 360°, OrbitControls, wordmark gigante en parallax, iris y obturadores, contadores de preloader, grano animado, «shiny text» sobre titulares y numerales gigantes en contorno.
- **Adornos sin retorno:** UnrealBloom/EffectComposer, sonido y sacudidas de pantalla.
- **Datos inventados del código actual:** lista completa en §8.5.

---

## 2. Storyboard por capítulos

### 2.0 Mapa del recorrido (escritorio: ≥ 1024 px y puntero fino)

Cada capítulo es un `<section class="cap" data-cap="…">` apilado **sin márgenes entre secciones**. Los capítulos fijos (pieza, amarre, contacto) contienen una **pista** `.cap__pista` de altura `100svh + fija` con un escenario `position: sticky` dentro. No se usan pins de GSAP.

- Progreso de entrada `e` (0 → 1): desde que el borde superior de la sección toca el inferior del viewport hasta que toca el superior.
- Progreso fijo `p` (0 → 1): mientras el escenario está pegado, a lo largo de los `fija` vh de la pista.
- En secciones sin pista, `p` es el avance una vez que su borde superior ha llegado arriba (§5.4).

Documento total: **~1300 svh**. Scroll máximo: **~1200 vh** (≈ 10.800 px con 900 px de alto). QA lo comprueba (§9.2 #23).

| # | Capítulo (ancla) | Documento (svh) · alto / fija | Scroll (vh) | % del scroll | 3D |
|---|---|---|---|---|---|
| 01 | Transporte de motos `#pieza` | 0–180 · 180 / 80 | 0–80 fijo | 0–6,7 | sí |
| 02 | Cómo se ata `#amarre` (WOW) | 180–540 · 360 / 260 | 80–180 entrada · 180–440 fijo | 6,7–36,7 | sí |
| 03 | Precio `#precio` | 540–~670 · auto | 440–540 entrada (fin del traspaso a 520) · hasta ~570 | 36,7–~47,5 | no (canvas a 0) |
| 04 | Quads y barcos `#cargas` (papel) | ~670–770 · auto | ~570–670 | ~47,5–56 | no |
| 05 | Parte con fotos `#parte` (papel) | ~770–880 · auto | ~670–780 | ~56–65 | no (fotos ya capturadas) |
| 06 | Seguro `#seguro` | ~880–950 · auto | ~780–850 | ~65–71 | no |
| 07 | Rutas `#rutas` | ~950–1060 · auto | ~850–960 | ~71–80 | no |
| 08 | Se baja igual `#contacto` | ~1060–1270 · pista 150 / 50 + CTA ~60 | ~960–1060 entrada · ~1060–1110 fijo · CTA ~1110–1170 | 80–97,5 | sí (pista) |
| — | Pie | ~1270–1300 · auto | ~1170–1200 | 97,5–100 | no |

Las secciones «auto» son estimaciones con el contenido de §2 a 1440 × 900. Solo las pistas tienen altura exacta.

**Conversión de `p` a vh:** `vh = inicioFijo + p · fija`. Por ejemplo, amarre p = 0,5 → 180 + 0,5 · 260 = 310 vh. Para la entrada: `vh = inicioEntrada + e · 100`.

**Convenciones de este capítulo:**

- «Velocidad» es el desplazamiento aparente respecto al scroll. Dentro de un escenario sticky, el contenido está quieto salvo lo que se le añade por `p`.
- La cámara usa coordenadas del rig (§4.1) en metros; los planos (`pieza.a`, `am.calzo`…) están en §4.9.
- La coreografía **no** usa tweens con `scrub`. Son funciones puras de `e`/`p` (`src/guion/*`) evaluadas cada frame sobre el scroll ya suavizado. El peso lo da el muelle crítico de la cámara (λ = 6). Solo lo marcado «por tiempo» en §1.4 es un tween o un muelle por tiempo.
- **Ráfagas.** Si `estado.scroll.saltando` (un `irA` en curso) o `|estado.scroll.vel| > 3000 px/s`, los efectos por tiempo se aplican directamente en su estado final: asiento del calzo, asiento del panel, desatado y entradas únicas.

---

### 2.1 — 01 · El desvelado `#pieza` (momento 1)

**Rango:** 0–80 vh fijo. Alto 180 svh.

**No hay preloader superpuesto.** La sala a oscuras es el propio héroe. El texto se pinta en el HTML desde el primer fotograma (es el LCP) y el scroll está libre desde t = 0.

**Carga (antes de `listo`).**

- Fondo `--carbon`. `.pieza__suelo` es una línea de 1 px en `--hueso` al 70 % sobre **el suelo del héroe**: `y = var(--suelo-y)` (72svh en escritorio), de `--suelo-x0` (46vw) a `--suelo-x1` (88vw).
- Su `scaleX` sigue el **progreso real** de carga, creciendo desde el centro (transición CSS de 140 ms, `--ease`).
- Está invisible los primeros 350 ms (`animation-delay`). Si la carga acaba antes, la línea aparece ya entera junto con la moto.
- **Pesos del progreso:**

| Paso | Peso |
|---|---|
| Fuentes (`document.fonts.load` de las 3 familias) | 15 |
| `import()` del chunk 3D | 30 |
| Construcción de la moto, troceada en tareas de menos de 50 ms | 25 |
| Texturas GPU + PMREM | 10 |
| `renderer.compileAsync` | 15 |
| Primer fotograma + benchmark | 5 |

- **Límite:** `listo` se emite como muy tarde a los **2,2 s**, o a los **0,6 s** si hay `sessionStorage['calzo:visto']` o hash en la URL. Si la escena no ha llegado, se entra con la ruta SVG (`MotoLinea` sobre la misma línea) y la carga sigue en segundo plano. El cambio a WebGL solo ocurre en una frontera segura (§5.6).
- **Red de seguridad.** Un error de JS, un chunk que no llega o un `webglcontextlost` durante la carga ⇒ `fuente = 'svg'`. Si `app.ts` no arranca, el script del head quita `html.js` a los 4 s y la página queda en su maquetación sin JS, que es legible (§5.5). Nunca queda nada tapando la página.
- Sin JS, la línea está entera y `MotoLinea` se ve estática.

**Intro por tiempo** (arranca con `listo`, t en segundos):

| t (s) | Qué ocurre |
|---|---|
| 0–1,6 | Barrido de luz: `uBarridoX` de −1,45 a +1,45 m (ease `calzo`; empieza y acaba fuera de la moto). Revela el flanco del depósito y la horquilla. **Solo en 3D**: el H1 no tiene barrido |
| 0,8–1,6 | La luz clave pasa de 0 a 0,35 |

En el DOM no se mueve nada: el texto ya estaba.

**Scroll (`p` del fijo; `guion.mezclaPieza(t, p)`):**

| p | 3D | DOM |
|---|---|---|
| 0–0,5 | `environmentRotation.y` de 0 a 0,9 rad: los reflejos de las tiras resbalan por el barniz. Cámara `camT` de 0 a 0,5 (de `pieza.a` hacia `pieza.b`) | La línea de suelo se funde de 1 a 0 entre p 0,10 y 0,25 (el suelo 3D con su sombra de contacto ya la sustituye) |
| 0,5–1 | Luz clave de 0,35 a 1: la moto se ve entera por primera vez, aún al 60 % en sombra. `camT` de 0,5 a 1 (la cámara baja a 0,55 m) | A p ≥ 0,9: `html.chip-visible` (el chip del nav aparece con un fundido de 200 ms) |

- **Mezcla intro/scroll** (un solo escritor): `clave = lerp(intro(t).clave, pieza(p).clave, loc(p,[0,.05]))`. El barrido se apaga con el scroll: `uBarridoI = 1,2 · (1 − loc(p,[0,.05]))` mientras la intro no haya terminado. A p > 0,05 la intro se da por acabada.
- **Salida:** no hay animación de salida. Al acabar el fijo, el escenario sube con la página.
- **Moto:** sobre la plataforma **enrasada** en el suelo (y = 0), sin calzo ni cinchas. En clave baja, la chapa y su junta apenas se leen: un reflejo de tira. Horquilla extendida y aro del faro a 0,6.

**Composición (escritorio).** Las capas del DOM van siempre **por encima** del canvas.

- H1 a la izquierda (columnas 1–6, desde 16svh).
- Debajo, la línea de servicio.
- Abajo a la izquierda (84svh), la frase-precio.
- La moto a la derecha, con el punto medio de sus contactos exactamente en `(0,67·W, 0,72·H)` sobre la línea de suelo.

**Copy exacto:**

- H1 (un solo `<h1>`, una sola voz, Big Shoulders en caja mixta):
  - `<span class="h1__lema">Se sube atado. Se baja igual.</span>`
  - `<span class="h1__servicio">Transporte de motos, quads y embarcaciones por carretera, desde Madrid a toda España.</span>` (Newsreader, `--t-entrada`)
- Frase-precio: `<span data-precio="articulo">Una moto</span> de Madrid a [select Valencia]: <span data-precio="total">205 €</span>` + nota `Tarifa provisional` (pequeña, `--ceniza`, sin corchetes) + enlace `Ver desglose y reservar` (flecha SVG).
  - El artículo cambia con la carga: «Un quad», «Un barco», «Un coche».
  - El `select` es nativo, con chevron SVG (`Chevron.astro`).

**Técnica:** `CapPieza.astro` + `capitulos/pieza.ts` (WP3). El progreso de carga llega por el callback de `cargarEscena`. `guion/pieza.ts` (WP0).

---

### 2.2 — 02 · Cómo se ata `#amarre` — MOMENTO WOW

**Rango:** entrada 80–180 vh, fijo 180–440 vh (260 vh). Absorbe lo que antes era el capítulo «Dónde se ata»: cada pieza se explica una sola vez, justo antes de atarla.

**Entrada (e).**

- e < 0,5: la cámara sigue en `pieza.b` mientras el escenario del héroe sube.
- e = 0,5: **corte seco** de cámara a `am.bajo`, sin parpadeo. La plataforma sigue enrasada (y = 0).
- El H2 `Así se ata una moto.` forma parte del escenario y llega con él, sin animación.

**Tramos del fijo** (`guion.amarre(p)`; los vh son absolutos):

| Tramo | p | vh | 3D | DOM (fase de texto) |
|---|---|---|---|---|
| Plataforma | 0,00–0,06 | 180–196 | **«Se sube».** La plataforma sale de su junta en el suelo y sube de y = 0 a 0,35 con la moto encima, como un elevador de escenario (ease `calzo`); se ven sus costados de anodizado y sus carriles. El rig sube con ella (`setApoyo`). Cámara `am.bajo` (absoluta, ve la subida entera) | `titulo`: H2 |
| Rueda (pausa) | 0,06–0,12 | 196–211 | Cámara a `am.rueda` (teleobjetivo bajo, respira un 3 %). **Aislado:** `uFoco = rueda_del` y el resto se atenúa al 15 %. Luz clave apuntada a `hs_rueda` | `rueda` |
| Calzo | 0,12–0,20 | 211–232 | Cámara `am.calzo`. El calzo aparece en el borde delantero de la plataforma (visible desde p 0,12, durante el movimiento de cámara) y entra desde x +0,55 hasta 0. **Al cruzar p = 0,20 hacia delante:** el rig baja 3 mm y vuelve con muelle crítico (ω = 33). Es solo física: el canvas no se mueve. El aislamiento se libera entre p 0,18 y 0,20 | `rueda` |
| Tija (pausa) | 0,20–0,27 | 232–250 | Cámara a `am.tija` (fov 20). `uFoco = tija`; se libera entre 0,27 y 0,30. Clave a `hs_tija` | `tija` |
| Delanteras | 0,27–0,41 | 250–287 | Cámara `am.delanteras`. Cinchas `del_I` y `del_D` a la vez: u < 0,4, `reveal` de 0 a 1 (la cinta crece desde la carraca); u 0,4–1, **6 clics** (§5.7). Cada clic: la palanca de la carraca gira +3° y T objetivo sube 1/6 con un muelle crítico de 120 ms. El color va de `#2A2F33` a `#D2561F` según T | `tija` |
| Traseras | 0,41–0,53 | 287–318 | `tras_I` y `tras_D` a la vez (reveal y 6 clics). **Corte seco** a `am.traseras` al entrar (el único dentro del amarre) y después **travelling lateral**: la cámara recorre el costado derecho de delante hacia atrás. Es la sensación horizontal del recorrido, hecha con la cámara | `tija` (sin frase propia: el copy solo afirma la técnica que ha dado el transportista) |
| Horquilla (pausa) | 0,53–0,59 | 318–333 | Cámara a `am.horquilla` (fov 18). `uFoco = horquilla`; se libera entre 0,59 y 0,62 | `horquilla` |
| Compresión | 0,59–0,68 | 333–357 | `rig.setHorquilla(0 → 1)`: 28 mm a lo largo del eje, con pivote en el eje trasero (§4.3) | `horquilla` |
| Grúa | 0,68–0,90 | 357–414 | La cámara sube por el spline `am.horquilla → am.grua1 → am.cenital` (orientación por cuaterniones, §4.9). La clave baja a 0 (g 0–0,5); el entorno, de 0,5 a 0,05; las contras, de 1 a 0,35. `environmentRotation.y` +1,2 rad: los reflejos corren. Cinchas en `uSinLuz` 0 → 1 (g 0,2–0,6): el naranja sale exacto. A g > 0,85 la cámara es exactamente la del plano, sin muelle. **Queda una X perfecta** (§4.4) | ninguna (silencio) |
| Traspaso (inicio) | 0,90–1,00 | 414–440 | A p ≥ 0,90 aparecen las 4 cintas SVG de `#capa-cinchas`, idénticas a las 3D. A p ≥ 0,905 se ocultan las cinchas 3D. De 0,905 a 1 la opacidad del canvas va de 1 a 0: **la moto se disuelve y las cuatro cintas naranjas quedan solas sobre el carbón** | ninguna |

**Textos de las fases** (fijos en la columna izquierda en escritorio y arriba en compacto; aparecen y se van con un fundido de opacidad derivado de `p`):

- `rueda`: h3 `La rueda delantera va calzada.` · `El calzo es la cuña que la inmoviliza; de ahí nuestro nombre.`
- `tija`: h3 `Delante, las cinchas van a la tija.` · `Es la pieza que une las barras de la horquilla bajo el manillar. Manillar, manetas y piñas quedan libres.`
- `horquilla`: h3 `La horquilla se comprime lo justo.` · `Al tensar, la suspensión baja sin quedar suelta ni llegar al tope.`

Todo este copy técnico lo valida el transportista antes de publicar (§8.5).

**Hacia arriba:** todo se deshace clic a clic de forma determinista, porque es función de `p`. El asiento del calzo solo se dispara hacia delante.

**Qué ve, resumido:** la plataforma sube del suelo. La cámara se acerca a la rueda y la rueda entra en el calzo. La cámara se acerca a la tija y dos cinchas nacen de sus carracas y se tensan clic a clic hasta volverse naranjas. La cámara recorre el costado mientras se tensan las traseras. Se acerca a la horquilla y la horquilla baja. La grúa sube a cenital. Sobre el negro quedan cuatro líneas naranjas en X, la moto se retira y **las líneas se quedan**.

**Técnica:**

- 3D: §4.4 (plataforma, calzo, cinta analítica) y §5.7 (fórmulas).
- `#capa-cinchas` y el traspaso: §5.6.
- El amarre suma al 3D 4 cinchas, 4 carracas (cuerpo + palanca: 8 mallas), la plataforma con sus anillas (chapa y costados) y el calzo (aluminio y goma): unas 16 draw calls y ninguna textura descargada.

---

### 2.3 — 03 · Precio `#precio` (fin del traspaso)

**Rango:** entrada 440–540 vh; la sección sigue hasta ~570. No tiene fijo. Canvas oculto y parado (su opacidad llegó a 0 al final del amarre).

**Qué ve.**

- Mientras la sección sube, las cuatro cintas de `#capa-cinchas` **bajan a buscar el panel**:
  - el extremo A (anilla y carraca) viaja a una anilla dibujada fuera de la esquina del panel;
  - el extremo B viaja a la esquina del panel.
  - La correspondencia va por cuadrante de pantalla: la cinta cuyo extremo A está arriba a la izquierda de la X va a la esquina arriba-izquierda del panel, y así con las otras tres (`esquinaDe`, §5.7). Vale igual para escritorio (morro a la derecha) y compacto (morro arriba).
- Durante el viaje:
  - las cintas se destensan un poco (comba de hasta ~2 % de su longitud, T mínima 0,7);
  - aparece su tejido;
  - se dibuja la carraca en cada extremo A;
  - la anchura pasa de la proyectada (~10 px) a la final (10 px en escritorio, 6 px en compacto).
- **Enganche (h = 1, e = 0,8):** las cintas quedan rectas, de anilla a esquina, y el overlay cede el sitio a las cintas en flujo del panel en los mismos píxeles.
- **Asiento:** el panel baja 3,5 px y se comprime (`scaleY 0,996` desde abajo) con muelle crítico (ω = 33). Los extremos B lo acompañan. Hacia arriba, todo se deshace.

**Qué se mueve después:** nada. Dentro de la sección nada está ligado al scroll: **el producto no se secuestra**. La cifra del precio cambia con un fundido cruzado de 180 ms cuando cambia el cálculo. Nada más.

**Composición.**

- `.precio__marco` centrado (columnas 2–11 en escritorio).
- A su alrededor, un margen para las cinchas: `--amarre-dx` / `--amarre-dy`.
- Dentro, `.precio__panel`, que es **sólido** (`--grafito-alto`), con radio de 4 px, sin vidrio, sin filo y sin halo. La profundidad la dan las cuatro cinchas y su asiento.
- El H2 vive dentro del panel, en la cabecera de la columna de mandos.
- Debajo del marco: `details#tarifas` con la tabla completa (§6.6).

**Copy:**

- H2 `Cuánto cuesta.`
- Entrada `Elige qué llevamos y adónde; el precio se calcula al momento.`
- El resto, en §6.

---

### 2.4 — 04 · Quads y barcos `#cargas` (banda de papel)

**Rango:** ~570–670 vh. Sin fijo. **Fondo `--papel`**: empieza la banda de papel, el único plano claro de la web. Cargas y parte forman una sola superficie de documentos impresos. Canvas oculto.

**Qué ve.** Dos láminas técnicas impresas: trazo de 1 px en `--tinta`, cotas en `--tinta-2` y puntos de amarre y cinchas en `--cincha`. En escritorio van en paralelo, a columnas 1–6 y 7–12, con el barco desfasado 8svh.

- **Quad/UTV** en planta: cuatro cinchas en cruz, cuatro anillas y un calzo en cada rueda (`QuadPlanta.astro`, §5.5).
- **Barco** en sección sobre su cuna. La cota de manga está dibujada en 2,40 m con la marca discontinua de 2,55 m (`BarcoSeccion.astro`).
- **Coche:** una sola línea de texto al pie.

**Qué se mueve:** solo la entrada única. Al 25 % de la entrada de la sección, las dos láminas se revelan por máscara (`clip-path: inset(0 0 100% 0)` → `inset(0)`, 0,9 s, stagger 0,12). No hay dibujo trazo a trazo, ni morph, ni cota con scrub, ni parallax.

**Copy:**

- H2 `También llevamos quads y barcos.`
- h3 `Quads y UTV` — `Cuatro cinchas en cruz y un calzo en cada rueda.` — enlace `Calcular para un quad`
- h3 `Embarcaciones` — `Viajan sobre una cuna a medida, apoyadas en la quilla y los pantoques.` — nota `Con más de 2,55 m de manga hace falta una autorización complementaria de circulación. La tramitamos nosotros y va incluida en el precio.` — enlace `Calcular para un barco`
- h3 (visualmente una línea de texto) `Coches` — `También llevamos algún coche: pregúntanos.`
- Los enlaces llaman a `calc.fijar({ carga }, 'cargas')` y a `irA('#precio')`.

---

### 2.5 — 05 · Parte con fotos `#parte` (banda de papel)

**Rango:** ~670–780 vh. Sin fijo. `--papel`. Canvas oculto: las fotos ya se han hecho fuera de pantalla.

**Qué ve.**

- A la izquierda (columnas 1–5): el H2 y su texto.
- A la derecha (columnas 6–12): **la hoja del parte**, impresa sobre el mismo papel con un filete de 1 px en `--tinta-2`. Todo el texto de la hoja va en la fuente de cifras (Overpass Mono). Contiene:
  - Cabecera.
  - Rejilla 2×2 con **las cuatro fotos de carga**: renders de la moto sobre la plataforma, con el calzo puesto y sin cinchas, con luz de flash. Los genera la web (`capturar('parte.A'…'parte.D')`, §5.4) en tiempo ocioso tras `escena:lista`, con el sello de fecha y hora del visitante.
  - Fila `ENTREGA` con cuatro huecos discontinuos y el texto `Se rellenan al entregar.`
  - La firma de ejemplo, ya dibujada (SVG estático).

**Qué se mueve:** solo la entrada única. Al 25 % de la entrada, las cuatro fotos se revelan por máscara (0,9 s, stagger 0,08). Si una foto aún no está lista, su hueco muestra el pie y la foto aparece con un fundido de 200 ms cuando llega. No hay flash en pantalla, visor, obturador, Flip, firma animada ni sello animado.

**Sin WebGL:** las cuatro fotos son recortes vectoriales de `MotoLinea` (cuatro `<svg>` con distinto `viewBox`) con el pie `Dibujo de ejemplo`.

**Copy:**

- H2 `Cuatro fotos al cargar y cuatro al entregar.`
- Entrada `Te enviamos el parte en PDF, con hora y firma, para comparar cómo salió la moto y cómo llegó.`
- Hoja:
  - `PARTE DE ESTADO · CARGA` · `Nº 0001 · Ejemplo` · `Madrid · {dd-mm-aaaa} · {hh:mm}` (`Intl.DateTimeFormat('es-ES')`, hora del visitante).
  - Pies: `A · Delantera ¾ izq.`, `B · Trasera ¾ izq.`, `C · Trasera ¾ dcha.`, `D · Delantera ¾ dcha.`
  - Fila `ENTREGA · mismos cuatro ángulos` · `Firma`.
- Sello dibujado en cada captura: `CARGA · {dd-mm} · {hh:mm} · A`.

---

### 2.6 — 06 · Seguro `#seguro`

**Rango:** ~780–850 vh. Sin fijo. Fondo `--grafito` (se sale de la banda de papel). Canvas parado.

**Qué ve.** Calma tipográfica: el H2, un párrafo y una cifra. No hay ecuación, ni tachado, ni odómetro, ni entrada animada.

**Copy:**

- H2 `Asegurada por lo que vale.`
- Cuerpo `La póliza estándar de mercancías paga por kilo transportado, y una moto no vale lo que pesa. La nuestra cubre el valor que declares al reservar.`
- Cifra `Hasta 60.000 € por servicio` (fuente de cifras, estática) + nota `Cifra provisional` (el valor sale de `contacto.js`).

---

### 2.7 — 07 · Rutas `#rutas`

**Rango:** ~850–960 vh. **Sin fijo.** `--grafito`. Canvas parado.

**Qué ve.** Una **rosa de rutas** estática:

- Madrid es un punto en el centro. De él salen 25 rayos con su **rumbo geográfico real** y una longitud proporcional a los km de `tarifas.js`, desde Valladolid (195) hasta Empuriabrava (750). Rumbos, longitudes y etiquetas se calculan en el build (`lib/rosa.js`).
- No hay mapa de fondo.
- Los destinos náuticos llevan un punto hueco.
- Palma sigue el rayo de Valencia (355 km) y continúa **punteada sobre el mar** hacia Palma, con `+ ferry`.
- Debajo de la rosa, una línea de lectura fija (no un tooltip que siga al cursor) y el enlace `Ver los 25 destinos en tabla` → `#tarifas`.

**Qué se mueve:** solo la entrada única. Al 25 % de la entrada, los rayos crecen desde Madrid a velocidad constante (`stroke-dashoffset` con `pathLength="1"`, duración 0,4 s + 1,2 s · km/750), así que los largos tardan más: se leen como distancia. Cada etiqueta aparece al terminar su rayo. La rosa no gira.

**Interacción (solo escritorio):**

- Hover o foco en un rayo lo aísla (el resto al 20 %, 150 ms) y escribe en la línea de lectura `Madrid – Sevilla · 530 km · unas 7 h 05 min · moto desde 280 €`. Carga y precio salen del store en vivo.
- Cada rayo es un `<a>` con un trazo transparente de 20 px como zona de clic (`pointer-events: stroke`).
- Clic: `calc.fijar({ destino }, 'rutas')` + `irA('#precio')`. El select de destino muestra un filo `--aluminio` durante 600 ms.
- **En compacto** los rayos son `aria-hidden` y no interactivos: la interfaz es la tabla.

**Copy:**

- H2 `Salimos de Madrid hacia toda España.`
- Entrada `Toda la península por carretera y Baleares con ferry. La vuelta suma un 65 % sobre la ida.`

---

### 2.8 — 08 · Se baja igual `#contacto` (momento 3) + pie

**Rango:** entrada ~960–1060 vh, fijo ~1060–1110 (50 vh), después el bloque CTA en flujo (~1110–1170) y el pie.

**Entrada.** Rutas, que es opaca, sube y descubre el escenario. Antes de hacer visible el canvas, el director **renderiza el plano de destino** `cierre.a`: la moto atada sobre la plataforma, iluminada, en el encuadre del héroe (la rima). Nunca asoma un fotograma viejo.

**Fijo (p, `guion.cierre(p)`):**

| p | Qué ocurre |
|---|---|
| 0–0,30 | Cámara de `cierre.a` a `cierre.b` (dolly-in del 5 %, por p) |
| 0,30 (hacia delante, por tiempo, 1,4 s; `guion.desatado(t)`) | **Desatado.** La tensión cae de 1 a 0 con una sobreoscilación amortiguada. La cinta se recoge en la carraca (`reveal` 1 → 0 entre 0,5 y 1,2 s). El calzo sale (0,6–1,2 s). **«Se baja».** La plataforma baja de 0,35 a 0 con la moto encima (0,9–1,4 s) y vuelve a quedar enrasada: la moto termina sobre el suelo, como al empezar. Hacia arriba, al cruzar 0,30, se vuelve a atar por tiempo |
| 0,45 (hacia delante) | `Se baja igual.` entra por máscara (una línea, 1,1 s): Newsreader itálica monumental, **la única itálica de la web** |

**Bloque CTA** (`ContactoCta.astro`, en flujo después de la pista; fondo `--carbon` opaco). No vive en el escenario fijo, así que nunca hay un CTA invisible que reciba foco:

- Entrada `Cuéntanos qué es, dónde está y adónde va, y te contestamos con el precio.`
- CTA principal: `Escríbenos por WhatsApp` en Big Shoulders (`--t-cta`), en `--hueso`, con **subrayado-cincha** de 3 px en `--cincha`. El subrayado es un path SVG con una comba de 2 px que se endereza en hover y foco (200 ms). Enlaza a `wa.me` con el mensaje precargado (`a[data-wa]`). **No hay teléfono gigante.**
- Secundarios:
  - `Llamar · 600 000 000` (`tel:`);
  - `hola@calzo.es` como enlace `mailto:`, con un botón aparte `Copiar` (aviso `Copiado` en `aria-live` durante 1,4 s).
- Resumen, solo si el store tiene un cálculo: `Tu cálculo: moto · Madrid–Valencia · 205 €` + nota `Tarifa provisional`.

**Pie** (sin animación):

- La marca CALZO con el símbolo actual (rueda entre dos cuñas).
- `Calzo · Transporte de motos, quads y embarcaciones · Madrid · Toda España`
- `Nombre provisional · Tarifas orientativas y provisionales`
- `Aviso legal · Privacidad (pendientes)`, como texto y no como enlaces falsos.

---

### 2.9 Modo compacto (< 1024 px o `pointer: coarse`): alturas y diferencias

| Capítulo | Alto / fija (svh) | Diferencias |
|---|---|---|
| 01 pieza | 150 / 50 | El texto va encima de la moto. Suelo en `(0,5·W, 0,80·H)`. **Encaje por caja** (§4.9): la cámara se aleja hasta que la moto cabe en el 90 % del ancho, con fov ≤ 30° |
| 02 amarre | 300 / 200 | Mismos tramos en fracciones de `p`. Solo se animan las 2 cinchas delanteras; las traseras aparecen ya tensas al empezar su tramo. Las pausas son primeros planos sin encaje. Cenital con `arriba (1,0,0)`: el morro queda arriba y la X, vertical, cabe en pantalla. Traspaso idéntico |
| 03 precio | auto | Una columna. Marco con `--amarre-dx: 14px`, `--amarre-dy: 48px` y cinchas de 6 px. La lectura del precio va pegada (`sticky`) en la parte superior del panel |
| 04 cargas | auto | Láminas apiladas |
| 05 parte | auto | La hoja ocupa todo el ancho; capturas de 360 × 270 |
| 06 seguro | auto | — |
| 07 rutas | auto | Rosa a 92vw, no interactiva (`aria-hidden`); la interfaz es la tabla `#tarifas` |
| 08 contacto | pista 140 / 40 + CTA | CTA a ancho completo |

---

## 3. Sistema visual

### 3.1 Tokens (`src/styles/tokens.css`, dueño WP0)

La temperatura es fría: grafito con un punto de azul acero, plata y papel neutro. **El naranja es lo único cálido de la web**. Eso lo separa de la paleta de VYO (negro cálido + hueso cálido + naranja) y hace que el acento gane fuerza. Las luces 3D son neutras y plata, así que no hay etalonaje *teal & orange*.

```css
:root {
  /* — color: grafito frío; nunca #000 ni #fff — */
  --carbon: #0B0D0E;        /* fondo base y clearColor del canvas */
  --grafito: #131618;       /* seguro y rutas; nav tras el héroe */
  --grafito-alto: #1A1E21;  /* panel de precio (sólido) y campos */
  --junta: #262B2E;         /* hairlines de 1 px y bordes de campo (nunca texto) */
  --ceniza: #858C91;        /* texto secundario y notas «provisional» */
  --hueso: #E4E6E3;         /* texto principal y foco */
  --aluminio: #A7AEB3;      /* anillas, contorno de carracas, filo del select destacado */
  --cincha: #D2561F;        /* ÚNICO ACENTO */
  --cincha-floja: #2A2F33;  /* cincha sin tensión (3D y SVG) */
  --papel: #DCDDD8;         /* banda de papel: cargas + parte */
  --tinta: #121517;         /* texto y trazo sobre papel */
  --tinta-2: #4F565B;       /* secundario y cotas sobre papel */
  --luz-clave: #EFEEEA;     /* solo 3D: clave neutra (~5.600 K) */
  --luz-contra: #CDD2D5;    /* solo 3D: contras plata */
  --pintura: #26272A;       /* solo 3D: depósito */

  /* — tipografía — */
  --f-display: 'Big Shoulders Display Variable', 'BSD Narrow', 'BSD Roboto', 'BSD Arial', sans-serif;
  --f-texto: 'Newsreader Variable', 'NR Georgia', 'NR Noto', 'NR Times', serif;
  --f-cifras: 'Overpass Mono Variable', 'OM Consolas', 'OM Menlo', 'OM Roboto', monospace;
  --f-cierre: 'Newsreader Cierre', 'NR Georgia', serif;

  --t-etiqueta: .8125rem;
  --t-cifra: .9375rem;
  --t-cuerpo: clamp(1.0625rem, .95rem + .35vw, 1.25rem);
  --t-entrada: clamp(1.25rem, 1.05rem + .6vw, 1.625rem);
  --t-h3: clamp(1.625rem, 1.2rem + 1.4vw, 2.5rem);
  --t-h2: clamp(2.75rem, 1.4rem + 4.6vw, 7rem);
  --t-h1: clamp(3.25rem, 1.2rem + 6.6vw, 9.25rem);
  --t-precio: clamp(3.5rem, 1.8rem + 4.6vw, 7rem);
  --t-cta: clamp(2.5rem, 1.2rem + 4.2vw, 6rem);
  --t-cierre: clamp(3.5rem, 1rem + 8.4vw, 10.5rem);

  /* — espacio (móvil 20/30/50/75/100 → escritorio 60/90/140/200/280) — */
  --e-1: clamp(1.25rem, .5rem + 2.3vw, 3.75rem);
  --e-2: clamp(1.875rem, .8rem + 3.4vw, 5.625rem);
  --e-3: clamp(3.125rem, 1.2rem + 5.8vw, 8.75rem);
  --e-4: clamp(4.6875rem, 1.6rem + 9.6vw, 12.5rem);
  --e-5: clamp(6.25rem, 2rem + 13.3vw, 17.5rem);

  /* — rejilla — */
  --cols: 4; --gutter: 10px; --margin: 16px; --contenedor: 100rem;

  /* — forma — */
  --r-s: 2px; --r-m: 4px;
  --borde: 1px solid var(--junta);

  /* — movimiento — */
  --ease: cubic-bezier(.62, 0, .12, 1);
  --d-micro: .2s; --d-entrada: .9s; --d-cierre: 1.1s;

  /* — composición del héroe (compartida DOM ↔ 3D ↔ SVG) — */
  --suelo-y: 80svh; --suelo-x0: 8vw; --suelo-x1: 92vw;

  /* — traspaso: margen de las cinchas alrededor del panel — */
  --amarre-dx: 14px; --amarre-dy: 48px; --cincha-ancho: 6px;

  /* — capas — */
  --z-escena: 1; --z-main: 3; --z-cinchas: 4; --z-nav: 10; --z-barra: 10;
}
@media (min-width: 768px) {
  :root { --cols: 12; --gutter: 2vw; --margin: 4vw; }
}
@media (min-width: 1024px) and (pointer: fine) {
  :root {
    --suelo-y: 72svh; --suelo-x0: 46vw; --suelo-x1: 88vw;
    --amarre-dx: clamp(48px, 6vw, 112px); --amarre-dy: clamp(40px, 8svh, 96px); --cincha-ancho: 10px;
  }
}
```

Desaparecen respecto a la v1: `--vidrio`, `--vidrio-opaco`, `--filo`, `--halo-cincha`, `--t-numeral`, `--t-narrador`, `--t-telefono`, `--z-hud`, `--z-grano`, `--z-preloader`, `--z-corte` y `--z-instantanea`.

### 3.2 Tipografía

Tres familias, que es el techo: **una sola voz display**, una serif de lectura y una letra de cifras. Todas son woff2 autoalojadas vía **@fontsource-variable 5.3.0**. Los tamaños están medidos en el CDN y los glifos, comprobados con fontTools.

| Rol | Paquete | CSS (frontmatter de Layout) | `font-family` | woff2 latin | Ejes |
|---|---|---|---|---|---|
| Display (única voz de titulares) | `@fontsource-variable/big-shoulders-display` | `…/wght.css` | `'Big Shoulders Display Variable'` | `big-shoulders-display-latin-wght-normal.woff2` (34,7 KB) | wght 100–900 |
| Texto | `@fontsource-variable/newsreader` | `…/wght.css` (**solo redonda**) | `'Newsreader Variable'` | `newsreader-latin-wght-normal.woff2` (56,7 KB) | wght 200–800 (opsz fijo) |
| Cifras | `@fontsource-variable/overpass-mono` | `…/wght.css` | `'Overpass Mono Variable'` | `overpass-mono-latin-wght-normal.woff2` (21,5 KB) | wght 300–700 · `tnum` |
| Itálica del cierre | propia, `public/fuentes/newsreader-cierre.woff2` | `@font-face` en `global.css` | `'Newsreader Cierre'` | **1,9 KB** medidos: instancia opsz 72 · wght 300, solo los glifos de «Se baja igual.» | ninguno |

**Por qué estas letras:**

- **Big Shoulders** nace de la rotulación industrial de Chicago: letreros pintados, placas y cajas de camión. Aquí hace de **rótulo de chapa de remolque**. Se usa a peso medio (380–480), **en caja mixta** y nunca ultrafina ni en dos voces.
- **Overpass Mono** deriva de Highway Gothic, la letra de la señalización de carretera. Por eso solo lleva **cifras** (precio, km, tiempos) y el parte, como un cartel de ruta o un albarán impreso. Ninguna etiqueta ni kicker va en mono.
- **Newsreader** es solo cuerpo de texto (≤ 26 px). Su itálica aparece **una vez**: «Se baja igual.» en el cierre, instanciada a opsz 72 para que a tamaño monumental tenga contraste de display y no parezca una itálica de texto ampliada.

**Carga:**

- **Latin inicial:** 112,9 KB. La itálica del cierre (1,9 KB) no se precarga: se descarga al maquetar su h2.
- **Preload solo de Big Shoulders:** `import bsd from '@fontsource-variable/big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2?url'` → `<link rel="preload" href={bsd} as="font" type="font/woff2" crossorigin>`.
- **Se eliminan** el `<link>` a fonts.googleapis.com y los `preconnect`.
- **Itálica del cierre.** La genera `scripts/fuente-cierre.mjs` con `subset-font` (harfbuzz wasm) a partir de `newsreader-latin-opsz-italic.woff2`: `variationAxes: { opsz: 72, wght: 300 }`, texto `Se baja igual.`. El archivo se versiona.
- **Respaldo métrico contra el CLS.** Hay una `@font-face` **por cada fuente local**, con sus overrides medidos: `'BSD Narrow'` (`local('Arial Narrow')`), `'BSD Roboto'` (`local('Roboto')`, Android), `'BSD Arial'` (`local('Arial')`); `'NR Georgia'`, `'NR Noto'` (`local('Noto Serif')`), `'NR Times'`; `'OM Consolas'`, `'OM Menlo'`, `'OM Roboto'` (`local('Roboto Mono')`). Van encadenadas en cada `--f-*`.
  - `scripts/respaldo-fuentes.mjs` (WP0) calcula `size-adjust`, `ascent-override`, `descent-override` y `line-gap-override` con `@capsizecss/unpack` (métricas del woff2 real) y `@capsizecss/metrics` (métricas de cada fuente de sistema), y genera `src/styles/respaldos.css`.
  - El CLS objetivo (≤ 0,02) se verifica también en un Android real (§9.2 #16).
- **Glifos fuera del subconjunto latin** (comprobado en las 3 familias): `→` (U+2192), `▾` (U+25BE) y **`≈` (U+2248)**. Por tanto: las flechas y el chevron son SVG (`Flecha.astro`, `Chevron.astro`), y las duraciones se escriben «unas 4 h 45 min», nunca con `≈`. `€`, `×`, `·`, `—`, `–`, `¿`, `ñ`, las tildes y U+00A0 sí están.
- Big Shoulders **no tiene** `tnum`. Ninguna cifra que cambie va en display.

**Reglas de uso:**

- **Big Shoulders:**
  - H1: wght 420, caja mixta, line-height 0,9, tracking −0,02em.
  - H2: wght 400, line-height 0,92, −0,015em.
  - h3: wght 480, line-height 1,0, −0,01em.
  - Etiquetas (leyendas del formulario, «Desde», cabeceras de tabla): wght 600, `--t-etiqueta`, mayúsculas, +0,06em. Por debajo de 32 px, siempre wght ≥ 480.
  - CTA final: wght 440.
  - Logotipo `CALZO` del nav: 20 px, wght 560, sin efecto de hover.
- **Newsreader (redonda):**
  - Cuerpo en 400, line-height 1,5, máximo 58ch.
  - Entradas en `--t-entrada`.
  - Selects y campos en 400 a 1,125rem.
  - **Nunca itálica** fuera del cierre.
- **Overpass Mono:**
  - Precio: `--t-precio`, wght 400, `tabular-nums`, line-height 0,9, −0,03em. Al recalcular, fundido cruzado de 180 ms: no hay pulso ni odómetro.
  - Km, tiempos, desglose y todo el parte: `--t-cifra`, wght 400.
- **Newsreader Cierre:** solo `h2#contacto-h`, `--t-cierre`, line-height 0,95, −0,02em.
- **Numeración:** solo donde es dato (fotos A–D, «Nº 0001»). **No hay kickers numerados** ni índices con números.

### 3.3 Escala tipográfica (resumen)

| Token | Familia / peso | Mín → máx | line-height | tracking |
|---|---|---|---|---|
| `--t-etiqueta` | Big Shoulders 600, mayúsculas | 13 px fijo | 1,2 | +0,06em |
| `--t-cifra` | Overpass Mono 400 | 15 px fijo | 1,4 | 0 |
| `--t-cuerpo` | Newsreader 400 | 17 → 20 px | 1,5 | 0 |
| `--t-entrada` | Newsreader 400 | 20 → 26 px | 1,4 | −0,005em |
| `--t-h3` | Big Shoulders 480 | 26 → 40 px | 1,0 | −0,01em |
| `--t-h2` | Big Shoulders 400 | 44 → 112 px | 0,92 | −0,015em |
| `--t-h1` | Big Shoulders 420, caja mixta | 52 → 148 px | 0,9 | −0,02em |
| `--t-precio` | Overpass Mono 400, tabular | 56 → 112 px | 0,9 | −0,03em |
| `--t-cta` | Big Shoulders 440 | 40 → 96 px | 0,95 | −0,015em |
| `--t-cierre` | Newsreader Cierre, itálica 300 · opsz 72 | 56 → 168 px | 0,95 | −0,02em |

### 3.4 Espaciado y rejilla

- `.rejilla { display:grid; grid-template-columns: repeat(var(--cols), 1fr); gap: var(--gutter); padding-inline: var(--margin); max-width: var(--contenedor); margin-inline: auto; }`. Son 4 columnas en móvil (margen de 16 px) y 12 desde 768 px.
- Aire en las secciones no fijas: `padding-block: var(--e-5)`, de 100 px en móvil a 280 px a partir de 1920 px. **Nunca menos de 140 px en escritorio.** Dentro de una sección, `--e-2`/`--e-3`.
- Los escenarios fijos no llevan padding de sección: su composición es absoluta respecto al viewport (solo bajo `html.js:not(.reducido)`, §5.2).
- `html { overflow-x: clip }`: `clip` y no `hidden`, porque no crea contenedor de scroll y no rompe `sticky`. Se elimina `body { overflow-x: hidden }`.

### 3.5 Textura: sin grano en el DOM

No hay capa de grano. El banding del degradado del suelo se evita con `dithering: true` en el material del suelo (ruido estático de ±0,5/255 dentro del shader, §4.5). Sobre el DOM no hay nada.

### 3.6 Superficies

- **Panel de precio:** sólido, `--grafito-alto`, `--r-m`. Sin `backdrop-filter`, sin filo superior y sin halo.
- **Nav:** transparente sobre el héroe. Con `html.nav-solida` (activo ≠ pieza) pasa a `rgb(19 22 24 / .92)` sólido con hairline inferior `--borde`. Sin `backdrop-filter`: la v1 demostró que en algunas GPU deja de pintar lo de debajo.
- **Banda de papel:** `--papel` a sangre en `#cargas` y `#parte`. Es el único plano claro.

### 3.7 Luz, bordes y radios

- **Sin `box-shadow`** en ningún elemento. La profundidad viene de las hairlines de 1 px (`--junta`), del cambio de plano (carbón ↔ papel) y de las cinchas que sujetan el panel.
- **Sin glow** en el DOM. El testigo de manga es un punto de 10 px en `--cincha`, sin halo y sin parpadeo.
- **Radios:** `--r-m` (4 px) en el panel y la hoja; `--r-s` (2 px) en campos y botones; `50%` solo en el testigo, las anillas y los puntos de la rosa.
- **Foco:** `outline: 2px solid var(--hueso); outline-offset: 3px` en todo elemento interactivo. **Dentro de la banda de papel**, `outline-color: var(--tinta)`. El foco nunca se quita.

### 3.8 Movimiento

- **Un único CustomEase de marca:** `CustomEase.create('calzo', '0.62,0,0.12,1')`. Arranque pesado y llegada larga, como una carga que se deja apoyar. En CSS, `--ease`. En JS puro (guion), `easeCalzo = bezier(0.62, 0, 0.12, 1)` (§5.7).
- `gsap.defaults({ ease: 'calzo', duration: 0.9 })`.
- **Duraciones:** 0,18–0,2 s en microinteracciones; 0,9 s en entradas únicas; 1,1 s en la frase del cierre; 1,4 s en el desatado; 1,6 s en el barrido de la intro. Saltos de navegación: `clamp(distancia/2500, 1,1, 2,4)` s.
- **Muelles** (`muelleCritico`): cámara λ = 6; asiento del calzo y del panel ω = 33; tensión por clic 120 ms.
- El inventario completo de lo que se mueve está en §1.4. Los titulares no se revelan: ya están.

### 3.9 Iconografía

- Flecha SVG de 14 px con trazo de 1,8 px (`Flecha.astro`, path `M1 7h11M8 3l4 4-4 4`).
- Chevron SVG de 12 px para los selects (`Chevron.astro`).
- Pictogramas de carga de 28 px con línea de 1 px (`Pictos.astro`: moto, quad, barco, coche).
- Se reutiliza la marca actual (rueda entre dos cuñas) en el nav y el pie.
- Patrón `#tejido`, compartido por las cintas SVG (definido una vez en Layout, §5.2): líneas diagonales de 1 px en `--carbon` al 18 %, cada 6 px, `patternUnits="userSpaceOnUse"`.

---

## 4. La moto procedural

### 4.1 Sistema de coordenadas y cotas generales

- **Unidades:** metros. **+X hacia delante** (rueda delantera), **+Y arriba**, **+Z a la izquierda del piloto**.
- **Origen del rig:** el punto medio entre los contactos de las ruedas, sobre el plano de apoyo.
- **Tipología:** naked neorretro bicilíndrica en línea, sin marca reconocible y sin carenado. Depósito en gota, faro redondo, motor a la vista con aletas, doble amortiguador y llantas de 5 radios. El código hace bien tubos, revoluciones, discos y aletas; los carenados de superficie libre quedan fuera.

| Cota | Valor |
|---|---|
| Batalla | 1,45 (ejes en x = ±0,725 e y_local = 0,31) |
| Rueda | Ø 0,62 (radio exterior 0,31); llanta Ø 0,432 (17″) |
| Ancho de neumático | delantero 0,12 · trasero 0,17 |
| Largo total | ≈ 2,10 (x de −1,06 a +1,04) |
| Altura de asiento | ≈ 0,83 |
| Ancho de manillar | 0,76 (z ±0,38) |
| Lanzamiento | 25°. Eje de horquilla desde el eje delantero con dirección d = (−0,4226, 0,9063, 0) |
| **Cota de apoyo** | La huella del neumático está en **y_local = 0,006**. `rig.setApoyo(y)` pone `root.position.y = y − 0,006`, así que la huella queda exactamente en el plano de apoyo. La moto **siempre** apoya en la cara superior de la plataforma: `y = plataformaY`, que vale 0 cuando está enrasada (héroe y final del cierre) y 0,35 cuando está arriba (amarre, parte y principio del cierre) |

### 4.2 Piezas y geometría

La columna t indica la distancia desde el eje delantero a lo largo de d. **Todo extremo libre de tubo** (TubeGeometry, latiguillos, colectores, manillar) lleva tapa: un disco `CircleGeometry` o un Lathe corto redondeado.

| Pieza | Geometría | Datos | Grupo |
|---|---|---|---|
| Neumáticos | `LatheGeometry` de sección redondeada (24 puntos: hombro, banda, flanco), 96 segmentos (48 en medio), girada para eje Z | Ext. 0,31; ancho 0,12/0,17. Normal map de dibujo (GPU, 1024×256). **Huella:** los vértices con y_local < 0,006 pasan a y_local = 0,006 (parche plano de 6 mm); el rig entero baja 6 mm con `setApoyo` | del / tras |
| Llantas | Labio y canal en `LatheGeometry` + 5 radios dobles en `ExtrudeGeometry` (Shape estrella, bisel 1,5 mm) + buje en Lathe | Radio 0,216; labio diamantado (anillo aparte, rugosidad 0,08) | del / tras |
| Discos | `ExtrudeGeometry` de anillo con 18 taladros (`Shape.holes`), 5 mm | Delanteros Ø 0,32 en z = ±0,07; trasero Ø 0,24 en z = −0,06 | del / tras |
| Pinzas | `RoundedBoxGeometry(0,09; 0,05; 0,035; 2; 0,008)` | Detrás de cada disco, a las 8 en punto | del / tras |
| Horquilla | Barras (cromo) Ø 0,043 de t = 0,36 a 0,70; botellas (anodizado) Ø 0,056 de t = 0,02 a 0,36; en z = ±0,10 | Las barras van en el grupo suspendido (se deslizan dentro de las botellas) | susp. / del |
| **Tijas** | `ExtrudeGeometry` de un Shape (barra de z −0,14 a +0,14 con bosses alrededor de tubos y pipa), grosor 0,03 (inferior) y 0,025 (superior), bisel 3 mm; 6 tornillos Allen en `InstancedMesh` | Inferior en t = 0,50 → (0,514; 0,763); superior en t = 0,66 → (0,446; 0,908). Perpendiculares al eje. **Máxima densidad de detalle**: es el primer plano de la pausa `tija` | susp. |
| Manillar y mandos | `TubeGeometry` Ø 0,022 sobre un `CurvePath` (rectas + codos) por (0,40; 0,99; ±0,38) → (0,43; 0,97; ±0,20) → (0,44; 0,955; 0), con tapas. Puños Lathe Ø 0,032 × 0,13 con moleteado en normal map. Manetas extruidas. Piñas `RoundedBox 0,05×0,04×0,035` en z ±0,29. Bomba de freno (dcha.) y maneta de embrague (izda.). Reloj Lathe Ø 0,11 en (0,46; 1,02; 0) | — | susp. |
| Faro | Carcasa Lathe Ø 0,18 × 0,12 en (0,60; 0,88; 0); reflector parabólico Lathe (cromo, rugosidad 0,05); lente con clearcoat; aro emisivo `--luz-clave` | Intensidad del aro 0,6 | susp. |
| **Depósito** | **Loft propio**: 14 secciones superelípticas (exponente 2,6) interpoladas con CatmullRom desde la tabla inferior, con tapas redondeadas | Tabla (x: semiancho, techo, suelo): 0,40: 0,08/0,915/0,85 · 0,33: 0,13/0,955/0,81 · 0,25: 0,16/0,985/0,79 · 0,15: 0,17/1,000/0,78 · 0,05: 0,16/0,995/0,78 · −0,02: 0,135/0,975/0,785 (hueco de rodillas) · −0,08: 0,14/0,955/0,79 · −0,13: 0,11/0,93/0,80. Tapón Lathe en (0,18; 1,0) | susp. |
| Asiento y colín | Asiento: loft de 6 secciones de (−0,12; 0,84) a (−0,62; 0,86), ancho 0,26, grosor 0,07. Colín corto hasta x −0,80, afilado. Piloto con lente ahumada **sin emisión** | — | susp. |
| Chasis | ~22 tubos Ø 0,025. Cada larguero es un **`CurvePath` de `LineCurve3` con codos `QuadraticBezierCurve3` de radio 0,03**: rectas de verdad, sin ondulación de CatmullRom. Largueros z ±0,11: (0,47;0,87) → (0,25;0,80) → (−0,05;0,68) → (−0,18;0,55) → (−0,20;0,47). Bajantes: (0,46;0,80) → (0,20;0,36) → (−0,05;0,30) → (−0,20;0,40). Subchasis z ±0,10: (−0,12;0,74) → (−0,80;0,80), más riostras (−0,20;0,50) → (−0,55;0,76). Pipa de dirección en Lathe. **Collarín (toro fino) en cada unión** | — | susp. |
| Motor | Cárter: `ExtrudeGeometry` del perfil (0,22;0,30), (0,25;0,42), (0,10;0,50), (−0,12;0,52), (−0,20;0,40), (−0,15;0,28), (0,05;0,24), ancho 0,30, bisel 8 mm. Dos cilindros en z ±0,07, inclinados 20° hacia delante, base (0,10; 0,50), alto 0,20, con **11 aletas por cilindro** (`InstancedMesh` de `RoundedBox 0,13×0,004×0,11` cada 0,016, escala decreciente). Culata RoundedBox. Tapas laterales Lathe Ø 0,16 en z ±0,155 (aluminio) | — | susp. |
| Escape | 2 colectores `TubeGeometry` Ø 0,038 sobre `CurvePath` con codos de radio ≥ 3 diámetros: (0,22;0,62;±0,07) → (0,30;0,40) → (0,15;0,22) → (−0,20;0,20). Silencioso Lathe cónico Ø 0,10 → 0,085, de (−0,35;0,30;−0,16) a (−0,78;0,40;−0,18), con tapa trasera | Cromo satinado | susp. |
| Basculante | `ExtrudeGeometry` de sección cajón 0,05×0,035 (bisel 4 mm) a lo largo del path pivote (−0,20; 0,47) → eje (−0,725; 0,31), en z ±0,13 | — | tras |
| Amortiguadores | Doble. Cuerpo Lathe + muelle `TubeGeometry` sobre hélice de 9 espiras (radio 0,03, hilo 0,006), de (−0,62;0,36;±0,13) a (−0,50;0,78;±0,12) | — | susp. |
| Cadena | `InstancedMesh` de 110 eslabones (`RoundedBox 0,016×0,009×0,010`) sobre el path piñón r 0,045 en (−0,10;0,34;+0,12) ↔ corona r 0,10 en el eje trasero | 1 draw call | tras |
| Detalles «de verdad» | Latiguillos y cables `TubeGeometry` Ø 0,006 con catenaria natural (bomba → pinza delantera, maneta → motor), con tapas; estriberas `RoundedBox` con normal estriado en (−0,18; 0,36; ±0,17); guardabarros delantero (arco extruido de 130°, ancho 0,13) | Sin retrovisores ni piloto | varios |

**Presupuesto de triángulos por tier:** alto ≤ 180k (moto ≈ 150k); medio ≤ 90k (segmentos de tube/lathe a la mitad). Los segmentos se parametrizan con `opts.tier`.

### 4.3 Grupos, nodos y anclajes (contrato `MotoRig`)

Grupos, con la geometría estática fusionada **por material dentro de cada grupo** (`mergeGeometries`):

- `suspendida`: chasis, motor, depósito, asiento, colín, faro, tijas, barras, manillar, escape y amortiguadores. Pivota alrededor del empty `pivote_suspension` en el eje trasero (−0,725; 0,31; 0).
- `delantera`: botellas, rueda delantera, discos, pinzas y guardabarros. Es fija.
- `trasera`: rueda trasera, basculante y cadena. Es fija.

**Preparación obligatoria antes de fusionar** (`three/moto/preparar.ts`, WP1). `prepararPieza(geo, pieza: PiezaId): BufferGeometry`:

1. `geo.index ? geo.toNonIndexed() : geo`. Todas las geometrías de un grupo quedan sin índice (ExtrudeGeometry no lo tiene; Lathe, Tube, Torus y RoundedBox sí), porque `mergeGeometries` devuelve `null` si se mezclan.
2. Borra todo atributo que no sea `position`, `normal` o `uv`. Si falta `uv`, lo crea a cero (la anisotropía lo necesita).
3. Añade `aPieza` (Float32, un valor por vértice = `PIEZA_NUM[pieza]`).
4. Si `mergeGeometries` devuelve `null`, lanza un error con el nombre de la pieza: nunca falla en silencio.

**`InstancedMesh`** (tornillos, aletas, cadena): su geometría base lleva un `aPieza` normal (no instanciado) con el id de la pieza en todos los vértices. Así los 6 tornillos Allen de la tija se iluminan con la tija.

**`setHorquilla(t)`:** gira `suspendida` alrededor de `pivote_suspension` en −θ, con θ = t · 0,028 · 0,9063 / 1,45 rad (≈ 1° con t = 1). Las barras entran en las botellas unos 28 mm a lo largo del eje. El error respecto a una compresión puramente axial es inferior a 1 mm.

**`setFoco(pieza, mezcla)`:** `U.uFoco = PIEZA_NUM[pieza]` (o −1 con `null`) y `U.uAtenuacion = lerp(1, 0,15, mezcla)`. Solo cambia uniforms: nunca recompila.

**`setApoyo(y)`:** `root.position.y = y − 0,006` (§4.1).

**Atributo `aPieza`:** 0 resto · 1 tija · 2 mandos · 3 rueda_del · 4 horquilla · 5 deposito · 6 motor.

**Anclas** (Object3D con nombre y coordenadas del rig en reposo; las del grupo suspendido se mueven con él):

| Ancla | Posición | Uso |
|---|---|---|
| `hs_tija` | (0,50; 0,80; 0,02) | Pausa `tija`: encuadre y blanco de la clave |
| `hs_rueda` | (0,80; 0,24; 0,00) | Pausa `rueda` |
| `hs_horquilla` | (0,62; 0,54; 0,08) | Pausa `horquilla` |
| `anc_cincha_tija_I` / `_D` | (0,51; 0,76; ±0,145) | Extremo B de las cinchas delanteras (fuera de la tija inferior) |
| `anc_cincha_tras_I` / `_D` | (−0,55; 0,62; ±0,156) | Extremo B de las cinchas traseras (subchasis) |
| `anc_calzo` | (0,725; 0,006; 0) | Contacto delantero; el calzo se coloca aquí |
| `anc_contacto_del` / `_tras` | (±0,725; 0,006; 0) | Encuadre del héroe (punto medio) y sombra de contacto |
| `anc_deposito` | (0,15; 1,00; 0) | Encuadre de detalle |
| `pivote_suspension` | (−0,725; 0,31; 0) | Pivote de `setHorquilla` |

### 4.4 Plataforma, calzo y cinchas (dueño WP2)

**Plataforma.**

- Un bloque de 2,60 × 0,90 m (x ±1,30, z ±0,45) y 0,40 m de alto: la cara superior en y = 0 del grupo y el cuerpo hasta −0,40, para que al subir 0,35 nunca se vea su fondo. Bisel de 6 mm en las aristas superiores.
- Cara superior: chapa lagrimada de aluminio cepillado (normal map GPU de 1024², rombos a 45°). Costados: `anodizado`, con carriles laterales en U (extrusión 0,03) en el borde superior.
- Cuatro anillas `TorusGeometry(0,028; 0,006)` sobre la cara superior, en las posiciones de la tabla (coordenadas del grupo de la plataforma).
- **Recorrido:** `plataforma.position.y = plataformaY`. En reposo vale 0 (enrasada con el suelo; es la plataforma sobre la que está la moto del héroe) y arriba, 0,35. El director llama siempre a `rig.setApoyo(plataformaY)`.
- **Junta del elevador:** el suelo tiene un hueco rectangular de 2,624 × 0,924 m, 12 mm mayor que la plataforma por cada lado. Por esa ranura se ve el `clearColor` (carbón): es la línea oscura que ancla el canto y por la que la plataforma sale y vuelve a entrar. No hay coplanaridad entre suelo y chapa, así que no hay *z-fighting*.

| Anilla (coordenadas del grupo de la plataforma) | Posición |
|---|---|
| `anc_anilla_del_I` / `_D` | (1,20; 0,006; ±0,34) |
| `anc_anilla_tras_I` / `_D` | (−1,20; 0,006; ±0,34) |

**La X perfecta.** Las anillas y los extremos B están sobre las dos diagonales de la planta que pasan por el origen, z = ±0,2833·x:

- Diagonal 1: delantera izquierda ↔ trasera derecha.
- Diagonal 2: delantera derecha ↔ trasera izquierda.

Desde una cámara cenital justo encima del origen, la proyección radial conserva las direcciones. Por eso las cuatro cinchas forman una X exacta con el centro tapado por la silueta de la moto.

**Calzo.**

- `ExtrudeGeometry` de un perfil en U (cuna): base 0,34 × 0,16 bajo el neumático, tope delantero en arco hasta 0,25 de alto en x +0,20 desde el contacto y labio trasero de 0,04. Bisel de 4 mm.
- Aluminio cepillado y taco de goma.
- Posición: `anc_calzo` + el desplazamiento x del guion (0,55 m como máximo: el borde delantero de la plataforma). Apoya en la cara superior de la plataforma. Solo es visible desde el tramo `calzo` del amarre y hasta que sale en el desatado (`calzoVisible`, §5.7).

**Cinchas: cinta analítica, una malla por cincha (4).**

- `BufferGeometry` de 49 × 2 vértices (índices fijos). Posiciones y normales se **reescriben en el mismo `Float32Array`** cada frame en que cambian (`needsUpdate`). `frustumCulled = false`, **`castShadow = false`**.
- Curva: `P(u) = lerp(A, B, u) + abajo · s · 4u(1−u) + lateral · l · sin(πu)`:
  - A = anilla, B = ancla de la tija o del subchasis.
  - Flecha `s = 0,16 · max(0, 1 − T)^1,5` m; giro lateral `l = 0,03 · max(0, 1 − T)`. T puede bajar a −0,15 durante el desatado (§5.7).
- Ancho 0,035 m. El vector lateral es fijo por cincha, `normalize(cross(B − A, (0,1,0)))`, y se calcula una vez para que no degenere.
- **Convención de lados** (la comparten 3D, SVG y traspaso): el borde «izquierdo» de la cinta es el que queda a la izquierda mirando de A hacia B en pantalla.
- Lazo en B: un toro parcial de 300° (radio 0,028) que escala de 0 a 1 en 120 ms cuando `reveal` ≥ 0,98.
- **Carraca** en A (`amarre/carraca.ts`): un cuerpo extruido de 0,07 × 0,04 × 0,03 y una palanca extruida aparte (2 mallas). La palanca gira 3° por paso.
- Material: `MeshStandardMaterial`, rugosidad 0,7, normal map de tejido diagonal (GPU, 128 px) y recorte por `uReveal` (`discard` si `vUv.x > uReveal`).
- Color: `mix(lineal('#2A2F33'), lineal('#D2561F'), clamp(T,0,1)^1,2)`, más un emisivo de fresnel en el borde × T.
- Inyección de color exacto en §4.6.
- **`uVisible(cam, oclusor)`**: se calcula una vez, tras construir la moto, en `am.cenital` con la cámara objetivo exacta, horquilla = 1 y plataforma arriba. Lanza 20 rayos desde la cámara a `P(u)` con u de 0 a 1 y devuelve la primera u tapada por la moto. Con ella se sabe dónde sale la cinta de la silueta (`bVisible`, §5.4).

### 4.5 Materiales (`MeshPhysicalMaterial` salvo que se indique)

| Rol | Color | Parámetros |
|---|---|---|
| `pintura` | #26272A | metalness 0,55 · roughness 0,38 · clearcoat 1 · clearcoatRoughness 0,06 · clearcoatNormalMap de ruido fino (GPU 256², normalScale 0,04: piel de naranja) |
| `cromo` | #C9CBCC | metalness 1 · roughness 0,08 |
| `cromo_satinado` | #B7BABC | metalness 1 · roughness 0,22 (escape) |
| `aluminio` | #A7AAAC | metalness 1 · roughness 0,30 · **anisotropy 0,6 desde la creación** (necesita `uv`) |
| `anodizado` | #1D1F21 | metalness 0,6 · roughness 0,42 (botellas, pinzas, chasis) |
| `fundicion` | #28292A | metalness 0,7 · roughness 0,55 (motor: los filos de las aletas cogen la luz) |
| `metal_disco` | #6C6E70 | metalness 1 · roughness 0,35 |
| `goma` | #111213 | metalness 0 · roughness 0,9 · normalMap de dibujo o moleteado |
| `asiento` | #151617 | roughness 0,75 · sheen 0,35 · **sheenColor #3A3D40** (por defecto es negro y no se vería) · sheenRoughness 0,8 |
| `faro_lente` | #0E0F10 | roughness 0,05 · clearcoat 1 · sin transmission |
| `faro_aro` | — | `MeshStandardMaterial` · emissive #EFEEEA · intensidad 0,6 |
| `cincha` | §4.4 | `MeshStandardMaterial` |
| `plataforma` | #8E9194 | metalness 1 · roughness 0,34 · normalMap lagrimado · anisotropy 0,4 |
| `suelo` | #0B0D0E | `MeshStandardMaterial` · roughness 0,32 · metalness 0 · alphaMap radial · `transparent` · **`dithering: true`** |

**Reglas:**

- Todos los materiales de la moto comparten un `roughnessMap` de ruido de 256² (±0,06), generado en GPU, para romper la perfección de CG.
- Ninguna capa física (clearcoat, sheen, anisotropy) se anima desde 0 exacto, porque eso recompila el shader.
- **Clave de programa:** `customProgramCacheKey = () => 'calzo-' + nombreInyeccion`, única por cada `onBeforeCompile` distinto (`moto`, `cincha`, `suelo`…). Nunca una clave común para inyecciones distintas.
- **Programas:** el tope se mide con `info().programas` y queda en **≤ 24** (§7.6). Todos se precompilan con `renderer.compileAsync` en la carga.

### 4.6 Inyección de shader común (`materiales.ts`, `onBeforeCompile`)

Uniforms compartidos (un único objeto `U` por escena): `uBarridoX`, `uBarridoAncho` (0,18 m), `uBarridoI`, `uColorContra` (#CDD2D5), `uFoco` (−1 = ninguna), `uAtenuacion` (1 = sin atenuar).

- **Vertex:** atributo `aPieza` → `varying vPieza`; `varying vPosMundo = (modelMatrix * vec4(transformed, 1.)).xyz`. En `InstancedMesh`, `modelMatrix * instanceMatrix`.
- **Fragment**, tras `#include <emissivemap_fragment>`:
  ```glsl
  vec3 V = normalize(vViewPosition);
  float fres = pow(1.0 - saturate(dot(normalize(normal), V)), 3.0);
  float banda = exp(-pow((vPosMundo.x - uBarridoX) / uBarridoAncho, 2.0));
  totalEmissiveRadiance += uColorContra * fres * banda * uBarridoI;
  ```
- **Fragment**, justo antes de `#include <tonemapping_fragment>`:
  ```glsl
  float esFoco = step(abs(vPieza - uFoco), 0.5);
  gl_FragColor.rgb *= mix(1.0, mix(uAtenuacion, 1.0, esFoco), step(0.0, uFoco));
  ```
- **Cincha (color exacto en el traspaso):** antes de `#include <colorspace_fragment>`, `gl_FragColor.rgb = mix(gl_FragColor.rgb, uCinchaLin, uSinLuz);`, donde `uCinchaLin = new Color('#D2561F')` (three la convierte a lineal). El render va **directo al canvas, sin composer y sin transform CSS**, así que la salida sRGB es exactamente `#D2561F`, el mismo valor que el SVG del DOM. La cincha no lleva `dithering`.

### 4.7 Iluminación y entorno

**Render.** `WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })`.

- `toneMapping = AgXToneMapping`, `toneMappingExposure = 0.9`, `outputColorSpace` sRGB (por defecto).
- `setClearColor('#0B0D0E')`: al canvas se escribe sin tone mapping, así que coincide con el `body`.
- **Sin EffectComposer ni bloom.**

**Entorno PMREM propio** (`entorno.ts`, WP1). Se genera una sola vez con `pmrem.fromScene(estudio, 0.02, 0.1, 100, { size: 256 })` (128 en tier medio). Es una sala negra (`BoxGeometry` de 12 × 6 × 12 por dentro, `MeshBasicMaterial` #000000) con tres tiras emisivas (`MeshBasicMaterial`, color × intensidad):

| Tira | Tamaño y posición | Color | Intensidad |
|---|---|---|---|
| T1 cenital longitudinal | 5,0 × 0,08 × 0,5 en (0; 4,2; 0) | #EFEEEA | 6 |
| T2 lateral izquierda | 0,4 × 2,6 × 0,06 en (1,5; 1,6; 4,0) | #CDD2D5 | 4 |
| T3 contra trasera | 3,0 × 0,4 × 0,06 en (−4,5; 1,2; −1,0) | #CDD2D5 | 3 |

- Los reflejos largos de automoción salen de aquí, no de RoomEnvironment.
- Los barridos se hacen rotando `scene.environmentRotation.y`, sin regenerar el PMREM, y con `scene.environmentIntensity` (0,05–0,6 según el capítulo).

**Luces.** La configuración se decide **una sola vez** en la carga, según el tier y el benchmark. Después nunca cambia el número ni el tipo de luces, ni se activan o desactivan sombras (§7.7).

- **Clave:** `SpotLight` #EFEEEA, intensidad de partida 35, ángulo 0,45, penumbra 0,9, decay 2. Posición (2,6; 3,2; 2,4). El director mueve su target (origen, o el ancla de la pausa activa).
  - **Sombras solo en tier alto**, fijadas en la carga: `PCFShadowMap` de 1024², `shadow.radius = 3`, `normalBias 0,02` y cámara de sombra ajustada a la plataforma. `renderer.shadowMap.autoUpdate = false`: el director pone `needsUpdate = true` solo cuando cambian el rig, la plataforma, el calzo o la horquilla. Emisores: moto, calzo y carracas. Receptores: suelo y plataforma. Las cinchas no proyectan.
- **Contras (todos los tiers):** 2 `DirectionalLight` #CDD2D5. A: intensidad 1,2 desde (−2,2; 1,6; −1,8) hacia (0; 0,6; 0). B: intensidad 0,8 desde (−1,0; 2,4; 2,2). **No hay RectAreaLight**: las tiras T2/T3 del PMREM ya dibujan el contorno.
- **Relleno:** ninguno (clave baja). Lo da el entorno.
- **Flash:** `PointLight` #F1F1EE colgado de la cámara, decay 2. Intensidad 0 siempre, salvo dentro de los presets de captura `parte.*` (12). No se usa en la página visible.

**Suelo:** `ShapeGeometry` de un círculo de radio 8 en y = 0 con el hueco de la junta (`Shape.holes`), UV = posición/16 + 0,5, alphaMap radial (GPU) que lo funde en el carbón y `dithering`. La sombra de contacto es un plano en `yApoyo + 0,001` con una textura GPU de 512² (elipse difusa de 2,0 × 0,5 m y dos manchas densas en los contactos), en `multiply`. **Un objeto apoyado no es un juguete; uno que flota, sí.**

**Valores por capítulo** (los aplica el director desde el guion):

| Capítulo | Entorno | Clave | Contras | Otros |
|---|---|---|---|---|
| pieza | 0,15 → 0,6 | 0 → 1 | 1,0 | Barrido solo en la intro (`uBarridoI` 1,2) |
| amarre: plataforma a compresión | 0,5 | 1 (target en el ancla de la pausa) | 1,0 | `uAtenuacion` 0,15 en las pausas |
| amarre: grúa y traspaso | 0,5 → 0,05 | 1 → 0 | 1 → 0,35 | `uSinLuz` 0 → 1 |
| contacto | 0,45 | 0,8 | 1,0 | — |
| presets `parte.*` | 0,1 | 0,15 | 0,5 | Flash 12 |

### 4.8 Estados de la moto

| Estado | Cómo | Dónde |
|---|---|---|
| **Sólido** (por defecto) | Materiales físicos | Todos los capítulos 3D |
| **Barrido** | `uBarridoX` + fresnel (§4.6) | Intro del héroe |
| **Aislado** | `setFoco(pieza, mezcla)`: la pieza iluminada y el resto al 15 % | Pausas del amarre |
| **Silueta** | Clave 0, entorno 0,05: solo las contras dibujan el filo | Grúa y cenital |

Ya no existen los estados «Líneas» (EdgesGeometry), «Fantasma», «Cotas» ni «Partículas» (§10.4).

### 4.9 Planos de cámara (`planos.ts`, dueño WP2; *valores de partida*)

`Plano = { pos, mira, fov, punto, encuadre, encuadreCompacto?, encajeCompacto?, arriba?, arribaCompacto? }`.

- **Encuadre:** dónde cae en pantalla el `punto` (ancla u origen), en fracciones del **viewport visible** (`innerWidth` × `innerHeight`). El director lo resuelve con `camera.setViewOffset(Wc, Hc, px − tx, py − ty, Wc, Hc)`, donde (px, py) es la proyección sin desplazamiento y (tx, ty) = encuadre · (innerWidth, innerHeight). El canvas mide 100vw × 100lvh; lo que sobra abajo en móvil queda fuera de pantalla.
- **Encaje compacto** (`'rig'`: las 8 esquinas de `rig.caja`; `'x'`: `rig.caja` + las 4 anillas; `null`: sin encaje, para primeros planos). En compacto, el director aleja la cámara a lo largo de su dirección de visión hasta que los puntos caben en el 90 % del ancho y del alto: `d' = d · max(1, anchoProyectado/(0,9·W), altoProyectado/(0,9·H))`, en dos iteraciones. **El fov nunca pasa de 30° en ningún plano ni tier.** En compacto no se suma fov: se aleja la cámara.
- **Orientación:** cada plano precalcula un cuaternión con su propio `arriba` (por defecto (0,1,0)).
- **Altura:** los planos marcados **+A** suman el apoyo de la plataforma subida (0,35 m) a la y de `pos` y `mira`. En los tramos donde se usan, la plataforma ya está arriba, así que el valor es constante. `am.bajo` y los planos del héroe y del cierre son absolutos. Los `punto` que son anclas se mueven con el rig, así que el encuadre las sigue.

| Id | pos | mira | fov | punto → encuadre (escritorio / compacto) | Encaje compacto |
|---|---|---|---|---|---|
| `pieza.a` | (3,10; 0,90; 2,60) | (0,00; 0,52; 0,00) | 26 | contactos → (0,67; 0,72) / (0,5; 0,80) | `rig` |
| `pieza.b` | (2,70; 0,55; 2,20) | (0,05; 0,50; 0,00) | 24 | ídem | `rig` |
| `am.bajo` | (2,40; 0,55; 2,10) | (0,20; 0,35; 0,00) | 24 | origen → (0,62; 0,66) / (0,5; 0,64) | `rig` |
| `am.rueda` +A | (1,95; 0,32; 1,05) | (0,80; 0,24; 0,00) | 22 | hs_rueda → (0,64; 0,52) / (0,5; 0,62) | `null` |
| `am.calzo` +A | (1,85; 0,32; 0,95) | (0,85; 0,15; 0,00) | 22 | anc_calzo → (0,64; 0,62) / (0,5; 0,66) | `null` |
| `am.tija` +A | (1,25; 1,05; 0,70) | (0,50; 0,80; 0,02) | 20 | hs_tija → (0,64; 0,50) / (0,5; 0,60) | `null` |
| `am.delanteras` +A | (2,35; 0,85; 1,75) | (0,85; 0,40; 0,00) | 24 | mira → (0,62; 0,52) / (0,5; 0,60) | `rig` |
| `am.traseras` +A (travelling) | de (0,60; 0,75; −3,10) a (−0,60; 0,75; −3,10) | de (0,10; 0,40; 0,00) a (−0,55; 0,38; 0,00) | 26 | mira → (0,55; 0,55) / (0,5; 0,60) | `rig` |
| `am.horquilla` +A | (1,30; 0,60; −1,20) | (0,62; 0,52; −0,10) | 18 | hs_horquilla → (0,60; 0,50) / (0,5; 0,58) | `null` |
| `am.grua1` +A | (2,00; 2,60; −1,20) | (0,00; 0,30; 0,00) | 28 | origen → (0,5; 0,5) | `x` |
| `am.cenital` +A | (0,00; 5,50; 0,00) | (0,00; 0,00; 0,00) | 30 | origen → (0,5; 0,46) / (0,5; 0,5) · `arriba` (0; 0; −1) (morro a la derecha) · `arribaCompacto` (1; 0; 0) (morro arriba) | `x` |
| `parte.A` +A | (2,30; 0,80; 2,00) | (0,30; 0,52; 0,00) | 26 | (0; 0,5; 0) centrado en la captura | — |
| `parte.B` +A | (−2,10; 0,95; 2,20) | (−0,25; 0,55; 0,00) | 26 | ídem | — |
| `parte.C` +A | (−2,10; 0,95; −2,20) | (−0,25; 0,55; 0,00) | 26 | ídem | — |
| `parte.D` +A | (2,30; 0,80; −2,00) | (0,30; 0,52; 0,00) | 26 | ídem | — |
| `cierre.a` | = `pieza.b` + (0; 0,175; 0) | = `pieza.b` + (0; 0,175; 0) | 24 | punto fijo (0; 0,175; 0) → (0,66; 0,62) / (0,5; 0,70). La moto empieza 17,5 cm por encima de ese punto y termina 17,5 cm por debajo: la bajada se ve | `rig` (con la plataforma arriba) |
| `cierre.b` | (2,62; 0,725; 2,13) | (0,05; 0,675; 0,00) | 24 | ídem | `rig` (con la plataforma arriba) |

**Movimiento de cámara:**

- **Posición.** Dentro del amarre, la cámara sigue un CatmullRom centrípeto:
  - Izquierda: `[am.bajo, am.rueda, am.calzo, am.tija, am.delanteras]`.
  - Derecha: `[am.traseras, am.horquilla, am.grua1, am.cenital]`.
  - Entre ellos, al entrar en `traseras`, hay un **corte seco** (el único dentro del amarre). Dentro de `traseras`, la posición recorre el travelling de la tabla.
- **Orientación.** `slerp` entre los cuaterniones de los planos. **No se interpola `up` ni se llama a `lookAt`** durante los tramos: así el cenital no degenera ni da vuelcos.
- En cada tramo, la cámara llega a su plano en el primer 35 % (ease `calzo`) y **respira** el resto: dolly-in del 3 % y fov −1°.
- Todo pasa por un **muelle crítico (λ = 6)** sobre posición, cuaternión y fov, con tres excepciones:
  - los cortes, que llevan el muelle a su objetivo;
  - la grúa a g > 0,85 y el traspaso, donde **la cámara es exactamente la del objetivo**;
  - `__calzo.ir()` e `irA({ inmediato: true })`, que teletransportan todos los muelles (`director.teletransportar()`).

**Planos que la favorecen:** teleobjetivo (fov 18–30, equivalente a 70–135 mm); cámara baja (0,32–0,9 m, bajo la línea del depósito); 3/4; contraluz y silueta; primeros planos de tija, horquilla y rueda con calzo; cenital solo en silueta.

**Planos prohibidos:**

- Giro de 360° de plato.
- Lateral ortogonal a plena luz.
- Frontal simétrico.
- Cenital iluminado.
- Gran angular (fov > 30).
- Primeros planos de uniones tubo–depósito, de los bajos del motor y del asiento.
- Más del 40 % de la moto iluminado a la vez.
- Rueda girando.
- Trasera pura quieta (solo se pasa por ella en movimiento).

### 4.10 Anti-juguete: hito de revisión (bloquea la coreografía)

Antes de integrar la coreografía, WP1 entrega cuatro fotogramas en pausa a 1600 px:

1. `pieza.b` con clave 1.
2. `am.tija` aislado (pausa).
3. `am.rueda` con la moto sobre la plataforma subida y el calzo puesto.
4. `am.cenital` en silueta.

Criterios de aprobado:

- Ninguna arista a 90° sin bisel en cuadro.
- Reflejos de tira continuos en el depósito.
- Tornillería y collarines legibles en la tija.
- **Huella apoyada**, sin hueco visible entre el neumático y la plataforma o el calzo. La plataforma sale de su junta sin huecos ni *z-fighting*.
- Todo extremo de tubo con tapa. Largueros rectos, sin ondulación.
- Sombra de contacto presente y sombra sin pixelado visible en los primeros planos.
- Ningún cruce de primitivas visible.

Si un plano delata geometría, primero **se cierra la luz** (más silueta) y después se añaden polígonos. **Plan B:** el Acto I pasa a silueta y líneas, y se pide el okey del usuario para un GLB (§4.11).

### 4.11 Ruta de sustitución por un GLB real

`cargarGLB(url, opts): Promise<MotoRig>` implementa **el mismo contrato**. Usa `GLTFLoader` + `DRACOLoader` en un chunk aparte que solo se carga si hay GLB. Requisitos del archivo:

- **Escala y ejes:** metros, +X hacia delante, +Y arriba, origen entre contactos, huella en y = 0,006.
- **Grupos** (nodos vacíos con esos nombres): `suspendida`, `delantera`, `trasera`.
- **Nodos de pieza:** `tija`, `mandos`, `rueda_del`, `rueda_tras`, `horquilla_barras`, `horquilla_botellas`, `deposito`, `asiento`, `motor`, `escape`, `cadena`, `chasis`, `faro`. El loader hornea `aPieza` a partir de estos nombres (vía `prepararPieza`).
- **Empties:** todos los de §4.3 (`hs_*`, `anc_*`, `pivote_suspension`).
- **Materiales con nombre de rol:** `pintura`, `cromo`, `cromo_satinado`, `aluminio`, `anodizado`, `fundicion`, `metal_disco`, `goma`, `asiento`, `faro_lente`, `faro_aro`. El loader los sustituye por los de `materiales.ts` para mantener la inyección y los valores.
- **Peso:** ≤ 6 MB con Draco y ≤ 250k triángulos.
- **Decodificador Draco:** se copia `node_modules/three/examples/jsm/libs/draco/gltf/` a `public/draco/` (≈ 300 KB de wasm/js) y se usa `setDecoderPath('/draco/')`. Cuenta en el presupuesto de la ruta GLB (§7.6), no en el base.
- Cambiar de fuente es una línea: `FUENTE_MOTO = 'procedural' | 'glb'` en `escena.ts`. La coreografía no cambia.

Candidato investigado: «Three Cylinder Naked Street Bike» (Jamie Hamel-Smith, CC BY 4.0, Sketchfab).

- Exige cuenta y atribución visible en el pie.
- Su silueta recuerda a una moto comercial.
- **Descargarlo requiere el okey explícito del usuario, y lo descarga él.**
- No existe una moto premium CC0 sin login.

---

## 5. Arquitectura de archivos y contratos

### 5.1 Árbol de archivos (ruta base `C:\Users\estud\Desktop\calzo`)

| Archivo | Acción | Responsabilidad | WP |
|---|---|---|---|
| `package.json` | modificar | Dependencias: `@fontsource-variable/big-shoulders-display`, `/newsreader`, `/overpass-mono`. devDeps: `typescript` ≥ 5.8, `@astrojs/check`, `subset-font`, `@capsizecss/unpack`, `@capsizecss/metrics`. Scripts: `check`, `test` (`node scripts/test-precio.mjs && node scripts/test-guion.mjs`), `fuentes` (`node scripts/fuente-cierre.mjs && node scripts/respaldo-fuentes.mjs`), `presupuesto` | WP0 |
| `tsconfig.json` | crear | `extends: "astro/tsconfigs/strict"` + `"erasableSyntaxOnly": true` | WP0 |
| `astro.config.mjs` | sin cambios | `site` | — |
| `public/robots.txt` | mantener | `Disallow: /` | — |
| `public/fuentes/newsreader-cierre.woff2` | generar y versionar | Itálica instanciada (§3.2) | WP0 |
| `public/draco/*` | solo si se activa el GLB | Decodificador Draco | WP1 |
| `src/layouts/Layout.astro` | reescribir | Head (noindex, meta, fuentes, preload, script inline), `<defs>` compartidos, capas fijas, skip link, `<slot/>` y **un único `<script>` que importa `lib/app.ts`** | WP0 |
| `src/styles/tokens.css` | crear | §3.1 | WP0 |
| `src/styles/respaldos.css` | generar | `@font-face` de respaldo medidos (§3.2) | WP0 |
| `src/styles/global.css` | reescribir | Reset, base, `.rejilla`, `.cap`, `.cap__pista`, `.cap__escenario`, `.fase`, `.sr`, `@font-face` de la itálica, estados `html.js` / `.reducido` / `.app-viva` / `.qa-pausa`. Se elimina `scroll-behavior: smooth` | WP0 |
| `src/pages/index.astro` | reescribir | Composición (§5.2) | WP0 |
| `src/data/tarifas.js` | modificar | Tildes en nombres y constantes nuevas (§6.4) | WP0 |
| `src/data/contacto.js` | crear | `TEL`, `TEL_TXT`, `WA_NUM`, `EMAIL`, `SEGURO_MAX_EUR`, `PLACEHOLDER` | WP0 |
| `src/data/geo.js` | crear | `COORD` (lat/lon de Madrid y de los 25 destinos), `rumbo()`, `distanciaKm()` | WP5 |
| `src/lib/precio.js` | crear | Cálculo y formato puros, para el build y el cliente (§6.4) | WP0 |
| `src/lib/estado.ts` | crear | Estado + bus de eventos con eventos pegajosos (§5.4) | WP0 |
| `src/lib/motion.ts` | crear | gsap core, CustomEase `calzo`, Lenis, ticker, `onFrame`, `irA`, pausa | WP0 |
| `src/lib/capitulos.ts` | crear | Medición propia (sin ScrollTrigger), `e`/`p`, `activo`, `scrollDe()`, `focusin` de fases | WP0 |
| `src/lib/calc.ts` | crear | Store del cálculo, `?carga`/`?destino`/`?vuelta`, localStorage, `[data-precio]`, `a[data-wa]` | WP0 |
| `src/lib/revelar.ts` | crear | Entradas únicas `[data-revelar="mascara\|trazo"]` (§1.4) | WP0 |
| `src/lib/qa.ts` | crear | `window.__calzo`; **solo se importa con `?debug`, `?still`, `?tier` o `?rm`** | WP0 (WP2 añade `info` y `pixel`) |
| `src/lib/app.ts` | crear | Única entrada y orden de arranque (§5.3) | WP0 |
| `src/lib/escena-loader.ts` | crear | `cargarEscena()`, benchmark, **único escritor de `estado.fuente`**, pérdida de contexto | WP2 |
| `src/lib/rosa.js` | crear | Rumbos, longitudes y colocación de etiquetas de la rosa (build, puro) | WP5 |
| `src/guion/{util,pieza,amarre,traspaso,cierre}.ts` | crear | Funciones puras (§5.7) | WP0 |
| `src/three/contrato-tipos.ts` | crear | Tipos, `PIEZA_NUM`, ids de planos y presets. **Sin three en tiempo de ejecución** (solo `import type`) | WP0 |
| `src/three/maqueta.ts` | crear | `crearMotoMaqueta` (cajas con las mismas anclas y grupos). Solo va en el chunk 3D | WP0 |
| `src/three/gpu-textura.ts` | crear | `texturaGPU()`: render único de un shader a un RenderTarget | WP0 |
| `src/three/escena.ts` | crear | Renderer, bucle bajo demanda, presupuesto de píxeles, calidad adaptativa, visibilidad del canvas, `EscenaAPI` | WP2 |
| `src/three/director.ts` | crear | Estado + guion → cámara, luces, rig, amarre; `camaraDePlano`; `aplicarPreset` | WP2 |
| `src/three/planos.ts`, `src/three/presets.ts` | crear | §4.9 y presets de captura (§5.4) | WP2 |
| `src/three/suelo.ts` | crear | Suelo, junta del elevador y sombra de contacto | WP2 |
| `src/three/captura.ts` | crear | Capturas fuera de pantalla, sello y cola | WP2 |
| `src/three/amarre/{plataforma,calzo,cinchas,carraca}.ts` | crear | §4.4 | WP2 |
| `src/three/entorno.ts` | crear | PMREM de estudio | WP1 |
| `src/three/moto/crearMoto.ts` | crear | Ensamblado del `MotoRig` | WP1 |
| `src/three/moto/preparar.ts` | crear | `prepararPieza` (§4.3) | WP1 |
| `src/three/moto/piezas/*.ts` | crear | `neumatico`, `llanta`, `disco`, `horquilla`, `tijas`, `manillar`, `faro`, `deposito`, `asiento`, `chasis`, `motor`, `escape`, `basculante`, `amortiguador`, `cadena`, `detalles` | WP1 |
| `src/three/moto/{materiales,texturas,cargarGLB}.ts` | crear | §4.5, §4.6, §4.11 | WP1 |
| `src/components/CapPieza.astro` + `src/capitulos/pieza.ts` | crear | §2.1, incluida la línea de carga | WP3 |
| `src/components/CapAmarre.astro` + `src/capitulos/amarre.ts` | crear | §2.2 + overlay `#capa-cinchas` | WP3 |
| `src/components/CapCierre.astro` + `src/capitulos/cierre.ts` | crear | §2.8 (pista y escenario, con `<slot name="cta"/>` detrás de la pista) | WP3 |
| `src/components/svg/{MotoLinea,MotoPlanta}.astro` + `src/capitulos/moto-svg.ts` | crear | Ruta sin WebGL de pieza, amarre y cierre; publica `cinchas2D` cuando `fuente = 'svg'` | WP3 |
| `src/components/Nav.astro` + `src/capitulos/nav.ts` | reescribir / crear | Barra, chip e índice (`dialog`) | WP4 |
| `src/components/BarraMovil.astro` + `src/capitulos/barra.ts` | crear | Barra inferior en compacto | WP4 |
| `src/components/CapPrecio.astro` + `src/capitulos/precio.ts` | crear | §2.3, §6, cinchas en flujo, asiento y `details#tarifas` | WP4 |
| `src/components/ContactoCta.astro` + `src/capitulos/contacto-cta.ts` | crear | Bloque CTA del cierre, copiar email | WP4 |
| `src/components/Pie.astro` | crear | Pie | WP4 |
| `src/components/svg/Pictos.astro` | crear | Pictogramas | WP4 |
| `src/components/svg/{Flecha,Chevron}.astro` | crear | Iconos compartidos | WP0 |
| `src/components/CapCargas.astro` | crear | §2.4 (sin JS propio: usa `revelar.ts`) | WP5 |
| `src/components/svg/{QuadPlanta,BarcoSeccion}.astro` | crear | Láminas (§5.5) | WP5 |
| `src/components/CapParte.astro` + `src/capitulos/parte.ts` | crear | §2.5: hoja y petición de capturas | WP5 |
| `src/components/CapSeguro.astro` | crear | §2.6 (sin JS) | WP5 |
| `src/components/CapRutas.astro` + `src/capitulos/rutas.ts` | crear | §2.7: rosa (SVG generado en el build) e interacción | WP5 |
| `scripts/test-precio.mjs`, `scripts/test-guion.mjs` | crear | Pruebas en Node (§9.1) | WP0 |
| `scripts/fuente-cierre.mjs`, `scripts/respaldo-fuentes.mjs` | crear | Fuentes (§3.2) | WP0 |
| `scripts/presupuesto.mjs` | crear | Tamaños gzip de `dist/` y comprobación de que el bundle inicial no contiene three (§7.6) | WP2 |
| `Hero.astro`, `Cargas.astro`, `Parte.astro`, `Rutas.astro`, `Seguro.astro`, `Contacto.astro` | **borrar** tras migrar el contenido útil | — | WP3 (Hero) · WP5 (Cargas, Parte, Rutas, Seguro) · WP4 (Contacto) |

**Regla de propiedad.** Cada WP solo edita sus archivos. Los archivos compartidos son del lead (WP0): `estado.ts`, `motion.ts`, `capitulos.ts`, `calc.ts`, `revelar.ts`, `app.ts`, `guion/*`, `contrato-tipos.ts`, `maqueta.ts`, `gpu-textura.ts`, `tokens.css`, `global.css`, `Layout.astro` e `index.astro`. Los cambios en ellos se piden y los aplica él.

**Reglas para `src/guion/**` y `src/lib/precio.js`** (se ejecutan en Node 24 sin compilar):

- Las importaciones relativas llevan extensión (`./util.ts`).
- Solo sintaxis TypeScript borrable: nada de `enum`, `namespace` ni parameter properties. `erasableSyntaxOnly` lo impone.
- No pueden tocar el DOM ni importar three.

### 5.2 Composición del DOM y capas

`src/pages/index.astro`:

```astro
<Layout title="Calzo · Transporte de motos, quads y embarcaciones desde Madrid"
        description="Transporte de motos, quads y barcos por carretera. Salidas desde Madrid a toda España, parte de fotos al cargar y al entregar, y seguro por valor declarado.">
  <Nav />
  <main id="contenido">
    <CapPieza /> <CapAmarre /> <CapPrecio /> <CapCargas /> <CapParte />
    <CapSeguro /> <CapRutas />
    <CapCierre><ContactoCta slot="cta" /></CapCierre>
  </main>
  <Pie /> <BarraMovil />
</Layout>
```

`Layout.astro` pone, en este orden dentro de `<body>`:

1. `<a class="saltar" href="#precio">Ir a la calculadora</a>`: el primer elemento enfocable.
2. `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><pattern id="tejido" …/></defs></svg>`.
3. `<div id="capa-escena" aria-hidden="true"></div>`: el canvas lo crea JS; sin JS no existe.
4. `<svg id="capa-cinchas" aria-hidden="true" focusable="false"></svg>`: overlay fijo del traspaso.
5. `<slot/>`.
6. `<script>import '../lib/app.ts';</script>`: **el único script procesado de la página**. Los componentes `.astro` **no llevan `<script>`**.

| Capa | Selector | z | Posición |
|---|---|---|---|
| Escena WebGL | `#capa-escena > canvas` | 1 | fixed, 100vw × 100lvh, **sin transform**, `visibility` según `estado.escena.visible` |
| Contenido | `main`, capítulos | 3 | Flujo. Fondos transparentes en pieza, amarre y la pista de contacto; `--carbon` en precio y el CTA; `--papel` en cargas y parte; `--grafito` en seguro y rutas |
| Overlay del traspaso | `#capa-cinchas` | 4 | fixed, viewport completo, `pointer-events: none`, coordenadas en px de viewport |
| Nav y barra móvil | `.nav`, `#barra-movil` | 10 | fixed |
| Índice | `dialog#indice` | capa superior nativa | `showModal()` |

Ya no existen `#instantanea`, `#corte`, `#grano`, `#preloader` ni `#hud`.

**Estructura obligatoria de un capítulo fijo:**

```html
<section id="amarre" class="cap cap--fija" data-cap="amarre" aria-labelledby="amarre-h">
  <div class="cap__pista" style="--fija-d: 260; --fija-m: 200">
    <div class="cap__escenario">
      <div class="fase" data-fase="titulo">…</div>
      <div class="fase" data-fase="rueda">…</div>
      …
    </div>
  </div>
  <!-- contenido en flujo opcional detrás de la pista (p. ej., el CTA del cierre) -->
</section>
```

El estilo inline solo **define** custom properties; nunca fija `height`. Así las reglas de la hoja deciden, por media query, qué valor se usa:

```css
/* base: sin JS o con movimiento reducido → documento en flujo, legible */
.cap__pista { position: relative; }
.cap__escenario { position: relative; min-height: 100svh; }
.cap__escenario .fase { position: relative; }

/* coreografía: solo con JS y sin movimiento reducido */
html.js:not(.reducido) .cap__pista { height: calc(100svh + var(--fija-m) * 1svh); }
@media (min-width: 1024px) and (pointer: fine) {
  html.js:not(.reducido) .cap__pista { height: calc(100svh + var(--fija-d) * 1svh); }
}
html.js:not(.reducido) .cap__escenario { position: sticky; top: 0; height: 100svh; overflow: clip; }
html.js:not(.reducido) .cap__escenario .fase { position: absolute; opacity: 0; pointer-events: none; }
html.js:not(.reducido) .cap__escenario .fase.es-visible { pointer-events: auto; }
```

- El módulo del capítulo pone `.es-visible` cuando la opacidad de la fase es ≥ 0,5 y la quita por debajo.
- **Nada que pueda medir más de 100svh vive dentro de un escenario**: tablas, formularios y listas largas van en flujo. QA lo comprueba (§9.2 #21).

### 5.3 Arranque y bucle

**Única entrada: `src/lib/app.ts`.** Los módulos de `src/capitulos/*.ts` exportan `iniciar(): void` y **no tienen efectos al importarse**. `app.ts` los importa estáticamente y los llama en este orden fijo, cada uno dentro de `try/catch`:

```
1.  iniciarEstado()        estado.modo desde las clases de <html>; sonda de 100svh → estado.vp
2.  iniciarMotion()        CustomEase 'calzo', gsap.defaults, ticker único, Lenis (si no hay reducido), interceptor de anclas
3.  iniciarCapitulos()     medición, activo, focusin de fases, ResizeObserver
4.  iniciarCalc()          store + parámetros de URL + localStorage; pinta [data-precio] y a[data-wa]
5.  iniciarRevelar()
6.  capítulos, en orden de documento:
      pieza, amarre, precio, parte, rutas, cierre, contacto-cta, nav, barra, moto-svg
7.  html.classList.add('app-viva')
8.  cargarEscena({ contenedor: #capa-escena, progreso: pieza.progresoCarga, limiteMs })   // no bloquea
9.  restaurar posición: hash → irA(hash, { inmediato: true }) tras la primera medición;
    si no hay hash y la navegación es back_forward o reload → sessionStorage['calzo:pos']; si no, arriba
10. si ?debug | ?still | ?tier | ?rm → import('./qa.ts')
```

Si fallan `iniciarMotion` o `iniciarCapitulos`, `app.ts` quita `html.js` en el acto y la página queda en su maquetación sin JS. Los fallos de los demás módulos se registran en consola sin tumbar el resto.

**Eventos pegajosos.** `listo`, `escena:lista`, `escena:fallo`, `tier` y `fuente` se guardan: un `on()` posterior recibe el último valor en el acto. Así ningún módulo pierde un evento por registrarse tarde.

**Un único rAF: `gsap.ticker`**, propiedad de `motion.ts`. Nadie llama a `requestAnimationFrame` ni a `renderer.setAnimationLoop`. Orden en cada frame:

1. `lenis.raf(t · 1000)`, si existe.
2. `Timeline.updateRoot` de GSAP (tweens por tiempo).
3. `onFrame` en orden ascendente:

| Orden | Quién | Qué |
|---|---|---|
| 10 | `capitulos.ts` | `scroll.y/vel/dir`, `cap[*].e/p` y `activo`; emite `capitulo` al cambiar |
| 12 | `capitulos/precio.ts` | `estado.destinoCinchas` (solo mientras amarre p ≥ 0,90 o precio e ∈ (0, 1]) |
| 15 | `capitulos/*.ts` | DOM por fase: fases del amarre, chip, barra, frase del cierre |
| 20 | `three/director.ts` | Estado + guion → cámara, luces, uniforms, rig y amarre; devuelve `sucio` |
| 30 | `three/escena.ts` | Visibilidad y opacidad del canvas; render si `sucio` y visible; después, como mucho una captura en cola |
| 40 | `capitulos/amarre.ts` | `#capa-cinchas` (traspaso en viaje) |
| 45 | `capitulos/precio.ts` | Asiento del panel y cinchas en flujo (solo si cambian) |

**Configuración:**

- `gsap.ticker.lagSmoothing(0)`; `dt = min(deltaMs, 50) / 1000`.
- **Sin ScrollTrigger.** `capitulos.ts` mide con `getBoundingClientRect().top + scrollY` y `offsetHeight`. Remide en:
  - `iniciarCapitulos`;
  - `document.fonts.ready`;
  - `listo`;
  - un `ResizeObserver` sobre `main` (agrupado al siguiente frame);
  - `resize` (en táctil se ignoran los cambios solo de alto menores de 150 px: son la barra de URL).

  Tras cada medición emite `medidas`.
- `history.scrollRestoration = 'manual'`. La posición se guarda en `sessionStorage['calzo:pos']` en `pagehide` (**nunca `unload`**, que expulsa la página de la bfcache).
- Los `wa.me` abren en pestaña nueva en escritorio (`target="_blank" rel="noopener"`). La página de origen conserva su estado.

### 5.4 Contratos (firmas exportadas)

```ts
// src/lib/estado.ts  (WP0) — sin efectos al importarse salvo crear el objeto
import type { Tier, PresetId } from '../three/contrato-tipos.ts';
import type { ResultadoPrecio } from './precio.js';

export type CapId = 'pieza'|'amarre'|'precio'|'cargas'|'parte'|'seguro'|'rutas'|'contacto';
export const CAPITULOS: readonly CapId[];               // orden de documento
export const CAP_3D: ReadonlySet<CapId>;                // pieza, amarre, contacto
export type Fuente = 'ninguna' | 'webgl' | 'svg';       // 'ninguna' hasta el primer 'listo'
export type Esquina = 'ti' | 'td' | 'bi' | 'bd';        // arriba-izq, arriba-dcha, abajo-izq, abajo-dcha (pantalla)
export type Punto = [number, number];                    // px CSS de viewport

export interface Cincha2D {
  esquina: Esquina;          // cuadrante de pantalla de su extremo A respecto al centro de la X (esquinaDe, §5.7)
  a: Punto;                  // eje en la anilla
  b: Punto;                  // eje donde la cinta sale de la silueta (bVisible)
  ladoA: [Punto, Punto];     // bordes de la cinta en A: [izquierdo, derecho] mirando de A hacia B
  ladoB: [Punto, Punto];     // ídem en B. Polígono = [ladoA[0], ladoB[0], ladoB[1], ladoA[1]]
}
export interface DestinoCincha { anilla: Punto; esquinaPanel: Punto; ancho: number } // px de viewport, sin asiento

export interface CapEstado { e: number; p: number }    // 0..1
export interface Estado {
  modo: { tier: Tier; reducido: boolean; tactil: boolean; compacto: boolean };
  fuente: Fuente;                                        // ÚNICO escritor: escena-loader.ts
  vp: { w: number; h: number; hs: number };              // innerWidth, innerHeight (visible), 100svh medido
  scroll: { y: number; vel: number; dir: 1 | -1; saltando: boolean }; // capitulos.ts; saltando lo escribe motion.ts
  cap: Record<CapId, CapEstado>;                         // capitulos.ts
  activo: CapId;                                         // capitulos.ts: el capítulo que contiene y + vp.h/2
  escena: { lista: boolean; fallo: boolean; visible: boolean; opacidad: number }; // escena.ts
  cinchas2D: null | [Cincha2D, Cincha2D, Cincha2D, Cincha2D]; // orden del_I, del_D, tras_I, tras_D
                                                         // escritor: escena.ts si fuente='webgl'; moto-svg.ts si 'svg'
  destinoCinchas: null | Record<Esquina, DestinoCincha>; // capitulos/precio.ts
  capturas: Partial<Record<PresetId, string>>;           // objectURL; escritor: escena.ts
  calc: ResultadoPrecio;                                 // calc.ts
  qa: { pausado: boolean; frames: number };
}
export const estado: Estado;

export interface Eventos {
  'listo': { fuente: 'webgl' | 'svg' };                 // pegajoso; una sola vez
  'escena:lista': { tier: Tier };                        // pegajoso
  'escena:fallo': { motivo: string };                    // pegajoso
  'tier': { tier: Tier };                                // pegajoso
  'fuente': { fuente: Fuente; anterior: Fuente };        // pegajoso (último valor)
  'medidas': Record<string, never>;                      // tras cada medición de capítulos
  'capitulo': { id: CapId; anterior: CapId };
  'precio': ResultadoPrecio;
  'captura': { preset: PresetId; url: string };
}
export function on<E extends keyof Eventos>(ev: E, fn: (d: Eventos[E]) => void): () => void;
// si ev es pegajoso y ya se emitió, fn se llama de forma síncrona con el último valor antes de devolver
export function emit<E extends keyof Eventos>(ev: E, d: Eventos[E]): void;
```

```ts
// src/lib/motion.ts  (WP0) — sin efectos al importarse
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
export { gsap, CustomEase };
export const EASE = 'calzo';
export function iniciarMotion(): void;
export function lenis(): Lenis | null;                    // null con movimiento reducido
export function onFrame(fn: (t: number, dt: number) => void, orden?: number): () => void; // orden por defecto 15
export function irA(destino: string | HTMLElement | number,
                    opts?: { inmediato?: boolean; duracion?: number; foco?: boolean }): Promise<void>;
// Con Lenis: lenis.scrollTo(y, { force: true, immediate, duration: clamp(dist/2500, 1.1, 2.4), easing: easeCalzo, onComplete }).
// `force: true` es obligatorio: sin él Lenis ignora la orden si está parado (índice abierto, arranque).
// Sin Lenis: window.scrollTo({ top: y, behavior: 'instant' }).
// Mientras dura, estado.scroll.saltando = true. Con foco=true enfoca el destino (tabindex="-1").
// Con inmediato=true llama además a director.teletransportar() si hay escena.
export function pausarTodo(): void;    // gsap.ticker.sleep(), lenis.stop(), html.qa-pausa
export function reanudarTodo(): void;
```

Configuración de Lenis: `new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false, anchors: false, autoRaf: false })`. No se crea con movimiento reducido. `motion.ts` intercepta los clics en `a[href^="#"]` (`preventDefault`), llama a `irA(hash, { foco: true })` y usa `history.replaceState`.

```ts
// src/lib/capitulos.ts  (WP0)
export function iniciarCapitulos(): void;
export function medir(): void;                          // remide y emite 'medidas'
export function scrollDe(cap: CapId, v: number, fase?: 'e' | 'p'): number; // px de scroll; fase por defecto 'p'
// Medición por sección: top, alto; si tiene .cap__pista: altoPista. hs = estado.vp.hs (100svh medido).
// e = clamp((y − (top − hs)) / hs)
// p = con pista: clamp((y − top) / (altoPista − hs)); sin pista: alto > hs ? clamp((y − top) / (alto − hs)) : e
// scrollDe(cap, v, 'e') = top − hs + v·hs
// scrollDe(cap, v, 'p') = top + v·max(1, (altoPista ?? alto) − hs)
// y = lenis?.scroll ?? scrollY.  activo = el capítulo cuyo [top, top+alto) contiene y + estado.vp.h/2.
// focusin: un elemento con [data-fase-p] dentro de .cap--fija ⇒ irA(scrollDe(cap, Number(fase-p)), { inmediato: true }).
```

```ts
// src/lib/precio.js  (WP0; JS puro, lo usan Astro en el build, el cliente y Node)
/** @typedef {'moto'|'quad'|'barco'|'coche'} CargaId */
/** @typedef {{ carga: CargaId, destino: string, vuelta: boolean, eslora?: number, manga?: boolean }} EntradaPrecio */
/** @typedef {{ id: 'base'|'km'|'minimo'|'eslora'|'manga'|'vuelta'|'ferry'|'redondeo', txt: string }} LineaDesglose */
/** @typedef {{ entrada: EntradaPrecio, total: number, totalTxt: string, km: number, kmTxt: string, duracionTxt: string,
 *   ruta: string, maritimo: boolean, especial: boolean, provisional: boolean, lineas: LineaDesglose[],
 *   articulo: string, resumen: string }} ResultadoPrecio */
export function calcularPrecio(entrada) {}   // → ResultadoPrecio (§6.4)
export function formatoEuros(n) {}           // sin Intl: punto de miles siempre + U+00A0 + '€' → '205\u00A0€', '2.355\u00A0€'
export function formatoKm(n) {}              // '355\u00A0km'
export function formatoDuracion(km) {}       // km/75 h redondeado a 5 min → '4\u00A0h 45\u00A0min' (sin '≈')
export function mensajeWhatsApp(r) {}        // texto §6.5
export function urlWhatsApp(r) {}            // `https://wa.me/${WA_NUM}?text=${encodeURIComponent(mensajeWhatsApp(r))}`
export function tablaPrecios() {}            // [{ id, nombre, km, kmTxt, duracionTxt, moto, quad, coche, nautico, maritimo }] × 25
```

```ts
// src/lib/calc.ts  (WP0 lo escribe completo; WP4 es dueño de la UI que lo usa)
export function iniciarCalc(): ResultadoPrecio;   // por defecto moto·valencia·ida; aplica ?carga=&destino=&vuelta=1;
                                                  // localStorage 'calzo:calc' con try/catch
export function fijar(parcial: Partial<EntradaPrecio>, origen: 'heroe'|'panel'|'rutas'|'cargas'|'url'): ResultadoPrecio;
export function actual(): ResultadoPrecio;
// Efectos: estado.calc = r; emit('precio', r); textContent de [data-precio="total|km|duracion|ruta|articulo|resumen"];
// sincroniza todos los select[data-destino-select] y input[name=carga]; actualiza href de a[data-wa].
// La cifra grande del panel NO usa data-precio: la pinta capitulos/precio.ts (fundido cruzado).
```

```ts
// src/three/contrato-tipos.ts  (WP0) — sin three en tiempo de ejecución
import type * as THREE from 'three';
export type Tier = 'alto' | 'medio' | 'bajo' | 'sin-webgl';
export type PiezaId = 'resto'|'tija'|'mandos'|'rueda_del'|'horquilla'|'deposito'|'motor';
export const PIEZA_NUM: Readonly<Record<PiezaId, number>>;   // { resto:0, tija:1, mandos:2, rueda_del:3, horquilla:4, deposito:5, motor:6 }
export type AnclaId = 'hs_tija'|'hs_rueda'|'hs_horquilla'
  |'anc_cincha_tija_I'|'anc_cincha_tija_D'|'anc_cincha_tras_I'|'anc_cincha_tras_D'
  |'anc_calzo'|'anc_contacto_del'|'anc_contacto_tras'|'anc_deposito'|'pivote_suspension';
export type AnclaPlataformaId = 'anc_anilla_del_I'|'anc_anilla_del_D'|'anc_anilla_tras_I'|'anc_anilla_tras_D';
export type PlanoId = 'pieza.a'|'pieza.b'|'am.bajo'|'am.rueda'|'am.calzo'|'am.tija'|'am.delanteras'|'am.traseras'
  |'am.horquilla'|'am.grua1'|'am.cenital'|'parte.A'|'parte.B'|'parte.C'|'parte.D'|'cierre.a'|'cierre.b';
export type PresetId = 'parte.A'|'parte.B'|'parte.C'|'parte.D'
  |'quieto.pieza'|'quieto.calzo'|'quieto.cinchas'|'quieto.horquilla'|'quieto.cenital'|'quieto.cierre';
export interface UniformsCompartidos {
  uBarridoX: { value: number }; uBarridoAncho: { value: number }; uBarridoI: { value: number };
  uColorContra: { value: THREE.Color }; uFoco: { value: number }; uAtenuacion: { value: number };
}
export interface MotoRig {
  root: THREE.Group;
  grupos: { suspendida: THREE.Group; delantera: THREE.Group; trasera: THREE.Group };
  anclas: Record<AnclaId, THREE.Object3D>;
  caja: THREE.Box3;                                       // en reposo, coordenadas del rig
  setHorquilla(t: number): void;                          // 0..1
  setFoco(pieza: PiezaId | null, mezcla: number): void;   // solo uniforms
  setApoyo(y: number): void;                              // root.position.y = y − 0.006
  dispose(): void;
}
export interface OpcionesMoto { tier: Tier; U: UniformsCompartidos; renderer: THREE.WebGLRenderer; progreso?: (f: number) => void }
export type CrearMoto = (o: OpcionesMoto) => Promise<MotoRig>;  // troceado: cede el hilo entre piezas (<50 ms por tarea)
export interface Plano {
  pos: [number, number, number] | { de: [number, number, number]; a: [number, number, number] };   // travelling
  mira: [number, number, number] | { de: [number, number, number]; a: [number, number, number] };
  fov: number;                                            // ≤ 30 siempre
  punto: AnclaId | 'origen' | 'mira' | 'contactos';       // 'contactos' = punto medio de anc_contacto_del/_tras
  encuadre: [number, number]; encuadreCompacto?: [number, number];
  encajeCompacto?: 'rig' | 'x' | null;
  arriba?: [number, number, number]; arribaCompacto?: [number, number, number];
}
```

```ts
// src/three/maqueta.ts  (WP0; solo en el chunk 3D)
export const crearMotoMaqueta: CrearMoto;   // cajas con los mismos grupos, anclas, aPieza, setHorquilla, setFoco y setApoyo

// src/three/gpu-textura.ts  (WP0)
export function texturaGPU(renderer: THREE.WebGLRenderer, o: {
  frag: string;                         // GLSL con main() que escribe gl_FragColor a partir de vUv
  size: number | [number, number];
  uniforms?: Record<string, { value: unknown }>;
  mipmaps?: boolean;                    // por defecto true (potencia de 2)
  espacio?: 'srgb' | 'lineal';          // 'lineal' para normal y roughness maps
}): THREE.Texture;                      // un solo render a un WebGLRenderTarget; se devuelve rt.texture; sin lectura a CPU
```

```ts
// src/lib/escena-loader.ts  (WP2) — va en el bundle inicial; importa el chunk 3D con import()
export type Paso = 'fuentes'|'three'|'moto'|'texturas'|'shaders'|'benchmark';
export function cargarEscena(o: { contenedor: HTMLElement; progreso: (fraccion: number, paso: Paso) => void; limiteMs: number }): Promise<void>;
// Nunca rechaza. Garantías:
//  · emite 'listo' exactamente una vez: {fuente:'webgl'} si la escena está lista antes de limiteMs; si no, {fuente:'svg'}.
//  · emite 'tier', y 'escena:lista' o 'escena:fallo'.
//  · es el ÚNICO escritor de estado.fuente y emite 'fuente' en cada cambio (reglas de cambio en §5.6).
//  · tier 'bajo' ⇒ no descarga three: fuente 'svg'.
//  · WebGL2 se prueba creando el renderer real dentro de try/catch (no en el head); si falla ⇒ tier 'sin-webgl'.
//  · window 'error' / 'unhandledrejection' durante la carga ⇒ fuente 'svg'.
export function escena(): EscenaAPI | null;
```

```ts
// src/three/escena.ts  (WP2)
export interface EscenaAPI {
  tier: Tier;
  renderUnaVez(): void;
  pausar(): void; reanudar(): void;
  cinchasCenitales(w: number, h: number): [Cincha2D, Cincha2D, Cincha2D, Cincha2D];
  // Proyección exacta del plano 'am.cenital' (cámara objetivo, sin muelle, con encaje y orientación del modo actual)
  // con amarre en su estado de p = 0.90. Calcula los 4 bordes en A y en bVisible (uVisible, §4.4). No renderiza.
  capturar(preset: PresetId, o: { w: number; h: number;
    sello?: { serie: 'CARGA'; letra: 'A'|'B'|'C'|'D'; fecha: Date } }): Promise<string>;
  // Fuera de pantalla: WebGLRenderTarget w×h → readRenderTargetPixelsAsync → canvas 2D (volteo + sello en
  // Overpass Mono, tras document.fonts.load) → toBlob('image/jpeg', 0.85) → objectURL.
  // director.aplicarPreset() guarda y restaura cámara, viewOffset, luces, uniforms, rig y amarre.
  // En cola: como mucho una por frame, solo con el canvas visible en pausa o con el scroll quieto ≥ 300 ms.
  // El mismo preset dos veces devuelve la misma promesa. Escribe estado.capturas[preset] y emite 'captura'.
  info(): { drawCalls: number; triangulos: number; programas: number; px: number; dpr: number; tier: Tier;
            fpsMediana: number; amarre: { T: [number, number, number, number]; reveal: [number, number, number, number] } };
  pixel(x: number, y: number): Promise<[number, number, number]>; // QA: renderiza el estado actual a un RT del viewport y lee (x, y) en px CSS
  destruir(): void;
}
```

```ts
// src/three/director.ts  (WP2)
export function crearDirector(ctx: { escena: THREE.Scene; camara: THREE.PerspectiveCamera; rig: MotoRig;
  amarre: Amarre; luces: Luces; U: UniformsCompartidos }): {
  actualizar(estado: Estado, t: number, dt: number): boolean;   // devuelve sucio
  camaraDePlano(id: PlanoId, w: number, h: number, compacto: boolean, u?: number):
    { pos: THREE.Vector3; quat: THREE.Quaternion; fov: number; offset: [number, number] }; // pura: encuadre + encaje; u = avance del travelling
  aplicarPreset(p: PresetId): () => void;                       // aplica el estado completo del preset y devuelve la restauración
  teletransportar(): void;                                      // lleva todos los muelles a su objetivo
};

// src/three/amarre/cinchas.ts  (WP2)
export function crearCincha(a: THREE.Object3D, b: THREE.Object3D, o: { segmentos: 48 }): {
  malla: THREE.Mesh;
  set(reveal: number, T: number, sinLuz: number): void;
  uVisible(camara: THREE.Camera, oclusor: THREE.Object3D): number;   // §4.4
  bordes(u: number): [THREE.Vector3, THREE.Vector3];                 // [izquierdo, derecho] en u, con T = 1
};
```

**Presets de captura** (`presets.ts`, WP2). Cada uno fija el plano y el estado completo de la escena usando las funciones del guion, sin estados inventados:

| Preset | Plano | Estado |
|---|---|---|
| `parte.A`…`parte.D` | `parte.A`…`parte.D` | Plataforma arriba, calzo puesto, cinchas ocultas (reveal 0), horquilla 0, clave 0,15, entorno 0,1, contras 0,5, flash 12 |
| `quieto.pieza` | `pieza.b` | `pieza(1)` |
| `quieto.calzo` | `am.calzo` | `amarre(0.20)` con el calzo asentado |
| `quieto.cinchas` | `am.delanteras` | `amarre(0.53)` |
| `quieto.horquilla` | `am.horquilla` | `amarre(0.68)` |
| `quieto.cenital` | `am.cenital` | `amarre(0.90)` |
| `quieto.cierre` | `cierre.b` | `desatado(1.4)`: moto sin atar, con la plataforma enrasada |

**Quién pide cada captura:**

- `capitulos/parte.ts` (WP5) pide los cuatro `parte.*` en `requestIdleCallback` (timeout 3 s) tras `escena:lista`. Tamaño: 480 × 360 en escritorio y 360 × 270 en compacto.
- Con movimiento reducido, `capitulos/pieza.ts`, `amarre.ts` y `cierre.ts` (WP3) piden sus `quieto.*` a la anchura de su `img[data-preset]`.

**Interfaz de los módulos de capítulo** (`src/capitulos/*.ts`): cada uno exporta `iniciar(): void`, sin efectos al importarse. Además, `capitulos/pieza.ts` exporta `progresoCarga(fraccion: number, paso: Paso): void`, que es el callback que `app.ts` pasa a `cargarEscena`. Ningún módulo de capítulo importa otro módulo de capítulo: se hablan solo a través de `estado`, del bus y de `guion/*`.

### 5.5 DOM: ids, clases y `data-*` que usa la coreografía

| Selector | Dueño | Contrato |
|---|---|---|
| `section.cap[data-cap]` | cada WP | Medido por `capitulos.ts` |
| `.cap__pista[style="--fija-d:N; --fija-m:M"]` | WP3 | Pista de un capítulo fijo (§5.2) |
| `.cap__escenario` | WP3 | Escenario sticky |
| `.fase[data-fase]` | WP3 | Fases del escenario; `.es-visible` con opacidad ≥ 0,5 |
| `[data-fase-p]` | WP3 | `p` a la que se lleva el scroll si el elemento recibe foco |
| `[data-revelar="mascara"]`, `[data-revelar="trazo"]` | WP5 | Entrada única al 25 % de la entrada de su capítulo (`revelar.ts`) |
| `.pieza__suelo` | WP3 | Línea de carga y de suelo |
| `.pieza__frase select[data-destino-select]` | WP3 | Frase-precio del héroe |
| `img[data-preset]` | WP3 | Fotogramas quietos en movimiento reducido |
| `#capa-cinchas path[data-cincha="0..3"]` | WP3 | Overlay del traspaso |
| `.precio__marco`, `.precio__panel`, `svg.precio__amarre` | WP4 | Destino del traspaso: marco con margen `--amarre-dx/dy`, panel sólido y cinchas en flujo |
| `form#calc`, `input[name="carga"]`, `select[data-destino-select]`, `input[name="viaje"]`, `#eslora`, `#manga` | WP4 | Controles sincronizados por `calc.ts` |
| `output.precio__cifra` | WP4 | Cifra grande (fundido cruzado) + `.sr` con el valor |
| `[data-precio="total\|km\|duracion\|ruta\|articulo\|resumen"]` | cualquiera | Pintado por `calc.ts` |
| `a[data-wa]` | cualquiera | `href` actualizado por `calc.ts`; en el HTML lleva el mensaje por defecto generado en el build |
| `details#tarifas` | WP4 | Tabla de 25 destinos, siempre en el HTML |
| `.nav__chip`, `button[data-indice]`, `dialog#indice` | WP4 | Chip e índice |
| `#barra-movil`, `#barra-movil a[data-wa]` | WP4 | Barra inferior en compacto |
| `.parte__hoja`, `.parte__foto[data-k="0..3"] img` | WP5 | Hoja y fotos |
| `.rutas__rayo[data-destino]` (`<a>`), `.rutas__lectura` | WP5 | Rosa y línea de lectura |

**Clases en `<html>`:**

- `js`
- `app-viva`
- `tier-alto` | `tier-medio` | `tier-bajo` | `tier-sin-webgl`
- `reducido`, `tactil`, `compacto`
- `fuente-webgl` | `fuente-svg`
- `chip-visible`, `nav-solida`, `qa-pausa`

**Script inline del `<head>`** (antes de pintar, menos de 1 KB, **sin crear ningún contexto WebGL**):

1. `js`.
2. `reducido` si `matchMedia('(prefers-reduced-motion: reduce)')` o `?rm=1`.
3. `tactil` si `(pointer: coarse)`; `compacto` si `innerWidth < 1024 || tactil`.
4. Tier por heurística barata:
   - `bajo` si `deviceMemory ≤ 2`, `hardwareConcurrency ≤ 2`, `saveData`, o si es táctil con `deviceMemory ≤ 4 && hardwareConcurrency ≤ 4`;
   - `medio` si es compacto;
   - `alto` en el resto.
   - `?tier=` lo fuerza. `sin-webgl` solo lo decide el loader.
5. Salvaguarda: `setTimeout(() => { if (!cl.contains('app-viva')) cl.remove('js') }, 4000)`.

**Láminas SVG de WP5**, en coordenadas exactas:

- **`QuadPlanta.astro`** (viewBox `0 0 400 300`, el morro a la derecha):
  - Plataforma: rect 20,20 → 380,280.
  - Carrocería: rect redondeado x 130–270, y 100–200, rx 22.
  - Manillar: línea x 265, y 105–195.
  - Ruedas (60 × 38, rx 8): DI x 240–300, y 58–96 · DD x 240–300, y 204–242 · TI x 100–160, y 58–96 · TD x 100–160, y 204–242.
  - Calzos (trapecios de 12 px): delante de las delanteras (x 300–312) y detrás de las traseras (x 88–100).
  - Anillas: r 6 en (40,40), (360,40), (40,260), (360,260).
  - **Cinchas en cruz:** (360,40) → (262,178) y (360,260) → (262,122), que se cruzan en torno a (318,150); (40,40) → (138,178) y (40,260) → (138,122), que se cruzan en torno a (82,150).
- **`BarcoSeccion.astro`** (viewBox `0 0 400 300`):
  - Casco en V: `M70 110 L330 110 L300 170 Q200 235 200 235 Q200 235 100 170 Z`.
  - Taco de quilla: 185–215 × 235–255.
  - Pantoques: bandas inclinadas (125,195) → (160,215) y (240,215) → (275,195), con puntales hasta la viga (40,255) → (360,255).
  - Ruedas: r 16 en (95,272) y (305,272).
  - Cinchas: (60,255) → (70,110) y (340,255) → (330,110).
  - Cota de manga en y 80 (x 70–330) con el texto `2,40 m`, y límite discontinuo en `200 ± (2,55/2,40)·130` con el texto `2,55 m`. Es estático.
  - En la mini-lámina de la calculadora, con `manga` marcada el grupo del casco se dibuja con `scaleX(2,70/2,40)` desde x = 200 y la cota dice `> 2,55 m` (cambio de estado, sin animación).

**Moto en SVG (WP3):**

- **`MotoLinea.astro`** (alzado, viewBox `0 0 1400 640`):
  - Correspondencia: `svgX = 700 + 500·x` y `svgY = 600 − 500·y` (metros del rig).
  - Ejes en (337,5; 445) y (1062,5; 445); radio de rueda 155. Suelo en y = 600. La plataforma (x ±1,30) cabe entera; al subir 0,35 m se traslada 175 unidades y deja ver su costado.
  - El `viewBox` tiene alto suficiente para la moto subida: el grupo de la moto y la plataforma se traslada con `translate(0, −500·plataformaY)`.
  - Se dibuja con las mismas cotas de §4.2 y con las anclas marcadas con `data-ancla-svg`.
  - Colocación en el héroe: el punto (700, 600) cae en `(var(--suelo-x0) + var(--suelo-x1))/2`, `var(--suelo-y)`. 1 m = 0,2·W en escritorio y 0,4·W en compacto.
- **`MotoPlanta.astro`** (planta cenital, viewBox `0 0 1200 640`, morro a la derecha):
  - `svgX = 600 + 400·x` y `svgY = 320 + 400·z` (+z, la izquierda del piloto, hacia abajo).
  - Anillas en (120,184), (1080,184), (120,456) y (1080,456).
  - Cinchas desde cada anilla hacia su ancla B. El frontmatter calcula el **punto de salida de la silueta** (intersección segmento–polígono de la silueta en planta) y lo escribe en `data-bvis`.
  - En compacto, el grupo interior lleva `transform="rotate(-90 600 320)"` y el viewBox pasa a `280 -280 640 1200`: morro arriba.
  - `moto-svg.ts` publica `cinchas2D` con `getScreenCTM()` (que incluye esa rotación) y el mismo ancho en px que la cinta 3D en `am.cenital`.

**Rosa de rutas (WP5, `lib/rosa.js` en el build):**

- viewBox `0 0 800 800`, centro (400, 400).
- Longitud `r = 340 · km / 750`. Rumbo inicial geográfico θ desde Madrid; punto final `(400 + r·sin θ, 400 − r·cos θ)`.
- Palma: rayo de Valencia más un tramo punteado desde su extremo con el rumbo Valencia → Palma, de longitud `340 · 260 / 750`.
- **Etiquetas** (13 unidades): posición natural a `r + 14` sobre el rayo. Después, relajación radial con un máximo de 200 iteraciones: las cajas que se solapan se separan en ángulo y en radio, con un tope de 60 unidades de desplazamiento. Si una etiqueta queda a más de 10 unidades de su posición natural, se dibuja una línea guía de 1 px.
- El resultado se escribe en el SVG del build. En el cliente no se calcula nada.

### 5.6 Comunicación DOM ↔ 3D

1. **El DOM escribe** el progreso (`capitulos.ts`), el cálculo (`calc.ts`) y `destinoCinchas` (`capitulos/precio.ts`). Las acciones puntuales se piden por la API (`capturar`).
2. **El director** es el único que escribe cámara, luces, uniforms, rig y amarre. Nunca toca el DOM.
3. **`escena.ts`** escribe la visibilidad y la opacidad del canvas:
   - `opacidad` = `amarre(p).opacidadCanvas` si el amarre corta el viewport (con la `p` del amarre, aunque `activo` ya sea precio); 1 si lo cortan pieza o contacto; 0 en el resto.
   - `visible` si `fuente = 'webgl'`, no hay movimiento reducido y `opacidad > 0`.
   - **Antes de pasar de oculto a visible**, el director aplica el estado del capítulo que entra y se renderiza en ese mismo frame. Nunca asoma un fotograma viejo.
   - En un `resize` con el canvas visible y la escena en reposo, se vuelve a renderizar el estado actual.
4. **Fuente** (único escritor: `escena-loader.ts`):
   - `'ninguna'` → `'svg'` | `'webgl'` con `listo`.
   - Si el usuario entra en el amarre con `'ninguna'`, se fija `'svg'` en ese frame.
   - **El cambio `svg` → `webgl`** (una escena que llega tarde, o un contexto restaurado) solo ocurre en una **frontera segura**: el activo es precio, cargas, parte, seguro o rutas; o bien pieza con p < 0,02. Nunca durante el traspaso (amarre p ≥ 0,90 o precio e < 1). Se hace con un fundido cruzado de 400 ms entre canvas y SVG.
   - **`webglcontextlost`** ⇒ `'svg'` en el acto: la ruta SVG es función de `p` y retoma en cualquier punto del capítulo. **`webglcontextrestored`** ⇒ se reconstruye en tiempo ocioso y se vuelve a `'webgl'` en la siguiente frontera segura.
5. **`cinchas2D`** describe la X cenital **para el viewport actual**. No depende del frame. Lo escribe el módulo de la fuente activa (`escena.cinchasCenitales(vp.w, vp.h)` o `moto-svg.ts`) en `medidas`, en `fuente` y cuando cambia `innerHeight`.
6. **`destinoCinchas`** lo escribe `capitulos/precio.ts` en el orden 12. Parte de los desplazamientos del marco y del panel en el documento, cacheados en `medidas`, menos `scroll.y`, con `--amarre-dx/dy` y `--cincha-ancho` leídos del estilo computado en `medidas`. No lee el layout por frame. Se usa `traspaso.destinos()` (§5.7).
7. **Traspaso, overlay** (WP3, orden 40). Con `h = traspaso(cap.precio.e)`:
   - `#capa-cinchas` es visible si `cap.amarre.p ≥ 0,90`, `h < 1`, `fuente ≠ 'ninguna'` y no hay movimiento reducido.
   - Dibuja, para cada i, `trazoCincha(cinchas2D[i], destinoCinchas[cinchas2D[i].esquina], h)`.
   - Con h = 0 el trazo es exactamente el polígono de `cinchas2D`: naranja plano, sin tejido ni carraca, idéntico a la cinta 3D.
8. **Traspaso, en flujo** (WP4, orden 45). `svg.precio__amarre` (con viewBox = su tamaño CSS, 1 unidad = 1 px) es visible si `h ≥ 1` o hay movimiento reducido. Dibuja `trazoCincha(null, destino, 1, asiento)`. En el instante del relevo, el asiento vale 0 y los píxeles son los mismos que los del overlay.
9. **Asiento del panel** (WP4). Cuando h cruza 1 hacia delante, un muelle crítico (ω = 33) lleva `asiento` de 0 a 3,5 px y `compresion` de 1 a 0,996. Se aplican como `transform: translateY(asiento) scaleY(compresion)` con `transform-origin: 50% 100%`. Los extremos B de las cinchas en flujo se desplazan igual (arriba: `asiento + (1 − compresion)·alto`; abajo: `asiento`). Al cruzar hacia atrás, vuelve a 0 y 1. En ráfaga (§2.0), salto directo.
10. **En táctil** el relevo overlay → en flujo puede llegar un frame tarde respecto al scroll del compositor. Es aceptable, porque ocurre en un único frame con las cintas ya quietas.

### 5.7 Guiones (funciones puras, `src/guion/*`, dueño WP0)

Utilidades (`util.ts`):

- `clamp(x, a = 0, b = 1)`
- `lerp(a, b, t)`
- `loc(p, [a, b]) = clamp((p − a)/(b − a))`
- `easeCalzo = bezier(0.62, 0, 0.12, 1)` (Newton-Raphson con bisección de respaldo; tolerancia 1e-6)
- `muelleCritico(x, v, objetivo, omega, dt) → [x, v]` (integración semi-implícita)

Las funciones son deterministas, **no leen el DOM**, no importan three y se prueban en Node (§9.1).

```ts
// pieza.ts
export function introPieza(t: number): { barridoX: number; clave: number };
// barridoX = lerp(−1.45, 1.45, easeCalzo(clamp(t/1.6))); clave = 0.35·loc(t,[0.8,1.6])
export function pieza(p: number): { envRot: number; clave: number; camT: number; sueloDOM: number; chip: boolean };
// envRot = 0.9·easeCalzo(loc(p,[0,.5])); clave = lerp(.35, 1, easeCalzo(loc(p,[.5,1])));
// camT = 0.5·loc(p,[0,.5]) + 0.5·easeCalzo(loc(p,[.5,1])); sueloDOM = 1 − loc(p,[.10,.25]); chip = p ≥ .9
export function mezclaPieza(t: number, p: number): { barridoX: number; barridoI: number; clave: number; envRot: number; camT: number };
// m = loc(p,[0,.05]); introViva = t < 1.6 && p ≤ .05
// barridoX = introPieza(t).barridoX; barridoI = introViva ? 1.2·(1 − m) : 0
// clave = lerp(introPieza(t).clave, pieza(p).clave, m); envRot y camT = los de pieza(p)

// amarre.ts
export const TRAMOS = { plataforma: [0,.06], rueda: [.06,.12], calzo: [.12,.20], tija: [.20,.27],
  delanteras: [.27,.41], traseras: [.41,.53], horquilla: [.53,.59], compresion: [.59,.68],
  grua: [.68,.90], traspaso: [.90,1] } as const;
export type Tramo = keyof typeof TRAMOS;
export function cincha(u: number): { reveal: number; pasos: number; T: number };
// reveal = easeCalzo(clamp(u/0.4)); pasos = clamp(floor(((u − 0.4)/0.6)·6 + 0.5), 0, 6); T = pasos/6
// (los clics caen en u = 0,45 · 0,55 · 0,65 · 0,75 · 0,85 · 0,95)
export function amarre(p: number, o?: { compacto?: boolean }): {
  tramo: Tramo; plano: PlanoId | 'spline'; u: number;           // u = loc(p, TRAMOS[tramo])
  foco: PiezaId | null; focoMezcla: number;
  plataformaY: number; calzoX: number; calzoVisible: boolean; clac: boolean;
  cinchas: [ReturnType<typeof cincha>, ReturnType<typeof cincha>, ReturnType<typeof cincha>, ReturnType<typeof cincha>]; // del_I, del_D, tras_I, tras_D
  horquilla: number; grua: number; envRotExtra: number; clave: number; entorno: number; contras: number; sinLuz: number;
  camaraExacta: boolean; cinchas3D: boolean; cinchasSVG: boolean; opacidadCanvas: number;
  texto: 'titulo' | 'rueda' | 'tija' | 'horquilla' | null };
// plano: plataforma→'am.bajo', rueda→'am.rueda', calzo→'am.calzo', tija→'am.tija', delanteras→'am.delanteras',
//        traseras→'am.traseras', horquilla y compresion→'am.horquilla', grua→'spline', traspaso→'am.cenital'
// foco: rueda_del con mezcla loc(p,[.06,.08]) − loc(p,[.18,.20]); tija con loc(p,[.20,.22]) − loc(p,[.27,.30]);
//       horquilla con loc(p,[.53,.55]) − loc(p,[.59,.62]); fuera de esos rangos, null y 0
// plataformaY = 0.35·easeCalzo(loc(p,TRAMOS.plataforma)); calzoX = 0.55·(1 − easeCalzo(loc(p,TRAMOS.calzo))); calzoVisible = p ≥ .12
// clac = p ≥ 0.20
// cinchas[0] = cinchas[1] = cincha(loc(p,TRAMOS.delanteras)); cinchas[2] = cinchas[3] = cincha(loc(p,TRAMOS.traseras))
//   compacto: traseras = p ≥ .41 ? {reveal:1, pasos:6, T:1} : {reveal:0, pasos:0, T:0}
// horquilla = easeCalzo(loc(p,TRAMOS.compresion))
// g = loc(p,TRAMOS.grua): grua = easeCalzo(g); envRotExtra = 1.2·grua; clave = 1 − loc(g,[0,.5]);
//   entorno = lerp(.5,.05,loc(g,[0,.5])); contras = lerp(1,.35,loc(g,[0,.6])); sinLuz = loc(g,[.2,.6])
// camaraExacta = g > .85 || p ≥ .90
// cinchasSVG = p ≥ .90; cinchas3D = p < .905; opacidadCanvas = 1 − loc(p,[.905, 1])
// texto: 'titulo' en [0,.06); 'rueda' en [.06,.20); 'tija' en [.20,.53); 'horquilla' en [.53,.68); null en [.68,1]
//   opacidad de cada fase: rampas de 0,015 de p en sus bordes

// traspaso.ts
export function traspaso(e: number): number;               // h = easeCalzo(clamp(e/0.8))
export function tension(h: number): number;                // T = 1 − 0.3·sin(π·h)
export function esquinaDe(a: Punto, centro: Punto): Esquina; // (a.y < centro.y ? 't' : 'b') + (a.x < centro.x ? 'i' : 'd')
export function destinos(panel: { left: number; top: number; right: number; bottom: number },
                         dx: number, dy: number, ancho: number): Record<Esquina, DestinoCincha>;
// esquinaPanel: ti (left,top) · td (right,top) · bi (left,bottom) · bd (right,bottom)
// anilla:       ti (left−dx, top−dy) · td (right+dx, top−dy) · bi (left−dx, bottom+dy) · bd (right+dx, bottom+dy)
export function trazoCincha(desde: Cincha2D | null, hasta: DestinoCincha, h: number,
                            asiento?: { arriba: number; abajo: number }): {
  d: string; carraca: string; textura: number; opacidadCarraca: number };
// Bordes del destino: dir = esquinaPanel − anilla; n = (−dir.y, dir.x)/|dir|. Borde izquierdo = +n·ancho/2 (convención §4.4).
// Con h ≥ 1 (o desde = null) solo cuenta el destino; el asiento desplaza en y el extremo del panel (arriba o abajo según la esquina).
// Si no: cada punto = lerp(desde.ladoX[i], destino.ladoX[i], h).
// flechaPx = 0.12 · L · max(0, 1 − tension(h))^1.5 (L = longitud del eje en px), hacia +y de pantalla.
// Cada borde largo es una cuadrática con el control en su punto medio + (0, flechaPx).
// d = `M A0 Q c0 B0 L B1 Q c1 A1 Z`, con 2 decimales.
// textura = 0.35·loc(h,[0,.3]); opacidadCarraca = loc(h,[0,.2]); con h ≥ 1: 0.35 y 1.
export function carraca(a: Punto, angulo: number, escala: number): string;
// path del cuerpo (22×12 px · escala) y de la palanca, centrado a 14 px·escala de A hacia B y girado 'angulo'

// cierre.ts
export function cierre(p: number): { camT: number; atado: boolean; frase: boolean };
// camT = easeCalzo(loc(p,[0,.3])); atado = p < .30; frase = p ≥ .45
export function desatado(t: number): { T: number; reveal: number; calzoX: number; calzoVisible: boolean; plataformaY: number };
// t en s desde el cruce hacia delante de p = 0,30 (0..1,4). Para volver a atar se evalúa desatado(1.4 − t).
// T = max(−0.15, e^(−7t)·(cos 11t + (7/11)·sin 11t))   (cae de 1 a 0 con una sobreoscilación amortiguada)
// reveal = 1 − easeCalzo(loc(t,[0.5,1.2])); calzoX = 0.55·easeCalzo(loc(t,[0.6,1.2])); calzoVisible = t < 1.2;
// plataformaY = 0.35·(1 − easeCalzo(loc(t,[0.9,1.4])))
```

**Diffs de estado** que usa el director (no hay eventos de bus):

- **Asiento del calzo:** `clac` pasa de falso a verdadero con `dir = 1`.
- **Palanca y muelle de tensión:** aumenta `pasos` en una cincha.
- **Desatado:** `atado` cambia.
- **Sombra:** cambia `plataformaY`, `calzoX` u `horquilla` ⇒ `shadowMap.needsUpdate`.

En ráfaga (§2.0) se aplica el estado final sin muelle.

### 5.8 API de QA (`src/lib/qa.ts`, import dinámico)

`window.__calzo` expone:

- `estado`
- `guion: { pieza, mezclaPieza, amarre, traspaso, cierre, desatado }`
- `pausar()` → `pausarTodo()` + `escena()?.pausar()`
- `reanudar()`
- `ir(cap, v, fase = 'p')` → `irA(scrollDe(cap, v, fase), { inmediato: true })` + `medir` + un frame de todos los `onFrame` + `renderUnaVez()`
- `renderUnaVez()`
- `info()` y `pixel(x, y)` (los añade WP2)
- `medir(ms): Promise<{ mediana, p95, max, largas }>` (tiempos de frame + longtasks)
- `recorrido(seg)`: scroll programado de arriba abajo con `lenis.scrollTo`
- `tab(): Promise<Array<{ selector, opacidad, dentro }>>`: recorre todos los enfocables con `focus()` y devuelve los que tienen opacidad calculada ≤ 0,9 o quedan fuera del viewport

Parámetros de URL:

- `?still=amarre:0.62` o `?still=precio:e0.5`: tras `listo` ejecuta `ir()` y después `pausar()`.
- `?tier=alto|medio|bajo|sin-webgl`
- `?rm=1`: fuerza movimiento reducido.
- `?debug=1`: un rótulo con fps, capítulo activo, `e`/`p` y fuente.

---

## 6. Calculadora

### 6.1 Dónde está y cómo se llega

Es el producto y nunca está a más de un gesto:

- **Frase-precio en el héroe**, con cifra real sin hacer scroll y un select nativo de destino.
- **Chip del nav** («Moto · Valencia · 205 €»), visible desde el final del héroe (fundido de 200 ms), en escritorio.
- Skip-link «Ir a la calculadora».
- Enlaces de cargas y rayos de la rosa.
- **Barra inferior en compacto** desde el final del héroe.
- `?carga=quad|barco|coche&destino=palma&vuelta=1`, para enlazar desde anuncios o WhatsApp.

### 6.2 Forma: un panel atado, no un formulario SaaS ni un cuadro de mandos

`form#calc` real dentro de `.precio__panel`:

- **Sólido** `--grafito-alto`, `--r-m`, sin vidrio, filo ni halo. Lo sujetan las cuatro cinchas del traspaso (§5.6), que están dibujadas fuera de él, en el margen de `.precio__marco`.
- Rejilla de 12 columnas: **mandos en 1–5, lectura en 6–12**. En compacto, una columna con la lectura del precio pegada (`position: sticky; top: 56px`) en la parte superior del panel mientras se rellenan los campos.
- Nada de lo que hay dentro está animado salvo la cifra del precio (§6.3).

**Mandos**, de arriba abajo, todos nativos y accesibles:

1. H2 `Cuánto cuesta.` y la entrada.
2. **`Qué llevamos`**: `fieldset` + `legend` (etiqueta de display) + 4 radios `name="carga"` (Moto · Quad/UTV · Barco · Coche) en un control segmentado de 56 px de alto.
   - Cada opción lleva su pictograma de 28 px y su nombre. No hay letras decorativas.
   - La opción marcada se distingue por su estilo `:checked` (fondo `--hueso` al 8 % y borde de 1 px `--hueso`), con una transición de color de 150 ms. No hay indicador deslizante ni rebote.
   - Las flechas del teclado funcionan de forma nativa.
3. **`Adónde, desde Madrid`**: `select[data-destino-select]` nativo con chevron SVG, Newsreader 400 a 1,125 rem.
   - `optgroup` «Península» (19) y «Náuticos y Baleares» (6), en orden alfabético con `localeCompare('es')`.
   - Etiqueta de cada opción: «Valencia — 355 km»; los náuticos añaden «· puerto» y Palma «· ferry».
4. **Solo si `carga = barco`**, desplegado con una transición de `grid-template-rows` (0fr → 1fr, 260 ms):
   - `Eslora`: `input type=range` de 4 a 12, paso 0,2, valor por defecto 6,4, con `datalist` de marcas por metro y lectura en cifras «6,4 m».
   - `Manga de más de 2,55 m`: checkbox. Al marcarse se enciende el **testigo** (un punto de 10 px en `--cincha`, sin halo y sin parpadeo), se muestra la nota «Autorización complementaria de circulación: la tramitamos y va en el precio» y el desglose suma «+35 %».
5. **`Viaje`**: dos radios `name="viaje"` (Solo ida / Ida y vuelta).

**Lectura** (columna derecha):

- Etiqueta `Desde` (display 600, mayúsculas).
- **Precio**: `output.precio__cifra` (`aria-live="polite"`, 400 ms de debounce).
  - Contiene la cifra visual (dos `<span aria-hidden="true">` para el fundido cruzado de 180 ms) y un `<span class="sr">205 €</span>` con el valor final, que es lo único que se anuncia.
  - Overpass Mono 400, `--t-precio`, `tabular-nums`, sin «,00». Con movimiento reducido, cambio seco.
  - Al lado, la nota `Tarifa provisional` en `--ceniza` mientras `PROVISIONAL` sea true.
- **Regla de distancia**: `MADRID |——— 355 km ———| VALENCIA`.
  - Longitud proporcional a km/750 del ancho de la columna, aplicada como `scaleX` **sin transición**.
  - En ida y vuelta se añade un trazo discontinuo de vuelta, también sin animación.
- Línea de cifras: `355 km · unas 4 h 45 min de carretera` (+ `· por trayecto` en ida y vuelta, `· incluye ferry` en Palma).
- `Incluye parte de estado con fotos y seguro por valor declarado.`
- `<details>` **«Cómo sale este número»** con el desglose honesto: solo las líneas que aplican (§6.4), en cifras pequeñas con puntos guía.
- Mini-lámina de la carga (1 px), solo si no es moto: la planta del quad o la sección del barco. Con `manga`, el casco se dibuja ensanchado (§5.5), sin animación.
- CTA doble:
  - **`Reservar por WhatsApp`**: `a[data-wa]`, 56 px de alto, fondo `--cincha` con texto `--carbon` (4,72:1). En escritorio abre en pestaña nueva.
  - Secundario: `Llamar · 600 000 000` (`tel:`), en `--hueso` con hairline.
- Legal: `Precio orientativo por distancia y tipo de carga. Se confirma al ver el punto de recogida.`

**Debajo del marco:** `details#tarifas` con la tabla de 25 destinos (§6.6).

### 6.3 Comportamiento

- **Hay resultado sin tocar nada:** moto · Valencia · ida → **205 €**, 355 km, unas 4 h 45 min.
- El cálculo es síncrono en `input`/`change` (menos de 1 ms). No hay pin ni scrub en la sección y el 3D no renderiza.
- **La única animación del panel es el fundido cruzado de la cifra** (180 ms, `--ease`). No hay odómetro, pulso, contador de regla, rebote ni halo.
- Objetivos táctiles de al menos 48 px. `data-lenis-prevent` en el panel, para que el select y el range sean nativos.
- Los errores no son posibles con controles cerrados. Si faltara un dato, se señala en `--hueso` con texto, nunca en rojo ni en naranja.
- Se **elimina** la «próxima salida» calculada del código actual: es un dato inventado.

### 6.4 Lógica (`src/lib/precio.js` sobre `src/data/tarifas.js`)

`tarifas.js` se modifica así:

- **Tildes en los nombres:** Málaga, A Coruña, Córdoba, Almería, Cádiz, San Sebastián, Dénia, Jávea.
- **Constantes nuevas, placeholder, que hoy están escritas a mano en `Hero.astro`:** `ESLORA_REF = 6`, `RECARGO_ESLORA_M = 0.06`, `ESLORA_MIN = 4`, `ESLORA_MAX = 12`, `ESLORA_PASO = 0.2`, `ESLORA_DEFECTO = 6.4`, `REDONDEO = 5`, `DESTINO_DEFECTO = 'valencia'`, `CARGA_DEFECTO = 'moto'`, `PROVISIONAL = true`.

Algoritmo (idéntico al actual, para no inventar tarifas):

```
x = max(base + km·tarifaKm, mínimo)
si barco:  x ·= 1 + max(0, eslora − 6)·0,06
si barco y manga: x ·= 1,35
si vuelta: x ·= 1,65
si destino marítimo (Palma): x += 320        (una vez, también en ida y vuelta)
total = round(x / 5)·5
duración = km / 75 h, redondeada a 5 min  → "4 h 45 min"
```

**Formato** (sin `Intl`, para que Node y todos los navegadores den lo mismo):

- Euros: entero, **punto de miles siempre**, **U+00A0** y `€`: `205 €`, `2.355 €`. `Intl.NumberFormat('es-ES')` no agrupa los números de 4 cifras, y por eso no se usa.
- Kilómetros: `355 km`, con U+00A0.
- Duración: `4 h 45 min`, con U+00A0 entre número y unidad. **Nunca `≈`**: no está en el subconjunto latin de ninguna de las tres fuentes. En la interfaz se antepone «unas».
- El texto estático del copy usa espacios normales.

Líneas del desglose (`txt` exacto):

- `Salida: 55 €`
- `355 km × 0,42 €/km = 149,10 €`
- `Mínimo aplicado: 130 €` (solo si aplica)
- `Eslora 6,4 m: +2,4 % (6 % por metro sobre 6 m)`
- `Manga > 2,55 m: +35 % (autorización complementaria de circulación)`
- `Ida y vuelta: ×1,65`
- `Ferry a Palma: +320 €`
- `Redondeado a 5 €`

Valores de referencia, que son también las pruebas (verificados con los datos actuales de `tarifas.js`):

| Entrada | Total |
|---|---|
| moto · Valencia · ida | 205 € |
| moto · Málaga · ida | 280 € |
| moto · Valladolid · ida | 135 € |
| moto · Palma · ida | 525 € |
| moto · Valencia · ida y vuelta | 335 € |
| moto · Palma · ida y vuelta | 655 € |
| moto · Empuriabrava · ida | 370 € |
| quad · Barcelona · ida | 380 € |
| barco · Dénia · eslora 6,4 · sin manga | 545 € |
| barco · Dénia · eslora 8 · manga | 805 € |
| coche · Sevilla · ida | 375 € |
| barco · Empuriabrava · eslora 12 · manga · ida y vuelta | **2.355 €** (el máximo posible: 4 cifras) |

Duraciones de referencia: 195 km → `2 h 35 min`, 355 → `4 h 45 min`, 530 → `7 h 05 min`, 620 → `8 h 15 min`, 750 → `10 h 00 min` (con U+00A0).

### 6.5 WhatsApp

Mensaje (`mensajeWhatsApp`), con **solo los parámetros del cálculo y ningún dato personal**:

`Hola. Quiero transportar {una moto|un quad/UTV|un barco|un coche} de Madrid a {Valencia}, {solo ida|ida y vuelta}{, eslora 6,4 m}{, manga de más de 2,55 m}. La web me da {205 €} orientativos. ¿Qué fecha tenéis?`

- `{205 €}` sale de `formatoEuros` (con U+00A0, que en la URL es `%C2%A0`).
- El resto del texto lleva espacios normales.
- El número sale de `contacto.js` (`WA_NUM = '34600000000'`, PLACEHOLDER).

### 6.6 Sin WebGL, sin JS y tabla de tarifas

- **Sin WebGL**, la calculadora es idéntica: no depende del 3D. El traspaso lo alimenta `MotoPlanta` (§5.6).
- **Tabla de tarifas** (`details#tarifas`, en flujo debajo del marco, **siempre en el HTML**, nunca en `<noscript>`):
  - Resumen: `Tarifas orientativas desde Madrid, en tabla`.
  - Columnas: `Destino · Distancia · En carretera · Moto · Quad/UTV · Coche`, 25 filas generadas en el build con `tablaPrecios()`.
  - Nota de barco: `Barco: desde 140 € + 0,85 €/km, mínimo 290 €; +6 % por metro de eslora sobre 6 m; +35 % con manga de más de 2,55 m. Palma: +320 € de ferry.`
  - Es la única tabla de la web: la rosa de rutas enlaza aquí.
- **Sin JS** (`html:not(.js)`):
  - Se ocultan los mandos y la lectura del formulario, que sin JS no pueden recalcular.
  - `details#tarifas` se muestra abierto (`html:not(.js) #tarifas > :not(summary) { display: block }` y el `summary` se oculta).
  - El CTA `a[data-wa]` lleva el mensaje por defecto generado en el build. `tel:` y `mailto:` funcionan.
  - Las cinchas en flujo no se dibujan.

---

## 7. Fallbacks y rendimiento

### 7.1 Detección y tiers

El script inline del head (§5.5) da una primera estimación sin tocar la GPU. El loader la corrige durante la carga. Después de `listo` el tier ya no cambia: solo se degrada la calidad sin recompilar (§7.7).

| Tier | Cuándo | 3D |
|---|---|---|
| alto | ≥ 1024 px, puntero fino, sin señales de gama baja | Presupuesto de 2,3 Mpx, DPR ≤ 1,75, sombras PCF de 1024 fijadas en la carga, ≤ 180k triángulos, PMREM 256, texturas GPU de 1024² |
| medio | Compacto (< 1024 o táctil) o alto degradado por el benchmark | 1,2 Mpx, DPR ≤ 1,5, sin sombras, ≤ 90k triángulos, PMREM 128, texturas de 512² |
| bajo | Gama baja o benchmark lento en medio | Ruta SVG (no descarga three) |
| sin-webgl | No se pudo crear el renderer WebGL2 | Ruta SVG |

**Benchmark** (en la carga, tras `compileAsync` y el primer fotograma; 20 frames de `pieza.b` al tamaño real, con exposición de clave 0):

- Con `EXT_disjoint_timer_query_webgl2`, se mide **tiempo de GPU**. Mediana > 9 ms en alto ⇒ medio: se quitan las sombras (recompila, todavía en carga) y el presupuesto baja a 1,2 Mpx, pero se conservan la geometría y el PMREM ya construidos. Mediana > 14 ms en medio ⇒ bajo.
- Sin la extensión, se mide el intervalo de rAF. Un tope estable de 30 fps (mediana 33,3 ± 1,5 ms y desviación < 2 ms: modo de bajo consumo o ahorro de batería) **no** cuenta como lento: se usa medio. Mediana > 24 ms sin ese patrón ⇒ se baja un tier.
- No se mide con `document.hidden`. Si la pestaña está oculta más allá del límite, se usa el tier de la heurística.

### 7.2 Móvil (modo compacto: < 1024 px o `pointer: coarse`)

- **Scroll:** Lenis sin efecto en táctil (`syncTouch: false`, scroll nativo); alturas en `svh`.
- **Medición:** `e`/`p` usan `estado.vp.hs` (la sonda de 100svh), que no cambia cuando se recoge la barra de URL. `p` no se desplaza al hacer scroll.
- **Canvas:** mide 100lvh. Los cambios de alto de menos de 150 px (la barra) **no** llaman a `setSize`: solo se recalculan el encuadre y `setViewOffset` con el nuevo `innerHeight`, y se republica `cinchas2D`. No hay reasignación del búfer ni fotogramas negros.
- **Cámara:** encaje por caja (§4.9); fov ≤ 30.
- **Se desactiva:** la animación de las cinchas traseras (aparecen tensas), la interacción de la rosa y las sombras.
- **Se mantiene:** el Desvelado, el Amarre (fijo de 200) con traspaso al panel, las fotos del parte (360 × 270) y el desatado.
- **Barra inferior** fija de 64 px + safe-area, desde `pieza.p > 0,9`: `205 € · Moto a Valencia` y el botón `WhatsApp`.
  - El botón es de contorno `--hueso` hasta que `scroll.y ≥ scrollDe('amarre', 0.90)` y a partir de ahí pasa a fondo `--cincha` con texto `--carbon`. El naranja aparece con el traspaso, no antes.
  - La barra se oculta mientras `#precio` ocupa más del 30 % del viewport, para no tapar el panel.

### 7.3 `prefers-reduced-motion`

- **Sin Lenis y sin fijos:** la maquetación base de §5.2 (pistas de alto automático y escenarios en flujo) es la de movimiento reducido.
- Sin scrub, sin barridos y sin desatado animado. Los textos y fases se ven en orden.
- **3D en fotogramas quietos, sin canvas visible:** cada capítulo 3D muestra `<img data-preset>` generados con `capturar(preset)` en tiempo ocioso tras `escena:lista`. Cada imagen aparece con un fundido de 200 ms. **No hay ningún canvas fijo detrás de contenido en flujo.**
  - Pieza: `quieto.pieza`.
  - Amarre: 4 pasos en `<ol>`, cada uno con su imagen y su texto: `quieto.calzo` («La rueda delantera va calzada»), `quieto.cinchas` («Delante, las cinchas van a la tija»), `quieto.horquilla` («La horquilla se comprime lo justo») y `quieto.cenital` («Lista para viajar»).
  - Contacto: `quieto.cierre`.
  - Con fuente SVG, las mismas posiciones muestran `MotoLinea`/`MotoPlanta` estáticas.
- **Precio:** las cinchas en flujo se dibujan directamente en su estado final, sin overlay ni asiento.
- **Entradas únicas:** solo opacidad (200 ms). La cifra del precio cambia en seco.
- Si la preferencia cambia en caliente, en ese momento solo se detienen Lenis y los efectos por tiempo (que pasan a su estado final). La maquetación reducida completa se aplica en la siguiente carga: no se reconstruye la página en caliente.

### 7.4 Sin WebGL (tiers `bajo` y `sin-webgl`, o `fuente = 'svg'`)

- **Mismas alturas y misma coreografía de DOM**, con la moto como dibujo lineal SVG, coherente con la regla «todo lo demás es línea».
- **Héroe:** `MotoLinea` apoyada en la línea de suelo (trazo `--hueso` al 60 %). El barrido de la intro es un `linearGradient` que recorre el trazo una vez en 1,6 s.
- **Amarre** (`moto-svg.ts`, función de `p` como el 3D):
  - Pausas: la pieza en `--hueso` pleno y el resto del dibujo al 25 %.
  - Calzo que entra; cinchas en alzado que pasan de curva a recta en los mismos 6 clics y de `--cincha-floja` a `--cincha`; horquilla que baja 28 mm.
  - Grúa: fundido del alzado a `MotoPlanta` con la X (g 0,3–0,7).
  - Traspaso idéntico: a p ≥ 0,90, `moto-svg.ts` publica `cinchas2D` y la silueta de la planta se funde a 0 entre 0,905 y 1.
- **Parte:** recortes vectoriales de `MotoLinea` (§2.5).
- **Cierre:** `MotoLinea` con las cinchas que se aflojan y recogen con `desatado(t)`.

### 7.5 Sin JS

Astro sirve el relato completo en HTML semántico y en orden, con la maquetación base (sin pistas ni escenarios fijos):

1. H1, línea de servicio y frase-precio con 205 €, con `MotoLinea` estática.
2. H2 del amarre y `<ol>` de sus pasos (rueda, tija, horquilla).
3. Precio: tabla de tarifas abierta y CTA de WhatsApp con el mensaje por defecto.
4. Láminas de cargas (visibles: el estado oculto de las entradas solo existe con `html.js`).
5. Parte con los huecos, el texto y la nota «ejemplo».
6. Seguro.
7. Rutas: rosa SVG completa y enlace a la tabla.
8. Cierre y CTA con `wa.me`, `tel:` y `mailto:` funcionando.

Todo estado oculto de animación cuelga de `html.js` (y los escenarios fijos, de `html.js:not(.reducido)`), así que sin JS no queda nada invisible ni superpuesto. Si JS existe pero `app.ts` no arranca, la salvaguarda del head quita `js` a los 4 s (§5.5).

### 7.6 Presupuesto (cifras medidas, no estimadas)

Tamaños medidos el 24-sep-2026 con esbuild (minify + gzip -9), three 0.186.1, gsap 3.15.0 y lenis 1.3.26. Las fuentes, en el CDN de fontsource 5.3.0.

| Recurso | Medido | Límite |
|---|---|---|
| LCP | — | ≤ 2,0 s (4G rápido, portátil medio); ≤ 2,5 s en Android medio. El LCP es el texto del H1, pintado en el HTML inicial, nunca el canvas |
| CLS / INP | — | ≤ 0,02 / ≤ 150 ms |
| HTML + CSS | — | ≤ 60 KB gzip |
| JS inicial: librerías (gsap core + CustomEase + Lenis) | **35,2 KB gz** | — |
| JS inicial: app (estado, motion, capítulos, calc, precio, guion, revelar, módulos de capítulo, escena-loader) | — | ≤ 45 KB gz |
| **JS inicial total** | — | **≤ 80 KB gz** (`qa.ts` fuera: import dinámico) |
| Chunk 3D: three con las piezas usadas (renderer, físicos, Lathe/Tube/Extrude/Torus, RoundedBox, BufferGeometryUtils, PMREM, Spot/Directional/Point, RenderTarget, Raycaster, curvas) | **146,0 KB gz** | — |
| Chunk 3D: app 3D (escena, director, planos, presets, suelo, captura, amarre, moto, entorno, materiales, texturas) | — | ≤ 54 KB gz |
| **Chunk 3D total** (`import()` dinámico, nunca en el inicial) | — | **≤ 200 KB gz** |
| Fuentes | **112,9 KB** iniciales + 1,9 KB de la itálica del cierre | ≤ 116 KB; preload solo de Big Shoulders |
| Imágenes descargadas | — | **0** (todo es procedural, SVG o captura en vivo) |
| **Primera visita completa** (HTML + CSS + JS inicial + chunk 3D + fuentes) | — | **≤ 460 KB** |
| Ruta GLB (solo si se activa) | — | Chunk ≤ 40 KB gz + Draco ≈ 300 KB + modelo ≤ 6 MB, fuera del presupuesto base |
| Triángulos | — | ≤ 180k en alto · ≤ 90k en medio |
| Draw calls | — | ≤ 60 (moto fusionada por material y grupo ≈ 30 + plataforma y anillas 2, calzo 2, 4 cinchas, 8 piezas de carraca, suelo y sombra de contacto: ≈ 48) |
| Programas de shader | — | **≤ 24**, medidos con `info().programas` y precompilados con `compileAsync` |
| Texturas GPU | — | ≤ 8 (dibujo del neumático, tejido, lagrimado, rugosidad, piel de naranja, moleteado, alpha del suelo y sombra de contacto); 1024² en alto y 512² en medio |
| PMREM | — | 256 en alto · 128 en medio, generado una vez |
| Píxeles | — | `dpr = min(devicePixelRatio, 1.75, sqrt(2.3e6 / (W·H)))` en alto; `min(devicePixelRatio, 1.5, sqrt(1.2e6 / (W·H)))` en medio |
| FPS | — | 60 en escritorio medio (M1, Iris Xe, GTX 1650) a 2560 × 1440 incluido; ≥ 45 en Android medio |

`scripts/presupuesto.mjs` hace fallar el build de QA si se excede cualquier tamaño, y también **si el chunk de entrada contiene three** (busca `WebGLRenderer` y la cadena `REVISION`).

### 7.7 Bucle, pausa y calidad adaptativa

- **Render bajo demanda.** Se renderiza solo si el canvas está visible y el director devuelve `sucio`:
  - cambio de scroll con un capítulo 3D en pantalla;
  - muelle de cámara, de tensión, de asiento o de desatado sin asentar (|Δ| > 1e-4);
  - la intro por tiempo en curso;
  - `resize` o `renderUnaVez`.
- **Pausa.** El canvas **no renderiza** y queda `visibility: hidden` cuando ningún capítulo de `CAP_3D` corta el viewport, cuando la opacidad del amarre llega a 0, cuando `document.hidden` y bajo `qa-pausa`.
- **Calidad adaptativa en caliente: solo escalones que no cambian ningún programa.** Media de 60 frames > 20 ms ⇒ se baja un escalón, con 3 ventanas de enfriamiento; media < 13 ms durante 5 ventanas ⇒ se sube uno. Escalones:
  1. Presupuesto de píxeles −25 % (hasta un mínimo de 0,8 Mpx). `setPixelRatio` reasigna el búfer y se renderiza en el mismo frame.
  2. Sombras congeladas: el director deja de pedir `shadowMap.needsUpdate` y se conserva el último mapa.
  3. Presupuesto de píxeles al mínimo.

  **Prohibido en caliente:** activar o desactivar sombras, cambiar el número o el tipo de luces, cambiar el tamaño del PMREM o activar o desactivar capas físicas. Todo eso forma parte de la clave de programa y recompila a mitad del recorrido.
- **Construcción troceada.** La moto cede el hilo con `scheduler.yield?.()` o `setTimeout(0)` entre piezas. **Ninguna tarea larga pasa de 50 ms.**
- **Texturas en GPU.** Todas las texturas procedurales se generan con `texturaGPU()` (un render a un RenderTarget cada una). No hay texturas pintadas en canvas 2D en el hilo principal. Solo la sombra de contacto podría tentar al canvas 2D, y también va en GPU.
- **Capturas** fuera de pantalla con lectura asíncrona (`readRenderTargetPixelsAsync`), sin sincronizar el canvas visible (§5.4).
- **Memoria:** se liberan los render targets temporales (`dispose`) al terminar cada captura. Los objectURL de las fotos viven lo que vive el documento: **no hay listener `unload`**.

---

## 8. SEO y accesibilidad

### 8.1 Jerarquía y contenido en HTML

- **Un único `<h1>`**, en el héroe: lema + línea de servicio. El texto que llega a los buscadores es «Se sube atado. Se baja igual. Transporte de motos, quads y embarcaciones por carretera, desde Madrid a toda España.»
- **`<h2>`, uno por capítulo (7):**
  - #amarre «Así se ata una moto.»
  - #precio «Cuánto cuesta.»
  - #cargas «También llevamos quads y barcos.»
  - #parte «Cuatro fotos al cargar y cuatro al entregar.»
  - #seguro «Asegurada por lo que vale.»
  - #rutas «Salimos de Madrid hacia toda España.»
  - #contacto «Se baja igual.»
- **`<h3>`:** las tres pausas del amarre («La rueda delantera va calzada.», «Delante, las cinchas van a la tija.», «La horquilla se comprime lo justo.») y «Quads y UTV», «Embarcaciones» y «Coches».
- **No hay kickers.** No hay ningún texto numerado fuera de los datos.
- **Todo el contenido está en el HTML de Astro:** el precio por defecto, la tabla de 25 destinos (en `details`, nunca en `noscript`), la técnica del amarre y el texto del parte y del seguro. Nada vive solo en el canvas.
- Los escenarios fijos **nunca** ocultan contenido con `display: none` ni `visibility: hidden`. Las fases usan opacidad y los textos de todas las fases existen desde el principio.
- `title` y `description` se mantienen (index.astro), junto con `lang="es"` y las etiquetas `og:*`.
- **`noindex` se mantiene** hasta el alta de la empresa: `<meta name="robots" content="noindex, nofollow">` en Layout y `Disallow: /` en `public/robots.txt`. Antes de quitarlo hay que sustituir las tarifas placeholder.

### 8.2 Contraste (AA, calculado con la fórmula WCAG sobre los tokens de §3.1)

| Par | Ratio | Uso |
|---|---|---|
| `--hueso` sobre `--carbon` / `--grafito` / `--grafito-alto` | 15,51 / 14,47 / 13,36 | Texto principal |
| `--ceniza` sobre `--carbon` / `--grafito` / `--grafito-alto` | 5,71 / 5,33 / 4,92 | Secundario y notas |
| `--aluminio` sobre `--carbon` / `--grafito-alto` | 8,67 / 7,47 | Anillas, filos |
| `--carbon` sobre `--cincha` | 4,72 | Texto de los botones de WhatsApp |
| `--cincha` sobre `--carbon` | 4,72 | Testigo, cinchas (gráficos, ≥ 3:1) |
| `--tinta` / `--tinta-2` sobre `--papel` | 13,43 / 5,46 | Banda de papel |
| `--cincha` sobre `--papel` | 3,02 | Solo cinchas y puntos de amarre de las láminas (gráficos) |

- **Prohibido:** `--cincha` como texto sobre `--grafito-alto` (4,07) o sobre `--papel` (3,02); `--junta` como texto (1,36); `--hueso` sobre `--papel` (1,09).
- El texto nunca depende del 3D: el H1 es `--hueso` liso.

### 8.3 Foco y teclado con capítulos fijos

- El primer elemento enfocable es el skip-link «Ir a la calculadora». Tab recorre el DOM en orden narrativo.
- Espacio, AvPág y las flechas hacen scroll nativo: los escenarios sticky no capturan el scroll.
- **Regla genérica de foco en escenarios fijos.** Todo elemento enfocable dentro de un `.cap--fija` lleva `data-fase-p` con la `p` en la que su fase es plenamente visible. `capitulos.ts` tiene un único `focusin` que llama a `irA(scrollDe(cap, p), { inmediato: true })`. Hoy solo hay enfocables en el escenario del héroe (el select y el enlace de la frase-precio, visibles en toda la pista, con `data-fase-p="0"`). El amarre no tiene enfocables y el CTA del cierre está fuera de la pista.
- Las fases con opacidad < 0,5 no reciben clics (`pointer-events: none` hasta `.es-visible`).
- **Índice:**
  - Botón de texto `Índice` en el nav (`button[data-indice]`) que abre `dialog#indice` con `showModal()`. El foco queda atrapado de forma nativa; Esc cierra y el foco vuelve al botón.
  - Mientras está abierto, Lenis se detiene. Cada enlace **cierra el diálogo, llama a `lenis.start()` y después a `irA(hash, { foco: true })`**, que usa `force: true`.
  - 8 enlaces en lenguaje de cliente y sin números: `Transporte de motos · Cómo se ata · Precio · Quads y barcos · Parte con fotos · Seguro · Rutas · Contacto`.
- **Lectores de pantalla:**
  - `output.precio__cifra` con `aria-live="polite"`, 400 ms de debounce y solo el valor final (un `.sr`). La cifra visual es `aria-hidden`.
  - `aria-live` en «Copiado».
  - El canvas, `#capa-cinchas`, `.precio__amarre` y todas las capas decorativas llevan `aria-hidden`.
- **Email:** enlace `mailto:` normal, con un botón `Copiar` aparte. El clic en el email abre el correo.
- Foco visible: 2 px `--hueso` con 3 px de separación; dentro de la banda de papel, `--tinta`.

### 8.4 Textos alternativos

- **SVG** con `role="img"` y `aria-label`:
  - «Moto de perfil, dibujo técnico»
  - «Moto vista desde arriba, atada con cuatro cinchas en X»
  - «Quad visto desde arriba, atado en cruz con cuatro cinchas y un calzo en cada rueda»
  - «Barco en sección sobre su cuna, apoyado en quilla y pantoques, con la cota de manga»
  - «Rosa de rutas desde Madrid a 25 destinos»
- **Fotos del parte**, generadas en la web: `alt="Foto A de ejemplo: moto sobre la plataforma, vista delantera tres cuartos izquierda, con la hora de carga"` (y así B–D).
- **Fotogramas de movimiento reducido:** `alt` con la descripción del paso («La moto con la rueda delantera en el calzo», etc.).
- Iconos decorativos con `aria-hidden="true"`.

### 8.5 Honestidad del contenido (datos del código actual que se eliminan)

Todo lo siguiente sale porque no está en los datos de negocio:

- La «próxima salida {día}» (fórmula inventada).
- Las pruebas del héroe «<60 segundos» y «100 % del valor declarado».
- «Hasta 350 kg», «Hasta 700 kg», «Hasta 9 m de eslora» y «Harley de 400 kg».
- «MDPE» y «48 h».
- «Una moto clásica de 40.000 € pesa 200 kg».
- «matrícula» en el PDF.
- «Enlace de seguimiento activo» y las horas de hitos inventadas.
- «Lunes a sábado 7:00–21:00».
- «sale el precio cerrado el mismo día».
- «No hacen falta medidas ni fichas técnicas».

Los placeholders que se mantienen (tarifas, 600 000 000, hola@calzo.es, 60.000 €, nombre de marca) llevan una nota visible en texto pequeño `--ceniza`, sin corchetes: `Tarifa provisional`, `Cifra provisional` o «Nombre provisional» en el pie. **Toda afirmación técnica (pausas del amarre, cargas, seguro) la valida el transportista antes de publicar.**

---

## 9. Plan de verificación

Las capturas del navegador integrado se cuelgan con rAF o WebGL continuos. **Toda verificación es por evaluación de JS y DOM.** Las capturas son puntuales y siempre después de `__calzo.pausar()`.

### 9.1 Pruebas automáticas en Node (`npm test`, Node 24 sin compilar)

- `scripts/test-precio.mjs`:
  - Los 12 casos de §6.4 y las 5 duraciones, comparando cadenas con U+00A0.
  - `formatoEuros(2355) === '2.355 €'` y `formatoEuros(205) === '205 €'`.
  - `tablaPrecios()` tiene 25 filas.
  - El texto de WhatsApp de moto · Valencia · ida es exactamente el de §6.5, y su URL contiene `205%C2%A0%E2%82%AC`.
  - Ninguna cadena generada contiene `≈`, `→` ni `▾`.
- `scripts/test-guion.mjs`:
  - `easeCalzo(0.5) ≈ 0.7631` y `easeCalzo(0.4025) ≈ 0.5` (±1e-3).
  - `amarre(0.20).clac === true` y `amarre(0.199).clac === false`.
  - `cincha(0.4).pasos === 0`, `cincha(0.45).pasos === 1`, `cincha(0.95).pasos === 6` y `cincha(1).T === 1`.
  - `amarre(0.06).plataformaY === 0.35`, `amarre(0).plataformaY === 0`, `amarre(0.119).calzoVisible === false` y `amarre(0.12).calzoVisible === true`.
  - `amarre(0.34).cinchas[0].pasos === amarre(0.34).cinchas[1].pasos`; `amarre(0.41).cinchas[0].T === 1`; `amarre(0.5, { compacto: true }).cinchas[2].T === 1`.
  - `amarre(0.10).foco === 'rueda_del'`, `amarre(0.23).foco === 'tija'`, `amarre(0.56).foco === 'horquilla'` y `amarre(0.45).foco === null`.
  - `amarre(0.899).camaraExacta === true` (g > 0,85) y `amarre(0.95).opacidadCanvas ≈ 0.526`.
  - `traspaso(0.8) === 1`, `traspaso(0) === 0` y `tension(0.5) ≈ 0.7`.
  - `esquinaDe([10,10],[50,50]) === 'ti'` y `esquinaDe([90,90],[50,50]) === 'bd'`.
  - **Continuidad del traspaso:** con un `Cincha2D` sintético, los 4 vértices de `trazoCincha(c, destino, 0).d` son exactamente los de su polígono, y `trazoCincha(c, destino, 1).d === trazoCincha(null, destino, 1).d`.
  - `mezclaPieza(t, 0.05).clave === pieza(0.05).clave` para t ∈ {0, 0.8, 1.6, 5}; `mezclaPieza(0.5, 0.06).barridoI === 0`.
  - `desatado(0).T === 1`, `desatado(1.4).reveal === 0` y `desatado(1.4).plataformaY === 0`.
  - Reversibilidad: `f(p)` no depende del historial (mismas salidas en recorridos de ida y vuelta).

### 9.2 Comprobaciones en el navegador (vía `javascript_exec` sobre `npm run preview`)

| # | Comprobación | Esperado |
|---|---|---|
| 1 | `__calzo.estado.fuente` a los 4 s | `'webgl'` (alto/medio) o `'svg'` con `MotoLinea` visible |
| 2 | Errores de consola | 0 errores; 0 avisos de three por API obsoleta |
| 3 | `__calzo.info()` en `?still=amarre:0.5` | `drawCalls ≤ 60`, `triangulos ≤ 180000`, `programas ≤ 24`, `px ≤ 2.3e6` |
| 4 | `__calzo.medir(5000)` durante `__calzo.recorrido(20)` en escritorio (1440 × 900 y 2560 × 1440) | Mediana ≤ 16,7 ms, p95 ≤ 25 ms, ninguna tarea larga > 50 ms tras `listo` |
| 5 | `?still=amarre:0.35` | `estado.activo === 'amarre'`; `info().amarre.T[0] === info().amarre.T[1]`, y ambos coinciden con `guion.amarre(0.35).cinchas[0].T`; la fase `tija` tiene `.es-visible` |
| 6 | `?still=amarre:0.92` (**coincidencia del traspaso**) | 4 `path` visibles en `#capa-cinchas`, con vértices iguales a `escena().cinchasCenitales(innerWidth, innerHeight)` (±0,01 px). `await __calzo.pixel(cx, cy)` en el centroide de cada polígono = (210, 86, 31) ± 2. En los puntos a 2 px por fuera de cada borde largo, el píxel **no** es naranja (distancia RGB > 60). Es decir, el borde 3D y el SVG coinciden a ≤ 2 px |
| 7 | `?still=precio:e0.4` y después `?still=precio:e1` | Con e 0,4: overlay visible, `svg.precio__amarre` oculto y comba > 0. Con e 1: overlay oculto, cinchas en flujo visibles, `.precio__panel` con `translateY ≈ 3,5px` tras 500 ms. Sus extremos coinciden con `trazoCincha(null, destino, 1)` más el asiento |
| 8 | Calculadora: `calc.fijar({ carga:'barco', destino:'denia', eslora:8, manga:true })` | La cifra del panel dice «805 €» (con U+00A0); el testigo está visible; `a[data-wa].href` contiene `manga%20de%20m%C3%A1s%20de%202%2C55%20m` |
| 9 | `?carga=quad&destino=barcelona` | Precio inicial de 380 € en el héroe, el panel y el chip |
| 10 | Clic en un enlace del índice (con el `dialog` abierto) | El diálogo se cierra; `estado.activo` es el del destino en ≤ 2,5 s y `document.activeElement` está dentro de esa sección |
| 11 | Sin desbordamiento a 375 px | `document.documentElement.scrollWidth <= innerWidth` |
| 12 | `?tier=sin-webgl` | No hay `<canvas>` en `#capa-escena`; `.moto-linea` visible; con `ir('amarre', 0.92)`, `estado.cinchas2D` tiene 4 elementos y el overlay se dibuja |
| 13 | `?rm=1` | Sin instancia de Lenis; la altura de `#amarre .cap__pista` = altura de su contenido (no 360svh); 4 `img[data-preset]` con `src` en ≤ 6 s (tier alto) o SVG estáticos |
| 14 | Sin JS: `fetch('/')` y parseo | Un solo `h1`; 7 `h2`; `details#tarifas` con 25 filas **fuera de `noscript`**; `wa.me/34600000000`; `meta[name=robots][content*=noindex]`; ningún `<script>` salvo el inline del head y el de `app.ts` |
| 15 | Fuentes | Ninguna petición a `fonts.googleapis.com`; `document.fonts.check('420 1rem "Big Shoulders Display Variable"')`; `link[rel=preload][as=font]` = 1; `newsreader-cierre.woff2` ≤ 3 KB |
| 16 | Web Vitals (PerformanceObserver: `largest-contentful-paint`, `layout-shift`, `event`) en escritorio y en un Android real | LCP ≤ 2,0 s (2,5 en Android) con el H1 como elemento LCP; CLS ≤ 0,02; INP ≤ 150 ms en la interacción con el select |
| 17 | `npm run build && npm run presupuesto` | Dentro de §7.6; el chunk de entrada no contiene three |
| 18 | Parte: tras `escena:lista` + 6 s en reposo | `estado.capturas['parte.A'…'parte.D']` con 4 URL; 4 `<img>` en la hoja con `alt` no vacío; `blob.type === 'image/jpeg'` |
| 19 | Pausa | Tras `__calzo.pausar()`, dos lecturas separadas 500 ms no incrementan `estado.qa.frames` |
| 20 | Foco: `await __calzo.tab()` | Lista vacía: todo elemento enfocado tiene opacidad calculada > 0,9 y está dentro del viewport |
| 21 | Escenarios | Ningún descendiente de `.cap__escenario` con `scrollHeight > clientHeight + 1` a 1440 × 900, 1024 × 768 y 390 × 844 |
| 22 | Contexto perdido: `renderer.getContext().getExtension('WEBGL_lose_context').loseContext()` dentro del amarre | `estado.fuente === 'svg'` en el frame siguiente, sin errores. Tras `restoreContext()`, `fuente` vuelve a `'webgl'` solo cuando `activo` es un capítulo no 3D |
| 23 | Longitud a 1440 × 900 | `(document.documentElement.scrollHeight − innerHeight) / innerHeight ≤ 12,0` |
| 24 | Compacto 390 × 844 | En `?still=amarre:0.90`, las 4 anillas y los 4 extremos de `cinchas2D` caen dentro del viewport. En `?still=pieza:0.5`, la caja proyectada del rig cabe en el 90 % del ancho. `info()` no reporta fov > 30 |
| 25 | Ráfaga: `__calzo.ir('contacto', 0.5)` desde arriba | El panel queda asentado sin animación; el desatado aparece en su estado final; 0 tareas largas |
| 26 | bfcache | `qa.ts` envuelve `addEventListener` y no registra ningún `unload`. Volver atrás desde `wa.me` restaura la posición |
| 27 | Arranque | Los 5 eventos pegajosos llegan a un `on()` registrado después de `listo`; la clase `app-viva` está en `<html>` |

### 9.3 Hito visual (con pausa)

Los cuatro fotogramas anti-juguete de §4.10, más `?still=pieza:0.6`, `amarre:0.10`, `amarre:0.35`, `amarre:0.62`, `amarre:0.92`, `precio:e0.4`, `precio:e1` y `contacto:0.8`, en escritorio y a 390 × 844.

El protocolo de cada captura es `pausar()` → captura → `reanudar()`. Las revisan el director creativo y el lead con una pregunta: **¿se ve algún adorno que no esté en §1.4?** Si la respuesta es sí, se quita.

### 9.4 Checklist anti-genérico (web-awwwards) aplicada

| Punto | Cómo se comprueba | Estado exigido |
|---|---|---|
| ¿Fondo #000 o #fff puro? | Script: ningún `getComputedStyle` de color o fondo igual a `rgb(0, 0, 0)` o `rgb(255, 255, 255)` | Todo con temperatura (§3.1) |
| ¿Paleta de la casa? | Revisión: neutros fríos frente a los cálidos de VYO | Separada (§3.1) |
| Titulares con line-height 1,2+ | Script sobre `h1 span, h2`: `lineHeight/fontSize ≤ 1.05` | 0,9–0,95 |
| Tracking 0 en titulares | Script: `letterSpacing < 0` en h1 y h2 | −0,015 a −0,02em |
| ¿Titulares en dos voces tipo plantilla? | Revisión: el H1 en una sola familia | Una voz; itálica solo en el cierre |
| ¿Rejilla de 3 tarjetas centradas? | Revisión: el panel atado, las láminas asimétricas sobre papel, la hoja del parte y la rosa radial | No hay ninguna rejilla de tarjetas |
| ¿Todo entra con el mismo fade-up? | Inventario de §1.4 | Nada entra con fade-up; los titulares ya están |
| ¿Demo de efectos? | Inventario de §1.4 frente a lo construido (§9.3) | Ningún efecto fuera de la lista |
| ¿Radios de 8 px? | Script: `borderRadius` ∈ {0, 2px, 4px, 50%} | Sí |
| ¿Sombras difusas o vidrio? | Script: `boxShadow === 'none'` y `backdropFilter === 'none'` en todos los elementos | Sí |
| Espaciado entre secciones < 100 px | Script sobre las secciones no fijas a 1440 px: `paddingBlock ≥ 140px` | Sí |
| ¿Hay un momento memorable? | El amarre con traspaso físico al panel | Sí |
| Movimiento reducido y móvil sin pins rotos | §9.2 #11, #13, #21 y #24 | Sí |
| Fuentes woff2 autoalojadas con swap y preload de la display | §9.2 #15 | Sí |
| Ticker único y un solo CustomEase | Revisión de `motion.ts`: `lagSmoothing(0)`, un único `CustomEase.create('calzo', …)`, ningún otro rAF | Sí |
| Tipografía fluida con clamp() y tokens en :root | `tokens.css` | Sí |
| Tres familias como máximo; ninguna prohibida | `document.fonts` con 3 familias (+ la instancia del cierre) | Sí |

---

## 10. Plan de implementación en paralelo

### 10.1 Paquetes de trabajo

**WP0 — Lead e integración** (bloqueante, primero, ~1 día)

- **Archivos:**
  - `package.json`, `tsconfig.json`, `Layout.astro`, `index.astro`.
    - `index.astro` monta los 8 capítulos como **stubs**: `section` con id, `data-cap`, pista con `--fija-d`/`--fija-m`, escenario, fases y el H2 y el texto definitivos de §2.
  - `tokens.css`, `global.css`, `respaldos.css` (generado).
  - `data/tarifas.js`, `data/contacto.js`.
  - `lib/{precio.js, estado.ts, motion.ts, capitulos.ts, calc.ts, revelar.ts, qa.ts, app.ts}`.
  - `guion/{util, pieza, amarre, traspaso, cierre}.ts`.
  - `three/{contrato-tipos.ts, maqueta.ts, gpu-textura.ts}`.
  - `svg/{Flecha, Chevron}.astro`.
  - `scripts/{test-precio, test-guion, fuente-cierre, respaldo-fuentes}.mjs` y `public/fuentes/newsreader-cierre.woff2`.
- **Entrega:**
  - `npm test` en verde (§9.1 completo, incluidas las pruebas de `traspaso.ts`).
  - `npm run build` y `npm run check` sin errores.
  - Los stubs se recorren con scroll y `__calzo.estado.cap` y `activo` se actualizan; la salvaguarda del head funciona (§9.2 #27).
  - Fuentes autoalojadas, respaldos medidos e itálica del cierre ≤ 3 KB.
- **Después:** integra las ramas, arbitra los contratos y ejecuta §9.

**WP1 — Moto procedural** (depende solo de `contrato-tipos.ts` y `gpu-textura.ts`)

- **Archivos:** `three/moto/**` y `three/entorno.ts`. Página temporal de taller `src/pages/taller.astro` (noindex; **se borra antes de integrar**: no puede llegar a `dist`), con los planos de §4.9 y `?plano=`.
- **Entrega:**
  - `crearMoto` cumple `MotoRig`: grupos, anclas en las coordenadas de §4.3, `prepararPieza` y `aPieza`, `setHorquilla`, `setFoco` y `setApoyo`.
  - Huella en y_local 0,006; tapas en todos los tubos; largueros como `CurvePath`.
  - Materiales, inyección y claves de programa de §4.5 y §4.6.
  - Texturas en GPU y PMREM de estudio.
  - Presupuesto de triángulos por tier y construcción troceada (< 50 ms por tarea).
  - **Hito anti-juguete de §4.10 aprobado.**
  - `cargarGLB` implementado contra el mismo contrato, probado con un GLB de cajas generado en código.

**WP2 — Escena, director, amarre 3D y carga** (depende de WP0; usa la maqueta hasta que llegue WP1)

- **Archivos:** `lib/escena-loader.ts`, `three/{escena, director, planos, presets, suelo, captura}.ts`, `three/amarre/{plataforma, calzo, cinchas, carraca}.ts` y `scripts/presupuesto.mjs`.
- **Entrega:**
  - Carga con progreso ponderado, límite, benchmark por tiempo de GPU, `fuente` (único escritor), fronteras seguras y pérdida o restauración de contexto.
  - Render bajo demanda, presupuesto de píxeles y calidad adaptativa sin recompilar.
  - Visibilidad del canvas con render del destino antes de mostrarlo.
  - Encuadre por `setViewOffset` y encaje compacto; planos, cortes, muelle y cuaterniones; travelling de traseras; cámara exacta en la grúa.
  - Plataforma con junta, calzo, cinchas analíticas (reveal, 6 pasos, color, `uSinLuz` exacto, `uVisible`) y carracas.
  - `cinchasCenitales`, `capturar` con presets y restauración, `info()` y `pixel()`.
  - Verificación §9.2 #3, #4, #6, #17, #18, #19, #22 y #24.

**WP3 — Capítulos 3D en el DOM y ruta SVG** (depende de WP0; trabaja con la maqueta de WP2 o con la ruta SVG)

- **Archivos:** `CapPieza`, `CapAmarre`, `CapCierre`, `svg/{MotoLinea, MotoPlanta}` y `capitulos/{pieza, amarre, cierre, moto-svg}.ts`. Borrar `Hero.astro`.
- **Entrega:**
  - Línea de carga (`progresoCarga`) y suelo; frase-precio con select; `html.chip-visible`.
  - Fases del amarre con `.es-visible`; `data-fase-p` donde haya enfocables.
  - **Overlay `#capa-cinchas` con `trazoCincha`**, visible según §5.6.
  - Escenario del cierre con la frase por máscara y el `<slot name="cta"/>` detrás de la pista.
  - Ruta SVG completa de pieza, amarre y cierre, que publica `cinchas2D`.
  - Fotogramas quietos en reducido; versiones compactas.
  - Verificación §9.2 #5, #12, #13, #20 y #21.

**WP4 — Producto y conversión** (depende de WP0)

- **Archivos:** `Nav`, `BarraMovil`, `CapPrecio`, `ContactoCta`, `Pie`, `svg/Pictos` y `capitulos/{nav, barra, precio, contacto-cta}.ts`. Borrar `Contacto.astro`.
- **Entrega:**
  - §6 completo: panel sólido, mandos, lectura con fundido cruzado y `.sr`, desglose, testigo, mini-lámina, CTA y legal.
  - `details#tarifas` siempre en el HTML y el comportamiento sin JS.
  - `destinoCinchas`, **cinchas en flujo y asiento del panel**.
  - Chip e índice (`dialog`, `force`); barra móvil con la regla del naranja y oculta sobre el precio.
  - CTA final con subrayado-cincha; `mailto:` + `Copiar`.
  - Verificación §9.2 #7, #8, #9, #10 y #14.

**WP5 — Capítulos editoriales** (depende de WP0)

- **Archivos:** `CapCargas`, `CapParte`, `CapSeguro`, `CapRutas`, `svg/{QuadPlanta, BarcoSeccion}`, `capitulos/{parte, rutas}.ts`, `data/geo.js` y `lib/rosa.js`. Borrar `Cargas.astro`, `Parte.astro`, `Rutas.astro` y `Seguro.astro`.
- **Entrega:**
  - Banda de papel (cargas + parte) con el foco en `--tinta`.
  - Láminas estáticas con su entrada única por máscara.
  - Hoja del parte con las 4 capturas (pedidas a WP2) y recortes vectoriales sin WebGL; firma estática.
  - Seguro tipográfico.
  - Rosa generada en el build (rumbos, longitudes, etiquetas relajadas con líneas guía, Palma con ferry), con su entrada por trazo, interacción con zona de clic de 20 px y versión compacta no interactiva.
  - Verificación §9.2 #18.

### 10.2 Dependencias

```
WP0 (contratos, stubs, guion, calc, motion, maqueta, gpu-textura)
 ├─► WP1 (moto) ───────────────┐
 ├─► WP2 (escena + maqueta) ◄──┘  (sustituye la maqueta por crearMoto en I-2)
 ├─► WP3 (pieza, amarre, cierre, ruta SVG) ── consume estado.fuente, estado.cinchas2D, estado.destinoCinchas
 ├─► WP4 (precio, nav, barra, CTA) ────────── produce estado.destinoCinchas; consume guion/traspaso
 └─► WP5 (cargas, parte, seguro, rutas) ───── consume EscenaAPI.capturar
```

Contratos que cruzan WP (todos fijados en §5):

| Contrato | Produce | Consume | Dónde |
|---|---|---|---|
| `estado.cinchas2D` | WP2 (fuente webgl) · WP3 `moto-svg.ts` (fuente svg) | WP3 overlay | §5.4, §5.6 |
| `estado.destinoCinchas` | WP4 `precio.ts` (orden 12) | WP3 overlay (orden 40) | §5.6 |
| `guion/traspaso.ts` (`traspaso`, `tension`, `esquinaDe`, `destinos`, `trazoCincha`, `carraca`) | WP0 | WP3 y WP4: los mismos píxeles a h = 1 | §5.7 |
| `estado.fuente` + evento `fuente` | WP2 `escena-loader.ts` | WP3 `moto-svg.ts` y todos | §5.6 |
| `EscenaAPI.capturar` + `PresetId` | WP2 | WP5 (`parte.*`), WP3 (`quieto.*`) | §5.4 |
| `progresoCarga(f, paso)` | WP3 `pieza.ts` | WP0 `app.ts` → WP2 `cargarEscena` | §5.3, §5.4 |
| `html.chip-visible` | WP3 `pieza.ts` | WP4 `nav.ts` | §2.1 |
| `<slot name="cta"/>` de `CapCierre` | WP3 | WP4 `ContactoCta` (montado en `index.astro` por WP0) | §5.2 |
| `scrollDe('amarre', 0.90)` (naranja de la barra) | WP0 | WP4 `barra.ts` | §7.2 |
| `#tejido` (`<defs>` en Layout) | WP0 | WP3 y WP4 | §3.9, §5.2 |

### 10.3 Orden de integración

1. **I-0:** WP0 fusionado; todos ramifican de ahí.
2. **I-1: el WOW de punta a punta con cajas.** WP2 con la maqueta + WP3 (pieza, amarre, overlay y ruta SVG del amarre) + WP4 (precio con cinchas en flujo y asiento). Se verifican los rangos, los clics, la X, **la coincidencia por píxel (§9.2 #6)**, el viaje y el asiento (#7), y lo mismo con `?tier=sin-webgl`. **Si esto no funciona, no se integra nada más.**
3. **I-2: moto real.** Se cambia `crearMotoMaqueta` por `crearMoto` (una línea) tras el hito de §4.10. Nueva pasada de planos y encuadres (±10 %).
4. **I-3:** WP5 (cargas, parte, seguro, rutas) + WP4 (nav, barra, CTA) + WP3 (cierre).
5. **I-4:** compacto, reducido, sin WebGL y sin JS; borrado de los componentes viejos y de la página de taller.
6. **I-5:** verificación completa de §9 y presupuesto. **No se despliega nada sin el okey explícito del usuario.**

### 10.4 NO SE CONSTRUYE (fuera por defecto)

Esta tabla invierte la antigua lista de «recortes si aprieta»: nada de esto está en el alcance. Volver a meter cualquiera de estos elementos requiere una decisión explícita de dirección, justificada contra §1.4.

| Elemento | Estaba en (v1) | Motivo |
|---|---|---|
| Preloader superpuesto con contador 000→100 y etiqueta | §2.1 | El preloader de plantilla número uno. La carga vive en la línea de suelo |
| Luz que sigue al cursor y giro de la moto con el ratón | §2.2 | Tropo de «spotlight» de tarjeta SaaS |
| Polvo en el haz (600 motas) | §2.2, §4.8 | Partículas de relleno |
| Brillo del barrido sobre el H1 (`--sx`, `background-clip: text`) | §2.2, §5.6 | «Shiny text». Además, rompía el texto con SplitText |
| Flip de la cifra del héroe al chip | §2.2 | Un efecto más antes del WOW. El chip entra con un fundido |
| «Baja despacio» con línea en bucle | §2.2 | Tic |
| Capítulo «Dónde se ata» con pista horizontal de 400vw | §2.3 | Duplicaba el amarre y es la sección más reconocible de plantilla |
| Numerales 01–04 en contorno a 40vw | §2.3 | Tropo |
| «Detalle» circular (iris) e `#instantanea` | §2.3 | La transición más gastada del género |
| Vista de líneas (EdgesGeometry) al hacer hover | §2.3, §4.8 | Estética HUD y tareas largas |
| Parpadeos `#corte` | §2.3, §2.4 | Ruido |
| Sacudidas de canvas («clac» de 1,5 px, clics de 0,6 px) | §2.4 | Screen shake de videojuego |
| Barra `TENSIÓN` de 6 segmentos | §2.4 | Gamificación: la tensión ya se lee en la cinta |
| Medidor de horquilla con aguja | §2.4 | HUD. Lo sustituye la frase |
| Cincha pulsable | §2.4 | Juguete |
| Prueba de frenada y curva, con fantasma | §2.4 | Longitud; los cantos atravesaban el suelo; estética HUD |
| «Todo se mueve. / Ella, no.» | §2.4 | Muletilla; feminiza la moto |
| «Se sube atado.» en la grúa e «Y el precio, a la vista.» | §2.4 | Lema repetido y muletilla |
| Pestañas de 24 × 3 px en las esquinas del panel | §2.5, §6.2 | «Corner accents» de HUD |
| Vidrio (`backdrop-filter`), `--filo` y `--halo-cincha` | §3.6, §3.7 | Kit «dark SaaS» y coste de GPU en cada frame de scroll |
| Odómetro del precio, regla con contador, pulso de `font-stretch`, rebote del segmentado, letras M·Q·B·C y halo del testigo | §6.2 | Cuadro de mandos esqueuomórfico: cinco contadores en una web |
| DrawSVG de las láminas, morph de las cinchas, cota de manga con scrub y parallax de las láminas | §2.6 | Ligado al scroll, demo de efectos |
| Obturador, visor con esquinas en L, flashes en pantalla y Flip de las fotos | §2.7 | Iris y HUD |
| Firma trazada y sello `PDF · EJEMPLO` animados | §2.7 | Tic |
| Ecuación que se reescribe, tachado y odómetro del seguro | §2.8 | Pseudoecuación y otro contador |
| Rosa que gira, rayos ligados al scroll y trazos de vuelta | §2.9 | Sin motivo; ligado al scroll |
| Agujero de Madrid (máscara radial hacia el cierre) | §2.9 | Segundo iris; rutas ya no tiene fijo |
| Tira de 8 miniaturas y capturas de entrega | §2.10 | Contención. La fila `ENTREGA` del parte queda vacía, que es lo honesto |
| Teléfono gigante como CTA | §2.10 | Tropo |
| Onda de peso letra a letra en el logo | §3.2 | Tic |
| Kickers numerados 01–09 e índice numerado | §2, §8.3 | Ritmo de plantilla |
| Máscara por líneas en todos los titulares (SplitText) | §3.8 | Plantilla. El H1 está pintado desde el primer fotograma (LCP) |
| HUD completo: cajetín, escala viva, timecode con barajado, barra de progreso-cincha y «Saltar al precio» | §1.5, §5 | La interfaz de Iron Man. El chip, la barra móvil y el skip-link ya llevan al precio |
| Grano animado sobre el DOM | §3.5 | Tropo de 2020–2023 y 8 repintados de pantalla completa por segundo |
| `RectAreaLight` + `RectAreaLightUniformsLib` | §4.7 | +105 KB gz (tablas LTC) y recompilación al degradar |
| Corchetes `[tarifa provisional]`, `[cifra provisional]` y `[Valencia ▾]` | §2 | Tic, y `▾` no existe en las fuentes |
| ScrollTrigger, SplitText, Flip y DrawSVGPlugin | §5 | Sin uso tras los recortes (−17 KB gz solo ScrollTrigger) |
| Fotografía de stock, EffectComposer, bloom y sonido | — | Regla 1 y descartes previos |

**Recortes si el calendario aprieta** (dentro de lo que queda; ninguno toca los tres momentos), en orden:

1. La mini-lámina de la carga dentro del panel.
2. La interacción de aislamiento de la rosa (queda la tabla).
3. El travelling de traseras, que pasa a plano fijo.
4. La ruta SVG del amarre sin alzado: directamente `MotoPlanta` con la X que se tensa.
5. Parte en vivo → 4 JPEG generados una vez con `?still` y versionados (< 60 KB cada uno, `loading="lazy"`, fuera del presupuesto de primera visita).

Si las pruebas con usuarios muestran abandono antes del precio, el fijo del amarre baja a 220 (pausas de 0,04 de p).

### 10.5 Riesgos abiertos y su dueño

| Riesgo | Mitigación | Dueño |
|---|---|---|
| La moto procedural parece un juguete | §4.10 (con la huella y las tapas), planos prohibidos, clave baja, pausas en primeros planos aislados con luz, plan B con GLB (con el okey del usuario) | WP1 + dirección |
| El traspaso no casa o no se percibe | Color exacto sin composer ni transform, cámara exacta, contrato de bordes en A y B, `bVisible` por raycast y prueba #6 por píxel. Para que se perciba: comba, carraca y asiento del panel, revisados en §9.3 | WP2 + WP3 + WP4 |
| iOS Safari: barra de URL con sticky | `svh` en las pistas, sonda `hs`, canvas de 100lvh sin `setSize` por la barra, scroll táctil nativo, fijos cortos en compacto | WP0 + WP2 |
| Conversión frente a longitud | Precio en el héroe, chip, barra móvil y skip-link; precio al 37 % de un recorrido de ~1200 vh | WP4 |
| Paleta leída como la de VYO | Resuelto en esta versión: neutros fríos, naranja como único color cálido y ninguna tipografía compartida | Dirección |
| Copy técnico sin validar | Todo el texto de las pausas, las cargas y el seguro pasa por el transportista antes de publicar; `noindex` hasta entonces | WP0 + usuario |
| Placeholders tomados por oferta real | Notas «provisional», `noindex`, centralizados en `tarifas.js` y `contacto.js` | WP0 |
| LCP y CLS | H1 en el HTML sin nada encima, preload de Big Shoulders, respaldos medidos por fuente local, prueba en un Android real | WP0 + WP3 |
| Chunk 3D al límite (three ya ocupa 146 de 200 KB) | App 3D ≤ 54 KB vigilada por `presupuesto.mjs`. Si se pasa, se recorta antes que subir el límite: primero, un `RoundedBoxGeometry` propio; después, detalles de la moto | WP2 |

---

## 11. Decisiones del red team

La v1 se revisó con dos lentes: «genérico / IA / exceso» (20 críticas: 8 altas, 10 medias, 2 bajas) y «rotura técnica» (43 críticas: 9 altas, 23 medias, 11 bajas). **Se aplican todas las altas y todas las medias**, salvo dos medias que dejan de aplicar porque el elemento criticado desaparece (T27 y T28). También se aplican todas las bajas, porque ninguna tenía coste, salvo T36, que tampoco aplica. Las tres van marcadas «No aplica» con su motivo.

### 11.1 Qué cambia de fondo

- **Contención real.** De ~25 efectos se pasa a tres momentos con un inventario cerrado (§1.4). Todo lo demás está en «NO SE CONSTRUYE» (§10.4).
- **El WOW se ve.** El traspaso ya no es una coincidencia invisible que termina en pestañas: las cinchas atan el panel y el panel se asienta bajo su tensión.
- **Identidad propia.** Paleta de grafito frío con el naranja como único color cálido, una sola voz display y el plano técnico confinado a la banda de papel.
- **Mitad de recorrido.** De 1980 a ~1200 vh: «Dónde se ata» se fusiona en el amarre y rutas y cargas dejan de estar fijas.
- **Robustez.** No hay preloader que pueda quedarse colgado, `fuente` tiene un único escritor, el traspaso se verifica por píxel, no se recompila en caliente, hay presupuestos medidos y un arranque con una sola entrada.

### 11.2 Lente «genérico / IA / exceso»

| # | Sev. | Crítica | Decisión | Dónde |
|---|---|---|---|---|
| G1 | alta | La spec es una demo de efectos (~25 trucos antes y alrededor del WOW) | **Aplicada.** Lista cerrada de 3 momentos. «NO SE CONSTRUYE» fuera por defecto. Resto de capítulos: ≤ 1 entrada por capítulo y nada ligado al scroll | §1.4, §10.4 |
| G2 | alta | El clímax acaba en pestañas-cliché y el traspaso está diseñado para no notarse | **Aplicada con ajuste** (§11.4). Las cinchas conservan anchura, color, tejido y carraca, y atan el panel de anilla a esquina. Comba al viajar y asiento de 3,5 px con la física del calzo. Sin pestañas | §2.2, §2.3, §5.6 |
| G3 | alta | La suma de superposiciones compone un HUD de ciencia ficción | **Aplicada.** Fuera el cajetín, la escala, el timecode, la barra-cincha, el círculo, la vista de líneas, el fantasma, el medidor, la barra de tensión y el visor en L. El índice es un botón de texto. Las pausas aíslan la pieza solo con luz. Las líneas técnicas quedan en la banda de papel y en la ruta sin WebGL | §1.1, §2.2, §8.3 |
| G4 | alta | Paleta casi idéntica a la de VYO; neutros sepia | **Aplicada y decidida ya**, no «si el usuario lo percibe». Grafito frío (#0B0D0E…#E4E6E3), contras plata, clave neutra: el naranja es lo único cálido. Sin *teal & orange* | §3.1, §4.7 |
| G5 | alta | Sistema tipográfico calcado de longbow; H1 en dos voces; condensada ultrafina | **Aplicada.** Una sola voz display (Big Shoulders 420 en caja mixta, H2 400). La itálica aparece una vez (el cierre), instanciada a opsz 72. La mono pasa a Overpass Mono, solo para cifras y el parte. Big Shoulders queda justificada como rótulo de chapa | §3.2 |
| G6 | alta | Muletillas de texto generado, frases duplicadas y lema repetido | **Aplicada.** Copy reescrito, informativo y con ritmo variado. El lema solo va en el H1 y en el cierre. Fuera «Ella, no.», la ecuación y los duplicados. Cada frase técnica aparece una vez | §2, §8.1 |
| G7 | alta | «Dónde se ata» duplica el amarre y es el tropo de la pista horizontal | **Aplicada.** Fusionado como pausas dentro del amarre (−340 vh, −1 iris, −3 parpadeos). Sin numerales. La sensación horizontal la da el travelling de la cámara en las traseras | §2.2, §4.9 |
| G8 | alta | Los capítulos sin 3D usan el kit «dark SaaS» | **Aplicada.** Sin `--filo`, `backdrop-filter` ni halo; panel sólido; mono solo para cifras; banda de papel (cargas + parte) como lámina impresa. Las macros fotográficas se descartan (§11.4) | §3.6, §2.4, §2.5 |
| G9 | media | Gamificación del amarre y sacudidas de pantalla | **Aplicada.** Sin sacudidas. El «clac» es un asiento físico de 3 mm. Sin barra de tensión ni cincha pulsable. Se retira el `scale(1.004)` del canvas | §2.2, §5.2 |
| G10 | media | Iris y obturadores repetidos | **Aplicada.** Una sola transición de firma (el traspaso). Fuera el detalle circular, el obturador, los flashes y los parpadeos, y también el agujero de Madrid (§11.4) | §1.4 |
| G11 | media | Preloader con contador | **Aplicada y ampliada.** No hay preloader: la línea de suelo es la barra de carga, invisible si carga en < 350 ms | §2.1 |
| G12 | media | Desvelado sobrecargado | **Aplicada.** Un barrido por tiempo y un giro de entorno por scroll. Fuera la linterna, el polvo, el brillo en el H1 y el Flip | §2.1 |
| G13 | media | Itálica de texto (opsz 16) ampliada a tamaño display | **Aplicada.** Itálica instanciada a opsz 72 · wght 300, solo con los glifos de «Se baja igual.» (1,9 KB medidos). La redonda, solo hasta 26 px | §3.2 |
| G14 | media | Numeración y máscara por líneas en todas partes | **Aplicada.** Sin kickers ni índice numerado; los titulares ya están visibles. La numeración solo aparece como dato | §3.2, §8.1 |
| G15 | media | La regla del naranja se rompe (barra móvil, HUD, CTA monumental) | **Aplicada.** Barra móvil en contorno hasta amarre p 0,90; sin HUD; CTA final en hueso con subrayado-cincha de 3 px; sin teléfono gigante; el naranja nunca como fondo mayor que un botón | §1.1, §7.2, §2.8 |
| G16 | media | El precio lleva cinco microanimaciones | **Aplicada.** La única cifra animada de la web es la del precio (fundido cruzado de 180 ms). Regla, testigo y segmentado estáticos; seguro con cifra fija | §6.2, §6.3 |
| G17 | media | La dirección nueva es la v1 en negativo | **Aplicada.** Se rompen los tres ejes: neutros fríos, plano técnico solo en las láminas y mono solo para cifras. El acento se conserva (§11.4) | §3 |
| G18 | media | Recorrido excesivo (1980 vh, precio al 44 %) | **Aplicada.** ~1200 vh; precio al 37 %; rutas y cargas sin fijo; cierre con fijo de 50 | §2.0 |
| G19 | baja | Grano animado sobre el DOM | **Aplicada.** Sin grano; `dithering` en el suelo del shader | §3.5 |
| G20 | baja | Microgestos-tic (onda del logo, letras M·Q·B·C, firma y sello, rosa que gira, corchetes, ▾) | **Aplicada.** Todos fuera. «Provisional» como nota; chevron SVG; hoja ya firmada | §2, §6.2 |

### 11.3 Lente «rotura técnica»

| # | Sev. | Crítica | Decisión | Dónde |
|---|---|---|---|---|
| T1 | alta | El chunk 3D no cabe en 200 KB (RectAreaLight arrastra 105 KB) | **Aplicada.** Sin RectAreaLight: contras con DirectionalLight en todos los tiers. Three medido: 146 KB gz. §7.6 rehecho con cifras medidas | §4.7, §7.6 |
| T2 | alta | `--fija` inline gana a la media query | **Aplicada.** `--fija-d`/`--fija-m` inline solo como definiciones; la hoja decide | §5.2 |
| T3 | alta | Sticky y fases absolutas sin condición de JS; contenido recortado | **Aplicada.** Base en flujo; todo lo fijo bajo `html.js:not(.reducido)`; la tabla sale a `#tarifas`, en flujo; QA #21 | §5.2, §6.6 |
| T4 | alta | Fov vertical: en móvil la moto y la X no caben | **Aplicada.** Encaje por caja con dolly; cenital con el morro arriba en compacto; correspondencia por cuadrante (`esquinaDe`); fov ≤ 30 sin excepción | §4.9, §5.7 |
| T5 | alta | Orden de arranque en Astro sin definir; eventos perdidos; three en el bundle inicial | **Aplicada.** `app.ts` es la única entrada; `iniciar()` sin efectos; eventos pegajosos; `contrato-tipos.ts` sin three y la maqueta en el chunk 3D; comprobación en `presupuesto.mjs` | §5.3, §5.4, §7.6 |
| T6 | alta | El preloader puede dejar la página en negro | **Aplicada.** No hay capa que tape; límite con `race`; errores → SVG; salvaguarda del head a 4 s; sin bloqueo de scroll | §2.1, §5.5 |
| T7 | alta | El traspaso a < 1,5 px es imposible tal y como estaba | **Aplicada.** (a) Canvas sin transform; (b) cámara exacta a g > 0,85 y teletransporte en `ir()`/`irA`; (c) contrato con bordes en A y B (trapecio); (d) `bVisible` por raycast. Verificado por píxel (#6) | §4.4, §4.9, §5.4, §9.2 |
| T8 | alta | `background-clip: text` + SplitText borra el lema | **Aplicada por eliminación.** Ni barrido en el H1 ni SplitText | §2.1 |
| T9 | alta | La calidad adaptativa recompila en pleno amarre | **Aplicada.** En caliente solo se tocan los píxeles y se congela la sombra; luces y sombras se deciden en la carga | §7.7 |
| T10 | media | `mergeGeometries` fallará (índices y atributos); InstancedMesh sin `aPieza` | **Aplicada.** `prepararPieza` y `aPieza` normal en la geometría base de los InstancedMesh | §4.3 |
| T11 | media | Crear un contexto WebGL en el head retrasa el FCP | **Aplicada.** Solo heurística en el head; el renderer real se prueba en el loader | §5.5, §5.4 |
| T12 | media | Sin reglas para el cambio SVG → WebGL tardío ni para la pérdida de contexto | **Aplicada.** `estado.fuente` con un único escritor, fronteras seguras y fundido de 400 ms; QA #22 | §5.6 |
| T13 | media | `vh` de medición ≠ `svh`; `setSize` en cada cambio de la barra | **Aplicada.** Sonda `hs`; canvas de 100lvh; sin `setSize` por cambios de alto < 150 px | §5.3, §7.2 |
| T14 | media | `capturar`/`instantanea` sin estado propio, con sincronización GPU, sin foto garantizada, WebP en Safari | **Aplicada.** Render target fuera de pantalla, presets con restauración, `readRenderTargetPixelsAsync`, JPEG, precaptura en idle y cola. `instantanea` se elimina | §5.4 |
| T15 | media | Neumático flotando 6 mm; la prueba atraviesa el suelo | **Aplicada.** Cota de apoyo 0,006 con `setApoyo`; la prueba de frenada se elimina | §4.1, §4.2 |
| T16 | media | `up` + `lookAt` degenera en la grúa; regla de 6°/s contradictoria | **Aplicada.** Cuaterniones por plano y `slerp`; regla borrada | §4.9 |
| T17 | media | `activo` sin definir; fotograma viejo al volver; resize con el canvas congelado | **Aplicada.** Línea central del viewport; render del destino antes de mostrar; re-render en resize. Ya no hay canvas congelado detrás del precio | §5.4, §5.6 |
| T18 | media | Dos escritores (intro y scroll; tween y salida); `autoSplit` desconecta nodos | **Aplicada.** `mezclaPieza` con mezcla explícita; sin salida animada ni SplitText | §2.1, §5.7 |
| T19 | media | Fases invisibles enfocables y clicables | **Aplicada.** `data-fase-p` con un `focusin` único; `pointer-events` hasta `.es-visible`; CTA fuera de la pista; QA #20 | §5.2, §8.3 |
| T20 | media | El odómetro dentro de `aria-live` lee dígitos basura | **Aplicada por eliminación**, más un `.sr` con el valor. El timecode desaparece | §6.2 |
| T21 | media | `lenis.scrollTo` no hace nada con Lenis parado | **Aplicada.** `force: true`; el índice se cierra y llama a `lenis.start()` antes de `irA` | §5.4, §8.3 |
| T22 | media | Calculadora engañosa sin JS; tabla SEO en `noscript` | **Aplicada.** Sin JS se ocultan los mandos y la lectura; tabla siempre en el HTML dentro de `details` | §6.6 |
| T23 | media | Respaldo métrico único e incorrecto; itálica del H1 sin preload | **Aplicada.** Una `@font-face` por fuente local con overrides generados (capsize). El H1 ya no lleva itálica | §3.2 |
| T24 | media | `backdrop-filter` recalculado en cada frame de scroll | **Aplicada por eliminación** | §3.6 |
| T25 | media | Límite de DPR sin presupuesto de píxeles | **Aplicada.** 2,3 Mpx en alto y 1,2 en medio; el escalón adaptativo reduce el presupuesto | §7.6, §7.7 |
| T26 | media | Tareas largas: texturas en canvas 2D y EdgesGeometry | **Aplicada.** Texturas en GPU (`texturaGPU`). EdgesGeometry desaparece con la vista de líneas y el fantasma | §7.7 |
| T27 | media | Detalle circular sin continuidad | **No aplica.** El detalle circular se elimina (G10) | §10.4 |
| T28 | media | Los overlays anclados «nadan» un frame | **No aplica en la práctica.** No quedan overlays anclados al 3D. `#capa-cinchas` ya es fija y en coordenadas de viewport, que era la corrección propuesta | §5.2 |
| T29 | media | `revokeObjectURL` en `unload` rompe la bfcache | **Aplicada.** `pagehide`, sin `unload`, `wa.me` en pestaña nueva en escritorio y restauración de posición; QA #26 | §5.3, §7.7 |
| T30 | media | Movimiento reducido con 4 renders y un único canvas fijo | **Aplicada.** Un `<img>` por preset; ningún canvas detrás de contenido en flujo | §7.3 |
| T31 | media | Rayos de la rosa imposibles de apuntar; etiquetas que chocan | **Aplicada.** Trazo transparente de 20 px, relajación radial con líneas guía y, en compacto, rosa no interactiva con la tabla como interfaz | §2.7, §5.5 |
| T32 | media | El `discard` de la cincha no llega a la sombra | **Aplicada.** `castShadow = false` en las cinchas | §4.4 |
| T33 | baja | Tope irreal de 12 programas; clave común peligrosa | **Aplicada.** ≤ 24 medido; clave `'calzo-' + inyección` | §4.5 |
| T34 | baja | Grano con `background-position`: repintados | **Aplicada por eliminación** | §3.5 |
| T35 | baja | JS inicial muy justo | **Aplicada.** Sin ScrollTrigger, SplitText, Flip ni DrawSVG: 35,2 KB medidos de librerías; `qa.ts` dinámico; límite de 80 KB | §7.6 |
| T36 | baja | La pista horizontal no responde al gesto horizontal | **No aplica.** No hay pista horizontal | — |
| T37 | baja | Ráfaga de efectos con scroll rápido o `irA` | **Aplicada.** Con `saltando` o |vel| > 3000 px/s, los efectos por tiempo van al estado final | §2.0 |
| T38 | baja | Node 24 exige extensiones y sintaxis borrable | **Aplicada.** Importaciones con `.ts` y `erasableSyntaxOnly` | §5.1 |
| T39 | baja | `Intl` devuelve U+00A0 y no agrupa las 4 cifras | **Aplicada.** Formato propio con U+00A0 y punto de miles; caso de 2.355 € en las pruebas | §6.4, §9.1 |
| T40 | baja | Foco invisible sobre papel; el email copia en vez de abrir | **Aplicada.** Foco `--tinta` en papel; `mailto:` + botón `Copiar` | §3.7, §2.8 |
| T41 | baja | El benchmark confunde el tope de 30 fps con un equipo lento | **Aplicada.** Tiempo de GPU con timer query; el tope estable de 30 fps no baja de tier; nada con `document.hidden` | §7.1 |
| T42 | baja | Detalles que delatan CG (tubos huecos, largueros ondulados, sombra pixelada, «30 %» con alfa) | **Aplicada.** Tapas, `CurvePath` de rectas, `shadow.radius` 3 y ningún sólido semitransparente | §4.2, §4.7 |
| T43 | baja | Draco sin contar; `--e`/`--p` invalidan estilos cada frame | **Aplicada.** Draco en `public/draco`, contado aparte; `capitulos.ts` ya no escribe custom properties | §4.11, §5.3 |

### 11.4 Descartado o ajustado, y por qué

- **Macros fotográficas de Pexels (G8): descartadas.** Una foto de stock rompe la regla 1 («solo la moto tiene volumen»), no se puede igualar en luz ni en grano con el render y es justo el recurso que convierte una web de oficio en una plantilla. Lo que ancla la realidad física es la banda de papel, el tejido y la carraca de las cintas y las fotos del parte. Si el transportista aporta **fotos propias** (su cincha, su plataforma), se valorará una sola, en monocromo, en `#seguro`. Nunca de stock.
- **Grotesca con eje de anchura «floja → tensa» (alternativa de G5): descartada.** Sería otro truco tipográfico ligado al movimiento (el pulso de `font-stretch` se quitó por lo mismo) y una cuarta familia. Se elige documentar el porqué de Big Shoulders y usarla a peso medio y en caja mixta.
- **Conservar el agujero de Madrid (G10 lo admitía): descartado.** Lo excluye G1 (alta), y rutas ya no tiene fijo (G18). El cierre entra por el borde de la página, con el canvas ya renderizado.
- **«Las cinchas conservan su longitud» (G2): interpretado como «no se acortan en adorno».** Siguen siendo cintas completas, de anilla a esquina, con carraca y tejido. Su longitud en px cambia lo que exige la geometría del panel. Una longitud literal obligaría a poner las anillas fuera de pantalla en compacto.
- **Acento #D2561F (G17 pedía neutros fríos *o* un acento distinto): se conserva.** Es el color real de una cincha de amarre y es la idea de color de toda la web. Con los neutros fríos ya se rompe el eje heredado y el naranja se separa tanto de la v1 (#E4572E sobre papel) como de VYO (#ff4326 sobre negro cálido).
- **Hotspots como botones (G3): no quedan.** Las pausas aíslan la pieza con luz y el texto vive en la columna. Por eso desaparecen del contrato `focoHotspot`, `setLineas`, `lineasFantasma`, `pulsar`, `instantanea`, `proy`, `barridoPx`, `escala` y `puntero`.
- **ScrollTrigger: fuera también, aunque ninguna crítica lo pedía.** Con escenarios sticky y la medición propia de `capitulos.ts` ya no aporta nada, y quitarlo ahorra 17 KB gz del JS inicial.

### 11.5 Hallazgos propios de esta revisión

- **`≈` (U+2248) no está en el subconjunto latin de ninguna de las tres fuentes** (comprobado con fontTools). Las duraciones pasan a «unas 4 h 45 min». `→` y `▾` tampoco están: son SVG.
- **Big Shoulders no tiene `tnum`.** Ninguna cifra que cambie va en display.
- **Martian Mono se sustituye por Overpass Mono** (21,5 KB frente a 38,5; `tnum`; origen en la señalización vial).
- **El máximo posible del cálculo tiene 4 cifras** (barco de 12 m con manga, ida y vuelta, a Empuriabrava: 2.355 €). Se añade a las pruebas.
- El barrido de la intro va de −1,45 a +1,45 m para empezar y acabar fuera de la moto: al apagarse no deja un corte visible.
- **La plataforma se rediseña.** En la v1 subía de −0,35 a +0,006 a través de un suelo opaco: estaba oculta todo el recorrido, aparecía de golpe al cruzar y = 0 y solo subía 6 mm. Ahora es un bloque enrasado en el suelo, con su junta, sobre el que ya está la moto del héroe. Sube 35 cm en el amarre («se sube») y baja en el cierre («se baja igual»): el lema se escenifica. Los planos del amarre y del parte suman ese apoyo (+A, §4.9).
- El calzo entraba desde x +0,70, fuera de la plataforma (se habría quedado flotando con la plataforma arriba). Ahora entra desde +0,55, que es el borde delantero, y solo es visible en su tramo.
- Todas las cifras de §7.6 marcadas como «medido» salen de bundles reales hechos con esbuild sobre las versiones instaladas en el proyecto (three 0.186.1, gsap 3.15.0, lenis 1.3.26) y de los archivos de fontsource 5.3.0.
