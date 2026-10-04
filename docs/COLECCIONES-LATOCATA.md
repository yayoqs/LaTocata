# COLECCIONES-LATOCATA.md — Esquema de datos de LaTocata

**Versión:** 0.1.0
**Fecha:** 3 de octubre de 2026
**Base de datos:** EkyzD (misma del ecosistema Elisekai).
**Propósito:** Especificar las tablas laTocata_* y sus columnas.

---

## Nomenclatura

Todas las tablas de negocio de LaTocata empiezan con laTocata_.
Comparten el campo espacioId (id del grupo cultural) para
aislamiento multi-tenant.

---

## 1. laTocata_Tocatas

Cada fila es una tocata concreta.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| nombre | varchar | Sí | 150 | — |
| tipo | enum | Sí | jam, concierto, microfono_abierto, ensayo_abierto, rave, tocata_tematica, especifico | jam |
| modalidad | enum | Sí | libre, cuadrada | libre |
| espacioRef | varchar | Sí | 100 (rowId de laTocata_Espacios) | — |
| fecha | datetime | Sí | — | — |
| horaInicio | varchar | No | 10 | — |
| horaFinEstimada | varchar | No | 10 | — |
| estado | enum | Sí | borrador, publicada, en_curso, pausada, finalizada, cancelada | borrador |
| aforoMax | integer | No | 1 | 0 |
| descripcion | varchar | No | 1000 | — |
| notasInternas | varchar | No | 1000 | — |
| slugPublico | varchar | No | 100 | — |
| espacioId | varchar | Sí | 100 | — |

Índices: index_espacioId, index_fecha, index_estado, index_slugPublico.

---

## 2. laTocata_Espacios

Catálogo de espacios prestados. Global del grupo, no por tocata.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| nombre | varchar | Sí | 150 | — |
| direccion | varchar | No | 500 | — |
| comuna | varchar | No | 100 | — |
| tipo | enum | Sí | patio, galpon, plaza, salon, casa, biblioteca, cafe, otro | otro |
| anfitrionNombre | varchar | No | 200 | — |
| anfitrionContacto | varchar | No | 200 | — |
| capacidad | integer | No | 0 | 0 |
| tieneSonido | boolean | No | false | false |
| tieneBanos | boolean | No | false | false |
| tieneElectricidad | boolean | No | true | true |
| condiciones | varchar | No | 1000 | — |
| notasInternas | varchar | No | 2000 | — |
| fotos | varchar | No | 5000 (JSON array de URLs) | [] |
| activo | boolean | Sí | true | true |
| espacioId | varchar | Sí | 100 | — |

---

## 3. laTocata_DisponibilidadEspacios

Disponibilidad y bloqueos del espacio.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| espacioRef | varchar | Sí | 100 | — |
| fechaInicio | datetime | Sí | — | — |
| fechaFin | datetime | Sí | — | — |
| motivo | varchar | No | 500 | — |
| tipo | enum | Sí | disponible, reservado, bloqueado, mantenimiento | disponible |
| tocataRef | varchar | No | 100 | — |
| espacioId | varchar | Sí | 100 | — |

---

## 4. laTocata_Actos

Cada músico o banda que toca en una tocata.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | Sí | 100 | — |
| tipo | enum | Sí | solista, duo, banda | solista |
| musicoRef | varchar | Sí | 100 (userId del ecosistema) | — |
| bandaRef | varchar | No | 100 | — |
| integrantes | varchar | No | 1000 (JSON array de objetos {nombre, instrumento, userId}) | [] |
| instrumentos | varchar | No | 500 (JSON array) | [] |
| genero | varchar | No | 200 | — |
| referenciaMusical | varchar | No | 500 | — |
| canciones | varchar | No | 2000 (JSON array {titulo, duracionAprox}) | [] |
| cantidadTemas | integer | No | 0 | — |
| hastaQueLoBajen | boolean | No | false | false |
| necesitaEquipamiento | varchar | No | 500 | — |
| estado | enum | Sí | anotado, aprobado, rechazado, en_curso, terminado, saltado, no_llego, ausente | anotado |
| ordenCola | integer | No | 0 | 0 |
| tiempoEstimadoMin | integer | No | 15 | 15 |
| inicioReal | datetime | No | — | — |
| finReal | datetime | No | — | — |
| notasOrganizador | varchar | No | 1000 | — |
| espacioId | varchar | Sí | 100 | — |

