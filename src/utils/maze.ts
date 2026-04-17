import type { MazeLevel, MedalAward, MedalTier, Position } from "../types";

export const MEDAL_META: Record<MedalTier, { emoji: string; label: string }> = {
  gold: { emoji: "🥇", label: "Golden Compass Medal" },
  silver: { emoji: "🥈", label: "Silver Trail Medal" },
  bronze: { emoji: "🥉", label: "Bronze Boots Medal" },
};

const TIER_RANK: Record<MedalTier, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
};

export function parseMaze(level: MazeLevel) {
  let start: Position = { x: 1, y: 1 };
  let treasure: Position = { x: level.rows[0].length - 2, y: level.rows.length - 2 };

  level.rows.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell === "S") start = { x, y };
      if (cell === "T") treasure = { x, y };
    });
  });

  return { start, treasure, width: level.rows[0].length, height: level.rows.length };
}

export function isWalkable(level: MazeLevel, position: Position): boolean {
  const row = level.rows[position.y];
  if (!row) return false;
  const cell = row[position.x];
  return Boolean(cell) && cell !== "#";
}

export function movePosition(
  level: MazeLevel,
  position: Position,
  direction: "up" | "down" | "left" | "right",
): Position {
  const next = {
    up: { x: position.x, y: position.y - 1 },
    down: { x: position.x, y: position.y + 1 },
    left: { x: position.x - 1, y: position.y },
    right: { x: position.x + 1, y: position.y },
  }[direction];

  return isWalkable(level, next) ? next : position;
}

export function detectMedalTier(moves: number, parMoves: number): MedalTier {
  if (moves <= parMoves) return "gold";
  if (moves <= parMoves + 5) return "silver";
  return "bronze";
}

export function createMedalAward(levelId: number, moves: number, parMoves: number): MedalAward {
  const tier = detectMedalTier(moves, parMoves);
  return {
    levelId,
    tier,
    emoji: MEDAL_META[tier].emoji,
    label: MEDAL_META[tier].label,
    moves,
    awardedAt: new Date().toISOString(),
  };
}

export function compareMedals(next: MedalAward, current?: MedalAward): MedalAward {
  if (!current) return next;
  if (TIER_RANK[next.tier] > TIER_RANK[current.tier]) return next;
  if (TIER_RANK[next.tier] < TIER_RANK[current.tier]) return current;
  return next.moves <= current.moves ? next : current;
}

export function progressPercent(completedLevels: number[], totalLevels: number): number {
  return Math.round((completedLevels.length / totalLevels) * 100);
}
