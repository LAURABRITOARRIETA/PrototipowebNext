const express = require("express");

const app = express();

const turnoRutas = require("./rutas/turno-rutas");
const usuarioRutas = require("./rutas/usuario-rutas");

// Leer datos JSON
app.use(express.json());

// Leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static("public"));

// Rutas
app.use("/turnos", turnoRutas);
app.use("/usuarios", usuarioRutas);

const PUERTO = 3000;

app.listen(PUERTO, () => {

    console.log(`Servidor iniciado en http://localhost:${PUERTO}`);

});