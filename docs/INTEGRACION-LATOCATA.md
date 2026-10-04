# INTEGRACION-LATOCATA.md — Registro de patrones portados

**Versión:** 0.1.0
**Fecha:** 4 de octubre de 2026
**Propósito:** Documentar qué patrones visuales y de interacción
se tomaron de LaTaberna, cómo se tradujeron al sistema de LaTocata
y por qué. Es un registro histórico de decisiones, no una guía de
uso. La guía de uso vive en los propios componentes.

---

## 1. Contexto de la decisión

LaTocata y LaTaberna son dos aplicaciones del ecosistema Elisekai.
Comparten backend de autenticación y perfiles globales
(global_Perfiles, global_Espacios). No comparten CSS, ni DOM, ni
código de vistas. Son apps independientes en lo visual.

En una etapa temprana de LaTocata se evaluó cargar los CSS de
LaTaberna. Se descartó por tres razones:

1. Los CSS de LaTaberna tienen ~30 archivos encapsulados por vista.
   LaTocata no tiene esas vistas, cargarlos sería agregar peso sin
   uso.
2. Los prefijos de clase son de LaTaberna (kds-, caja-, despensa-,
   carta-, cliente-). No aportan al vocabulario de LaTocata.
3. LaTaberna arrastra deuda técnica de UI que no conviene propagar
   a un proyecto nuevo.

La decisión: tomar los patrones que funcionan, reescribirlos en el
sistema visual de LaTocata, con nomenclatura en español.

---

## 2. Sistema visual de LaTocata (recordatorio)

**Variables canónicas:** --fondo, --fondo-2, --superficie,
--superficie-2, --texto, --texto-suave, --texto-fuerte, --borde,
--sombra, --sombra-fuerte, --acento, --acento-suave, --acento-texto,
--exito, --aviso, --error, --info.

**Temas intercambiables:** tres, definidos en css/temas/tema-a.css,
tema-b.css, tema-c.css. Cada tema define el juego canónico completo
y aliases hacia los nombres de LaTaberna (--color-bg, --color-card,
etc.) por compatibilidad futura. El tema se aplica con el atributo
data-tema en el body.

**Tipografía:** Fraunces para titulares, Figtree para cuerpo.

**Iconografía:** SVG inline. Sin dependencias externas como Font
Awesome.

**Nomenclatura de clases:** BEM con nombres en español. Bloque
simple cuando aplica, BEM cuando hay variantes.

---

## 3. Patrones portados

### 3.1 Píldora de estado

**Origen:** `.status-pill` en LaTaberna (css/caja.css, css/caja-historial.css).

**Reescritura:** `.pildora` con modificadores de color
(--exito, --aviso, --error, --info, --acento, --neutral) y la
variante `--vivo` que anima un punto pulsante.

**Propósito:** estados operativos en contexto de lista o cabecera.
No reemplaza al `.badge` genérico, que se usa para etiquetas
cortas sin significado de estado.

**Dónde se aplica:**
- Cola: estado de cada acto.
- Panel del organizador: estado de la tocata y "en vivo" del acto.
- Escenario: etiqueta EN VIVO y bloque "hasta que lo bajen".
- Perfil de tocata: estado y en vivo.
- Votaciones: estado de cada votación.

### 3.2 Tarjeta de métrica

**Origen:** `.stat-card` en LaTaberna (css/caja.css).

**Reescritura:** `.tarjeta-metrica` con icono SVG de color
según significado, etiqueta en mayúsculas y valor en Fraunces.

**Propósito:** mostrar un número con contexto visual claro.

**Dónde se aplica:**
- Panel del organizador: anotados, aprobados, en vivo, terminados.
- Perfil del músico: actos, temas, tocatas, recurrente.
- Perfil de tocata: resumen de jornada finalizada.

### 3.3 Tarjeta de acción

**Origen:** `.action-card` en LaTaberna (css/mesa-detalles.css, css/cliente-bienvenida.css).

**Reescritura:** `.tarjeta-accion` con icono cuadrado, título,
descripción y flecha que se desplaza al hover. Variante --peligro
para acciones destructivas.

**Propósito:** acción grande con contexto. Es un botón, no un link
decorativo.

**Dónde se aplica:**
- Panel del organizador: anotar músico, iniciar jornada, enviar
  aviso, cerrar jornada.
- Escenario: "viene después" con iniciar acto.
- Perfil del músico: presentaciones próximas.
- Inicio: tocatas próximas.

### 3.4 Cabecera de sección

**Origen:** `.section-head` + `.count-tag` en LaTaberna (css/caja.css).

**Reescritura:** `.cabecera-seccion` con título (con icono SVG
opcional), contador opcional y acción opcional. El contador tiene
variante --neutro para cuando no es un número "vivo".

**Propósito:** encabezado consistente de bloque dentro de una vista.

**Dónde se aplica:** prácticamente todas las vistas de LaTocata.

### 3.5 Tabla deslizable

**Origen:** `.table-wrap` + `.table-scroll` en LaTaberna (css/caja.css, css/caja-historial.css).

**Reescritura:** `.tabla` con `.tabla__scroll` interno y
`.tabla__elemento` para el table. Ancho mínimo forzado en móvil
para activar el scroll horizontal.

