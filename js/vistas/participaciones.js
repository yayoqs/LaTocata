/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/participaciones.js
   Versión: 0.1.0
   Propósito: Historial de participaciones del músico. Línea de
              tiempo de tocatas pasadas, con la cantidad de temas
              que tocó en cada una. Al pie, el contador de KYU.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor } from '../nucleo/utils.js';

const ICO = {
  historial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>',
  monedas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
};

let contenedorPrincipal = null;

function perfilMusico() {
  return obtener('musicoPerfil') || null;
}

function participaciones() {
  const perfil = perfilMusico();
  return (perfil && perfil.participaciones) ? perfil.participaciones : [];
}

function kyu() {
  const perfil = perfilMusico();
  return perfil ? (perfil.kyu || 0) : 0;
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const lista = participaciones();

  contenedorPrincipal.append(
    pintarCabecera(lista.length),
    pintarTimeline(lista),
    pintarKyu(kyu())
  );
}

function pintarCabecera(total) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.historial }),
        'Mis participaciones'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Historial de tocatas en las que tocaste.')
    ),
    total > 0
      ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(total) })
      : null
  );
}

function pintarTimeline(lista) {
  const cont = crearEtiqueta('div', { class: 'timeline' });

  if (lista.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Todavía no hay participaciones')
      )
    );
    return cont;
  }

  lista.forEach((p) => {
    cont.append(
      crearEtiqueta('div', { class: 'timeline__nodo' },
        crearEtiqueta('div', { class: 'timeline__fecha', texto: p.fecha }),
        crearEtiqueta('div', { class: 'timeline__nombre', texto: p.nombre }),
        crearEtiqueta('div', { class: 'timeline__meta', texto: p.espacio + ' · ' + p.temas + ' temas' })
      )
    );
  });

  return cont;
}

function pintarKyu(valor) {
  const cont = crearEtiqueta('div', { class: 'tarjeta' });

  cont.append(
    crearEtiqueta('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
      crearEtiqueta('div', { class: 'tarjeta-metrica__icono tarjeta-metrica__icono--aviso', html: ICO.monedas, style: { width: '56px', height: '56px' } }),
      crearEtiqueta('div', { style: { flex: '1' } },
        crearEtiqueta('div', { class: 'tarjeta-metrica__valor', texto: String(valor) }),
        crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta' }, 'KYU acumulados · experimental')
      ),
      crearEtiqueta('div', { class: 'texto-chico texto-suave', style: { maxWidth: '260px', textAlign: 'right' } },
        'El canje de KYU estará disponible próximamente en el ecosistema.'
      )
    )
  );

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--participaciones' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}