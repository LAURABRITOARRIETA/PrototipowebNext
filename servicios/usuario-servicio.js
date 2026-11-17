/**
 * @file usuario-servicio.js
 * @description Lógica de negocio para registro, autenticación y aprobación de usuarios.
 */

const bcrypt = require("bcrypt");
const usuarioModelo = require("../modelos/usuario-modelo");
const correoServicio = require("./correo-servicio");

async function registrarNuevoUsuario(datos) {
  const { apellido, nombre, cedula, correo, fecha_nacimiento, usuario, password } = datos;

  const usuarioExistente = await usuarioModelo.buscarPorUsuario(usuario);
  if (usuarioExistente) {
    const error = new Error("El nombre de usuario ya existe.");
    error.statusCode = 400;
    throw error;
  }

  const duplicado = await usuarioModelo.buscarPorCedulaOCorreo(cedula, correo);
  if (duplicado) {
    const mensaje =
      duplicado.cedula === cedula
        ? "La cédula ya está registrada."
        : "El correo electrónico ya está registrado.";
    const error = new Error(mensaje);
    error.statusCode = 400;
    throw error;
  }

  const passwordEncriptada = await bcrypt.hash(password, 10);

  return await usuarioModelo.crearUsuario({
    apellido,
    nombre,
    cedula,
    correo,
    fecha_nacimiento,
    usuario,
    password: passwordEncriptada,
    rol: "pendiente",
  });
}

async function autenticarUsuario(usuario, password) {
  const usuarioEncontrado = await usuarioModelo.buscarPorUsuario(usuario);

  if (!usuarioEncontrado) {
    const error = new Error("Usuario o contraseña incorrectos.");
    error.statusCode = 401;
    throw error;
  }

  const contraseñaCorrecta = await bcrypt.compare(password, usuarioEncontrado.password);
  if (!contraseñaCorrecta) {
    const error = new Error("Usuario o contraseña incorrectos.");
    error.statusCode = 401;
    throw error;
  }

  // Verificar si el administrador ya aprobó la cuenta
  if (usuarioEncontrado.estado_cuenta !== "APROBADO") {
    const error = new Error("Tu cuenta aún está pendiente de aprobación por el administrador.");
    error.statusCode = 403;
    throw error;
  }

  return {
    id: usuarioEncontrado.id,
    usuario: usuarioEncontrado.usuario,
    nombre: usuarioEncontrado.nombre,
    apellido: usuarioEncontrado.apellido,
    correo: usuarioEncontrado.correo,
    rol: usuarioEncontrado.rol,
  };
}

async function obtenerUsuarios() {
  return await usuarioModelo.listarTodos();
}

async function aprobarUsuario(id, rol) {
  const rolesPermitidos = ["admin", "operador", "asesor"];
  if (!rolesPermitidos.includes(rol)) {
    const error = new Error("Rol no válido. Debe ser admin, operador o asesor.");
    error.statusCode = 400;
    throw error;
  }

  const usuarioActualizado = await usuarioModelo.aprobarYAsignarRol(id, rol);
  if (!usuarioActualizado) {
    const error = new Error("Usuario no encontrado.");
    error.statusCode = 404;
    throw error;
  }

  // Enviar notificación por correo electrónico
  if (usuarioActualizado.correo) {
    await correoServicio.enviarCorreoAprobacion(
      usuarioActualizado.correo,
      `${usuarioActualizado.nombre} ${usuarioActualizado.apellido}`,
      usuarioActualizado.rol
    );
  }

  return usuarioActualizado;
}

async function eliminarUsuario(id) {
  const eliminado = await usuarioModelo.eliminarPorId(id);
  if (!eliminado) {
    const error = new Error("Usuario no encontrado.");
    error.statusCode = 404;
    throw error;
  }
  return eliminado;
}

module.exports = {
  registrarNuevoUsuario,
  autenticarUsuario,
  obtenerUsuarios,
  aprobarUsuario,
  eliminarUsuario,
};