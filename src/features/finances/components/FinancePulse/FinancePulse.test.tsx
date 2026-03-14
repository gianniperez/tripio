import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FinancePulse } from "./FinancePulse";

describe("FinancePulse Component", () => {
  it("renders correctly", () => {
    const { container } = render(<FinancePulse />);
    expect(container).toBeInTheDocument();
  });
});
