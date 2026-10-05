/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/admin-roles.js
   Versión: 0.1.0
   Propósito: Vista del owner para ver y gestionar los roles del
              grupo. Los roles viven en el perfil global del
              ecosistema Elisekai; acá se asocian al grupo.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, iniciales, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
};

const ROLE_TAGS = {
  owner: { texto: 'Owner', variante: 'acento' },
  organizador: { texto: 'Organizador', variante: 'info' },
  staff: { texto: 'Staff', variante: 'exito' },
  musico: { texto: 'Músico', variante: 'acento' },
  anfitrion: { texto: 'Anfitrión', variante: 'info' },
  publico: { texto: 'Público', variante: 'neutral' },
};

let contenedorPrincipal = null;

function equipo() {
  return obtener('equipo') || [];
}

function comunidad() {
  return obtener('comunidad') || [];
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const equipoLista = equipo();

  contenedorPrincipal.append(
    pintarCabecera(equipoLista.length),
    pintarAviso(),
    pintarListaMiembros(equipoLista),
    pintarInvitar()
  );
}

function pintarCabecera(total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.escudo }),
        'Roles del grupo'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Como owner, aquí se asignan los roles dentro del grupo.')
    ),
    total > 0
      ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(total) })
      : null
  );
}

function pintarAviso() {
  return crearEtiqueta('div', { class: 'tarjeta tarjeta--compacta', style: { marginBottom: '16px' } },
    crearEtiqueta('p', { class: 'texto-suave', style: { margin: 0 } },
      'Los roles se asignan desde el perfil global de Elisekai. Esta vista permite ver y gestionar los roles del grupo LaTocata.'
    )
  );
}

function pintarListaMiembros(lista) {
  const cont = crearEtiqueta('div', { class: 'lista-tareas' });

  lista.forEach((m) => {
    const tag = ROLE_TAGS[m.rol] || { texto: m.rol, variante: 'neutral' };

    const etiquetas = crearEtiqueta('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' } });
    etiquetas.append(
      crearEtiqueta('span', { class: 'pildora pildora--' + tag.variante, texto: tag.texto })
    );
    (m.etiquetas || []).forEach((e) => {
      etiquetas.append(crearEtiqueta('span', { class: 'badge', texto: e }));
    });

    cont.append(
      crearEtiqueta('div', { class: 'miembro-fila' },
        crearEtiqueta('div', { class: 'avatar', texto: m.iniciales || iniciales(m.nombre) }),
        crearEtiqueta('div', { class: 'miembro-fila__info' },
          crearEtiqueta('div', { class: 'miembro-fila__nombre', texto: m.nombre }),
          m.notas ? crearEtiqueta('div', { class: 'miembro-fila__nota', texto: m.notas }) : null,
          etiquetas
        ),
        crearEtiqueta('button', {
          class: 'btn btn--secundario btn--chico',
          type: 'button',
          texto: 'Editar roles',
          onclick: () => mostrarToast('Edición de roles disponible en la app final.'),
        })
      )
    );
  });

  return cont;
}

function pintarInvitar() {
  return crearEtiqueta('div', { style: { marginTop: '20px' } },
    crearEtiqueta('button', {
      class: 'btn btn--primario',
      type: 'button',
      texto: '+ Invitar miembro al grupo',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    })
  );
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--admin-roles' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}