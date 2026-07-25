const db = require("../base_datos");

// Crear turno
exports.crearTurno = async (req, res) => {
  const { nombre, cedula, tramite } = req.body;

  try {
    await db.query(
      `INSERT INTO turnos(nombre, cedula, tramite)
             VALUES($1,$2,$3)`,
      [nombre, cedula, tramite],
    );

    // Redirige a la página HTML
    res.redirect("/visualizar-turno.html");
  } catch (error) {
    console.log(error);

    res.status(500).send("Error al registrar el turno.");
  }
};

// Consultar todos los turnos
exports.obtenerTurnos = async (req, res) => {
  try {
    const resultado = await db.query(`
            SELECT *
            FROM turnos
            ORDER BY id;
        `);

    res.json(resultado.rows);
  } catch (error) {
    console.log(error);

    res.status(500).send("Error al consultar los turnos.");
  }
};

// Consultar turnos en espera
exports.obtenerTurnosEnEspera = async (req, res) => {
  try {
    const resultado = await db.query(`
            SELECT *
            FROM turnos
            WHERE estado = 'EN_ESPERA'
            ORDER BY id;
        `);

    res.json(resultado.rows);
  } catch (error) {
    console.log(error);

    res.status(500).send("Error al consultar los turnos.");
  }
};

// Atender turno
exports.atenderTurno = async (req, res) => {
  const id = req.params.id;

  try {
    await db.query(
      `UPDATE turnos
             SET estado = 'ATENDIDO'
             WHERE id = $1`,
      [id],
    );

    res.send("Turno atendido correctamente.");
  } catch (error) {
    console.log(error);

    res.status(500).send("Error al actualizar el turno.");
  }
};

// Eliminar turno
exports.eliminarTurno = async (req, res) => {
  const id = req.params.id;

  try {
    await db.query(
      `DELETE FROM turnos
             WHERE id = $1`,
      [id],
    );

    res.send("Turno eliminado correctamente.");
  } catch (error) {
    console.log(error);

    res.status(500).send("Error al eliminar el turno.");
  }
};
