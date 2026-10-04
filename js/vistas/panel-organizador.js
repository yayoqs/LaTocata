/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/panel-organizador.js
   Versión: 0.2.0
   Propósito: Panel del organizador. Muestra el estado de la
              tocata activa, estadísticas rápidas, próximos actos
              y accesos a las acciones críticas.
              v0.2.0: se adoptan los componentes del sistema visual:
                      · .tarjeta-metrica para las estadísticas
                      · .tarjeta-accion para las acciones rápidas
                      · .cabecera-seccion para los encabezados de
                        bloque, con contador o acción
                      · .pildora para los estados operativos
                      Se eliminan los emojis en favor de SVG inline,
                      coherente con la decisión de no usar Font
                      Awesome ni emojis decorativos.
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { emitir, al } from '../nucleo/bus-eventos.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  formatearFechaLarga,
  mostrarToast,
} from '../nucleo/utils.js';

/* ---------- Iconos SVG inline ---------- */

const ICO = {
  usuarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  vivo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6"/><circle cx="12" cy="12" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/></svg>',
  cola: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.4"/><circle cx="4" cy="12" r="1.4"/><circle cx="4" cy="18" r="1.4"/></svg>',
  registro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>',
  escenario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6"/><circle cx="12" cy="12" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/></svg>',
  altavoz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8v18L3 13z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
};

let raiz = null;
let contenedorPrincipal = null;
let limpiarSuscripcion = null;

/* ---------- Helpers ---------- */

function tocataActiva() {
  const id = obtener('tocataActivaId');
  const tocatas = obtener('tocatas') || [];
  return tocatas.find((t) => t.id === id) || null;
}

function espacioDe(tocata) {
  if (!tocata) return null;
  const espacios = obtener('espacios') || [];
  return espacios.find((e) => e.id === tocata.espacioRef) || null;
}

function actosDe(tocataId) {
  return (obtener('actos') || [])
    .filter((a) => a.tocataRef === tocataId)
    .sort((a, b) => a.ordenCola - b.ordenCola);
}

function estadisticas(tocataId) {
  const actos = actosDe(tocataId);
  return {
    total: actos.length,
    aprobados: actos.filter((a) => a.estado === 'aprobado').length,
    enCurso: actos.filter((a) => a.estado === 'en_curso').length,
    terminados: actos.filter((a) => a.estado === 'terminado').length,
  };
}

function etiquetaEstado(estado) {
  const map = {
    borrador: 'Borrador',
    publicada: 'Publicada',
    en_curso: 'En curso',
    pausada: 'Pausada',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada',
  };
  return map[estado] || estado;
}

function etiquetaTipo(tipo) {
  const map = {
    jam: 'Jam',
    concierto: 'Concierto',
    microfono_abierto: 'Micrófono abierto',
    ensayo_abierto: 'Ensayo abierto',
    rave: 'Rave',
    tocata_tematica: 'Tocata temática',
    especifico: 'Tocata',
  };
  return map[tipo] || tipo;
}

/* ---------- Pintado principal ---------- */

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const tocata = tocataActiva();
  if (!tocata) {
    contenedorPrincipal.append(pintarSinTocata());
    return;
  }

  const espacio = espacioDe(tocata);
  const stats = estadisticas(tocata.id);

  contenedorPrincipal.append(
    pintarHero(tocata, espacio),
    pintarStats(stats),
    pintarAccionesRapidas(tocata),
    pintarProximosActos(tocata.id),
    pintarAvisos(tocata.id),
    pintarItinerancia(tocata.id)
  );
}

function pintarSinTocata() {
  return crearEtiqueta('div', { class: 'vacio' },
    crearEtiqueta('div', { class: 'vacio__titulo' }, 'No hay una tocata activa'),
    crearEtiqueta('p', {}, 'Crea una nueva tocata para comenzar a organizar.')
  );
}

function pintarHero(tocata, espacio) {
  const card = crearEtiqueta('section', { class: 'panel__hero' });

  const tipoBadge = crearEtiqueta('span', { class: 'badge badge--acento', texto: etiquetaTipo(tocata.tipo) });
  const estadoBadge = crearEtiqueta('span', {
    class: 'badge ' + (tocata.estado === 'en_curso' ? 'badge--exito' : 'badge--info'),
    texto: etiquetaEstado(tocata.estado),
  });

  card.append(
    crearEtiqueta('div', { class: 'panel__hero-badges' }, tipoBadge, estadoBadge),
    crearEtiqueta('h1', { class: 'panel__hero-titulo', texto: tocata.nombre }),
    crearEtiqueta('p', { class: 'panel__hero-descripcion', texto: tocata.descripcion || '' }),
    crearEtiqueta('div', { class: 'panel__hero-meta' },
      metaItem('📅', formatearFechaLarga(tocata.fecha)),
      metaItem('🕐', `${tocata.horaInicio} — ${tocata.horaFinEstimada}`),
      espacio ? metaItem('📍', `${espacio.nombre}, ${espacio.comuna}`) : null,
      metaItem('🎟️', `Aforo ${tocata.aforoMax}`)
    )
  );

  return card;
}

