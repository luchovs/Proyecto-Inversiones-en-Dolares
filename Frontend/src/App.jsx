import React, { useState, useEffect } from "react";
import "./App.css";
import Usuarios from "./Usuarios"; // 👈 Asegúrate de que este archivo exista

function App() {
  const [monto, setMonto] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [resultado, setResultado] = useState(null);

  const [vista, setVista] = useState("inicio");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const [loginUsuario, setLoginUsuario] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginExitoso, setLoginExitoso] = useState(false);

  const [usuarioData, setUsuarioData] = useState({
    id_inversionista: null,
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "",
    usuario: "",
    rol: "",
  });

  // ESTADOS PARA "MI CUENTA"
  const [vistaMiCuenta, setVistaMiCuenta] = useState("datos"); // 'datos' o 'historial'
  const [historialInversiones, setHistorialInversiones] = useState([]);

  const INTERES_ANUAL = 0.05;

  // --- Conversión a dólares ---
  const [conversionMonto, setConversionMonto] = useState("");
  const [conversionTipo, setConversionTipo] = useState("ARS"); // ARS o BTC
  const [conversionResultado, setConversionResultado] = useState(null);

  // Estado para la cotización del dólar oficial (Valores de ejemplo)
  const [dolarOficial, setDolarOficial] = useState({
    compra: 1395,
    venta: 1415,
    fechaActualizacion: "2025-11-10T11:51:00.000Z",
  });

  const BTC_USD = 106244.2;

  // --- Traer cotización actual de DolarApi ---
  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const response = await fetch(
          "https://www.dolarapi.com/api/v1/dolares/oficial"
        );
        const data = await response.json();
        setDolarOficial({
          compra: data.compra,
          venta: data.venta,
          fechaActualizacion: data.fechaActualizacion,
        });
      } catch (error) {
        console.error("Error al obtener el dólar:", error);
      }
    };

    fetchDolar(); // primera llamada al cargar

    const interval = setInterval(fetchDolar, 300000); // actualizar cada 5 minutos
    return () => clearInterval(interval); // limpiar intervalo
  }, []);

  const calcularInversion = async (e) => {
    e.preventDefault();
    const P = parseFloat(monto);
    const dias = parseInt(tiempo);
    const fechaInicioSQL = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD

    if (isNaN(P) || P < 100 || P > 100000) {
      alert("El monto debe estar entre 100 y 100000 dólares.");
      return;
    }
    if (isNaN(dias) || dias < 30 || dias > 365) {
      alert("El tiempo debe estar entre 30 y 365 días.");
      return;
    }

    const tasaDiaria = INTERES_ANUAL / 365;
    const A = P * Math.pow(1 + tasaDiaria, dias);
    setResultado(A.toFixed(2));

    // 🔹 Registrar la inversión en MySQL (solo si está logueado)
    if (loginExitoso && usuarioData.id_inversionista) {
      try {
        const response = await fetch(
          "http://127.0.0.1:8080/registrar_inversion",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_inversionista: usuarioData.id_inversionista,
              id_tipo: 1,
              monto_inicial: P,
              fecha_inicio: fechaInicioSQL,
              dias: dias, // ENVIAMOS SOLO LOS DÍAS
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          console.log(
            "Simulación registrada con éxito. Fecha Fin (Backend):",
            data.fecha_fin
          );
          alert(`Simulación registrada con éxito. Vence el ${data.fecha_fin}`);
        } else {
          alert("Error al registrar simulación: " + data.error);
        }
      } catch (error) {
        alert("Error de red al registrar simulación: " + error);
      }
    } else {
      alert("Simulación exitosa. Inicia sesión para registrar la simulación.");
    }
  };

  const convertirADolares = (e) => {
    e.preventDefault();
    let monto = parseFloat(conversionMonto);
    if (isNaN(monto) || monto <= 0) {
      alert("Ingresa un monto válido");
      return;
    }

    let resultado = 0;
    if (conversionTipo === "ARS") {
      resultado = monto / dolarOficial.venta; // usando dólar venta actualizado
    } else if (conversionTipo === "BTC") {
      resultado = monto * BTC_USD;
    }
    setConversionResultado(resultado.toFixed(2));
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    if (nombre && apellido && email && pais && usuario && password) {
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
        if (response.ok) setRegistroExitoso(true);
        else alert("Error: " + data.error);
      } catch (error) {
        alert("Error de red: " + error);
      }
    } else alert("Por favor, completa todos los campos obligatorios.");
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: loginUsuario,
          password: loginPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setLoginExitoso(true);
        setUsuarioData(data.usuario);
        setVista("inicio");
      } else {
        alert("Credenciales inválidas: " + data.error);
      }
    } catch (error) {
      alert("Error de red: " + error);
    }
  };

  const actualizarDatos = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8080/editar_usuario", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioData),
      });
      const data = await response.json();
      if (response.ok) alert("Datos actualizados correctamente");
      else alert("Error: " + data.error);
    } catch (error) {
      alert("Error de red: " + error);
    }
  };

  // FUNCIÓN: Obtener historial de inversiones
  const obtenerHistorialInversiones = async () => {
    if (!usuarioData.id_inversionista) return;

    try {
      const url = `http://127.0.0.1:8080/inversiones/${usuarioData.id_inversionista}`;
      const response = await fetch(url);

      const data = await response.json();

      if (response.ok) {
        setHistorialInversiones(data);
      } else {
        console.error("Error al cargar historial:", data.error);
        alert("Error al cargar historial: " + data.error);
        setHistorialInversiones([]);
      }
    } catch (error) {
      console.error("Error de red al cargar historial:", error);
      alert("Error de red al cargar historial: " + error);
      setHistorialInversiones([]);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <img
          src="/logo.png"
          alt="Logo Inversiones"
          className="logo-img"
          onClick={() => setVista("inicio")}
        />
        <ul className="nav-links">
          <li onClick={() => setVista("inicio")}>Inicio</li>
          <li onClick={() => setVista("simulacion")}>Simulación</li>
          <li onClick={() => setVista("conversion")}>Conversión</li>
          {!loginExitoso && (
            <li onClick={() => setVista("registro")}>Regístrate</li>
          )}
          {!loginExitoso && (
            <li onClick={() => setVista("login")}>Iniciar sesión</li>
          )}
          {loginExitoso && (
            <li onClick={() => setVista("miCuenta")}>Mi cuenta</li>
          )}
          {loginExitoso && usuarioData.rol === "admin" && (
            <li onClick={() => setVista("usuarios")}>Usuarios</li>
          )}
          {loginExitoso && (
            <li
              onClick={() => {
                setLoginExitoso(false);
                setUsuarioData({
                  // Limpiar datos del usuario
                  id_inversionista: null,
                  nombre: "",
                  apellido: "",
                  email: "",
                  telefono: "",
                  pais: "",
                  usuario: "",
                  rol: "",
                });
                setVista("inicio");
              }}
            >
              Cerrar sesión
            </li>
          )}
        </ul>
      </nav>

      <main className="main-content">
        {/* 🌟 VISTA DE ADMINISTRADOR RESTAURADA 🌟 */}
        {vista === "usuarios" &&
          loginExitoso &&
          usuarioData.rol === "admin" && <Usuarios usuarioData={usuarioData} />}

        {vista === "inicio" && (
          <>
            <div className="inicio-fondo">
              <div className="inicio-cuadro">
                <h1>Simulá la inversión de tus ahorros en dólares</h1>
                <button
                  className="invertir-boton"
                  onClick={() => setVista("simulacion")}
                >
                  Comenzar a simular
                </button>
              </div>
            </div>

            <section className="faq-section">
              <h2>Preguntas Frecuentes</h2>

              <div className="faq-item">
                <h3>¿Cuál es el monto mínimo para invertir?</h3>
                <p>
                  El monto mínimo es de 100 USD para comenzar una inversión.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿En cuánto tiempo puedo retirar mi dinero?</h3>
                <p>
                  Podés elegir plazos desde 30 hasta 365 días según tu
                  conveniencia.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿Qué tasa de interés obtengo?</h3>
                <p>
                  La tasa anual es del 5%, y aumenta proporcionalmente según el
                  tiempo del depósito.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿Necesito tener una cuenta bancaria en dólares?</h3>
                <p>
                  Sí, las inversiones se realizan en cuentas en dólares para
                  garantizar la rentabilidad en esa moneda.
                </p>
              </div>

              <div className="faq-item">
                <h3>¿Puedo simular mi inversión antes de invertir?</h3>
                <p>
                  Sí, en la sección “Simulación” podés calcular cuánto ganarías
                  según el monto y plazo.
                </p>
              </div>
            </section>
          </>
        )}

        {vista === "simulacion" && (
          <>
            <h1>Simulador de Inversiones en Dólares</h1>
            {loginExitoso ? (
              <p>
                Estás logueado como **{usuarioData.usuario}**. ¡Tu simulación se
                guardará en tu historial!
              </p>
            ) : (
              <p>
                Regístrate o Inicia Sesión para que tu simulación se guarde en
                tu historial.
              </p>
            )}

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
                <h3>Resultado de la simulación</h3>
                <p>
                  Al final del período tendrás: <strong>${resultado}</strong>
                </p>
              </div>
            )}
            <div className="simulacion-fondo"></div>
            <div className="convertir-a-dolares">
              <p>
                ¿Tenés pesos argentinos o bitcoin y querés saber cuántos dólares
                podés invertir?
              </p>
              <button
                className="invertir-boton"
                onClick={() => setVista("conversion")}
              >
                ¡Hace la conversión acá!
              </button>
            </div>
          </>
        )}

        {vista === "conversion" && (
          <>
            <h1>Conversión a Dólares</h1>
            <p>
              Valor dólar oficial: Compra ${dolarOficial.compra} | Venta $
              {dolarOficial.venta}
            </p>
            <p>
              Última actualización:{" "}
              {new Date(dolarOficial.fechaActualizacion).toLocaleDateString()}{" "}
              {new Date(dolarOficial.fechaActualizacion).toLocaleTimeString()}
            </p>

            <form className="form-container" onSubmit={convertirADolares}>
              <label>
                Monto:
                <input
                  type="number"
                  value={conversionMonto}
                  onChange={(e) => setConversionMonto(e.target.value)}
                  required
                />
              </label>
              <label>
                Tipo:
                <select
                  value={conversionTipo}
                  onChange={(e) => setConversionTipo(e.target.value)}
                >
                  <option value="ARS">Pesos Argentinos</option>
                  <option value="BTC">Bitcoin</option>
                </select>
              </label>
              <button type="submit">Convertir</button>
            </form>

            {conversionResultado && (
              <div className="result">
                <p>
                  El monto convertido es:{" "}
                  <strong>${conversionResultado} USD</strong>
                </p>
              </div>
            )}
          </>
        )}

        {vista === "registro" && !loginExitoso && (
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

        {vista === "login" && !loginExitoso && (
          <>
            <h1>Iniciar Sesión</h1>
            <form className="form-container" onSubmit={iniciarSesion}>
              <label>
                Usuario:
                <input
                  type="text"
                  value={loginUsuario}
                  onChange={(e) => setLoginUsuario(e.target.value)}
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
          </>
        )}

        {/* VISTA "MI CUENTA" CON PESTAÑAS */}
        {vista === "miCuenta" && loginExitoso && (
          <>
            <h1>Mi cuenta ({usuarioData.usuario})</h1>

            {/* Controles de Navegación (Tabs) */}
            <div className="mi-cuenta-tabs">
              <button
                className={vistaMiCuenta === "datos" ? "tab-activo" : ""}
                onClick={() => setVistaMiCuenta("datos")}
              >
                Modificar datos
              </button>
              <button
                className={vistaMiCuenta === "historial" ? "tab-activo" : ""}
                onClick={() => {
                  setVistaMiCuenta("historial");
                  obtenerHistorialInversiones(); // Cargar historial al hacer clic
                }}
              >
                Historial de Simulaciones
              </button>
            </div>

            {/* Contenido de Modificar Datos */}
            {vistaMiCuenta === "datos" && (
              <form className="form-container" onSubmit={actualizarDatos}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={usuarioData.nombre}
                    onChange={(e) =>
                      setUsuarioData({ ...usuarioData, nombre: e.target.value })
                    }
                  />
                </label>
                <label>
                  Apellido:
                  <input
                    type="text"
                    value={usuarioData.apellido}
                    onChange={(e) =>
                      setUsuarioData({
                        ...usuarioData,
                        apellido: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={usuarioData.email}
                    onChange={(e) =>
                      setUsuarioData({ ...usuarioData, email: e.target.value })
                    }
                  />
                </label>
                <label>
                  Teléfono:
                  <input
                    type="text"
                    value={usuarioData.telefono}
                    onChange={(e) =>
                      setUsuarioData({
                        ...usuarioData,
                        telefono: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  País de residencia:
                  <input
                    type="text"
                    value={usuarioData.pais}
                    onChange={(e) =>
                      setUsuarioData({ ...usuarioData, pais: e.target.value })
                    }
                  />
                </label>
                <button type="submit">Actualizar datos</button>
              </form>
            )}

            {/* Contenido de Historial de Simulaciones */}
            {vistaMiCuenta === "historial" && (
              <div className="historial-container">
                <h2>Mis Simulaciones</h2>
                {historialInversiones.length === 0 ? (
                  <p>
                    Aún no tienes simulaciones registradas. ¡Realiza una
                    simulación para ver tu historial!
                  </p>
                ) : (
                  <table className="inversiones-tabla">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Monto Inicial</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historialInversiones.map((inv) => (
                        <tr key={inv.Id_Inversiones}>
                          <td>{inv.Id_Inversiones}</td>
                          <td>
                            {inv.Id_Tipo === 1
                              ? "Simulación Web"
                              : "ID " + inv.Id_Tipo}
                          </td>
                          <td>${parseFloat(inv.Monto_Inicial).toFixed(2)}</td>
                          <td>{inv.Fecha_Inicio}</td>
                          <td>{inv.Fecha_Fin || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
