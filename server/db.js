// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',    // forzamos TCP
  port: 3306,           // puerto por defecto de MySQL
  user: 'myUserBD',
  password: '2002',
  database: 'GestionEnMovilidad_BD',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(conn => {
    console.log('MySQL: conexión establecida vía TCP.');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL: no pudo conectar vía TCP:', err);
  });

module.exports = {
  query: (sql, params) => pool.execute(sql, params),
};
