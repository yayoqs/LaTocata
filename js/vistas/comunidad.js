/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/comunidad.js
   Versión: 0.2.0
   Propósito: Agenda de la comunidad. Filtros por tipo.
              v0.2.0: se adopta el sistema visual:
                      · .buscador con atajo Ctrl+K para filtrar
                        por nombre
                      · .tabla deslizable en lugar de grilla de
                        tarjetas, más densa para listas largas
                      · .pildora para el tipo de cada persona
                      · .cabecera-seccion para el encabezado
                      · .conmutador para elegir entre vista de
                        tarjetas y vista de tabla
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  iniciales,
  atajoBusqueda,
} from '../nucleo/utils.js';

const ICO = {
  buscar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  tarjetas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  tabla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  personas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
};

let contenedorPrincipal = null;
let filtro = 'todos';
let termino = '';
let vista = 'tarjetas';
let limpiarAtajo = null;

function comunidad() {
  return obtener('comunidad') || [];
}

function tiposValidos() {
  return ['musico', 'colaborador', 'anfitrion', 'vecino', 'auspiciador', 'otro'];
}

function filtrar(lista) {
  let resultado = lista;
  if (filtro !== 'todos') {
    resultado = resultado.filter((c) => c.tipo === filtro);
  }
  if (termino) {
    const t = termino.toLowerCase();
    resultado = resultado.filter((c) =>
      (c.nombre || '').toLowerCase().includes(t) ||
      (c.tipo || '').toLowerCase().includes(t) ||
      (c.etiquetas || []).some((tag) => tag.toLowerCase().includes(t)) ||
      (c.notasInternas || '').toLowerCase().includes(t)
    );
  }
  return resultado;
}

/* ---------- Pintado ---------- */

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const todos = comunidad();
  const filtrados = filtrar(todos);

  contenedorPrincipal.append(
    pintarCabecera(todos.length),
    pintarBarraControl(),
    pintarContenido(filtrados)
  );

  // Después de montar el buscador en el DOM, activar el atajo.
  const entrada = document.getElementById('comunidad-buscar');
  if (entrada) {
    if (limpiarAtajo) limpiarAtajo();
    limpiarAtajo = atajoBusqueda(entrada);
  }
}

function pintarCabecera(total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
      crearEtiqueta('span', { html: ICO.personas }),
      'Comunidad'
    ),
    crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro',
      texto: String(total)
    })
  );
}

function pintarBarraControl() {
  const cont = crearEtiqueta('div', { class: 'comunidad__barra' });

  const buscador = crearEtiqueta('div', { class: 'buscador' },
    crearEtiqueta('span', { class: 'buscador__icono', html: ICO.buscar }),
    crearEtiqueta('input', {
      class: 'buscador__campo',
      id: 'comunidad-buscar',
      type: 'text',
      placeholder: 'Buscar por nombre, etiqueta o nota...',
      value: termino,
    }),
    crearEtiqueta('span', { class: 'buscador__atajo', texto: 'Ctrl K' })
  );

  buscador.querySelector('input').addEventListener('input', (ev) => {
    termino = ev.target.value;
    const filtrados = filtrar(comunidad());
    const contenedor = contenedorPrincipal.querySelector('.comunidad__contenido');
    if (contenedor) {
      limpiarContenedor(contenedor);
      contenedor.append(vista === 'tabla' ? pintarTabla(filtrados) : pintarTarjetas(filtrados));
    }
  });

  const conmutador = crearEtiqueta('div', { class: 'conmutador' },
    crearEtiqueta('button', {
      class: 'conmutador__opcion' + (vista === 'tarjetas' ? ' activo' : ''),
      type: 'button',
      onclick: () => { vista = 'tarjetas'; pintar(); },
    },
      crearEtiqueta('span', { html: ICO.tarjetas }),
      'Tarjetas'
    ),
    crearEtiqueta('button', {
      class: 'conmutador__opcion' + (vista === 'tabla' ? ' activo' : ''),
      type: 'button',
      onclick: () => { vista = 'tabla'; pintar(); },
    },
      crearEtiqueta('span', { html: ICO.tabla }),
      'Tabla'
    )
  );

  cont.append(buscador, conmutador);
  return cont;
}