**Propósito:** presentar listas densas sin romper el layout móvil.

**Dónde se aplica:**
- Comunidad: vista alternativa a tarjetas.
- Inventario: vista alternativa a tarjetas.
- Espacios: listado lateral.

### 3.6 Conmutador de vista

**Origen:** `.view-toggle` en LaTaberna (css/caja.css).

**Reescritura:** `.conmutador` con opciones de igual peso y estado
activo claro. Soporta iconos SVG.

**Propósito:** alternar entre dos o más modos de presentación de
los mismos datos.

**Dónde se aplica:**
- Comunidad: tarjetas / tabla.
- Inventario: tarjetas / tabla.

### 3.7 Buscador con atajo

**Origen:** `.search-wrap` en LaTaberna (css/caja.css).

**Reescritura:** `.buscador` con icono SVG a la izquierda, campo
de texto y atajo visual a la derecha. El atajo se oculta en móvil.
La lógica se activa con `atajoBusqueda()` de `nucleo/utils.js`.

**Propósito:** filtrar listas largas por texto, con acceso rápido
desde teclado.

**Dónde se aplica:**
- Comunidad: filtrar por nombre, etiqueta o nota.
- Cola: filtrar por nombre, género o instrumento.

### 3.8 Botón de acción rápida

**Origen:** `.qa-btn` en LaTaberna (css/caja.css).

**Reescritura:** `.boton-rapido` con icono SVG, texto y sufijo
opcional (para montos, por ejemplo).

**Propósito:** atajos compactos en paneles laterales.

**Estado:** definido en componentes.css, pendiente de aplicar en
las vistas. Se usará en la vista de Caja o en el bloque de acciones
del organizador cuando sumemos esa vista.

---

## 4. Patrones evaluados y descartados

- **Layout de tres paneles** (`sidebar-left` + `panel-central` +
  `sidebar-right`) de LaTaberna (css/caja.css, css/despensa.css).
  Descartado por ahora. LaTocata usa un shell con drawer lateral
  simple. Si una vista futura necesita el layout de tres paneles,
  se evalúa en ese momento.

- **Conmutador con `role="tablist"`** de LaTaberna. Descartado
  por ahora. LaTocata usa botones convencionales dentro del
  `.conmutador`, sin aria roles. Se puede sumar cuando trabajemos
  accesibilidad a fondo.

- **Chips con avatar circular** para asignar a persona
  (css/caja-cobro.css). Descartado. LaTocata no tiene flujo de
  asignación de ítems a personas.

- **Ticket de 80mm** (css/ticket.css). Descartado. No aplica.

- **Diseñador de cartas completo** (css/carta-editor.css). Descartado.
  Fuera del alcance de LaTocata.

- **Font Awesome.** Descartado. LaTocata usa SVG inline para no
  arrastrar 200 KB de CDN.

- **Emojis decorativos como iconos.** Reducidos al mínimo. Los
  ejemplos que quedan (fechas, lugares) usan emojis por
  familiaridad cultural (📍 📅), no como sistema de iconos.

---

## 5. Convenciones adoptadas

1. **Nombres en español** para clases, variables, funciones y
   archivos.
2. **BEM con doble guion bajo** para elementos y doble guion para
   modificadores: `.bloque__elemento--variante`.
3. **SVG inline** para iconografía. Sin dependencias externas.
4. **Color-mix()** para derivar tonos suaves a partir de variables
   de tema. Los navegadores modernos lo soportan desde 2023.
5. **Ciclo de vida explícito** por vista: `activar(contenedor)` y
   `limpiar()`. Sin autoactivación en scope de módulo.
6. **Atajos de teclado** gestionados por vista. La función
   `atajoBusqueda()` devuelve un limpiador que la vista llama en su
   `limpiar()`.

---

## 6. Deuda técnica conocida

- **Persistencia del modo de vista** (tarjetas vs tabla) en
  comunidad e inventario. Actualmente vive en variable local, se
  pierde al cambiar de vista. Si molesta, se mueve a `estado.js`
  como clave global.

- **Accesibilidad de los componentes portados.** Los roles ARIA
  (`role="tablist"`, `aria-selected`, etc.) están pendientes. Se
  sumarán cuando trabajemos accesibilidad a fondo.

- **Estilos de estado :focus-visible.** Los componentes portados
  usan `:focus` genérico. Un pase de accesibilidad los migrará a
  `:focus-visible` para no ensuciar la experiencia de mouse.

- **Fotos con URLs reales.** El componente de galería funciona con
  placeholders. La integración con URLs y compresión de imágenes
  queda para la versión funcional.

---

## 7. Referencia de archivos

- `css/componentes.css` — contiene todos los componentes portados.
- `css/vistas/miscelaneas.css` — estilos específicos de las vistas
  que adoptaron los componentes nuevos.
- `js/nucleo/utils.js` — contiene `atajoBusqueda()`.
- `js/vistas/*.js` — cada vista importa lo que necesita.

---

*Documento mantenido por Coordinación de LaTocata.*
*Versión 0.1.0 — 4 de octubre de 2026*