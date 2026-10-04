/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/perfil-tocata.js
   Versión: 0.2.0
   Propósito: Ficha pública de una tocata. Muestra la info, la
              cartelera completa, fotos y el resumen si ya pasó.
              v0.2.0: se adopta el sistema visual:
                      · .cabecera-seccion para el lineup y resumen
                      · .pildora para el estado y el en vivo
                      · .tarjeta-metrica para los números del
                        resumen
              v0.1.0: versión inicial.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  formatearFechaLarga,
} from '../nucleo/utils.js';

const ICO = {
  cola: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.4"/><circle cx="4" cy="12" r="1.4"/><circle cx="4" cy="18" r="1.4"/></svg>',
  grafico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
};

let contenedorPrincipal = null;

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const id = obtener('tocataActivaId');
  const tocatas = obtener('tocatas') || [];
  const tocata = tocatas.find((t) => t.id === id);

  if (!tocata) {
    contenedorPrincipal.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Tocata no encontrada')
      )
    );
    return;
  }

  const espacio = (obtener('espacios') || []).find((e) => e.id === tocata.espacioRef);
  const actos = (obtener('actos') || [])
    .filter((a) => a.tocataRef === id && a.estado !== 'rechazado')
    .sort((a, b) => a.ordenCola - b.ordenCola);

  contenedorPrincipal.append(
    pintarHero(tocata, espacio),
    pintarLineup(actos),
    pintarEstado(tocata)
  );
}

function pintarHero(tocata, espacio) {
  const cont = crearEtiqueta('section', { class: 'perfil-tocata__hero' });

  cont.append(
    crearEtiqueta('span', { class: 'pildora pildora--acento', texto: tocata.tipo }),
    crearEtiqueta('h1', { class: 'perfil-tocata__titulo', texto: tocata.nombre }),
    crearEtiqueta('p', { class: 'perfil-tocata__descripcion', texto: tocata.descripcion || '' }),
    crearEtiqueta('div', { class: 'perfil-tocata__meta' },
      crearEtiqueta('div', { class: 'perfil-tocata__meta-item', texto: '📅 ' + formatearFechaLarga(tocata.fecha) }),
      crearEtiqueta('div', { class: 'perfil-tocata__meta-item', texto: '🕐 ' + tocata.horaInicio + ' — ' + tocata.horaFinEstimada }),
      espacio ? crearEtiqueta('div', { class: 'perfil-tocata__meta-item', texto: '📍 ' + espacio.nombre + ', ' + espacio.comuna }) : null
    )
  );

  return cont;
}

function pintarLineup(actos) {
  const cont = crearEtiqueta('section', { class: 'perfil-tocata__lineup' });

  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.cola }),
        'Lineup'
      ),
      actos.length > 0
        ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(actos.length) })
        : null
    )
  );

  if (actos.length === 0) {
    cont.append(crearEtiqueta('p', { class: 'texto-suave' }, 'Aún no hay actos confirmados.'));
    return cont;
  }

  actos.forEach((a, i) => {
    cont.append(
      crearEtiqueta('div', { class: 'perfil-tocata__lineup-item' },
        crearEtiqueta('div', { class: 'perfil-tocata__lineup-numero', texto: String(i + 1) }),
        crearEtiqueta('div', { class: 'perfil-tocata__lineup-info' },
          crearEtiqueta('div', { class: 'perfil-tocata__lineup-nombre', texto: a.nombreArtistico }),
          crearEtiqueta('div', { class: 'perfil-tocata__lineup-meta',
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

  return cont;
}

function pintarEstado(tocata) {
  const cont = crearEtiqueta('section', { class: 'perfil-tocata__estado' });

  const map = {
    borrador: { variante: 'neutral', texto: 'Borrador' },
    publicada: { variante: 'info', texto: 'Publicada, aún no comienza' },
    en_curso: { variante: 'exito', texto: 'En curso ahora mismo' },
    pausada: { variante: 'aviso', texto: 'Pausada' },
    finalizada: { variante: 'neutral', texto: 'Finalizada' },
    cancelada: { variante: 'error', texto: 'Cancelada' },
  };
  const cfg = map[tocata.estado] || { variante: 'neutral', texto: tocata.estado };

  cont.append(
    crearEtiqueta('span', { class: `pildora pildora--${cfg.variante}`, texto: cfg.texto })
  );

  if (tocata.estado === 'finalizada') {
    const resumen = (obtener('resumenes') || []).find((r) => r.tocataRef === tocata.id);
    if (resumen) {
      cont.append(
        crearEtiqueta('div', { style: { marginTop: '16px' } },
          crearEtiqueta('header', { class: 'cabecera-seccion' },
            crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' },
              crearEtiqueta('span', { html: ICO.grafico }),
              'Resumen de la jornada'
            )
          ),
          crearEtiqueta('div', { class: 'grilla grilla--3' },
            itemResumen(resumen.cantidadActos, 'actos'),
            itemResumen(resumen.cantidadTemas, 'temas'),
            itemResumen(resumen.cantidadIngresos, 'asistentes')
          )
        )
      );
    }
  }

  return cont;
}

function itemResumen(valor, etiqueta) {
  return crearEtiqueta('div', { class: 'tarjeta-metrica' },
    crearEtiqueta('div', { class: 'tarjeta-metrica__cuerpo', style: { textAlign: 'center' } },
      crearEtiqueta('div', { class: 'tarjeta-metrica__valor', texto: String(valor || 0) }),
      crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta', texto: etiqueta })
    )
  );
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--perfil-tocata' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}