import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Usuarios from "../src/Usuarios";

global.fetch = jest.fn((url, options) => {
  if (url.includes("/usuarios") && (!options || options.method === "GET")) {
    return Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            Id_Inversionista: 99,
            Nombre: "UserDelete",
            Email: "test@del.com",
            Rol: "usuario",
          },
        ]),
    });
  }
  if (url.includes("/usuarios/99") && options.method === "DELETE") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "Eliminado" }),
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

jest.spyOn(window, "alert").mockImplementation(() => {});
jest.spyOn(window, "confirm").mockImplementation(() => true);

test("El botón Eliminar dispara la solicitud DELETE con el ID correcto", async () => {
  render(<Usuarios usuarioData={{ rol: "admin" }} />);
  const eliminarButton = await screen.findByRole("button", {
    name: "Eliminar",
  });

  fireEvent.click(eliminarButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8080/usuarios/99",
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });
  expect(window.confirm).toHaveBeenCalledWith(
    expect.stringContaining("Seguro que querés eliminar este usuario")
  );

  jest.restoreAllMocks();
});
