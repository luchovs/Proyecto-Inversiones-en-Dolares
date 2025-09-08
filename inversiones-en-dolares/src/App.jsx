import { useState } from "react"
import "./App.css"

function App() {
  const [monto, setMonto] = useState("")
  const [dias, setDias] = useState("")
  const [resultado, setResultado] = useState("")

  const interesAnual = 0.05

  function calcular() {
    let P = Number(monto)
    let d = Number(dias)

    if (P > 0 && d > 0) {
      let A = P * Math.pow(1 + interesAnual / 365, d)
      setResultado("Al final tendrás: $" + A.toFixed(2))
    } else {
      setResultado("Por favor completa todos los campos")
    }
  }

  return (
    <div className="contenedor">
      <h1>Simulador de Inversiones</h1>

      <div className="cuadro">
        <label>Monto en dólares:</label>
        <input
          type="number"
          placeholder="Ej: 1000"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <label>Tiempo (días):</label>
        <input
          type="number"
          placeholder="Minimo: 30 maximo: 365"
          value={dias}
          onChange={(e) => setDias(e.target.value)}
        />

        <button onClick={calcular}>Calcular</button>

        {resultado && <p className="resultado">{resultado}</p>}
      </div>
    </div>
  )
}

export default App
