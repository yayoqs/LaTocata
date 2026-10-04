/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/temas.js
   Versión: 0.1.0
   Propósito: Cambio de tema visual. Tres temas disponibles (a,
              b, c) que se aplican al body con data-tema.
   ================================================================ */

import { emitir } from './bus-eventos.js';

const CLAVE = 'latocata:tema';
export const TEMAS = [
  { id: 'a', nombre: 'Cálido', descripcion: 'Terracota, papel, cordel' },
  { id: 'b', nombre: 'Nocturno', descripcion: 'Azul profundo, luces de escenario' },
  { id: 'c', nombre: 'Textil', descripcion: 'Mostaza, rojo, verde profundo' },
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