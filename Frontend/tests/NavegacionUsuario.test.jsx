import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

global.fetch = jest.fn((url, options) => {
  if (url.includes("/login")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          token: "fake-token",
          usuario: { nombre: "PersistUser" },
        }),
    });
  }
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
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

window.alert = jest.fn();

test("5. Navegación Post-Login: El estado de usuario se mantiene entre vistas", async () => {
  render(<App />);

  expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Iniciar sesión"));

  fireEvent.change(screen.getByLabelText(/Usuario:/i), {
    target: { value: "PersistUser" },
  });
  fireEvent.change(screen.getByLabelText(/Contraseña:/i), {
    target: { value: "password" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

  await waitFor(
    () => {
      expect(screen.queryByText("Iniciar sesión")).not.toBeInTheDocument();
      expect(screen.getByText("Mi cuenta")).toBeInTheDocument();
      expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
    },
    { timeout: 2000 }
  );

  fireEvent.click(screen.getByText("Simulación"));

  expect(screen.getByText("Mi cuenta")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Inicio"));
  expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();

  jest.restoreAllMocks();
});
