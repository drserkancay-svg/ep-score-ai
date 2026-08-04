import type { ReactNode } from "react";

type RiskLevel = "low" | "moderate" | "high" | "very-high" | "neutral";

type CalculatorResultProps = {
  score: string | number;
  scoreLabel?: string;
  riskLabel: string;
  riskLevel?: RiskLevel;
  interpretation: string;
  details?: ReactNode;
};

const riskStyles: Record<
  RiskLevel,
  {
    badge: string;
    glow: string;
    score: string;
    dot: string;
    panel: string;
  }
> = {
  low: {
    badge: "border-emerald-200 bg-white text-emerald-700",
    glow: "bg-emerald-200/70",
    score: "text-emerald-600",
    dot: "bg-emerald-500",
    panel: "border-emerald-200 bg-emerald-50/70",
  },
  moderate: {
    badge: "border-amber-200 bg-white text-amber-700",
    glow: "bg-amber-200/70",
    score: "text-amber-600",
    dot: "bg-amber-500",
    panel: "border-amber-200 bg-amber-50/70",
  },
  high: {
    badge: "border-orange-200 bg-white text-orange-700",
    glow: "bg-orange-200/70",
    score: "text-orange-600",
    dot: "bg-orange-500",
    panel: "border-orange-200 bg-orange-50/70",
  },
  "very-high": {
    badge: "border-rose-200 bg-white text-rose-700",
    glow: "bg-rose-200/70",
    score: "text-rose-600",
    dot: "bg-rose-500",
    panel: "border-rose-200 bg-rose-50/70",
  },
  neutral: {
    badge: "border-cyan-200 bg-white text-cyan-700",
    glow: "bg-cyan-200/70",
    score: "text-cyan-600",
    dot: "bg-cyan-500",
    panel: "border-slate-200 bg-white",
  },
};

export default function CalculatorResult({
  score,
  scoreLabel = "Calculated score",
  riskLabel,
  riskLevel = "neutral",
  interpretation,
  details,
}: CalculatorResultProps) {
  const styles = riskStyles[riskLevel];

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border p-6 shadow-xl shadow-slate-200/40 ${styles.panel}`}
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${styles.glow}`}
      />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {scoreLabel}
        </p>

        <p
          className={`mt-4 text-6xl font-black tracking-[-0.06em] ${styles.score}`}
        >
          {score}
        </p>

        <div
          className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-black ${styles.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
          {riskLabel}
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-600">
          {interpretation}
        </p>

        {details ? (
          <div className="mt-6 border-t border-slate-200 pt-6">
            {details}
          </div>
        ) : null}
      </div>
    </div>
  );
}