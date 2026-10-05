/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/pub.js
   Versión: 0.1.0
   Propósito: Afiche público de la tocata. Es una vista de
              previsualización dentro del shell. Reúne la
              información que se compartiría por redes o por
              WhatsApp, con botones de acción.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  formatearFechaLarga,
  mostrarToast,
} from '../nucleo/utils.js';

const ICO = {
  afiche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  llegada: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>',
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

function actosConfirmados(tocataId) {
  return (obtener('actos') || [])
    .filter((a) => a.tocataRef === tocataId && ['aprobado', 'en_curso', 'terminado'].includes(a.estado))
    .sort((a, b) => a.ordenCola - b.ordenCola);
}

function etiquetaTipo(tipo) {
  const map = {
    jam: 'Jam',
    concierto: 'Concierto',
    microfono_abierto: 'Micrófono abierto',
    ensayo_abierto: 'Ensayo abierto',
    rave: 'Rave',
    tocata_tematica: 'Tocata temática',
    especifico: 'Tocata',
  };
  return map[tipo] || tipo;
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

  const espacio = espacioDe(tocata);
  const grupo = obtener('grupo');
  const actos = actosConfirmados(tocata.id);

  contenedorPrincipal.append(
    pintarCabecera(),
    pintarAfiche(tocata, espacio, grupo, actos),
    pintarAcciones(tocata)
  );
}

function pintarCabecera() {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.afiche }),
        'Afiche'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Previsualización de cómo se ve la tocata para compartir.')
    )
  );
}

function pintarAfiche(tocata, espacio, grupo, actos) {
  const cont = crearEtiqueta('article', { class: 'afiche' });

  cont.append(
    crearEtiqueta('div', { class: 'afiche__eyebrow', texto: (grupo ? grupo.nombre : 'LaTocata') + ' presenta' }),
    crearEtiqueta('h2', { class: 'afiche__titulo', texto: tocata.nombre }),
    crearEtiqueta('p', { class: 'afiche__desc', texto: tocata.descripcion || '' })
  );

  cont.append(
    crearEtiqueta('div', { class: 'afiche__meta' },
      metaItem(ICO.calendario, formatearFechaLarga(tocata.fecha)),
      metaItem(ICO.reloj, tocata.horaInicio + ' — ' + tocata.horaFinEstimada),
      espacio
        ? metaItem(ICO.llegada, espacio.nombre + ', ' + espacio.direccion + ', ' + espacio.comuna)
        : null
    )
  );

  if (actos.length > 0) {
    const lineup = crearEtiqueta('div', { class: 'afiche__lineup' });
    lineup.append(
      crearEtiqueta('div', { class: 'afiche__lineup-titulo' }, 'Lineup')
    );
    actos.forEach((a) => {
      lineup.append(
        crearEtiqueta('span', { class: 'pildora pildora--acento', texto: a.nombreArtistico })
      );
    });
    cont.append(lineup);
  }

  cont.append(
    crearEtiqueta('div', { class: 'afiche__tipo', texto: etiquetaTipo(tocata.tipo) })
  );

  return cont;
}

function metaItem(iconoHtml, texto) {
  return crearEtiqueta('div', { class: 'afiche__meta-item' },
    crearEtiqueta('span', { class: 'afiche__meta-icono', html: iconoHtml }),
    crearEtiqueta('span', { texto })
  );
}

function pintarAcciones(tocata) {
  const cont = crearEtiqueta('div', { class: 'fila', style: { gap: '8px', flexWrap: 'wrap', marginTop: '20px' } });

  cont.append(
    crearEtiqueta('button', {
      class: 'btn btn--primario',
      type: 'button',
      texto: 'Compartir imagen',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    }),
    crearEtiqueta('button', {
      class: 'btn btn--secundario',
      type: 'button',
      texto: 'Copiar link público',
      onclick: () => {
        const url = 'https://latocata.elisekai.com/cartelera/' + tocata.slug;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(
            () => mostrarToast('Link copiado.'),
            () => mostrarToast('No se pudo copiar.', 'error')
          );
        } else {
          mostrarToast('Link: ' + url);
        }
      },
    }),
    crearEtiqueta('a', {
      class: 'btn btn--secundario',
      href: 'cartelera.html',
      target: '_blank',
      texto: 'Abrir cartelera pública',
    })
  );

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--pub' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}