import { render, screen } from "@testing-library/react";
import Usuarios from "../src/Usuarios";

// Simula la respuesta de la API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          Id_Inversionista: 1,
          Nombre: "Luciano",
          Apellido: "Savia",
          Email: "lucianosavia@gmail.com",
          Telefono: "1271428124",
          Pais_Residencia: "Argentina",
          Usuario: "user5",
          Rol: "usuario",
        },
      ]),
  })
);

test("muestra los botones de Editar y Eliminar para admin", async () => {
  render(<Usuarios usuarioData={{ rol: "admin" }} />);

  expect(
    await screen.findByRole("button", { name: "Editar" })
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: "Eliminar" })
  ).toBeInTheDocument();
});
