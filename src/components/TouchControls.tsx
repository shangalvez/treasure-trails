interface TouchControlsProps {
  onMove: (direction: "up" | "down" | "left" | "right") => void;
}

const controls: Array<{ direction: "up" | "down" | "left" | "right"; label: string; icon: string }> = [
  { direction: "up", label: "Move up", icon: "↑" },
  { direction: "left", label: "Move left", icon: "←" },
  { direction: "down", label: "Move down", icon: "↓" },
  { direction: "right", label: "Move right", icon: "→" },
];

export function TouchControls({ onMove }: TouchControlsProps) {
  return (
    <section aria-label="On-screen movement controls" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Touch controls</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div />
        {controls
          .filter((control) => control.direction === "up")
          .map((control) => (
            <button
              key={control.direction}
              type="button"
              className="rounded-2xl bg-sky-500 px-4 py-4 text-2xl font-black text-white shadow-md transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
              onClick={() => onMove(control.direction)}
              aria-label={control.label}
            >
              {control.icon}
            </button>
          ))}
        <div />
        {controls
          .filter((control) => control.direction !== "up")
          .map((control) => (
            <button
              key={control.direction}
              type="button"
              className="rounded-2xl bg-slate-100 px-4 py-4 text-2xl font-black text-slate-800 shadow-sm transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
              onClick={() => onMove(control.direction)}
              aria-label={control.label}
            >
              {control.icon}
            </button>
          ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        You can also swipe on the maze or use the arrow keys and WASD.
      </p>
    </section>
  );
}
