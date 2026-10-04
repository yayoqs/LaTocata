/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/estado.js
   Versión: 0.1.0
   Propósito: Estado compartido simple del prototipo. Sustituye
              al Store de producción. Sin reducers, sin acciones:
              un mapa de claves y valores, con suscripción.
   ================================================================ */

import { emitir } from './bus-eventos.js';

const estado = {};

export function obtener(clave) {
  return estado[clave];
}

export function obtenerTodo() {
  return { ...estado };
}

export function establecer(clave, valor) {
  const anterior = estado[clave];
  estado[clave] = valor;
  emitir('almacen:cambiado', { clave, valor, anterior });
  emitir('almacen:' + clave, { valor, anterior });
}

export function actualizar(clave, mutador) {
  const actual = estado[clave];
  const nuevo = mutador(actual);
  establecer(clave, nuevo);
}

export function limpiar() {
  Object.keys(estado).forEach((clave) => {
    delete estado[clave];
  });
}