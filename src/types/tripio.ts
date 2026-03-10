import type { Timestamp } from "firebase/firestore";

// --- Enums & Derived Types ---
export type TripRole = "owner" | "admin" | "collaborator" | "viewer";
export type TripStatus = "planning" | "active" | "archived";
export type EventCategory =
  | "accommodation"
  | "transport"
  | "activity"
  | "inventory";
export type ProposalType =
  | "accommodation"
  | "transport"
  | "activity"
  | "inventory";
export type ProposalStatus = "draft" | "voted" | "confirmed" | "rejected";
export type InventoryStatus = "needed" | "assigned" | "confirmed";
export type TaskStatus = "pending" | "in-progress" | "done";
export type TransportType = "car" | "bus" | "plane" | "other";
export type LinkedToType = "event" | "inventory";
export type TripPermission =
  | "edit_itinerary"
  | "create_proposal"
  | "vote_proposal"
  | "manage_logistics"
  | "view_finances"
  | "manage_participants";

// --- 8.2 Colección: users ---
export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp;
}

// --- 8.3 Colección: trips ---
export interface Trip {
  id: string;
  name: string;
  destination: string | null;
  description: string | null;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  status: TripStatus;
  currency: string;
  coverImage: string | null;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Participant {
  id: string; // Document ID de Firestore (UID del usuario)
  uid: string; // UID del usuario para búsquedas collectionGroup
  role: TripRole;
  budgetLimit: number | null;
  joinedAt: Timestamp;
  invitedBy: string;
  invitationToken?: string; // Token con el que se unió (opcional)
  // Overrides: Permisos específicos que rompen la jerarquía del rol
  customPermissions?: Partial<Record<TripPermission, boolean>>;
}

// --- Invitaciones (Colección raíz) ---
export interface Invitation {
  id: string; // Token único (ID del documento)
  tripId: string;
  tripName: string;
  role: TripRole;
  invitedByToken: string; // UID de quien generó el link
  invitedByName: string; // Nombre de quien generó el link
  createdAt: Timestamp;
  expiresAt: Timestamp;
  usedBy?: string; // UID del usuario que la usó (si aplica)
  status: "pending" | "accepted" | "expired";
}

// --- 8.5 Subcolección: events ---
export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: Timestamp;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  location: string | null;
  locationUrl: string | null;
  category: EventCategory;
  costImpact: number | null;
  rsvp: Record<string, string>; // userId -> "si" | "no" | "maybe"
  optionVotes?: Record<string, string[]>; // optionLabel -> userIds
  linkedProposalId: string | null;
  createdBy: string;
  createdAt: Timestamp;
}

// --- 8.6 Subcolección: proposals ---
export interface Proposal {
  id: string;
  title: string;
  description: string | null;
  type: ProposalType;
  status: ProposalStatus;
  location: string | null;
  locationUrl: string | null;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  estimatedCost: number | null;
  accessible: boolean;
  referenceUrl: string | null;
  transportType?: "personal" | "public" | null;
  capacity?: number | null;
  quantity?: number | null;
  votes: Record<string, string>; // userId -> "si" | "no" | "maybe"
  options: string[] | null;
  optionVotes: Record<string, string[]>; // optionLabel -> userIds
  deadline: Timestamp | null;
  linkedEventId: string | null;
  createdBy: string;
  createdAt: Timestamp;
}

// --- 8.7 Subcolección: costs ---
export interface Cost {
  id: string;
  description: string;
  amount: number;
  category: EventCategory;
  linkedEventId: string | null;
  linkedProposalId: string | null;
  costType: "total" | "per_person";
  splitType: "equal" | "custom";
  customSplit?: Record<string, number>;
  createdBy: string;
  createdAt: Timestamp;
}

// --- 8.8 Subcolección: inventory ---
export interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  quantity: number | null;
  detail: string | null;
  assignedTo: string | null; // UID del responsable
  status: InventoryStatus;
  linkedTaskId: string | null;
  createdBy: string;
  createdAt: Timestamp;
}

// --- 8.9 Subcolección: tasks ---
export interface Task {
  id: string;
  title: string;
  description: string | null;
  assignee: string | null; // UID del responsable
  status: TaskStatus;
  dueDate: Timestamp | null;
  linkedToType: LinkedToType | null;
  linkedToId: string | null; // ID del evento o ítem
  createdBy: string;
  createdAt: Timestamp;
}

// --- 8.10 Subcolección: transport ---
export interface Transport {
  id: string;
  name: string; // ej. "Auto Pedro"
  type: "personal" | "public";
  capacity: number;
  passengers: string[]; // UIDs
  owner: string | null; // UID del dueño
  createdBy: string;
  createdAt: Timestamp;
}

// --- 8.11 Subcolección: accommodations ---
export interface Accommodation {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  locationUrl: string | null;
  checkIn: Timestamp | null;
  checkOut: Timestamp | null;
  cost: number | null;
  createdBy: string;
  createdAt: Timestamp;
}
