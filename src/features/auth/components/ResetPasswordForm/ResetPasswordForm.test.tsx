import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResetPasswordForm } from "./ResetPasswordForm";

describe("ResetPasswordForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<ResetPasswordForm />);
    expect(container).toBeInTheDocument();
  });
});
