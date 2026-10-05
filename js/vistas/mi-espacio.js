/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/mi-espacio.js
   Versión: 0.1.0
   Propósito: Vista del anfitrión. Muestra el espacio prestado,
              sus datos, las tocatas programadas y estadísticas
              básicas del uso del espacio.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { crearEtiqueta, limpiar as limpiarContenedor, formatearFechaLarga } from '../nucleo/utils.js';

const ICO = {
  casa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  llegada: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  usuarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  dinero: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>',
};

let contenedorPrincipal = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function espacioDeLaTocata() {
  const t = tocataActiva();
  if (!t) return null;
  return (obtener('espacios') || []).find((e) => e.id === t.espacioRef) || null;
}

function tocatasDelEspacio(espacioId) {
  return (obtener('tocatas') || [])
    .filter((t) => t.espacioRef === espacioId)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const espacio = espacioDeLaTocata();
  if (!espacio) {
    contenedorPrincipal.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin espacio asignado')
      )
    );
    return;
  }

  const tocatas = tocatasDelEspacio(espacio.id);
  const hoy = new Date().toDateString();
  const proximas = tocatas.filter((t) => new Date(t.fecha) >= new Date());
  const pasadas = tocatas.filter((t) => new Date(t.fecha) < new Date());

  contenedorPrincipal.append(
    pintarHero(espacio),
    pintarProximas(proximas),
    pintarEstadisticas(proximas.length, pasadas)
  );
}

function pintarHero(espacio) {
  const cont = crearEtiqueta('section', { class: 'espacio-hero' });

  const esHoy = (obtener('tocatas') || []).some(
    (t) => t.espacioRef === espacio.id && new Date(t.fecha).toDateString() === new Date().toDateString()
  );

  cont.append(
    crearEtiqueta('div', { class: 'espacio-hero__badges' },
      esHoy ? crearEtiqueta('span', { class: 'pildora pildora--exito pildora--vivo' },
        crearEtiqueta('span', { class: 'pildora__punto' }),
        'Tocata hoy'
      ) : null,
      crearEtiqueta('span', { class: 'pildora pildora--acento', texto: espacio.tipo })
    ),
    crearEtiqueta('h1', { class: 'espacio-hero__titulo', texto: espacio.nombre }),
    crearEtiqueta('p', { class: 'espacio-hero__desc' },
      'Tu espacio. Aquí se hacen las tocatas del colectivo.'
    ),
    crearEtiqueta('div', { class: 'espacio-hero__meta' },
      metaItem(ICO.llegada, (espacio.direccion || '') + ', ' + (espacio.comuna || '')),
      metaItem(ICO.usuarios, 'Aforo ' + espacio.capacidad + ' personas'),
      metaItem(ICO.calendario, 'Anfitrión: ' + (espacio.anfitrionNombre || '—'))
    )
  );

  return cont;
}

function metaItem(iconoHtml, texto) {
  return crearEtiqueta('span', { class: 'fila', style: { gap: '6px' } },
    crearEtiqueta('span', { html: iconoHtml, style: { width: '16px', height: '16px', display: 'inline-flex' } }),
    crearEtiqueta('span', { texto })
  );
}

function pintarProximas(proximas) {
  const cont = crearEtiqueta('section', {});
  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.calendario }),
        'Próximas tocatas en tu espacio'
      ),
      proximas.length > 0
        ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(proximas.length) })
        : null
    )
  );

  const lista = crearEtiqueta('div', { class: 'lista-tocatas-espacio' });

  if (proximas.length === 0) {
    lista.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin tocatas programadas')
      )
    );
  } else {
    proximas.forEach((t) => {
      const esHoy = new Date(t.fecha).toDateString() === new Date().toDateString();
      const d = new Date(t.fecha);
      const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

      lista.append(
        crearEtiqueta('div', { class: 'tocata-fila' + (esHoy ? ' tocata-fila--hoy' : '') },
          crearEtiqueta('div', { class: 'tocata-fila__fecha' },
            String(d.getDate()),
            crearEtiqueta('small', {}, meses[d.getMonth()])
          ),
          crearEtiqueta('div', { class: 'tocata-fila__info' },
            crearEtiqueta('div', { class: 'tocata-fila__nombre', texto: t.nombre }),
            crearEtiqueta('div', { class: 'tocata-fila__meta' },
              t.horaInicio + ' — ' + t.horaFinEstimada + ' · aforo ' + t.aforoMax
            )
          ),
          esHoy
            ? crearEtiqueta('span', { class: 'pildora pildora--exito' }, 'Hoy')
            : crearEtiqueta('span', { class: 'pildora pildora--neutral', texto: t.estado })
        )
      );
    });
  }

  cont.append(lista);
  return cont;
}

function pintarEstadisticas(totalProximas, pasadas) {
  const cont = crearEtiqueta('section', {});
  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.dinero }),
        'Uso del espacio'
      )
    )
  );

  const stats = crearEtiqueta('div', { class: 'espacio-stats' },
    crearEtiqueta('div', { class: 'tarjeta-metrica' },
      crearEtiqueta('div', { class: 'tarjeta-metrica__icono tarjeta-metrica__icono--acento', html: ICO.calendario }),
      crearEtiqueta('div', { class: 'tarjeta-metrica__cuerpo' },
        crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta' }, 'Tocatas este año'),
        crearEtiqueta('div', { class: 'tarjeta-metrica__valor', texto: String(totalProximas + pasadas.length) })
      )
    ),
    crearEtiqueta('div', { class: 'tarjeta-metrica' },
      crearEtiqueta('div', { class: 'tarjeta-metrica__icono tarjeta-metrica__icono--info', html: ICO.usuarios }),
      crearEtiqueta('div', { class: 'tarjeta-metrica__cuerpo' },
        crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta' }, 'Asistentes acumulados'),
        crearEtiqueta('div', { class: 'tarjeta-metrica__valor', texto: '124' })
      )
    ),
    crearEtiqueta('div', { class: 'tarjeta-metrica' },
      crearEtiqueta('div', { class: 'tarjeta-metrica__icono tarjeta-metrica__icono--exito', html: ICO.dinero }),
      crearEtiqueta('div', { class: 'tarjeta-metrica__cuerpo' },
        crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta' }, 'Aportes recibidos'),
        crearEtiqueta('div', { class: 'tarjeta-metrica__valor', texto: '$85k' })
      )
    )
  );

  cont.append(stats);
  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--mi-espacio' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}