/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/vistas/caja.js
   Versión: 0.1.0
   Propósito: Caja del evento. Muestra el saldo, los movimientos
              y permite registrar ingresos o gastos.
   ================================================================ */

import { obtener, establecer } from '../nucleo/estado.js';
import { emitir } from '../nucleo/bus-eventos.js';
import { crearEtiqueta, limpiar as limpiarContenedor, mostrarToast } from '../nucleo/utils.js';

const ICO = {
  dinero: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>',
};

let contenedorPrincipal = null;

function tocataActiva() {
  const id = obtener('tocataActivaId');
  return (obtener('tocatas') || []).find((t) => t.id === id) || null;
}

function movimientosDe(tocataId) {
  return (obtener('caja') || []).filter((c) => c.tocataRef === tocataId);
}

function saldo(movs) {
  return movs.reduce((s, m) => s + m.monto, 0);
}

function formatearCLP(n) {
  const signo = n < 0 ? '−' : '';
  return signo + '$' + Math.abs(n).toLocaleString('es-CL');
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

  const movs = movimientosDe(tocata.id);

  contenedorPrincipal.append(
    pintarCabecera(tocata),
    pintarSaldo(saldo(movs)),
    pintarFormulario(tocata.id),
    pintarLista(movs)
  );
}

function pintarCabecera(tocata) {
  return crearEtiqueta('header', { class: 'cabecera-seccion' },
    crearEtiqueta('div', {},
      crearEtiqueta('h1', { class: 'cabecera-seccion__titulo' },
        crearEtiqueta('span', { html: ICO.dinero }),
        'Caja del evento'
      ),
      crearEtiqueta('p', { class: 'texto-suave' }, tocata.nombre)
    )
  );
}

function pintarSaldo(s) {
  const clase = s >= 0 ? 'caja__saldo-monto--positivo' : 'caja__saldo-monto--negativo';
  return crearEtiqueta('div', { class: 'caja__saldo' },
    crearEtiqueta('div', { class: 'caja__saldo-etq' }, 'Saldo actual'),
    crearEtiqueta('div', { class: 'caja__saldo-monto ' + clase, texto: formatearCLP(s) })
  );
}

function pintarFormulario(tocataId) {
  const cont = crearEtiqueta('div', { class: 'caja-form' });

  const campoConcepto = crearEtiqueta('div', { class: 'caja-form__campo caja-form__campo--ancho' },
    crearEtiqueta('label', { class: 'caja-form__etq' }, 'Concepto'),
    crearEtiqueta('input', { class: 'campo__entrada', id: 'caja-concepto', placeholder: 'Ej: Gorra, carbón, cuerdas' })
  );
  const campoMonto = crearEtiqueta('div', { class: 'caja-form__campo' },
    crearEtiqueta('label', { class: 'caja-form__etq' }, 'Monto'),
    crearEtiqueta('input', { class: 'campo__entrada', id: 'caja-monto', type: 'number', min: '0', placeholder: '0' })
  );

  const btnIngreso = crearEtiqueta('button', {
    class: 'btn btn--primario',
    type: 'button',
    texto: '+ Ingreso',
    onclick: () => registrar(tocataId, 1),
  });
  const btnGasto = crearEtiqueta('button', {
    class: 'btn btn--secundario',
    type: 'button',
    texto: '− Gasto',
    onclick: () => registrar(tocataId, -1),
  });

  cont.append(campoConcepto, campoMonto, btnIngreso, btnGasto);
  return cont;
}

function registrar(tocataId, signo) {
  const concepto = document.getElementById('caja-concepto').value.trim() || 'Movimiento';
  const monto = Number(document.getElementById('caja-monto').value);
  if (!monto || monto <= 0) {
    mostrarToast('Ingresa un monto mayor a cero.', 'error');
    return;
  }
  const caja = obtener('caja') || [];
  caja.push({
    id: 'caja_' + Date.now(),
    tocataRef: tocataId,
    concepto,
    monto: monto * signo,
  });
  establecer('caja', [...caja]);
  emitir('caja:movimiento_registrado', { signo, monto });
  mostrarToast(signo > 0 ? 'Ingreso registrado.' : 'Gasto registrado.');
  pintar();
}

function pintarLista(movs) {
  const cont = crearEtiqueta('div', { class: 'lista-movimientos' });

  if (movs.length === 0) {
    cont.append(
      crearEtiqueta('div', { class: 'vacio' },
        crearEtiqueta('div', { class: 'vacio__titulo' }, 'Sin movimientos registrados')
      )
    );
    return cont;
  }

  movs.forEach((m) => {
    const esIngreso = m.monto > 0;
    cont.append(
      crearEtiqueta('div', { class: 'movimiento' },
        crearEtiqueta('span', { class: 'movimiento__concepto', texto: m.concepto }),
        crearEtiqueta('span', {
          class: 'movimiento__monto ' + (esIngreso ? 'movimiento__monto--ingreso' : 'movimiento__monto--gasto'),
          texto: formatearCLP(m.monto),
        })
      )
    );
  });

  return cont;
}

export async function activar(contenedor) {
  contenedorPrincipal = crearEtiqueta('div', { class: 'vista vista--caja' });
  contenedor.append(contenedorPrincipal);
  pintar();
}

export function limpiar() {
  contenedorPrincipal = null;
}