/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/temas.js
   Versión: 0.3.0
   Propósito: Cambio de tema visual. Seis temas disponibles (a-f)
              que se aplican al body con data-tema.
              v0.3.0: el tema f deja de ser "Original" y pasa a ser
                      "Serigrafía", recuperado del prototipo visual
                      del 4 de octubre de 2026. Antes duplicaba al
                      tema a del modular sin aportar variedad. La
                      paleta de Serigrafía (crema + rojo + azul,
                      Anton mayúsculas, sombra dura) es
                      suficientemente distinta del resto.
              v0.2.0: se suman los temas d (Kraft), e (Risografía)
                      y f (Original).
              v0.1.0: versión inicial con tres temas.
   ================================================================ */

import { emitir } from './bus-eventos.js';

const CLAVE = 'latocata:tema';

export const TEMAS = [
  { id: 'a', nombre: 'Cálido',     descripcion: 'Terracota, papel, cordel' },
  { id: 'b', nombre: 'Nocturno',   descripcion: 'Azul profundo, luces de escenario' },
  { id: 'c', nombre: 'Textil',     descripcion: 'Mostaza, rojo, verde profundo' },
  { id: 'd', nombre: 'Kraft',      descripcion: 'Marrón, verde, amarillo. Anton mayúsculas' },
  { id: 'e', nombre: 'Risografía', descripcion: 'Rosa pastel, turquesa, violeta' },
  { id: 'f', nombre: 'Serigrafía', descripcion: 'Crema, rojo, azul. Anton condensada, sombra dura' },
];

export function aplicarTema(id) {
  const tema = TEMAS.find((t) => t.id === id) || TEMAS[0];
  document.body.setAttribute('data-tema', tema.id);
  try { localStorage.setItem(CLAVE, tema.id); } catch (e) {}
  emitir('tema:cambiado', { tema: tema.id });
}

export function leerTemaDeDisco() {
  try { return localStorage.getItem(CLAVE); } catch (e) { return null; }
}