// Calzo (§4.4): cuna de aluminio cepillado con taco de goma. El perfil
// lateral es una U: labio trasero corto, base bajo el neumático y tope
// delantero en arco concéntrico con la rueda hasta 0,25 m de alto.
// Coordenadas del grupo: x = 0 en el contacto delantero, y = 0 en la cara
// superior de la plataforma.
import * as THREE from 'three';
import type { MaterialesAmarre } from './plataforma.ts';

const R_RUEDA = 0.31;
const Y_EJE = R_RUEDA + 0.006;   // centro de la rueda sobre el apoyo
const HOLGURA = 0.012;           // entre neumático y cara interior del tope
const GROSOR = 0.014;
const ALTO_TOPE = 0.25;
const ANCHO = 0.16;

function arco(r: number, y: number): number {
  // Ángulo (desde la vertical inferior) al que el arco de radio r alcanza la altura y.
  return Math.acos((Y_EJE - y) / r);
}

export function crearCalzo(m: MaterialesAmarre): { grupo: THREE.Group; dispose(): void } {
  const grupo = new THREE.Group();
  grupo.name = 'calzo';

  const ri = R_RUEDA + HOLGURA, re = ri + GROSOR;
  const s = new THREE.Shape();
  s.moveTo(-0.15, 0);
  s.lineTo(-0.15, 0.04);          // labio trasero de 4 cm
  s.lineTo(-0.13, 0.04);
  s.lineTo(-0.13, 0.004);         // cara superior de la base
  const a0 = arco(ri, 0.004), a1 = arco(ri, ALTO_TOPE);
  for (let i = 0; i <= 16; i++) {
    const a = a0 + (a1 - a0) * (i / 16);
    s.lineTo(ri * Math.sin(a), Y_EJE - ri * Math.cos(a));
  }
  const b1 = a1, b0 = arco(re, 0);
  for (let i = 0; i <= 16; i++) {
    const a = b1 + (b0 - b1) * (i / 16);
    s.lineTo(re * Math.sin(a), Y_EJE - re * Math.cos(a));
  }
  s.lineTo(-0.15, 0);

  const bisel = 0.003;
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: ANCHO - 2 * bisel, bevelEnabled: true, bevelThickness: bisel, bevelSize: 0.002, bevelSegments: 2, curveSegments: 4,
  });
  geo.translate(0, 0, -(ANCHO - 2 * bisel) / 2);
  const cuna = new THREE.Mesh(geo, m.aluminio);
  cuna.name = 'calzo-cuna';
  cuna.castShadow = true;
  cuna.receiveShadow = true;

  // Taco de goma sobre la base, donde apoya el neumático.
  const geoTaco = new THREE.BoxGeometry(0.22, 0.004, ANCHO - 0.03);
  geoTaco.translate(-0.01, 0.006, 0);
  const taco = new THREE.Mesh(geoTaco, m.goma);
  taco.name = 'calzo-taco';
  taco.castShadow = true;
  taco.receiveShadow = true;

  grupo.add(cuna, taco);
  grupo.visible = false;
  return { grupo, dispose() { geo.dispose(); geoTaco.dispose(); } };
}
