import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

global.fetch = jest.fn((url, options) => {
  if (url.includes("/login")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ usuario: { id_inversionista: 50, rol: "usuario" } }),
    });
  }
  if (url.includes("/inversiones/")) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

test("Mi Cuenta navega entre las pestañas 'datos' y 'historial'", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("Iniciar sesión"));
  fireEvent.change(screen.getByLabelText("Usuario:"), {
    target: { value: "testuser" },
  });
  fireEvent.change(screen.getByLabelText("Contraseña:"), {
    target: { value: "password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
  await screen.findByText("Mi cuenta");

  fireEvent.click(screen.getByText("Mi cuenta"));

  expect(screen.getByLabelText("Nombre:")).toBeInTheDocument();
  expect(screen.queryByText("Mis Simulaciones")).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Historial de Simulaciones" })
  );

  await screen.findByText("Mis Simulaciones");
  expect(
    screen.getByText(/Aún no tienes simulaciones registradas./i)
  ).toBeInTheDocument();
  expect(screen.queryByLabelText("Nombre:")).not.toBeInTheDocument();
});
