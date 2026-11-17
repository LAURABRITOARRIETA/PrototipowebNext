/**
 * @file turno-servicio.js
 * @description Lógica de negocio para creación, consulta por token, cancelación y atención de turnos.
 */

const crypto = require("crypto");
const turnoModelo = require("../modelos/turno-modelo");
const correoServicio = require("./correo-servicio");

async function generarNuevoTurno({ nombre, cedula, correo, tramite, urlBase }) {
  const tokenAcceso = crypto.randomUUID();

  const turnoCreado = await turnoModelo.crearTurno({
    nombre,
    cedula,
    correo,
    tramite,
    token_acceso: tokenAcceso,
  });

  const codigoTurno = "A" + String(turnoCreado.id).padStart(3, "0");
  const enlaceUnico = `${urlBase}/visualizar-turno.html?token=${tokenAcceso}`;

  // Mostrar enlace en consola para pruebas rápidas mientras no haya SMTP real
  console.log(`Turno ${codigoTurno} creado. Enlace para el cliente: ${enlaceUnico}`);

  if (correo) {
    await correoServicio.enviarCorreoTurno(
      correo,
      nombre,
      codigoTurno,
      tramite,
      enlaceUnico
    );
  }

  return {
    ...turnoCreado,
    codigo: codigoTurno,
    enlace: enlaceUnico,
  };
}

async function consultarTurnoPorToken(token) {
  const turno = await turnoModelo.buscarPorToken(token);

  if (!turno) {
    const error = new Error("El enlace del turno no es válido o el turno no existe.");
    error.statusCode = 404;
    throw error;
  }

  const personasDelante =
    turno.estado === "EN_ESPERA"
      ? await turnoModelo.contarPersonasDelante(turno.id)
      : 0;

  return {
    ...turno,
    codigo: "A" + String(turno.id).padStart(3, "0"),
    personasDelante,
  };
}

async function cancelarTurnoPorToken(token) {
  const turnoActual = await turnoModelo.buscarPorToken(token);

  if (!turnoActual) {
    const error = new Error("Turno no encontrado.");
    error.statusCode = 404;
    throw error;
  }

  if (turnoActual.estado !== "EN_ESPERA") {
    const error = new Error(`No se puede cancelar el turno porque su estado es: ${turnoActual.estado}.`);
    error.statusCode = 400;
    throw error;
  }

  return await turnoModelo.cancelarPorToken(token);
}

async function obtenerTodosLosTurnos() {
  return await turnoModelo.listarTodos();
}

async function obtenerTurnosEnEspera() {
  return await turnoModelo.listarEnEspera();
}

async function atenderTurno(id) {
  const actualizado = await turnoModelo.marcarAtendido(id);
  if (!actualizado) {
    const error = new Error("Turno no encontrado.");
    error.statusCode = 404;
    throw error;
  }
  return actualizado;
}

async function eliminarTurno(id) {
  const eliminado = await turnoModelo.eliminarPorId(id);
  if (!eliminado) {
    const error = new Error("Turno no encontrado.");
    error.statusCode = 404;
    throw error;
  }
  return eliminado;
}

module.exports = {
  generarNuevoTurno,
  consultarTurnoPorToken,
  cancelarTurnoPorToken,
  obtenerTodosLosTurnos,
  obtenerTurnosEnEspera,
  atenderTurno,
  eliminarTurno,
};