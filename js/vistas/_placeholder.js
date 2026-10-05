/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/_placeholder.js
   Versión: 0.1.0
   Propósito: Vista temporal para las pantallas que aún no tienen
              módulo propio. Permite que la navegación de cada
              casa por rol funcione hoy, mientras las vistas se
              portan una a una. Cuando una vista tenga su módulo
              definitivo, se reemplaza en el registro de
              navegacion.js y este placeholder deja de usarse.
   ================================================================ */

import { crearEtiqueta, limpiar as limpiarContenedor } from '../nucleo/utils.js';

let contenedorPrincipal = null;
let tituloActual = '';

export async function activar(contenedor, opciones) {
  tituloActual = (opciones && opciones.titulo) || 'Vista';
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--placeholder' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  contenedorPrincipal.append(
    crearEtiqueta('div', { class: 'vacio', style: { paddingTop: '80px' } },
      crearEtiqueta('div', { class: 'vacio__titulo', style: { fontSize: '1.4rem' } },
        tituloActual
      ),
      crearEtiqueta('p', { class: 'texto-suave', style: { marginTop: '12px', maxWidth: '480px', margin: '12px auto 0' } },
        'Esta vista está en construcción. La navegación por rol ya funciona; el contenido llegará en la próxima tanda.'
      )
    )
  );
}