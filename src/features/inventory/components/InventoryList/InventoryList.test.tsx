import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InventoryList } from "./InventoryList";

describe("InventoryList Component", () => {
  it("renders correctly", () => {
    const { container } = render(<InventoryList {...({} as any)} />);
    expect(container).toBeInTheDocument();
  });
});
