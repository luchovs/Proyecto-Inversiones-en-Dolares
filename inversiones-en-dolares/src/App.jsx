import './App.css'

function App() {
  return (
    <div>
      <h1>Simulador de Inversiones en Dólares</h1>

      <div className="cuadro">
        <form>
          <div>
            <label>Monto en dólares:</label><br />
            <input type="number" />
          </div>

          <div>
            <label>Tiempo (meses):</label><br />
            <input type="number" />
          </div>

          <div>
            <label>Interés anual (%):</label><br />
            <input type="number" />
          </div>

          <button type="button">Calcular</button>
        </form>
      </div>
    </div>
  )
}

export default App