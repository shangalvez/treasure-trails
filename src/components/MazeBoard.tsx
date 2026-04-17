import { useMemo, useRef } from "react";
import { CHARACTERS } from "../data/characters";
import type { MazeLevel, Position } from "../types";
import { cn } from "../utils/classNames";
import { parseMaze } from "../utils/maze";

interface MazeBoardProps {
  level: MazeLevel;
  position: Position;
  visited: Set<string>;
  selectedCharacterId: string;
  paused: boolean;
  onMove: (direction: "up" | "down" | "left" | "right") => void;
}

export function MazeBoard({
  level,
  position,
  visited,
  selectedCharacterId,
  paused,
  onMove,
}: MazeBoardProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const { treasure } = useMemo(() => parseMaze(level), [level]);
  const character = CHARACTERS.find((entry) => entry.id === selectedCharacterId) ?? CHARACTERS[0];
  const totalCells = level.rows.length * level.rows[0].length;
  const cellSizeClass =
    totalCells <= 81 ? "minmax(0, 1fr)" : totalCells <= 169 ? "minmax(0, 1fr)" : "minmax(0, 1fr)";

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    touchStartRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!touchStartRef.current || paused) return;
    const dx = event.clientX - touchStartRef.current.x;
    const dy = event.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      onMove(dx > 0 ? "right" : "left");
      return;
    }

    onMove(dy > 0 ? "down" : "up");
  }

  return (
    <section
      className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"
      aria-label={`Maze level ${level.id}`}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">{level.name}</h2>
          <p className="text-sm leading-6 text-slate-600">{level.hint}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Explorer</p>
          <p className="mt-1 text-3xl" aria-hidden="true">
            {character.emoji}
          </p>
        </div>
      </div>

      <div
        className="mx-auto aspect-square w-full max-w-[34rem] touch-none select-none overflow-hidden rounded-[1.5rem] border-4 border-amber-200 bg-amber-50"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        role="img"
        aria-label={`Maze with ${level.rows.length} rows. Swipe or use the keyboard to move ${character.name} to the treasure chest.`}
      >
        <div
          className="grid h-full w-full gap-[2px] bg-amber-100 p-[2px]"
          style={{
            gridTemplateColumns: `repeat(${level.rows[0].length}, ${cellSizeClass})`,
          }}
        >
          {level.rows.flatMap((row, y) =>
            row.split("").map((cell, x) => {
              const isPlayer = position.x === x && position.y === y;
              const isTreasure = treasure.x === x && treasure.y === y;
              const visitedKey = `${x},${y}`;
              const isVisited = visited.has(visitedKey);

              return (
                <div
                  key={visitedKey}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-[0.55rem] text-[min(3.3vw,1.5rem)] font-black transition-colors",
                    cell === "#"
                      ? "bg-slate-700 text-slate-700"
                      : "bg-white text-slate-700",
                    isVisited && cell !== "#" ? "bg-sky-50" : "",
                    isTreasure ? "bg-amber-200" : "",
                    isPlayer ? "ring-2 ring-sky-500 ring-offset-1 ring-offset-white" : "",
                  )}
                  aria-hidden="true"
                >
                  {isTreasure ? "🧰" : null}
                  {isVisited && !isTreasure && !isPlayer ? "·" : null}
                  {isPlayer ? character.emoji : null}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <p className="rounded-2xl bg-slate-50 px-4 py-3">
          <strong className="font-bold text-slate-900">Treasure:</strong> Reach the chest in the maze.
        </p>
        <p className="rounded-2xl bg-slate-50 px-4 py-3">
          <strong className="font-bold text-slate-900">Keyboard:</strong> Arrow keys or WASD.
        </p>
        <p className="rounded-2xl bg-slate-50 px-4 py-3">
          <strong className="font-bold text-slate-900">Touch:</strong> Swipe or use the on-screen arrows.
        </p>
      </div>
    </section>
  );
}
