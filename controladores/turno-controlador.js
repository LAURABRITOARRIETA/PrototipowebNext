/**
 * @file turno-controlador.js
 * @description Controlador que maneja las operaciones CRUD y consultas de los turnos.
 */

const db = require("../base-de-datos/conexion");

// Crear un nuevo turno
exports.crearTurno = async (req, res) => {
  const { nombre, cedula, tramite } = req.body;

  try {
    await db.query(
      `INSERT INTO turnos (nombre, cedula, tramite) VALUES ($1, $2, $3)`,
      [nombre, cedula, tramite],
    );

    // Redirige a la vista HTML de visualización
    res.redirect("/visualizar-turno.html");
  } catch (error) {
    console.error("Error al registrar el turno:", error);
    res.status(500).send("Error al registrar el turno.");
  }
};

// Consultar todos los turnos registrados
exports.obtenerTurnos = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT * FROM turnos ORDER BY id;
    `);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar los turnos:", error);
    res.status(500).send("Error al consultar los turnos.");
  }
};

// Consultar únicamente los turnos que se encuentran en espera
exports.obtenerTurnosEnEspera = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT * FROM turnos WHERE estado = 'EN_ESPERA' ORDER BY id;
    `);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar turnos en espera:", error);
    res.status(500).send("Error al consultar los turnos.");
  }
};

// Cambiar el estado de un turno a 'ATENDIDO'
exports.atenderTurno = async (req, res) => {
  const id = req.params.id;

  try {
    await db.query(`UPDATE turnos SET estado = 'ATENDIDO' WHERE id = $1`, [id]);
    res.send("Turno atendido correctamente.");
  } catch (error) {
    console.error("Error al actualizar el turno:", error);
    res.status(500).send("Error al actualizar el turno.");
  }
};

// Eliminar un turno del sistema por su ID
exports.eliminarTurno = async (req, res) => {
  const id = req.params.id;

  try {
    await db.query(`DELETE FROM turnos WHERE id = $1`, [id]);
    res.send("Turno eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar el turno:", error);
    res.status(500).send("Error al eliminar el turno.");
  }
};
