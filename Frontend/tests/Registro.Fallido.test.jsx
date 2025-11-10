import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

jest.spyOn(window, "alert").mockImplementation(() => {});
global.fetch = jest.fn((url) => {
  if (url.includes("/registro")) {
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: "El usuario ya existe" }),
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

test("Registro fallido: Muestra el mensaje de error del backend", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("Regístrate"));

  fireEvent.change(screen.getByLabelText("Nombre:"), {
    target: { value: "Miguel" },
  });
  fireEvent.change(screen.getByLabelText("Apellido:"), {
    target: { value: "Díaz" },
  });
  fireEvent.change(screen.getByLabelText("Email:"), {
    target: { value: "migueldiaz@gmail.com" },
  });
  fireEvent.change(screen.getByLabelText("País de residencia:"), {
    target: { value: "Argentina" },
  });
  fireEvent.change(screen.getByLabelText("Nombre de Usuario:"), {
    target: { value: "migueldiaz" },
  });
  fireEvent.change(screen.getByLabelText("Contraseña:"), {
    target: { value: "1234" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Error: El usuario ya existe");
  });
});
