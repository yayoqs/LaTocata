/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/escenario.js
   Versión: 0.3.0
   Propósito: Vista operativa del acto en curso. Cronómetro grande,
              lista de temas, notas del organizador, controles de
              extensión y corte. Muestra el próximo acto.
              v0.3.0: se aplica .cabecera-seccion a los encabezados
                      internos (Temas, Notas, Viene después) y se
                      pule el bloque de notas con un texto suave de
                      ayuda. Se separan los controles en un pie con
                      espacio propio.
              v0.2.0: adopción del sistema visual (píldoras).
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { emitir } from '../nucleo/bus-eventos.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  segundosADigital,
  mostrarToast,
} from '../nucleo/utils.js';

const ICO = {
  tema: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  nota: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="14 3 14 9 20 9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
  siguiente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',
};

let raiz = null;
let contenedorPrincipal = null;
let intervaloCronometro = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function actoEnCurso(tocataId) {
  return (obtener('actos') || []).find((a) => a.tocataRef === tocataId && a.estado === 'en_curso') || null;
}

function proximoActo(tocataId) {
  return (obtener('actos') || [])
    .filter((a) => a.tocataRef === tocataId && a.estado === 'aprobado')
    .sort((a, b) => a.ordenCola - b.ordenCola)[0] || null;
}

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

  const acto = actoEnCurso(tocata.id);

  if (!acto) {
    contenedorPrincipal.append(pintarSinActo(tocata));
  } else {
    contenedorPrincipal.append(
      pintarActo(acto, tocata),
      pintarInfoActo(acto),
      pintarNotas(acto),
      pintarProximo(tocata.id)
    );
  }
}

function pintarSinActo(tocata) {
  const proximo = proximoActo(tocata.id);

  const cont = crearEtiqueta('div', { class: 'escenario__vacio' });

  cont.append(
    crearEtiqueta('div', { class: 'escenario__vacio-titulo' }, 'Ningún acto en curso'),
    crearEtiqueta('p', { class: 'texto-suave' }, 'Cuando alguien esté tocando, aquí se verá el cronómetro y los controles.')
  );

  if (proximo) {
    cont.append(
      crearEtiqueta('div', { class: 'escenario__vacio-proximo' },
        crearEtiqueta('div', { class: 'texto-eyebrow' }, 'Próximo en la cola'),
        crearEtiqueta('div', { class: 'escenario__vacio-nombre', texto: proximo.nombreArtistico }),
        crearEtiqueta('div', { class: 'escenario__vacio-meta',
          texto: [proximo.genero, (proximo.instrumentos || []).join(', ')].filter(Boolean).join(' · ')
        }),
        crearEtiqueta('button', {
          class: 'btn btn--primario btn--grande',
          texto: '▶ Iniciar su acto',
          onclick: () => iniciarActo(proximo.id),
        })
      )
    );
  }

  return cont;
}

