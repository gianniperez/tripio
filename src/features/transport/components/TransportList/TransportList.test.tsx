import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TransportList } from "./TransportList";

describe("TransportList Component", () => {
  it("renders correctly", () => {
    const { container } = render(<TransportList {...({} as any)} />);
    expect(container).toBeInTheDocument();
  });
});
