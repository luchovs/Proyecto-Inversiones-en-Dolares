import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";
jest.spyOn(window, "alert").mockImplementation(() => {});
global.fetch = jest.fn((url) => {
  if (url.includes("dolarapi.com")) {
    return Promise.resolve({
      json: () => Promise.resolve({ compra: 1, venta: 1 }),
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

test("Simulación muestra alerta y no llama al registro si no está logueado", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("Simulación"));
  fireEvent.change(screen.getByLabelText(/Monto en dólares:/i), {
    target: { value: "100" },
  });
  fireEvent.change(screen.getByLabelText(/Tiempo \(días\):/i), {
    target: { value: "10" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Calcular" }));
  expect(window.alert).toHaveBeenCalledWith(
    "Simulación exitosa. Inicia sesión para registrar la simulación."
  );
  expect(global.fetch).not.toHaveBeenCalledWith(
    "http://127.0.0.1:8080/registrar_inversion",
    expect.anything()
  );
});
