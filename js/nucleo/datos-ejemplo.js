/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/datos-ejemplo.js
   Versión: 0.2.0
   Propósito: Datos de ejemplo del prototipo, alineados con el
              brief de continuidad del 4 de octubre de 2026.
              Coinciden con el esquema de COLECCIONES-LATOCATA.md,
              de modo que al migrar a Appwrite solo cambia el
              origen de lectura.
              v0.2.0: alineación con el brief.
                      · Se elimina el dúo "Andrés & Yayo" (no
                        tienen temas propios, prohibido por brief).
                      · Se eliminan los actos Amaru solista y Cata,
                        que no están en el brief.
                      · Se renombra "Tomás" a "Toms".
                      · Se suman Paulo en la Luna, Flow en Notas,
                        Ancestro y Macho Cabrio.
                      · Se mantiene Rompekadenas como acto extra
                        del universo del colectivo.
                      · Los tres espacios pasan a ser Casa Cultural
                        La Comarca, UBB la Castilla y El último
                        Andén, con sus datos exactos.
                      · La tocata arranca en estado en_curso, con
                        Excusa Rock en vivo.
                      · Se suman cinco estructuras nuevas: turnos
                        del evento, checklist del día, caja del
                        evento, paradas de la gira y préstamos de
                        equipo. También musicoPerfil (Yayo).
              v0.1.2: reemplazo de "Los Pinos" por cuatro bandas
                      reales; se agregan actos; Casa Amarilla pasa
                      a Andrés Monjes.
              v0.1.1: se agrega resumenes y campo contacto.
              v0.1.0: versión inicial.
   ================================================================ */

import { establecer } from './estado.js';

const ESPACIO_ID = 'grp_chillan';

