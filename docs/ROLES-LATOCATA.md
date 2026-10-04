# ROLES-LATOCATA.md — Roles y permisos de LaTocata

**Versión:** 0.1.0
**Fecha:** 3 de octubre de 2026

---

## 1. Roles del ecosistema

Compartidos con Elisekai (definidos en js/roles.js del core):

  · master
  · jugador (base de todo usuario)
  · owner
  · admin

Estos roles tienen los mismos permisos que en el resto del
ecosistema.

---

## 2. Roles específicos de LaTocata

  · organizador — arma tocatas, invita equipo, aprueba músicos,
    maneja cola, lanza votaciones, cierra jornada.
  · staff — opera el día. Etiquetas internas: sonido, parrilla,
    foto, cocina, apañe, produccion.
  · musico — se anota, sube canciones, ve su agenda, ve su
    historial.
  · anfitrion — presta el espacio. Puede ver el calendario de su
    espacio, confirmar o rechazar tocatas, dejar condiciones.
    Nivel 3, corresponsable.
  · publico — rol base sin permisos internos. Ve cartelera,
    compra entradas, vota si está presente.

---

## 3. Matriz de accesos

| Vista | publico | musico | staff | organizador | anfitrion | admin | owner |
|-------|:-------:|:------:|:-----:|:-----------:|:---------:|:-----:|:-----:|
| Inicio / cartelera destacada | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| Cartelera en vivo | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| Perfil público de músico | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| Perfil público de tocata | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| Panel del organizador | — | — | — | Sí | — | Sí | Sí |
| Registro de músicos | — | Sí | Sí | Sí | — | Sí | Sí |
| Cola de presentaciones | — | — | Sí | Sí | — | Sí | Sí |
| Escenario / acto en curso | — | — | Sí | Sí | — | Sí | Sí |
| Espacios | — | — | — | Sí | Sí | Sí | Sí |
| Comunidad | — | Sí | Sí | Sí | Sí | Sí | Sí |
| Inventario | — | — | Sí | Sí | Sí | Sí | Sí |
| Fotos | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| Votaciones y concursos | Vota | Vota | Vota | Sí | Sí | Sí | Sí |
| Perfil del músico (propio) | — | Sí | Sí | Sí | — | Sí | Sí |
| Configuración del grupo | — | — | — | — | — | Sí | Sí |

---

## 4. Selector de rol

Cuando un usuario tiene más de un rol en el mismo contexto,
aparece un selector arriba del shell. Cambiar de rol cambia las
vistas disponibles.

Ejemplo: Yayo en "El 10 a las 10" tiene organizador + anfitrion
+ musico. El selector muestra los tres. Al elegir "Músico", Yayo
ve su cola, su acto, sus canciones. Al elegir "Organizador", ve
el panel. Al elegir "Anfitrión", ve el calendario del espacio.

---

## 5. Rol base sin cuenta

Un visitante sin cuenta no tiene rol. Ve cartelera, precios, y
puede navegar perfiles públicos. Para votar, comprar, comentar,
o anotarse como músico necesita cuenta.

---

*Documento mantenido por Coordinación de LaTocata.*