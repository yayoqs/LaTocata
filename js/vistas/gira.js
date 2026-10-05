/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/gira.js
   Versión: 0.1.0
   Propósito: Gira / circuito itinerante. Muestra la serie de
              fechas y lugares del colectivo, ordenadas por
              proximidad. El "hoy" se destaca.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  ruta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a3 3 0 0 1 3-3h3"/><path d="M3 18a3 3 0 0 0 3 3h3"/><path d="M21 6a3 3 0 0 0-3-3h-3"/><path d="M21 18a3 3 0 0 1-3 3h-3"/><circle cx="12" cy="12" r="3"/></svg>',
};

const ESTADOS = {
  hoy:          { variante: 'exito',   vivo: true,  texto: 'Hoy' },
  confirmada:   { variante: 'acento',  vivo: false, texto: 'Confirmada' },
  'sin permiso':{ variante: 'aviso',   vivo: false, texto: 'Sin permiso' },
  idea:         { variante: 'neutral', vivo: false, texto: 'Idea' },
};

let contenedorPrincipal = null;

function paradas() {
  return obtener('paradas') || [];
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const lista = paradas();

  contenedorPrincipal.append(
    pintarCabecera(lista.length),
    pintarLista(lista),
    pintarAcciones()
  );
}

function pintarCabecera(total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.ruta }),
        'Gira / circuito'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Lo itinerante: la serie de fechas y lugares del colectivo.')
    ),
    total > 0
      ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(total) })
      : null
  );
}

function pintarLista(lista) {
  const cont = crearEtiqueta('div', { class: 'lista-tocatas-espacio' });

  if (lista.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin paradas programadas')
      )
    );
    return cont;
  }

  lista.forEach((p) => {
    const cfg = ESTADOS[p.estado] || ESTADOS.idea;
    const clasesPildora = ['pildora', 'pildora--' + cfg.variante];
    if (cfg.vivo) clasesPildora.push('pildora--vivo');

    const hijos = [];
    if (cfg.vivo) hijos.push(crearEtiqueta('span', { class: 'pildora__punto' }));
    hijos.push(cfg.texto);

    cont.append(
      crearEtiqueta('div', { class: 'tocata-fila' + (p.hoy ? ' tocata-fila--hoy' : '') },
        crearEtiqueta('div', { class: 'tocata-fila__fecha' }, p.fecha),
        crearEtiqueta('div', { class: 'tocata-fila__info' },
          crearEtiqueta('div', { class: 'tocata-fila__nombre', texto: p.lugar }),
          crearEtiqueta('div', { class: 'tocata-fila__meta', texto: p.comuna })
        ),
        crearEtiqueta('span', { class: clasesPildora.join(' ') }, ...hijos)
      )
    );
  });

  return cont;
}

function pintarAcciones() {
  return crearEtiqueta('div', { class: 'fila', style: { gap: '8px', flexWrap: 'wrap', marginTop: '20px' } },
    crearEtiqueta('button', {
      class: 'btn btn--primario btn--chico',
      type: 'button',
      texto: '+ Nueva fecha',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    }),
    crearEtiqueta('button', {
      class: 'btn btn--secundario btn--chico',
      type: 'button',
      texto: 'Repetir tocata en otro espacio',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    })
  );
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--gira' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}