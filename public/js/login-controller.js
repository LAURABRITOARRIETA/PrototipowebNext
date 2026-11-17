async function iniciarSesion() {
  const usuario = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  if (usuario === "" || password === "") {
    mensaje.textContent = "Complete todos los campos";
    return;
  }

  try {
    const respuesta = await fetch("/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: usuario,
        password: password,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = datos.mensaje;
      return;
    }

    // Guardar los datos básicos del usuario en el navegador
    sessionStorage.setItem("usuario", datos.usuario);
    sessionStorage.setItem("nombre", datos.nombre);
    sessionStorage.setItem("rol", datos.rol);

    // Redirigir según el rol del usuario
    if (datos.rol === "admin") {
      window.location.href = "admin.html";
    } else if (datos.rol === "operador") {
      window.location.href = "crear-turno.html";
    } else if (datos.rol === "asesor") {
      window.location.href = "atencion-turnos.html";
    } else {
      mensaje.textContent = "Tu usuario no tiene un rol válido asignado.";
    }
  } catch (error) {
    console.error(error);
    mensaje.textContent = "No se pudo conectar con el servidor.";
  }
}