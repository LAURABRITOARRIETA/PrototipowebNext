const express = require("express");
const router = express.Router();

const turnoController = require("../controladores/turno-controlador");

router.post("/", turnoController.crearTurno);

router.get("/", turnoController.obtenerTurnos);

router.get("/en-espera", turnoController.obtenerTurnosEnEspera);

router.get("/atender/:id", turnoController.atenderTurno);

router.get("/eliminar/:id", turnoController.eliminarTurno);

module.exports = router;
