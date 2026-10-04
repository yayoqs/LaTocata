/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/votaciones.js
   Versión: 0.2.0
   Propósito: Votaciones y concursos. Crear, activar, cerrar y ver
              resultados.
              v0.2.0: se adopta el sistema visual:
                      · .cabecera-seccion para el encabezado
                      · .tarjeta-accion para cada votación
                      · .pildora para el estado
                      · .pildora para las opciones listadas
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
};

let contenedorPrincipal = null;

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const votaciones = obtener('votaciones') || [];

  contenedorPrincipal.append(
    pintarCabecera(),
    votaciones.length === 0 ? pintarVacio() : pintarLista(votaciones)
  );
}

function pintarCabecera() {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.check }),
        'Votaciones y concursos'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Lanza votaciones para tu tocata o concursos globales del grupo.')
    ),
    crearEtiqueta('button', {
      class: 'btn btn--primario btn--chico',
      texto: '+ Nueva votación',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    })
  );
}

function pintarVacio() {
  return crearEtiqueta('div', { class: 'vacio' },
    crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin votaciones activas'),
    crearEtiqueta('p', {}, 'Crea una votación para que el público elija al mejor acto, o un concurso con premio.')
  );
}

function pintarLista(votaciones) {
  const cont = crearEtiqueta('div', { class: 'grilla grilla--2' });

  votaciones.forEach((v) => {
    cont.append(construirVotacion(v));
  });

  return cont;
}

function construirVotacion(v) {
  const cont = crearEtiqueta('div', { class: 'tarjeta' });

  const estadoCfg = {
    borrador: { variante: 'neutral', texto: 'Borrador' },
    activa: { variante: 'exito', vivo: true, texto: 'Activa' },
    cerrada: { variante: 'info', texto: 'Cerrada' },
  }[v.estado] || { variante: 'neutral', texto: v.estado };

  const pildoraClases = ['pildora', `pildora--${estadoCfg.variante}`];
  if (estadoCfg.vivo) pildoraClases.push('pildora--vivo');

  const pildoraHijos = [];
  if (estadoCfg.vivo) pildoraHijos.push(crearEtiqueta('span', { class: 'pildora__punto' }));
  pildoraHijos.push(estadoCfg.texto);

  cont.append(
    crearEtiqueta('header', { class: 'tarjeta__cabecera' },
      crearEtiqueta('div', {},
        crearEtiqueta('div', { class: 'tarjeta__titulo', texto: v.titulo }),
        v.descripcion ? crearEtiqueta('div', { class: 'tarjeta__subtitulo', texto: v.descripcion }) : null
      ),
      crearEtiqueta('span', { class: pildoraClases.join(' ') }, ...pildoraHijos)
    )
  );

  if ((v.opciones || []).length > 0) {
    const opciones = crearEtiqueta('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' } });
    v.opciones.forEach((o) => {
      opciones.append(
        crearEtiqueta('span', { class: 'pildora pildora--neutral', texto: o.titulo })
      );
    });
    cont.append(opciones);
  }

  const pie = crearEtiqueta('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } });
  if (v.soloPresentes) {
    pie.append(crearEtiqueta('span', { class: 'texto-chico texto-suave' }, '🔒 Solo presentes'));
  }
  if (v.premio) {
    pie.append(crearEtiqueta('span', { class: 'pildora pildora--aviso', texto: '🎁 ' + v.premio }));
  }
  if (v.premioKyu) {
    pie.append(crearEtiqueta('span', { class: 'pildora pildora--acento', texto: v.premioKyu + ' KYU' }));
  }
  cont.append(pie);

  const acciones = crearEtiqueta('div', { style: { display: 'flex', gap: '8px', marginTop: '14px' } });
  if (v.estado === 'borrador') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--primario btn--chico',
        texto: 'Activar',
        onclick: () => cambiarEstado(v.id, 'activa'),
      })
    );
  } else if (v.estado === 'activa') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--secundario btn--chico',
        texto: 'Cerrar votación',
        onclick: () => cambiarEstado(v.id, 'cerrada'),
      })
    );
  }
  cont.append(acciones);

  return cont;
}

function cambiarEstado(id, estado) {
  const votaciones = obtener('votaciones') || [];
  const idx = votaciones.findIndex((v) => v.id === id);
  if (idx < 0) return;
  votaciones[idx].estado = estado;
  establecer('votaciones', [...votaciones]);
  mostrarToast(estado === 'activa' ? 'Votación activada.' : 'Votación cerrada.');
  pintar();
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--votaciones' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}