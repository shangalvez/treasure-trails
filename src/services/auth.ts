import { getUser, handleAuthCallback, login, logout, signup } from "@netlify/identity";
import type { SessionUser } from "../types";

type IdentityPayload = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string | null;
  };
};

function mapUser(user: IdentityPayload | null): SessionUser | null {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata?.full_name ?? user.email ?? null,
  };
}

function normaliseAuthError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Authentication is unavailable right now.";
}

export async function initializeIdentity() {
  try {
    await handleAuthCallback();
  } catch {
    // Ignore callback parsing failures and continue with the current session lookup.
  }

  try {
    const currentUser = (await getUser()) as IdentityPayload | null;
    return {
      user: mapUser(currentUser),
      identityEnabled: true,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      identityEnabled: false,
      error: normaliseAuthError(error),
    };
  }
}

export async function loginWithIdentity(email: string, password: string): Promise<SessionUser> {
  const user = (await login(email, password)) as IdentityPayload;
  return mapUser(user)!;
}

export async function signupWithIdentity(email: string, password: string, fullName: string): Promise<SessionUser> {
  const user = (await signup(email, password, { full_name: fullName })) as IdentityPayload;
  return mapUser(user)!;
}

export async function logoutIdentity() {
  await logout();
}
