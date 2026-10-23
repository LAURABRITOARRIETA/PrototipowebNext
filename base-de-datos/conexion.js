/**
 * @file conexion.js
 * @description Establece la conexión con la base de datos PostgreSQL usando el cliente nativo.
 */

const { Client } = require("pg");

const client = new Client({
  host: "127.0.0.1",
  user: "postgres",
  password: "aqua1234",
  database: "next",
  port: 5432,
});

async function conectar() {
  try {
    await client.connect();
    console.log("Conectado a PostgreSQL exitosamente.");
  } catch (error) {
    console.error("Error al conectar con la base de datos:");
    console.error(error);
  }
}

conectar();

module.exports = client;
