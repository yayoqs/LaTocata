/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/registro-musicos.js
   Versión: 0.1.0
   Propósito: Registro de músicos para la tocata activa. Formulario
              en modal con preguntas simples, y lista de actos
              anotados con aprobación rápida.
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { emitir } from '../nucleo/bus-eventos.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  iniciales,
  mostrarToast,
} from '../nucleo/utils.js';

let raiz = null;
let contenedorPrincipal = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function actosDe(tocataId) {
  return (obtener('actos') || [])
    .filter((a) => a.tocataRef === tocataId)
    .sort((a, b) => a.ordenCola - b.ordenCola);
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
    pintarLinkPublico(tocata),
    pintarAnotados(tocata)
  );
}

function pintarCabecera(tocata) {
  return crearEtiqueta('header', { class: 'registro__cabecera' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'registro__titulo', texto: 'Registro de músicos' }),
      crearEtiqueta('p', { class: 'texto-suave', texto: tocata.nombre })
    ),
    crearEtiqueta('button', {
      class: 'btn btn--primario',
      texto: '+ Anotar músico',
      onclick: abrirModalRegistro,
    })
  );
}

function pintarLinkPublico(tocata) {
  const url = `latocata.elisekai.com/cartelera/${tocata.slug}`;
  return crearEtiqueta('div', { class: 'registro__link' },
    crearEtiqueta('div', { class: 'registro__link-icono', texto: '🔗' }),
    crearEtiqueta('div', { class: 'registro__link-info' },
      crearEtiqueta('div', { class: 'registro__link-titulo' }, 'Link público para anotarse'),
      crearEtiqueta('div', { class: 'registro__link-url', texto: url })
    ),
    crearEtiqueta('button', {
      class: 'btn btn--secundario btn--chico',
      texto: 'Copiar',
      onclick: () => {
        try {
          navigator.clipboard.writeText('https://' + url);
          mostrarToast('Link copiado.');
        } catch (e) {
          mostrarToast('No se pudo copiar.', 'error');
        }
      },
    })
  );
}

function pintarAnotados(tocata) {
  const actos = actosDe(tocata.id);

  const cont = crearEtiqueta('section', { class: 'registro__bloque' });
  cont.append(
    crearEtiqueta('h2', { class: 'registro__bloque-titulo' },
      `Anotados (${actos.length})`
    )
  );

  if (actos.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Todavía no hay nadie anotado'),
        crearEtiqueta('p', {}, 'Comparte el link público o anota a alguien manualmente.')
      )
    );
    return cont;
  }

  const lista = crearEtiqueta('div', { class: 'registro__lista' });
  actos.forEach((a) => {
    lista.append(construirFilaActo(a));
  });

  cont.append(lista);
  return cont;
}

function construirFilaActo(acto) {
  const fila = crearEtiqueta('div', { class: 'registro__fila' });

  const avatar = crearEtiqueta('div', { class: 'avatar', texto: iniciales(acto.nombreArtistico) });

  const info = crearEtiqueta('div', { class: 'registro__fila-info' },
    crearEtiqueta('div', { class: 'registro__fila-nombre', texto: acto.nombreArtistico }),
    crearEtiqueta('div', { class: 'registro__fila-meta',
      texto: [acto.tipo, acto.genero, (acto.instrumentos || []).join(', ')].filter(Boolean).join(' · ')
    })
  );

  const estado = crearEtiqueta('span', {
    class: 'badge ' + (acto.estado === 'anotado' ? 'badge--info' : acto.estado === 'aprobado' ? 'badge--acento' : ''),
    texto: etiquetaEstado(acto.estado),
  });

  const acciones = crearEtiqueta('div', { class: 'registro__fila-acciones' });

  if (acto.estado === 'anotado') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--primario btn--chico',
        texto: 'Aprobar',
        onclick: () => aprobar(acto.id),
      }),
      crearEtiqueta('button', {
        class: 'btn btn--fantasma btn--chico',
        texto: 'Rechazar',
        onclick: () => rechazar(acto.id),
      })
    );
  } else if (acto.estado === 'aprobado') {
    acciones.append(
      crearEtiqueta('button', {
        class: 'btn btn--fantasma btn--chico',
        texto: 'Volver a anotado',
        onclick: () => volverAAnotado(acto.id),
      })
    );
  }

  fila.append(avatar, info, estado, acciones);
  return fila;
}

