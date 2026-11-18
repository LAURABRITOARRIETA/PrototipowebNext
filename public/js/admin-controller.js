document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});

async function cargarUsuarios() {
  const contenedor = document.getElementById("listaUsuarios");

  try {
    const res = await fetch("/usuarios");
    const usuarios = await res.json();

    if (!res.ok) {
      mostrarAlerta(usuarios.mensaje || "No se pudo obtener la lista de usuarios.", "danger");
      return;
    }

    if (usuarios.length === 0) {
      contenedor.innerHTML = `
        <div class="card" style="max-width: 100%;">
          <p style="margin: 0; color: #6c757d;">No hay usuarios registrados en el sistema.</p>
        </div>
      `;
      return;
    }

    contenedor.innerHTML = usuarios
      .map((u) => {
        const esPendiente = u.estado_cuenta === "PENDIENTE";
        const claseEstado = esPendiente ? "en-espera" : "atendido";

        return `
          <div class="turno-espera" style="flex-wrap: wrap; gap: 15px;">
            
            <!-- DATOS DEL USUARIO -->
            <div class="turno-info" style="min-width: 220px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                <strong style="font-size: 18px; color: #007bff;">${u.nombre} ${u.apellido}</strong>
                <span class="estado ${claseEstado}" style="font-size: 12px; font-weight: 600;">
                  ${u.estado_cuenta}
                </span>
              </div>
              <span style="font-size: 14px; color: #495057;">
                <strong>Usuario:</strong> ${u.usuario} &nbsp;|&nbsp; <strong>Cédula:</strong> ${u.cedula}
              </span>
              <span style="font-size: 14px; color: #6c757d;">
                <strong>Correo:</strong> ${u.correo || "Sin correo registrado"}
              </span>
            </div>

            <!-- SELECTOR DE ROL Y ACCIONES -->
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <div style="width: 150px;">
                <select id="rol-${u.id}" style="padding: 10px 12px; font-size: 14px;">
                  <option value="operador" ${u.rol === "operador" ? "selected" : ""}>Operador</option>
                  <option value="asesor" ${u.rol === "asesor" ? "selected" : ""}>Asesor</option>
                  <option value="admin" ${u.rol === "admin" ? "selected" : ""}>Administrador</option>
                </select>
              </div>

              <button
                onclick="aprobarUsuario(${u.id})"
                style="width: auto; padding: 10px 15px; font-size: 14px; background: #28a745;"
              >
                ${esPendiente ? "Aprobar y Notificar" : "Actualizar Rol"}
              </button>

              <button
                class="btn-eliminar"
                onclick="eliminarUsuario(${u.id}, '${u.usuario}')"
                style="width: auto; padding: 10px 15px; font-size: 14px;"
              >
                Eliminar
              </button>
            </div>

          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    mostrarAlerta("Error al conectar con el servidor.", "danger");
  }
}

async function aprobarUsuario(id) {
  const rolSeleccionado = document.getElementById(`rol-${id}`).value;

  try {
    const res = await fetch(`/usuarios/${id}/aprobar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rol: rolSeleccionado }),
    });

    const datos = await res.json();
    if (!res.ok) {
      mostrarAlerta(datos.mensaje || "No se pudo aprobar el usuario.", "danger");
      return;
    }

    mostrarAlerta(datos.mensaje, "success");
    cargarUsuarios();
  } catch (error) {
    console.error("Error:", error);
    mostrarAlerta("Error de conexión con el servidor.", "danger");
  }
}

async function eliminarUsuario(id, nombreUsuario) {
  if (!confirm(`¿Seguro que deseas eliminar al usuario "${nombreUsuario}"?`)) return;

  try {
    const res = await fetch(`/usuarios/${id}`, { method: "DELETE" });
    const datos = await res.json();

    if (!res.ok) {
      mostrarAlerta(datos.mensaje || "No se pudo eliminar el usuario.", "danger");
      return;
    }

    mostrarAlerta(datos.mensaje, "warning");
    cargarUsuarios();
  } catch (error) {
    console.error("Error:", error);
    mostrarAlerta("Error de conexión con el servidor.", "danger");
  }
}

function mostrarAlerta(texto, tipo) {
  const alerta = document.getElementById("alertaAdmin");
  alerta.textContent = texto;
  alerta.style.display = "block";

  if (tipo === "success") {
    alerta.style.backgroundColor = "#d4edda";
    alerta.style.color = "#155724";
    alerta.style.border = "1px solid #c3e6cb";
  } else if (tipo === "warning") {
    alerta.style.backgroundColor = "#fff3cd";
    alerta.style.color = "#856404";
    alerta.style.border = "1px solid #ffeeba";
  } else {
    alerta.style.backgroundColor = "#f8d7da";
    alerta.style.color = "#721c24";
    alerta.style.border = "1px solid #f5c6cb";
  }

  setTimeout(() => {
    alerta.style.display = "none";
  }, 5000);
}

async function cerrarSesion() {
  await fetch("/usuarios/logout", { method: "POST" });
  sessionStorage.clear();
  window.location.href = "login.html";
}