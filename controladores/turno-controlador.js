/**
 * @file turno-controlador.js
 * @description Controlador HTTP para la gestión de turnos.
 */

const turnoServicio = require("../servicios/turno-servicio");

exports.crearTurno = async (req, res) => {
  const { nombre, cedula, correo, tramite } = req.body;

  if (!nombre || !cedula || !correo || !tramite) {
    return res.status(400).json({
      mensaje: "Todos los campos (nombre, cédula, correo y trámite) son obligatorios.",
    });
  }

  try {
    // Construye dinámicamente http://localhost:3000 o https://tu-app.onrender.com
    const urlBase = `${req.protocol}://${req.get("host")}`;

    const turno = await turnoServicio.generarNuevoTurno({
      nombre: nombre.trim(),
      cedula: cedula.trim(),
      correo: correo.trim().toLowerCase(),
      tramite: tramite.trim(),
      urlBase,
    });

    res.status(201).json({
      mensaje: `Turno ${turno.codigo} creado y enviado al correo ${turno.correo}.`,
      turno,
    });
  } catch (error) {
    console.error("Error al registrar el turno:", error);
    res.status(500).json({ mensaje: "Error al registrar el turno." });
  }
};

exports.obtenerTurnoPorToken = async (req, res) => {
  const { token } = req.params;

  try {
    const turno = await turnoServicio.consultarTurnoPorToken(token);
    res.json(turno);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      mensaje: error.message || "Error al consultar el turno.",
    });
  }
};

exports.cancelarTurnoPorToken = async (req, res) => {
  const { token } = req.params;

  try {
    await turnoServicio.cancelarTurnoPorToken(token);
    res.json({ mensaje: "Tu turno ha sido cancelado correctamente." });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      mensaje: error.message || "Error al cancelar el turno.",
    });
  }
};

exports.obtenerTurnos = async (req, res) => {
  try {
    const turnos = await turnoServicio.obtenerTodosLosTurnos();
    res.json(turnos);
  } catch (error) {
    console.error("Error al consultar los turnos:", error);
    res.status(500).json({ mensaje: "Error al consultar los turnos." });
  }
};

exports.obtenerTurnosEnEspera = async (req, res) => {
  try {
    const turnos = await turnoServicio.obtenerTurnosEnEspera();
    res.json(turnos);
  } catch (error) {
    console.error("Error al consultar turnos en espera:", error);
    res.status(500).json({ mensaje: "Error al consultar los turnos." });
  }
};

exports.atenderTurno = async (req, res) => {
  const { id } = req.params;

  try {
    await turnoServicio.atenderTurno(id);
    res.json({ mensaje: "Turno atendido correctamente." });
  } catch (error) {
    console.error("Error al actualizar el turno:", error);
    res.status(error.statusCode || 500).json({
      mensaje: error.message || "Error al actualizar el turno.",
    });
  }
};

exports.eliminarTurno = async (req, res) => {
  const { id } = req.params;

  try {
    await turnoServicio.eliminarTurno(id);
    res.json({ mensaje: "Turno eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar el turno:", error);
    res.status(error.statusCode || 500).json({
      mensaje: error.message || "Error al eliminar el turno.",
    });
  }
};