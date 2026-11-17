/**
 * @file turno-modelo.js
 * @description Consultas SQL para la gestión de turnos en PostgreSQL.
 */

const db = require("../base-de-datos/conexion");

async function crearTurno({ nombre, cedula, correo, tramite, token_acceso }) {
  const res = await db.query(
    `INSERT INTO turnos (nombre, cedula, correo, tramite, estado, token_acceso)
     VALUES ($1, $2, $3, $4, 'EN_ESPERA', $5)
     RETURNING id, nombre, cedula, correo, tramite, estado, token_acceso`,
    [nombre, cedula, correo, tramite, token_acceso]
  );
  return res.rows[0];
}

async function buscarPorToken(token) {
  const res = await db.query(
    `SELECT id, nombre, cedula, correo, tramite, estado, token_acceso
     FROM turnos
     WHERE token_acceso = $1`,
    [token]
  );
  return res.rows[0];
}

async function contarPersonasDelante(idTurno) {
  const res = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM turnos
     WHERE estado = 'EN_ESPERA' AND id < $1`,
    [idTurno]
  );
  return res.rows[0].total;
}

async function listarTodos() {
  const res = await db.query("SELECT * FROM turnos ORDER BY id ASC");
  return res.rows;
}

async function listarEnEspera() {
  const res = await db.query(
    "SELECT * FROM turnos WHERE estado = 'EN_ESPERA' ORDER BY id ASC"
  );
  return res.rows;
}

async function marcarAtendido(id) {
  const res = await db.query(
    `UPDATE turnos SET estado = 'ATENDIDO' WHERE id = $1 RETURNING *`,
    [id]
  );
  return res.rows[0];
}

async function cancelarPorToken(token) {
  const res = await db.query(
    `UPDATE turnos
     SET estado = 'CANCELADO'
     WHERE token_acceso = $1 AND estado = 'EN_ESPERA'
     RETURNING *`,
    [token]
  );
  return res.rows[0];
}

async function eliminarPorId(id) {
  const res = await db.query("DELETE FROM turnos WHERE id = $1 RETURNING id", [id]);
  return res.rows[0];
}

module.exports = {
  crearTurno,
  buscarPorToken,
  contarPersonasDelante,
  listarTodos,
  listarEnEspera,
  marcarAtendido,
  cancelarPorToken,
  eliminarPorId,
};