/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/perfil-musico.js
   Versión: 0.2.0
   Propósito: Perfil del músico. Muestra los datos artísticos,
              sus próximas tocatas, el historial de participaciones
              y el contador de KYU.
              v0.2.0: se adopta el sistema visual:
                      · .cabecera-seccion para los encabezados
                      · .tarjeta-metrica para las estadísticas
                      · .tarjeta-accion para las presentaciones
                      · .pildora para el estado de cada acto
                      · .grilla para ordenar los bloques
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
  usuarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  musica: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  medalla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><polyline points="8.5 14 7 22 12 19 17 22 15.5 14"/></svg>',
  monedas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
};

let contenedorPrincipal = null;

function usuario() {
  return obtener('usuarioActual');
}

function misActos() {
  const u = usuario();
  if (!u) return [];
  return (obtener('actos') || []).filter((a) => a.musicoRef === u.id);
}

function misTocatas() {
  const tocatas = obtener('tocatas') || [];
  const ids = new Set(misActos().map((a) => a.tocataRef));
  return tocatas.filter((t) => ids.has(t.id));
}

function pintar() {
  if (!contenedorPrincipal) return;
  limpiarContenedor(contenedorPrincipal);

  const u = usuario();
  if (!u) {
    contenedorPrincipal.append(
      crearEtiqueta('div', { class: 'vacio' }, crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin usuario'))
    );
    return;
  }

  contenedorPrincipal.append(
    pintarCabecera(u),
    pintarEstadisticas(),
    pintarProximas(),
    pintarHistorial(),
    pintarKyu(u)
  );
}

function pintarCabecera(u) {
  const cont = crearEtiqueta('section', { class: 'perfil-musico__cabecera' });

  cont.append(
    crearEtiqueta('div', { class: 'avatar avatar--grande', texto: u.iniciales || '?' }),
    crearEtiqueta('div', { class: 'perfil-musico__info' },
      crearEtiqueta('h1', { class: 'perfil-musico__nombre', texto: u.nombre }),
      crearEtiqueta('div', { class: 'perfil-musico__apodo', texto: '“' + (u.apodo || '') + '”' }),
      crearEtiqueta('div', { class: 'perfil-musico__email texto-suave texto-chico', texto: u.email })
    ),
    crearEtiqueta('button', {
      class: 'btn btn--secundario btn--chico',
      texto: 'Editar perfil',
      onclick: () => emitir('navegar:solicitada', { vista: 'configuracion' }),
    })
  );

  return cont;
}

function pintarEstadisticas() {
  const actos = misActos();
  const terminados = actos.filter((a) => a.estado === 'terminado');
  const temas = terminados.reduce((sum, a) => sum + (a.canciones?.length || 0), 0);

  const cont = crearEtiqueta('section', { class: 'grilla grilla--4' });

  const items = [
    { valor: terminados.length, etiqueta: 'Actos', icono: ICO.musica, variante: 'acento' },
    { valor: temas, etiqueta: 'Temas tocados', icono: ICO.musica, variante: 'info' },
    { valor: misTocatas().length, etiqueta: 'Tocatas', icono: ICO.calendario, variante: 'acento' },
    { valor: '—', etiqueta: 'Recurrente', icono: ICO.medalla, variante: 'aviso' },
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

function pintarProximas() {
  const actos = misActos().filter((a) => ['anotado', 'aprobado'].includes(a.estado));
  const cont = crearEtiqueta('section', { class: 'perfil-musico__bloque' });

  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' }, 'Mis próximas presentaciones'),
      actos.length > 0
        ? crearEtiqueta('span', { class: 'cabecera-seccion__contador', texto: String(actos.length) })
        : null
    )
  );

  if (actos.length === 0) {
    cont.append(crearEtiqueta('p', { class: 'texto-suave' }, 'No tienes presentaciones agendadas.'));
    return cont;
  }

  const tocatas = obtener('tocatas') || [];
  actos.forEach((a) => {
    const t = tocatas.find((x) => x.id === a.tocataRef);
    if (!t) return;
    cont.append(
      crearEtiqueta('button', { class: 'tarjeta-accion', type: 'button', style: { marginBottom: '8px' } },
        crearEtiqueta('span', { class: 'tarjeta-accion__icono' },
          crearEtiqueta('span', { style: { fontWeight: '700' }, texto: String(new Date(t.fecha).getDate()) })
        ),
        crearEtiqueta('span', { class: 'tarjeta-accion__info' },
          crearEtiqueta('span', { class: 'tarjeta-accion__titulo', texto: t.nombre }),
          crearEtiqueta('span', { class: 'tarjeta-accion__descripcion',
            texto: 'Posición ' + a.ordenCola + ' en la cola · ' + a.tiempoEstimadoMin + ' min'
          })
        ),
        crearEtiqueta('span', { class: 'pildora pildora--' + (a.estado === 'aprobado' ? 'acento' : 'info'),
          texto: a.estado === 'aprobado' ? 'Aprobado' : 'Anotado'
        })
      )
    );
  });

  return cont;
}

function pintarHistorial() {
  const actos = misActos().filter((a) => a.estado === 'terminado' || a.estado === 'saltado');
  const cont = crearEtiqueta('section', { class: 'perfil-musico__bloque' });

  cont.append(
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' }, 'Historial'),
      actos.length > 0
        ? crearEtiqueta('span', { class: 'cabecera-seccion__contador cabecera-seccion__contador--neutro', texto: String(actos.length) })
        : null
    )
  );

  if (actos.length === 0) {
    cont.append(crearEtiqueta('p', { class: 'texto-suave' }, 'Todavía no hay presentaciones registradas.'));
    return cont;
  }

  const tocatas = obtener('tocatas') || [];
  actos.forEach((a) => {
    const t = tocatas.find((x) => x.id === a.tocataRef);
    if (!t) return;
    cont.append(
      crearEtiqueta('div', { class: 'perfil-musico__historial-item' },
        crearEtiqueta('div', { class: 'perfil-musico__historial-fecha', texto: formatearFechaLarga(t.fecha) }),
        crearEtiqueta('div', { class: 'perfil-musico__historial-nombre', texto: t.nombre }),
        crearEtiqueta('div', { class: 'perfil-musico__historial-meta',
          texto: (a.canciones?.length || 0) + ' temas'
        })
      )
    );
  });

  return cont;
}

function pintarKyu(u) {
  const cont = crearEtiqueta('section', { class: 'tarjeta' });

  cont.append(
    crearEtiqueta('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
      crearEtiqueta('div', { class: 'tarjeta-metrica__icono tarjeta-metrica__icono--aviso', html: ICO.monedas, style: { width: '56px', height: '56px' } }),
      crearEtiqueta('div', { style: { flex: '1' } },
        crearEtiqueta('div', { class: 'tarjeta-metrica__valor', texto: String(u.kyu || 0) }),
        crearEtiqueta('div', { class: 'tarjeta-metrica__etiqueta', texto: 'KYU acumulados' })
      ),
      crearEtiqueta('div', { class: 'texto-chico texto-suave', style: { maxWidth: '260px', textAlign: 'right' } },
        'El canje de KYU estará disponible próximamente en todo el ecosistema.'
      )
    )
  );

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--perfil-musico' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}