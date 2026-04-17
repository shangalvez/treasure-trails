import { cn } from "../utils/classNames";

interface ProgressBarProps {
  value: number;
  label: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-slate-200"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 transition-[width] duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
