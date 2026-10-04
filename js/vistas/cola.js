/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/cola.js
   Versión: 0.3.0
   Propósito: Cola de presentaciones. El organizador reordena,
              aprueba, inicia, termina y salta actos. Incluye
              cronómetro en vivo del acto actual y pausa de la
              cola.
              v0.3.0: se agrega un buscador arriba con atajo Ctrl+K
                      para filtrar actos por nombre, género o
                      instrumento. Se aplica además del filtro de
                      estado. El buscador no cambia el filtro de
                      pestañas; ambos coexisten.
              v0.2.0: se adopta el sistema visual (píldoras, etc.).
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { emitir, al } from '../nucleo/bus-eventos.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  segundosADigital,
  atajoBusqueda,
  mostrarToast,
} from '../nucleo/utils.js';

const ICO = {
  buscar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
};

let raiz = null;
let contenedorPrincipal = null;
let filtroActivo = 'todos';
let termino = '';
let intervaloCronometro = null;
let limpiarSuscripcion = null;
let limpiarAtajo = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function actosDe(tocataId) {
  return (obtener('actos') || [])
    .filter((a) => a.tocataRef === tocataId)
    .sort((a, b) => a.ordenCola - b.ordenCola);
}

function filtrarActos(actos, filtro, termino) {
  let resultado = actos;
  if (filtro !== 'todos') {
    if (filtro === 'pendientes') {
      resultado = resultado.filter((a) => a.estado === 'aprobado' || a.estado === 'anotado');
    } else if (filtro === 'terminados') {
      resultado = resultado.filter((a) => a.estado === 'terminado');
    } else if (filtro === 'saltados') {
      resultado = resultado.filter((a) => a.estado === 'saltado' || a.estado === 'no_llego');
    }
  }
  if (termino) {
    const t = termino.toLowerCase();
    resultado = resultado.filter((a) =>
      (a.nombreArtistico || '').toLowerCase().includes(t) ||
      (a.genero || '').toLowerCase().includes(t) ||
      (a.instrumentos || []).some((ins) => ins.toLowerCase().includes(t))
    );
  }
  return resultado;
}

/* ---------- Pintado ---------- */

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const tocata = tocataActiva();
  if (!tocata) {
    contenedorPrincipal.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin tocata activa')
      )
    );
    return;
  }

  contenedorPrincipal.append(
    pintarCabecera(tocata),
    pintarBarraEstado(tocata),
    pintarBarraControl(),
    pintarLista(tocata)
  );

  const entrada = document.getElementById('cola-buscar');
  if (entrada) {
    if (limpiarAtajo) limpiarAtajo();
    limpiarAtajo = atajoBusqueda(entrada);
  }

  iniciarCronometroSiHaceFalta();
}

function pintarCabecera(tocata) {
  return crearEtiqueta('header', { class: 'cabecera-seccion', style: { marginBottom: '20px' } },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cola__titulo', texto: 'Cola de presentaciones' }),
      crearEtiqueta('p', { class: 'texto-suave', texto: tocata.nombre })
    ),
    crearEtiqueta('button', {
      class: 'btn btn--secundario',
      texto: '+ Anotar acto',
      onclick: () => emitir('navegar:solicitada', { vista: 'registro' }),
    })
  );
}

