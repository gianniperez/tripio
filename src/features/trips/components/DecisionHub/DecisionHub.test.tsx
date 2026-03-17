import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DecisionHub } from "./DecisionHub";

describe("DecisionHub Component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <DecisionHub
        tripId="test-trip"
        count={5}
        categories={{ activity: 2, logistics: 2, inventory: 1 }}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
