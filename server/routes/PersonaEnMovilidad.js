 // routes/personas.js
const express = require('express');
const router = express.Router();
const db = require('../db');

const NOTIFICACION_TIPOS = {
  NUEVO_REGISTRO: 'nuevo_registro',
  ACTUALIZACION: 'actualizacion',
  ENCUENTRO: 'encuentro',
  SISTEMA: 'sistema',
  NUEVA_DESAPARECIDA: 'nueva_desaparecida',
  CAMBIO_DESAPARECIDA: 'cambio_desaparecida'
};

// Agregar esta función al inicio del archivo
const crearNotificacionParaCoordinadores = async (titulo, mensaje, tipo = 'sistema') => {
  try {
    const [coordinadores] = await db.query(
      'SELECT idEntrevistador FROM Entrevistadores WHERE rol = "Coordinador"'
    );

    for (const coordinador of coordinadores) {
      await db.query(
        `INSERT INTO Notificaciones
         (idEntrevistador, titulo, mensaje, tipo, fecha_creacion, leida)
         VALUES (?, ?, ?, ?, NOW(), 0)`,
        [coordinador.idEntrevistador, titulo, mensaje, tipo]
      );
    }
  } catch (error) {
    console.error('Error al crear notificaciones para coordinadores:', error);
  }
};

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// CREATE
router.post('/', async (req, res) => {
  try {
    const d = req.body;
    
    // Validación mínima
    if (!d.Nombre || !d.PrimerApellido) {
      return res.status(400).json({ error: 'Nombre y primer apellido son obligatorios' });
    }

    

    const [duplicateCheck] = await db.query(
      'SELECT idPersona, Situacion FROM PersonaEnMovilidad WHERE Nombre = ? AND PrimerApellido = ?',
      [d.Nombre, d.PrimerApellido]
    );

    // Get user role from token
    let userRole = 'Registrador';
    const authHeader = req.headers['authorization'];
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const [userRows] = await db.query(
          'SELECT rol FROM Entrevistadores WHERE idEntrevistador = ?',
          [decoded.userId]
        );
        if (userRows.length > 0) {
          userRole = userRows[0].rol;
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }

   
    if (duplicateCheck.length > 0) {
  const duplicado = duplicateCheck[0];
  
  // En el bloque de verificación de duplicados, modificar la sección de 'En Movilidad'
  if (duplicado.Situacion === 'En Movilidad') {
    if (userRole === 'Coordinador') {
      return res.status(409).json({ 
        error: 'DUPLICATE_MOBILITY', 
        idPersona: duplicado.idPersona,
        message: 'Persona encontrada en movilidad - redirigir a edición'
      });
    } else {
      // CREAR NOTIFICACIÓN PARA COORDINADORES PERO PERMITIR EL REGISTRO
      await crearNotificacionParaCoordinadores(
        'Registro de persona en movilidad como desaparecida',
        `Un registrador ha registrado a ${d.Nombre} ${d.PrimerApellido} que ya está registrado en movilidad.`,
        NOTIFICACION_TIPOS.SISTEMA
      );

      // No retornamos error, continuamos con el registro
      // break; // No break, simplemente continuamos
    }
  } else if (duplicado.Situacion === 'Desaparecida') {
    return res.status(409).json({ 
      error: 'DUPLICATE_MISSING', 
      message: 'Ya existe una persona desaparecida con ese nombre y apellido'
    });
  }
}

    // If no duplicates or allowed to proceed, continue with insertion
    const formatDate = (date) => {
      if (!date) return null;
      return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    };

    const values = [
      d.Nombre,
      d.PrimerApellido,
      d.SegundoApellido ?? null,
      d.Estado ?? null,
      d.Imagen ?? null,
      d.MensajeFamiliares ?? null,
      d.Necesidades ?? null,
      d.DescripcionFisica ?? null,
      d.TrabajadorHogar ?? null,
      d.TrabajadorCampo ?? null,
      d.SituacionCalle ?? null,
      d.LocalidadOrigen ?? null,
      d.PaisDestino ?? null,
      d.EstadoDestino ?? null,
      d.LocalidadDestino ?? null,
      d.PuntoEntradaMex ?? null,
      d.PuntoEntradaUSA ?? null,
      d.Nacionalidad ?? null,
      formatDate(d.FechaNacimiento),
      d.EstadoCivil ?? null,
      d.ViajaConIdentificacion ?? null,
      d.Identificacion ?? null,
      d.UltimoDomicilio ?? null,
      d.IdiomaMaterno ?? null,
      d.HablaEspanol ?? null,
      d.OtrosIdiomas ?? null,
      d.OtrosIdiomasCual ?? null,
      d.Profesion ?? null,
      d.EdadMigracion ?? null,
      d.AnoComienzoMigracion ?? null,
      d.Motivo ?? null,
      d.NumeroMigraciones ?? null,
      d.RelatoDesaparicion ?? null,
      d.PaisPerdidaContacto ?? null,
      d.EstadoPerdidaContacto ?? null,
      d.LocalidadPerdidaContacto ?? null,
      formatDate(d.FechaUltimaComunicacion),
      d.ConfirmacionEntradaPunto ?? null,
      d.Sexo ?? null,
      d.Genero ?? null,
      d.OtroSexoLibre ?? null,
      d.HayDenuncia ?? null,
      d.HayDenunciaCual ?? null,
      d.HayReporte ?? null,
      d.HayReporteCual ?? null,
      d.AvancesDenuncia ?? null,
      d.AvancesDenunciaCual ?? null,
      d.LugaresBusqueda ?? null,
      d.NombreQuienBusca ?? null,
      d.ApellidoPaternoQuienBusca ?? null,
      d.ApellidoMaternoQuienBusca ?? null,
      d.ParentescoQuienBusca ?? null,
      d.DireccionQuienBusca ?? null,
      d.TelefonoQuienBusca ?? null,
      d.CorreoElectronicoQuienBusca ?? null,
      d.MensajeQuienBusca ?? null,
      d.InformacionUsadaPara ?? null,
      d.InformacionPublica ?? null,
      d.Institucion ?? null,
      d.Cargo ?? null,
      d.PersonaUltimaComunicacion ?? null,
      d.DeportadaAnteriormente ?? null,
      d.PaisDeportacion ?? null,
      formatDate(d.FechaUltimaDeportacion),
      d.Encarcelado ?? null,
      d.UbicacionCarcel ?? null,
      formatDate(d.FechaDetencion),
      d.IdentificacionDetencionEEUU ?? null,
      d.PapelesFalsos ?? null,
      d.PapelesFalsosCual ?? null,
      d.AcompañantesViaje ?? null,
      d.ConocidosEnExtranjero ?? null,
      d.Estatura ?? null,
      d.Peso ?? null,
      d.Complexion ?? null,
      d.ColorPiel ?? null,
      d.VelloFacial ?? null,
      d.VelloFacialCual ?? null,
      d.Lentes ?? null,
      d.Cabello ?? null,
      d.Embarazada ?? null,
      d.MesesEmbarazo ?? null,
      d.NumeroCelular ?? null,
      d.SeñalesParticulares ?? null,
      d.Lesiones ?? null,
      d.TipoDientes ?? null,
      d.EstadoSalud ?? null,
      d.DescripcionPrendas ?? null,
      d.RedesSociales ?? null, // Asumiendo que idEntrevistador viene en el cuerpo
      d.Situacion ?? '',
      d.idEntrevistador ?? null,
      d.idGrupo?? null
    ];

    const query = `
      INSERT INTO PersonaEnMovilidad (
        Nombre, PrimerApellido, SegundoApellido, Estado, Imagen, MensajeFamiliares,
        Necesidades, DescripcionFisica, TrabajadorHogar, TrabajadorCampo, SituacionCalle,
        LocalidadOrigen, PaisDestino, EstadoDestino, LocalidadDestino, PuntoEntradaMex, PuntoEntradaUSA,
        Nacionalidad, FechaNacimiento, EstadoCivil, ViajaConIdentificacion, Identificacion, UltimoDomicilio,
        IdiomaMaterno, HablaEspanol, OtrosIdiomas, OtrosIdiomasCual, Profesion,
        EdadMigracion, AnoComienzoMigracion, Motivo, NumeroMigraciones,
        RelatoDesaparicion, PaisPerdidaContacto, EstadoPerdidaContacto, LocalidadPerdidaContacto,
        FechaUltimaComunicacion, ConfirmacionEntradaPunto, Sexo, Genero, OtroSexoLibre,
        HayDenuncia, HayDenunciaCual, HayReporte, HayReporteCual, AvancesDenuncia,
        AvancesDenunciaCual, LugaresBusqueda, NombreQuienBusca, ApellidoPaternoQuienBusca,
        ApellidoMaternoQuienBusca, ParentescoQuienBusca, DireccionQuienBusca, TelefonoQuienBusca,
        CorreoElectronicoQuienBusca, MensajeQuienBusca, InformacionUsadaPara, InformacionPublica,
        Institucion, Cargo, PersonaUltimaComunicacion, DeportadaAnteriormente, PaisDeportacion,
        FechaUltimaDeportacion, Encarcelado, UbicacionCarcel, FechaDetencion,
        IdentificacionDetencionEEUU, PapelesFalsos, PapelesFalsosCual, AcompañantesViaje,
        ConocidosEnExtranjero, Estatura, Peso, Complexion, ColorPiel, VelloFacial,
        VelloFacialCual, Lentes, Cabello, Embarazada, MesesEmbarazo, NumeroCelular,
        SeñalesParticulares, Lesiones, TipoDientes, EstadoSalud, DescripcionPrendas,
        RedesSociales, Situacion ,idEntrevistador, idGrupo
      ) VALUES (
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
      )
    `;

    const [result] = await db.query(query, values);
    
    // Determinar tipo de notificación
    const tipoNotificacion = d.Situacion === 'Desaparecida' 
      ? NOTIFICACION_TIPOS.NUEVA_DESAPARECIDA 
      : NOTIFICACION_TIPOS.NUEVO_REGISTRO;
    
    // Mensaje personalizado
    const mensaje = d.Situacion === 'Desaparecida'
      ? `Se ha registrado a ${d.Nombre} ${d.PrimerApellido} como persona desaparecida`
      : `Se ha registrado a ${d.Nombre} ${d.PrimerApellido} como persona en movilidad`;

    await crearNotificacionParaCoordinadores(
      'Nuevo registro creado',
      mensaje,
      tipoNotificacion
    );
    
    res.status(201).json({ idPersona: result.insertId });
  }catch (error) {
    console.error('Error al insertar datos:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
 try {
    const { 
      Nombre = '', 
      PrimerApellido = '', 
      Situacion = '',
      idEntrevistador = null,
      Nacionalidad = '',
      PaisDestino = ''
    } = req.query;

    let sql = `
      SELECT * FROM PersonaEnMovilidad
      WHERE Nombre LIKE ?
        AND PrimerApellido LIKE ?
    `;
    
    const params = [
      `%${Nombre}%`, 
      `%${PrimerApellido}%`
    ];

    if (Situacion) {
      sql += ' AND Situacion = ?';
      params.push(Situacion);
    }

    if (Nacionalidad) {
      sql += ' AND Nacionalidad = ?';
      params.push(Nacionalidad);
    }

    if (PaisDestino) {
      sql += ' AND PaisDestino = ?';
      params.push(PaisDestino);
    }

    if (idEntrevistador) {
      sql += ' AND idEntrevistador = ?';
      params.push(idEntrevistador);
    } else {
      // Si no hay idEntrevistador, mostrar todas las situaciones
      sql += ' AND (Situacion = "En Movilidad" OR Situacion = "Desaparecida")';
    }

    const [rows] = await db.query(sql, params);
    res.status(200).json(rows);
  }  catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: error.message });
  }
});


