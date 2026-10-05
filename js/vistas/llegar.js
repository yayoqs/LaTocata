/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/llegar.js
   Versión: 0.1.0
   Propósito: Cómo llegar al espacio de la tocata. Dirección,
              mapa placeholder, botones para abrir en mapas e
              instrucciones de transporte.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor } from '../nucleo/utils.js';

const ICO = {
  llegada: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
};

let contenedorPrincipal = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function espacioDe(tocata) {
  if (!tocata) return null;
  return (obtener('espacios') || []).find((e) => e.id === tocata.espacioRef) || null;
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const tocata = tocataActiva();
  const espacio = espacioDe(tocata);

  if (!espacio) {
    contenedorPrincipal.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin espacio asignado')
      )
    );
    return;
  }

  contenedorPrincipal.append(
    pintarCabecera(espacio),
    pintarDireccion(espacio),
    pintarMapaPlaceholder(),
    pintarBotonesMapa(espacio),
    pintarInstrucciones(espacio)
  );
}

function pintarCabecera(espacio) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.llegada }),
        'Cómo llegar'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'La tocata se hace en ' + espacio.nombre + '.')
    )
  );
}

function pintarDireccion(espacio) {
  return crearEtiqueta('div', { class: 'tarjeta', style: { marginBottom: '16px' } },
    crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta' }, 'Dirección'),
    crearEtiqueta('div', { style: { fontWeight: '700', fontSize: '1.05rem', marginTop: '4px' } }, espacio.nombre),
    crearEtiqueta('div', { class: 'texto-suave', style: { marginTop: '2px' } },
      (espacio.direccion || '') + ', ' + (espacio.comuna || '')
    )
  );
}

function pintarMapaPlaceholder() {
  return crearEtiqueta('div', { class: 'mapa-placeholder' },
    crearEtiqueta('div', { class: 'mapa-placeholder__pin', texto: '📍' })
  );
}

function pintarBotonesMapa(espacio) {
  const q = encodeURIComponent(espacio.nombre + ', ' + espacio.direccion + ', ' + espacio.comuna);
  return crearEtiqueta('div', { class: 'fila', style: { gap: '8px', flexWrap: 'wrap', margin: '16px 0' } },
    crearEtiqueta('a', {
      class: 'btn btn--primario',
      href: 'https://www.google.com/maps/search/?api=1&query=' + q,
      target: '_blank',
      texto: 'Abrir en Google Maps',
    }),
    crearEtiqueta('a', {
      class: 'btn btn--secundario',
      href: 'https://waze.com/ul?q=' + q,
      target: '_blank',
      texto: 'Abrir en Waze',
    })
  );
}

function pintarInstrucciones(espacio) {
  return crearEtiqueta('section', {},
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' }, 'Instrucciones')
    ),
    crearEtiqueta('div', { class: 'tarjeta' },
      crearEtiqueta('p', { style: { marginBottom: '10px' } },
        crearEtiqueta('b', {}, 'En auto: '),
        'desde el centro, tomar Av. España hacia el oriente. La casa está al llegar a la esquina con pasaje Los Aromos.'
      ),
      crearEtiqueta('p', { style: { marginBottom: '10px' } },
        crearEtiqueta('b', {}, 'En micro: '),
        'líneas 3 y 6 hasta la parada "España con Los Aromos".'
      ),
      crearEtiqueta('p', {},
        crearEtiqueta('b', {}, 'En bici: '),
        'hay espacio para dejar bicicletas en el antejardín.'
      )
    )
  );
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--llegar' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}