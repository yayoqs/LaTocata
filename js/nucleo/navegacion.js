/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/navegacion.js
   Versión: 0.2.1
   Propósito: Montar el shell (sidebar + topbar + chips + main +
              tabbar), manejar el cambio de vista, el cambio de
              rol y de tema, y la sincronización con la cartelera
              pública.
              v0.2.1: se reemplazan las cinco últimas entradas de
                      placeholder por módulos reales: cartelera-
                      vivo, pub, llegar, admin-roles y gira. Con
                      esto no queda ninguna vista sirviéndose con
                      _placeholder.js en el prototipo.
              v0.2.0: cambio estructural hacia las seis casas por
                      rol. Selector de rol en acordeón, topbar con
                      título y temas circulares.
              v0.1.2: se elimina el saludo personalizado del
                      topbar. Botón hamburguesa y drawer móvil.
              v0.1.1: listener de navegar:solicitada.
              v0.1.0: versión inicial.
   ================================================================ */

import { al, emitir } from './bus-eventos.js';
import { obtener } from './estado.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  buscarTodos,
} from './utils.js';
import { cambiarRol } from './sesion.js';
import { TEMAS, aplicarTema } from './temas.js';
import { sincronizarCartelera } from './sincronizar-cartelera.js';

/* ---------- Importaciones de vistas ---------- */
import * as vistaInicio            from '../vistas/inicio.js';
import * as vistaPanel             from '../vistas/panel-organizador.js';
import * as vistaCola              from '../vistas/cola.js';
import * as vistaEscenario         from '../vistas/escenario.js';
import * as vistaRegistro          from '../vistas/registro-musicos.js';
import * as vistaEspacios          from '../vistas/espacios.js';
import * as vistaComunidad         from '../vistas/comunidad.js';
import * as vistaInventario        from '../vistas/inventario.js';
import * as vistaFotos             from '../vistas/fotos.js';
import * as vistaVotaciones        from '../vistas/votaciones.js';
import * as vistaPerfilMusico      from '../vistas/perfil-musico.js';
import * as vistaPerfilTocata      from '../vistas/perfil-tocata.js';
import * as vistaConfiguracion     from '../vistas/configuracion.js';
import * as vistaTurnos            from '../vistas/turnos.js';
import * as vistaChecklist         from '../vistas/checklist.js';
import * as vistaAvisosEquipo      from '../vistas/avisos-equipo.js';
import * as vistaCaja              from '../vistas/caja.js';
import * as vistaMiEspacio         from '../vistas/mi-espacio.js';
import * as vistaReglas            from '../vistas/reglas.js';
import * as vistaContacto          from '../vistas/contacto.js';
import * as vistaBandas            from '../vistas/bandas.js';
import * as vistaParticipaciones   from '../vistas/participaciones.js';
import * as vistaCarteleraVivo     from '../vistas/cartelera-vivo.js';
import * as vistaPub               from '../vistas/pub.js';
import * as vistaLlegar            from '../vistas/llegar.js';
import * as vistaAdminRoles        from '../vistas/admin-roles.js';
import * as vistaGira              from '../vistas/gira.js';

/* ---------- Iconos (SVG inline) ---------- */

const ICO = {
  panel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  cola: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.4"/><circle cx="4" cy="12" r="1.4"/><circle cx="4" cy="18" r="1.4"/></svg>',
  escenario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6"/><circle cx="12" cy="12" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/><path d="M4 8l2-2M20 8l-2-2"/></svg>',
  registro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>',
  espacios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  comunidad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  inventario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  fotos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  votaciones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  inicio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>',
  ajustes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  replegar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
  hamburguesa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  cartelera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  mensaje: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  dinero: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>',
  ruta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a3 3 0 0 1 3-3h3"/><path d="M3 18a3 3 0 0 0 3 3h3"/><path d="M21 6a3 3 0 0 0-3-3h-3"/><path d="M21 18a3 3 0 0 1-3 3h-3"/><circle cx="12" cy="12" r="3"/></svg>',
  escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  bandas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  historial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>',
  mapa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  casa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  reglas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>',
  llegada: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  afiche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  carteleraVivo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/><circle cx="12" cy="11" r="2"/></svg>',
};

