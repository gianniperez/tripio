import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TransportCard } from "./TransportCard";

describe("TransportCard Component", () => {
  it("renders correctly", () => {
    const { container } = render(<TransportCard {...({} as any)} />);
    expect(container).toBeInTheDocument();
  });
});
