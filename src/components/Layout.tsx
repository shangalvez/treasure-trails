import { NavLink } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { useGame } from "../context/GameContext";
import { CHARACTERS } from "../data/characters";
import { AuthDialog } from "./AuthDialog";
import { cn } from "../utils/classNames";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/", label: "Home" },
  { to: "/levels", label: "Levels" },
  { to: "/progress", label: "Trophies" },
  { to: "/settings", label: "Settings" },
];

export function Layout({ children }: LayoutProps) {
  const { profile, session, completionPercent, logoutUser, syncProfileNow } = useGame();
  const [showAuth, setShowAuth] = useState(false);
  const character = CHARACTERS.find((entry) => entry.id === profile.selectedCharacterId) ?? CHARACTERS[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fef3c7,_#eff6ff_40%,_#ffffff_75%)] text-slate-900">
      <header className="border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-amber-200 via-orange-100 to-pink-100 text-3xl shadow-sm">
              🗺️
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Treasure Trails</h1>
              <p className="text-sm text-slate-600">Semoga Anda menikmatinya, dibuat oleh Shan Handsome.</p>
            </div>
          </div>

          <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200",
                    isActive ? "bg-sky-500 text-white shadow-md shadow-sky-200" : "bg-white text-slate-700 hover:bg-slate-100",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              <span className="mr-2 text-xl" aria-hidden="true">
                {character.emoji}
              </span>
              <strong>{profile.playerName || "Guest Explorer"}</strong>
              <span className="ml-2 text-slate-500">• {completionPercent}% complete</span>
            </div>

            {session.status === "authenticated" ? (
              <>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  onClick={() => void syncProfileNow()}
                >
                  Sync
                </button>
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
                  onClick={() => void logoutUser()}
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
                onClick={() => setShowAuth(true)}
              >
                Login / Sign up
              </button>
            )}
          </div>
        </div>
      </header>

      {session.demoMode && session.status !== "authenticated" ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <p>
              Demo mode is available right now. Guest progress saves in this browser, and cloud sync starts after Identity is enabled.
            </p>
            <button
              type="button"
              className="rounded-full border border-amber-300 px-4 py-2 font-bold"
              onClick={() => setShowAuth(true)}
            >
              Open auth
            </button>
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <AuthDialog open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
