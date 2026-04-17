import { useState, type FormEvent } from "react";
import { useGame } from "../context/GameContext";
import { cn } from "../utils/classNames";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  const { loginWithPassword, signupWithPassword, session } = useGame();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    try {
      if (mode === "login") {
        await loginWithPassword(email, password);
        setMessage("Welcome back! Your private progress is ready.");
      } else {
        await signupWithPassword(email, password, name);
        setMessage("Account created! If email confirmation is enabled, check your inbox too.");
      }

      setTimeout(() => onClose(), 450);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not finish that request.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="auth-title" className="text-2xl font-black text-slate-900">
              Save your treasure hunt
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sign in to keep each player’s progress private and synced across visits.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mb-5 inline-flex rounded-full bg-slate-100 p-1">
          {(["login", "signup"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold capitalize transition",
                mode === option ? "bg-white text-slate-900 shadow-sm" : "text-slate-600",
              )}
              onClick={() => setMode(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="auth-name">
                Player name
              </label>
              <input
                id="auth-name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required={mode === "signup"}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="auth-email">
              Email address
            </label>
            <input
              id="auth-email"
              type="email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              minLength={6}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </div>

          <button
            type="submit"
            disabled={pending || !session.identityEnabled}
            className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-base font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {pending ? "Working..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p aria-live="polite" className="mt-4 min-h-6 text-sm text-slate-600">
          {session.identityEnabled
            ? message
            : "Identity is not configured yet on this site, so guest and demo mode are the safe fallback for now."}
        </p>
      </div>
    </div>
  );
}
