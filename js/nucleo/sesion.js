/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/sesion.js
   Versión: 0.2.0
   Propósito: Sesión simulada del prototipo. Sin Appwrite. Fija
              el usuario actual y sus roles activos.
              v0.2.0: el usuario Yayo pasa a tener los seis roles
                      del brief (owner, organizador, staff,
                      musico, anfitrion, publico). El rol activo
                      por defecto sigue siendo organizador, el
                      más operativo del día de la tocata.
              v0.1.0: versión inicial con tres roles.
   ================================================================ */

import { establecer, obtener } from './estado.js';
import { emitir } from './bus-eventos.js';

export async function iniciarSesionSimulada() {
  const usuario = {
    id: 'usr_yayo',
    nombre: 'Eduardo Quilodrán',
    apodo: 'Yayo',
    iniciales: 'YQ',
    email: 'yayoqs@elisekai.com',
    kyu: 340,
    rolesEnTocata: ['owner', 'organizador', 'staff', 'musico', 'anfitrion', 'publico'],
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