/**
 * @file conexion.js
 * @description Establece el pool de conexiones con PostgreSQL usando variables de entorno.
 */

const { Pool } = require("pg");

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
      }
);

pool
  .connect()
  .then((client) => {
    console.log("Conectado a PostgreSQL exitosamente.");
    client.release();
  })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error);
  });

module.exports = pool;