Índices: index_tocataRef, index_musicoRef, index_estado.

---

## 5. laTocata_Bandas

Agrupaciones sin cuenta propia. Cada integrante tiene cuenta.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| nombre | varchar | Sí | 150 | — |
| genero | varchar | No | 200 | — |
| descripcion | varchar | No | 1000 | — |
| integrantes | varchar | Sí | 2000 (JSON array {userId, nombre, instrumento, rol}) | [] |
| representanteRef | varchar | Sí | 100 (userId del representante) | — |
| fotos | varchar | No | 5000 | [] |
| links | varchar | No | 2000 (JSON array {tipo, url}) | [] |
| espacioId | varchar | Sí | 100 | — |

---

## 6. laTocata_Equipo

Equipo organizador y staff por tocata.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | Sí | 100 | — |
| usuarioRef | varchar | Sí | 100 | — |
| rol | enum | Sí | organizador, staff, anfitrion | staff |
| etiquetas | varchar | No | 500 (JSON array: sonido, parrilla, foto, cocina, apañe, produccion) | [] |
| notas | varchar | No | 500 | — |
| espacioId | varchar | Sí | 100 | — |

---

## 7. laTocata_Inventario

Equipos del grupo y de los usuarios.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| nombre | varchar | Sí | 150 | — |
| categoria | enum | Sí | amplificacion, microfono, cuerdas, percusion, cables, iluminacion, sonido, otros | otros |
| propietarioTipo | enum | Sí | grupo, usuario, espacio | grupo |
| propietarioRef | varchar | No | 100 | — |
| estado | enum | Sí | bueno, funciona_pero, roto, en_reparacion | bueno |
| ubicacionRef | varchar | No | 100 (espacioRef) | — |
| disponibleParaPrestamo | boolean | Sí | true | true |
| notas | varchar | No | 1000 | — |
| fotos | varchar | No | 5000 | [] |
| espacioId | varchar | Sí | 100 | — |

---

## 8. laTocata_Prestamos

Registro de préstamos de equipo.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| inventarioRef | varchar | Sí | 100 | — |
| tocataRef | varchar | No | 100 | — |
| prestadoA | varchar | Sí | 100 (userId) | — |
| prestadoPor | varchar | Sí | 100 (userId) | — |
| fechaPrestamo | datetime | Sí | — | — |
| fechaDevolucion | datetime | No | — | — |
| estado | enum | Sí | activo, devuelto, perdido | activo |
| notas | varchar | No | 500 | — |
| espacioId | varchar | Sí | 100 | — |

---

## 9. laTocata_Ingresos

Check-in de asistentes a una tocata.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | Sí | 100 | — |
| usuarioRef | varchar | No | 100 (null si fue sin cuenta) | — |
| nombreInvitado | varchar | No | 200 | — |
| tipo | enum | Sí | entrada_pagada, gratis_registrado, gratis_anonimo, staff, musico | gratis_anonimo |
| monto | integer | No | 0 | 0 |
| checkInEn | datetime | Sí | — | — |
| espacioId | varchar | Sí | 100 | — |

---

## 10. laTocata_Entradas

Entradas vendidas o reservadas.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | Sí | 100 | — |
| usuarioRef | varchar | No | 100 | — |
| tipo | enum | Sí | general, vip, gratis, cortesia | general |
| precio | integer | Sí | 0 | 0 |
| estado | enum | Sí | reservada, pagada, usada, anulada | reservada |
| codigoQR | varchar | Sí | 100 | — |
| espacioId | varchar | Sí | 100 | — |

---

