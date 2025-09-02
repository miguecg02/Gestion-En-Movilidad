
const express = require('express');
const router = express.Router();
const db = require('../db');

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_development';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    req.userId = decoded.userId;
    req.userRole = decoded.rol;
    next();
  });
};

router.use(verifyToken);


router.get('/', async (req, res) => {
  try {
    // Usar la información del usuario ya verificada por el middleware
    const userId = req.userId;
    const userRole = req.userRole;

    // Solo coordinadores pueden ver notificaciones
    if (userRole !== 'Coordinador') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // Obtener notificaciones
    const [notificaciones] = await db.query(
  `SELECT
    idNotificacion,
    titulo,
    mensaje,
    leida,
    tipo,
    DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_creacion
  FROM Notificaciones
  WHERE idEntrevistador = ?
  ORDER BY fecha_creacion DESC
  LIMIT 50`,
  [userId]
);

    res.json(notificaciones);
  } catch (error) {
    console.error('Error en endpoint /notificaciones:', error);
    res.status(500).json({
      error: 'Error al obtener notificaciones',
      details: error.message
    });
  }
});


// Endpoint para marcar notificación como leída
router.patch('/:id/leida', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'UPDATE Notificaciones SET leida = 1 WHERE idNotificacion = ?',
      [id]
    );

    res.json({
      message: `${result.affectedRows} notificación(es) marcada(s) como leída(s)`
    });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ error: 'Error al actualizar la notificación' });
  }
});
// Función para crear notificaciones para coordinadores
const crearNotificacionParaCoordinadores = async (titulo, mensaje, tipo = NOTIFICACION_TIPOS.SISTEMA) => {
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

module.exports = router;