function metaItem(emoji, texto) {
  return crearEtiqueta('div', { class: 'panel__meta-item' },
    crearEtiqueta('span', { class: 'panel__meta-emoji', texto: emoji }),
    crearEtiqueta('span', { texto })
  );
}

function pintarStats(stats) {
  const cont = crearEtiqueta('section', { class: 'grilla grilla--4' });

  const items = [
    { valor: stats.total, etiqueta: 'Anotados', icono: ICO.usuarios, variante: 'acento' },
    { valor: stats.aprobados, etiqueta: 'Aprobados', icono: ICO.check, variante: 'info' },
    { valor: stats.enCurso, etiqueta: 'En vivo', icono: ICO.vivo, variante: 'exito' },
    { valor: stats.terminados, etiqueta: 'Terminados', icono: ICO.check, variante: 'exito' },
  ];

  items.forEach((i) => {
    cont.append(
      crearEtiqueta('div', { class: 'tarjeta-metrica' },
        crearEtiqueta('div', { class: `tarjeta-metrica__icono tarjeta-metrica__icono--${i.variante}`, html: i.icono }),
        crearEtiqueta('div', { class: 'tarjeta-metrica__cuerpo' },
          crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta', texto: i.etiqueta }),
          crearEtiqueta('div', { class: 'tarjeta-metrica__valor', texto: String(i.valor) })
        )
      )
    );
  });

  return cont;
}

function pintarAccionesRapidas(tocata) {
  const cont = crearEtiqueta('section', { class: 'grilla grilla--2' });

  const acciones = [
    {
      icono: ICO.registro,
      titulo: 'Anotar músico',
      descripcion: 'Sumar un acto a la cola',
      onclick: () => emitir('navegar:solicitada', { vista: 'registro' }),
    },
    {
      icono: ICO.escenario,
      titulo: tocata.estado === 'en_curso' ? 'Ver escenario' : 'Iniciar jornada',
      descripcion: tocata.estado === 'en_curso'
        ? 'Cronómetro y control del acto'
        : 'Pasar la tocata a en curso',
      onclick: () => {
        if (tocata.estado !== 'en_curso') {
          cambiarEstadoTocata(tocata.id, 'en_curso');
        }
        emitir('navegar:solicitada', { vista: 'escenario' });
      },
    },
    {
      icono: ICO.altavoz,
      titulo: 'Enviar aviso',
      descripcion: 'Publicar en la cartelera',
      onclick: () => abrirModalAviso(tocata.id),
    },
    {
      icono: ICO.cerrar,
      titulo: 'Cerrar jornada',
      descripcion: 'Finalizar y generar resumen',
      onclick: () => cerrarJornada(tocata.id),
      peligro: true,
    },
  ];

  acciones.forEach((a) => {
    cont.append(
      crearEtiqueta('button', {
        class: 'tarjeta-accion' + (a.peligro ? ' tarjeta-accion--peligro' : ''),
        type: 'button',
        onclick: a.onclick,
      },
        crearEtiqueta('span', { class: 'tarjeta-accion__icono', html: a.icono }),
        crearEtiqueta('span', { class: 'tarjeta-accion__info' },
          crearEtiqueta('span', { class: 'tarjeta-accion__titulo', texto: a.titulo }),
          crearEtiqueta('span', { class: 'tarjeta-accion__descripcion', texto: a.descripcion })
        ),
        crearEtiqueta('span', { class: 'tarjeta-accion__flecha', texto: '→' })
      )
    );
  });

  return cont;
}

