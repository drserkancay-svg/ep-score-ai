"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";

type RiskItem = {
  id: string;
  title: string;
  description: string;
  points: number;
};

type RiskLevel = {
  title: string;
  description: string;
  panelClassName: string;
  badgeClassName: string;
  valueClassName: string;
};

const riskItems: RiskItem[] = [
  {
    id: "peripheral-type-1",
    title: "Type 1 Brugada pattern in peripheral leads",
    description:
      "A type 1 Brugada ECG pattern is present in peripheral leads.",
    points: 9,
  },
  {
    id: "arrhythmic-syncope",
    title: "Probable arrhythmia-related syncope",
    description:
      "The clinical history is considered compatible with probable arrhythmic syncope.",
    points: 12,
  },
  {
    id: "early-repolarization",
    title: "Early repolarization in peripheral leads",
    description:
      "Early repolarization is present in the inferior or lateral peripheral ECG leads.",
    points: 12,
  },
  {
    id: "spontaneous-type-1",
    title: "Spontaneous type 1 Brugada ECG pattern",
    description:
      "A spontaneous type 1 Brugada pattern is present without drug provocation.",
    points: 14,
  },
];

const riskByScore: Record<number, number> = {
  0: 1.5,
  9: 3.6,
  12: 4.9,
  14: 5.9,
  21: 11.5,
  23: 13.9,
  24: 15.2,
  26: 18.3,
  33: 33.4,
  35: 39.1,
  38: 48.8,
  47: 80.7,
};

