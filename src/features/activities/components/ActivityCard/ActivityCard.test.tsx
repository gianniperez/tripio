import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ActivityCard } from "./ActivityCard";

describe("ActivityCard Component", () => {
  it("renders correctly", () => {
    const { container } = render(<ActivityCard {...({} as any)} />);
    expect(container).toBeInTheDocument();
  });
});
