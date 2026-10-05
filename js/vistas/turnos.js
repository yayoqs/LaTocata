/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/turnos.js
   Versión: 0.1.0
   Propósito: Mis turnos. Lista los turnos del evento para el
              staff. Marca cada turno como hecho con un toque.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>',
};

let contenedorPrincipal = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function turnosDe(tocataId) {
  return (obtener('turnos') || []).filter((t) => t.tocataRef === tocataId);
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const tocata = tocataActiva();
  if (!tocata) {
    contenedorPrincipal.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin tocata activa')
      )
    );
    return;
  }

  const turnos = turnosDe(tocata.id);
  const hechos = turnos.filter((t) => t.hecho).length;

  contenedorPrincipal.append(
    pintarCabecera(tocata, hechos, turnos.length),
    pintarLista(turnos)
  );
}

function pintarCabecera(tocata, hechos, total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.reloj }),
        'Mis turnos'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, tocata.nombre)
    ),
    total > 0
      ? crearEtiqueta('span', { class: 'cabecera-seccion__contador', texto: hechos + '/' + total })
      : null
  );
}

function pintarLista(turnos) {
  const cont = crearEtiqueta('div', { class: 'lista-tareas' });

  if (turnos.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin turnos asignados')
      )
    );
    return cont;
  }

  turnos.forEach((t, i) => {
    const fila = crearEtiqueta('button', {
      class: 'tarea' + (t.hecho ? ' tarea--hecha' : ''),
      type: 'button',
      onclick: () => {
        const todos = obtener('turnos') || [];
        const idx = todos.findIndex((x) => x.id === t.id);
        if (idx < 0) return;
        todos[idx] = { ...todos[idx], hecho: !todos[idx].hecho };
        establecer('turnos', [...todos]);
        pintar();
      },
    },
      crearEtiqueta('span', { class: 'tarea__casilla', texto: t.hecho ? '✓' : '' }),
      crearEtiqueta('span', { class: 'tarea__info' },
        crearEtiqueta('span', { class: 'tarea__titulo', texto: t.tarea }),
        crearEtiqueta('span', { class: 'tarea__meta', texto: t.hora + ' · ' + t.asignado })
      )
    );
    cont.append(fila);
  });

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--turnos' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}