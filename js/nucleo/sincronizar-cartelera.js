/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/sincronizar-cartelera.js
   Versión: 0.1.0
   Propósito: Publicar el estado de la tocata activa en
              localStorage para que cartelera.html lo lea. La
              cartelera escucha el storage event y se actualiza
              sola entre pestañas.
   ================================================================ */

import { obtener } from './estado.js';

const CLAVE = 'latocata:cartelera';

export function sincronizarCartelera() {
  const tocataId = obtener('tocataActivaId');
  if (!tocataId) return;

  const tocatas = obtener('tocatas') || [];
  const actos = obtener('actos') || [];
  const avisos = obtener('avisos') || [];
  const votaciones = obtener('votaciones') || [];
  const espacios = obtener('espacios') || [];
  const grupo = obtener('grupo');

  const tocata = tocatas.find((t) => t.id === tocataId);
  if (!tocata) return;

  const espacio = espacios.find((e) => e.id === tocata.espacioRef);
  const actosDeTocata = actos
    .filter((a) => a.tocataRef === tocataId)
    .sort((a, b) => a.ordenCola - b.ordenCola);

  const actoActual = actosDeTocata.find((a) => a.estado === 'en_curso') || null;
  const proximos = actosDeTocata
    .filter((a) => a.estado === 'aprobado' && a.ordenCola > (actoActual?.ordenCola || 0))
    .slice(0, 5);
  const yaTocaron = actosDeTocata.filter((a) => a.estado === 'terminado');

  const avisosTocata = avisos
    .filter((a) => a.tocataRef === tocataId && a.tipo === 'publico')
    .slice(0, 3);

  const votacionActiva = votaciones.find(
    (v) => v.tocataRef === tocataId && v.estado === 'activa'
  ) || null;

  const datos = {
    actualizadoEn: new Date().toISOString(),
    grupo: grupo ? { nombre: grupo.nombre } : null,
    tocata: {
      id: tocata.id,
      slug: tocata.slug,
      nombre: tocata.nombre,
      tipo: tocata.tipo,
      estado: tocata.estado,
      descripcion: tocata.descripcion,
    },
    espacio: espacio ? { nombre: espacio.nombre, direccion: espacio.direccion } : null,
    actoActual: actoActual ? resumirActo(actoActual) : null,
    proximos: proximos.map(resumirActo),
    yaTocaron: yaTocaron.map(resumirActo),
    avisos: avisosTocata,
    votacion: votacionActiva,
    colaActiva: tocata.estado === 'en_curso' || tocata.estado === 'pausada',
  };

  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch (e) {
    console.warn('[LaTocata] No se pudo sincronizar cartelera:', e);
  }
}

function resumirActo(acto) {
  return {
    id: acto.id,
    nombreArtistico: acto.nombreArtistico,
    tipo: acto.tipo,
    genero: acto.genero || '',
    instrumentos: acto.instrumentos || [],
    integrantes: acto.integrantes || [],
    canciones: acto.canciones || [],
    hastaQueLoBajen: !!acto.hastaQueLoBajen,
    tiempoEstimadoMin: acto.tiempoEstimadoMin || 15,
    estado: acto.estado,
    ordenCola: acto.ordenCola,
  };
}

export function leerCartelera() {
  try {
    const raw = localStorage.getItem(CLAVE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}