export const ROLES = [
  "ADMIN",
  "MANAGEMENT",
  "KITCHEN_STAFF",
  "VIEWER",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  MANAGEMENT: "Management",
  KITCHEN_STAFF: "Kitchen staff",
  VIEWER: "Viewer",
};

// Safe to send to the browser. Never includes the password hash.
export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
};

export type WorkspaceSettings = {
  workspaceName: string;
  prepRemindersEnabled: boolean;
  requirePoApproval: boolean;
};
