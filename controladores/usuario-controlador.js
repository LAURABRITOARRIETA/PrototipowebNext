/**
 * @file usuario-controlador.js
 * @description Controlador HTTP para registro, autenticación y administración de usuarios.
 */

const usuarioServicio = require("../servicios/usuario-servicio");

exports.registrarUsuario = async (req, res) => {
  const { apellido, nombre, cedula, correo, fecha_nacimiento, usuario, password } = req.body;

  if (!apellido || !nombre || !cedula || !correo || !fecha_nacimiento || !usuario || !password) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
  }

  try {
    await usuarioServicio.registrarNuevoUsuario({
      apellido: apellido.trim(),
      nombre: nombre.trim(),
      cedula: cedula.trim(),
      correo: correo.trim().toLowerCase(),
      fecha_nacimiento,
      usuario: usuario.trim(),
      password,
    });

    res.status(201).json({
      mensaje: "Registro exitoso. Tu cuenta quedó pendiente de aprobación por el administrador.",
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(error.statusCode || 500).json({
      mensaje: error.message || "Error al registrar el usuario.",
    });
  }
};

exports.login = async (req, res) => {
  let { usuario, password } = req.body;

  if (typeof usuario !== "string" || typeof password !== "string") {
    return res.status(400).json({ mensaje: "Ingrese un usuario y una contraseña válidos." });
  }

  usuario = usuario.trim();
  if (!usuario || !password.trim()) {
    return res.status(400).json({ mensaje: "Complete todos los campos correctamente." });
  }

  try {
    const datosUsuario = await usuarioServicio.autenticarUsuario(usuario, password);

    // Guardar datos en la sesión del servidor
    req.session.usuario = datosUsuario;

    res.json({
      mensaje: "Inicio de sesión correcto",
      ...datosUsuario,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(error.statusCode || 500).json({
      mensaje: error.message || "Error al iniciar sesión.",
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ mensaje: "Sesión cerrada correctamente." });
  });
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioServicio.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener la lista de usuarios." });
  }
};

exports.aprobarUsuario = async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  try {
    const usuario = await usuarioServicio.aprobarUsuario(id, rol);
    res.json({
      mensaje: `Usuario ${usuario.usuario} aprobado como ${usuario.rol.toUpperCase()} y notificado por correo.`,
      usuario,
    });
  } catch (error) {
    console.error("Error al aprobar usuario:", error);
    res.status(error.statusCode || 500).json({
      mensaje: error.message || "Error al aprobar el usuario.",
    });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await usuarioServicio.eliminarUsuario(id);
    res.json({ mensaje: "Solicitud/usuario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(error.statusCode || 500).json({
      mensaje: error.message || "Error al eliminar el usuario.",
    });
  }
};