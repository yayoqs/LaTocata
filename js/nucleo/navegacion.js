/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/navegacion.js
   Versión: 0.1.2
   Propósito: Montar el shell (sidebar + topbar + chips + main +
              tabbar), manejar el cambio de vista, el cambio de
              rol y de tema, y la sincronización con la cartelera
              pública.
              v0.1.2: se elimina el saludo personalizado del
                      topbar. El título ahora es siempre "LaTocata".
                      Se agrega botón hamburguesa para abrir la
                      barra lateral como panel deslizante en móvil,
                      con overlay de fondo, cierre al tocar el velo,
                      cierre al navegar, y cierre con Escape.
              v0.1.1: se agrega el listener de 'navegar:solicitada'.
              v0.1.0: versión inicial.
   ================================================================ */

import { al, emitir } from './bus-eventos.js';
import { obtener, establecer } from './estado.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  buscarTodos,
} from './utils.js';
import { cambiarRol } from './sesion.js';
import { TEMAS, aplicarTema } from './temas.js';
import { sincronizarCartelera } from './sincronizar-cartelera.js';

import * as vistaInicio from '../vistas/inicio.js';
import * as vistaPanel from '../vistas/panel-organizador.js';
import * as vistaCola from '../vistas/cola.js';
import * as vistaEscenario from '../vistas/escenario.js';
import * as vistaRegistro from '../vistas/registro-musicos.js';
import * as vistaEspacios from '../vistas/espacios.js';
import * as vistaComunidad from '../vistas/comunidad.js';
import * as vistaInventario from '../vistas/inventario.js';
import * as vistaFotos from '../vistas/fotos.js';
import * as vistaVotaciones from '../vistas/votaciones.js';
import * as vistaPerfilMusico from '../vistas/perfil-musico.js';
import * as vistaPerfilTocata from '../vistas/perfil-tocata.js';
import * as vistaConfiguracion from '../vistas/configuracion.js';

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
  perfil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6"/></svg>',
  inicio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>',
  ajustes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  replegar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
  hamburguesa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  paleta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/><circle cx="9" cy="15" r="1.5" fill="currentColor"/><circle cx="15" cy="15" r="1.5" fill="currentColor"/></svg>',
  cartelera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>',
};

/* ---------- Registro de vistas ---------- */

const VISTAS = {
  inicio: {
    modulo: vistaInicio,
    titulo: 'Inicio',
    grupo: 'publico',
    icono: ICO.inicio,
    roles: null,
  },
  panel: {
    modulo: vistaPanel,
    titulo: 'Panel del organizador',
    grupo: 'hoy',
    icono: ICO.panel,
    roles: ['organizador', 'admin', 'owner'],
  },
  cola: {
    modulo: vistaCola,
    titulo: 'Cola de presentaciones',
    grupo: 'hoy',
    icono: ICO.cola,
    roles: ['organizador', 'staff', 'admin', 'owner'],
  },
  escenario: {
    modulo: vistaEscenario,
    titulo: 'Escenario',
    grupo: 'hoy',
    icono: ICO.escenario,
    roles: ['organizador', 'staff', 'admin', 'owner'],
  },
  registro: {
    modulo: vistaRegistro,
    titulo: 'Registro de músicos',
    grupo: 'musica',
    icono: ICO.registro,
    roles: ['organizador', 'staff', 'musico', 'admin', 'owner'],
  },
  'perfil-musico': {
    modulo: vistaPerfilMusico,
    titulo: 'Mi música',
    grupo: 'musica',
    icono: ICO.perfil,
    roles: ['organizador', 'staff', 'musico', 'admin', 'owner'],
  },
  espacios: {
    modulo: vistaEspacios,
    titulo: 'Espacios',
    grupo: 'grupo',
    icono: ICO.espacios,
    roles: ['organizador', 'anfitrion', 'admin', 'owner'],
  },
  comunidad: {
    modulo: vistaComunidad,
    titulo: 'Comunidad',
    grupo: 'grupo',
    icono: ICO.comunidad,
    roles: ['organizador', 'staff', 'musico', 'anfitrion', 'admin', 'owner'],
  },
  inventario: {
    modulo: vistaInventario,
    titulo: 'Inventario',
    grupo: 'grupo',
    icono: ICO.inventario,
    roles: ['organizador', 'staff', 'anfitrion', 'admin', 'owner'],
  },
  fotos: {
    modulo: vistaFotos,
    titulo: 'Fotos',
    grupo: 'grupo',
    icono: ICO.fotos,
    roles: ['organizador', 'staff', 'musico', 'admin', 'owner'],
  },
  votaciones: {
    modulo: vistaVotaciones,
    titulo: 'Votaciones y concursos',
    grupo: 'grupo',
    icono: ICO.votaciones,
    roles: ['organizador', 'admin', 'owner'],
  },
  'perfil-tocata': {
    modulo: vistaPerfilTocata,
    titulo: 'Perfil de tocata',
    grupo: 'publico',
    icono: ICO.panel,
    roles: null,
    oculta: true,
  },
  configuracion: {
    modulo: vistaConfiguracion,
    titulo: 'Ajustes',
    grupo: 'cuenta',
    icono: ICO.ajustes,
    roles: ['admin', 'owner'],
  },
};

