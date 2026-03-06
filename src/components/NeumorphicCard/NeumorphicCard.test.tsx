import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NeumorphicCard } from "./NeumorphicCard";

describe("NeumorphicCard Component", () => {
  it("renders correctly", () => {
    const { container } = render(<NeumorphicCard>Test</NeumorphicCard>);
    expect(container).toBeInTheDocument();
  });
});
