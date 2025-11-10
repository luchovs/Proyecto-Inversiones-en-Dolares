import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

global.fetch = jest.fn((url, options) => {
  if (url.includes("/login")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ usuario: { id_inversionista: 40, rol: "usuario" } }),
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

test("Cerrar sesión cambia la navegación a estado no logueado", async () => {
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
  expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Cerrar sesión"));

  await waitFor(() => {
    expect(screen.queryByText("Mi cuenta")).not.toBeInTheDocument();
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
  });
});
