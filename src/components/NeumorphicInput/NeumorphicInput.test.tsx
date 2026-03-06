import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NeumorphicInput } from "./NeumorphicInput";

describe("NeumorphicInput Component", () => {
  it("renders correctly", () => {
    const { container } = render(<NeumorphicInput />);
    expect(container).toBeInTheDocument();
  });
});
