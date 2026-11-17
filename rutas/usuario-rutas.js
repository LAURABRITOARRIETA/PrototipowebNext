/**
 * @file usuario-rutas.js
 * @description Define las rutas HTTP para autenticación, registro y administración de usuarios.
 */

const express = require("express");
const router = express.Router();
const usuarioController = require("../controladores/usuario-controlador");

router.post("/registro", usuarioController.registrarUsuario);
router.post("/login", usuarioController.login);
router.post("/logout", usuarioController.logout);

// Rutas para el panel del administrador
router.get("/", usuarioController.listarUsuarios);
router.put("/:id/aprobar", usuarioController.aprobarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);

module.exports = router;