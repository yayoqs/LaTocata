/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/contacto.js
   Versión: 0.1.0
   Propósito: Contactos del equipo organizador y del owner. Para
              que el anfitrión sepa con quién hablar si surge algo.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, iniciales, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  mensaje: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
};

let contenedorPrincipal = null;

function contactoDe(usuarioRef) {
  const com = (obtener('comunidad') || []).find((c) => c.usuarioRef === usuarioRef);
  return com && com.contacto ? com.contacto : {};
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const equipo = obtener('equipo') || [];
  const owners = equipo.filter((e) => e.rol === 'owner');
  const organizadores = equipo.filter((e) => e.rol === 'organizador');

  contenedorPrincipal.append(
    pintarCabecera(),
    pintarGrupo('Organizadores', organizadores),
    pintarGrupo('Owner del grupo', owners)
  );
}

function pintarCabecera() {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.mensaje }),
        'Contacto'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Con quién hablar si surge algo.')
    )
  );
}

function pintarGrupo(titulo, personas) {
  const cont = crearEtiqueta('section', {});
  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' }, titulo)
    )
  );

  if (personas.length === 0) {
    cont.append(
      crearEtiqueta('p', { class: 'texto-suave' }, 'Sin contactos en este grupo.')
    );
    return cont;
  }

  personas.forEach((p) => {
    const contacto = contactoDe(p.usuarioRef);
    const telefono = contacto.whatsapp || '';

    const botones = crearEtiqueta('div', { class: 'contacto-card__accion' });
    if (telefono) {
      botones.append(
        crearEtiqueta('a', {
          class: 'btn btn--secundario btn--chico',
          href: 'https://wa.me/' + telefono.replace(/\D/g, ''),
          target: '_blank',
          texto: 'WhatsApp',
        })
      );
    } else {
      botones.append(
        crearEtiqueta('button', {
          class: 'btn btn--secundario btn--chico',
          type: 'button',
          texto: 'Ver perfil',
          onclick: () => mostrarToast('Perfil disponible en la app final.'),
        })
      );
    }

    cont.append(
      crearEtiqueta('div', { class: 'contacto-card' },
        crearEtiqueta('div', { class: 'avatar', texto: p.iniciales || iniciales(p.nombre) }),
        crearEtiqueta('div', { class: 'contacto-card__info' },
          crearEtiqueta('div', { class: 'contacto-card__nombre', texto: p.nombre }),
          crearEtiqueta('div', { class: 'contacto-card__rol', texto: p.rol + (p.notas ? ' · ' + p.notas : '') })
        ),
        botones
      )
    );
  });

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--contacto' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}