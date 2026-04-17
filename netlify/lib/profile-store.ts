import { getStore } from "@netlify/blobs";

export interface StoredProfile {
  version: number;
  playerName: string;
  selectedCharacterId: string;
  unlockedLevels: number[];
  completedLevels: number[];
  medals: Array<{
    levelId: number;
    tier: "bronze" | "silver" | "gold";
    label: string;
    emoji: string;
    awardedAt: string;
    moves: number;
  }>;
  currentLevel: number;
  settings: {
    soundEnabled: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
  };
  lastUpdated: string;
  pendingRemoteSync: boolean;
}

function getProfileStore() {
  return getStore({ name: "treasure-trails-profiles", consistency: "strong" });
}

function userKey(userId: string) {
  return `users/${userId}/profile.json`;
}

export async function loadStoredProfile(userId: string): Promise<StoredProfile | null> {
  const profile = await getProfileStore().get(userKey(userId), { type: "json", consistency: "strong" });
  return (profile as StoredProfile | null) ?? null;
}

export async function saveStoredProfile(userId: string, profile: StoredProfile) {
  await getProfileStore().setJSON(userKey(userId), profile);
  return profile;
}