/* ---------- Registro de vistas ----------
   Cada vista declara módulo, título e icono. */

const VISTAS = {
  /* --- Público / compartido --- */
  inicio:            { modulo: vistaInicio,           titulo: 'Inicio',                  icono: ICO.inicio },
  'cartelera-vivo':  { modulo: vistaCarteleraVivo,    titulo: 'Cartelera en vivo',       icono: ICO.carteleraVivo },
  'perfil-tocata':   { modulo: vistaPerfilTocata,     titulo: 'Perfil de tocata',        icono: ICO.afiche },
  pub:               { modulo: vistaPub,              titulo: 'Afiche',                  icono: ICO.afiche },
  llegar:            { modulo: vistaLlegar,           titulo: 'Cómo llegar',             icono: ICO.llegada },

  /* --- Hoy --- */
  panel:             { modulo: vistaPanel,            titulo: 'Panel del organizador',   icono: ICO.panel },
  cola:              { modulo: vistaCola,             titulo: 'Cola de presentaciones',  icono: ICO.cola },
  escenario:         { modulo: vistaEscenario,        titulo: 'Escenario en vivo',       icono: ICO.escenario },

  /* --- Evento --- */
  caja:              { modulo: vistaCaja,             titulo: 'Caja del evento',         icono: ICO.dinero },
  votaciones:        { modulo: vistaVotaciones,       titulo: 'Votaciones',              icono: ICO.votaciones },
  fotos:             { modulo: vistaFotos,            titulo: 'Fotos',                   icono: ICO.fotos },

  /* --- Grupo --- */
  comunidad:         { modulo: vistaComunidad,        titulo: 'Gente',                   icono: ICO.comunidad },
  'admin-roles':     { modulo: vistaAdminRoles,       titulo: 'Roles del grupo',         icono: ICO.escudo },
  espacios:          { modulo: vistaEspacios,         titulo: 'Espacios',                icono: ICO.espacios },
  inventario:        { modulo: vistaInventario,       titulo: 'Equipo',                  icono: ICO.inventario },
  gira:              { modulo: vistaGira,             titulo: 'Gira',                    icono: ICO.ruta },

  /* --- Música --- */
  registro:          { modulo: vistaRegistro,         titulo: 'Registro de músicos',     icono: ICO.registro },

  /* --- Músico --- */
  agenda:            { modulo: vistaPerfilMusico,     titulo: 'Mi agenda',               icono: ICO.calendario },
  bandas:            { modulo: vistaBandas,           titulo: 'Mis bandas',              icono: ICO.bandas },
  participaciones:   { modulo: vistaParticipaciones,  titulo: 'Mis participaciones',     icono: ICO.historial },

  /* --- Staff --- */
  turnos:            { modulo: vistaTurnos,           titulo: 'Mis turnos',              icono: ICO.reloj },
  checklist:         { modulo: vistaChecklist,        titulo: 'Checklist del día',       icono: ICO.check },
  'avisos-equipo':   { modulo: vistaAvisosEquipo,     titulo: 'Avisos del equipo',       icono: ICO.mensaje },

  /* --- Anfitrión --- */
  'mi-espacio':      { modulo: vistaMiEspacio,        titulo: 'Mi espacio',              icono: ICO.casa },
  reglas:            { modulo: vistaReglas,           titulo: 'Reglas',                  icono: ICO.reglas },
  contacto:          { modulo: vistaContacto,         titulo: 'Contacto',                icono: ICO.mensaje },

  /* --- Cuenta --- */
  configuracion:     { modulo: vistaConfiguracion,    titulo: 'Ajustes',                 icono: ICO.ajustes },
};

/* ---------- Casas por rol ---------- */

