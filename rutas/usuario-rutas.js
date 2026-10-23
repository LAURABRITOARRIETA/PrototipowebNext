/**
 * @file usuario-rutas.js
 * @description Define las rutas HTTP para autenticación y registro de usuarios.
 */

const express = require("express");
const router = express.Router();
const usuarioController = require("../controladores/usuario-controlador");

router.post("/registro", usuarioController.registrarUsuario);
router.post("/login", usuarioController.login);

module.exports = router;
