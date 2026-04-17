import { Layout } from "../components/Layout";
import { useGame } from "../context/GameContext";

export function SettingsPage() {
  const { profile, toggleSetting, resetProgress, syncProfileNow, session } = useGame();

  return (
    <Layout>
      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black text-slate-900">Settings and accessibility</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Tune the game for comfort, save behavior, and device-friendly play.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {[
            {
              key: "highContrast" as const,
              title: "High contrast mode",
              body: "Adds stronger borders, improved focus, and clearer visual separation.",
              state: profile.settings.highContrast,
            },
            {
              key: "reduceMotion" as const,
              title: "Reduce motion",
              body: "Minimizes movement-heavy transitions and animated celebration flourishes.",
              state: profile.settings.reduceMotion,
            },
            {
              key: "soundEnabled" as const,
              title: "Game sounds",
              body: "Turns movement and victory sounds on or off without affecting gameplay.",
              state: profile.settings.soundEnabled,
            },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] border border-slate-200 p-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center"
              onClick={() => void toggleSetting(item.key)}
            >
              <span>
                <span className="block text-lg font-black text-slate-900">{item.title}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">{item.body}</span>
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">
                {item.state ? "Enabled" : "Disabled"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-black text-slate-900">Save status</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Current mode: {session.status === "authenticated" ? "Private cloud + local fallback" : "Guest browser-only save"}.
            </p>
            <button
              type="button"
              className="mt-5 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-600"
              onClick={() => void syncProfileNow()}
            >
              Sync now
            </button>
          </article>

          <article className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6">
            <h3 className="text-xl font-black text-slate-900">Reset campaign</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This keeps your player name, selected character, and settings but clears unlocked levels, medals, and completed progress.
            </p>
            <button
              type="button"
              className="mt-5 rounded-2xl border border-rose-300 px-5 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100"
              onClick={() => void resetProgress()}
            >
              Reset progress
            </button>
          </article>
        </div>
      </section>
    </Layout>
  );
}