const CASAS_POR_ROL = {
  owner: {
    icono: '👑',
    saludo: 'Eres dueño del grupo',
    descripcion: 'Tienes control total del colectivo, los roles y las tocatas.',
    inicial: 'panel',
    secciones: [
      { id: 'hoy',     titulo: 'Hoy',     vistas: ['panel', 'cola', 'escenario'] },
      { id: 'evento',  titulo: 'Evento',  vistas: ['caja', 'votaciones', 'fotos'] },
      { id: 'grupo',   titulo: 'Grupo',   vistas: ['comunidad', 'admin-roles', 'espacios', 'inventario', 'gira'] },
      { id: 'musica',  titulo: 'Música',  vistas: ['registro'] },
      { id: 'publico', titulo: 'Público', vistas: ['inicio', 'cartelera-vivo', 'pub'] },
      { id: 'cuenta',  titulo: 'Cuenta',  vistas: ['configuracion'] },
    ],
  },

  organizador: {
    icono: '🎤',
    saludo: 'Llevas la tocata',
    descripcion: 'Organizas el evento, apruebas músicos y cierras la jornada.',
    inicial: 'panel',
    secciones: [
      { id: 'hoy',     titulo: 'Hoy',     vistas: ['panel', 'cola', 'escenario'] },
      { id: 'evento',  titulo: 'Evento',  vistas: ['caja', 'votaciones', 'fotos'] },
      { id: 'grupo',   titulo: 'Grupo',   vistas: ['comunidad', 'espacios', 'inventario', 'gira'] },
      { id: 'musica',  titulo: 'Música',  vistas: ['registro'] },
      { id: 'publico', titulo: 'Público', vistas: ['inicio', 'cartelera-vivo', 'pub'] },
      { id: 'cuenta',  titulo: 'Cuenta',  vistas: ['configuracion'] },
    ],
  },

  staff: {
    icono: '🎛️',
    saludo: 'Estás en la operación',
    descripcion: 'Tus turnos, el checklist del día y los avisos del equipo.',
    inicial: 'panel',
    secciones: [
      { id: 'hoy',      titulo: 'Hoy',      vistas: ['panel', 'cola', 'escenario'] },
      { id: 'turno',    titulo: 'Mi turno', vistas: ['turnos', 'checklist', 'avisos-equipo'] },
      { id: 'recursos', titulo: 'Recursos', vistas: ['inventario', 'espacios'] },
      { id: 'musica',   titulo: 'Música',   vistas: ['registro'] },
      { id: 'publico',  titulo: 'Público',  vistas: ['inicio'] },
    ],
  },

  musico: {
    icono: '🎸',
    saludo: 'Tu música',
    descripcion: 'Tu agenda de tocatas, tus bandas y tus participaciones.',
    inicial: 'agenda',
    secciones: [
      { id: 'musica',    titulo: 'Mi música',  vistas: ['agenda', 'bandas', 'participaciones'] },
      { id: 'anotarme',  titulo: 'Anotarme',   vistas: ['registro'] },
      { id: 'cartelera', titulo: 'Cartelera',  vistas: ['cartelera-vivo', 'inicio', 'pub'] },
    ],
  },

  anfitrion: {
    icono: '🏡',
    saludo: 'Tu espacio',
    descripcion: 'Tu espacio, sus reglas y las tocatas programadas.',
    inicial: 'mi-espacio',
    secciones: [
      { id: 'espacio',   titulo: 'Mi espacio', vistas: ['mi-espacio', 'reglas'] },
      { id: 'tocatas',   titulo: 'Tocatas',    vistas: ['gira'] },
      { id: 'contacto',  titulo: 'Contacto',   vistas: ['contacto'] },
      { id: 'cartelera', titulo: 'Cartelera',  vistas: ['cartelera-vivo', 'inicio'] },
    ],
  },

  publico: {
    icono: '🌅',
    saludo: 'Bienvenido',
    descripcion: 'La tocata de hoy y cómo llegar.',
    inicial: 'cartelera-vivo',
    secciones: [
      { id: 'cartelera', titulo: 'Cartelera', vistas: ['cartelera-vivo', 'inicio', 'pub'] },
      { id: 'llegar',    titulo: 'Llegar',    vistas: ['llegar'] },
      { id: 'votacion',  titulo: 'Votación',  vistas: ['votaciones'] },
    ],
  },
};

const ROLES_NOMBRES = {
  owner: 'Owner',
  organizador: 'Organizador',
  staff: 'Staff',
  musico: 'Músico',
  anfitrion: 'Anfitrión',
  publico: 'Público',
};

/* ---------- Estado del shell ---------- */

let raiz = null;
let vistaActivaId = null;
let vistaActivaModulo = null;
let contenedores = {};
let shellEl = null;
let lateralAbierto = false;
let selectorRolExpandido = false;

