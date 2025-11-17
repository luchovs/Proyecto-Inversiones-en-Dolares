import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";

window.alert = jest.fn();

global.fetch = jest.fn((url, options) => {
  if (url.includes("/dolar/oficial")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          compra: 100,
          venta: 105,
          fechaActualizacion: "2025-11-17",
        }),
    });
  }

  if (url.includes("/simular")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ resultado: "100.00" }),
    });
  }

  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

test("33. Navegación: Redirección a Conversión desde Simulación", async () => {
  render(<App />);

  fireEvent.click(screen.getByText("Simulación"));

  expect(
    screen.getByRole("heading", { name: /Simulador de Inversiones/i })
  ).toBeInTheDocument();

  const convertirButton = screen.getByRole("button", {
    name: /Hace la conversión acá!/i,
  });
  fireEvent.click(convertirButton);

  const conversionHeading = await screen.findByRole(
    "heading",
    { name: /Conversión a Dólares/i },
    { timeout: 1000 }
  );

  expect(conversionHeading).toBeInTheDocument();

  expect(
    screen.queryByRole("heading", { name: /Simulador de Inversiones/i })
  ).not.toBeInTheDocument();
});
