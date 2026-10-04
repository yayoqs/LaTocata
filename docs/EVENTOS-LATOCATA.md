# EVENTOS-LATOCATA.md — Catálogo de eventos de LaTocata

**Versión:** 0.1.0
**Fecha:** 3 de octubre de 2026

---

## Convención

nombre: modulo:accion. Payload: objeto JSON.

---

## 1. Sesión y navegación

| Evento | Emisor | Payload |
|--------|--------|---------|
| sesion:iniciada | sesion.js | usuario |
| sesion:cerrada | sesion.js | — |
| vista:cambiada | navegacion.js | nombre de vista |
| rol:cambiado | shell | nombre del rol activo |

---

## 2. Tocata

| Evento | Emisor | Payload |
|--------|--------|---------|
| tocata:creada | repo | tocata |
| tocata:actualizada | repo | tocata |
| tocata:publicada | repo | { tocataId } |
| tocata:iniciada | panel | { tocataId } |
| tocata:pausada | panel | { tocataId, motivo } |
| tocata:finalizada | panel | { tocataId, resumen } |
| tocata:cancelada | panel | { tocataId, motivo } |

---

## 3. Actos y cola

| Evento | Emisor | Payload |
|--------|--------|---------|
| acto:anotado | repo | acto |
| acto:aprobado | panel | { actoId } |
| acto:rechazado | panel | { actoId, motivo } |
| acto:iniciado | escenario | { actoId, inicio } |
| acto:terminado | escenario | { actoId, fin } |
| acto:saltado | panel | { actoId, motivo } |
| acto:no_llego | panel | { actoId } |
| acto:extendido | escenario | { actoId, minutosExtra } |
| cola:reordenada | panel | { orden: [actoId, ...] } |
| cola:pausada | panel | { motivo } |
| cola:reanudada | panel | — |

---

## 4. Espacios

| Evento | Emisor | Payload |
|--------|--------|---------|
| espacio:creado | repo | espacio |
| espacio:actualizado | repo | espacio |
| disponibilidad:reservada | repo | { espacioRef, rango } |
| disponibilidad:liberada | repo | { espacioRef, rango } |

---

## 5. Ingresos y entradas

| Evento | Emisor | Payload |
|--------|--------|---------|
| ingreso:registrado | repo | ingreso |
| entrada:reservada | repo | entrada |
| entrada:pagada | caja | entrada |
| entrada:usada | check_in | { entradaId } |
| aforo:actualizado | panel | { tocataId, cantidad } |

---

## 6. Votaciones y concursos

| Evento | Emisor | Payload |
|--------|--------|---------|
| votacion:creada | panel | votacion |
| votacion:activada | panel | { votacionId } |
| votacion:cerrada | panel | { votacionId, resultados } |
| voto:emitido | publico | { votacionId, opcionId } |
| concurso:creado | panel | concurso |
| concurso:activado | panel | { concursoId } |
| concurso:cerrado | panel | { concursoId, ganador } |

---

## 7. Avisos y comunidad

| Evento | Emisor | Payload |
|--------|--------|---------|
| aviso:publicado | panel | aviso |
| aviso:visible_en_cartelera | panel | { avisoId, visible } |
| comentario:publicado | comunidad | comentario |
| comentario:borrado | moderador | { comentarioId } |

---

## 8. Inventario y préstamos

| Evento | Emisor | Payload |
|--------|--------|---------|
| inventario:item_creado | repo | item |
| inventario:item_actualizado | repo | item |
| prestamo:creado | repo | prestamo |
| prestamo:devuelto | repo | prestamo |

---

## 9. Cartelera pública

La cartelera vive en cartelera.html. Se actualiza vía
almacenamiento local compartido o vía EventBus si ambos HTMLs se
abren en la misma pestaña (iframe). En el prototipo se simula con
un canal de almacenamiento (storage event) entre pestañas.

| Evento | Emisor | Payload |
|--------|--------|---------|
| cartelera:acto_actual_cambio | panel | { tocataId, actoId } |
| cartelera:cola_actualizada | panel | { tocataId } |
| cartelera:aviso_publicado | panel | aviso |
| cartelera:votacion_abierta | panel | votacion |

---

## 10. KYU (contador)

| Evento | Emisor | Payload |
|--------|--------|---------|
| kyu:sumado | repo | { usuarioId, cantidad, motivo } |

---

*Documento mantenido por Coordinación de LaTocata.*content://com.android.externalstorage.documents/tree/primary%3AAplicaciones::primary:Aplicaciones/LaTocata/docs/J