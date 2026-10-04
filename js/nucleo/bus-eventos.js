/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/bus-eventos.js
   Versión: 0.1.0
   Propósito: Bus de eventos simple. Permite emitir, suscribir y
              desuscribir. Sin dependencias.
   ================================================================ */

const suscriptores = new Map();

export function al(evento, manejador) {
  if (!suscriptores.has(evento)) suscriptores.set(evento, new Set());
  suscriptores.get(evento).add(manejador);
  return () => desuscribir(evento, manejador);
}

export function desuscribir(evento, manejador) {
  const set = suscriptores.get(evento);
  if (!set) return;
  set.delete(manejador);
  if (set.size === 0) suscriptores.delete(evento);
}

export function emitir(evento, datos) {
  const set = suscriptores.get(evento);
  if (!set) return;
  set.forEach((manejador) => {
    try {
      manejador(datos);
    } catch (e) {
      console.error('[Bus] Error en manejador de', evento, e);
    }
  });
}