import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InventoryCard } from "./InventoryCard";

describe("InventoryCard Component", () => {
  it("renders correctly", () => {
    const { container } = render(<InventoryCard {...({} as any)} />);
    expect(container).toBeInTheDocument();
  });
});