function pintarBarraEstado(tocata) {
  const actos = actosDe(tocata.id);
  const enCurso = actos.find((a) => a.estado === 'en_curso');
  const pendientes = actos.filter((a) => a.estado === 'aprobado');

  const cont = crearEtiqueta('section', { class: 'cola__estado' });

  if (enCurso) {
    cont.append(
      crearEtiqueta('div', { class: 'cola__estado-info' },
        crearEtiqueta('span', { class: 'pildora pildora--exito pildora--vivo' },
          crearEtiqueta('span', { class: 'pildora__punto' }),
          'En vivo'
        ),
        crearEtiqueta('span', { class: 'cola__estado-nombre', texto: enCurso.nombreArtistico })
      )
    );
    cont.append(
      crearEtiqueta('div', { class: 'cola__estado-tiempo' },
        crearEtiqueta('span', { id: 'cola-cronometro', class: 'cola__cronometro', texto: '00:00' }),
        crearEtiqueta('span', { class: 'texto-suave texto-chico', texto: 'en escenario' })
      )
    );
  } else if (tocata.estado === 'pausada') {
    cont.append(
      crearEtiqueta('div', { class: 'cola__estado-info' },
        crearEtiqueta('span', { class: 'pildora pildora--aviso' }, 'Pausada'),
        crearEtiqueta('span', { class: 'texto-suave', texto: pendientes.length + ' actos en espera' })
      )
    );
  } else {
    cont.append(
      crearEtiqueta('div', { class: 'cola__estado-info' },
        crearEtiqueta('span', { class: 'pildora pildora--neutral' }, 'Sin acto en curso'),
        crearEtiqueta('span', { class: 'texto-suave', texto: pendientes.length + ' actos en espera' })
      )
    );
  }

  const acciones = crearEtiqueta('div', { class: 'cola__estado-acciones' });

  if (tocata.estado === 'pausada') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--primario btn--chico',
        texto: '▶ Reanudar cola',
        onclick: () => {
          cambiarEstadoTocata(tocata.id, 'en_curso');
          mostrarToast('Cola reanudada.');
        },
      })
    );
  } else if (tocata.estado === 'en_curso') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--secundario btn--chico',
        texto: '⏸ Pausar cola',
        onclick: () => {
          cambiarEstadoTocata(tocata.id, 'pausada');
          mostrarToast('Cola pausada.');
        },
      })
    );
  }

  cont.append(acciones);
  return cont;
}

function pintarBarraControl() {
  const cont = crearEtiqueta('div', { class: 'cola__barra' });

  const filtros = [
    { id: 'todos', etiqueta: 'Todos' },
    { id: 'pendientes', etiqueta: 'Pendientes' },
    { id: 'terminados', etiqueta: 'Terminados' },
    { id: 'saltados', etiqueta: 'Saltados' },
  ];

  const chips = crearEtiqueta('div', { class: 'cola__filtros' });
  filtros.forEach((f) => {
    chips.append(
      crearEtiqueta('button', {
        class: 'cola__filtro' + (filtroActivo === f.id ? ' activo' : ''),
        texto: f.etiqueta,
        onclick: () => {
          filtroActivo = f.id;
          const filtrados = filtrarActos(actosDe(tocataActiva().id), filtroActivo, termino);
          const contenedor = contenedorPrincipal.querySelector('.cola__lista-contenedor');
          if (contenedor) {
            limpiarContenedor(contenedor);
            contenedor.append(pintarItems(filtrados));
          }
          // Actualizar chips
          chips.querySelectorAll('.cola__filtro').forEach((btn, idx) => {
            btn.classList.toggle('activo', filtros[idx].id === filtroActivo);
          });
        },
      })
    );
  });

  const buscador = crearEtiqueta('div', { class: 'buscador', style: { maxWidth: '320px' } },
    crearEtiqueta('span', { class: 'buscador__icono', html: ICO.buscar }),
    crearEtiqueta('input', {
      class: 'buscador__campo',
      id: 'cola-buscar',
      type: 'text',
      placeholder: 'Buscar acto...',
      value: termino,
    }),
    crearEtiqueta('span', { class: 'buscador__atajo', texto: 'Ctrl K' })
  );

  buscador.querySelector('input').addEventListener('input', (ev) => {
    termino = ev.target.value;
    const filtrados = filtrarActos(actosDe(tocataActiva().id), filtroActivo, termino);
    const contenedor = contenedorPrincipal.querySelector('.cola__lista-contenedor');
    if (contenedor) {
      limpiarContenedor(contenedor);
      contenedor.append(pintarItems(filtrados));
    }
  });

  cont.append(chips, buscador);
  return cont;
}

function pintarLista(tocata) {
  const actos = filtrarActos(actosDe(tocata.id), filtroActivo, termino);
  const cont = crearEtiqueta('div', { class: 'cola__lista-contenedor' });
  cont.append(pintarItems(actos));
  return cont;
}

function pintarItems(actos) {
  const cont = crearEtiqueta('div', { class: 'cola' });

  if (actos.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin actos en este filtro')
      )
    );
    return cont;
  }

  actos.forEach((acto, i) => {
    cont.append(construirActo(acto, i, actos));
  });

  return cont;
}