function pintarContenido(filtrados) {
  const cont = crearEtiqueta('div', { class: 'comunidad__contenido' });
  cont.append(vista === 'tabla' ? pintarTabla(filtrados) : pintarTarjetas(filtrados));
  return cont;
}

function pintarTarjetas(lista) {
  const cont = crearEtiqueta('div', { class: 'conmutador-grilla' });

  if (lista.length === 0) {
    cont.append(pintarVacio());
    return cont;
  }

  lista.forEach((c) => {
    cont.append(
      crearEtiqueta('div', { class: 'tarjeta tarjeta--compacta' },
        crearEtiqueta('div', { style: { display: 'flex', gap: '12px', alignItems: 'center' } },
          crearEtiqueta('div', { class: 'avatar', texto: iniciales(c.nombre) }),
          crearEtiqueta('div', { style: { flex: '1', minWidth: '0' } },
            crearEtiqueta('div', { style: { fontWeight: '600' }, texto: c.nombre }),
            crearEtiqueta('div', { class: 'texto-suave texto-chico', texto: capitalizar(c.tipo) })
          )
        ),
        (c.etiquetas || []).length > 0
          ? crearEtiqueta('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' } },
              ...c.etiquetas.map((t) => crearEtiqueta('span', { class: 'badge', texto: t }))
            )
          : null,
        c.notasInternas
          ? crearEtiqueta('div', { class: 'texto-chico texto-suave', style: { marginTop: '8px' }, texto: c.notasInternas })
          : null
      )
    );
  });

  return cont;
}

function pintarTabla(lista) {
  if (lista.length === 0) {
    return pintarVacio();
  }

  const cont = crearEtiqueta('div', { class: 'tabla' });
  const scroll = crearEtiqueta('div', { class: 'tabla__scroll' });

  const tabla = crearEtiqueta('table', { class: 'tabla__elemento' });
  const thead = crearEtiqueta('thead');
  const filaCabecera = crearEtiqueta('tr');
  ['', 'Nombre', 'Tipo', 'Etiquetas', 'Notas'].forEach((titulo) => {
    filaCabecera.append(crearEtiqueta('th', { texto: titulo }));
  });
  thead.append(filaCabecera);
  tabla.append(thead);

  const tbody = crearEtiqueta('tbody');
  lista.forEach((c) => {
    const fila = crearEtiqueta('tr');

    fila.append(
      crearEtiqueta('td', {},
        crearEtiqueta('div', { class: 'avatar avatar--chico', texto: iniciales(c.nombre) })
      ),
      crearEtiqueta('td', { texto: c.nombre }),
      crearEtiqueta('td', {},
        crearEtiqueta('span', { class: 'pildora pildora--acento', texto: capitalizar(c.tipo) })
      ),
      crearEtiqueta('td', {},
        crearEtiqueta('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap' } },
          ...(c.etiquetas || []).map((t) => crearEtiqueta('span', { class: 'badge', texto: t }))
        )
      ),
      crearEtiqueta('td', { texto: c.notasInternas || '—' })
    );

    tbody.append(fila);
  });

  tabla.append(tbody);
  scroll.append(tabla);
  cont.append(scroll);
  return cont;
}

function pintarVacio() {
  return crearEtiqueta('div', { class: 'vacio' },
    crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin resultados'),
    crearEtiqueta('p', {}, 'Ajusta la búsqueda o cambia el filtro.')
  );
}

function capitalizar(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* ---------- Ciclo de vida ---------- */

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--comunidad' });
  contenedor.append(contenedorPrincipal);
  filtro = 'todos';
  termino = '';
  pintar();
}

export function limpiar() {
  if (limpiarAtajo) {
    limpiarAtajo();
    limpiarAtajo = null;
  }
  contenedorPrincipal = null;
}