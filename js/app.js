/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/app.js
   Versión: 0.1.0
   Propósito: Arranque del prototipo. Monta el shell, aplica
              el tema, inicializa sesión simulada, registra las
              vistas y navega a la vista por defecto.
              v0.1.0: versión inicial del prototipo.
   ================================================================ */

import { montarShell } from './nucleo/navegacion.js';
import { iniciarSesionSimulada } from './nucleo/sesion.js';
import { cargarDatosEjemplo } from './nucleo/datos-ejemplo.js';
import { aplicarTema, leerTemaDeDisco } from './nucleo/temas.js';
import { obtener } from './nucleo/estado.js';
import { al } from './nucleo/bus-eventos.js';

async function principal() {
  const app = document.getElementById('app');
  if (!app) return;

  cargarDatosEjemplo();

  const temaInicial = leerTemaDeDisco() || 'a';
  aplicarTema(temaInicial);

  await iniciarSesionSimulada();

  montarShell(app);

  const usuario = obtener('usuarioActual');
  if (!usuario) {
    console.warn('[LaTocata] Sin usuario, mostrando inicio público.');
  }

  al('tema:cambiado', ({ tema }) => aplicarTema(tema));
}

principal().catch((e) => {
  console.error('[LaTocata] Error fatal:', e);
  const app = document.getElementById('app');
  if (app) app.innerHTML = '<p style="padding:40px;text-align:center">Error al cargar LaTocata: ' + e.message + '</p>';
});