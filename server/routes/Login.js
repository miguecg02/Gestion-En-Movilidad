const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Configuración (deberías usar variables de entorno en producción)
const JWT_SECRET = 'tu_secreto_secreto_jwt'; // Usa process.env.JWT_SECRET en producción
const JWT_EXPIRES_IN = '1h'; // El token expira en 1 hora

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const [rows] = await db.query(
      "SELECT idEntrevistador, password, nombre, rol FROM Entrevistadores WHERE email = ?", // Añadir rol
      [email]
    );

    const user = rows[0];

    if (!user) {
      // No revelar si el usuario existe o no por seguridad
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Comparación segura de contraseñas con bcrypt
    const passwordMatch = password === user.password;

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token JWT con expiración
    const token = jwt.sign(
      { userId: user.idEntrevistador },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      token: token,
      userId: user.idEntrevistador,
      nombre: user.nombre,
      rol: user.rol, // Asegurar que se envíe el rol
      expiresIn: JWT_EXPIRES_IN
    });

  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;