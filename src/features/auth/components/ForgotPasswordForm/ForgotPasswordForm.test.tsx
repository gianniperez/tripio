import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

describe("ForgotPasswordForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<ForgotPasswordForm />);
    expect(container).toBeInTheDocument();
  });
});
