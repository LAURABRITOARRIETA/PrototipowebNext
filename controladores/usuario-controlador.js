/**
 * @file usuario-controlador.js
 * @description Controlador para el registro de nuevos usuarios y la autenticación (login).
 */

const db = require("../base-de-datos/conexion");
const bcrypt = require("bcrypt");

// Registrar usuario nuevo
exports.registrarUsuario = async (req, res) => {
  const { apellido, nombre, cedula, fecha_nacimiento, usuario, password } =
    req.body;

  try {
    // Validar si el nombre de usuario ya existe
    const usuarioExiste = await db.query(
      `SELECT * FROM usuarios WHERE usuario = $1`,
      [usuario],
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Validar si la cédula ya está registrada
    const cedulaExiste = await db.query(
      `SELECT * FROM usuarios WHERE cedula = $1`,
      [cedula],
    );

    if (cedulaExiste.rows.length > 0) {
      return res.status(400).json({ mensaje: "La cédula ya está registrada" });
    }

    // Encriptar la contraseña de forma segura
    const passwordEncriptada = await bcrypt.hash(password, 10);

    // Guardar el usuario en la base de datos
    await db.query(
      `INSERT INTO usuarios (apellido, nombre, cedula, fecha_nacimiento, usuario, password, rol)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        apellido,
        nombre,
        cedula,
        fecha_nacimiento,
        usuario,
        passwordEncriptada,
        "usuario",
      ],
    );

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ mensaje: "Error al registrar el usuario" });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  let { usuario, password } = req.body;

  // Validar tipos de datos de entrada
  if (typeof usuario !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ mensaje: "Ingrese un usuario y una contraseña válidos." });
  }

  usuario = usuario.trim();

  if (!usuario || !password.trim()) {
    return res
      .status(400)
      .json({ mensaje: "Complete todos los campos correctamente." });
  }

  try {
    const resultado = await db.query(
      `SELECT * FROM usuarios WHERE usuario = $1`,
      [usuario],
    );

    if (resultado.rows.length === 0) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    const usuarioEncontrado = resultado.rows[0];

    // Comparar la contraseña ingresada con el hash guardado
    const contraseñaCorrecta = await bcrypt.compare(
      password,
      usuarioEncontrado.password,
    );

    if (!contraseñaCorrecta) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    res.json({
      mensaje: "Inicio de sesión correcto",
      usuario: usuarioEncontrado.usuario,
      nombre: usuarioEncontrado.nombre,
      apellido: usuarioEncontrado.apellido,
      rol: usuarioEncontrado.rol,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};
