import { render, screen } from "@testing-library/react";
import Usuarios from "../src/Usuarios";

describe("Componente Usuarios", () => {
  test("no muestra el botón de 'Usuarios' si el usuario no es admin", () => {
    render(<Usuarios usuarioData={{ rol: "user" }} />);
    // Verifica que el botón 'Usuarios' no esté presente
    expect(screen.queryByText("Usuarios")).not.toBeInTheDocument();
  });

  test("muestra el panel si el usuario es admin", () => {
    render(<Usuarios usuarioData={{ rol: "admin" }} />);
    expect(screen.getByText("Panel de Administración")).toBeInTheDocument();
  });
});
