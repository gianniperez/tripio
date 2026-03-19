import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AccommodationCard } from "./AccommodationCard";

describe("AccommodationCard Component", () => {
  it("renders correctly", () => {
    const { container } = render(<AccommodationCard {...({} as any)} />);
    expect(container).toBeInTheDocument();
  });
});
