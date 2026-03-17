import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CountdownWeather } from "./CountdownWeather";

describe("CountdownWeather Component", () => {
  it("renders correctly", () => {
    const { container } = render(<CountdownWeather startDate={new Date()} />);
    expect(container).toBeInTheDocument();
  });
});
