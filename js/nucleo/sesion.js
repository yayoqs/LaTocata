/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/sesion.js
   Versión: 0.1.0
   Propósito: Sesión simulada del prototipo. Sin Appwrite. Fija
              el usuario actual y sus roles activos. La sesión se
              puede cambiar desde el selector de rol.
   ================================================================ */

import { establecer, obtener } from './estado.js';
import { emitir } from './bus-eventos.js';

export async function iniciarSesionSimulada() {
  // Usuario del prototipo: Yayo. Tiene tres roles en la tocata
  // activa. El selector permite alternar.
  const usuario = {
    id: 'usr_yayo',
    nombre: 'Eduardo Quilodrán',
    apodo: 'Yayo',
    iniciales: 'YQ',
    email: 'yayoqs@elisekai.com',
    kyu: 340,
    rolesEnTocata: ['organizador', 'anfitrion', 'musico'],
    rolActivo: 'organizador',
  };

  establecer('usuarioActual', usuario);
  establecer('rolActivo', usuario.rolActivo);
  emitir('sesion:iniciada', usuario);
  return usuario;
}

export function cambiarRol(rol) {
  const usuario = obtener('usuarioActual');
  if (!usuario) return;
  if (!usuario.rolesEnTocata.includes(rol)) return;
  usuario.rolActivo = rol;
  establecer('usuarioActual', { ...usuario });
  establecer('rolActivo', rol);
  emitir('rol:cambiado', { rol });
}

export function cerrarSesionSimulada() {
  establecer('usuarioActual', null);
  establecer('rolActivo', null);
  emitir('sesion:cerrada');
}