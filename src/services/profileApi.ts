import type { PlayerProfile } from "../types";
import { sanitizeProfile } from "./localPersistence";

const PROFILE_ENDPOINT = "/.netlify/functions/profile";

export async function fetchRemoteProfile(): Promise<PlayerProfile | null> {
  const response = await fetch(PROFILE_ENDPOINT, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error("Unable to load cloud progress right now.");
  }

  const payload = (await response.json()) as { profile?: PlayerProfile };
  return payload.profile ? sanitizeProfile(payload.profile) : null;
}

export async function saveRemoteProfile(profile: PlayerProfile): Promise<PlayerProfile> {
  const response = await fetch(PROFILE_ENDPOINT, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profile }),
  });

  if (!response.ok) {
    throw new Error("Unable to save cloud progress right now.");
  }

  const payload = (await response.json()) as { profile: PlayerProfile };
  return sanitizeProfile(payload.profile);
}
