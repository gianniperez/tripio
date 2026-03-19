import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AccommodationList } from "./AccommodationList";

describe("AccommodationList Component", () => {
  it("renders correctly", () => {
    const { container } = render(<AccommodationList {...({} as any)} />);
    expect(container).toBeInTheDocument();
  });
});
