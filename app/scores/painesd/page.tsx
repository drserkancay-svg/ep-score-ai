"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";

type PainesdFactors = {
  pulmonaryDisease: boolean;
  ageOver60: boolean;
  ischemicCardiomyopathy: boolean;
  nyhaClassThreeOrFour: boolean;
  ejectionFractionBelow25: boolean;
  vtStorm: boolean;
  diabetes: boolean;
};

type FactorKey = keyof PainesdFactors;

type FactorDefinition = {
  id: FactorKey;
  letter: string;
  title: string;
  description: string;
  points: number;
};

const initialFactors: PainesdFactors = {
  pulmonaryDisease: false,
  ageOver60: false,
  ischemicCardiomyopathy: false,
  nyhaClassThreeOrFour: false,
  ejectionFractionBelow25: false,
  vtStorm: false,
  diabetes: false,
};

const factorDefinitions: FactorDefinition[] = [
  {
    id: "pulmonaryDisease",
    letter: "P",
    title: "Pulmonary disease",
    description:
      "Documented chronic obstructive pulmonary disease or another clinically significant chronic pulmonary disorder.",
    points: 5,
  },
  {
    id: "ageOver60",
    letter: "A",
    title: "Age greater than 60 years",
    description:
      "Select when the patient is older than 60 years.",
    points: 3,
  },
  {
    id: "ischemicCardiomyopathy",
    letter: "I",
    title: "Ischemic cardiomyopathy",
    description:
      "Underlying ventricular dysfunction related to ischemic heart disease.",
    points: 6,
  },
  {
    id: "nyhaClassThreeOrFour",
    letter: "N",
    title: "NYHA functional class III or IV",
    description:
      "Marked limitation of physical activity or symptoms at rest.",
    points: 6,
  },
  {
    id: "ejectionFractionBelow25",
    letter: "E",
    title: "Left ventricular ejection fraction below 25%",
    description:
      "Select when the documented left ventricular ejection fraction is less than 25%.",
    points: 3,
  },
  {
    id: "vtStorm",
    letter: "S",
    title: "Ventricular tachycardia storm",
    description:
      "Presentation with recurrent ventricular tachycardia requiring repeated therapies.",
    points: 5,
  },
  {
    id: "diabetes",
    letter: "D",
    title: "Diabetes mellitus",
    description:
      "Documented diagnosis of diabetes mellitus.",
    points: 3,
  },
];

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function HeartPulseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20.8 5.7a5.4 5.4 0 0 0-7.6 0L12 6.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z" />
      <path d="M4.5 13h4l1.5-4 3 8 1.5-4h5" />
    </svg>
  );
}

