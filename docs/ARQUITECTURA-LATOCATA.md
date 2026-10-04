# ARQUITECTURA-LATOCATA.md — Arquitectura de LaTocata

**Versión:** 0.1.0
**Fecha:** 3 de octubre de 2026
**Propósito:** Definir la arquitectura del prototipo funcional de
LaTocata, app hermana del ecosistema Elisekai para gestión de
eventos culturales itinerantes.
**Mantenedor:** Coordinación de LaTocata.

---

## 1. Qué es LaTocata

LaTocata es una app del ecosistema Elisekai. Gestiona eventos
culturales itinerantes en espacios prestados: patios, galpones,
plazas, bibliotecas, cafés, casas antiguas recuperadas.

No es una red social, no es una productora, no es solo ticketing.
Es una herramienta interna para grupos culturales autogestionados,
con una capa pública visible durante los eventos.

LaTocata es multitenant. Cada grupo cultural es un tenant. Cada
grupo tiene sus espacios, su equipo, sus tocatas, su comunidad.
Comparten plataforma, no datos.

La unidad de trabajo es la **tocata**, no el evento ni el espacio.
Una tocata tiene nombre propio, fecha, espacio, equipo, cartelera,
cola y archivo. Una tocata puede ser de muchos tipos: jam,
concierto, micrófono abierto, ensayo abierto, rave, tocata temática.

El primer caso de uso: "El 10 a las 10", una jam organizada por el
Colectivo Cultural Chillán en el patio de la Casa Amarilla, sábado
10 de octubre de 2026 a las 10:00.

---

## 2. Relación con el ecosistema Elisekai

LaTocata comparte con el resto de apps:

  · Autenticación vía Appwrite Account del ecosistema.
  · Perfiles globales en global_Perfiles.
  · Espacios globales en global_Espacios (aquí "grupo cultural").
  · KYU como moneda (fase 2, no se canjea todavía).
  · Patrón de repositorios, Resultado, idempotencia.
  · EventBus / CommandBus.
  · Store como fuente de lectura.
  · Ciclo de vida activar / limpiar.

Los grupos culturales usan los Teams de Appwrite para gestionar
membresías y roles.

---

## 3. Principios

  · Comunidad primero. Cada decisión de diseño pregunta: ¿esto
    acerca a las personas o las aleja?

  · Vista pública y vista interna son mundos distintos. La
    cartelera es un artefacto cultural, el panel es trastienda.

  · Claridad operativa. Durante un acto, el organizador sabe en
    2 segundos quién toca, cuánto falta, qué sigue.

  · Ritmo. Animaciones sutiles, transiciones vivas. No una
    planilla de cálculo.

  · Informal pero serio. Es un evento de amigos con
    responsabilidad real: seguridad, sonido, tiempos.

  · Itinerancia visible. Cada tocata es una entre muchas, en un
    espacio entre muchos. El proyecto tiene memoria y movimiento.

  · Multitenant silencioso. El usuario de un grupo no piensa en
    que existen otros, pero el sistema está listo.

  · Todas las cuentas son del ecosistema. No hay cuenta local.
    Sin cuenta se puede ver la cartelera, nada más.

---

## 4. Unidad de trabajo: la tocata

Una tocata tiene:

  · id (rowId de Appwrite)
  · espacioId (el grupo cultural)
  · nombre propio
  · tipo: jam, concierto, microfono_abierto, ensayo_abierto,
    rave, tocata_tematica, especifico
  · modalidad: libre (jam) o cuadrada (concierto)
  · espacioRef (fila de laTocata_Espacios)
  · fecha, horaInicio, horaFinEstimada
  · equipoRef (fila de laTocata_Equipo, con roles)
  · cartelera (actos en orden)
  · cola (actos activos y pendientes)
  · estado: borrador, publicada, en_curso, pausada, finalizada,
    cancelada
  · aforo, entradas (vendidas, ingresos, gratis)
  · votaciones activas
  · avisos
  · resumen (al cerrar)

---

## 5. Estructura del prototipo

El prototipo es una mini-app navegable, sin backend. Datos de
ejemplo en JS. Dos HTML:

  · index.html — hub de navegación interna (post-login simulado)
  · cartelera.html — app pública independiente (URL simulada
    latocata.elisekai.com/cartelera/<slug>)

La navegación interna combina tres patrones:
  · Barra lateral replegable (grupos grandes de vistas)
  · Chips horizontales (sub-vistas dentro de un grupo)
  · Tabbar inferior (acceso rápido en móvil)

---

## 6. Vistas del prototipo

Públicas (sin login):
  · Inicio / cartelera destacada
  · Cartelera en vivo de una tocata (cartelera.html)
  · Perfil público de un músico
  · Perfil público de una tocata pasada

Internas (post-login):
  · Panel del organizador
  · Registro de músicos
  · Cola de presentaciones
  · Escenario / acto en curso
  · Espacios
  · Comunidad
  · Inventario
  · Fotos
  · Votaciones y concursos
  · Perfil del músico
  · Configuración del grupo

---

## 7. Selector de rol

Un usuario puede tener varios roles en la misma tocata. El sistema
expone un selector arriba del shell con los roles activos del
usuario en el contexto actual. Al cambiar, se habilitan las vistas
correspondientes.

Ejemplo: Yayo es organizador, anfitrión y músico en "El 10 a las
10". El selector muestra los tres. Yayo elige con cuál quiere ver
la app.

Un músico solo-músico no ve el panel del organizador. Un
organizador solo-organizador no ve la vista de músico. Un usuario
con ambos ve las dos según elija.

---

## 8. Ciclo operativo

  1. Organizador crea la tocata.
  2. Invita al equipo organizador y staff.
  3. Abre inscripción de músicos (link público y búsqueda).
  4. Músicos se anotan con sus datos.
  5. Organizador aprueba o rechaza.
  6. Se arma la cola por orden de aprobación.
  7. Se publica la cartelera (URL pública).
  8. Día del evento: check-in de asistentes, cartelera en vivo,
     acto en curso, cronómetro.
  9. Se lanzan votaciones y concursos si aplica.
  10. Cierre: resumen, archivo, KYU a músicos recurrentes.

---

## 9. Roles

Roles formales:
  · organizador
  · staff (con etiquetas internas: sonido, parrilla, foto,
    cocina, apañe, produccion)
  · musico
  · publico (rol base, cualquier cuenta Elisekai sin rol
    específico)
  · anfitrion (nivel 3: dueño o gestor del espacio prestado)

Roles formales con jerarquía:
  · master (plataforma)
  · owner (del grupo cultural)
  · admin (del grupo)
  · operativos (organizador, staff, anfitrion, musico)
  · publico

Ver docs/ROLES-LATOCATA.md.

---

## 10. Fases

**Fase 1 (prototipo):** todas las vistas navegables, con
interacción real en el ciclo cola → acto → cartelera. Datos de
ejemplo. Sin backend.

**Fase 2 (app):** persistencia en Appwrite, realtime,
autenticación real, venta de entradas, KYU operativos, votaciones
y concursos.

**Fase 3:** analítica, automatización de permisos, integración
cross-app con LaTaberna (un músico que también es staff),
extensión a otras disciplinas culturales (poesía, cine, ferias).

---

*Documento mantenido por Coordinación de LaTocata.*