const { Client } = require("pg");

const client = new Client({
    host: "127.0.0.1",
    user: "postgres",
    password: "aqua1234",
    database: "next",
    port: 5432
});

async function conectar() {
    try {
        await client.connect();
        console.log("Conectado a PostgreSQL");
    } catch (error) {
        console.error("Error al conectar:");
        console.error(error);
    }
}

conectar();

module.exports = client;