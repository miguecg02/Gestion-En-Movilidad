const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const [rows] = await db.query(
      "SELECT idEntrevistador, password, nombre, rol FROM Entrevistadores WHERE email = ?",
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar si la contraseña está hasheada o en texto plano
    let passwordMatch;
    
    if (user.password.startsWith('$2b$')) {
      // Contraseña hasheada - usar bcrypt.compare
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Contraseña en texto plano - comparación directa (transición)
      passwordMatch = password === user.password;
      
      // Si coincide y está en texto plano, hashearla para futuros logins
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
          'UPDATE Entrevistadores SET password = ? WHERE idEntrevistador = ?',
          [hashedPassword, user.idEntrevistador]
        );
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { 
        userId: user.idEntrevistador,
        email: email,
        rol: user.rol
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      token: token,
      userId: user.idEntrevistador,
      nombre: user.nombre,
      rol: user.rol,
      expiresIn: JWT_EXPIRES_IN
    });

  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;