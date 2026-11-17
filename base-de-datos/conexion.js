/**
 * @file conexion.js
 * @description Establece el pool de conexiones con PostgreSQL.
 */

const { Pool } = require("pg");

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: "127.0.0.1",
        user: "postgres",
        password: "aqua1234",
        database: "next",
        port: 5432,
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