function construirActo(acto, indice, todos) {
  const item = crearEtiqueta('div', { class: 'cola__item cola__item--' + claseEstado(acto.estado) });

  const numero = crearEtiqueta('div', { class: 'cola__numero', texto: String(acto.ordenCola) });

  const flechas = crearEtiqueta('div', { class: 'cola__flechas' },
    crearEtiqueta('button', {
      class: 'cola__flecha',
      title: 'Subir',
      disabled: indice === 0,
      texto: '▲',
      onclick: () => mover(acto, -1),
    }),
    crearEtiqueta('button', {
      class: 'cola__flecha',
      title: 'Bajar',
      disabled: indice === todos.length - 1,
      texto: '▼',
      onclick: () => mover(acto, 1),
    })
  );

  const info = crearEtiqueta('div', { class: 'cola__info' },
    crearEtiqueta('div', { class: 'cola__nombre', texto: acto.nombreArtistico }),
    crearEtiqueta('div', { class: 'cola__detalle',
      texto: [acto.tipo, acto.genero, (acto.instrumentos || []).join(', ')].filter(Boolean).join(' · ')
    }),
    acto.hastaQueLoBajen
      ? crearEtiqueta('span', { class: 'pildora pildora--acento', style: { marginTop: '4px' } },
          'Hasta que lo bajen'
        )
      : null
  );

  const pildora = crearEtiqueta('div', { class: 'cola__estado-badge' },
    crearPildoraEstado(acto.estado)
  );

  const acciones = crearEtiqueta('div', { class: 'cola__acciones' });

  if (acto.estado === 'aprobado') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--primario btn--chico',
        texto: '▶ Iniciar',
        onclick: () => iniciarActo(acto.id),
      }),
      crearEtiqueta('button', {
        class: 'btn btn--fantasma btn--chico',
        texto: 'Saltar',
        onclick: () => saltarActo(acto.id),
      })
    );
  } else if (acto.estado === 'en_curso') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--primario btn--chico',
        texto: '✓ Terminar',
        onclick: () => terminarActo(acto.id),
      }),
      crearEtiqueta('button', {
        class: 'btn btn--fantasma btn--chico',
        texto: '+5 min',
        onclick: () => extenderActo(acto.id, 5),
      })
    );
  } else if (acto.estado === 'anotado') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--primario btn--chico',
        texto: 'Aprobar',
        onclick: () => aprobarActo(acto.id),
      }),
      crearEtiqueta('button', {
        class: 'btn btn--peligro btn--chico',
        texto: 'Rechazar',
        onclick: () => rechazarActo(acto.id),
      })
    );
  } else if (acto.estado === 'terminado' || acto.estado === 'saltado') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--fantasma btn--chico',
        texto: 'Reactivar',
        onclick: () => reactivarActo(acto.id),
      })
    );
  }

  item.append(flechas, numero, info, pildora, acciones);
  return item;
}

function crearPildoraEstado(estado) {
  const map = {
    anotado: { variante: 'info', texto: 'Anotado' },
    aprobado: { variante: 'acento', texto: 'Aprobado' },
    en_curso: { variante: 'exito', vivo: true, texto: 'En vivo' },
    terminado: { variante: 'neutral', texto: 'Terminado' },
    saltado: { variante: 'aviso', texto: 'Saltado' },
    no_llego: { variante: 'error', texto: 'No llegó' },
    rechazado: { variante: 'error', texto: 'Rechazado' },
  };
  const cfg = map[estado] || { variante: 'neutral', texto: estado };

  const clases = ['pildora', `pildora--${cfg.variante}`];
  if (cfg.vivo) clases.push('pildora--vivo');

  const hijos = [];
  if (cfg.vivo) {
    hijos.push(crearEtiqueta('span', { class: 'pildora__punto' }));
  }
  hijos.push(cfg.texto);

  return crearEtiqueta('span', { class: clases.join(' ') }, ...hijos);
}

function claseEstado(estado) {
  if (estado === 'en_curso') return 'activo';
  if (estado === 'terminado') return 'terminado';
  if (estado === 'saltado' || estado === 'no_llego') return 'saltado';
  return '';
}

/* ---------- Acciones sobre actos ---------- */

function actualizarActo(id, cambios) {
  const actos = obtener('actos') || [];
  const idx = actos.findIndex((a) => a.id === id);
  if (idx < 0) return;
  actos[idx] = { ...actos[idx], ...cambios };
  establecer('actos', [...actos]);
}

