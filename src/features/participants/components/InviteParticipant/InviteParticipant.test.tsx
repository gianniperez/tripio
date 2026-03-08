import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InviteParticipant } from "./InviteParticipant";

describe("InviteParticipant Component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <InviteParticipant onInvite={vi.fn()} isInviting={false} />,
    );
    expect(container).toBeInTheDocument();
  });
});