export function cargarDatosEjemplo() {

  /* ---------- Grupo ---------- */

  const grupo = {
    id: ESPACIO_ID,
    nombre: 'Colectivo Cultural Chillán',
    slug: 'colectivo-chillan',
    ciudad: 'Chillán',
  };

  /* ---------- Equipo organizador ----------
     Solo roles formales: owner, organizador, staff, anfitrion.
     Los músicos viven en Actos y en Comunidad. */

  const equipo = [
    {
      id: 'eqp_1', usuarioRef: 'usr_andres', nombre: 'Andrés Monjes',
      rol: 'owner', etiquetas: ['anfitrion', 'espacio'],
      iniciales: 'AM', notas: 'Dueño del grupo. Anfitrión de La Comarca.',
    },
    {
      id: 'eqp_2', usuarioRef: 'usr_yayo', nombre: 'Eduardo Quilodrán',
      rol: 'organizador', etiquetas: ['produccion'],
      iniciales: 'YQ', notas: 'Hace la app.',
    },
    {
      id: 'eqp_3', usuarioRef: 'usr_amaru', nombre: 'Amaru',
      rol: 'staff', etiquetas: ['foto', 'publicidad'],
      iniciales: 'AM', notas: '',
    },
    {
      id: 'eqp_4', usuarioRef: 'usr_seba', nombre: 'Seba',
      rol: 'staff', etiquetas: ['parrilla', 'sonido'],
      iniciales: 'SE', notas: '',
    },
    {
      id: 'eqp_5', usuarioRef: 'usr_pame', nombre: 'Pame',
      rol: 'staff', etiquetas: ['cocina', 'puerta'],
      iniciales: 'PA', notas: '',
    },
  ];

  /* ---------- Comunidad ----------
     Personas relevantes. Algunas con cuenta, otras sin. */

  const comunidad = [
    {
      id: 'com_1', usuarioRef: 'usr_andres', nombre: 'Andrés Monjes',
      tipo: 'anfitrion', contacto: { whatsapp: '+56 9 1234 5678' },
      etiquetas: ['owner', 'anfitrion'],
      notasInternas: 'Dueño del grupo y anfitrión de La Comarca.',
    },
    {
      id: 'com_2', usuarioRef: 'usr_yayo', nombre: 'Eduardo Quilodrán',
      tipo: 'colaborador', contacto: { whatsapp: '+56 9 2345 6789' },
      etiquetas: ['organizador', 'musico'],
      notasInternas: 'Hace la app.',
    },
    {
      id: 'com_3', usuarioRef: 'usr_amaru', nombre: 'Amaru',
      tipo: 'colaborador', contacto: {},
      etiquetas: ['staff', 'foto', 'publicidad'],
      notasInternas: '',
    },
    {
      id: 'com_4', usuarioRef: 'usr_seba', nombre: 'Seba',
      tipo: 'colaborador', contacto: {},
      etiquetas: ['staff', 'parrilla', 'sonido'],
      notasInternas: '',
    },
    {
      id: 'com_5', usuarioRef: 'usr_pame', nombre: 'Pame',
      tipo: 'colaborador', contacto: {},
      etiquetas: ['staff', 'cocina', 'puerta'],
      notasInternas: '',
    },
    {
      id: 'com_6', usuarioRef: 'usr_miguel', nombre: 'Miguel',
      tipo: 'musico', contacto: { whatsapp: '+56 9 5555 1111' },
      etiquetas: ['musico', 'bateria'],
      notasInternas: 'Trae la batería completa.',
    },
    {
      id: 'com_7', usuarioRef: null, nombre: 'Familia Rodríguez',
      tipo: 'vecino', contacto: {},
      etiquetas: ['vecinos'],
      notasInternas: 'Prestan sillas para el patio.',
    },
  ];

  /* ---------- Espacios ---------- */

  const espacios = [
    {
      id: 'esp_comarca',
      nombre: 'Casa Cultural La Comarca',
      direccion: 'Av. España',
      comuna: 'Chillán',
      tipo: 'casa',
      anfitrionNombre: 'Andrés Monjes',
      anfitrionContacto: '+56 9 1234 5678',
      capacidad: 60,
      tieneSonido: true,
      tieneBanos: true,
      tieneElectricidad: true,
      condiciones: 'Sin amplificadores después de las 23:30. Cuidar el jardín.',
      notasInternas: 'Casa antigua. Los eventos ayudan a pagar el arriendo.',
      fotos: [],
      activo: true,
      esDeLaTocata: true,
    },
    {
      id: 'esp_ubb',
      nombre: 'UBB la Castilla',
      direccion: 'Av. Andrés Bello',
      comuna: 'Chillán',
      tipo: 'universidad',
      anfitrionNombre: 'Universidad del Bío Bío',
      anfitrionContacto: '+56 42 246 3000',
      capacidad: 100,
      tieneSonido: true,
      tieneBanos: true,
      tieneElectricidad: true,
      condiciones: 'Requiere seguro de responsabilidad civil. Sin amplificadores después de las 22:00.',
      notasInternas: 'Buena acústica. Hay que avisar con dos semanas de anticipación.',
      fotos: [],
      activo: true,
      esDeLaTocata: false,
    },
    {
      id: 'esp_anden',
      nombre: 'El último Andén',
      direccion: 'Calle Brasil',
      comuna: 'Chillán',
      tipo: 'bar cultural',
      anfitrionNombre: 'Carla Muñoz',
      anfitrionContacto: '+56 9 3456 7890',
      capacidad: 80,
      tieneSonido: true,
      tieneBanos: true,
      tieneElectricidad: true,
      condiciones: 'Sonido hasta la 1 AM. Consumo mínimo por persona.',
      notasInternas: 'Espacio chico pero con excelente ambiente. Tiene escenario propio.',
      fotos: [],
      activo: true,
      esDeLaTocata: false,
    },
  ];

  /* ---------- Tocatas ----------
     La activa es "El 10 a las 10". Las otras son memoria del
     colectivo: la próxima y las dos pasadas que aparecen en el
     historial de Yayo. */

  const tocatas = [
    {
      id: 'toc_10_a_las_10',
      slug: '10-a-las-10',
      nombre: 'El 10 a las 10',
      tipo: 'jam',
      modalidad: 'libre',
      espacioRef: 'esp_comarca',
      fecha: '2026-10-10T10:00:00',
      horaInicio: '10:00',
      horaFinEstimada: '18:00',
      estado: 'en_curso',
      aforoMax: 60,
      descripcion: 'Jam de primavera en el patio. Micrófono abierto, parrilla, y buena onda.',
      notasInternas: 'Cobrar solo si viene mucha gente. Dejar pasar gratis a los vecinos.',
    },
    {
      id: 'toc_jam_vecindario',
      slug: 'jam-del-vecindario',
      nombre: 'La Jam del Vecindario',
      tipo: 'jam',
      modalidad: 'libre',
      espacioRef: 'esp_anden',
      fecha: '2026-10-24T20:00:00',
      horaInicio: '20:00',
      horaFinEstimada: '01:00',
      estado: 'borrador',
      aforoMax: 80,
      descripcion: 'Segunda edición de la jam, ahora en El último Andén.',
      notasInternas: 'Confirmar sonido con Seba. Carla pidió que lleguemos antes de las 18:00.',
    },
    {
      id: 'toc_microfono_7',
      slug: 'microfono-abierto-7',
      nombre: 'Noche de Micrófono Abierto #7',
      tipo: 'microfono_abierto',
      modalidad: 'cuadrada',
      espacioRef: 'esp_anden',
      fecha: '2026-09-26T19:00:00',
      horaInicio: '19:00',
      horaFinEstimada: '22:00',
      estado: 'finalizada',
      aforoMax: 80,
      descripcion: 'Edición de septiembre.',
      notasInternas: 'Buena convocatoria. Repetir formato.',
    },
    {
      id: 'toc_jam_invierno',
      slug: 'jam-de-invierno',
      nombre: 'Jam de Invierno',
      tipo: 'jam',
      modalidad: 'libre',
      espacioRef: 'esp_comarca',
      fecha: '2026-08-14T16:00:00',
      horaInicio: '16:00',
      horaFinEstimada: '22:00',
      estado: 'finalizada',
      aforoMax: 60,
      descripcion: 'Jam de invierno en el patio techado.',
      notasInternas: 'Poca convocatoria por el frío. No repetir en invierno sin calefacción.',
    },
  ];

  /* ---------- Actos de "El 10 a las 10" ----------
     Cola completa con estados variados, coherente con una tocata
     en curso a media jornada. Miguel ya tocó. Excusa Rock está
     en vivo. Los demás están aprobados o anotados. */

  const actos = [
    /* 1 — Miguel · terminado */
    {
      id: 'act_1', tocataRef: 'toc_10_a_las_10',
      tipo: 'solista', musicoRef: 'usr_miguel', bandaRef: null,
      nombreArtistico: 'Miguel',
      integrantes: [],
      instrumentos: ['batería'],
      genero: 'rock',
      referenciaMusical: '',
      canciones: [
        { titulo: 'Improvisación libre', duracionAprox: 5 },
        { titulo: 'Sin nombre todavía', duracionAprox: 5 },
      ],
      cantidadTemas: 2, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Batería ya instalada en el patio',
      contacto: '+56 9 5555 1111',
      estado: 'terminado',
      ordenCola: 1, tiempoEstimadoMin: 10,
      inicioReal: '2026-10-10T10:05:00',
      finReal: '2026-10-10T10:18:00',
      notasOrganizador: 'Arrancó la jornada con buena energía.',
    },

    /* 2 — Excusa Rock · en vivo */
    {
      id: 'act_2', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_pancho', bandaRef: 'band_excusa',
      nombreArtistico: 'Excusa Rock',
      integrantes: [
        { nombre: 'Pancho', instrumento: 'voz', userId: 'usr_pancho' },
        { nombre: 'Karla', instrumento: 'guitarra', userId: 'usr_karla' },
        { nombre: 'Dani', instrumento: 'bajo', userId: 'usr_dani' },
      ],
      instrumentos: ['voz', 'guitarra', 'bajo'],
      genero: 'rock alternativo',
      referenciaMusical: '',
      canciones: [
        { titulo: 'Sin señal', duracionAprox: 4 },
        { titulo: 'Cable a tierra', duracionAprox: 5 },
        { titulo: 'Ruido blanco', duracionAprox: 4 },
        { titulo: 'Última llamada', duracionAprox: 4 },
      ],
      cantidadTemas: 4, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Amplificador para guitarra y bajo',
      contacto: '@excusa.rock',
      estado: 'en_curso',
      ordenCola: 2, tiempoEstimadoMin: 20,
      inicioReal: '2026-10-10T10:22:00',
      finReal: null,
      notasOrganizador: 'Banda recurrente. Vinieron a la #6 y a la de septiembre.',
    },

    /* 3 — Paulo en la Luna · aprobado */
    {
      id: 'act_3', tocataRef: 'toc_10_a_las_10',
      tipo: 'solista', musicoRef: 'usr_paulo', bandaRef: null,
      nombreArtistico: 'Paulo en la Luna',
      integrantes: [],
      instrumentos: ['voz', 'guitarra'],
      genero: 'trova',
      referenciaMusical: 'Silvio Rodríguez, Violeta Parra',
      canciones: [
        { titulo: 'Carta al sur', duracionAprox: 4 },
        { titulo: 'Luna de octubre', duracionAprox: 5 },
        { titulo: 'Regreso', duracionAprox: 4 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Micrófono y amplificador para guitarra',
      contacto: '@paulo.enlaluna',
      estado: 'aprobado',
      ordenCola: 3, tiempoEstimadoMin: 15,
      inicioReal: null, finReal: null,
      notasOrganizador: '',
    },

    /* 4 — Toms · aprobado */
    {
      id: 'act_4', tocataRef: 'toc_10_a_las_10',
      tipo: 'solista', musicoRef: 'usr_toms', bandaRef: null,
      nombreArtistico: 'Toms',
      integrantes: [],
      instrumentos: ['voz', 'guitarra'],
      genero: 'temas propios',
      referenciaMusical: '',
      canciones: [
        { titulo: 'Cielo roto', duracionAprox: 4 },
        { titulo: 'Mapa del sur', duracionAprox: 4 },
        { titulo: 'Ventana', duracionAprox: 3 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Micrófono',
      contacto: '',
      estado: 'aprobado',
      ordenCola: 4, tiempoEstimadoMin: 15,
      inicioReal: null, finReal: null,
      notasOrganizador: '',
    },

    /* 5 — Los Treiles · aprobado */
    {
      id: 'act_5', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_vale', bandaRef: 'band_treiles',
      nombreArtistico: 'Los Treiles',
      integrantes: [
        { nombre: 'Vale', instrumento: 'voz', userId: 'usr_vale' },
        { nombre: 'Chino', instrumento: 'guitarra', userId: 'usr_chino' },
        { nombre: 'Flor', instrumento: 'flauta traversa', userId: 'usr_flor' },
        { nombre: 'Iván', instrumento: 'percusión', userId: 'usr_ivan' },
      ],
      instrumentos: ['voz', 'guitarra', 'flauta traversa', 'percusión'],
      genero: 'folklore fusión',
      referenciaMusical: 'Inti-Illimani, Quilapayún',
      canciones: [
        { titulo: 'Vuelo de treile', duracionAprox: 5 },
        { titulo: 'Tierra adentro', duracionAprox: 4 },
        { titulo: 'Canto al río', duracionAprox: 6 },
        { titulo: 'Semilla', duracionAprox: 5 },
      ],
      cantidadTemas: 4, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Micrófono para flauta y percusión',
      contacto: '@lostreiles',
      estado: 'aprobado',
      ordenCola: 5, tiempoEstimadoMin: 20,
      inicioReal: null, finReal: null,
      notasOrganizador: 'Cerraron con bis espontáneo en el micrófono #7.',
    },

    /* 6 — Flow en Notas · anotado, hasta que lo bajen */
    {
      id: 'act_6', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_flow_lider', bandaRef: 'band_flow',
      nombreArtistico: 'Flow en Notas',
      integrantes: [
        { nombre: 'MC Suave', instrumento: 'voz', userId: 'usr_suave' },
        { nombre: 'Beats', instrumento: 'beat', userId: 'usr_beats' },
      ],
      instrumentos: ['voz', 'beat'],
      genero: 'rap',
      referenciaMusical: '',
      canciones: [],
      cantidadTemas: 0, hastaQueLoBajen: true,
      necesitaEquipamiento: 'Cable para celular o laptop con pistas',
      contacto: '@flowennotas',
      estado: 'anotado',
      ordenCola: 6, tiempoEstimadoMin: 15,
      inicioReal: null, finReal: null,
      notasOrganizador: 'Pidieron pasar al final de la tarde. Toca hasta que lo bajen.',
    },

    /* 7 — Ancestro · anotado */
    {
      id: 'act_7', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_ancestro_lider', bandaRef: 'band_ancestro',
      nombreArtistico: 'Ancestro',
      integrantes: [
        { nombre: 'Rulo', instrumento: 'saxo', userId: 'usr_rulo_sax' },
        { nombre: 'Vega', instrumento: 'contrabajo', userId: 'usr_vega' },
        { nombre: 'Pancho', instrumento: 'batería', userId: 'usr_pancho_bat' },
      ],
      instrumentos: ['saxo', 'contrabajo', 'batería'],
      genero: 'jazz',
      referenciaMusical: '',
      canciones: [
        { titulo: 'Improvisación 1', duracionAprox: 8 },
        { titulo: 'Improvisación 2', duracionAprox: 7 },
        { titulo: 'Improvisación 3', duracionAprox: 5 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Micrófono para saxo y contrabajo. Amplificador para bajo.',
      contacto: '@ancestro.jazz',
      estado: 'anotado',
      ordenCola: 7, tiempoEstimadoMin: 20,
      inicioReal: null, finReal: null,
      notasOrganizador: '',
    },

    /* 8 — Macho Cabrio · anotado */
    {
      id: 'act_8', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_macho_lider', bandaRef: 'band_macho',
      nombreArtistico: 'Macho Cabrio',
      integrantes: [
        { nombre: 'Toro', instrumento: 'voz', userId: 'usr_toro_voz' },
        { nombre: 'Negra', instrumento: 'guitarra', userId: 'usr_negra_g' },
        { nombre: 'Dani', instrumento: 'bajo', userId: 'usr_dani_b' },
        { nombre: 'Pollo', instrumento: 'batería', userId: 'usr_pollo' },
      ],
      instrumentos: ['voz', 'guitarra', 'bajo', 'batería'],
      genero: 'punk rock',
      referenciaMusical: '',
      canciones: [
        { titulo: 'Sin permiso', duracionAprox: 3 },
        { titulo: 'Cadena rota', duracionAprox: 3 },
        { titulo: 'A todo o nada', duracionAprox: 4 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Traen su propio ampli. Necesitan batería completa.',
      contacto: '@machocabrio',
      estado: 'anotado',
      ordenCola: 8, tiempoEstimadoMin: 15,
      inicioReal: null, finReal: null,
      notasOrganizador: '',
    },

    /* 9 — Sirene · anotado */
    {
      id: 'act_9', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_maca', bandaRef: 'band_sirene',
      nombreArtistico: 'Sirene',
      integrantes: [
        { nombre: 'Maca', instrumento: 'voz', userId: 'usr_maca' },
        { nombre: 'Jose', instrumento: 'teclado', userId: 'usr_jose' },
        { nombre: 'Ina', instrumento: 'guitarra', userId: 'usr_ina' },
      ],
      instrumentos: ['voz', 'teclado', 'guitarra'],
      genero: 'indie pop',
      referenciaMusical: '',
      canciones: [
        { titulo: 'Marea baja', duracionAprox: 4 },
        { titulo: 'Coral', duracionAprox: 5 },
        { titulo: 'Sal', duracionAprox: 4 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Teclado con su base. Micrófono para voz.',
      contacto: '@sirene.band',
      estado: 'anotado',
      ordenCola: 9, tiempoEstimadoMin: 18,
      inicioReal: null, finReal: null,
      notasOrganizador: '',
    },

    /* 10 — Rompekadenas · anotado (extra, fuera de la lista del brief) */
    {
      id: 'act_10', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_rompe_lider', bandaRef: 'band_rompe',
      nombreArtistico: 'Rompekadenas',
      integrantes: [
        { nombre: 'Rulo', instrumento: 'voz', userId: 'usr_rulo_v' },
        { nombre: 'Negra', instrumento: 'guitarra', userId: 'usr_negra' },
        { nombre: 'Toro', instrumento: 'bajo', userId: 'usr_toro_b' },
        { nombre: 'Pollo', instrumento: 'batería', userId: 'usr_pollo_b' },
      ],
      instrumentos: ['voz', 'guitarra', 'bajo', 'batería'],
      genero: 'punk rock',
      referenciaMusical: '',
      canciones: [
        { titulo: 'Cadena rota', duracionAprox: 3 },
        { titulo: 'Sin permiso', duracionAprox: 3 },
        { titulo: 'A todo o nada', duracionAprox: 4 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Batería completa. Traen su propio ampli.',
      contacto: '@rompekadenas',
      estado: 'anotado',
      ordenCola: 10, tiempoEstimadoMin: 15,
      inicioReal: null, finReal: null,
      notasOrganizador: 'Se anotaron tarde. Confirmar si alcanzan a tocar.',
    },
  ];

  /* ---------- Inventario ----------
     Lista del brief: amplificador Fender, dos SM58, batería de
     Miguel, bajo Squier. */

  const inventario = [
    {
      id: 'inv_1', nombre: 'Amplificador Fender 100W',
      categoria: 'amplificacion', propietarioTipo: 'grupo', propietarioRef: null,
      estado: 'bueno', ubicacionRef: 'esp_comarca',
      disponibleParaPrestamo: true,
      prestadoA: '', notas: '',
    },
    {
      id: 'inv_2', nombre: 'Micrófono SM58 #1',
      categoria: 'microfono', propietarioTipo: 'grupo', propietarioRef: null,
      estado: 'bueno', ubicacionRef: 'esp_comarca',
      disponibleParaPrestamo: true,
      prestadoA: 'Excusa Rock', notas: 'En uso por la banda en vivo.',
    },
    {
      id: 'inv_3', nombre: 'Micrófono SM58 #2',
      categoria: 'microfono', propietarioTipo: 'grupo', propietarioRef: null,
      estado: 'bueno', ubicacionRef: 'esp_comarca',
      disponibleParaPrestamo: true,
      prestadoA: '', notas: '',
    },
    {
      id: 'inv_4', nombre: 'Batería completa',
      categoria: 'percusion', propietarioTipo: 'usuario', propietarioRef: 'usr_miguel',
      estado: 'bueno', ubicacionRef: 'esp_comarca',
      disponibleParaPrestamo: false,
      prestadoA: '', notas: 'Trae Miguel. Cuidar el bombo.',
    },
    {
      id: 'inv_5', nombre: 'Bajo Squier',
      categoria: 'cuerdas', propietarioTipo: 'grupo', propietarioRef: null,
      estado: 'bueno', ubicacionRef: 'esp_comarca',
      disponibleParaPrestamo: true,
      prestadoA: '', notas: '',
    },
  ];

  /* ---------- Préstamos ---------- */

  const prestamos = [
    {
      id: 'pre_1', inventarioRef: 'inv_2', tocataRef: 'toc_10_a_las_10',
      prestadoA: 'usr_pancho', prestadoPor: 'usr_seba',
      fechaPrestamo: '2026-10-10T10:15:00',
      fechaDevolucion: null,
      estado: 'activo',
      notas: 'Micrófono para la voz principal de Excusa Rock.',
    },
  ];

  /* ---------- Turnos del evento ---------- */

  const turnos = [
    { id: 'turn_1', tocataRef: 'toc_10_a_las_10', tarea: 'Sonido',       asignado: 'Seba',  hora: '10:00 — 12:00', hecho: true },
    { id: 'turn_2', tocataRef: 'toc_10_a_las_10', tarea: 'Puerta y aforo', asignado: 'Pame', hora: '10:00 — 14:00', hecho: false },
    { id: 'turn_3', tocataRef: 'toc_10_a_las_10', tarea: 'Parrilla',      asignado: 'Seba',  hora: '12:00 — 15:00', hecho: false },
    { id: 'turn_4', tocataRef: 'toc_10_a_las_10', tarea: 'Fotos',         asignado: 'Amaru', hora: 'Todo el día',   hecho: false },
    { id: 'turn_5', tocataRef: 'toc_10_a_las_10', tarea: 'Cocina',        asignado: 'Pame',  hora: '11:00 — 17:00', hecho: false },
    { id: 'turn_6', tocataRef: 'toc_10_a_las_10', tarea: 'Reemplazo de sonido', asignado: '—', hora: '—', hecho: false },
  ];

  /* ---------- Checklist del día ---------- */

  const checklist = [
    { id: 'chk_1', tocataRef: 'toc_10_a_las_10', tarea: 'Montaje de escenario y sonido', hecho: true  },
    { id: 'chk_2', tocataRef: 'toc_10_a_las_10', tarea: 'Permiso y aviso a vecinos',      hecho: true  },
    { id: 'chk_3', tocataRef: 'toc_10_a_las_10', tarea: 'Parrilla y cocina',              hecho: false },
    { id: 'chk_4', tocataRef: 'toc_10_a_las_10', tarea: 'Revisar clima y plan B',         hecho: false },
    { id: 'chk_5', tocataRef: 'toc_10_a_las_10', tarea: 'Abrir registro de músicos',      hecho: true  },
    { id: 'chk_6', tocataRef: 'toc_10_a_las_10', tarea: 'Foto del grupo al inicio',       hecho: false },
  ];

  /* ---------- Caja del evento ---------- */

  const caja = [
    { id: 'caja_1', tocataRef: 'toc_10_a_las_10', concepto: 'Gorra (aporte voluntario)', monto:  48000 },
    { id: 'caja_2', tocataRef: 'toc_10_a_las_10', concepto: 'Carbón y bebidas',          monto: -22000 },
    { id: 'caja_3', tocataRef: 'toc_10_a_las_10', concepto: 'Cuerdas de repuesto',       monto:  -6500 },
  ];

  /* ---------- Avisos ----------
     Públicos y de equipo. Los públicos aparecen en la cartelera. */

  const avisos = [
    {
      id: 'avi_1', tocataRef: 'toc_10_a_las_10',
      titulo: 'Bienvenida',
      mensaje: 'Gracias por venir. La parrilla está encendida, el sonido probado. Que empiece la jam.',
      tipo: 'publico', importante: false, visibleEnCartelera: true,
      creadoPor: 'usr_yayo', creadoEn: '2026-10-10T09:55:00',
    },
    {
      id: 'avi_2', tocataRef: 'toc_10_a_las_10',
      titulo: 'Zumbido en el amplificador izquierdo',
      mensaje: 'El amplificador del flanco izquierdo tiene un zumbido. Revisar antes del siguiente acto.',
      tipo: 'equipo', importante: true, visibleEnCartelera: false,
      creadoPor: 'usr_yayo', creadoEn: '2026-10-10T10:30:00',
    },
    {
      id: 'avi_3', tocataRef: 'toc_10_a_las_10',
      titulo: 'Parrilla a las 12:00',
      mensaje: 'La parrilla se enciende a las 12:00. Si alguien puede traer más carbón, mejor.',
      tipo: 'equipo', importante: false, visibleEnCartelera: false,
      creadoPor: 'usr_seba', creadoEn: '2026-10-10T10:15:00',
    },
    {
      id: 'avi_4', tocataRef: 'toc_10_a_las_10',
      titulo: 'Agua y frutas en la cocina',
      mensaje: 'Hay agua y frutas en la cocina. Los músicos pueden pasar cuando quieran.',
      tipo: 'equipo', importante: false, visibleEnCartelera: false,
      creadoPor: 'usr_pame', creadoEn: '2026-10-10T09:45:00',
    },
  ];

  /* ---------- Votaciones ---------- */

  const votaciones = [
    {
      id: 'vot_1', tocataRef: 'toc_10_a_las_10',
      titulo: 'Mejor acto de la noche',
      descripcion: 'Vota por quien te movió más.',
      tipo: 'por_tocata', categoria: 'mejor_acto',
      opciones: [
        { id: 'opt_1', titulo: 'Excusa Rock',  ref: 'act_2' },
        { id: 'opt_2', titulo: 'Los Treiles',  ref: 'act_5' },
        { id: 'opt_3', titulo: 'Macho Cabrio', ref: 'act_8' },
      ],
      estado: 'activa',
      permiteMultiples: false, soloPresentes: true,
      premio: 'Cena para dos', premioKyu: 50,
      resultados: [42, 35, 23],
    },
    {
      id: 'vot_2', tocataRef: 'toc_10_a_las_10',
      titulo: 'Tema más pedido',
      descripcion: 'Qué tema quieres volver a escuchar.',
      tipo: 'por_tocata', categoria: 'tema_favorito',
      opciones: [
        { id: 'opt_4', titulo: 'La jardinera', ref: null },
        { id: 'opt_5', titulo: 'Cielo roto',   ref: null },
        { id: 'opt_6', titulo: 'Marea baja',   ref: null },
      ],
      estado: 'borrador',
      permiteMultiples: false, soloPresentes: true,
      premio: null, premioKyu: 0,
      resultados: [],
    },
  ];

  /* ---------- Paradas (gira) ---------- */

  const paradas = [
    { id: 'par_1', fecha: '10 OCT', lugar: 'Casa Cultural La Comarca', comuna: 'Av. España · Chillán',         hoy: true,  estado: 'hoy' },
    { id: 'par_2', fecha: '24 OCT', lugar: 'El último Andén',           comuna: 'Calle Brasil · Chillán',       hoy: false, estado: 'confirmada' },
    { id: 'par_3', fecha: '07 NOV', lugar: 'UBB la Castilla',           comuna: 'Av. Andrés Bello · Chillán',   hoy: false, estado: 'sin permiso' },
    { id: 'par_4', fecha: '21 NOV', lugar: 'Por definir',               comuna: '—',                            hoy: false, estado: 'idea' },
  ];

  /* ---------- Resúmenes de tocatas finalizadas ---------- */

  const resumenes = [
    {
      id: 'res_1', tocataRef: 'toc_microfono_7',
      cantidadActos: 14, cantidadTemas: 34, duracionTotalMin: 180,
      cantidadIngresos: 87, cantidadGratis: 45, recaudacion: 130500,
      notas: 'Buena convocatoria. Repetir formato.',
      destacados: [
        'Los Treiles cerraron la jornada con un bis espontáneo.',
        'Se sumó un poeta al micrófono abierto que no estaba en la lista.',
      ],
      publicado: true,
    },
    {
      id: 'res_2', tocataRef: 'toc_jam_invierno',
      cantidadActos: 8, cantidadTemas: 19, duracionTotalMin: 240,
      cantidadIngresos: 32, cantidadGratis: 12, recaudacion: 48000,
      notas: 'Poca convocatoria por el frío. No repetir en invierno sin calefacción.',
      destacados: ['Pancho improvisó un set de batería solo con la sala casi vacía.'],
      publicado: true,
    },
  ];

  /* ---------- Perfil de Yayo como músico ----------
     Vive separado del usuario de sesión porque describe su faceta
     artística, no sus permisos. */

  const musicoPerfil = {
    usuarioRef: 'usr_yayo',
    instrumentos: ['guitarra', 'voz'],
    agenda: [
      {
        tocataRef: 'toc_10_a_las_10',
        nombre: 'El 10 a las 10',
        espacio: 'Casa Cultural La Comarca',
        estado: 'aprobado',
        posicion: 11,
        minutos: 15,
      },
    ],
    bandas: [],
    participaciones: [
      {
        fecha: '26 SEP 2026',
        nombre: 'Noche de Micrófono Abierto #7',
        espacio: 'El último Andén',
        temas: 2,
      },
      {
        fecha: '14 AGO 2026',
        nombre: 'Jam de Invierno',
        espacio: 'Casa Cultural La Comarca',
        temas: 3,
      },
    ],
    kyu: 340,
  };

  /* ---------- Ingresos registrados (check-in de hoy) ---------- */

  const ingresos = [
    { id: 'ing_1', tocataRef: 'toc_10_a_las_10', usuarioRef: null, nombreInvitado: 'Vecino',   tipo: 'gratis_anonimo', monto: 0, checkInEn: '2026-10-10T10:10:00' },
    { id: 'ing_2', tocataRef: 'toc_10_a_las_10', usuarioRef: null, nombreInvitado: 'Sra. Rosa', tipo: 'gratis_anonimo', monto: 0, checkInEn: '2026-10-10T10:25:00' },
  ];

  /* ---------- Publicación en el estado compartido ---------- */

  establecer('grupo',       grupo);
  establecer('equipo',      equipo);
  establecer('comunidad',   comunidad);
  establecer('espacios',    espacios);
  establecer('tocatas',     tocatas);
  establecer('actos',       actos);
  establecer('inventario',  inventario);
  establecer('prestamos',   prestamos);
  establecer('turnos',      turnos);
  establecer('checklist',   checklist);
  establecer('caja',        caja);
  establecer('avisos',      avisos);
  establecer('votaciones',  votaciones);
  establecer('paradas',     paradas);
  establecer('resumenes',   resumenes);
  establecer('musicoPerfil', musicoPerfil);
  establecer('ingresos',    ingresos);

  establecer('tocataActivaId', 'toc_10_a_las_10');
}