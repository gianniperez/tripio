import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VerifyEmailForm } from "./VerifyEmailForm";

describe("VerifyEmailForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<VerifyEmailForm />);
    expect(container).toBeInTheDocument();
  });
});