function etiquetaEstado(estado) {
  const map = {
    anotado: 'Anotado',
    aprobado: 'Aprobado',
    en_curso: 'En vivo',
    terminado: 'Terminado',
    saltado: 'Saltado',
    rechazado: 'Rechazado',
  };
  return map[estado] || estado;
}

/* ---------- Modal de registro ---------- */

function abrirModalRegistro() {
  const overlay = crearEtiqueta('div', { class: 'modal' });
  const caja = crearEtiqueta('div', { class: 'modal__caja modal__caja--grande' });

  const cab = crearEtiqueta('div', { class: 'modal__cabecera' },
    crearEtiqueta('div', { class: 'modal__titulo' }, 'Anotar músico'),
    crearEtiqueta('button', { class: 'btn btn--fantasma btn--chico', texto: '✕', onclick: () => overlay.remove() })
  );

  const campos = {};
  const cuerpo = crearEtiqueta('div', { class: 'modal__cuerpo' });

  // Nombre artístico
  campos.nombreArtistico = crearEtiqueta('input', { class: 'campo__entrada', placeholder: 'Cómo te llamas en el escenario' });
  cuerpo.append(
    crearEtiqueta('div', { class: 'campo', estilo: { marginBottom: '14px' } },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Nombre artístico'),
      campos.nombreArtistico
    )
  );

  // Tipo
  campos.tipo = crearEtiqueta('select', { class: 'campo__select' },
    crearEtiqueta('option', { value: 'solista' }, 'Solista'),
    crearEtiqueta('option', { value: 'duo' }, 'Dúo'),
    crearEtiqueta('option', { value: 'banda' }, 'Banda')
  );
  cuerpo.append(
    crearEtiqueta('div', { class: 'campo', estilo: { marginBottom: '14px' } },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Formato'),
      campos.tipo
    )
  );

  // Instrumentos
  campos.instrumentos = crearEtiqueta('input', { class: 'campo__entrada', placeholder: 'Separados por coma: guitarra, voz' });
  cuerpo.append(
    crearEtiqueta('div', { class: 'campo', estilo: { marginBottom: '14px' } },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Instrumentos'),
      campos.instrumentos
    )
  );

  // Género
  campos.genero = crearEtiqueta('input', { class: 'campo__entrada', placeholder: 'rock, folk, blues, trova...' });
  cuerpo.append(
    crearEtiqueta('div', { class: 'campo', estilo: { marginBottom: '14px' } },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Género aproximado'),
      campos.genero
    )
  );

  // Cantidad de temas
  campos.cantidadTemas = crearEtiqueta('input', { class: 'campo__entrada', type: 'number', min: '1', value: '2' });
  campos.hastaQueLoBajen = crearEtiqueta('input', { type: 'checkbox' });
  cuerpo.append(
    crearEtiqueta('div', { class: 'campo', estilo: { marginBottom: '14px' } },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, '¿Cuántos temas?'),
      campos.cantidadTemas,
      crearEtiqueta('label', { class: 'registro__check' },
        campos.hastaQueLoBajen,
        crearEtiqueta('span', {}, 'Toco hasta que me bajen')
      )
    )
  );

  // Canciones
  campos.canciones = crearEtiqueta('textarea', { class: 'campo__textarea', placeholder: 'Un tema por línea. Puedes agregar duración: Mi tema (4 min)' });
  cuerpo.append(
    crearEtiqueta('div', { class: 'campo', estilo: { marginBottom: '14px' } },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Canciones (opcional)'),
      campos.canciones
    )
  );

  // Equipamiento
  campos.equipamiento = crearEtiqueta('input', { class: 'campo__entrada', placeholder: 'Ej: necesito ampli y un micrófono' });
  cuerpo.append(
    crearEtiqueta('div', { class: 'campo', estilo: { marginBottom: '14px' } },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Equipamiento que necesitas'),
      campos.equipamiento
    )
  );

  // Contacto
  campos.contacto = crearEtiqueta('input', { class: 'campo__entrada', placeholder: 'WhatsApp o Instagram (opcional)' });
  cuerpo.append(
    crearEtiqueta('div', { class: 'campo' },
      crearEtiqueta('label', { class: 'campo__etiqueta' }, 'Contacto'),
      campos.contacto
    )
  );

  const pie = crearEtiqueta('div', { class: 'modal__pie' },
    crearEtiqueta('button', { class: 'btn btn--secundario', texto: 'Cancelar', onclick: () => overlay.remove() }),
    crearEtiqueta('button', {
      class: 'btn btn--primario',
      texto: 'Anotar',
      onclick: () => {
        const nombre = campos.nombreArtistico.value.trim();
        if (!nombre) {
          mostrarToast('Falta el nombre artístico.', 'error');
          return;
        }
        guardarActo({
          nombreArtistico: nombre,
          tipo: campos.tipo.value,
          instrumentos: campos.instrumentos.value.split(',').map((s) => s.trim()).filter(Boolean),
          genero: campos.genero.value.trim(),
          cantidadTemas: Number(campos.cantidadTemas.value) || 1,
          hastaQueLoBajen: campos.hastaQueLoBajen.checked,
          canciones: parsearCanciones(campos.canciones.value),
          necesitaEquipamiento: campos.equipamiento.value.trim(),
          contacto: campos.contacto.value.trim(),
        });
        overlay.remove();
        pintar();
      },
    })
  );

  caja.append(cab, cuerpo, pie);
  overlay.append(caja);
  document.body.append(overlay);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });

  setTimeout(() => campos.nombreArtistico.focus(), 100);
}

