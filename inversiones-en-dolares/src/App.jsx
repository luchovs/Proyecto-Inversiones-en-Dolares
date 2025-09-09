import React, { useState } from "react";
import "./App.css";

function App() {
  // Estados para el simulador
  const [monto, setMonto] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [interes, setInteres] = useState("");
  const [resultado, setResultado] = useState(null);

  // Estado para manejar secciones (false = simulador, true = registro)
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  // Estados del registro
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [password, setPassword] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // Función simulador
  const calcularInversion = (e) => {
    e.preventDefault();

    const P = parseFloat(monto);
    const r = parseFloat(interes) / 100;
    const t = parseInt(tiempo);

    const A = P * Math.pow(1 + r / 12, t);
    setResultado(A.toFixed(2));
  };

  // Función registro
  const registrarUsuario = (e) => {
    e.preventDefault();

    if (nombre && apellido && email && pais && password) {
      setRegistroExitoso(true);
    } else {
      setRegistroExitoso(false);
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  return (
    <div className="app-container">
      {/* Navbar (siempre visible) */}
      <nav className="navbar">
        <h2 className="logo">Inversiones</h2>
        <ul className="nav-links">
          <li onClick={() => setMostrarRegistro(false)}>Inicio</li>
          <li onClick={() => setMostrarRegistro(false)}>Simulación</li>
          <li onClick={() => setMostrarRegistro(true)}>Regístrate</li>
          <li>Contacto</li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <main className="main-content">
        {!mostrarRegistro ? (
          <>
            <h1>Simulador de Inversiones en Dólares</h1>

            <form className="form-container" onSubmit={calcularInversion}>
              <label>
                Monto en dólares:
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  required
                />
              </label>

              <label>
                Tiempo (meses):
                <input
                  type="number"
                  value={tiempo}
                  onChange={(e) => setTiempo(e.target.value)}
                  required
                />
              </label>

              <label>
                Interés anual (%):
                <input
                  type="number"
                  value={interes}
                  onChange={(e) => setInteres(e.target.value)}
                  required
                />
              </label>

              <button type="submit">Calcular</button>
            </form>

            {resultado && (
              <div className="result">
                <h3>Resultado de la inversión</h3>
                <p>
                  Al final del período tendrás: <strong>${resultado}</strong>
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h1>Registro de Inversionista</h1>

            <form className="form-container" onSubmit={registrarUsuario}>
              <label>
                Nombre:
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>

              <label>
                Apellido:
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Teléfono:
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </label>

              <label>
                País de residencia:
                <input
                  type="text"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  required
                />
              </label>

              <label>
                Contraseña:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <button type="submit">Registrarse</button>
            </form>

            {registroExitoso && (
              <div className="result">
                <p>Inversionista registrado con éxito</p>
                <p>
                  Bienvenido, {nombre} {apellido}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
