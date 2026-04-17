import type { Context } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { loadStoredProfile, saveStoredProfile, type StoredProfile } from "../lib/profile-store";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function createEmptyProfile(): StoredProfile {
  return {
    version: 1,
    playerName: "",
    selectedCharacterId: "pippin",
    unlockedLevels: [1],
    completedLevels: [],
    medals: [],
    currentLevel: 1,
    settings: {
      soundEnabled: true,
      highContrast: false,
      reduceMotion: false,
    },
    lastUpdated: new Date().toISOString(),
    pendingRemoteSync: false,
  };
}

function sanitizeProfile(input: unknown): StoredProfile {
  const fallback = createEmptyProfile();
  const candidate = typeof input === "object" && input ? (input as Partial<StoredProfile>) : {};

  return {
    version: 1,
    playerName: typeof candidate.playerName === "string" ? candidate.playerName : fallback.playerName,
    selectedCharacterId:
      typeof candidate.selectedCharacterId === "string" ? candidate.selectedCharacterId : fallback.selectedCharacterId,
    unlockedLevels: Array.isArray(candidate.unlockedLevels)
      ? [...new Set(candidate.unlockedLevels.map(Number).filter((level) => level > 0 && level <= 20))].sort((a, b) => a - b)
      : fallback.unlockedLevels,
    completedLevels: Array.isArray(candidate.completedLevels)
      ? [...new Set(candidate.completedLevels.map(Number).filter((level) => level > 0 && level <= 20))].sort((a, b) => a - b)
      : fallback.completedLevels,
    medals: Array.isArray(candidate.medals)
      ? candidate.medals.map((medal) => ({
          levelId: Number(medal.levelId) || 1,
          tier: medal.tier === "gold" || medal.tier === "silver" || medal.tier === "bronze" ? medal.tier : "bronze",
          label: String(medal.label ?? "Bronze Boots Medal"),
          emoji: String(medal.emoji ?? "🥉"),
          awardedAt: String(medal.awardedAt ?? new Date().toISOString()),
          moves: Number(medal.moves) || 0,
        }))
      : [],
    currentLevel: Number(candidate.currentLevel) > 0 ? Number(candidate.currentLevel) : fallback.currentLevel,
    settings: {
      soundEnabled: candidate.settings?.soundEnabled ?? fallback.settings.soundEnabled,
      highContrast: candidate.settings?.highContrast ?? fallback.settings.highContrast,
      reduceMotion: candidate.settings?.reduceMotion ?? fallback.settings.reduceMotion,
    },
    lastUpdated: new Date().toISOString(),
    pendingRemoteSync: false,
  };
}

export default async (_req: Request, _context: Context) => {
  const user = await getUser();
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  if (_req.method === "GET") {
    const profile = (await loadStoredProfile(user.id)) ?? createEmptyProfile();
    return json({ profile });
  }

  if (_req.method === "PUT") {
    const payload = (await _req.json()) as { profile?: unknown };
    const profile = sanitizeProfile(payload.profile);
    const saved = await saveStoredProfile(user.id, profile);
    return json({ profile: saved });
  }

  return json({ error: "Method not allowed" }, 405);
};