/* ---------- Helpers de rol ---------- */

function rolActivo() {
  return obtener('rolActivo') || 'publico';
}

function casaActual() {
  return CASAS_POR_ROL[rolActivo()] || CASAS_POR_ROL.publico;
}

function rolesDisponibles() {
  const usuario = obtener('usuarioActual');
  if (!usuario || !Array.isArray(usuario.rolesEnTocata)) return ['publico'];
  return usuario.rolesEnTocata.filter((r) => CASAS_POR_ROL[r]);
}

function seccionDeVista(idVista, casa) {
  for (const sec of casa.secciones) {
    if (sec.vistas.includes(idVista)) return sec;
  }
  return null;
}

/* ---------- Montaje del shell ---------- */

export function montarShell(app) {
  raiz = app;
  limpiarContenedor(raiz);

  const lateral = crearEtiqueta('aside', { class: 'shell__lateral' });
  const overlay = crearEtiqueta('div', {
    class: 'shell__overlay',
    onclick: () => cerrarLateralMovil(),
  });
  const principal = crearEtiqueta('div', { class: 'shell__principal' });
  const shell = crearEtiqueta('div', { class: 'shell' }, lateral, overlay, principal);
  raiz.append(shell);

  shellEl = shell;
  contenedores = { lateral, overlay, principal, shell };

  construirLateral(lateral);
  construirPrincipal(principal);

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && lateralAbierto) cerrarLateralMovil();
  });

  const casa = casaActual();
  navegar(casa.inicial);

  al('rol:cambiado', () => {
    selectorRolExpandido = false;
    construirLateral(contenedores.lateral);
    const nuevaCasa = casaActual();
    navegar(nuevaCasa.inicial);
  });

  al('navegar:solicitada', ({ vista }) => navegar(vista));

  al('almacen:cambiado', () => sincronizarCartelera());
}

/* ---------- Panel lateral móvil ---------- */

function abrirLateralMovil() {
  if (!shellEl) return;
  shellEl.classList.add('shell--lateral-abierto');
  lateralAbierto = true;
}

function cerrarLateralMovil() {
  if (!shellEl) return;
  shellEl.classList.remove('shell--lateral-abierto');
  lateralAbierto = false;
}

function alternarLateralMovil() {
  if (lateralAbierto) cerrarLateralMovil();
  else abrirLateralMovil();
}

/* ---------- Sidebar completo ---------- */

function construirLateral(lateral) {
  limpiarContenedor(lateral);

  /* --- Marca --- */
  const marca = crearEtiqueta('div', { class: 'shell__marca' },
    crearEtiqueta('div', { class: 'avatar avatar--chico', texto: 'LT' }),
    crearEtiqueta('div', { class: 'shell__marca-titulo' }, 'LaTocata')
  );
  lateral.append(marca);

  /* --- Selector de rol (acordeón) --- */
  lateral.append(construirSelectorRol());

  /* --- Navegación --- */
  const scroll = crearEtiqueta('div', { class: 'shell__lateral-scroll' });
  lateral.append(scroll);

  const casa = casaActual();
  casa.secciones.forEach((sec) => {
    const bloque = crearEtiqueta('div', { class: 'shell__lateral-grupo' });
    bloque.append(
      crearEtiqueta('div', { class: 'shell__lateral-grupo-titulo' }, sec.titulo)
    );

    sec.vistas.forEach((idVista) => {
      const vista = VISTAS[idVista];
      if (!vista) return;
      const item = crearEtiqueta('a', {
        class: 'shell__lateral-item' + (idVista === vistaActivaId ? ' activo' : ''),
        href: '#' + idVista,
        onclick: (ev) => {
          ev.preventDefault();
          cerrarLateralMovil();
          navegar(idVista);
        },
      },
        crearEtiqueta('span', { class: 'shell__lateral-item-icono', html: vista.icono }),
        crearEtiqueta('span', { class: 'shell__lateral-item-label' }, vista.titulo)
      );
      bloque.append(item);
    });

    scroll.append(bloque);
  });

  /* --- Pie: usuario --- */
  const usuario = obtener('usuarioActual');
  const pie = crearEtiqueta('div', { class: 'shell__lateral-pie' });
  if (usuario) {
    pie.append(
      crearEtiqueta('div', { class: 'avatar avatar--chico', texto: usuario.iniciales || '?' }),
      crearEtiqueta('div', { class: 'shell__lateral-item-label', estilo: { fontSize: '0.85rem' } },
        crearEtiqueta('div', { texto: usuario.apodo || usuario.nombre }),
        crearEtiqueta('div', { class: 'texto-suave texto-chico', texto: usuario.kyu + ' KYU' })
      )
    );
  }
  lateral.append(pie);

  /* --- Botón replegar --- */
  const btnReplegar = crearEtiqueta('button', {
    class: 'shell__btn-replegar',
    title: 'Replegar barra lateral',
    html: ICO.replegar,
    onclick: () => {
      shellEl.classList.toggle('replegado');
    },
  });
  lateral.style.position = 'relative';
  lateral.append(btnReplegar);
}