function pintarActo(acto, tocata) {
  const cont = crearEtiqueta('div', { class: 'escenario__acto' });

  cont.append(
    crearEtiqueta('span', { class: 'pildora pildora--exito pildora--vivo' },
      crearEtiqueta('span', { class: 'pildora__punto' }),
      'En vivo'
    )
  );

  cont.append(
    crearEtiqueta('h1', { class: 'escenario__nombre', texto: acto.nombreArtistico })
  );

  const meta = [acto.genero, (acto.instrumentos || []).join(', ')].filter(Boolean);
  if (meta.length > 0) {
    cont.append(crearEtiqueta('div', { class: 'escenario__meta', texto: meta.join(' · ') }));
  }

  cont.append(
    crearEtiqueta('div', { class: 'escenario__cronometro' },
      crearEtiqueta('div', { id: 'escenario-tiempo', class: 'escenario__tiempo', texto: '00:00' }),
      crearEtiqueta('div', { class: 'escenario__cronometro-info' },
        crearEtiqueta('span', { texto: 'tiempo en escenario' }),
        acto.tiempoEstimadoMin
          ? crearEtiqueta('span', { class: 'texto-suave texto-chico', texto: `estimado: ${acto.tiempoEstimadoMin} min` })
          : null
      )
    )
  );

  cont.append(
    crearEtiqueta('div', { class: 'escenario__controles' },
      crearEtiqueta('button', {
        class: 'btn btn--secundario',
        texto: '+5 min',
        onclick: () => extenderActo(acto.id, 5),
      }),
      crearEtiqueta('button', {
        class: 'btn btn--secundario',
        texto: '+10 min',
        onclick: () => extenderActo(acto.id, 10),
      }),
      crearEtiqueta('button', {
        class: 'btn btn--primario btn--grande',
        texto: '✓ Terminar acto',
        onclick: () => terminarActo(acto.id),
      }),
      crearEtiqueta('button', {
        class: 'btn btn--peligro',
        texto: 'Cortar',
        onclick: () => cortarActo(acto.id),
      })
    )
  );

  return cont;
}

function pintarInfoActo(acto) {
  const cont = crearEtiqueta('section', { class: 'escenario__bloque' });

  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h3', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.tema }),
        'Temas'
      ),
      (acto.canciones && acto.canciones.length > 0)
        ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(acto.canciones.length) })
        : null
    )
  );

  if (acto.canciones && acto.canciones.length > 0) {
    const canciones = crearEtiqueta('div', { class: 'escenario__canciones' });
    acto.canciones.forEach((c, i) => {
      canciones.append(
        crearEtiqueta('div', { class: 'escenario__cancion' },
          crearEtiqueta('span', { class: 'escenario__cancion-numero', texto: String(i + 1) }),
          crearEtiqueta('span', { class: 'escenario__cancion-titulo', texto: c.titulo }),
          c.duracionAprox
            ? crearEtiqueta('span', { class: 'escenario__cancion-dur', texto: c.duracionAprox + ' min' })
            : null
        )
      );
    });
    cont.append(canciones);
  } else {
    cont.append(crearEtiqueta('p', { class: 'texto-suave' }, 'El músico no anotó temas.'));
  }

  if (acto.hastaQueLoBajen) {
    cont.append(
      crearEtiqueta('div', { style: { marginTop: '12px' } },
        crearEtiqueta('span', { class: 'pildora pildora--acento' },
          'Toca hasta que lo bajen'
        )
      )
    );
  }

  return cont;
}

function pintarNotas(acto) {
  const cont = crearEtiqueta('section', { class: 'escenario__bloque' });

  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h3', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.nota }),
        'Notas del organizador'
      )
    )
  );

  const textarea = crearEtiqueta('textarea', {
    class: 'campo__textarea',
    placeholder: 'Buena onda, volver a invitar, qué funcionó, qué no...',
  });
  textarea.value = acto.notasOrganizador || '';

  const botonGuardar = crearEtiqueta('button', {
    class: 'btn btn--secundario btn--chico',
    texto: 'Guardar notas',
    estilo: { marginTop: '8px' },
    onclick: () => {
      actualizarActo(acto.id, { notasOrganizador: textarea.value.trim() });
      mostrarToast('Notas guardadas.');
    },
  });

  cont.append(textarea, botonGuardar);
  return cont;
}

function pintarProximo(tocataId) {
  const prox = proximoActo(tocataId);
  if (!prox) return crearEtiqueta('div');

  const cont = crearEtiqueta('section', { class: 'escenario__bloque' });

  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h3', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.siguiente }),
        'Viene después'
      )
    )
  );

  cont.append(
    crearEtiqueta('button', {
      class: 'tarjeta-accion',
      type: 'button',
      onclick: () => iniciarActo(prox.id),
    },
      crearEtiqueta('span', { class: 'tarjeta-accion__info' },
        crearEtiqueta('span', { class: 'tarjeta-accion__titulo', texto: prox.nombreArtistico }),
        crearEtiqueta('span', { class: 'tarjeta-accion__descripcion',
          texto: [prox.genero, (prox.instrumentos || []).join(', ')].filter(Boolean).join(' · ')
        })
      ),
      crearEtiqueta('span', { class: 'tarjeta-accion__flecha', texto: '▶' })
    )
  );

  return cont;
}

