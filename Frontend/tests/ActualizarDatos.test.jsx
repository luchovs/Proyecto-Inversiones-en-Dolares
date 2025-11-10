import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

jest.spyOn(window, "alert").mockImplementation(() => {});
global.fetch = jest.fn((url, options) => {
  if (url.includes("/login")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          usuario: { id_inversionista: 20, rol: "usuario", nombre: "Inicial" },
        }),
    });
  }
  if (url.includes("/editar_usuario")) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

test("Mi Cuenta: El botón 'Actualizar datos' llama al endpoint PUT con los datos modificados", async () => {
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
  const inputNombre = screen.getByLabelText("Nombre:");
  fireEvent.change(inputNombre, { target: { value: "NombreNuevo" } });
  fireEvent.click(screen.getByRole("button", { name: "Actualizar datos" }));
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8080/editar_usuario",
      expect.objectContaining({
        method: "PUT",
        body: expect.stringContaining(`"nombre":"NombreNuevo"`),
      })
    );
  });
  expect(window.alert).toHaveBeenCalledWith("Datos actualizados correctamente");
  jest.restoreAllMocks();
});