function parsearCanciones(texto) {
  if (!texto) return [];
  return texto.split('\n').map((linea) => {
    const t = linea.trim();
    if (!t) return null;
    const match = t.match(/^(.*?)\s*\((\d+)\s*min\)\s*$/);
    if (match) return { titulo: match[1].trim(), duracionAprox: Number(match[2]) };
    return { titulo: t, duracionAprox: null };
  }).filter(Boolean);
}

function guardarActo(datos) {
  const tocataId = obtener('tocataActivaId');
  const actos = obtener('actos') || [];
  const deEstaTocata = actos.filter((a) => a.tocataRef === tocataId);
  const nuevoOrden = deEstaTocata.length > 0
    ? Math.max(...deEstaTocata.map((a) => a.ordenCola || 0)) + 1
    : 1;

  const nuevo = {
    id: 'act_' + Date.now(),
    tocataRef: tocataId,
    tipo: datos.tipo,
    musicoRef: 'usr_' + (datos.nombreArtistico.toLowerCase().replace(/\s+/g, '_')),
    bandaRef: null,
    nombreArtistico: datos.nombreArtistico,
    integrantes: [],
    instrumentos: datos.instrumentos,
    genero: datos.genero,
    canciones: datos.canciones,
    cantidadTemas: datos.cantidadTemas,
    hastaQueLoBajen: datos.hastaQueLoBajen,
    necesitaEquipamiento: datos.necesitaEquipamiento,
    contacto: datos.contacto,
    estado: 'anotado',
    ordenCola: nuevoOrden,
    tiempoEstimadoMin: 15,
    notasOrganizador: '',
  };

  actos.push(nuevo);
  establecer('actos', [...actos]);
  emitir('acto:anotado', { acto: nuevo });
  mostrarToast('Músico anotado.');
}

/* ---------- Acciones sobre actos ---------- */

function actualizarActo(id, cambios) {
  const actos = obtener('actos') || [];
  const idx = actos.findIndex((a) => a.id === id);
  if (idx < 0) return;
  actos[idx] = { ...actos[idx], ...cambios };
  establecer('actos', [...actos]);
}

function aprobar(id) {
  actualizarActo(id, { estado: 'aprobado' });
  mostrarToast('Aprobado.');
  pintar();
}

function rechazar(id) {
  actualizarActo(id, { estado: 'rechazado' });
  mostrarToast('Rechazado.', 'error');
  pintar();
}

function volverAAnotado(id) {
  actualizarActo(id, { estado: 'anotado' });
  pintar();
}

/* ---------- Ciclo de vida ---------- */

export async function activar(contenedor) {
  raiz = contenedor;
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--registro' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
  raiz = null;
}