function getRiskLevel(risk: number): RiskLevel {
  if (risk < 5) {
    return {
      title: "Lower predicted risk",
      description:
        "The calculated five-year risk is below 5%. Clinical interpretation remains necessary.",
      panelClassName: "border-emerald-200 bg-emerald-50",
      badgeClassName: "border-emerald-200 bg-white text-emerald-700",
      valueClassName: "text-emerald-600",
    };
  }

  if (risk < 10) {
    return {
      title: "Increased predicted risk",
      description:
        "The calculated five-year risk is between 5% and 10%. Specialist risk assessment is recommended.",
      panelClassName: "border-amber-200 bg-amber-50",
      badgeClassName: "border-amber-200 bg-white text-amber-700",
      valueClassName: "text-amber-600",
    };
  }

  return {
    title: "High predicted risk",
    description:
      "The calculated five-year risk is 10% or greater. This result requires specialist interpretation and shared clinical decision-making.",
    panelClassName: "border-rose-200 bg-rose-50",
    badgeClassName: "border-rose-200 bg-white text-rose-700",
    valueClassName: "text-rose-600",
  };
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

export default function BrugadaRiskPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const score = useMemo(
    () =>
      riskItems
        .filter((item) => selectedItems.includes(item.id))
        .reduce((total, item) => total + item.points, 0),
    [selectedItems],
  );

  const predictedRisk = riskByScore[score] ?? 0;
  const riskLevel = getRiskLevel(predictedRisk);
  const hasSelection = selectedItems.length > 0;

  function toggleItem(id: string) {
    setSelectedItems((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function resetCalculator() {
    setSelectedItems([]);
  }

  function generatePdfReport() {
    const components = riskItems.map(
      (item) =>
        `${item.title}: ${
          selectedItems.includes(item.id)
            ? `Yes (+${item.points})`
            : "No (+0)"
        }`,
    );

    buildClinicalReport({
      calculatorId: "brugada-risk",
      score: `${predictedRisk.toFixed(1)}%`,
      riskLabel: riskLevel.title,
      riskLevel:
        predictedRisk >= 10
          ? "high"
          : predictedRisk >= 5
            ? "moderate"
            : "low",
      interpretation: riskLevel.description,
      components: [
        ...components,
        `BRUGADA-RISK total: ${score} points`,
        `Estimated five-year arrhythmic risk: ${predictedRisk.toFixed(1)}%`,
      ],
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-cyan-200/45 blur-[120px]" />
        <div className="absolute right-[-12rem] top-[18rem] h-[34rem] w-[34rem] rounded-full bg-violet-200/35 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      </div>

      <header className="relative z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-black tracking-[0.06em] text-slate-950"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-sm text-cyan-700">
              EP
            </span>
            EP-SCORE AI
          </Link>

          <Link
            href="/scores"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700"
          >
            <BackIcon />
            All calculators
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="max-w-4xl">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
            Inherited arrhythmias
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            BRUGADA-RISK
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Estimates the five-year risk of ventricular arrhythmia or sudden
            cardiac death in patients with Brugada syndrome without previous
            cardiac arrest.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-600">
                  Risk markers
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Select applicable findings
                </h2>
              </div>

              <button
                type="button"
                onClick={resetCalculator}
                disabled={!hasSelection}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reset
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {riskItems.map((item) => {
                const selected = selectedItems.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleItem(item.id)}
                    className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-cyan-300 bg-cyan-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="min-w-0">
                      <span
                        className={`block font-bold ${
                          selected ? "text-cyan-950" : "text-slate-900"
                        }`}
                      >
                        {item.title}
                      </span>

                      <span className="mt-1.5 block text-sm leading-6 text-slate-500">
                        {item.description}
                      </span>
                    </span>

                    <span
                      className={`grid h-10 min-w-10 shrink-0 place-items-center rounded-xl border px-3 text-sm font-black ${
                        selected
                          ? "border-cyan-300 bg-cyan-600 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      {selected ? <CheckIcon /> : `+${item.points}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
              <div className="border-b border-slate-200 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  BRUGADA-RISK score
                </p>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-7xl font-black tracking-[-0.08em] text-slate-950">
                    {score}
                  </span>

                  <span className="pb-2 text-sm font-bold text-slate-500">
                    points
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Predicted five-year VA/SCD risk
                </p>

                <p className={`mt-3 text-5xl font-black ${riskLevel.valueClassName}`}>
                  {predictedRisk.toFixed(1)}%
                </p>
              </div>

              <div
                className={`m-5 mt-0 rounded-2xl border p-5 ${riskLevel.panelClassName}`}
              >
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${riskLevel.badgeClassName}`}
                >
                  {riskLevel.title}
                </span>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {riskLevel.description}
                </p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
              <p className="font-black text-amber-800">Clinical limitation</p>

              <p className="mt-3 text-sm leading-6 text-amber-900/75">
                This model was developed for primary-prevention patients with
                Brugada syndrome and no previous cardiac arrest. It must not be
                used as the sole basis for ICD implantation.
              </p>
            </section>

            <button
              type="button"
              onClick={generatePdfReport}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <FileIcon />
              Generate PDF report
            </button>
          </aside>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-600">
            Reference
          </p>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-600">
            Honarbakhsh S, Providencia R, Garcia-Hernandez J, Martin CA, Hunter RJ, Lim WY, Kirkby C, Graham AJ, Sharifzadehgan A, Waldmann V, Marijon E, Munoz-Esparza C, Lacunza J, Gimeno-Blanes JR, Ankou B, Chevalier P, Antonio N, Elvas L, Castelletti S, Crotti L, Schwartz P, Scanavacca M, Darrieux F, Sacilotto L, Mueller-Leisse J, Veltmann C, Vicentini A, Demarchi A, Cortez-Dias N, Antonio PS, de Sousa J, Adragao P, Cavaco D, Costa FM, Khoueiry Z, Boveda S, Sousa MJ, Jebberi Z, Heck P, Mehta S, Conte G, Ozkartal T, Auricchio A, Lowe MD, Schilling RJ, Prieto-Merino D, Lambiase PD; Brugada Syndrome Risk Investigators. A Primary Prevention Clinical Risk Score Model for Patients With Brugada Syndrome (BRUGADA-RISK). JACC Clin Electrophysiol. 2021 Feb;7(2):210-222. doi: 10.1016/j.jacep.2020.08.032. Epub 2020 Oct 28. PMID: 33602402.
          </p>
        </section>
      </section>
    </main>
  );
}