export default function PainesdPage() {
  const [factors, setFactors] =
    useState<PainesdFactors>(initialFactors);

  const score = useMemo(() => {
    return factorDefinitions.reduce((total, factor) => {
      return factors[factor.id]
        ? total + factor.points
        : total;
    }, 0);
  }, [factors]);

  const interpretation = useMemo(() => {
    if (score <= 8) {
      return {
        title: "Lower procedural risk",
        description:
          "The patient is within the lower PAINESD score category. The overall procedural plan should still account for ventricular function, clinical stability and procedural complexity.",
        tone: "low",
      };
    }

    if (score <= 14) {
      return {
        title: "Intermediate procedural risk",
        description:
          "The result suggests an intermediate risk of acute hemodynamic deterioration during ventricular tachycardia ablation.",
        tone: "intermediate",
      };
    }

    return {
      title: "Higher procedural risk",
      description:
        "The result identifies a higher-risk patient who may require more detailed preprocedural planning, multidisciplinary assessment and consideration of hemodynamic support.",
      tone: "high",
    };
  }, [score]);

  const selectedComponents = useMemo(() => {
    return factorDefinitions
      .filter((factor) => factors[factor.id])
      .map(
        (factor) =>
          `${factor.letter} — ${factor.title}: +${factor.points}`,
      );
  }, [factors]);

  function toggleFactor(id: FactorKey) {
    setFactors((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  function resetCalculator() {
    setFactors(initialFactors);
  }
  function generatePdfReport() {
    const riskLevel =
      interpretation.tone === "high"
        ? "high"
        : interpretation.tone === "intermediate"
          ? "moderate"
          : "low";

    buildClinicalReport({
      calculatorId: "painesd",
      score: `${score} points`,
      riskLabel: interpretation.title,
      riskLevel,
      interpretation: interpretation.description,
      components: selectedComponents.length
        ? [...selectedComponents, `Total PAINESD score: ${score} points`]
        : ["No PAINESD risk factors selected", "Total PAINESD score: 0 points"],
    });
  }


  const resultBorder =
    interpretation.tone === "high"
      ? "border-rose-200"
      : interpretation.tone === "intermediate"
        ? "border-amber-200"
        : "border-emerald-200";

  const resultBackground =
    interpretation.tone === "high"
      ? "bg-rose-50"
      : interpretation.tone === "intermediate"
        ? "bg-amber-50"
        : "bg-emerald-50";

  const resultIconColor =
    interpretation.tone === "high"
      ? "text-rose-700"
      : interpretation.tone === "intermediate"
        ? "text-amber-700"
        : "text-emerald-700";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-cyan-200/45 blur-[120px]" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-violet-200/35 blur-[120px]" />
        <div className="ecg-grid absolute inset-0 opacity-30" />
      </div>

      <header className="relative z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-black tracking-[0.08em]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-sm text-cyan-700">
              EP
            </span>

            EP-SCORE AI
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-slate-950"
          >
            <ArrowLeftIcon />
            All scores
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link
              href="/"
              className="transition hover:text-cyan-700"
            >
              Home
            </Link>

            <span>/</span>
            <span>Ventricular Arrhythmias</span>
            <span>/</span>
            <span className="text-slate-700">PAINESD</span>
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-rose-200 bg-rose-400/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-rose-700">
                VT ablation risk assessment
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                PAINESD Score
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Estimates the risk of acute hemodynamic
                decompensation during catheter ablation of
                scar-related ventricular tachycardia.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Score range
              </p>

              <p className="mt-1 text-2xl font-black">
                0–31 points
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-xl sm:p-8">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">
                Clinical variables
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Select all applicable factors
              </h2>
            </div>

            <div className="mt-7 space-y-3">
              {factorDefinitions.map((factor) => {
                const selected = factors[factor.id];

                return (
                  <button
                    key={factor.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleFactor(factor.id)}
                    className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-cyan-300 bg-cyan-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-sm font-black text-cyan-700">
                      {factor.letter}
                    </span>

                    <span
                      className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition ${
                        selected
                          ? "border-cyan-300 bg-cyan-600 text-white"
                          : "border-slate-300 bg-slate-50 text-transparent"
                      }`}
                    >
                      <CheckIcon />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-slate-950">
                        {factor.title}
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-slate-500">
                        {factor.description}
                      </span>
                    </span>

                    <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">
                      +{factor.points}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={resetCalculator}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              >
                Reset calculator
              </button>
            </div>
          </section>

          <aside>
            <section
              className={`sticky top-6 rounded-[2rem] border p-6 backdrop-blur-xl sm:p-8 ${resultBorder} ${resultBackground}`}
            >
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                    Calculated score
                  </p>

                  <p className="mt-3 text-7xl font-black tracking-[-0.06em]">
                    {score}
                  </p>
                </div>

                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white ${resultIconColor}`}
                >
                  <HeartPulseIcon />
                </span>
              </div>

              <div className="mt-7 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-black">
                  {interpretation.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {interpretation.description}
                </p>
              </div>

              {selectedComponents.length > 0 ? (
                <div className="mt-7">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
                    Score components
                  </p>

                  <div className="mt-3 space-y-2">
                    {selectedComponents.map((component) => (
                      <div
                        key={component}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                        {component}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                  No risk factors have been selected.
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-800">
                  Clinical-use notice
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This score supports preprocedural risk
                  stratification. Decisions regarding ventricular
                  tachycardia ablation or mechanical circulatory
                  support require individualized specialist
                  assessment.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6">
            <h2 className="font-black">Lower-risk category</h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              PAINESD score 0–8.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6">
            <h2 className="font-black">
              Intermediate-risk category
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              PAINESD score 9–14.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6">
            <h2 className="font-black">Higher-risk category</h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              PAINESD score 15 or higher.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">
            Scientific reference
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            Santangeli P, Frankel DS, Tung R, Vaseghi M, Sauer WH, Tzou WS, Mathuria N, Nakahara S, Dickfeldt TM, Lakkireddy D, Bunch TJ, Di Biase L, Natale A, Tholakanahalli V, Tedrow UB, Kumar S, Stevenson WG, Della Bella P, Shivkumar K, Marchlinski FE, Callans DJ; International VT Ablation Center Collaborative Group. Early Mortality After Catheter Ablation of Ventricular Tachycardia in Patients With Structural Heart Disease. J Am Coll Cardiol. 2017 May 2;69(17):2105-2115. doi: 10.1016/j.jacc.2017.02.044. PMID: 28449770.
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-500">
            The PAINESD score combines pulmonary disease, age,
            ischemic cardiomyopathy, NYHA functional class,
            ejection fraction, ventricular tachycardia storm and
            diabetes to support procedural risk stratification.
          </p>
        </section>
      </section>

      <button
        type="button"
        onClick={generatePdfReport}
        disabled={false}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Generate PDF
      </button>
    </main>
  );
}