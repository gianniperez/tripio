import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TransportForm } from "./TransportForm";

describe("TransportForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<TransportForm tripId="test" trip={{} as any} onSubmit={() => {}} />);
    expect(container).toBeInTheDocument();
  });
});
