const db = require("../base_datos");
const bcrypt = require("bcrypt");

// REGISTRAR USUARIO
exports.registrarUsuario = async (req, res) => {

    const {
        apellido,
        nombre,
        cedula,
        fecha_nacimiento,
        usuario,
        password
    } = req.body;

    try {

        // Verificar si el usuario ya existe
        const usuarioExiste = await db.query(
            `SELECT * FROM usuarios WHERE usuario = $1`,
            [usuario]
        );

        if (usuarioExiste.rows.length > 0) {
            return res.status(400).json({
                mensaje: "El usuario ya existe"
            });
        }

        // Verificar si la cédula ya está registrada
        const cedulaExiste = await db.query(
            `SELECT * FROM usuarios WHERE cedula = $1`,
            [cedula]
        );

        if (cedulaExiste.rows.length > 0) {
            return res.status(400).json({
                mensaje: "La cédula ya está registrada"
            });
        }

        // Encriptar contraseña
        const passwordEncriptada = await bcrypt.hash(password, 10);

        // Guardar usuario
        await db.query(
            `INSERT INTO usuarios
            (apellido, nombre, cedula, fecha_nacimiento, usuario, password, rol)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                apellido,
                nombre,
                cedula,
                fecha_nacimiento,
                usuario,
                passwordEncriptada,
                "usuario"
            ]
        );

        res.status(201).json({
            mensaje: "Usuario registrado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al registrar el usuario"
        });
    }
};


// INICIAR SESIÓN
exports.login = async (req, res) => {

    const { usuario, password } = req.body;

    try {

        const resultado = await db.query(
            `SELECT * FROM usuarios WHERE usuario = $1`,
            [usuario]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

        const usuarioEncontrado = resultado.rows[0];

        // Comparar contraseña
        const contraseñaCorrecta = await bcrypt.compare(
            password,
            usuarioEncontrado.password
        );

        if (!contraseñaCorrecta) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

        res.json({
            mensaje: "Inicio de sesión correcto",
            usuario: usuarioEncontrado.usuario,
            nombre: usuarioEncontrado.nombre,
            apellido: usuarioEncontrado.apellido,
            rol: usuarioEncontrado.rol
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });
    }
};