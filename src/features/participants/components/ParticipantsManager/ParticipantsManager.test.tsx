import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ParticipantsManager } from "./ParticipantsManager";

describe("ParticipantsManager Component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ParticipantsManager
        participants={[]}
        currentUserId="123"
        onUpdateRole={vi.fn()}
        onUpdatePermissions={vi.fn()}
        onRemoveParticipant={vi.fn()}
        onInviteParticipant={vi.fn()}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
