/**
 * @file usuario-rutas.js
 * @description Define las rutas HTTP para autenticación, registro y administración de usuarios.
 */

const express = require("express");
const router = express.Router();
const usuarioController = require("../controladores/usuario-controlador");
const { verificarRolAPI } = require("../middlewares/seguridad-middleware");

// Rutas públicas
router.post("/registro", usuarioController.registrarUsuario);
router.post("/login", usuarioController.login);
router.post("/logout", usuarioController.logout);

// Rutas protegidas (solo Administrador)
router.get("/", verificarRolAPI("admin"), usuarioController.listarUsuarios);
router.put("/:id/aprobar", verificarRolAPI("admin"), usuarioController.aprobarUsuario);
router.delete("/:id", verificarRolAPI("admin"), usuarioController.eliminarUsuario);

module.exports = router;