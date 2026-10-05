/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/checklist.js
   Versión: 0.1.0
   Propósito: Checklist del día. Lista de tareas operativas con
              barra de progreso. Cada tarea se marca con un toque.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor } from '../nucleo/utils.js';

const ICO = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
};

let contenedorPrincipal = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function checklistDe(tocataId) {
  return (obtener('checklist') || []).filter((c) => c.tocataRef === tocataId);
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

  const tareas = checklistDe(tocata.id);
  const hechas = tareas.filter((c) => c.hecho).length;

  contenedorPrincipal.append(
    pintarCabecera(tocata, hechas, tareas.length),
    pintarProgreso(hechas, tareas.length),
    pintarLista(tareas)
  );
}

function pintarCabecera(tocata, hechas, total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.check }),
        'Checklist del día'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, tocata.nombre)
    ),
    total > 0
      ? crearEtiqueta('span', { class: 'cabecera-seccion__contador', texto: hechas + '/' + total })
      : null
  );
}

function pintarProgreso(hechas, total) {
  const pct = total > 0 ? (hechas / total) * 100 : 0;
  return crearEtiqueta('div', { class: 'progreso' },
    crearEtiqueta('span', { class: 'progreso__texto', texto: pct.toFixed(0) + '%' }),
    crearEtiqueta('div', { class: 'barra', style: { flex: '1', margin: '0' } },
      crearEtiqueta('b', { style: { width: pct + '%' } })
    )
  );
}

function pintarLista(tareas) {
  const cont = crearEtiqueta('div', { class: 'lista-tareas' });

  if (tareas.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin tareas en el checklist')
      )
    );
    return cont;
  }

  tareas.forEach((t) => {
    const fila = crearEtiqueta('button', {
      class: 'tarea' + (t.hecho ? ' tarea--hecha' : ''),
      type: 'button',
      onclick: () => {
        const todos = obtener('checklist') || [];
        const idx = todos.findIndex((x) => x.id === t.id);
        if (idx < 0) return;
        todos[idx] = { ...todos[idx], hecho: !todos[idx].hecho };
        establecer('checklist', [...todos]);
        pintar();
      },
    },
      crearEtiqueta('span', { class: 'tarea__casilla', texto: t.hecho ? '✓' : '' }),
      crearEtiqueta('span', { class: 'tarea__info' },
        crearEtiqueta('span', { class: 'tarea__titulo', texto: t.tarea })
      )
    );
    cont.append(fila);
  });

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--checklist' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}