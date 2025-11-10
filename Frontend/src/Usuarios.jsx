import React, { useEffect, useState } from "react";

function Usuarios({ usuarioData }) {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8080/usuarios";

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      setError("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    if (usuarioData.rol === "admin") cargarUsuarios();
  }, [usuarioData]);

  const handleEdit = (u) => {
    setEditando(u.Id_Inversionista);
    setForm({ ...u });
  };

  const handleCancel = () => {
    setEditando(null);
    setForm({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await cargarUsuarios();
        setEditando(null);
      } else {
        setError("Error al actualizar usuario");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsuarios(usuarios.filter((u) => u.Id_Inversionista !== id));
      } else {
        setError("Error al eliminar usuario");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  if (usuarioData.rol !== "admin") {
    return <p>No tenés permisos para ver esta sección.</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Panel de Administración</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        border="1"
        cellPadding="8"
        style={{
          margin: "20px auto",
          borderCollapse: "collapse",
          width: "90%",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#001f5b", color: "white" }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>País</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.Id_Inversionista}>
              {editando === u.Id_Inversionista ? (
                <>
                  <td>{u.Id_Inversionista}</td>
                  <td>
                    <input
                      name="Nombre"
                      value={form.Nombre}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="Apellido"
                      value={form.Apellido}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="Email"
                      value={form.Email}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="Telefono"
                      value={form.Telefono}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="Pais_Residencia"
                      value={form.Pais_Residencia}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="Usuario"
                      value={form.Usuario}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="Rol"
                      value={form.Rol}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(u.Id_Inversionista)}>
                      Guardar
                    </button>
                    <button onClick={handleCancel}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.Id_Inversionista}</td>
                  <td>{u.Nombre}</td>
                  <td>{u.Apellido}</td>
                  <td>{u.Email}</td>
                  <td>{u.Telefono}</td>
                  <td>{u.Pais_Residencia}</td>
                  <td>{u.Usuario}</td>
                  <td>{u.Rol}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(u)}
                      style={{ marginRight: "8px" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.Id_Inversionista)}
                      style={{ backgroundColor: "#FF0000", color: "white" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
