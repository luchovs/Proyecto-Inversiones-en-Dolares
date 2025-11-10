import { render, screen, waitFor } from "@testing-library/react";
import Usuarios from "../src/Usuarios";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

test("La vista Usuarios se renderiza correctamente cuando no hay datos", async () => {
  render(<Usuarios usuarioData={{ rol: "admin" }} />);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith("http://127.0.0.1:8080/usuarios");
  });

  expect(
    screen.getByRole("columnheader", { name: "Nombre" })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /Editar|Eliminar/i })
  ).not.toBeInTheDocument();
});
