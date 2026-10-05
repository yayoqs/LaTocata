/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/avisos-equipo.js
   Versión: 0.1.0
   Propósito: Pizarra corta para coordinarse durante la tocata.
              Lista los avisos de tipo equipo y permite publicar
              uno nuevo. Los avisos públicos van a la cartelera y
              se manejan desde el panel del organizador.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { emitir } from '../nucleo/bus-eventos.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  iniciales,
  mostrarToast,
} from '../nucleo/utils.js';

const ICO = {
  mensaje: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
};

let contenedorPrincipal = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function avisosDe(tocataId) {
  return (obtener('avisos') || [])
    .filter((a) => a.tocataRef === tocataId && a.tipo === 'equipo')
    .slice()
    .reverse();
}

function nombreUsuario(usuarioRef) {
  const usuario = obtener('usuarioActual');
  if (usuario && usuario.id === usuarioRef) return usuario.apodo || usuario.nombre;
  const com = (obtener('comunidad') || []).find((c) => c.usuarioRef === usuarioRef);
  return com ? com.nombre : usuarioRef;
}

function inicialesUsuario(usuarioRef) {
  return iniciales(nombreUsuario(usuarioRef));
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

  const avisos = avisosDe(tocata.id);

  contenedorPrincipal.append(
    pintarCabecera(tocata, avisos.length),
    pintarFormulario(tocata.id),
    pintarLista(avisos)
  );
}

function pintarCabecera(tocata, total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.mensaje }),
        'Avisos del equipo'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, tocata.nombre)
    ),
    total > 0
      ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(total) })
      : null
  );
}

function pintarFormulario(tocataId) {
  const cont = crearEtiqueta('div', { class: 'aviso-form' });

  const inputTitulo = crearEtiqueta('input', {
    class: 'campo__entrada',
    placeholder: 'Asunto breve (opcional)',
  });
  const inputTexto = crearEtiqueta('textarea', {
    class: 'campo__textarea',
    placeholder: 'Escribe un aviso para el equipo...',
  });
  const btnImportante = crearEtiqueta('label', { class: 'fila', style: { gap: '8px', fontSize: '0.85rem', cursor: 'pointer' } });
  const checkboxImportante = crearEtiqueta('input', { type: 'checkbox' });
  btnImportante.append(checkboxImportante, crearEtiqueta('span', {}, 'Marcar como importante'));

  const acciones = crearEtiqueta('div', { class: 'aviso-form__acciones' });
  const btnEnviar = crearEtiqueta('button', {
    class: 'btn btn--primario btn--chico',
    type: 'button',
    texto: 'Enviar al equipo',
    onclick: () => {
      const texto = inputTexto.value.trim();
      if (!texto) {
        mostrarToast('Falta el mensaje.', 'error');
        return;
      }
      const usuario = obtener('usuarioActual');
      const avisos = obtener('avisos') || [];
      avisos.push({
        id: 'avi_' + Date.now(),
        tocataRef: tocataId,
        titulo: inputTitulo.value.trim() || '',
        mensaje: texto,
        tipo: 'equipo',
        importante: checkboxImportante.checked,
        visibleEnCartelera: false,
        creadoPor: usuario ? usuario.id : 'usr_anon',
        creadoEn: new Date().toISOString(),
      });
      establecer('avisos', [...avisos]);
      emitir('aviso:publicado', { tipo: 'equipo' });
      mostrarToast('Aviso enviado al equipo.');
      pintar();
    },
  });
  acciones.append(btnEnviar);

  cont.append(inputTitulo, inputTexto, btnImportante, acciones);
  return cont;
}

function pintarLista(avisos) {
  const cont = crearEtiqueta('div', { class: 'lista-avisos' });

  if (avisos.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin avisos del equipo'),
        crearEtiqueta('p', {}, 'Cuando alguien publique algo, aparecerá acá.')
      )
    );
    return cont;
  }

  avisos.forEach((a) => {
    const item = crearEtiqueta('div', {
      class: 'aviso' + (a.importante ? ' aviso--importante' : ''),
    });

    const avatar = crearEtiqueta('div', { class: 'avatar avatar--chico', texto: inicialesUsuario(a.creadoPor) });

    const info = crearEtiqueta('div', { class: 'aviso__info' },
      crearEtiqueta('div', { class: 'aviso__cabecera' },
        crearEtiqueta('span', { class: 'aviso__autor', texto: nombreUsuario(a.creadoPor) }),
        crearEtiqueta('span', { class: 'aviso__hora', texto: horaRelativa(a.creadoEn) }),
        a.importante
          ? crearEtiqueta('span', { class: 'pildora pildora--aviso' }, 'Importante')
          : null
      ),
      a.titulo
        ? crearEtiqueta('div', { class: 'aviso__titulo', texto: a.titulo })
        : null,
      crearEtiqueta('div', { class: 'aviso__texto', texto: a.mensaje })
    );

    item.append(avatar, info);
    cont.append(item);
  });

  return cont;
}

function horaRelativa(iso) {
  if (!iso) return '';
  const ahora = Date.now();
  const t = new Date(iso).getTime();
  const dif = Math.floor((ahora - t) / 1000);
  if (dif < 60) return 'hace un momento';
  if (dif < 3600) return 'hace ' + Math.floor(dif / 60) + ' min';
  if (dif < 86400) return 'hace ' + Math.floor(dif / 3600) + ' h';
  return new Date(iso).toLocaleDateString('es-CL');
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--avisos-equipo' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}