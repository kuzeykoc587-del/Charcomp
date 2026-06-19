export type UserRole = "ADMIN" | "MODERATOR" | "VERIFIED_USER" | "MEMBER" | "NEW_MEMBER";

export interface RoleInfo {
  role: UserRole;
  isAdmin: boolean;
  isModerator: boolean;
  isVerifiedUser: boolean;
  isMember: boolean;
  isNewMember: boolean;
  canBypassLimits: boolean;
  canModerate: boolean;
  dailyTestLimit: number;
  testLimit: number;
  universeLimit: number;
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
  if (firestoreRole === "VERIFIED_USER") return "VERIFIED_USER";

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
  const isVerifiedUser = role === "VERIFIED_USER";
  const isMember = role === "MEMBER" || isVerifiedUser || isModerator;
  const isNewMember = role === "NEW_MEMBER";
  const canBypassLimits = isAdmin || isModerator;
  const canModerate = isModerator;

  const dailyTestLimit = canBypassLimits ? Infinity : isNewMember ? 2 : 5;

  let testLimit: number;
  let universeLimit: number;
  if (canBypassLimits) {
    testLimit = Infinity;
    universeLimit = Infinity;
  } else if (isVerifiedUser) {
    testLimit = 10;
    universeLimit = 10;
  } else if (isMember) {
    testLimit = 6;
    universeLimit = 6;
  } else {
    testLimit = 4;
    universeLimit = 4;
  }

  return {
    role,
    isAdmin,
    isModerator,
    isVerifiedUser,
    isMember,
    isNewMember,
    canBypassLimits,
    canModerate,
    dailyTestLimit,
    testLimit,
    universeLimit,
  };
}
