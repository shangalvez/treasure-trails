import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ProgressBar } from "../components/ProgressBar";
import { useGame } from "../context/GameContext";
import { LEVELS } from "../data/levels";

export function LevelSelectPage() {
  const { profile, completionPercent } = useGame();

  return (
    <Layout>
      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Level select</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Twenty treasure mazes grow trickier over time, but every one is designed to stay playful.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <ProgressBar value={completionPercent} label="Campaign completion" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {LEVELS.map((level) => {
            const unlocked = profile.unlockedLevels.includes(level.id);
            const medal = profile.medals.find((entry) => entry.levelId === level.id);

            return (
              <article
                key={level.id}
                className={`rounded-[1.6rem] border p-5 shadow-sm ${
                  unlocked ? "border-slate-200 bg-slate-50" : "border-dashed border-slate-300 bg-slate-100/70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Level {level.id}</p>
                    <h3 className="mt-1 text-xl font-black text-slate-900">{level.name}</h3>
                  </div>
                  <span className="text-2xl" aria-hidden="true">
                    {medal ? medal.emoji : unlocked ? "🧭" : "🔒"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">{level.hint}</p>
                <div className="mt-4 text-sm text-slate-500">
                  Target par moves: <strong className="text-slate-800">{level.parMoves}</strong>
                </div>

                <div className="mt-5">
                  {unlocked ? (
                    <Link
                      to={`/play/${level.id}`}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-600"
                    >
                      {profile.currentLevel === level.id ? "Continue level" : "Play level"}
                    </Link>
                  ) : (
                    <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-500">
                      Locked until previous treasure is found
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
