import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NeumorphicButton } from "./NeumorphicButton";

describe("NeumorphicButton Component", () => {
  it("renders correctly", () => {
    const { container } = render(<NeumorphicButton>Test</NeumorphicButton>);
    expect(container).toBeInTheDocument();
  });
});