function iniciarActo(id) {
  const actos = obtener('actos') || [];
  const actual = actos.find((a) => a.estado === 'en_curso');
  if (actual) {
    mostrarToast('Ya hay un acto en curso.', 'error');
    return;
  }
  actualizarActo(id, {
    estado: 'en_curso',
    inicioReal: new Date().toISOString(),
  });
  const acto = (obtener('actos') || []).find((a) => a.id === id);
  emitir('acto:iniciado', { actoId: id, acto });
  mostrarToast('Acto iniciado.');
  pintar();
}

function terminarActo(id) {
  actualizarActo(id, {
    estado: 'terminado',
    finReal: new Date().toISOString(),
  });
  emitir('acto:terminado', { actoId: id });
  mostrarToast('Acto terminado.');
  pintar();
}

function saltarActo(id) {
  actualizarActo(id, { estado: 'saltado' });
  emitir('acto:saltado', { actoId: id });
  mostrarToast('Acto saltado.');
  pintar();
}

function aprobarActo(id) {
  actualizarActo(id, { estado: 'aprobado' });
  mostrarToast('Acto aprobado.');
  pintar();
}

function rechazarActo(id) {
  actualizarActo(id, { estado: 'rechazado' });
  mostrarToast('Acto rechazado.');
  pintar();
}

function reactivarActo(id) {
  actualizarActo(id, { estado: 'aprobado' });
  mostrarToast('Acto reactivado.');
  pintar();
}

function extenderActo(id, minutos) {
  const actos = obtener('actos') || [];
  const acto = actos.find((a) => a.id === id);
  if (!acto) return;
  actualizarActo(id, {
    tiempoEstimadoMin: (acto.tiempoEstimadoMin || 15) + minutos,
  });
  emitir('acto:extendido', { actoId: id, minutos });
  mostrarToast(`+${minutos} minutos.`);
  pintar();
}

function mover(acto, direccion) {
  const tocataId = obtener('tocataActivaId');
  const actos = actosDe(tocataId);
  const idx = actos.findIndex((a) => a.id === acto.id);
  const objetivo = actos[idx + direccion];
  if (!objetivo) return;

  const todos = obtener('actos') || [];
  const idxA = todos.findIndex((a) => a.id === acto.id);
  const idxB = todos.findIndex((a) => a.id === objetivo.id);
  const ordenA = todos[idxA].ordenCola;
  todos[idxA].ordenCola = todos[idxB].ordenCola;
  todos[idxB].ordenCola = ordenA;
  establecer('actos', [...todos]);
  emitir('cola:reordenada', { orden: todos.filter((a) => a.tocataRef === tocataId).sort((x, y) => x.ordenCola - y.ordenCola).map((a) => a.id) });
  pintar();
}

function cambiarEstadoTocata(tocataId, nuevoEstado) {
  const tocatas = obtener('tocatas') || [];
  const idx = tocatas.findIndex((t) => t.id === tocataId);
  if (idx < 0) return;
  tocatas[idx].estado = nuevoEstado;
  establecer('tocatas', [...tocatas]);
  pintar();
}

/* ---------- Cronómetro ---------- */

function iniciarCronometroSiHaceFalta() {
  if (intervaloCronometro) return;
  intervaloCronometro = setInterval(() => {
    const el = document.getElementById('cola-cronometro');
    if (!el) return;
    const actos = obtener('actos') || [];
    const enCurso = actos.find((a) => a.estado === 'en_curso');
    if (!enCurso || !enCurso.inicioReal) {
      el.textContent = '00:00';
      return;
    }
    const inicio = new Date(enCurso.inicioReal).getTime();
    const segundos = Math.floor((Date.now() - inicio) / 1000);
    el.textContent = segundosADigital(segundos);
  }, 1000);
}

/* ---------- Ciclo de vida ---------- */

export async function activar(contenedor) {
  raiz = contenedor;
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--cola' });
  contenedor.append(contenedorPrincipal);

  limpiarSuscripcion = al('acto:actualizado', () => pintar());

  filtroActivo = 'todos';
  termino = '';
  pintar();
}

export function limpiar() {
  if (intervaloCronometro) {
    clearInterval(intervaloCronometro);
    intervaloCronometro = null;
  }
  if (limpiarSuscripcion) {
    limpiarSuscripcion();
    limpiarSuscripcion = null;
  }
  if (limpiarAtajo) {
    limpiarAtajo();
    limpiarAtajo = null;
  }
  contenedorPrincipal = null;
  raiz = null;
}