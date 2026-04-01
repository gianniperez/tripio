import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DebtSummary } from "./DebtSummary";

describe("DebtSummary Component", () => {
  it("renders correctly", () => {
    const { container } = render(<DebtSummary />);
    expect(container).toBeInTheDocument();
  });
});
