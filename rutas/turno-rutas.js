/**
 * @file turno-rutas.js
 * @description Define las rutas HTTP para las operaciones relacionadas con turnos.
 */

const express = require("express");
const router = express.Router();
const turnoController = require("../controladores/turno-controlador");
const { verificarRolAPI } = require("../middlewares/seguridad-middleware");

// Rutas públicas para el ciudadano (acceso mediante token UUID enviado al correo)
router.get("/detalle/:token", turnoController.obtenerTurnoPorToken);
router.put("/cancelar/:token", turnoController.cancelarTurnoPorToken);

// Rutas protegidas por rol
router.post("/", verificarRolAPI("operador", "admin"), turnoController.crearTurno);
router.get("/", verificarRolAPI("operador", "asesor", "admin"), turnoController.obtenerTurnos);
router.get("/en-espera", verificarRolAPI("asesor", "admin"), turnoController.obtenerTurnosEnEspera);
router.put("/atender/:id", verificarRolAPI("asesor", "admin"), turnoController.atenderTurno);
router.delete("/:id", verificarRolAPI("asesor", "admin"), turnoController.eliminarTurno);

module.exports = router;