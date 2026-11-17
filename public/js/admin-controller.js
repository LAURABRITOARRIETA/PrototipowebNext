document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});

async function cargarUsuarios() {
  const tbody = document.getElementById("tablaUsuarios");

  try {
    const res = await fetch("/usuarios");
    const usuarios = await res.json();

    if (usuarios.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No hay usuarios registrados.</td></tr>`;
      return;
    }

    tbody.innerHTML = usuarios
      .map((u) => {
        const esPendiente = u.estado_cuenta === "PENDIENTE";
        const badgeEstado = esPendiente
          ? `<span class="badge bg-warning text-dark">PENDIENTE</span>`
          : `<span class="badge bg-success">APROBADO</span>`;

        return `
          <tr>
            <td class="fw-semibold">${u.nombre} ${u.apellido}</td>
            <td>${u.cedula}</td>
            <td>${u.usuario}</td>
            <td>${u.correo || '<span class="text-muted">Sin correo</span>'}</td>
            <td>${badgeEstado}</td>
            <td>
              <select id="rol-${u.id}" class="form-select form-select-sm" style="width: 140px;">
                <option value="operador" ${u.rol === "operador" ? "selected" : ""}>Operador</option>
                <option value="asesor" ${u.rol === "asesor" ? "selected" : ""}>Asesor</option>
                <option value="admin" ${u.rol === "admin" ? "selected" : ""}>Administrador</option>
              </select>
            </td>
            <td class="text-end">
              <button class="btn btn-success btn-sm me-1" onclick="aprobarUsuario(${u.id})">
                ${esPendiente ? "Aprobar y Notificar" : "Actualizar Rol"}
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="eliminarUsuario(${u.id}, '${u.usuario}')">
                Eliminar
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    mostrarAlerta("Error al cargar los usuarios desde el servidor.", "danger");
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
  }
}

function mostrarAlerta(texto, tipo) {
  const alerta = document.getElementById("alertaAdmin");
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = texto;
  alerta.classList.remove("d-none");
  setTimeout(() => alerta.classList.add("d-none"), 5000);
}

async function cerrarSesion() {
  await fetch("/usuarios/logout", { method: "POST" });
  window.location.href = "login.html";
}