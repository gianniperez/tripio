import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BudgetProgressBar } from "./BudgetProgressBar";

describe("BudgetProgressBar Component", () => {
  it("renders correctly", () => {
    const { container } = render(<BudgetProgressBar />);
    expect(container).toBeInTheDocument();
  });
});
