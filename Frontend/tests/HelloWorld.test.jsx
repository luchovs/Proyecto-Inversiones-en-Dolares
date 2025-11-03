import { render, screen } from "@testing-library/react";
import HelloWorld from "../src/components/HelloWorld";

test("renders HelloWorld with name", () => {
  render(<HelloWorld name="Joaquin" />);
  expect(screen.getByText("Hello, Joaquin!")).toBeInTheDocument();
});
