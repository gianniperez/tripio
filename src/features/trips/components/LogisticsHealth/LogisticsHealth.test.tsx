import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LogisticsHealth } from "./LogisticsHealth";

describe("LogisticsHealth Component", () => {
  it("renders correctly", () => {
    const { container } = render(<LogisticsHealth />);
    expect(container).toBeInTheDocument();
  });
});
