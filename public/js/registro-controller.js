async function registrarUsuario() {
  const apellido = document.getElementById("apellido").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const cedula = document.getElementById("cedula").value.trim();
  const fecha = document.getElementById("fecha").value;
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  mensaje.textContent = "";

  if (
    !apellido ||
    !nombre ||
    !cedula ||
    !fecha ||
    !usuario ||
    !password.trim()
  ) {
    mensaje.textContent = "Complete todos los campos.";
    return;
  }

  if (!/^\d+$/.test(cedula)) {
    mensaje.textContent = "La cédula debe contener solo números.";
    return;
  }

  const hoy = new Date();
  const fechaActual = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  if (fecha > fechaActual) {
    mensaje.textContent = "La fecha de nacimiento no puede ser futura.";
    return;
  }

  try {
    const respuesta = await fetch("/usuarios/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apellido,
        nombre,
        cedula,
        fecha_nacimiento: fecha,
        usuario,
        password,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent =
        datos.mensaje || "No fue posible registrar el usuario.";
      return;
    }

    mensaje.textContent = datos.mensaje;

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    mensaje.textContent = "No se pudo conectar con el servidor.";
  }
}
