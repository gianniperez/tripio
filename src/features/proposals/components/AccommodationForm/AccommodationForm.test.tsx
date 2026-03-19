import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AccommodationForm } from "./AccommodationForm";

describe("AccommodationForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<AccommodationForm tripId="test" trip={{} as any} onSubmit={() => {}} />);
    expect(container).toBeInTheDocument();
  });
});
