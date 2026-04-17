import type { MedalAward } from "../types";

interface MedalCardProps {
  medal: MedalAward;
}

export function MedalCard({ medal }: MedalCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-4xl" aria-hidden="true">
          {medal.emoji}
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Level {medal.levelId}</p>
          <h3 className="text-lg font-black text-slate-900">{medal.label}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">Earned with {medal.moves} moves.</p>
      <p className="mt-1 text-xs text-slate-400">
        Awarded {new Date(medal.awardedAt).toLocaleDateString()}
      </p>
    </article>
  );
}
