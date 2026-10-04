/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/inicio.js
   Versión: 0.2.0
   Propósito: Pantalla de inicio. Muestra la tocata activa como
              foco principal y las próximas tocatas. Es la primera
              vista que ve un usuario recién llegado.
              v0.2.0: se adopta el sistema visual:
                      · .cabecera-seccion para los encabezados
                      · .tarjeta-accion para las tocatas listadas
                      · .pildora para el tipo de cada tocata
                      · .tarjeta-metrica para los números del hero
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import { emitir } from '../nucleo/bus-eventos.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  formatearFechaLarga,
} from '../nucleo/utils.js';

const ICO = {
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  ubicacion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>',
  cartelera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>',
  microfono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>',
};

let contenedorPrincipal = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function tocatasPublicadas() {
  return (obtener('tocatas') || []).filter(
    (t) => t.estado === 'publicada' || t.estado === 'en_curso'
  );
}

function espacioDe(tocata) {
  if (!tocata) return null;
  return (obtener('espacios') || []).find((e) => e.id === tocata.espacioRef) || null;
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

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const tocata = tocataActiva();
  const grupo = obtener('grupo');

  contenedorPrincipal.append(
    pintarHero(tocata, grupo),
    pintarProximas(),
    pintarComoTocar()
  );
}

function pintarHero(tocata, grupo) {
  const cont = crearEtiqueta('section', { class: 'inicio__hero' });

  if (!tocata) {
    cont.append(
      crearEtiqueta('h1', { class: 'inicio__hero-titulo', texto: 'LaTocata' }),
      crearEtiqueta('p', { class: 'inicio__hero-sub', texto: 'No hay una tocata activa en este momento.' })
    );
    return cont;
  }

  const espacio = espacioDe(tocata);

  cont.append(
    crearEtiqueta('div', { class: 'inicio__hero-eyebrow' }, grupo?.nombre || 'LaTocata'),
    crearEtiqueta('span', { class: 'pildora pildora--acento', texto: etiquetaTipo(tocata.tipo) }),
    crearEtiqueta('h1', { class: 'inicio__hero-titulo', texto: tocata.nombre }),
    crearEtiqueta('p', { class: 'inicio__hero-sub', texto: tocata.descripcion || '' }),
    crearEtiqueta('div', { class: 'inicio__hero-meta' },
      crearEtiqueta('span', { html: ICO.calendario + ' ' + formatearFechaLarga(tocata.fecha) }),
      espacio ? crearEtiqueta('span', { html: ICO.ubicacion + ' ' + espacio.nombre }) : null,
      crearEtiqueta('span', { html: ICO.reloj + ' ' + tocata.horaInicio })
    ),
    crearEtiqueta('div', { class: 'inicio__hero-acciones' },
      crearEtiqueta('a', {
        class: 'btn btn--primario btn--grande',
        href: 'cartelera.html',
        target: '_blank',
        html: ICO.cartelera + ' Ver cartelera en vivo',
      }),
      crearEtiqueta('button', {
        class: 'btn btn--secundario btn--grande',
        texto: 'Quiero tocar',
        onclick: () => emitir('navegar:solicitada', { vista: 'registro' }),
      })
    )
  );

  return cont;
}

function pintarProximas() {
  const tocatas = tocatasPublicadas();
  const cont = crearEtiqueta('section', { class: 'inicio__bloque' });

  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.calendario }),
        'Próximas tocatas'
      ),
      tocatas.length > 0
        ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(tocatas.length) })
        : null
    )
  );

  if (tocatas.length === 0) {
    cont.append(crearEtiqueta('p', { class: 'texto-suave' }, 'No hay tocatas publicadas.'));
    return cont;
  }

  const grilla = crearEtiqueta('div', { class: 'conmutador-grilla' });
  tocatas.forEach((t) => {
    const esp = espacioDe(t);
    grilla.append(
      crearEtiqueta('button', {
        class: 'tarjeta-accion',
        type: 'button',
        onclick: () => emitir('navegar:solicitada', { vista: 'perfil-tocata' }),
      },
        crearEtiqueta('div', { class: 'inicio__tarjeta-fecha', style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', background: 'var(--fondo-2)', borderRadius: 'var(--radio-md)', flexShrink: '0' } },
          crearEtiqueta('span', { style: { fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: '700', lineHeight: '1', color: 'var(--acento)' }, texto: String(new Date(t.fecha).getDate()) }),
          crearEtiqueta('span', { style: { fontSize: '0.68rem', color: 'var(--texto-suave)', letterSpacing: '0.08em' }, texto: nombreMes(t.fecha) })
        ),
        crearEtiqueta('span', { class: 'tarjeta-accion__info' },
          crearEtiqueta('span', { class: 'tarjeta-accion__titulo', texto: t.nombre }),
          crearEtiqueta('span', { class: 'tarjeta-accion__descripcion',
            texto: [esp?.nombre, t.horaInicio].filter(Boolean).join(' · ')
          })
        ),
        crearEtiqueta('span', { class: 'tarjeta-accion__flecha', texto: '→' })
      )
    );
  });

  cont.append(grilla);
  return cont;
}

function pintarComoTocar() {
  const cont = crearEtiqueta('section', { class: 'inicio__bloque inicio__bloque--cta' });

  cont.append(
    crearEtiqueta('h2', { class: 'inicio__bloque-titulo' }, '¿Quieres sumarte a tocar?'),
    crearEtiqueta('p', { class: 'texto-suave' }, 'Anótate desde el celular y aparecerás en la cola de la próxima tocata.'),
    crearEtiqueta('button', {
      class: 'btn btn--primario',
      html: ICO.microfono + ' Anotarme',
      onclick: () => emitir('navegar:solicitada', { vista: 'registro' }),
    })
  );

  return cont;
}

function nombreMes(fecha) {
  const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return meses[new Date(fecha).getMonth()];
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--inicio' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}