/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/bandas.js
   Versión: 0.1.0
   Propósito: Bandas y proyectos del músico dentro del colectivo.
              Yayo no está en ninguna banda todavía, así que se
              muestra un estado vacío con opción de crear una.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  bandas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  musica: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
};

let contenedorPrincipal = null;

function perfilMusico() {
  return obtener('musicoPerfil') || null;
}

function bandasDelMusico() {
  const perfil = perfilMusico();
  return (perfil && perfil.bandas) ? perfil.bandas : [];
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const bandas = bandasDelMusico();

  contenedorPrincipal.append(
    pintarCabecera(bandas.length),
    pintarLista(bandas)
  );
}

function pintarCabecera(total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.bandas }),
        'Mis bandas'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Bandas y proyectos donde tocas dentro de este colectivo.')
    ),
    total > 0
      ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(total) })
      : null
  );
}

function pintarLista(bandas) {
  const cont = crearEtiqueta('div', { class: 'lista-tareas' });

  if (bandas.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'tarjeta', style: { padding: '32px 24px', textAlign: 'center' } },
        crearEtiqueta('div', { class: 'vacio__titulo', texto: 'No estás en ninguna banda todavía' }),
        crearEtiqueta('p', { class: 'texto-suave', style: { marginTop: '8px', marginBottom: '16px' } },
          'Si tocas en una banda, su líder puede invitarte o puedes crear una.'
        ),
        crearEtiqueta('button', {
          class: 'btn btn--primario',
          type: 'button',
          texto: '+ Crear banda',
          onclick: () => mostrarToast('Función disponible en la app final.'),
        })
      )
    );
    return cont;
  }

  bandas.forEach((b) => {
    cont.append(
      crearEtiqueta('div', { class: 'banda-card' },
        crearEtiqueta('div', { class: 'tarjeta-metrica__icono tarjeta-metrica__icono--acento', html: ICO.musica }),
        crearEtiqueta('div', { class: 'banda-card__info' },
          crearEtiqueta('div', { class: 'banda-card__nombre', texto: b.nombre }),
          crearEtiqueta('div', { class: 'banda-card__meta', texto: b.detalle || '' })
        ),
        crearEtiqueta('button', {
          class: 'btn btn--secundario btn--chico',
          type: 'button',
          texto: 'Ver',
          onclick: () => mostrarToast('Ficha de banda disponible en la app final.'),
        })
      )
    );
  });

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--bandas' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}