const GRUPOS = {
  hoy: { titulo: 'Hoy', orden: 1 },
  musica: { titulo: 'Música', orden: 2 },
  grupo: { titulo: 'Grupo', orden: 3 },
  publico: { titulo: 'Público', orden: 4 },
  cuenta: { titulo: 'Cuenta', orden: 5 },
};

/* ---------- Estado del shell ---------- */

let raiz = null;
let vistaActivaId = null;
let vistaActivaModulo = null;
let contenedores = {};
let shellEl = null;
let lateralAbierto = false;

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
  contenedores = { lateral, overlay, principal };

  construirLateral(lateral);
  construirPrincipal(principal);

  // Cerrar con Escape si el panel móvil está abierto.
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && lateralAbierto) cerrarLateralMovil();
  });

  const rol = obtener('rolActivo');
  const vistaPorDefecto = vistaInicialParaRol(rol);
  navegar(vistaPorDefecto);

  al('rol:cambiado', () => {
    construirLateral(contenedores.lateral);
    construirTopbar(contenedores.topbar);
    construirTabbar(contenedores.tabbar);
    const nuevaVista = vistaInicialParaRol(obtener('rolActivo'));
    navegar(nuevaVista);
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

/* ---------- Lateral (sidebar) ---------- */

function construirLateral(lateral) {
  limpiarContenedor(lateral);

  const grupo = obtener('grupo');
  const usuario = obtener('usuarioActual');
  const rolActivo = obtener('rolActivo');

  const marca = crearEtiqueta('div', { class: 'shell__marca' },
    crearEtiqueta('div', { class: 'avatar avatar--chico', texto: 'LT' }),
    crearEtiqueta('div', { class: 'shell__marca-titulo' }, 'LaTocata')
  );
  lateral.append(marca);

  if (grupo) {
    lateral.append(
      crearEtiqueta('div', { class: 'shell__lateral-grupo-titulo', estilo: { padding: '0 24px 8px' } },
        grupo.nombre
      )
    );
  }

  const scroll = crearEtiqueta('div', { class: 'shell__lateral-scroll' });
  lateral.append(scroll);

  const gruposConVistas = agruparVistasPorGrupo(rolActivo);

  Object.keys(GRUPOS)
    .sort((a, b) => GRUPOS[a].orden - GRUPOS[b].orden)
    .forEach((idGrupo) => {
      const vistas = gruposConVistas[idGrupo];
      if (!vistas || vistas.length === 0) return;

      const bloque = crearEtiqueta('div', { class: 'shell__lateral-grupo' });
      bloque.append(
        crearEtiqueta('div', { class: 'shell__lateral-grupo-titulo' }, GRUPOS[idGrupo].titulo)
      );

      vistas.forEach((idVista) => {
        const vista = VISTAS[idVista];
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

  // Botón replegar: solo tiene sentido en escritorio.
  const btnReplegar = crearEtiqueta('button', {
    class: 'shell__btn-replegar',
    title: 'Replegar barra lateral',
    html: ICO.replegar,
    onclick: () => {
      const shell = raiz.querySelector('.shell');
      shell.classList.toggle('replegado');
    },
  });
  lateral.style.position = 'relative';
  lateral.append(btnReplegar);
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

  const usuario = obtener('usuarioActual');
  const rolActivo = obtener('rolActivo');

  // Botón hamburguesa: solo visible en móvil por CSS.
  const btnHamburguesa = crearEtiqueta('button', {
    class: 'shell__btn-hamburguesa',
    type: 'button',
    'aria-label': 'Abrir menú',
    html: ICO.hamburguesa,
    onclick: alternarLateralMovil,
  });

  const zonaTitulo = crearEtiqueta('div', { class: 'shell__titulo-zona' },
    crearEtiqueta('div', { class: 'shell__eyebrow', texto: 'Grupo activo' }),
    crearEtiqueta('div', { class: 'shell__titulo', texto: 'LaTocata' })
  );

  const zonaRol = crearEtiqueta('div', { class: 'shell__roles' });
  if (usuario && Array.isArray(usuario.rolesEnTocata) && usuario.rolesEnTocata.length > 1) {
    usuario.rolesEnTocata.forEach((rol) => {
      const btn = crearEtiqueta('button', {
        class: 'shell__rol' + (rol === rolActivo ? ' activo' : ''),
        type: 'button',
        texto: capitalizar(rol),
        onclick: () => cambiarRol(rol),
      });
      zonaRol.append(btn);
    });
  }

  const zonaAcciones = crearEtiqueta('div', { class: 'fila' });

  const btnTema = crearEtiqueta('button', {
    class: 'btn btn--fantasma btn--chico',
    title: 'Cambiar tema',
    html: ICO.paleta,
    onclick: () => abrirSelectorTema(),
  });
  zonaAcciones.append(btnTema);

  const btnCartelera = crearEtiqueta('a', {
    class: 'btn btn--secundario btn--chico',
    href: 'cartelera.html',
    target: '_blank',
    html: ICO.cartelera + ' <span class="shell__label-cartelera">Cartelera</span>',
    estilo: { gap: '6px' },
  });
  zonaAcciones.append(btnCartelera);

  const izquierda = crearEtiqueta('div', { class: 'fila crecer' }, btnHamburguesa, zonaTitulo);
  const derecha = crearEtiqueta('div', { class: 'fila' }, zonaRol, zonaAcciones);
  topbar.append(izquierda, derecha);
}

function construirTabbar(tabbar) {
  limpiarContenedor(tabbar);
  const rolActivo = obtener('rolActivo');

  const accesos = accesosPorRol(rolActivo);

  accesos.forEach((idVista) => {
    const vista = VISTAS[idVista];
    if (!vista) return;
    const tab = crearEtiqueta('button', {
      class: 'shell__tab' + (idVista === vistaActivaId ? ' activo' : ''),
      type: 'button',
      onclick: () => navegar(idVista),
    },
      crearEtiqueta('span', { class: 'shell__tab-icono', html: vista.icono }),
      crearEtiqueta('span', { texto: vista.titulo.split(' ')[0] })
    );
    tabbar.append(tab);
  });
}

/* ---------- Navegación entre vistas ---------- */

export async function navegar(idVista) {
  if (!VISTAS[idVista]) return;

  const vista = VISTAS[idVista];
  const rolActivo = obtener('rolActivo');

  if (vista.roles && rolActivo && !vista.roles.includes(rolActivo) && !['admin', 'owner'].includes(rolActivo)) {
    console.warn('[LaTocata] Acceso denegado a', idVista, 'con rol', rolActivo);
    return;
  }

  if (vistaActivaModulo && typeof vistaActivaModulo.limpiar === 'function') {
    try { vistaActivaModulo.limpiar(); } catch (e) { console.error(e); }
  }

  buscarTodos('.shell__lateral-item', contenedores.lateral).forEach((el) => {
    el.classList.toggle('activo', el.getAttribute('href') === '#' + idVista);
  });

  buscarTodos('.shell__tab', contenedores.tabbar).forEach((el) => el.classList.remove('activo'));

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

  pintarChips(vista.grupo);
  emitir('vista:cambiada', { vista: idVista });
}

function pintarChips(grupoId) {
  const chips = contenedores.chips;
  limpiarContenedor(chips);

  if (!grupoId) {
    chips.hidden = true;
    return;
  }

  const rolActivo = obtener('rolActivo');
  const vistasDelGrupo = Object.keys(VISTAS).filter((id) => {
    const v = VISTAS[id];
    if (v.grupo !== grupoId) return false;
    if (v.oculta) return false;
    if (v.roles && rolActivo && !v.roles.includes(rolActivo) && !['admin', 'owner'].includes(rolActivo)) return false;
    return true;
  });

  if (vistasDelGrupo.length <= 1) {
    chips.hidden = true;
    return;
  }

  chips.hidden = false;
  vistasDelGrupo.forEach((id) => {
    const chip = crearEtiqueta('button', {
      class: 'shell__chip' + (id === vistaActivaId ? ' activo' : ''),
      type: 'button',
      texto: VISTAS[id].titulo,
      onclick: () => navegar(id),
    });
    chips.append(chip);
  });
}

/* ---------- Helpers ---------- */

function agruparVistasPorGrupo(rolActivo) {
  const grupos = {};
  Object.keys(VISTAS).forEach((id) => {
    const v = VISTAS[id];
    if (v.oculta) return;
    if (v.roles && rolActivo && !v.roles.includes(rolActivo) && !['admin', 'owner'].includes(rolActivo)) return;
    if (!grupos[v.grupo]) grupos[v.grupo] = [];
    grupos[v.grupo].push(id);
  });
  return grupos;
}

function vistaInicialParaRol(rol) {
  if (rol === 'organizador' || rol === 'admin' || rol === 'owner') return 'panel';
  if (rol === 'staff') return 'cola';
  if (rol === 'musico') return 'perfil-musico';
  if (rol === 'anfitrion') return 'espacios';
  return 'inicio';
}

function accesosPorRol(rol) {
  if (rol === 'organizador' || rol === 'admin' || rol === 'owner') {
    return ['panel', 'cola', 'escenario', 'registro', 'inicio'];
  }
  if (rol === 'staff') return ['cola', 'escenario', 'inventario', 'inicio'];
  if (rol === 'musico') return ['perfil-musico', 'registro', 'inicio'];
  if (rol === 'anfitrion') return ['espacios', 'inventario', 'inicio'];
  return ['inicio'];
}

function capitalizar(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* ---------- Selector de tema ---------- */

function abrirSelectorTema() {
  const overlay = crearEtiqueta('div', { class: 'modal' });
  const caja = crearEtiqueta('div', { class: 'modal__caja' });

  const cab = crearEtiqueta('div', { class: 'modal__cabecera' },
    crearEtiqueta('div', { class: 'modal__titulo' }, 'Elegir tema visual'),
    crearEtiqueta('button', { class: 'btn btn--fantasma btn--chico', texto: '✕', onclick: () => overlay.remove() })
  );

  const cuerpo = crearEtiqueta('div', { class: 'modal__cuerpo' });
  TEMAS.forEach((t) => {
    const actual = document.body.getAttribute('data-tema') === t.id;
    cuerpo.append(
      crearEtiqueta('button', {
        class: 'btn ' + (actual ? 'btn--primario' : 'btn--secundario'),
        estilo: { width: '100%', justifyContent: 'flex-start', marginBottom: '8px' },
        onclick: () => {
          aplicarTema(t.id);
          overlay.remove();
        },
      },
        crearEtiqueta('div', { estilo: { textAlign: 'left' } },
          crearEtiqueta('div', { estilo: { fontWeight: 600 }, texto: t.nombre }),
          crearEtiqueta('div', { class: 'texto-chico', estilo: { opacity: 0.8 }, texto: t.descripcion })
        )
      )
    );
  });

  caja.append(cab, cuerpo);
  overlay.append(caja);
  document.body.append(overlay);

  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) overlay.remove();
  });
}

/* ---------- API pública ---------- */

export function obtenerVistaActiva() { return vistaActivaId; }