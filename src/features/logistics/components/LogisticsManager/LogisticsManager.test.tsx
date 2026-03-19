import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LogisticsManager } from "./LogisticsManager";
import { Proposal } from "@/features/proposals";

describe("LogisticsManager Component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <LogisticsManager
        tripId={""}
        trip={{} as any}
        user={null}
        isAdmin={false}
        onEdit={function (proposal: Proposal): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
