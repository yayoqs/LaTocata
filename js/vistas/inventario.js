/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/inventario.js
   Versión: 0.2.0
   Propósito: Inventario de equipos del grupo, de usuarios y del
              espacio. Con estado de préstamo.
              v0.2.0: se adopta el sistema visual:
                      · .conmutador para alternar entre vista de
                        tarjetas y vista de tabla
                      · .tabla deslizable para la vista densa
                      · .pildora para el estado y la condición de
                        préstamo
                      · .cabecera-seccion para el encabezado
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  tarjetas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  tabla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  caja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
};

let contenedorPrincipal = null;
let vista = 'tarjetas';

function inventario() {
  return obtener('inventario') || [];
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const items = inventario();

  contenedorPrincipal.append(
    pintarCabecera(items.length),
    pintarConmutador(),
    vista === 'tabla' ? pintarTabla(items) : pintarTarjetas(items)
  );
}

function pintarCabecera(total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
      crearEtiqueta('span', { html: ICO.caja }),
      'Inventario'
    ),
    crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro',
      texto: String(total)
    })
  );
}

function pintarConmutador() {
  const cont = crearEtiqueta('div', { class: 'inventario__barra' });

  cont.append(
    crearEtiqueta('div', { class: 'conmutador' },
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
    ),
    crearEtiqueta('button', {
      class: 'btn btn--primario btn--chico',
      texto: '+ Agregar equipo',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    })
  );

  return cont;
}

function emojiCategoria(cat) {
  const map = {
    amplificacion: '🔊',
    microfono: '🎤',
    cuerdas: '🎸',
    percusion: '🥁',
    cables: '🔌',
    iluminacion: '💡',
    sonido: '🎚️',
    otros: '📦',
  };
  return map[cat] || '📦';
}

function varianteEstado(estado) {
  const map = { bueno: 'exito', funciona_pero: 'aviso', roto: 'error', en_reparacion: 'info' };
  return map[estado] || 'neutral';
}

function etiquetaEstado(estado) {
  const map = { bueno: 'Buen estado', funciona_pero: 'Funciona, pero', roto: 'Roto', en_reparacion: 'En reparación' };
  return map[estado] || estado;
}

function nombrePropietario(item) {
  if (item.propietarioTipo === 'usuario') {
    return (obtener('comunidad') || []).find((c) => c.usuarioRef === item.propietarioRef)?.nombre
      || item.propietarioRef;
  }
  if (item.propietarioTipo === 'grupo') return 'Grupo';
  return 'Espacio';
}

/* ---------- Vista de tarjetas ---------- */

function pintarTarjetas(lista) {
  const cont = crearEtiqueta('div', { class: 'conmutador-grilla' });

  if (lista.length === 0) {
    cont.append(pintarVacio());
    return cont;
  }

  lista.forEach((i) => {
    cont.append(
      crearEtiqueta('div', { class: 'tarjeta tarjeta--compacta' },
        crearEtiqueta('div', { style: { display: 'flex', gap: '12px', alignItems: 'center' } },
          crearEtiqueta('div', {
            class: 'tarjeta-metrica__icono tarjeta-metrica__icono--acento',
            style: { fontSize: '1.4rem' },
            texto: emojiCategoria(i.categoria),
          }),
          crearEtiqueta('div', { style: { flex: '1', minWidth: '0' } },
            crearEtiqueta('div', { style: { fontWeight: '600' }, texto: i.nombre }),
            crearEtiqueta('div', { class: 'texto-suave texto-chico', texto: 'Propiedad: ' + nombrePropietario(i) })
          )
        ),
        crearEtiqueta('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' } },
          crearEtiqueta('span', { class: `pildora pildora--${varianteEstado(i.estado)}`, texto: etiquetaEstado(i.estado) }),
          i.disponibleParaPrestamo
            ? crearEtiqueta('span', { class: 'pildora pildora--exito', texto: 'Prestable' })
            : null
        ),
        i.notas
          ? crearEtiqueta('div', { class: 'texto-chico texto-suave', style: { marginTop: '8px' }, texto: i.notas })
          : null
      )
    );
  });

  return cont;
}

/* ---------- Vista de tabla ---------- */

function pintarTabla(lista) {
  if (lista.length === 0) return pintarVacio();

  const cont = crearEtiqueta('div', { class: 'tabla' });
  const scroll = crearEtiqueta('div', { class: 'tabla__scroll' });

  const tabla = crearEtiqueta('table', { class: 'tabla__elemento' });
  const thead = crearEtiqueta('thead');
  const filaCabecera = crearEtiqueta('tr');
  ['', 'Equipo', 'Propiedad', 'Estado', 'Prestable'].forEach((titulo) => {
    filaCabecera.append(crearEtiqueta('th', { texto: titulo }));
  });
  thead.append(filaCabecera);
  tabla.append(thead);

  const tbody = crearEtiqueta('tbody');
  lista.forEach((i) => {
    const fila = crearEtiqueta('tr');
    fila.append(
      crearEtiqueta('td', { style: { fontSize: '1.2rem' }, texto: emojiCategoria(i.categoria) }),
      crearEtiqueta('td', { texto: i.nombre }),
      crearEtiqueta('td', { texto: nombrePropietario(i) }),
      crearEtiqueta('td', {},
        crearEtiqueta('span', { class: `pildora pildora--${varianteEstado(i.estado)}`, texto: etiquetaEstado(i.estado) })
      ),
      crearEtiqueta('td', {},
        i.disponibleParaPrestamo
          ? crearEtiqueta('span', { class: 'pildora pildora--exito', texto: 'Sí' })
          : crearEtiqueta('span', { class: 'pildora pildora--neutral', texto: 'No' })
      )
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
    crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin equipos registrados')
  );
}

/* ---------- Ciclo de vida ---------- */

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--inventario' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}