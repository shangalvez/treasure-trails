import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { MazeBoard } from "../components/MazeBoard";
import { TouchControls } from "../components/TouchControls";
import { VictoryModal } from "../components/VictoryModal";
import { useGame } from "../context/GameContext";
import { LEVELS } from "../data/levels";
import type { MedalAward, Position } from "../types";
import { playBlockedSound, playMoveSound, playVictorySound } from "../utils/audio";
import { movePosition, parseMaze } from "../utils/maze";

export function GamePage() {
  const { levelId } = useParams();
  const level = LEVELS.find((entry) => entry.id === Number(levelId));
  const navigate = useNavigate();
  const {
    profile,
    rememberCurrentLevel,
    completeLevel,
  } = useGame();

  const [position, setPosition] = useState<Position>({ x: 1, y: 1 });
  const [moveCount, setMoveCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const [victoryMedal, setVictoryMedal] = useState<MedalAward | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const parsed = useMemo(() => (level ? parseMaze(level) : null), [level]);

  useEffect(() => {
  if (!level || !parsed) return;

  setPosition(parsed.start);
  setMoveCount(0);
  setPaused(false);
  setShowVictory(false);
  setVictoryMedal(null);
  setVisited(new Set([`${parsed.start.x},${parsed.start.y}`]));

  void rememberCurrentLevel(level.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [level?.id, parsed?.start.x, parsed?.start.y]);

  const handleMove = useCallback(async (direction: "up" | "down" | "left" | "right") => {
    if (!level || !parsed || paused || showVictory) return;

    const next = movePosition(level, position, direction);

    if (next.x === position.x && next.y === position.y) {
      playBlockedSound(profile.settings.soundEnabled);
      setLiveMessage("That way is blocked.");
      return;
    }

    playMoveSound(profile.settings.soundEnabled);
    setPosition(next);
    setVisited((current) => new Set(current).add(`${next.x},${next.y}`));
    setMoveCount((current) => current + 1);
    setLiveMessage(`Moved ${direction}.`);

    if (next.x === parsed.treasure.x && next.y === parsed.treasure.y) {
      playVictorySound(profile.settings.soundEnabled);
      const medal = await completeLevel(level.id, moveCount + 1, level.parMoves);
      setVictoryMedal(medal);
      setLiveMessage(`Treasure found. Good job, ${profile.playerName || "Explorer"}!`);
      setShowVictory(true);
    }
  }, [completeLevel, level, moveCount, parsed, paused, position, profile.playerName, profile.settings.soundEnabled, showVictory]);

  useEffect(() => {
    if (!level || !parsed) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (showVictory || paused) return;

      const mapping: Record<string, "up" | "down" | "left" | "right" | undefined> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };

      const direction = mapping[event.key];
      if (!direction) return;
      event.preventDefault();
      void handleMove(direction);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove, level, parsed, paused, showVictory]);

  function resetRun() {
    if (!parsed) return;
    setPosition(parsed.start);
    setMoveCount(0);
    setVisited(new Set([`${parsed.start.x},${parsed.start.y}`]));
    setShowVictory(false);
    setVictoryMedal(null);
    setPaused(false);
    setLiveMessage("Level restarted.");
  }

  if (!level || !parsed) {
    return <Navigate to="/levels" replace />;
  }

  if (!profile.unlockedLevels.includes(level.id)) {
    return <Navigate to="/levels" replace />;
  }

  const isLastLevel = level.id === LEVELS.length;
  const completionCopy = `Good job, ${profile.playerName || "Explorer"}!`;

  return (
    <Layout>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Current treasure run</p>
                <h2 className="text-3xl font-black text-slate-900">Level {level.id}</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <p className="font-bold text-slate-900">Moves</p>
                  <p className="mt-1 text-2xl font-black text-sky-600">{moveCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <p className="font-bold text-slate-900">Par</p>
                  <p className="mt-1 text-2xl font-black text-emerald-600">{level.parMoves}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <p className="font-bold text-slate-900">Medals</p>
                  <p className="mt-1 text-2xl font-black text-amber-600">{profile.medals.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={resetRun}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
              >
                Restart level
              </button>
              <Link
                to="/levels"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
              >
                Back to levels
              </Link>
            </div>
          </section>

          <MazeBoard
            level={level}
            position={position}
            visited={visited}
            selectedCharacterId={profile.selectedCharacterId}
            paused={paused}
            onMove={(direction) => void handleMove(direction)}
          />
        </div>

        <aside className="space-y-6">
          <TouchControls onMove={(direction) => void handleMove(direction)} />

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-xl font-black text-slate-900">Treasure tip</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{level.hint}</p>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-xl font-black text-slate-900">Run status</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {paused
                ? "The level is paused. Resume whenever you are ready."
                : `${completionCopy} is waiting once you find the treasure chest.`}
            </p>
            <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Completed levels stay unlocked, and your best medal is saved.
            </p>
          </section>
        </aside>
      </div>

      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      <VictoryModal
        open={showVictory}
        playerName={profile.playerName || "Explorer"}
        medal={victoryMedal}
        levelNumber={level.id}
        isLastLevel={isLastLevel}
        onReplay={resetRun}
        onClose={() => setShowVictory(false)}
        onNext={() => {
          setShowVictory(false);
          if (isLastLevel) {
            navigate("/progress");
            return;
          }
          navigate(`/play/${level.id + 1}`);
        }}
      />
    </Layout>
  );
}
