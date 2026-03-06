import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoginForm } from "./LoginForm";

describe("LoginForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<LoginForm />);
    expect(container).toBeInTheDocument();
  });
});