// Cambiar el endpoint de encuentros-por-nombre
router.get('/encuentros-por-nombre', async (req, res) => {
  try {
    const { nombre, apellido } = req.query;
    
    // Primero obtener todos los IDs de personas con ese nombre y apellido
    const [personas] = await db.query(
      "SELECT idPersona FROM PersonaEnMovilidad WHERE Nombre = ? AND PrimerApellido = ?",
      [nombre, apellido]
    );

    if (personas.length === 0) {
      return res.status(200).json([]);
    }

    const ids = personas.map(p => p.idPersona);
    const placeholders = ids.map(() => '?').join(',');
    
    // Luego obtener todos los encuentros para esos IDs
    const [rows] = await db.query(`
      SELECT 
        e.*, 
        p.latitud, 
        p.longitud,
        p.descripcion AS lugar,
        per.Nombre,
        per.PrimerApellido,
        per.SegundoApellido
      FROM Encuentros e
      JOIN PuntoGeografico p ON e.IdPunto = p.idPunto
      JOIN PersonaEnMovilidad per ON e.IdPersona = per.idPersona
      WHERE e.IdPersona IN (${placeholders})
      ORDER BY e.Fecha DESC
    `, ids);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener encuentros por nombre:', error);
    res.status(500).json({ error: 'Error al obtener encuentros' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [personaRows] = await db.query(
      'SELECT * FROM PersonaEnMovilidad WHERE idPersona = ?', 
      [req.params.id]
    );
    
    if (!personaRows.length) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    
    const persona = personaRows[0];
    
    // Convertir imagen a base64
    if (persona.Imagen && Buffer.isBuffer(persona.Imagen)) {
      persona.Imagen = `data:image/jpeg;base64,${persona.Imagen.toString('base64')}`;
    }
    
    // Obtener información del grupo si existe
    let grupoInfo = null;
    if (persona.idGrupo) {
      const [grupoRows] = await db.query(
        'SELECT * FROM grupos WHERE idGrupo = ?',
        [persona.idGrupo]
      );
      
      if (grupoRows.length > 0) {
        grupoInfo = grupoRows[0];
        
        // Obtener integrantes del grupo
        const [integrantes] = await db.query(
          'SELECT idPersona, Nombre, PrimerApellido, Imagen FROM PersonaEnMovilidad WHERE idGrupo = ?',
          [persona.idGrupo]
        );
        
        // Procesar imágenes
        grupoInfo.integrantes = integrantes.map(p => ({
          ...p,
          Imagen: p.Imagen && Buffer.isBuffer(p.Imagen) 
            ? `data:image/jpeg;base64,${p.Imagen.toString('base64')}` 
            : null
        }));
      }
    }
    
    res.status(200).json({ ...persona, grupoInfo });
  } catch (error) {
    console.error('Error al obtener persona por ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
   const d = req.body;
  console.log('Situacion recibida:', req.body.Situacion);
  let values = [];
  try {
    const d = req.body;
     values = [
      d.Nombre,
      d.PrimerApellido,
      d.SegundoApellido ?? null,
      d.Estado ?? null,
      d.Imagen ?? null,
      d.MensajeFamiliares ?? null,
      d.Necesidades ?? null,
      d.DescripcionFisica ?? null,
      d.TrabajadorHogar ?? null,
      d.TrabajadorCampo ?? null,
      d.SituacionCalle ?? null,
      d.LocalidadOrigen ?? null,
      d.PaisDestino ?? null,
      d.EstadoDestino ?? null,
      d.LocalidadDestino ?? null,
      d.PuntoEntradaMex ?? null,
      d.PuntoEntradaUSA ?? null,
      d.Nacionalidad ?? null,
      d.FechaNacimiento ?? null,
      d.EstadoCivil ?? null,
      d.ViajaConIdentificacion ?? null,
      d.Identificacion ?? null,
      d.UltimoDomicilio ?? null,
      d.IdiomaMaterno ?? null,
      d.HablaEspanol ?? null,
      d.OtrosIdiomas ?? null,
      d.OtrosIdiomasCual ?? null,
      d.Profesion ?? null,
      d.EdadMigracion ?? null,
      d.AnoComienzoMigracion ?? null,
      d.Motivo ?? null,
      d.NumeroMigraciones ?? null,
      d.RelatoDesaparicion ?? null,
      d.PaisPerdidaContacto ?? null,
      d.EstadoPerdidaContacto ?? null,
      d.LocalidadPerdidaContacto ?? null,
      d.FechaUltimaComunicacion ?? null,
      d.ConfirmacionEntradaPunto ?? null,
      d.Sexo ?? null,
      d.Genero ?? null,
      d.OtroSexoLibre ?? null,
      d.HayDenuncia ?? null,
      d.HayDenunciaCual ?? null,
      d.HayReporte ?? null,
      d.HayReporteCual ?? null,
      d.AvancesDenuncia ?? null,
      d.AvancesDenunciaCual ?? null,
      d.LugaresBusqueda ?? null,
      d.NombreQuienBusca ?? null,
      d.ApellidoPaternoQuienBusca ?? null,
      d.ApellidoMaternoQuienBusca ?? null,
      d.ParentescoQuienBusca ?? null,
      d.DireccionQuienBusca ?? null,
      d.TelefonoQuienBusca ?? null,
      d.CorreoElectronicoQuienBusca ?? null,
      d.MensajeQuienBusca ?? null,
      d.InformacionUsadaPara ?? null,
      d.InformacionPublica ?? null,
      d.Institucion ?? null,
      d.Cargo ?? null,
      d.PersonaUltimaComunicacion ?? null,
      d.DeportadaAnteriormente ?? null,
      d.PaisDeportacion ?? null,
      d.FechaUltimaDeportacion ?? null,
      d.Encarcelado ?? null,
      d.UbicacionCarcel ?? null,
      d.FechaDetencion ?? null,
      d.IdentificacionDetencionEEUU ?? null,
      d.PapelesFalsos ?? null,
      d.PapelesFalsosCual ?? null,
      d.AcompañantesViaje ?? null,
      d.ConocidosEnExtranjero ?? null,
      d.Estatura ?? null,
      d.Peso ?? null,
      d.Complexion ?? null,
      d.ColorPiel ?? null,
      d.VelloFacial ?? null,
      d.VelloFacialCual ?? null,
      d.Lentes ?? null,
      d.Cabello ?? null,
      d.Embarazada ?? null,
      d.MesesEmbarazo ?? null,
      d.NumeroCelular ?? null,
      d.SeñalesParticulares ?? null,
      d.Lesiones ?? null,
      d.TipoDientes ?? null,
      d.EstadoSalud ?? null,
      d.DescripcionPrendas ?? null,
      d.RedesSociales ?? null,
      d.Situacion ?? '',
      d.idEntrevistador ?? null,
      req.params.id  
    ];

    const sql = `
      UPDATE PersonaEnMovilidad SET
        Nombre = ?,
        PrimerApellido = ?,
        SegundoApellido = ?,
        Estado = ?,
        Imagen = ?,
        MensajeFamiliares = ?,
        Necesidades = ?,
        DescripcionFisica = ?,
        TrabajadorHogar = ?,
        TrabajadorCampo = ?,
        SituacionCalle = ?,
        LocalidadOrigen = ?,
        PaisDestino = ?,
        EstadoDestino = ?,
        LocalidadDestino = ?,
        PuntoEntradaMex = ?,
        PuntoEntradaUSA = ?,
        Nacionalidad = ?,
        FechaNacimiento = ?,
        EstadoCivil = ?,
        ViajaConIdentificacion = ?,
        Identificacion = ?,
        UltimoDomicilio = ?,
        IdiomaMaterno = ?,
        HablaEspanol = ?,
        OtrosIdiomas = ?,
        OtrosIdiomasCual = ?,
        Profesion = ?,
        EdadMigracion = ?,
        AnoComienzoMigracion = ?,
        Motivo = ?,
        NumeroMigraciones = ?,
        RelatoDesaparicion = ?,
        PaisPerdidaContacto = ?,
        EstadoPerdidaContacto = ?,
        LocalidadPerdidaContacto = ?,
        FechaUltimaComunicacion = ?,
        ConfirmacionEntradaPunto = ?,
        Sexo = ?,
        Genero = ?,
        OtroSexoLibre = ?,
        HayDenuncia = ?,
        HayDenunciaCual = ?,
        HayReporte = ?,
        HayReporteCual = ?,
        AvancesDenuncia = ?,
        AvancesDenunciaCual = ?,
        LugaresBusqueda = ?,
        NombreQuienBusca = ?,
        ApellidoPaternoQuienBusca = ?,
        ApellidoMaternoQuienBusca = ?,
        ParentescoQuienBusca = ?,
        DireccionQuienBusca = ?,
        TelefonoQuienBusca = ?,
        CorreoElectronicoQuienBusca = ?,
        MensajeQuienBusca = ?,
        InformacionUsadaPara = ?,
        InformacionPublica = ?,
        Institucion = ?,
        Cargo = ?,
        PersonaUltimaComunicacion = ?,
        DeportadaAnteriormente = ?,
        PaisDeportacion = ?,
        FechaUltimaDeportacion = ?,
        Encarcelado = ?,
        UbicacionCarcel = ?,
        FechaDetencion = ?,
        IdentificacionDetencionEEUU = ?,
        PapelesFalsos = ?,
        PapelesFalsosCual = ?,
        AcompañantesViaje = ?,
        ConocidosEnExtranjero = ?,
        Estatura = ?,
        Peso = ?,
        Complexion = ?,
        ColorPiel = ?,
        VelloFacial = ?,
        VelloFacialCual = ?,
        Lentes = ?,
        Cabello = ?,
        Embarazada = ?,
        MesesEmbarazo = ?,
        NumeroCelular = ?,
        SeñalesParticulares = ?,
        Lesiones = ?,
        TipoDientes = ?,
        EstadoSalud = ?,
        DescripcionPrendas = ?,
        RedesSociales = ?, 
        Situacion = ?,
        idEntrevistador = ? 
      WHERE idPersona = ?`;

     // Obtener datos actuales ANTES de la actualización
    const [currentRows] = await db.query(
      'SELECT Situacion, Nombre, PrimerApellido FROM PersonaEnMovilidad WHERE idPersona = ?', 
      [req.params.id]
    );
    
    if (currentRows.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    
    const oldSituacion = currentRows[0].Situacion || '';
    const nombre = currentRows[0].Nombre;
    const apellido = currentRows[0].PrimerApellido;

    // Verificar parámetros (SOLO UNA VEZ)
    const paramCount = sql.split('?').length - 1;
    console.log(`Número de parámetros en SQL: ${paramCount}`);
    console.log(`Número de valores proporcionados: ${values.length}`);

    if (paramCount !== values.length) {
      throw new Error(`Desajuste en parámetros: SQL requiere ${paramCount} pero se proporcionaron ${values.length}`);
    }

    await db.query(sql, values);

    // Verificar cambio a "Desaparecida"
    const nuevaSituacion = req.body.Situacion || '';
    
    if (oldSituacion !== 'Desaparecida' && nuevaSituacion === 'Desaparecida') {
      await crearNotificacionParaCoordinadores(
        'Persona reportada como desaparecida',
        `${nombre} ${apellido} ha sido reportada como desaparecida`,
        NOTIFICACION_TIPOS.CAMBIO_DESAPARECIDA
      );
    }
    
    // Notificación genérica de actualización
    await crearNotificacionParaCoordinadores(
      'Registro actualizado',
      `Se ha actualizado la información de ${nombre} ${apellido}`,
      NOTIFICACION_TIPOS.ACTUALIZACION
    );
    
    res.status(200).json({ message: 'Persona actualizada con éxito' });
  
  } catch (error) {
    console.error('Error al actualizar persona:', {
      message: error.message,
      sql: error.sql,
      values: values // values ya está definido en el scope exterior
    });
    
    res.status(500).json({ 
      error: 'Error al actualizar la persona',
      details: error.message,
      sqlError: error.sqlMessage
    });
  }
});

// Obtener un grupo específico por ID
router.get('/grupo/:idGrupo', async (req, res) => {
  try {
    const { idGrupo } = req.params;
    
    // Obtener información básica del grupo
    const [grupoRows] = await db.query(
      'SELECT * FROM grupos WHERE idGrupo = ?',
      [idGrupo]
    );
    
    if (grupoRows.length === 0) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    
    const grupo = grupoRows[0];
    
    // Obtener integrantes del grupo
    const [integrantes] = await db.query(
      'SELECT idPersona, Nombre, PrimerApellido, Imagen FROM PersonaEnMovilidad WHERE idGrupo = ?',
      [idGrupo]
    );
    
    // Procesar imágenes de los integrantes
    grupo.integrantes = integrantes.map(p => ({
      ...p,
      Imagen: p.Imagen && Buffer.isBuffer(p.Imagen) 
        ? `data:image/jpeg;base64,${p.Imagen.toString('base64')}` 
        : null
    }));
    
    res.status(200).json(grupo);
  } catch (error) {
    console.error('Error al obtener grupo:', error);
    res.status(500).json({ error: error.message });
  }
});

//NATIONALITIES ENDPOINT
router.get('/naciones/listado', async (req, res) => {
  try {
    // Renombramos idNacionalidad a id para tu frontend
    const [rows] = await db.query(
      'SELECT idNacionalidad AS id, nacionalidad FROM naciones ORDER BY nacionalidad'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener naciones:', error);
    res.status(500).json({ error: 'Error al obtener la lista de países' });
  }

});


// GET /api/personas/entidades/listado?idNacionalidad=1
router.get('/entidades/listado', async (req, res) => {
  try {
    const { idNacionalidad } = req.query;
    const params = [];
    let sql = `
      SELECT entidad AS nombre 
      FROM entidades
      WHERE entidad IS NOT NULL
    `;

    if (idNacionalidad) {
      sql += ' AND idNacionalidad = ?';
      params.push(Number(idNacionalidad));
    }

    sql += ' ORDER BY entidad';

    const [rows] = await db.query(sql, params);
    res.json(rows); // [{ nombre: "Aguascalientes" }, ...]
  } catch (error) {
    console.error('Error al obtener estados:', error);
    res.status(500).json({ error: 'Error al obtener la lista de estados' });
  }
});

// routes/PersonaEnMovilidad.js
router.get('/municipios/listado', async (req, res) => {
  try {
    const { idNacionalidad, entidad } = req.query;
    const params = [];
    let sql = `
      SELECT municipio AS nombre 
      FROM municipios
      WHERE municipio IS NOT NULL
    `;

    if (idNacionalidad) {
      sql += ' AND idNacionalidad = ?';
      params.push(Number(idNacionalidad));
    }

    if (entidad) {
      // Obtener el ID de la entidad primero
      const [entidadRows] = await db.query(
        'SELECT idEntidad FROM entidades WHERE entidad = ?',
        [entidad]
      );
      
      if (entidadRows.length > 0) {
        sql += ' AND idEntidad = ?';
        params.push(entidadRows[0].idEntidad);
      } else {
        // Si no se encuentra la entidad, devolver array vacío
        return res.json([]);
      }
    }

    sql += ' ORDER BY municipio';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ error: 'Error al obtener la lista de municipios' });
  }
});


router.post('/encuentros', async (req, res) => {
  try {
     const { idPersona, idEntrevistador, idPunto, observaciones, fecha } = req.body;

    // Convertir fecha ISO a formato MySQL
    const fechaMySQL = fecha ? new Date(fecha).toISOString().slice(0, 19).replace('T', ' ') : null;
    
    // Validar campos
    if (!idPersona || !idEntrevistador || !idPunto || !observaciones || !fechaMySQL) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

     const [result] = await db.query(
      'INSERT INTO Encuentros (IdPersona, IdEntrevistador, IdPunto, Observaciones, Fecha) VALUES (?, ?, ?, ?, ?)',
      [idPersona, idEntrevistador, idPunto, observaciones, fechaMySQL]
    );
    
    // Obtener nombre de la persona para la notificación
    const [persona] = await db.query(
      'SELECT Nombre, PrimerApellido FROM PersonaEnMovilidad WHERE idPersona = ?',
      [idPersona]
    );
    const nombrePersona = persona.length > 0 
      ? `${persona[0].Nombre} ${persona[0].PrimerApellido}` 
      : `ID ${idPersona}`;
    
    // Crear notificación para todos los coordinadores
    await crearNotificacionParaCoordinadores(
      'Nuevo encuentro registrado',
      `Se ha registrado un nuevo encuentro para ${nombrePersona}`,
      NOTIFICACION_TIPOS.ENCUENTRO
    );
    
    res.status(201).json({
      message: 'Encuentro registrado con éxito',
      idEncuentro: result.insertId,
    });
  }catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al registrar encuentro',
      details: error.message
    });
  }
});

router.get('/:id/encuentros', async (req, res) => {
  try {
    const { id } = req.params;
    // Cambiar esta consulta
    const [rows] = await db.query(
      `SELECT 
        e.*, 
        p.latitud, 
        p.longitud,
        p.descripcion AS lugar
      FROM Encuentros e
      JOIN PuntoGeografico p ON e.IdPunto = p.idPunto
      WHERE e.IdPersona = ? 
      ORDER BY e.Fecha DESC`,
      [id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener encuentros:', error);
    res.status(500).json({ error: 'Error al obtener encuentros' });
  }
});


router.post('/puntos', async (req, res) => {
  try {
    const { latitud, longitud, descripcion } = req.body;

    if (!latitud) {
      return res.status(400).json({ error: 'Latitud es obligatoria' });
    }

    // Validate coordinate format
    if (isNaN(Number(latitud))) {
      return res.status(400).json({ error: 'Latitud debe ser un número válido' });
    }

    // Validate description length if provided
    if (descripcion && descripcion.length > 500) {
      return res.status(400).json({ error: 'Descripción demasiado larga (máx 500 caracteres)' });
    }

    const [result] = await db.query(
      'INSERT INTO PuntoGeografico (latitud, longitud, descripcion) VALUES (?, ?, ?)',
      [latitud, longitud || null, descripcion || null]
    );

    res.status(201).json({ 
      message: 'Punto geográfico registrado con éxito',
      idPunto: result.insertId 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error al registrar punto geográfico',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

router.post('/grupos', async (req, res) => { // ← Nueva ruta para grupos
  try {
    const { NombreGrupo, NombreEncargado, LugarCreacion } = req.body;

    if (!NombreGrupo) {
      return res.status(400).json({ error: 'El nombre del grupo es obligatorio' });
    }

    const [result] = await db.query(
      'INSERT INTO grupos (NombreGrupo, FechaCreacion, NombreEncargado, LugarCreacion) VALUES (?, NOW(), ?, ?)',
      [NombreGrupo, NombreEncargado || null, LugarCreacion || null]
    );

    res.status(201).json({
      idGrupo: result.insertId,
      message: 'Grupo creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear grupo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM grupos ORDER BY FechaCreacion DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({ error: 'Error al obtener grupos' });
  }
});




router.get('/entrevistadores/:id', async (req, res) => {
  try {
    const idEntrevistador = parseInt(req.params.id);
    if (isNaN(idEntrevistador)) {
      return res.status(400).json({ error: 'ID de entrevistador no válido' });
    }

    const [rows] = await db.query(
      `SELECT 
        idEntrevistador, 
        email, 
        password,
        nombre, 
        telefono, 
        organizacion, 
        DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') as fecha_nacimiento 
       FROM Entrevistadores 
       WHERE idEntrevistador = ?`,
      [idEntrevistador]
    );
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        error: 'Entrevistador no encontrado'
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener entrevistador:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// Agregar nuevo endpoint para obtener grupos de personas
router.get('/grupos', async (req, res) => {
  try {
    const { nombre = '', apellido = '', situacion = '' } = req.query;
    
    const [rows] = await db.query(`
      SELECT 
        Nombre, 
        PrimerApellido,
        COUNT(*) as total,
        GROUP_CONCAT(idPersona) as ids,
        MAX(Imagen) as Imagen,
        MAX(Nacionalidad) as Nacionalidad,
        MAX(PaisDestino) as PaisDestino,
        MAX(Situacion) as Situacion,
        MAX(FechaUltimaComunicacion) as FechaUltimaComunicacion
      FROM PersonaEnMovilidad
      WHERE Nombre LIKE ? 
        AND PrimerApellido LIKE ?
        AND Situacion LIKE ?
      GROUP BY Nombre, PrimerApellido
      ORDER BY Nombre, PrimerApellido
    `, [
      `%${nombre}%`,
      `%${apellido}%`,
      `%${situacion}%`
    ]);

    // Formatear los IDs como array
    const grupos = rows.map(grupo => ({
      ...grupo,
      ids: grupo.ids.split(',').map(id => parseInt(id))
    }));

    res.status(200).json(grupos);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Modificar el endpoint de encuentros para aceptar múltiples IDs
router.get('/encuentros/multi', async (req, res) => {
  try {
    const ids = req.query.ids.split(',').map(id => parseInt(id));
    
    const [rows] = await db.query(`
      SELECT 
        e.*,
        p.latitud,
        p.longitud,
        p.descripcion AS lugar
      FROM Encuentros e
      JOIN PuntoGeografico p ON e.IdPunto = p.idPunto
      WHERE e.IdPersona IN (?)
      ORDER BY e.Fecha DESC
    `, [ids]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener encuentros múltiples:', error);
    res.status(500).json({ error: 'Error al obtener encuentros' });
  }
});

router.put('/entrevistadores/:id', async (req, res) => {
  try {
    const idEntrevistador = parseInt(req.params.id);
    if (isNaN(idEntrevistador)) {
      return res.status(400).json({ error: 'ID no válido' });
    }

    
    const { nombre, telefono, organizacion, fecha_nacimiento } = req.body;

    const [result] = await db.query(
      `UPDATE Entrevistadores 
       SET 
         nombre = ?,
         telefono = ?,
         organizacion = ?,
         fecha_nacimiento = ?
       WHERE idEntrevistador = ?`,
      [
        nombre || null,
        telefono || null,
        organizacion || null,
        fecha_nacimiento || null,
        idEntrevistador
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Entrevistador no encontrado' });
    }

    // Devuelve los datos actualizados
    const [updatedRows] = await db.query(
      `SELECT 
        idEntrevistador, 
        email, 
        nombre, 
        telefono, 
        organizacion, 
        DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') as fecha_nacimiento 
       FROM Entrevistadores 
       WHERE idEntrevistador = ?`,
      [idEntrevistador]
    );

    res.json(updatedRows[0]);
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el perfil',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});





module.exports = router;