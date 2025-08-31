 
const db = require('../db');
const bcrypt = require('bcrypt');

async function hashPasswords() {
  try {
    console.log('Iniciando proceso de hashing de contraseñas...');

    // Obtener todos los usuarios
    const [users] = await db.query(
      'SELECT idEntrevistador, password FROM Entrevistadores'
    );

    console.log(`Encontrados ${users.length} usuarios`);

    for (const user of users) {
      // Saltar si la contraseña ya está hasheada
      if (user.password.startsWith('$2b$')) {
        console.log(`Usuario ${user.idEntrevistador}: contraseña ya hasheada`);
        continue;
      }

      // Hashear la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // Actualizar en la base de datos
      await db.query(
        'UPDATE Entrevistadores SET password = ? WHERE idEntrevistador = ?',
        [hashedPassword, user.idEntrevistador]
      );

      console.log(`Usuario ${user.idEntrevistador}: contraseña hasheada correctamente`);
    }

    console.log('Proceso completado!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

hashPasswords();