function construirSelectorRol() {
  const roles = rolesDisponibles();
  const cont = crearEtiqueta('div', { class: 'shell__selector-rol' });

  if (roles.length <= 1) {
    return cont;
  }

  const casa = casaActual();
  const rolId = rolActivo();
  const nombre = ROLES_NOMBRES[rolId] || rolId;

  if (selectorRolExpandido) cont.classList.add('expandido');

  const cabecera = crearEtiqueta('button', {
    class: 'shell__selector-rol-cabecera',
    type: 'button',
    onclick: () => {
      selectorRolExpandido = !selectorRolExpandido;
      cont.classList.toggle('expandido', selectorRolExpandido);
    },
  },
    crearEtiqueta('span', { class: 'shell__selector-rol-icono', texto: casa.icono }),
    crearEtiqueta('span', { class: 'shell__selector-rol-info' },
      crearEtiqueta('span', { class: 'shell__selector-rol-eyebrow' }, 'Estás como'),
      crearEtiqueta('span', { class: 'shell__selector-rol-nombre' }, nombre)
    ),
    crearEtiqueta('span', { class: 'shell__selector-rol-flecha' }, '▸')
  );
  cont.append(cabecera);

  const lista = crearEtiqueta('div', { class: 'shell__selector-rol-lista' });
  const inner = crearEtiqueta('div', { class: 'shell__selector-rol-lista-inner' });

  roles.forEach((idRol) => {
    const casaRol = CASAS_POR_ROL[idRol];
    const esActivo = idRol === rolId;
    const item = crearEtiqueta('button', {
      class: 'shell__selector-rol-item' + (esActivo ? ' activo' : ''),
      type: 'button',
      onclick: () => {
        if (idRol === rolId) return;
        cambiarRol(idRol);
      },
    },
      crearEtiqueta('span', { class: 'shell__selector-rol-item-icono', texto: casaRol.icono }),
      crearEtiqueta('span', {}, ROLES_NOMBRES[idRol] || idRol)
    );
    inner.append(item);
  });

  lista.append(inner);
  cont.append(lista);
  return cont;
}

/* ---------- Principal (topbar + chips + main + tabbar) ---------- */

function construirPrincipal(principal) {
  limpiarContenedor(principal);

  const topbar = crearEtiqueta('div', { class: 'shell__topbar' });
  const chips = crearEtiqueta('nav', { class: 'shell__chips' });
  const main = crearEtiqueta('main', { id: 'vistas' });
  const tabbar = crearEtiqueta('nav', { class: 'shell__tabbar' });

  principal.append(topbar, chips, main, tabbar);

  contenedores.topbar = topbar;
  contenedores.chips = chips;
  contenedores.main = main;
  contenedores.tabbar = tabbar;

  construirTopbar(topbar);
  construirTabbar(tabbar);
}

