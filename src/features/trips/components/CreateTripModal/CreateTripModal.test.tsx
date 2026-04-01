import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CreateTripModal } from "./CreateTripModal";

describe("CreateTripModal Component", () => {
  it("renders correctly", () => {
    const { container } = render(<CreateTripModal />);
    expect(container).toBeInTheDocument();
  });
});
