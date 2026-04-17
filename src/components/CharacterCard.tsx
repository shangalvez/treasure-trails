import type { CuteCharacter } from "../types";
import { cn } from "../utils/classNames";

interface CharacterCardProps {
  character: CuteCharacter;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function CharacterCard({ character, selected, onSelect }: CharacterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(character.id)}
      className={cn(
        "group w-full rounded-3xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300",
        selected ? "border-sky-500 ring-2 ring-sky-400" : "border-slate-200",
      )}
      aria-pressed={selected}
      aria-label={`Choose ${character.name}`}
    >
      <div className={cn("mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-md", character.accent, character.glow)}>
        <span aria-hidden="true">{character.emoji}</span>
      </div>
      <div className="space-y-1">
        <p className="font-display text-base font-bold text-slate-900">{character.name}</p>
        <p className="text-sm font-semibold text-sky-700">{character.title}</p>
        <p className="text-sm leading-6 text-slate-600">{character.description}</p>
      </div>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
        {selected ? "Selected explorer" : "Tap to choose"}
      </span>
    </button>
  );
}
