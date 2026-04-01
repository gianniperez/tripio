import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TripCard } from "./TripCard";

describe("TripCard Component", () => {
  it("renders correctly", () => {
    const { container } = render(<TripCard />);
    expect(container).toBeInTheDocument();
  });
});
