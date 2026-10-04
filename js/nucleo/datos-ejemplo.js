/* ================================================================
   LaTocata — MÓDULO JS (ES6)
   Archivo: js/nucleo/datos-ejemplo.js
   Versión: 0.1.2
   Propósito: Datos de ejemplo del prototipo. Se cargan al
              arrancar y se guardan en el estado compartido.
              v0.1.2: se reemplaza la banda "Los Pinos" por las
                      cuatro bandas reales del prototipo: Excusa
                      Rock, Los Treiles, Rompekadenas y Sirene.
                      Se agregan tres actos (act_7, act_8, act_9)
                      para esas bandas. El anfitrión del espacio
                      Casa Amarilla pasa a ser Andrés Monjes. Los
                      demás anfitriones quedan sin cambio.
              v0.1.1: se agrega 'resumenes' con el cierre de la
                      tocata pasada "Noche de Micrófono Abierto #7"
                      y el campo 'contacto' en los actos.
              v0.1.0: versión inicial.
   ================================================================ */

import { establecer } from './estado.js';

export function cargarDatosEjemplo() {
  const grupo = {
    id: 'grp_chillan',
    nombre: 'Colectivo Cultural Chillán',
    slug: 'colectivo-chillan',
    ciudad: 'Chillán',
  };

  const equipo = [
    { usuarioId: 'usr_andres', nombre: 'Andrés Monjes', rol: 'organizador', etiquetas: ['espacio'], iniciales: 'AM' },
    { usuarioId: 'usr_yayo',   nombre: 'Eduardo Quilodrán', rol: 'organizador', etiquetas: ['produccion'], iniciales: 'YQ' },
    { usuarioId: 'usr_amaru',  nombre: 'Amaru', rol: 'staff', etiquetas: ['foto'], iniciales: 'AM' },
    { usuarioId: 'usr_seba',   nombre: 'Seba',  rol: 'staff', etiquetas: ['parrilla'], iniciales: 'SE' },
    { usuarioId: 'usr_pame',   nombre: 'Pame',  rol: 'staff', etiquetas: ['cocina'], iniciales: 'PA' },
    { usuarioId: 'usr_miguel', nombre: 'Miguel', rol: 'staff', etiquetas: ['sonido'], iniciales: 'MI' },
  ];

  const espacios = [
    {
      id: 'esp_casa_amarilla',
      nombre: 'Casa Amarilla',
      direccion: 'Av. España 1234',
      comuna: 'Chillán',
      tipo: 'casa',
      anfitrionNombre: 'Andrés Monjes',
      anfitrionContacto: '+56 9 1234 5678',
      capacidad: 60,
      tieneSonido: true,
      tieneBanos: true,
      tieneElectricidad: true,
      condiciones: 'Cuidar el jardín. Sin amplificadores después de las 23:30.',
      notasInternas: 'Casa antigua. Se usa para eventos que ayuden a pagar el arriendo.',
    },
    {
      id: 'esp_galpon_sindicato',
      nombre: 'Galpón del Sindicato',
      direccion: 'Calle Arturo Prat 456',
      comuna: 'Chillán',
      tipo: 'galpon',
      anfitrionNombre: 'Sindicato de Panaderos',
      anfitrionContacto: '+56 9 8765 4321',
      capacidad: 120,
      tieneSonido: true,
      tieneBanos: true,
      tieneElectricidad: true,
      condiciones: 'Sonido hasta las 2 AM.',
      notasInternas: 'Cobran un aporte voluntario.',
    },
    {
      id: 'esp_plaza_vieja',
      nombre: 'Plaza Vieja',
      direccion: 'Plaza de Armas',
      comuna: 'Chillán',
      tipo: 'plaza',
      anfitrionNombre: 'Municipalidad',
      anfitrionContacto: '+56 42 222 0000',
      capacidad: 200,
      tieneSonido: false,
      tieneBanos: false,
      tieneElectricidad: false,
      condiciones: 'Requiere permiso municipal.',
      notasInternas: 'Ideal para eventos gratuitos de tarde.',
    },
  ];

  const tocatas = [
    {
      id: 'toc_10_a_las_10',
      slug: '10-a-las-10',
      nombre: 'El 10 a las 10',
      tipo: 'jam',
      modalidad: 'libre',
      espacioRef: 'esp_casa_amarilla',
      fecha: '2026-10-10T10:00:00',
      horaInicio: '10:00',
      horaFinEstimada: '18:00',
      estado: 'publicada',
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
      espacioRef: 'esp_galpon_sindicato',
      fecha: '2026-10-24T20:00:00',
      horaInicio: '20:00',
      horaFinEstimada: '02:00',
      estado: 'borrador',
      aforoMax: 120,
      descripcion: 'Segunda edición de la jam en el galpón.',
      notasInternas: 'Confirmar sonido con Miguel.',
    },
    {
      id: 'toc_microfono_7',
      slug: 'microfono-abierto-7',
      nombre: 'Noche de Micrófono Abierto #7',
      tipo: 'microfono_abierto',
      modalidad: 'cuadrada',
      espacioRef: 'esp_plaza_vieja',
      fecha: '2026-09-26T19:00:00',
      horaInicio: '19:00',
      horaFinEstimada: '22:00',
      estado: 'finalizada',
      aforoMax: 200,
      descripcion: 'Edición de septiembre.',
      notasInternas: 'Buena convocatoria. Repetir formato.',
    },
  ];

  const actos = [
    {
      id: 'act_1', tocataRef: 'toc_10_a_las_10',
      tipo: 'solista', musicoRef: 'usr_miguel', bandaRef: null,
      nombreArtistico: 'Miguel',
      instrumentos: ['batería'],
      genero: 'rock',
      canciones: [{ titulo: 'Improvisación libre', duracionAprox: 5 }],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Batería ya en el patio',
      contacto: '+56 9 5555 1111',
      estado: 'aprobado', ordenCola: 1, tiempoEstimadoMin: 15,
      notasOrganizador: '',
    },
    {
      id: 'act_2', tocataRef: 'toc_10_a_las_10',
      tipo: 'duo', musicoRef: 'usr_andres', bandaRef: null,
      nombreArtistico: 'Andrés & Yayo',
      instrumentos: ['guitarra', 'voz'],
      genero: 'folklore',
      canciones: [
        { titulo: 'La jardinera', duracionAprox: 4 },
        { titulo: 'Gracias a la vida', duracionAprox: 4 },
      ],
      cantidadTemas: 2, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Micrófono',
      contacto: '',
      estado: 'aprobado', ordenCola: 2, tiempoEstimadoMin: 12,
      notasOrganizador: '',
    },
    {
      id: 'act_3', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_excusa_lider', bandaRef: 'band_excusa_rock',
      nombreArtistico: 'Excusa Rock',
      integrantes: [
        { nombre: 'Pancho', instrumento: 'voz', userId: 'usr_pancho' },
        { nombre: 'Karla', instrumento: 'guitarra', userId: 'usr_karla' },
        { nombre: 'Dani', instrumento: 'bajo', userId: 'usr_dani' },
      ],
      instrumentos: ['voz', 'guitarra', 'bajo'],
      genero: 'rock alternativo',
      canciones: [
        { titulo: 'Sin señal', duracionAprox: 4 },
        { titulo: 'Cable a tierra', duracionAprox: 5 },
        { titulo: 'Ruido blanco', duracionAprox: 4 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Amplificador para guitarra y bajo',
      contacto: '@excusa.rock',
      estado: 'aprobado', ordenCola: 3, tiempoEstimadoMin: 20,
      notasOrganizador: 'Banda recurrente. Vinieron a la #6.',
    },
    {
      id: 'act_4', tocataRef: 'toc_10_a_las_10',
      tipo: 'solista', musicoRef: 'usr_amaru', bandaRef: null,
      nombreArtistico: 'Amaru',
      instrumentos: ['voz', 'charango'],
      genero: 'trova',
      canciones: [{ titulo: 'Pendiente de definir', duracionAprox: 5 }],
      cantidadTemas: 2, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Micrófono',
      contacto: '',
      estado: 'anotado', ordenCola: 4, tiempoEstimadoMin: 15,
      notasOrganizador: '',
    },
    {
      id: 'act_5', tocataRef: 'toc_10_a_las_10',
      tipo: 'solista', musicoRef: 'usr_cata', bandaRef: null,
      nombreArtistico: 'Cata',
      instrumentos: ['voz'],
      genero: 'blues',
      canciones: [],
      cantidadTemas: 1, hastaQueLoBajen: true,
      necesitaEquipamiento: 'Micrófono',
      contacto: '@cata.blues',
      estado: 'aprobado', ordenCola: 5, tiempoEstimadoMin: 15,
      notasOrganizador: '',
    },
    {
      id: 'act_6', tocataRef: 'toc_10_a_las_10',
      tipo: 'solista', musicoRef: 'usr_tomas', bandaRef: null,
      nombreArtistico: 'Tomás',
      instrumentos: ['guitarra'],
      genero: 'folk',
      canciones: [],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Guitarra propia',
      contacto: '',
      estado: 'anotado', ordenCola: 6, tiempoEstimadoMin: 15,
      notasOrganizador: '',
    },
    {
      id: 'act_7', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_treiles_lider', bandaRef: 'band_los_treiles',
      nombreArtistico: 'Los Treiles',
      integrantes: [
        { nombre: 'Vale', instrumento: 'voz', userId: 'usr_vale' },
        { nombre: 'Chino', instrumento: 'guitarra', userId: 'usr_chino' },
        { nombre: 'Flor', instrumento: 'flauta traversa', userId: 'usr_flor' },
        { nombre: 'Iván', instrumento: 'percusión', userId: 'usr_ivan' },
      ],
      instrumentos: ['voz', 'guitarra', 'flauta traversa', 'percusión'],
      genero: 'folklore fusión',
      canciones: [
        { titulo: 'Vuelo de treile', duracionAprox: 5 },
        { titulo: 'Tierra adentro', duracionAprox: 4 },
        { titulo: 'Canto al río', duracionAprox: 6 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Micrófono para flauta y percusión',
      contacto: '@lostreiles',
      estado: 'anotado', ordenCola: 7, tiempoEstimadoMin: 18,
      notasOrganizador: '',
    },
    {
      id: 'act_8', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_rompe_lider', bandaRef: 'band_rompekadenas',
      nombreArtistico: 'Rompekadenas',
      integrantes: [
        { nombre: 'Rulo', instrumento: 'voz', userId: 'usr_rulo' },
        { nombre: 'Negra', instrumento: 'guitarra', userId: 'usr_negra' },
        { nombre: 'Toro', instrumento: 'bajo', userId: 'usr_toro' },
        { nombre: 'Pollo', instrumento: 'batería', userId: 'usr_pollo' },
      ],
      instrumentos: ['voz', 'guitarra', 'bajo', 'batería'],
      genero: 'punk rock',
      canciones: [
        { titulo: 'Cadena rota', duracionAprox: 3 },
        { titulo: 'Sin permiso', duracionAprox: 3 },
        { titulo: 'A todo o nada', duracionAprox: 4 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Batería completa. Traen su propio ampli.',
      contacto: '@rompekadenas',
      estado: 'anotado', ordenCola: 8, tiempoEstimadoMin: 15,
      notasOrganizador: '',
    },
    {
      id: 'act_9', tocataRef: 'toc_10_a_las_10',
      tipo: 'banda', musicoRef: 'usr_sirene_lider', bandaRef: 'band_sirene',
      nombreArtistico: 'Sirene',
      integrantes: [
        { nombre: 'Maca', instrumento: 'voz', userId: 'usr_maca' },
        { nombre: 'Jose', instrumento: 'teclado', userId: 'usr_jose' },
        { nombre: 'Ina', instrumento: 'guitarra', userId: 'usr_ina' },
      ],
      instrumentos: ['voz', 'teclado', 'guitarra'],
      genero: 'indie pop',
      canciones: [
        { titulo: 'Marea baja', duracionAprox: 4 },
        { titulo: 'Coral', duracionAprox: 5 },
        { titulo: 'Sal', duracionAprox: 4 },
      ],
      cantidadTemas: 3, hastaQueLoBajen: false,
      necesitaEquipamiento: 'Teclado con su base',
      contacto: '@sirene.band',
      estado: 'anotado', ordenCola: 9, tiempoEstimadoMin: 18,
      notasOrganizador: '',
    },
  ];

  const ingresos = [
    { id: 'ing_1', tocataRef: 'toc_10_a_las_10', usuarioRef: null, nombreInvitado: 'Vecino', tipo: 'gratis_anonimo', monto: 0 },
    { id: 'ing_2', tocataRef: 'toc_10_a_las_10', usuarioRef: null, nombreInvitado: 'Sra. Rosa', tipo: 'gratis_anonimo', monto: 0 },
  ];

  const inventario = [
    { id: 'inv_1', nombre: 'Amplificador Fender 100W', categoria: 'amplificacion', propietarioTipo: 'grupo', propietarioRef: null, estado: 'bueno', disponibleParaPrestamo: true, notas: '' },
    { id: 'inv_2', nombre: 'Amplificador Marshall 50W', categoria: 'amplificacion', propietarioTipo: 'usuario', propietarioRef: 'usr_miguel', estado: 'bueno', disponibleParaPrestamo: true, notas: 'Trae Miguel' },
    { id: 'inv_3', nombre: 'Micrófono Shure SM58', categoria: 'microfono', propietarioTipo: 'grupo', propietarioRef: null, estado: 'bueno', disponibleParaPrestamo: true, notas: '' },
    { id: 'inv_4', nombre: 'Micrófono Shure SM58', categoria: 'microfono', propietarioTipo: 'grupo', propietarioRef: null, estado: 'funciona_pero', disponibleParaPrestamo: true, notas: 'Cable suelto' },
    { id: 'inv_5', nombre: 'Micrófono dinámico barato', categoria: 'microfono', propietarioTipo: 'grupo', propietarioRef: null, estado: 'bueno', disponibleParaPrestamo: true, notas: '' },
    { id: 'inv_6', nombre: 'Guitarra acústica Yamaha', categoria: 'cuerdas', propietarioTipo: 'grupo', propietarioRef: null, estado: 'bueno', disponibleParaPrestamo: true, notas: '' },
    { id: 'inv_7', nombre: 'Bajo Squier', categoria: 'cuerdas', propietarioTipo: 'grupo', propietarioRef: null, estado: 'bueno', disponibleParaPrestamo: true, notas: '' },
    { id: 'inv_8', nombre: 'Batería completa', categoria: 'percusion', propietarioTipo: 'usuario', propietarioRef: 'usr_miguel', estado: 'bueno', disponibleParaPrestamo: true, notas: 'Trae Miguel. Ojo con el bombo.' },
  ];

  const avisos = [
    { id: 'avi_1', tocataRef: 'toc_10_a_las_10', titulo: 'Bienvenida', mensaje: 'Gracias por venir. La parrilla está encendida, el sonido probado. Que empiece la jam.', tipo: 'publico', importante: false },
  ];

  const votaciones = [
    {
      id: 'vot_1', tocataRef: 'toc_10_a_las_10',
      titulo: 'Mejor acto de la noche',
      descripcion: 'Vota por quien te movió más.',
      tipo: 'por_tocata',
      opciones: [
        { id: 'opt_1', titulo: 'Miguel', ref: 'act_1' },
        { id: 'opt_2', titulo: 'Andrés & Yayo', ref: 'act_2' },
        { id: 'opt_3', titulo: 'Excusa Rock', ref: 'act_3' },
        { id: 'opt_4', titulo: 'Los Treiles', ref: 'act_7' },
        { id: 'opt_5', titulo: 'Rompekadenas', ref: 'act_8' },
        { id: 'opt_6', titulo: 'Sirene', ref: 'act_9' },
      ],
      estado: 'borrador',
      soloPresentes: true,
      premio: 'Cena para dos',
      premioKyu: 50,
    },
  ];

  const comunidad = [
    { id: 'com_1', usuarioRef: 'usr_andres', nombre: 'Andrés Monjes', tipo: 'musico', etiquetas: ['guitarra'], notasInternas: 'A cargo del espacio.' },
    { id: 'com_2', usuarioRef: 'usr_yayo', nombre: 'Eduardo Quilodrán', tipo: 'musico', etiquetas: ['guitarra', 'voz'], notasInternas: 'Hace la app.' },
    { id: 'com_3', usuarioRef: 'usr_amaru', nombre: 'Amaru', tipo: 'colaborador', etiquetas: ['foto', 'publicidad'], notasInternas: '' },
    { id: 'com_4', usuarioRef: 'usr_seba', nombre: 'Seba', tipo: 'colaborador', etiquetas: ['parrilla'], notasInternas: 'Vino con la idea original.' },
    { id: 'com_5', usuarioRef: 'usr_pame', nombre: 'Pame', tipo: 'colaborador', etiquetas: ['cocina'], notasInternas: 'Pareja de Seba.' },
    { id: 'com_6', usuarioRef: 'usr_miguel', nombre: 'Miguel', tipo: 'musico', etiquetas: ['batería'], notasInternas: 'Trae la batería.' },
    { id: 'com_7', usuarioRef: null, nombre: 'Familia Rodríguez', tipo: 'anfitrion', etiquetas: ['vecinos'], notasInternas: 'Prestan sillas.' },
  ];

  const resumenes = [
    {
      id: 'res_1',
      tocataRef: 'toc_microfono_7',
      cantidadActos: 14,
      cantidadTemas: 34,
      duracionTotalMin: 180,
      cantidadIngresos: 87,
      cantidadGratis: 45,
      recaudacion: 130500,
      notas: 'Buena convocatoria. Repetir formato.',
      destacados: [
        'Los Treiles cerraron la jornada con un bis espontáneo.',
        'Se sumó un poeta al micrófono abierto que no estaba en la lista.',
      ],
      publicado: true,
    },
  ];

  establecer('grupo', grupo);
  establecer('equipo', equipo);
  establecer('espacios', espacios);
  establecer('tocatas', tocatas);
  establecer('actos', actos);
  establecer('ingresos', ingresos);
  establecer('inventario', inventario);
  establecer('avisos', avisos);
  establecer('votaciones', votaciones);
  establecer('comunidad', comunidad);
  establecer('resumenes', resumenes);
  establecer('tocataActivaId', 'toc_10_a_las_10');
}