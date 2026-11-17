/**
 * @file turno-rutas.js
 * @description Define las rutas HTTP para las operaciones relacionadas con turnos.
 */

const express = require("express");
const router = express.Router();
const turnoController = require("../controladores/turno-controlador");

// Rutas públicas para el cliente (acceso mediante token UUID enviado al correo)
router.get("/detalle/:token", turnoController.obtenerTurnoPorToken);
router.put("/cancelar/:token", turnoController.cancelarTurnoPorToken);

// Rutas operativas (Operador y Asesor)
router.post("/", turnoController.crearTurno);
router.get("/", turnoController.obtenerTurnos);
router.get("/en-espera", turnoController.obtenerTurnosEnEspera);
router.put("/atender/:id", turnoController.atenderTurno);
router.delete("/:id", turnoController.eliminarTurno);

module.exports = router;