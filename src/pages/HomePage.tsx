import { useNavigate } from "react-router-dom";
import { CharacterPicker } from "../components/CharacterPicker";
import { Layout } from "../components/Layout";
import { ProgressBar } from "../components/ProgressBar";
import { useGame } from "../context/GameContext";

export function HomePage() {
  const {
    profile,
    completionPercent,
    isAuthenticated,
    session,
    updatePlayerName,
    selectCharacter,
    toggleSetting,
    loadDemoProfile,
  } = useGame();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
              20 handcrafted-style levels • medals • private saves
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              A bright little treasure hunt for every device.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Pick a cute explorer, enter your name, and guide them through cozy mazes to discover sparkling treasure chests.
              The adventure is tuned for phones, tablets, laptops, and desktops with touch, keyboard, and screen-reader support.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate(`/play/${profile.currentLevel || 1}`)}
              className="rounded-[1.5rem] bg-sky-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
            >
              Start game
            </button>
            <button
              type="button"
              onClick={() => navigate("/levels")}
              className="rounded-[1.5rem] border border-slate-200 px-5 py-4 text-lg font-black text-slate-800 transition hover:bg-slate-50"
            >
              Choose level
            </button>
            <button
              type="button"
              onClick={() => void loadDemoProfile()}
              className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-lg font-black text-amber-900 transition hover:bg-amber-100"
            >
              Load demo run
            </button>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5">
            <ProgressBar value={completionPercent} label="Campaign progress" />
            <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
              <p>
                <strong className="text-slate-900">{profile.completedLevels.length}</strong> levels completed
              </p>
              <p>
                <strong className="text-slate-900">{profile.medals.length}</strong> medals collected
              </p>
              <p>
                <strong className="text-slate-900">{isAuthenticated ? "Cloud + local" : "Local only"}</strong> saving mode
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black text-slate-900">Player setup</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every saved profile keeps your name, chosen character, unlocked levels, medals, and settings.
            </p>

            <div className="mt-5">
              <label htmlFor="player-name" className="mb-2 block text-sm font-bold text-slate-700">
                Player name
              </label>
              <input
                id="player-name"
                value={profile.playerName}
                onChange={(event) => void updatePlayerName(event.target.value)}
                placeholder="Explorer name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-bold text-slate-900">Login choices</p>
              <ul className="mt-2 space-y-2 leading-6">
                <li>• Continue as guest for browser-only saving.</li>
                <li>• Use login/sign up for private saved progress per player account.</li>
                <li>• Returning players pick up from their latest unlocked level.</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Status: {session.status === "authenticated" ? "Logged in" : "Guest mode"}
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black text-slate-900">Accessibility options</h3>
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => void toggleSetting("highContrast")}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left"
              >
                <span>
                  <span className="block font-bold text-slate-900">High contrast mode</span>
                  <span className="block text-sm text-slate-600">Boost outlines and improve separation.</span>
                </span>
                <span className="text-sm font-bold text-sky-700">
                  {profile.settings.highContrast ? "On" : "Off"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => void toggleSetting("reduceMotion")}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left"
              >
                <span>
                  <span className="block font-bold text-slate-900">Reduce motion</span>
                  <span className="block text-sm text-slate-600">Tone down animations and transitions.</span>
                </span>
                <span className="text-sm font-bold text-sky-700">
                  {profile.settings.reduceMotion ? "On" : "Off"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => void toggleSetting("soundEnabled")}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left"
              >
                <span>
                  <span className="block font-bold text-slate-900">Game sounds</span>
                  <span className="block text-sm text-slate-600">Play light movement and win sounds.</span>
                </span>
                <span className="text-sm font-bold text-sky-700">
                  {profile.settings.soundEnabled ? "On" : "Muted"}
                </span>
              </button>
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <div className="mb-6">
          <h3 className="text-3xl font-black text-slate-900">Choose your explorer</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your selected character appears inside the maze, in the profile area, and in your saved progress.
          </p>
        </div>
        <CharacterPicker selectedCharacterId={profile.selectedCharacterId} onSelect={(id) => void selectCharacter(id)} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "How to play",
            body: "Reach the treasure chest in each maze. Use arrow keys, WASD, swipe gestures, or the on-screen touch controls.",
          },
          {
            title: "Rewards",
            body: "Every completed level awards a medal, unlocks the next path, and celebrates you with a friendly success message.",
          },
          {
            title: "Saving",
            body: "Guests save locally in the browser. Logged-in users keep private progress with cloud sync and offline fallback.",
          },
        ].map((card) => (
          <article key={card.title} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-xl font-black text-slate-900">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
          </article>
        ))}
      </section>
    </Layout>
  );
}
