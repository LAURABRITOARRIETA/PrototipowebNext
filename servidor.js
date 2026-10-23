/**
 * @file server.js
 * @description Archivo principal de entrada de la aplicación Node.js y Express.
 */

const express = require("express");
const app = express();

const turnoRutas = require("./rutas/turno-rutas");
const usuarioRutas = require("./rutas/usuario-rutas");

// Middleware para interpretar datos JSON y formularios enviados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend desde la carpeta public
app.use(express.static("public"));

// Configuración de rutas principales de la API
app.use("/turnos", turnoRutas);
app.use("/usuarios", usuarioRutas);

const PUERTO = 3000;

app.listen(PUERTO, () => {
  console.log(`Servidor iniciado y ejecutándose en http://localhost:${PUERTO}`);
});
