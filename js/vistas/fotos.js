/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/fotos.js
   Versión: 0.2.0
   Propósito: Galería de fotos por tocata. Los organizadores y
              asistentes suben imágenes. En el prototipo se
              muestran placeholders.
              v0.2.0: se adopta el sistema visual:
                      · .cabecera-seccion para el encabezado
                      · galería con aspect-ratio fija (más limpia)
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  camara: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
};

let contenedorPrincipal = null;

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const tocataActivaId = obtener('tocataActivaId');
  const tocata = (obtener('tocatas') || []).find((t) => t.id === tocataActivaId);

  contenedorPrincipal.append(
    pintarCabecera(tocata),
    pintarGaleria()
  );
}

function pintarCabecera(tocata) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.camara }),
        'Fotos'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, tocata ? tocata.nombre : 'Sin tocata activa')
    ),
    crearEtiqueta('button', {
      class: 'btn btn--primario btn--chico',
      texto: '+ Subir foto',
      onclick: () => mostrarToast('Función disponible en la app final.'),
    })
  );
}

function pintarGaleria() {
  const cont = crearEtiqueta('div', { class: 'fotos__grilla' });

  const colores = ['#a85530', '#4a5c37', '#b8892c', '#3d5a80', '#6b4a7a', '#8a3a4a'];
  for (let i = 0; i < 9; i++) {
    cont.append(
      crearEtiqueta('div', {
        class: 'fotos__placeholder',
        estilo: { background: colores[i % colores.length] },
      },
        crearEtiqueta('span', { texto: '📷' })
      )
    );
  }

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--fotos' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}