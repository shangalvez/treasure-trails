import type { GameSettings, MedalAward, PlayerProfile } from "../types";
import { compareMedals } from "../utils/maze";

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  highContrast: false,
  reduceMotion: false,
};

export const TOTAL_LEVELS = 20;

export function createEmptyProfile(): PlayerProfile {
  return {
    version: 1,
    playerName: "",
    selectedCharacterId: "pippin",
    unlockedLevels: [1],
    completedLevels: [],
    medals: [],
    currentLevel: 1,
    settings: DEFAULT_SETTINGS,
    lastUpdated: new Date().toISOString(),
    pendingRemoteSync: false,
  };
}

export function createDemoProfile(): PlayerProfile {
  return {
    ...createEmptyProfile(),
    playerName: "Demo Explorer",
    selectedCharacterId: "mochi",
    unlockedLevels: [1, 2, 3, 4, 5, 6],
    completedLevels: [1, 2, 3],
    medals: [
      {
        levelId: 1,
        tier: "gold",
        label: "Golden Compass Medal",
        emoji: "🥇",
        moves: 11,
        awardedAt: new Date().toISOString(),
      },
      {
        levelId: 2,
        tier: "silver",
        label: "Silver Trail Medal",
        emoji: "🥈",
        moves: 14,
        awardedAt: new Date().toISOString(),
      },
      {
        levelId: 3,
        tier: "bronze",
        label: "Bronze Boots Medal",
        emoji: "🥉",
        moves: 19,
        awardedAt: new Date().toISOString(),
      },
    ],
    currentLevel: 4,
  };
}

export function getGuestStorageKey(): string {
  return "treasure-trails:guest-profile";
}

export function getUserStorageKey(userId: string): string {
  return `treasure-trails:user:${userId}`;
}

export function loadProfileFromLocal(storageKey: string): PlayerProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    return sanitizeProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveProfileToLocal(storageKey: string, profile: PlayerProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(profile));
}

export function sanitizeProfile(input: unknown): PlayerProfile {
  const fallback = createEmptyProfile();
  const candidate = typeof input === "object" && input ? (input as Partial<PlayerProfile>) : {};

  const medals = Array.isArray(candidate.medals)
    ? candidate.medals.filter(Boolean).map((medal) => ({
        levelId: Number(medal.levelId) || 1,
        tier: medal.tier === "gold" || medal.tier === "silver" || medal.tier === "bronze" ? medal.tier : "bronze",
        label: String(medal.label ?? "Bronze Boots Medal"),
        emoji: String(medal.emoji ?? "🥉"),
        awardedAt: String(medal.awardedAt ?? new Date().toISOString()),
        moves: Number(medal.moves) || 0,
      }))
    : [];

  return {
    version: 1,
    playerName: typeof candidate.playerName === "string" ? candidate.playerName : fallback.playerName,
    selectedCharacterId:
      typeof candidate.selectedCharacterId === "string" ? candidate.selectedCharacterId : fallback.selectedCharacterId,
    unlockedLevels: normalizeLevelArray(candidate.unlockedLevels, [1]),
    completedLevels: normalizeLevelArray(candidate.completedLevels, []),
    medals,
    currentLevel: Number(candidate.currentLevel) > 0 ? Number(candidate.currentLevel) : 1,
    settings: {
      soundEnabled: candidate.settings?.soundEnabled ?? fallback.settings.soundEnabled,
      highContrast: candidate.settings?.highContrast ?? fallback.settings.highContrast,
      reduceMotion: candidate.settings?.reduceMotion ?? fallback.settings.reduceMotion,
    },
    lastUpdated: typeof candidate.lastUpdated === "string" ? candidate.lastUpdated : new Date().toISOString(),
    pendingRemoteSync: Boolean(candidate.pendingRemoteSync),
  };
}

function normalizeLevelArray(input: unknown, fallback: number[]): number[] {
  if (!Array.isArray(input)) return fallback;
  const normalized = [...new Set(input.map((level) => Number(level)).filter((level) => level > 0 && level <= TOTAL_LEVELS))];
  return normalized.length > 0 ? normalized.sort((a, b) => a - b) : fallback;
}

export function mergeProfiles(localProfile: PlayerProfile | null, remoteProfile: PlayerProfile | null): PlayerProfile {
  const local = localProfile ? sanitizeProfile(localProfile) : createEmptyProfile();
  const remote = remoteProfile ? sanitizeProfile(remoteProfile) : createEmptyProfile();

  const newest = new Date(local.lastUpdated).getTime() >= new Date(remote.lastUpdated).getTime() ? local : remote;
  const oldest = newest === local ? remote : local;

  const medalMap = new Map<number, MedalAward>();
  [...oldest.medals, ...newest.medals].forEach((medal) => {
    medalMap.set(medal.levelId, compareMedals(medal, medalMap.get(medal.levelId)));
  });

  return sanitizeProfile({
    ...newest,
    playerName: newest.playerName || oldest.playerName,
    selectedCharacterId: newest.selectedCharacterId || oldest.selectedCharacterId,
    unlockedLevels: [...new Set([...oldest.unlockedLevels, ...newest.unlockedLevels])].sort((a, b) => a - b),
    completedLevels: [...new Set([...oldest.completedLevels, ...newest.completedLevels])].sort((a, b) => a - b),
    medals: [...medalMap.values()].sort((a, b) => a.levelId - b.levelId),
    currentLevel: Math.max(newest.currentLevel, oldest.currentLevel, 1),
    pendingRemoteSync: local.pendingRemoteSync || remote.pendingRemoteSync,
    lastUpdated: newest.lastUpdated,
  });
}
