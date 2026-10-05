/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/cartelera-vivo.js
   Versión: 0.1.0
   Propósito: Vista interna de la cartelera en vivo. Muestra lo
              mismo que ve el público en la app pública, pero
              desde dentro del shell, para que el organizador o
              el anfitrión puedan monitorear la jornada sin
              cambiar de pestaña.
   ================================================================ */

import { obtener } from '../nucleo/estado.js';
import {
  crearEtiqueta,
  limpiar as limpiarContenedor,
  segundosADigital,
} from '../nucleo/utils.js';

const ICO = {
  vivo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/><circle cx="12" cy="11" r="2"/></svg>',
};

let contenedorPrincipal = null;
let intervaloCronometro = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function actosDe(tocataId) {
  return (obtener('actos') || [])
    .filter((a) => a.tocataRef === tocataId && a.estado !== 'rechazado')
    .sort((a, b) => a.ordenCola - b.ordenCola);
}

function actoEnCurso(actos) {
  return actos.find((a) => a.estado === 'en_curso') || null;
}

function siguientes(actos, orden) {
  return actos
    .filter((a) => a.estado === 'aprobado' && a.ordenCola > (orden || 0))
    .slice(0, 4);
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

  const actos = actosDe(tocata.id);
  const enCurso = actoEnCurso(actos);
  const sig = siguientes(actos, enCurso ? enCurso.ordenCola : 0);

  contenedorPrincipal.append(
    pintarCabecera(tocata),
    enCurso ? pintarEnVivo(enCurso, sig) : pintarSinActo(),
    pintarTocataInfo(tocata)
  );
}

function pintarCabecera(tocata) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.vivo }),
        'Cartelera en vivo'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, tocata.nombre)
    )
  );
}

function pintarEnVivo(acto, sig) {
  const cont = crearEtiqueta('section', { class: 'cartelera-interna' });

  cont.append(
    crearEtiqueta('div', { class: 'cartelera-interna__badge' },
      crearEtiqueta('span', { class: 'cartelera-interna__punto' }),
      'En vivo'
    ),
    crearEtiqueta('h2', { class: 'cartelera-interna__nombre', texto: acto.nombreArtistico })
  );

  const meta = [acto.genero, (acto.instrumentos || []).join(', ')].filter(Boolean);
  if (meta.length > 0) {
    cont.append(
      crearEtiqueta('div', { class: 'cartelera-interna__meta', texto: meta.join(' · ') })
    );
  }

  cont.append(
    crearEtiqueta('div', { class: 'cartelera-interna__cronometro' },
      crearEtiqueta('span', { id: 'cartelera-interna-crono', class: 'cartelera-interna__tiempo', texto: '00:00' }),
      crearEtiqueta('span', { class: 'texto-suave texto-chico' }, 'en escenario')
    )
  );

  if (sig.length > 0) {
    const bloque = crearEtiqueta('div', { class: 'cartelera-interna__siguientes' });
    bloque.append(
      crearEtiqueta('div', { class: 'cartelera-interna__siguientes-titulo' }, 'Siguen')
    );
    sig.forEach((a) => {
      bloque.append(
        crearEtiqueta('div', { class: 'cartelera-interna__siguiente' },
          crearEtiqueta('span', { class: 'cartelera-interna__siguiente-num', texto: String(a.ordenCola) }),
          crearEtiqueta('span', { class: 'cartelera-interna__siguiente-nombre', texto: a.nombreArtistico })
        )
      );
    });
    cont.append(bloque);
  }

  return cont;
}

function pintarSinActo() {
  return crearEtiqueta('div', { class: 'tarjeta', style: { padding: '32px 24px', textAlign: 'center' } },
    crearEtiqueta('div', { class: 'vacio__titulo', texto: 'La tocata aún no comienza' }),
    crearEtiqueta('p', { class: 'texto-suave', style: { marginTop: '8px' } },
      'Cuando alguien suba al escenario, aparecerá aquí.'
    )
  );
}

function pintarTocataInfo(tocata) {
  const espacio = (obtener('espacios') || []).find((e) => e.id === tocata.espacioRef);

  return crearEtiqueta('section', {},
    crearEtiqueta('header', { class: 'cabecera-seccion' },
      crearEtiqueta('h2', { class: 'cabecera-seccion__titulo' }, 'La tocata de hoy')
    ),
    crearEtiqueta('div', { class: 'tarjeta' },
      crearEtiqueta('div', { class: 'tarjeta__titulo', texto: tocata.nombre }),
      crearEtiqueta('div', { class: 'texto-suave texto-chico', style: { marginTop: '6px' } },
        tocata.horaInicio + ' — ' + tocata.horaFinEstimada
      ),
      espacio
        ? crearEtiqueta('div', { class: 'texto-suave texto-chico' },
            espacio.nombre + ', ' + espacio.direccion + ', ' + espacio.comuna
          )
        : null
    )
  );
}

function iniciarCronometro() {
  if (intervaloCronometro) return;
  intervaloCronometro = setInterval(() => {
    const el = document.getElementById('cartelera-interna-crono');
    if (!el) return;
    const tocata = tocataActiva();
    if (!tocata) return;
    const actos = actosDe(tocata.id);
    const enCurso = actoEnCurso(actos);
    if (!enCurso || !enCurso.inicioReal) {
      el.textContent = '00:00';
      return;
    }
    const inicio = new Date(enCurso.inicioReal).getTime();
    const segundos = Math.floor((Date.now() - inicio) / 1000);
    el.textContent = segundosADigital(segundos);
  }, 1000);
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--cartelera-vivo' });
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
}