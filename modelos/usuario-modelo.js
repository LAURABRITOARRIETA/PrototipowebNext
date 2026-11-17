/**
 * @file usuario-modelo.js
 * @description Consultas SQL para la gestión de usuarios en PostgreSQL.
 */

const db = require("../base-de-datos/conexion");

async function buscarPorUsuario(usuario) {
  const res = await db.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario]);
  return res.rows[0];
}

async function buscarPorCedulaOCorreo(cedula, correo) {
  const res = await db.query(
    "SELECT id, cedula, correo FROM usuarios WHERE cedula = $1 OR correo = $2",
    [cedula, correo]
  );
  return res.rows[0];
}

async function crearUsuario({ apellido, nombre, cedula, correo, fecha_nacimiento, usuario, password, rol }) {
  const res = await db.query(
    `INSERT INTO usuarios (apellido, nombre, cedula, correo, fecha_nacimiento, usuario, password, rol, estado_cuenta)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDIENTE')
     RETURNING id, apellido, nombre, cedula, correo, usuario, rol, estado_cuenta`,
    [apellido, nombre, cedula, correo, fecha_nacimiento, usuario, password, rol]
  );
  return res.rows[0];
}

async function listarTodos() {
  const res = await db.query(
    `SELECT id, apellido, nombre, cedula, correo, usuario, rol, estado_cuenta
     FROM usuarios
     ORDER BY CASE WHEN estado_cuenta = 'PENDIENTE' THEN 0 ELSE 1 END, id ASC`
  );
  return res.rows;
}

async function aprobarYAsignarRol(id, rol) {
  const res = await db.query(
    `UPDATE usuarios
     SET estado_cuenta = 'APROBADO', rol = $1
     WHERE id = $2
     RETURNING id, nombre, apellido, correo, usuario, rol, estado_cuenta`,
    [rol, id]
  );
  return res.rows[0];
}

async function eliminarPorId(id) {
  const res = await db.query("DELETE FROM usuarios WHERE id = $1 RETURNING id", [id]);
  return res.rows[0];
}

module.exports = {
  buscarPorUsuario,
  buscarPorCedulaOCorreo,
  crearUsuario,
  listarTodos,
  aprobarYAsignarRol,
  eliminarPorId,
};