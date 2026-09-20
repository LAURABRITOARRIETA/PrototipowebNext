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
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = datos.mensaje;
            return;
        }

        // Guardar los datos básicos del usuario
        sessionStorage.setItem("usuario", datos.usuario);
        sessionStorage.setItem("nombre", datos.nombre);
        sessionStorage.setItem("rol", datos.rol);

        // Entrar a la aplicación
        window.location.href = "crear-turno.html";

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No se pudo conectar con el servidor.";
    }
}