import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Icon } from "./Icon";

describe("Icon Component", () => {
  it("renders correctly", () => {
    const { container } = render(<Icon name="home" />);
    expect(container).toBeInTheDocument();
  });
});
