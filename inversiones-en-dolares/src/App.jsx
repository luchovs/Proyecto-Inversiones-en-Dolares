import React, { useState } from "react";
import "./App.css";

function App() {
  // -------- Estados simulador --------
  const [monto, setMonto] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [resultado, setResultado] = useState(null);

  // -------- Navegación --------
  const [vista, setVista] = useState("inicio"); // "inicio" | "registro" | "login"

  // -------- Registro --------
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // -------- Login --------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginExitoso, setLoginExitoso] = useState(false);

  const INTERES_ANUAL = 0.05;

  // -------- Funciones --------
  const calcularInversion = (e) => {
    e.preventDefault();
    const P = parseFloat(monto);
    const dias = parseInt(tiempo);

    if (isNaN(P) || P < 100 || P > 100000) {
      alert("El monto debe estar entre 100 y 100000 dólares.");
      return;
    }
    if (isNaN(dias) || dias < 1 || dias > 365) {
      alert("El tiempo debe estar entre 1 y 365 días.");
      return;
    }

    const tasaDiaria = INTERES_ANUAL / 365;
    const A = P * Math.pow(1 + tasaDiaria, dias);
    setResultado(A.toFixed(2));
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    if (nombre && apellido && email && pais && password) {
      try {
        const response = await fetch("http://127.0.0.1:8080/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            apellido,
            email,
            telefono,
            pais,
            usuario,
            password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setRegistroExitoso(true);
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        alert("Error de red: " + error);
      }
    } else {
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  // ---- NUEVO: login ----
  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setLoginExitoso(true);
      } else {
        alert("Credenciales inválidas: " + data.error);
      }
    } catch (error) {
      alert("Error de red: " + error);
    }
  };

  // -------- Render --------
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">Inversiones</h2>
        <ul className="nav-links">
          <li onClick={() => setVista("inicio")}>Inicio</li>
          <li onClick={() => setVista("inicio")}>Simulación</li>
          <li onClick={() => setVista("registro")}>Regístrate</li>
          <li onClick={() => setVista("login")}>Iniciar sesión</li>
        </ul>
      </nav>

      <main className="main-content">
        {vista === "inicio" && (
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
                Tiempo (días):
                <input
                  type="number"
                  value={tiempo}
                  onChange={(e) => setTiempo(e.target.value)}
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
        )}

        {vista === "registro" && (
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
                Nombre de Usuario:
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
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

        {/* --- NUEVO: vista login --- */}
        {vista === "login" && (
          <>
            <h1>Iniciar Sesión</h1>
            <form className="form-container" onSubmit={iniciarSesion}>
              <label>
                Email:
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Contraseña:
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Ingresar</button>
            </form>
            {loginExitoso && (
              <div className="result">
                <p>Inicio de sesión exitoso</p>
                <p>Bienvenido nuevamente</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
