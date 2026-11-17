/**
 * @file servidor.js
 * @description Archivo principal de entrada de la aplicación Node.js y Express.
 */

const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

const turnoRutas = require("./rutas/turno-rutas");
const usuarioRutas = require("./rutas/usuario-rutas");

// Middlewares para interpretar datos JSON y formularios enviados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones (se activarán los bloqueos de ruta en la Fase 6)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave_secreta_next_2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Cambiar a true solo si se usa HTTPS estricto sin proxy
      maxAge: 1000 * 60 * 60 * 4, // 4 horas de sesión
    },
  })
);

// Servir archivos estáticos del frontend desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ruta raíz: redirige directamente al inicio de sesión
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Configuración de rutas principales de la API
app.use("/turnos", turnoRutas);
app.use("/usuarios", usuarioRutas);

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
  console.log(`Servidor iniciado y ejecutándose en http://localhost:${PUERTO}`);
});