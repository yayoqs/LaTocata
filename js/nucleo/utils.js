/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/utils.js
   Versión: 0.2.0
   Propósito: Utilidades compartidas. Fechas, textos, DOM,
              identificadores, atajos de teclado.
              v0.2.0: se agrega atajoBusqueda(entrada, limpiar) que
                      registra Ctrl+K / Cmd+K para enfocar un campo
                      de búsqueda. Devuelve una función para
                      desregistrar el atajo. Se usa desde las vistas
                      que montan un .buscador.
              v0.1.1: crearEtiqueta maneja propiedades booleanas.
              v0.1.0: versión inicial.
   ================================================================ */

/* DOM */
const PROPS_BOOLEANAS = ['disabled', 'checked', 'readOnly', 'selected', 'hidden'];

export function crearEtiqueta(etiqueta, props = {}, ...hijos) {
  const el = document.createElement(etiqueta);

  Object.entries(props).forEach(([clave, valor]) => {
    if (clave === 'class' || clave === 'className') {
      el.className = valor;
    } else if (clave === 'estilo') {
      Object.assign(el.style, valor);
    } else if (clave === 'onclick') {
      el.addEventListener('click', valor);
    } else if (clave === 'html') {
      el.innerHTML = valor;
    } else if (clave === 'texto') {
      el.textContent = valor;
    } else if (PROPS_BOOLEANAS.includes(clave)) {
      el[clave] = !!valor;
    } else if (clave.startsWith('data-')) {
      el.setAttribute(clave, valor);
    } else {
      el.setAttribute(clave, valor);
    }
  });

  hijos.forEach((hijo) => {
    if (hijo == null || hijo === false) return;
    if (typeof hijo === 'string' || typeof hijo === 'number') {
      el.append(String(hijo));
    } else if (hijo instanceof Node) {
      el.append(hijo);
    } else if (Array.isArray(hijo)) {
      hijo.forEach((h) => {
        if (h instanceof Node) el.append(h);
      });
    }
  });

  return el;
}

export function limpiar(contenedor) {
  if (!contenedor) return;
  while (contenedor.firstChild) contenedor.removeChild(contenedor.firstChild);
}

export function buscar(selector, contenedor = document) {
  return contenedor.querySelector(selector);
}

export function buscarTodos(selector, contenedor = document) {
  return Array.from(contenedor.querySelectorAll(selector));
}

/* Fechas */
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function formatearFechaLarga(fecha) {
  const d = new Date(fecha);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatearFechaCorta(fecha) {
  const d = new Date(fecha);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function formatearHora(fecha) {
  const d = new Date(fecha);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatearDuracion(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export function segundosADigital(segundos) {
  const s = Math.max(0, Math.floor(segundos));
  const m = Math.floor(s / 60);
  const seg = s % 60;
  return `${String(m).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

/* Identificadores */
export function generarId(prefijo = 'id') {
  return `${prefijo}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function slugificar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* Texto */
export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export function truncar(texto, largo) {
  if (!texto) return '';
  return texto.length > largo ? texto.slice(0, largo - 1) + '…' : texto;
}

/* Toast */
export function mostrarToast(mensaje, tipo = '') {
  let cont = document.querySelector('.toast-cont');
  if (!cont) {
    cont = document.createElement('div');
    cont.className = 'toast-cont';
    document.body.append(cont);
  }
  const toast = document.createElement('div');
  toast.className = 'toast' + (tipo ? ` toast--${tipo}` : '');
  toast.textContent = mensaje;
  cont.append(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 320);
  }, 2800);
}

/* Atajos de teclado */

/**
 * Registra el atajo Ctrl+K (Cmd+K en Mac) para enfocar un campo
 * de búsqueda. Devuelve una función para desregistrar el atajo.
 *
 * @param {HTMLInputElement} entrada
 * @returns {Function} limpiarAtajo
 */
export function atajoBusqueda(entrada) {
  if (!entrada) return () => {};

  const manejador = (ev) => {
    const esAtajo = (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k';
    if (!esAtajo) return;
    ev.preventDefault();
    entrada.focus();
    entrada.select();
  };

  document.addEventListener('keydown', manejador);

  return () => {
    document.removeEventListener('keydown', manejador);
  };
}