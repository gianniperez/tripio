import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CreateTripForm } from "./CreateTripForm";

describe("CreateTripForm Component", () => {
  it("renders correctly", () => {
    const { container } = render(<CreateTripForm />);
    expect(container).toBeInTheDocument();
  });
});
