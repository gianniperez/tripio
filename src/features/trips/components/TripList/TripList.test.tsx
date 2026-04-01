import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TripList } from "./TripList";

describe("TripList Component", () => {
  it("renders correctly", () => {
    const { container } = render(<TripList />);
    expect(container).toBeInTheDocument();
  });
});
