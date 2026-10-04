/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/cartelera.js
   Versión: 0.1.0
   Propósito: App pública de cartelera. Se abre en pestaña aparte
              (cartelera.html) y refleja el estado de la tocata
              activa en tiempo real vía localStorage + storage
              event. Pensada para proyectar en un televisor.
   ================================================================ */

import { leerCartelera } from './nucleo/sincronizar-cartelera.js';
import { crearEtiqueta, limpiar as limpiarContenedor, buscar } from './nucleo/utils.js';

const CLAVE = 'latocata:cartelera';
let raiz = null;

function principal() {
  raiz = document.getElementById('cartelera');
  if (!raiz) return;

  limpiarContenedor(raiz);

  const datos = leerCartelera();
  if (!datos) {
    pintarVacio();
    return;
  }

  pintarCartelera(datos);

  // Escuchar cambios entre pestañas
  window.addEventListener('storage', (ev) => {
    if (ev.key !== CLAVE) return;
    const nuevo = leerCartelera();
    if (nuevo) {
      limpiarContenedor(raiz);
      pintarCartelera(nuevo);
    }
  });

  // Refresco periódico del cronómetro
  setInterval(actualizarCronometros, 1000);
}

function pintarVacio() {
  raiz.append(
    crearEtiqueta('div', { class: 'cartelera-vacia' },
      crearEtiqueta('h1', {}, 'LaTocata'),
      crearEtiqueta('p', {}, 'No hay una tocata activa en este momento.'),
      crearEtiqueta('p', { class: 'texto-suave' }, 'Abre el panel del organizador para iniciar una tocata.')
    )
  );
}

function pintarCartelera(datos) {
  raiz.append(
    construirCabecera(datos),
    construirCuerpo(datos),
    construirPie(datos)
  );
}

function construirCabecera(datos) {
  const cab = crearEtiqueta('header', { class: 'cartelera__cabecera' });

  cab.append(
    crearEtiqueta('div', { class: 'cartelera__marca' },
      crearEtiqueta('div', { class: 'cartelera__logo', texto: 'LT' }),
      crearEtiqueta('div', {},
        crearEtiqueta('div', { class: 'cartelera__app', texto: 'LaTocata' }),
        crearEtiqueta('div', { class: 'cartelera__grupo', texto: datos.grupo?.nombre || '' })
      )
    )
  );

  const info = crearEtiqueta('div', { class: 'cartelera__info' },
    crearEtiqueta('div', { class: 'cartelera__tocata', texto: datos.tocata.nombre }),
    crearEtiqueta('div', { class: 'cartelera__tipo', texto: etiquetaTipo(datos.tocata.tipo) })
  );
  cab.append(info);

  return cab;
}

function construirCuerpo(datos) {
  const cuerpo = crearEtiqueta('main', { class: 'cartelera__cuerpo' });

  // Columna izquierda: acto actual
  const colActual = crearEtiqueta('section', { class: 'cartelera__actual' });

  if (datos.actoActual) {
    colActual.append(construirActoActual(datos.actoActual));
  } else if (datos.tocata.estado === 'finalizada') {
    colActual.append(
      crearEtiqueta('div', { class: 'cartelera__fin' },
        crearEtiqueta('div', { class: 'cartelera__fin-titulo' }, 'Gracias por venir'),
        crearEtiqueta('p', {}, 'La tocata ha terminado. Nos vemos en la próxima.')
      )
    );
  } else if (datos.tocata.estado === 'pausada') {
    colActual.append(
      crearEtiqueta('div', { class: 'cartelera__pausa' },
        crearEtiqueta('div', { class: 'cartelera__pausa-titulo' }, 'Pausa'),
        crearEtiqueta('p', {}, 'Volvemos en unos minutos.')
      )
    );
  } else {
    colActual.append(
      crearEtiqueta('div', { class: 'cartelera__esperando' },
        crearEtiqueta('div', { class: 'cartelera__esperando-titulo' }, 'Comenzando pronto'),
        crearEtiqueta('p', {}, 'El primer acto sube al escenario en unos minutos.')
      )
    );
  }

  cuerpo.append(colActual);

  // Columna derecha: próximos
  const colProximos = crearEtiqueta('aside', { class: 'cartelera__proximos' });
  colProximos.append(
    crearEtiqueta('div', { class: 'cartelera__proximos-titulo' }, 'Vienen ahora')
  );

  if (datos.proximos.length === 0) {
    colProximos.append(
      crearEtiqueta('p', { class: 'texto-suave', estilo: { padding: '16px' } },
        datos.yaTocaron.length > 0 ? 'Es el último acto de la jornada.' : 'Aún no hay actos confirmados.'
      )
    );
  } else {
    datos.proximos.forEach((acto, i) => {
      colProximos.append(construirProximo(acto, i + 1));
    });
  }

  // Avisos al pie de la columna derecha
  if (datos.avisos.length > 0) {
    const bloqueAvisos = crearEtiqueta('div', { class: 'cartelera__avisos' },
      crearEtiqueta('div', { class: 'cartelera__avisos-titulo' }, 'Avisos')
    );
    datos.avisos.forEach((a) => {
      bloqueAvisos.append(
        crearEtiqueta('div', { class: 'cartelera__aviso' },
          crearEtiqueta('div', { class: 'cartelera__aviso-titulo', texto: a.titulo }),
          crearEtiqueta('div', { class: 'cartelera__aviso-mensaje', texto: a.mensaje })
        )
      );
    });
    colProximos.append(bloqueAvisos);
  }

  cuerpo.append(colProximos);

  return cuerpo;
}

