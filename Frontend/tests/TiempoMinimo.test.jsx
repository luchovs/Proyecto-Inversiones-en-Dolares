import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

global.fetch = jest.fn((url, options) => {
  if (url.includes("/dolar/oficial")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          compra: 1375,
          venta: 1425,
          fechaActualizacion: "2025-11-17",
        }),
    });
  }

  if (url.includes("/simular")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ resultado: "Debería Fallar" }),
    });
  }

  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});
window.alert = jest.fn();

test("31. Simulación: Validación de Tiempo Mínimo (Días < 30)", async () => {
  render(<App />);

  fireEvent.click(screen.getByText("Simulación"));

  const calcularButton = screen.getByRole("button", { name: /Calcular/i });

  fireEvent.change(screen.getByLabelText(/Monto en dólares/i), {
    target: { value: "100" },
  });
  fireEvent.change(screen.getByLabelText(/Tiempo \(días\)/i), {
    target: { value: "29" },
  });

  const initialSimulateCalls = global.fetch.mock.calls.filter((call) =>
    call[0].includes("/simular")
  ).length;

  fireEvent.click(calcularButton);

  await waitFor(
    () => {
      const currentSimulateCalls = global.fetch.mock.calls.filter((call) =>
        call[0].includes("/simular")
      ).length;
      expect(currentSimulateCalls).toBe(initialSimulateCalls);
    },
    { timeout: 1500 }
  );
});
