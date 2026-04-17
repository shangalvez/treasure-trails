import type { MedalAward } from "../types";

interface VictoryModalProps {
  open: boolean;
  playerName: string;
  medal: MedalAward | null;
  levelNumber: number;
  isLastLevel: boolean;
  onNext: () => void;
  onReplay: () => void;
  onClose: () => void;
}

export function VictoryModal({
  open,
  playerName,
  medal,
  levelNumber,
  isLastLevel,
  onNext,
  onReplay,
  onClose,
}: VictoryModalProps) {
  if (!open || !medal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-amber-200 via-yellow-100 to-pink-100 p-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="animate-float absolute left-8 top-8 text-2xl">✨</div>
            <div className="animate-float absolute right-10 top-12 text-3xl [animation-delay:120ms]">🌟</div>
            <div className="animate-float absolute bottom-10 left-12 text-2xl [animation-delay:220ms]">💫</div>
            <div className="animate-float absolute bottom-8 right-16 text-3xl [animation-delay:320ms]">🎉</div>
          </div>

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-700">Level {levelNumber} complete</p>
            <h2 id="victory-title" className="mt-3 text-3xl font-black text-slate-900">
              Good job, {playerName || "Explorer"}!
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">
              You found the treasure and earned a shiny reward.
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">Medal earned</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="text-5xl" aria-hidden="true">
                {medal.emoji}
              </span>
              <div>
                <p className="text-xl font-black text-slate-900">{medal.label}</p>
                <p className="text-sm text-slate-600">Moves used: {medal.moves}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:w-48">
            <button
              type="button"
              onClick={onNext}
              className="rounded-2xl bg-sky-500 px-5 py-3 text-base font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
            >
              {isLastLevel ? "View trophies" : "Next level"}
            </button>
            <button
              type="button"
              onClick={onReplay}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-base font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Replay level
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-transparent px-5 py-3 text-sm font-semibold text-slate-500 transition hover:text-slate-700"
            >
              Stay here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
