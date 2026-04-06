import { Timestamp } from "firebase/firestore";

export type Role = "owner" | "admin" | "collaborator" | "viewer";

export interface User {
  id: string; // Firebase Auth UID
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp | Date;
}

export interface CustomPermissions {
  edit_itinerary?: boolean;
  create_proposal?: boolean;
  vote_proposal?: boolean;
  manage_logistics?: boolean;
  manage_participants?: boolean;
}

export interface Participant {
  id: string; // Auth UID
  role: Role;
  budgetLimit: number | null;
  joinedAt: Timestamp | Date;
  invitedBy: string;
  customPermissions: CustomPermissions;
}

export interface Trip {
  id: string;
  name: string;
  description: string | null;
  startDate: (Timestamp | Date) | null;
  endDate: (Timestamp | Date) | null;
  status: "planning" | "active" | "archived";
  dailyBudget: number | null;
  currency: string;
  coverImage: string | null;
  createdBy: string;
  participantIds: string[]; // Denormalized for easier querying in MVP
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type CategoryCost =
  | "accommodation"
  | "transport"
  | "food"
  | "general"
  | "health"
  | "equipment"
  | "activity"
  | "other";

export interface Cost {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: Timestamp | Date;
  category: CategoryCost;
  paidBy: Record<string, number>; // Record<uid, amount>
  splitTo: Record<string, number>; // Record<uid, amount>
  linkedTo: string | null;
  linkedType: "activity" | "accommodation" | "transport" | "inventory" | null;
  createdBy: string;
  createdAt: Timestamp | Date;
}

// ============== LOGISTICS & ACTIVITIES ==============

export interface BaseProposal {
  id: string;
  votes: Record<string, string>; // Record<uid, 'yes'|'no'|etc>
  createdBy: string;
  createdAt: Timestamp | Date;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: (Timestamp | Date) | null;
  startTime: (Timestamp | Date) | null;
  endTime: (Timestamp | Date) | null;
  location: string | null;
  locationUrl: string | null;
  category: string;
  costImpact: number | null;
  rsvp: Record<string, boolean>;
  linkedProposalId: string | null;
  createdBy: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface ActivityProposal extends BaseProposal {
  title: string;
  description: string | null;
  date: Timestamp | Date | null;
  costImpact: number | null;
  locationUrl: string | null;
}

export interface Accommodation {
  title: string;
  description: string | null;
  location: string | null;
  checkIn: Timestamp | Date;
  checkOut: Timestamp | Date;
  priceEstimate: number | null;
}


export interface AccommodationProposal extends Accommodation, BaseProposal {}

export interface AccommodationConfirmed extends Accommodation {
  id: string;
  createdBy: string;
  createdAt: Timestamp | Date;
}

export interface Transport {
  type: "car" | "flight" | "bus" | "train" | "other";
  title: string;
  departure: Timestamp | Date;
  arrival: Timestamp | Date;
  isPersonal: boolean;
  priceEstimate: number | null;
  description: string | null;
}


export interface TransportProposal extends Transport, BaseProposal {}

export interface TransportConfirmed extends Transport {
  id: string;
  capacity: number;
  passengers: string[]; // List of UIDs
  createdBy: string;
  createdAt: Timestamp | Date;
}

export interface InventoryItem {
  title: string;
  description: string | null;
  category: "general" | "electronica" | "salud" | "comida" | "documentacion" | "equipo" | "other";
  quantity: number;
  priceEstimate: number | null;
}



export interface InventoryProposal extends InventoryItem, BaseProposal {}

export interface InventoryConfirmed extends InventoryItem {
  id: string;
  status: "needed" | "assigned" | "done";
  assignedTo: string | null;
  createdBy: string;
  createdAt: Timestamp | Date;
}
