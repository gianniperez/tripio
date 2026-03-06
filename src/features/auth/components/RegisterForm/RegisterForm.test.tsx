import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RegisterForm } from "./RegisterForm";

describe("RegisterForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<RegisterForm />);
    expect(container).toBeInTheDocument();
  });
});
