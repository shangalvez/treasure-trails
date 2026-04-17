import { Layout } from "../components/Layout";
import { MedalCard } from "../components/MedalCard";
import { ProgressBar } from "../components/ProgressBar";
import { useGame } from "../context/GameContext";

export function ProgressPage() {
  const { profile, completionPercent } = useGame();

  return (
    <Layout>
      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-5">
            <h2 className="text-3xl font-black text-slate-900">Trophy and medals page</h2>
            <p className="text-sm leading-7 text-slate-600">
              Every finished level awards a medal and keeps your adventure moving forward.
            </p>
            <ProgressBar value={completionPercent} label="Overall campaign progress" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-500">Completed levels</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{profile.completedLevels.length}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-500">Medals earned</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{profile.medals.length}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-500">Current level</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{profile.currentLevel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-100 via-yellow-50 to-white p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-700">Treasure hall</p>
            <h3 className="mt-3 text-2xl font-black text-slate-900">
              {profile.playerName || "Explorer"}, your collection is growing!
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Gold medals mean you solved a level at or under par. Silver is close behind. Bronze still counts as a proud victory.
            </p>
          </div>
        </div>

        <div className="mt-8">
          {profile.medals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {profile.medals.map((medal) => (
                <MedalCard key={medal.levelId} medal={medal} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-black text-slate-900">No medals yet</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Finish your first maze and this trophy room will sparkle with rewards.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
