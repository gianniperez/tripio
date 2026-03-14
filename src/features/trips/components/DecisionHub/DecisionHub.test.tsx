import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DecisionHub } from "./DecisionHub";

describe("DecisionHub Component", () => {
  it("renders correctly", () => {
    const { container } = render(<DecisionHub />);
    expect(container).toBeInTheDocument();
  });
});
