import { Participant, User } from "@/types/models";

export type ParticipantWithUser = Participant & Pick<User, "displayName" | "photoURL" | "email">;