function construirTopbar(topbar) {
  limpiarContenedor(topbar);

  const btnHamburguesa = crearEtiqueta('button', {
    class: 'shell__btn-hamburguesa',
    type: 'button',
    'aria-label': 'Abrir menú',
    html: ICO.hamburguesa,
    onclick: alternarLateralMovil,
  });

  const casa = casaActual();
  const sec = seccionDeVista(vistaActivaId, casa);
  const vista = VISTAS[vistaActivaId];
  const eyebrowTexto = sec ? sec.titulo : '—';
  const tituloTexto = vista ? vista.titulo : '—';

  const zonaTitulo = crearEtiqueta('div', { class: 'shell__titulo-zona' },
    crearEtiqueta('div', { class: 'shell__eyebrow', texto: eyebrowTexto }),
    crearEtiqueta('div', { class: 'shell__titulo', texto: tituloTexto })
  );

  const zonaTemas = crearEtiqueta('div', { class: 'shell__temas' });
  const temaActual = document.body.getAttribute('data-tema');
  TEMAS.forEach((t) => {
    zonaTemas.append(
      crearEtiqueta('button', {
        class: 'shell__tema' + (t.id === temaActual ? ' activo' : ''),
        type: 'button',
        title: t.nombre,
        'data-tema-btn': t.id,
        onclick: () => {
          aplicarTema(t.id);
          construirTopbar(topbar);
        },
      })
    );
  });

  const btnCartelera = crearEtiqueta('a', {
    class: 'btn btn--secundario btn--chico',
    href: 'cartelera.html',
    target: '_blank',
    html: ICO.cartelera,
    title: 'Abrir cartelera pública',
  });

  const izquierda = crearEtiqueta('div', { class: 'fila crecer' }, btnHamburguesa, zonaTitulo);
  const derecha = crearEtiqueta('div', { class: 'fila' }, zonaTemas, btnCartelera);
  topbar.append(izquierda, derecha);
}

function construirTabbar(tabbar) {
  limpiarContenedor(tabbar);
  const casa = casaActual();

  casa.secciones.forEach((sec) => {
    const primeraVista = sec.vistas[0];
    const vista = VISTAS[primeraVista];
    if (!vista) return;

    const esActiva = seccionDeVista(vistaActivaId, casa)?.id === sec.id;

    const tab = crearEtiqueta('button', {
      class: 'shell__tab' + (esActiva ? ' activo' : ''),
      type: 'button',
      onclick: () => navegar(primeraVista),
    },
      crearEtiqueta('span', { class: 'shell__tab-icono', html: vista.icono }),
      crearEtiqueta('span', { texto: sec.titulo })
    );
    tabbar.append(tab);
  });
}

/* ---------- Navegación entre vistas ---------- */

export async function navegar(idVista) {
  const vista = VISTAS[idVista];
  if (!vista) {
    console.warn('[LaTocata] Vista desconocida:', idVista);
    return;
  }

  if (vistaActivaModulo && typeof vistaActivaModulo.limpiar === 'function') {
    try { vistaActivaModulo.limpiar(); } catch (e) { console.error(e); }
  }

  buscarTodos('.shell__lateral-item', contenedores.lateral).forEach((el) => {
    el.classList.toggle('activo', el.getAttribute('href') === '#' + idVista);
  });

  limpiarContenedor(contenedores.main);

  vistaActivaId = idVista;
  vistaActivaModulo = vista.modulo;

  try {
    await vista.modulo.activar(contenedores.main);
  } catch (e) {
    console.error('[LaTocata] Error al activar vista', idVista, e);
    contenedores.main.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'No pudimos cargar esta vista'),
        crearEtiqueta('p', {}, e.message)
      )
    );
  }

  pintarChips();
  construirTopbar(contenedores.topbar);
  construirTabbar(contenedores.tabbar);
  emitir('vista:cambiada', { vista: idVista });
}

function pintarChips() {
  const chips = contenedores.chips;
  limpiarContenedor(chips);

  const casa = casaActual();
  const sec = seccionDeVista(vistaActivaId, casa);

  if (!sec || sec.vistas.length <= 1) {
    chips.hidden = true;
    return;
  }

  chips.hidden = false;
  sec.vistas.forEach((idVista) => {
    const vista = VISTAS[idVista];
    if (!vista) return;
    const chip = crearEtiqueta('button', {
      class: 'shell__chip' + (idVista === vistaActivaId ? ' activo' : ''),
      type: 'button',
      texto: vista.titulo,
      onclick: () => navegar(idVista),
    });
    chips.append(chip);
  });
}

/* ---------- API pública ---------- */

export function obtenerVistaActiva() {
  return vistaActivaId;
}

export function obtenerCasaActual() {
  return casaActual();
}