import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CostForm } from "./CostForm";

describe("CostForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<CostForm />);
    expect(container).toBeInTheDocument();
  });
});
