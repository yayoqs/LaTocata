/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/espacios.js
   Versión: 0.2.0
   Propósito: Catálogo de espacios prestados. Ficha, disponibilidad
              y contacto del anfitrión.
              v0.2.0: el listado lateral pasa de botones sueltos a
                      una .tabla deslizable. La ficha del espacio a
                      la derecha se mantiene con el mismo layout
                      pero se reescribe usando .cabecera-seccion
                      para el título y .pildora para las condiciones
                      del espacio.
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  casa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
};

let contenedorPrincipal = null;

function espacios() {
  return obtener('espacios') || [];
}

function espacioSeleccionado() {
  const id = obtener('espacioSeleccionadoId');
  if (id) return espacios().find((e) => e.id === id);
  return espacios()[0] || null;
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const lista = espacios();
  const sel = espacioSeleccionado();

  contenedorPrincipal.append(
    pintarCabecera(lista.length),
    crearEtiqueta('div', { class: 'espacios__layout' },
      pintarLista(lista, sel),
      sel ? pintarDetalle(sel) : null
    )
  );
}

function pintarCabecera(total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
      crearEtiqueta('span', { html: ICO.casa }),
      'Espacios'
    ),
    crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro',
      texto: String(total)
    }),
    crearEtiqueta('button', {
      class: 'btn btn--primario btn--chico',
      texto: '+ Agregar espacio',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    })
  );
}

function pintarLista(lista, sel) {
  const cont = crearEtiqueta('div', { class: 'tabla tabla--compacta' });
  const scroll = crearEtiqueta('div', { class: 'tabla__scroll' });

  const tabla = crearEtiqueta('table', { class: 'tabla__elemento', style: { minWidth: 'auto' } });
  const thead = crearEtiqueta('thead');
  const filaCabecera = crearEtiqueta('tr');
  ['Espacio', 'Comuna', 'Aforo'].forEach((titulo) => {
    filaCabecera.append(crearEtiqueta('th', { texto: titulo }));
  });
  thead.append(filaCabecera);
  tabla.append(thead);

  const tbody = crearEtiqueta('tbody');
  lista.forEach((e) => {
    const fila = crearEtiqueta('tr', {
      style: {
        cursor: 'pointer',
        background: sel && e.id === sel.id ? 'var(--superficie-2)' : '',
      },
      onclick: () => {
        establecer('espacioSeleccionadoId', e.id);
        pintar();
      },
    });
    fila.append(
      crearEtiqueta('td', {},
        crearEtiqueta('div', { style: { fontWeight: '600' }, texto: e.nombre }),
        crearEtiqueta('div', { class: 'texto-suave texto-chico', texto: e.tipo })
      ),
      crearEtiqueta('td', { texto: e.comuna || '—' }),
      crearEtiqueta('td', { texto: String(e.capacidad || 0) })
    );
    tbody.append(fila);
  });

  tabla.append(tbody);
  scroll.append(tabla);
  cont.append(scroll);
  return cont;
}

function pintarDetalle(e) {
  const cont = crearEtiqueta('main', { class: 'espacios__detalle' });

  cont.append(
    crearEtiqueta('h2', { class: 'espacios__detalle-titulo', texto: e.nombre }),
    crearEtiqueta('div', { class: 'espacios__detalle-meta' },
      metaItem('📍', (e.direccion || '') + (e.comuna ? ', ' + e.comuna : '')),
      metaItem('👥', 'Aforo ' + (e.capacidad || 0) + ' personas'),
      e.anfitrionNombre ? metaItem('🤝', 'Anfitrión: ' + e.anfitrionNombre) : null,
      e.anfitrionContacto ? metaItem('📞', e.anfitrionContacto) : null
    )
  );

  const condiciones = crearEtiqueta('div', { class: 'espacios__condiciones' });
  condiciones.append(
    crearEtiqueta('h3', { class: 'espacios__sub-titulo' }, 'Condiciones del espacio')
  );

  const listaChecks = crearEtiqueta('div', { class: 'espacios__checks' });
  listaChecks.append(
    pildoraCondicion(e.tieneSonido, 'Sonido'),
    pildoraCondicion(e.tieneBanos, 'Baños'),
    pildoraCondicion(e.tieneElectricidad, 'Electricidad')
  );
  condiciones.append(listaChecks);

  if (e.condiciones) {
    condiciones.append(
      crearEtiqueta('p', { class: 'texto-suave', style: { marginTop: '12px' } }, e.condiciones)
    );
  }
  cont.append(condiciones);

  if (e.notasInternas) {
    cont.append(
      crearEtiqueta('div', { class: 'espacios__notas' },
        crearEtiqueta('h3', { class: 'espacios__sub-titulo' }, 'Notas internas'),
        crearEtiqueta('p', {}, e.notasInternas)
      )
    );
  }

  return cont;
}

function metaItem(emoji, texto) {
  return crearEtiqueta('div', { class: 'espacios__meta-item' },
    crearEtiqueta('span', { texto: emoji }),
    crearEtiqueta('span', { texto })
  );
}

function pildoraCondicion(valor, etiqueta) {
  return crearEtiqueta('span', {
    class: 'pildora pildora--' + (valor ? 'exito' : 'neutral'),
    texto: etiqueta,
  });
}

/* ---------- Ciclo de vida ---------- */

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--espacios' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}