function construirActoActual(acto) {
  const cont = crearEtiqueta('div', { class: 'cartelera__acto-actual' });

  cont.append(
    crearEtiqueta('div', { class: 'cartelera__badge-vivo' },
      crearEtiqueta('span', { class: 'cartelera__punto-vivo' }),
      crearEtiqueta('span', {}, 'EN VIVO')
    )
  );

  cont.append(
    crearEtiqueta('div', { class: 'cartelera__nombre-actual', texto: acto.nombreArtistico })
  );

  const meta = [];
  if (acto.genero) meta.push(etiquetaGenero(acto.genero));
  if (acto.instrumentos.length > 0) meta.push(acto.instrumentos.join(', '));
  if (acto.integrantes.length > 1) meta.push(acto.integrantes.length + ' integrantes');

  if (meta.length > 0) {
    cont.append(
      crearEtiqueta('div', { class: 'cartelera__meta-actual', texto: meta.join(' · ') })
    );
  }

  // Canciones
  if (acto.canciones.length > 0) {
    const canciones = crearEtiqueta('div', { class: 'cartelera__canciones' });
    canciones.append(
      crearEtiqueta('div', { class: 'cartelera__canciones-titulo' }, 'Temas')
    );
    acto.canciones.forEach((c) => {
      canciones.append(
        crearEtiqueta('div', { class: 'cartelera__cancion' },
          crearEtiqueta('span', { texto: c.titulo }),
          c.duracionAprox ? crearEtiqueta('span', { class: 'cartelera__cancion-dur', texto: c.duracionAprox + ' min' }) : null
        )
      );
    });
    cont.append(canciones);
  }

  if (acto.hastaQueLoBajen) {
    cont.append(
      crearEtiqueta('div', { class: 'cartelera__hasta' }, '🎵 Toca hasta que lo bajen')
    );
  }

  // Cronómetro
  const cronometro = crearEtiqueta('div', { class: 'cartelera__cronometro' },
    crearEtiqueta('div', { class: 'cartelera__cronometro-tiempo', id: 'cron-actual', texto: '00:00' }),
    crearEtiqueta('div', { class: 'cartelera__cronometro-etiqueta' }, 'tiempo en escenario')
  );
  cont.append(cronometro);

  return cont;
}

function construirProximo(acto, numero) {
  const cont = crearEtiqueta('div', { class: 'cartelera__proximo' });

  const num = crearEtiqueta('div', { class: 'cartelera__proximo-numero', texto: String(numero) });
  const info = crearEtiqueta('div', { class: 'cartelera__proximo-info' },
    crearEtiqueta('div', { class: 'cartelera__proximo-nombre', texto: acto.nombreArtistico }),
    crearEtiqueta('div', { class: 'cartelera__proximo-meta',
      texto: [acto.genero, acto.instrumentos.slice(0, 2).join(', ')].filter(Boolean).join(' · ')
    })
  );

  cont.append(num, info);

  if (acto.hastaQueLoBajen) {
    cont.append(
      crearEtiqueta('div', { class: 'cartelera__proximo-badge', texto: 'hasta que lo bajen' })
    );
  }

  return cont;
}

function construirPie(datos) {
  const pie = crearEtiqueta('footer', { class: 'cartelera__pie' });

  pie.append(
    crearEtiqueta('div', { class: 'cartelera__qr' },
      crearEtiqueta('div', { class: 'cartelera__qr-caja' }, 'QR'),
      crearEtiqueta('div', { class: 'cartelera__qr-texto' },
        crearEtiqueta('div', { class: 'cartelera__qr-titulo' }, '¿Quieres tocar?'),
        crearEtiqueta('div', { class: 'cartelera__qr-sub' }, 'Escanea y anótate')
      )
    )
  );

  const contadorActos = crearEtiqueta('div', { class: 'cartelera__contador' },
    crearEtiqueta('div', { class: 'cartelera__contador-num', texto: String(datos.yaTocaron.length) }),
    crearEtiqueta('div', { class: 'cartelera__contador-etq' }, 'actos ya tocaron')
  );
  pie.append(contadorActos);

  if (datos.votacion) {
    pie.append(
      crearEtiqueta('div', { class: 'cartelera__votacion' },
        crearEtiqueta('div', { class: 'cartelera__votacion-titulo' }, datos.votacion.titulo),
        crearEtiqueta('div', { class: 'cartelera__votacion-sub' }, 'Vota desde tu celular')
      )
    );
  }

  return pie;
}

/* ---------- Cronómetros ---------- */

function actualizarCronometros() {
  const cron = buscar('#cron-actual');
  if (!cron) return;

  const datos = leerCartelera();
  if (!datos?.actoActual?.inicioReal) {
    cron.textContent = '00:00';
    return;
  }

  const inicio = new Date(datos.actoActual.inicioReal).getTime();
  const ahora = Date.now();
  const segundos = Math.floor((ahora - inicio) / 1000);

  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  cron.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ---------- Etiquetas ---------- */

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

function etiquetaGenero(genero) {
  return genero.charAt(0).toUpperCase() + genero.slice(1);
}

principal();