function pintarProximosActos(tocataId) {
  const actos = actosDe(tocataId);
  const pendientes = actos
    .filter((a) => a.estado === 'aprobado' || a.estado === 'en_curso')
    .slice(0, 3);

  const cont = crearEtiqueta('section', { class: 'panel__bloque' });

  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.cola }),
        'Próximos en la cola'
      ),
      pendientes.length > 0
        ? crearEtiqueta('span', { class: 'cabecera-seccion__contador', texto: String(pendientes.length) })
        : null,
      crearEtiqueta('button', {
        class: 'cabecera-seccion__accion',
        type: 'button',
        texto: 'Ver cola completa →',
        onclick: () => emitir('navegar:solicitada', { vista: 'cola' }),
      })
    )
  );

  if (pendientes.length === 0) {
    cont.append(crearEtiqueta('p', { class: 'texto-suave', estilo: { padding: '16px' } }, 'No hay actos aprobados todavía.'));
    return cont;
  }

  const lista = crearEtiqueta('div', { class: 'panel__actos' });
  pendientes.forEach((a) => {
    lista.append(
      crearEtiqueta('div', { class: 'panel__acto' },
        crearEtiqueta('div', { class: 'panel__acto-numero', texto: String(a.ordenCola) }),
        crearEtiqueta('div', { class: 'panel__acto-info' },
          crearEtiqueta('div', { class: 'panel__acto-nombre', texto: a.nombreArtistico }),
          crearEtiqueta('div', { class: 'panel__acto-meta',
            texto: [a.genero, (a.instrumentos || []).join(', ')].filter(Boolean).join(' · ')
          })
        ),
        a.estado === 'en_curso'
          ? crearEtiqueta('span', { class: 'pildora pildora--exito pildora--vivo' },
              crearEtiqueta('span', { class: 'pildora__punto' }),
              'En vivo'
            )
          : null
      )
    );
  });

  cont.append(lista);
  return cont;
}

function pintarAvisos(tocataId) {
  const avisos = (obtener('avisos') || [])
    .filter((a) => a.tocataRef === tocataId && a.tipo === 'publico')
    .slice(0, 3);

  const cont = crearEtiqueta('section', { class: 'panel__bloque' });
  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' }, 'Avisos publicados'),
      crearEtiqueta('button', {
        class: 'cabecera-seccion__accion',
        type: 'button',
        texto: '+ Nuevo aviso',
        onclick: () => abrirModalAviso(tocataId),
      })
    )
  );

  if (avisos.length === 0) {
    cont.append(crearEtiqueta('p', { class: 'texto-suave', estilo: { padding: '16px' } }, 'Sin avisos.'));
    return cont;
  }

  const lista = crearEtiqueta('div', { class: 'panel__avisos' });
  avisos.forEach((a) => {
    lista.append(
      crearEtiqueta('div', { class: 'panel__aviso' },
        crearEtiqueta('div', { class: 'panel__aviso-titulo', texto: a.titulo }),
        crearEtiqueta('div', { class: 'panel__aviso-mensaje', texto: a.mensaje })
      )
    );
  });
  cont.append(lista);
  return cont;
}

function pintarItinerancia(tocataId) {
  const tocatas = (obtener('tocatas') || []).filter((t) => t.id !== tocataId);

  const cont = crearEtiqueta('section', { class: 'panel__bloque' });
  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' }, 'Otras tocatas'),
      crearEtiqueta('span', { class: 'texto-suave texto-chico' }, 'El proyecto tiene memoria y movimiento')
    )
  );

  const lista = crearEtiqueta('div', { class: 'panel__itinerancia' });
  tocatas.forEach((t) => {
    const esp = (obtener('espacios') || []).find((e) => e.id === t.espacioRef);
    lista.append(
      crearEtiqueta('div', { class: 'panel__itinerancia-item' },
        crearEtiqueta('div', { class: 'panel__itinerancia-fecha' },
          crearEtiqueta('span', { class: 'panel__itinerancia-dia', texto: new Date(t.fecha).getDate() }),
          crearEtiqueta('span', { class: 'panel__itinerancia-mes', texto: nombreMes(t.fecha) })
        ),
        crearEtiqueta('div', { class: 'panel__itinerancia-info' },
          crearEtiqueta('div', { class: 'panel__itinerancia-nombre', texto: t.nombre }),
          crearEtiqueta('div', { class: 'panel__itinerancia-meta',
            texto: [etiquetaTipo(t.tipo), esp?.nombre].filter(Boolean).join(' · ')
          })
        ),
        crearEtiqueta('span', { class: 'badge', texto: etiquetaEstado(t.estado) })
      )
    );
  });

  cont.append(lista);
  return cont;
}

function nombreMes(fecha) {
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return meses[new Date(fecha).getMonth()];
}

/* ---------- Acciones ---------- */

