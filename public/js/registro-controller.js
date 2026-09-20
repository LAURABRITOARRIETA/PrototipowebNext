async function registrarUsuario() {

    const apellido = document.getElementById("apellido").value;
    const nombre = document.getElementById("nombre").value;
    const cedula = document.getElementById("cedula").value;
    const fecha = document.getElementById("fecha").value;
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    const mensaje = document.getElementById("mensaje");

    // Verificar campos
    if (
        apellido === "" ||
        nombre === "" ||
        cedula === "" ||
        fecha === "" ||
        usuario === "" ||
        password === ""
    ) {
        mensaje.textContent = "Complete todos los campos";
        return;
    }

    try {

        const respuesta = await fetch("/usuarios/registro", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                apellido: apellido,
                nombre: nombre,
                cedula: cedula,
                fecha_nacimiento: fecha,
                usuario: usuario,
                password: password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = datos.mensaje;
            return;
        }

        mensaje.textContent = datos.mensaje;

        // Después de registrarse, ir al login
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No se pudo conectar con el servidor.";
    }
}