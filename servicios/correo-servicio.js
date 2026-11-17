/**
 * @file correo-servicio.js
 * @description Servicio encargado del envío de notificaciones por correo electrónico mediante Nodemailer.
 */

const nodemailer = require("nodemailer");

// Configuración del transportador SMTP (Gmail)
// Nota: Para envío real con Gmail, reemplaza con tu correo y tu "Contraseña de aplicación" de Google
const CORREO_EMISOR = process.env.EMAIL_USER || "tu_correo_sistema@gmail.com";
const CLAVE_APLICACION = process.env.EMAIL_PASS || "";

const transportador = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: CORREO_EMISOR,
    pass: CLAVE_APLICACION,
  },
});

/**
 * Envía un correo al usuario cuando el administrador aprueba su cuenta y le asigna un rol.
 */
async function enviarCorreoAprobacion(correoDestino, nombre, rol) {
  const asunto = "Cuenta aprobada - Sistema de Turnos Next?";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="color: #0d6efd;">¡Hola, ${nombre}!</h2>
      <p>Tu solicitud de registro en el sistema de gestión de turnos <strong>Next?</strong> ha sido <strong>aprobada</strong> por el administrador.</p>
      <p><strong>Rol asignado:</strong> ${rol.toUpperCase()}</p>
      <p>Ya puedes iniciar sesión en la plataforma con tu usuario y contraseña.</p>
      <hr>
      <small style="color: #666;">Este es un mensaje automático, por favor no respondas a este correo.</small>
    </div>
  `;

  return await procesarEnvio(correoDestino, asunto, html);
}

/**
 * Envía un correo al cliente con los datos de su turno y el enlace único (UUID) para verlo o cancelarlo.
 */
async function enviarCorreoTurno(correoDestino, nombre, numeroTurno, tramite, enlaceUnico) {
  const asunto = `Tu Turno #${numeroTurno} - Sistema Next?`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="color: #0d6efd;">Confirmación de Turno - Next?</h2>
      <p>Hola <strong>${nombre}</strong>, tu turno ha sido generado exitosamente.</p>
      <ul>
        <li><strong>Número de Turno:</strong> #${numeroTurno}</li>
        <li><strong>Trámite:</strong> ${tramite}</li>
      </ul>
      <p>Puedes consultar el estado de tu turno o cancelarlo en cualquier momento desde el siguiente enlace exclusivo (no requiere iniciar sesión):</p>
      <p style="text-align: center; margin: 25px 0;">
        <a href="${enlaceUnico}" style="background-color: #0d6efd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Ver / Gestionar mi Turno
        </a>
      </p>
      <p style="font-size: 12px; color: #555;">O copia este enlace en tu navegador: ${enlaceUnico}</p>
    </div>
  `;

  return await procesarEnvio(correoDestino, asunto, html);
}

/**
 * Función interna que ejecuta el envío o lo muestra en consola si aún no se ha configurado la clave SMTP.
 */
async function procesarEnvio(para, asunto, html) {
  if (!CLAVE_APLICACION) {
    console.log("==================================================");
    console.log(`[MODO PRUEBA - CORREO SIMULADO] Para: ${para}`);
    console.log(`Asunto: ${asunto}`);
    console.log("Contenido HTML generado correctamente (configura CLAVE_APLICACION para envío real).");
    console.log("==================================================");
    return true;
  }

  try {
    await transportador.sendMail({
      from: `"Sistema Next?" <${CORREO_EMISOR}>`,
      to: para,
      subject: asunto,
      html: html,
    });
    console.log(`Correo enviado exitosamente a ${para}`);
    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error.message);
    return false;
  }
}

module.exports = {
  enviarCorreoAprobacion,
  enviarCorreoTurno,
};