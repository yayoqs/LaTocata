/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/reglas.js
   Versión: 0.1.0
   Propósito: Reglas y condiciones del espacio del anfitrión.
              Se listan las condiciones declaradas en el espacio
              activo, más las típicas de convivencia.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor } from '../nucleo/utils.js';

const ICO = {
  reglas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>',
};

let contenedorPrincipal = null;

function espacioDeLaTocata() {
  const id = obtener('tocataActivaId');
  const tocata = (obtener('tocatas') || []).find((t) => t.id === id);
  if (!tocata) return null;
  return (obtener('espacios') || []).find((e) => e.id === tocata.espacioRef) || null;
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const espacio = espacioDeLaTocata();
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
    pintarReglas(espacio)
  );
}

function pintarCabecera(espacio) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.reglas }),
        'Reglas de ' + espacio.nombre
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Acá se definen los límites del espacio para cada tocata.')
    )
  );
}

function pintarReglas(espacio) {
  const cont = crearEtiqueta('div', {});

  const reglas = [
    { etq: 'Ruido',   titulo: 'Sin amplificadores después de las 23:30', texto: 'Los vecinos conocen la dinámica. Avisar una hora antes si hay cambios.' },
    { etq: 'Aforo',   titulo: 'Máximo ' + espacio.capacidad + ' personas adentro', texto: 'Si se llena, quedan en la entrada o en la vereda.' },
    { etq: 'Jardín',  titulo: 'Cuidar las plantas del rincón', texto: 'Los músicos pueden usar el rincón como escenario, pero sin mover las macetas grandes.' },
    { etq: 'Parrilla', titulo: 'La parrilla se enciende a las 12:00 y se apaga a las 17:00', texto: 'Coordinar con quien esté a cargo de la cocina.' },
    { etq: 'Condiciones específicas', titulo: espacio.condiciones || '—', texto: 'Declaradas por el anfitrión para esta tocata.' },
  ];

  reglas.forEach((r) => {
    cont.append(
      crearEtiqueta('div', { class: 'regla-item' },
        crearEtiqueta('div', { class: 'regla-item__etq', texto: r.etq }),
        crearEtiqueta('div', { class: 'regla-item__titulo', texto: r.titulo }),
        crearEtiqueta('div', { class: 'regla-item__texto', texto: r.texto })
      )
    );
  });

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--reglas' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}