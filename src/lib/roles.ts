export type UserRole = "ADMIN" | "MODERATOR" | "MEMBER" | "NEW_MEMBER";

export interface RoleInfo {
  role: UserRole;
  isAdmin: boolean;
  isModerator: boolean;
  isMember: boolean;
  isNewMember: boolean;
  canBypassLimits: boolean;
  canModerate: boolean;
  dailyTestLimit: number;
}

function getAdminEmails(): string[] {
  const raw = (import.meta.env.VITE_ADMIN_EMAILS as string) ?? "";
  return raw
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
}

function getAdminUids(): string[] {
  const raw = (import.meta.env.VITE_ADMIN_UIDS as string) ?? "";
  return raw
    .split(",")
    .map((u: string) => u.trim())
    .filter(Boolean);
}

export function checkIsAdmin(uid: string | null | undefined, email: string | null | undefined, firestoreRole?: string): boolean {
  if (firestoreRole === "ADMIN") return true;
  if (uid) {
    const adminUids = getAdminUids();
    if (adminUids.includes(uid)) return true;
  }
  if (email) {
    const adminEmails = getAdminEmails();
    if (adminEmails.includes(email.trim().toLowerCase())) return true;
  }
  return false;
}

export function checkIsModerator(uid: string | null | undefined, email: string | null | undefined, firestoreRole?: string): boolean {
  if (checkIsAdmin(uid, email, firestoreRole)) return true;
  if (firestoreRole === "MODERATOR") return true;
  return false;
}

export function resolveRole(
  uid: string | null | undefined,
  email: string | null | undefined,
  createdAt: string | null | undefined,
  firestoreRole?: string
): UserRole {
  if (checkIsAdmin(uid, email, firestoreRole)) return "ADMIN";
  if (firestoreRole === "MODERATOR") return "MODERATOR";

  if (createdAt) {
    const created = new Date(createdAt);
    const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) return "NEW_MEMBER";
  }

  return "MEMBER";
}

export function getRoleInfo(role: UserRole): RoleInfo {
  const isAdmin = role === "ADMIN";
  const isModerator = role === "MODERATOR" || isAdmin;
  const isMember = role === "MEMBER" || isModerator;
  const isNewMember = role === "NEW_MEMBER";
  const canBypassLimits = isAdmin || isModerator;
  const canModerate = isModerator;

  const dailyTestLimit = canBypassLimits ? Infinity : isNewMember ? 2 : 5;

  return {
    role,
    isAdmin,
    isModerator,
    isMember,
    isNewMember,
    canBypassLimits,
    canModerate,
    dailyTestLimit,
  };
}
