const express = require("express");

const router = express.Router();

const usuarioController = require("../controladores/usuario-controlador");

// Registrar usuario
router.post("/registro", usuarioController.registrarUsuario);

// Iniciar sesión
router.post("/login", usuarioController.login);

module.exports = router;