function actualizarActo(id, cambios) {
  const actos = obtener('actos') || [];
  const idx = actos.findIndex((a) => a.id === id);
  if (idx < 0) return;
  actos[idx] = { ...actos[idx], ...cambios };
  establecer('actos', [...actos]);
}

function iniciarActo(id) {
  actualizarActo(id, { estado: 'en_curso', inicioReal: new Date().toISOString() });
  emitir('acto:iniciado', { actoId: id });
  mostrarToast('Acto iniciado.');
  pintar();
}

function terminarActo(id) {
  actualizarActo(id, { estado: 'terminado', finReal: new Date().toISOString() });
  emitir('acto:terminado', { actoId: id });
  mostrarToast('Acto terminado.');
  pintar();
}

function extenderActo(id, minutos) {
  const actos = obtener('actos') || [];
  const acto = actos.find((a) => a.id === id);
  if (!acto) return;
  actualizarActo(id, { tiempoEstimadoMin: (acto.tiempoEstimadoMin || 15) + minutos });
  emitir('acto:extendido', { actoId: id, minutos });
  mostrarToast(`+${minutos} minutos.`);
  pintar();
}

function cortarActo(id) {
  const overlay = crearEtiqueta('div', { class: 'modal' });
  const caja = crearEtiqueta('div', { class: 'modal__caja' },
    crearEtiqueta('div', { class: 'modal__cabecera' },
      crearEtiqueta('div', { class: 'modal__titulo' }, 'Cortar el acto'),
      crearEtiqueta('button', { class: 'btn btn--fantasma btn--chico', texto: '✕', onclick: () => overlay.remove() })
    ),
    crearEtiqueta('div', { class: 'modal__cuerpo' },
      crearEtiqueta('p', {}, 'El acto se marcará como cortado. ¿Confirmas?')
    ),
    crearEtiqueta('div', { class: 'modal__pie' },
      crearEtiqueta('button', { class: 'btn btn--secundario', texto: 'Cancelar', onclick: () => overlay.remove() }),
      crearEtiqueta('button', {
        class: 'btn btn--peligro',
        texto: 'Cortar',
        onclick: () => {
          actualizarActo(id, { estado: 'saltado', finReal: new Date().toISOString() });
          emitir('acto:saltado', { actoId: id });
          mostrarToast('Acto cortado.', 'error');
          overlay.remove();
          pintar();
        },
      })
    )
  );
  overlay.append(caja);
  document.body.append(overlay);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
}

function iniciarCronometro() {
  if (intervaloCronometro) return;
  intervaloCronometro = setInterval(() => {
    const el = document.getElementById('escenario-tiempo');
    if (!el) return;
    const tocataId = obtener('tocataActivaId');
    const acto = actoEnCurso(tocataId);
    if (!acto || !acto.inicioReal) {
      el.textContent = '00:00';
      return;
    }
    const inicio = new Date(acto.inicioReal).getTime();
    const segundos = Math.floor((Date.now() - inicio) / 1000);
    el.textContent = segundosADigital(segundos);
  }, 1000);
}

export async function activar(contenedor) {
  raiz = contenedor;
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--escenario' });
  contenedor.append(contenedorPrincipal);
  pintar();
  iniciarCronometro();
}

export function limpiar() {
  if (intervaloCronometro) {
    clearInterval(intervaloCronometro);
    intervaloCronometro = null;
  }
  contenedorPrincipal = null;
  raiz = null;
}