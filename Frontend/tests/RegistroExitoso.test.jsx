import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

jest.spyOn(window, "alert").mockImplementation(() => {});

global.fetch = jest.fn((url, options) => {
  if (url.includes("/registro")) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

test("Registro exitoso muestra mensaje de éxito y mantiene la vista de registro", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("Regístrate"));

  fireEvent.change(screen.getByLabelText("Nombre:"), {
    target: { value: "Miguel" },
  });
  fireEvent.change(screen.getByLabelText("Apellido:"), {
    target: { value: "Diaz" },
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
    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8080/registro",
      expect.objectContaining({ method: "POST" })
    );
    expect(
      screen.getByText("Inversionista registrado con éxito")
    ).toBeInTheDocument();
  });

  expect(
    screen.getByRole("heading", { name: "Registro de Inversionista" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Registrarse" })
  ).toBeInTheDocument();

  jest.restoreAllMocks();
});
