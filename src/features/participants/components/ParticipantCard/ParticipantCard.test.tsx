import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ParticipantCard } from "./ParticipantCard";
import { Participant } from "@/types/tripio";
import { Timestamp } from "firebase/firestore";

describe("ParticipantCard Component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ParticipantCard
        participant={
          {
            id: "test",
            uid: "test",
            role: "viewer",
            joinedAt: Timestamp.now(),
            budgetLimit: 0,
            invitedBy: "system",
          } as Participant
        }
        isCurrentUser={false}
        canManage={true}
        onUpdateRole={vi.fn()}
        onUpdatePermissions={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
