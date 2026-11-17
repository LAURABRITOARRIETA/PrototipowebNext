/**
 * @file seguridad-middleware.js
 * @description Middlewares para validar sesión activa y permisos por rol en vistas y APIs.
 */

/**
 * Protege las peticiones a la API (devuelve JSON 401 si no hay sesión).
 */
function verificarSesionAPI(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({
      mensaje: "Acceso denegado. Debe iniciar sesión para realizar esta acción.",
    });
  }
  next();
}

/**
 * Valida que el usuario autenticado tenga uno de los roles permitidos en la API (devuelve JSON 403).
 */
function verificarRolAPI(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({
        mensaje: "Acceso denegado. Debe iniciar sesión.",
      });
    }

    const rolUsuario = req.session.usuario.rol;
    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        mensaje: "No tiene permisos suficientes para acceder a este recurso.",
      });
    }

    next();
  };
}

/**
 * Protege las vistas HTML privadas antes de servir archivos estáticos.
 * Si no hay sesión redirige a login.html; si el rol no corresponde, redirige a error.html.
 */
function protegerVista(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.redirect("/login.html");
    }

    const rolUsuario = req.session.usuario.rol;
    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.redirect("/error.html");
    }

    next();
  };
}

module.exports = {
  verificarSesionAPI,
  verificarRolAPI,
  protegerVista,
};