function cambiarEstadoTocata(tocataId, nuevoEstado) {
  const tocatas = obtener('tocatas') || [];
  const idx = tocatas.findIndex((t) => t.id === tocataId);
  if (idx < 0) return;
  tocatas[idx].estado = nuevoEstado;
  establecer('tocatas', [...tocatas]);
  emitir('tocata:actualizada', { tocataId, estado: nuevoEstado });
}

function cerrarJornada(tocataId) {
  const overlay = crearEtiqueta('div', { class: 'modal' });
  const caja = crearEtiqueta('div', { class: 'modal__caja' });

  const cab = crearEtiqueta('div', { class: 'modal__cabecera' },
    crearEtiqueta('div', { class: 'modal__titulo' }, 'Cerrar jornada'),
    crearEtiqueta('button', { class: 'btn btn--fantasma btn--chico', texto: '✕', onclick: () => overlay.remove() })
  );

  const cuerpo = crearEtiqueta('div', { class: 'modal__cuerpo' });
  cuerpo.append(
    crearEtiqueta('p', {}, 'Al cerrar la jornada se genera el resumen de la tocata con la cantidad de actos, temas y recaudación. Esta acción no se puede deshacer.')
  );

  const pie = crearEtiqueta('div', { class: 'modal__pie' },
    crearEtiqueta('button', { class: 'btn btn--secundario', texto: 'Cancelar', onclick: () => overlay.remove() }),
    crearEtiqueta('button', {
      class: 'btn btn--primario',
      texto: 'Cerrar jornada',
      onclick: () => {
        cambiarEstadoTocata(tocataId, 'finalizada');
        mostrarToast('Jornada cerrada. Resumen generado.', 'exito');
        overlay.remove();
        pintar();
      },
    })
  );

  caja.append(cab, cuerpo, pie);
  overlay.append(caja);
  document.body.append(overlay);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
}

function abrirModalAviso(tocataId) {
  const overlay = crearEtiqueta('div', { class: 'modal' });
  const caja = crearEtiqueta('div', { class: 'modal__caja' });

  const cab = crearEtiqueta('div', { class: 'modal__cabecera' },
    crearEtiqueta('div', { class: 'modal__titulo' }, 'Nuevo aviso público'),
    crearEtiqueta('button', { class: 'btn btn--fantasma btn--chico', texto: '✕', onclick: () => overlay.remove() })
  );

  const inputTitulo = crearEtiqueta('input', { class: 'campo__entrada', placeholder: 'Ej: Bienvenida' });
  const inputMensaje = crearEtiqueta('textarea', { class: 'campo__textarea', placeholder: 'Mensaje para la cartelera...' });

  const cuerpo = crearEtiqueta('div', { class: 'modal__cuerpo' },
    crearEtiqueta('div', { class: 'campo', estilo: { marginBottom: '12px' } },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Título'),
      inputTitulo
    ),
    crearEtiqueta('div', { class: 'campo' },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Mensaje'),
      inputMensaje
    )
  );

  const pie = crearEtiqueta('div', { class: 'modal__pie' },
    crearEtiqueta('button', { class: 'btn btn--secundario', texto: 'Cancelar', onclick: () => overlay.remove() }),
    crearEtiqueta('button', {
      class: 'btn btn--primario',
      texto: 'Publicar',
      onclick: () => {
        const titulo = inputTitulo.value.trim();
        const mensaje = inputMensaje.value.trim();
        if (!titulo || !mensaje) {
          mostrarToast('Completa título y mensaje.', 'error');
          return;
        }
        const avisos = obtener('avisos') || [];
        avisos.push({
          id: 'avi_' + Date.now(),
          tocataRef: tocataId,
          titulo,
          mensaje,
          tipo: 'publico',
          importante: false,
        });
        establecer('avisos', [...avisos]);
        mostrarToast('Aviso publicado en la cartelera.', 'exito');
        overlay.remove();
        pintar();
      },
    })
  );

  caja.append(cab, cuerpo, pie);
  overlay.append(caja);
  document.body.append(overlay);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
}

/* ---------- Ciclo de vida ---------- */

export async function activar(contenedor) {
  raiz = contenedor;
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--panel' });
  contenedor.append(contenedorPrincipal);

  limpiarSuscripcion = al('navegar:solicitada', ({ vista }) => {
    emitir('navegacion:interna', { vista });
  });

  pintar();
}

export function limpiar() {
  if (limpiarSuscripcion) {
    limpiarSuscripcion();
    limpiarSuscripcion = null;
  }
  contenedorPrincipal = null;
  raiz = null;
}