import Usuarios from "../src/Usuarios";
import { render, screen, waitFor } from "@testing-library/react";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          Id_Inversionista: 5,
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

describe("Componente Usuarios", () => {
  test("muestra los encabezados de la tabla si el usuario es admin", async () => {
    render(<Usuarios usuarioData={{ rol: "admin" }} />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Apellido")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Teléfono")).toBeInTheDocument();
    expect(screen.getByText("País")).toBeInTheDocument();
    expect(screen.getByText("Usuario")).toBeInTheDocument();
    expect(screen.getByText("Rol")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("Luciano")).toBeInTheDocument();
      expect(screen.getByText("Savia")).toBeInTheDocument();
      expect(screen.getByText("lucianosavia@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("1271428124")).toBeInTheDocument();
      expect(screen.getByText("Argentina")).toBeInTheDocument();
      expect(screen.getByText("user5")).toBeInTheDocument();
      expect(screen.getByText("usuario")).toBeInTheDocument();
      expect(screen.getByText("Acciones")).toBeInTheDocument();
    });
  });

  test("muestra mensaje si el usuario no es admin", () => {
    render(<Usuarios usuarioData={{ rol: "user" }} />);
    expect(
      screen.getByText(/No tenés permisos para ver esta sección/i)
    ).toBeInTheDocument();
  });
});
