import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ParticipantsPanel } from "./ParticipantsPanel";

describe("ParticipantsPanel Component", () => {
  it("renders correctly", () => {
    const { container } = render(<ParticipantsPanel />);
    expect(container).toBeInTheDocument();
  });
});
