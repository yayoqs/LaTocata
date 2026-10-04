/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/configuracion.js
   Versión: 0.2.0
   Propósito: Configuración del grupo y del perfil del usuario.
              v0.2.0: se adopta el sistema visual:
                      · .cabecera-seccion para los encabezados
                      · .tarjeta-accion para las tres opciones de
                        tema visual
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { TEMAS, aplicarTema } from '../nucleo/temas.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  ajustes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
};

let contenedorPrincipal = null;

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  contenedorPrincipal.append(
    pintarCabecera(),
    pintarSeccionGrupo(),
    pintarSeccionTema(),
    pintarSeccionUsuario()
  );
}

function pintarCabecera() {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.ajustes }),
        'Ajustes'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Configuración del grupo y preferencias personales')
    )
  );
}

function pintarSeccionGrupo() {
  const grupo = obtener('grupo');
  const cont = crearEtiqueta('section', { class: 'tarjeta' });
  cont.append(
    crearEtiqueta('h2', { class: 'tarjeta__titulo', style: { marginBottom: '14px' } }, 'Grupo cultural'),
    campo('Nombre del grupo', grupo?.nombre || '—'),
    campo('Ciudad', grupo?.ciudad || '—'),
    campo('Slug público', grupo?.slug || '—'),
    crearEtiqueta('button', {
      class: 'btn btn--secundario btn--chico',
      style: { marginTop: '12px' },
      texto: 'Editar grupo',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    })
  );
  return cont;
}

function pintarSeccionTema() {
  const cont = crearEtiqueta('section', { class: 'tarjeta' });
  cont.append(
    crearEtiqueta('h2', { class: 'tarjeta__titulo', style: { marginBottom: '14px' } }, 'Tema visual')
  );

  const temaActual = document.body.getAttribute('data-tema');
  const grilla = crearEtiqueta('div', { class: 'grilla grilla--3' });
  TEMAS.forEach((t) => {
    grilla.append(
      crearEtiqueta('button', {
        class: 'config__tema' + (temaActual === t.id ? ' activo' : ''),
        type: 'button',
        onclick: () => {
          aplicarTema(t.id);
          pintar();
        },
      },
        crearEtiqueta('div', { class: 'config__tema-preview config__tema-preview--' + t.id },
          crearEtiqueta('div', { class: 'config__tema-barra' }),
          crearEtiqueta('div', { class: 'config__tema-bloque' })
        ),
        crearEtiqueta('div', { class: 'config__tema-nombre', texto: t.nombre }),
        crearEtiqueta('div', { class: 'config__tema-desc texto-chico texto-suave', texto: t.descripcion })
      )
    );
  });
  cont.append(grilla);
  return cont;
}

function pintarSeccionUsuario() {
  const u = obtener('usuarioActual');
  const cont = crearEtiqueta('section', { class: 'tarjeta' });
  cont.append(
    crearEtiqueta('h2', { class: 'tarjeta__titulo', style: { marginBottom: '14px' } }, 'Mi cuenta'),
    campo('Nombre', u?.nombre || '—'),
    campo('Apodo', u?.apodo || '—'),
    campo('Email', u?.email || '—'),
    crearEtiqueta('button', {
      class: 'btn btn--peligro btn--chico',
      style: { marginTop: '12px' },
      texto: 'Cerrar sesión',
      onclick: () => {
        if (confirm('¿Cerrar sesión?')) location.reload();
      },
    })
  );
  return cont;
}

function campo(etiqueta, valor) {
  return crearEtiqueta('div', { style: { marginBottom: '10px' } },
    crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta', texto: etiqueta }),
    crearEtiqueta('div', { style: { fontSize: '1rem' }, texto: valor })
  );
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--config' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}