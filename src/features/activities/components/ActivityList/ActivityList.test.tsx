import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ActivityList } from "./ActivityList";

describe("ActivityList Component", () => {
  it("renders correctly", () => {
    const { container } = render(<ActivityList {...({} as any)} />);
    expect(container).toBeInTheDocument();
  });
});