## 11. laTocata_Votaciones

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | No | 100 | — |
| titulo | varchar | Sí | 200 | — |
| descripcion | varchar | No | 500 | — |
| tipo | enum | Sí | por_tocata, global_grupo | por_tocata |
| categoria | varchar | No | 200 | — |
| opciones | varchar | Sí | 5000 (JSON array {id, titulo, descripcion, ref}) | [] |
| estado | enum | Sí | borrador, activa, cerrada | borrador |
| permiteMultiples | boolean | No | false | false |
| soloPresentes | boolean | Sí | true | true |
| premio | varchar | No | 500 | — |
| premioKyu | integer | No | 0 | 0 |
| espacioId | varchar | Sí | 100 | — |

---

## 12. laTocata_Votos

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| votacionRef | varchar | Sí | 100 | — |
| usuarioRef | varchar | Sí | 100 | — |
| opcionId | varchar | Sí | 100 | — |
| emitidoEn | datetime | Sí | — | — |
| espacioId | varchar | Sí | 100 | — |

---

## 13. laTocata_Concursos

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | No | 100 | — |
| titulo | varchar | Sí | 200 | — |
| descripcion | varchar | No | 1000 | — |
| reglas | varchar | No | 2000 | — |
| estado | enum | Sí | borrador, activo, cerrado | borrador |
| ganador | varchar | No | 100 (userId) | — |
| premio | varchar | No | 500 | — |
| premioKyu | integer | No | 0 | 0 |
| espacioId | varchar | Sí | 100 | — |

---

## 14. laTocata_Avisos

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | No | 100 | — |
| titulo | varchar | Sí | 200 | — |
| mensaje | varchar | Sí | 1000 | — |
| tipo | enum | Sí | publico, equipo, espacio | publico |
| importante | boolean | No | false | false |
| visibleEnCartelera | boolean | No | true | true |
| creadoPor | varchar | Sí | 100 | — |
| espacioId | varchar | Sí | 100 | — |

---

## 15. laTocata_Comunidad

Personas relevantes. Músicos, colaboradores, vecinos,
anfitriones, auspiciadores. Algunos con cuenta, otros sin.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| usuarioRef | varchar | No | 100 (null si sin cuenta) | — |
| nombre | varchar | Sí | 200 | — |
| tipo | enum | Sí | musico, colaborador, vecino, anfitrion, auspiciador, otro | musico |
| contacto | varchar | No | 500 (JSON {telefono, instagram, email}) | {} |
| etiquetas | varchar | No | 500 (JSON array) | [] |
| notasInternas | varchar | No | 1000 | — |
| espacioId | varchar | Sí | 100 | — |

---

## 16. laTocata_Fotos

Fotos subidas por organizadores y asistentes.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | Sí | 100 | — |
| url | varchar | Sí | 1000 | — |
| subidaPor | varchar | Sí | 100 | — |
| etiquetas | varchar | No | 500 (JSON array de userId de músicos) | [] |
| visiblePublico | boolean | No | true | true |
| espacioId | varchar | Sí | 100 | — |

---

## 17. laTocata_Comentarios

Comentarios en tocatas y en hilos temáticos.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | No | 100 | — |
| hilo | varchar | No | 200 | — |
| padreRef | varchar | No | 100 | — |
| usuarioRef | varchar | Sí | 100 | — |
| texto | varchar | Sí | 2000 | — |
| borradoPor | varchar | No | 100 | — |
| espacioId | varchar | Sí | 100 | — |

---

## 18. laTocata_Resumenes

Resumen de una tocata al cerrarla.

| Columna | Tipo | Obligatorio | Detalles | Default |
|---------|------|:-----------:|----------|---------|
| tocataRef | varchar | Sí | 100 | — |
| cantidadActos | integer | No | 0 | 0 |
| cantidadTemas | integer | No | 0 | 0 |
| duracionTotalMin | integer | No | 0 | 0 |
| cantidadIngresos | integer | No | 0 | 0 |
| cantidadGratis | integer | No | 0 | 0 |
| recaudacion | integer | No | 0 | 0 |
| notas | varchar | No | 2000 | — |
| destacados | varchar | No | 2000 (JSON array) | [] |
| publicado | boolean | No | false | false |
| espacioId | varchar | Sí | 100 | — |

---

*Documento mantenido por Coordinación de LaTocata.*