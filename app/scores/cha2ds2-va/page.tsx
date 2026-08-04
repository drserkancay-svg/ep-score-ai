"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";

type ClinicalFactors = {
  heartFailure: boolean;
  hypertension: boolean;
  diabetes: boolean;
  previousStroke: boolean;
  vascularDisease: boolean;
};

type FactorKey = keyof ClinicalFactors;

type FactorDefinition = {
  id: FactorKey;
  title: string;
  description: string;
  points: number;
};

type InterpretationTone = "neutral" | "low" | "intermediate" | "high";

type Interpretation = {
  title: string;
  description: string;
  tone: InterpretationTone;
};

const initialFactors: ClinicalFactors = {
  heartFailure: false,
  hypertension: false,
  diabetes: false,
  previousStroke: false,
  vascularDisease: false,
};

const factorDefinitions: FactorDefinition[] = [
  {
    id: "heartFailure",
    title: "Congestive heart failure",
    description:
      "Clinical heart failure or documented left ventricular systolic dysfunction.",
    points: 1,
  },
  {
    id: "hypertension",
    title: "Hypertension",
    description:
      "History of hypertension or current antihypertensive treatment.",
    points: 1,
  },
  {
    id: "diabetes",
    title: "Diabetes mellitus",
    description:
      "History of diabetes mellitus or current glucose-lowering treatment.",
    points: 1,
  },
  {
    id: "previousStroke",
    title: "Previous stroke, TIA or systemic embolism",
    description:
      "Previous ischemic stroke, transient ischemic attack or systemic embolism.",
    points: 2,
  },
  {
    id: "vascularDisease",
    title: "Vascular disease",
    description:
      "Previous myocardial infarction, peripheral arterial disease or qualifying aortic/coronary disease.",
    points: 1,
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function ResetIcon() {
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
      <path d="M4 4v6h6" />
      <path d="M5.5 15a7 7 0 1 0 1.4-7.8L4 10" />
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

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 4.8 2.8 8.1 7 10 4.2-1.9 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
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

function getInterpretation(
  ageIsValid: boolean,
  score: number,
): Interpretation {
  if (!ageIsValid) {
    return {
      title: "Enter a valid patient age",
      description:
        "Age is required before the score can be interpreted.",
      tone: "neutral",
    };
  }

  if (score === 0) {
    return {
      title: "Low thromboembolic risk",
      description:
        "The calculated CHA₂DS₂-VA score is 0. Anticoagulation is generally not indicated solely on the basis of this score.",
      tone: "low",
    };
  }

  if (score === 1) {
    return {
      title: "Intermediate thromboembolic risk",
      description:
        "The calculated CHA₂DS₂-VA score is 1. Oral anticoagulation should be considered after individualized assessment and shared decision-making.",
      tone: "intermediate",
    };
  }

  return {
    title: "Elevated thromboembolic risk",
    description:
      "The calculated CHA₂DS₂-VA score is 2 or higher. Oral anticoagulation is generally recommended unless contraindicated.",
    tone: "high",
  };
}

function getResultClasses(tone: InterpretationTone) {
  switch (tone) {
    case "high":
      return {
        panel: "border-rose-200 bg-rose-50",
        badge: "border-rose-200 bg-white text-rose-700",
        value: "text-rose-600",
      };

    case "intermediate":
      return {
        panel: "border-amber-200 bg-amber-50",
        badge: "border-amber-200 bg-white text-amber-700",
        value: "text-amber-600",
      };

    case "low":
      return {
        panel: "border-emerald-200 bg-emerald-50",
        badge: "border-emerald-200 bg-white text-emerald-700",
        value: "text-emerald-600",
      };

    default:
      return {
        panel: "border-slate-200 bg-white",
        badge: "border-slate-200 bg-slate-50 text-slate-600",
        value: "text-slate-900",
      };
  }
}

export default function Cha2ds2VaPage() {
  const [age, setAge] = useState("");
  const [factors, setFactors] =
    useState<ClinicalFactors>(initialFactors);

  const parsedAge = Number(age);

  const ageIsValid =
    age !== "" &&
    Number.isInteger(parsedAge) &&
    parsedAge >= 18 &&
    parsedAge <= 120;

  const agePoints = useMemo(() => {
    if (!ageIsValid) return 0;
    if (parsedAge >= 75) return 2;
    if (parsedAge >= 65) return 1;
    return 0;
  }, [ageIsValid, parsedAge]);

  const score = useMemo(() => {
    let total = agePoints;

    if (factors.heartFailure) total += 1;
    if (factors.hypertension) total += 1;
    if (factors.diabetes) total += 1;
    if (factors.previousStroke) total += 2;
    if (factors.vascularDisease) total += 1;

    return total;
  }, [agePoints, factors]);

  const interpretation = useMemo(
    () => getInterpretation(ageIsValid, score),
    [ageIsValid, score],
  );

  const resultClasses = getResultClasses(interpretation.tone);

  const selectedComponents = useMemo(() => {
    if (!ageIsValid) return [];

    const components: string[] = [];

    if (parsedAge >= 75) {
      components.push("Age ≥75 years: +2");
    } else if (parsedAge >= 65) {
      components.push("Age 65–74 years: +1");
    } else {
      components.push("Age <65 years: +0");
    }

    factorDefinitions.forEach((factor) => {
      if (factors[factor.id]) {
        components.push(`${factor.title}: +${factor.points}`);
      }
    });

    return components;
  }, [ageIsValid, parsedAge, factors]);

  const hasEnteredValues =
    age.trim() !== "" || Object.values(factors).some(Boolean);

  function toggleFactor(id: FactorKey) {
    setFactors((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  function resetCalculator() {
    setAge("");
    setFactors(initialFactors);
  }

  function generatePdfReport() {
    if (!ageIsValid) return;

    const riskLevel =
      score >= 2
        ? "high"
        : score === 1
          ? "moderate"
          : "low";

    const components = [
      `Age: ${parsedAge} years`,
      `Age contribution: +${agePoints}`,
      `Congestive heart failure: ${
        factors.heartFailure ? "Yes (+1)" : "No (+0)"
      }`,
      `Hypertension: ${
        factors.hypertension ? "Yes (+1)" : "No (+0)"
      }`,
      `Diabetes mellitus: ${
        factors.diabetes ? "Yes (+1)" : "No (+0)"
      }`,
      `Previous stroke, TIA or systemic embolism: ${
        factors.previousStroke ? "Yes (+2)" : "No (+0)"
      }`,
      `Vascular disease: ${
        factors.vascularDisease ? "Yes (+1)" : "No (+0)"
      }`,
      `Total CHA₂DS₂-VA score: ${score} points`,
    ];

    buildClinicalReport({
      calculatorId: "cha2ds2-va",
      score: `${score} point${score === 1 ? "" : "s"}`,
      riskLabel: interpretation.title,
      riskLevel,
      interpretation: interpretation.description,
      components,
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
            <ArrowLeftIcon />
            All calculators
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="transition hover:text-cyan-700">
              Home
            </Link>
            <span>/</span>
            <span>Atrial Fibrillation</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">CHA₂DS₂-VA</span>
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">
                Guideline-supported
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                CHA₂DS₂-VA
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Estimates thromboembolic risk in patients with atrial
                fibrillation using clinical risk factors without including sex
                as a scoring component.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Score range
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                0–8 points
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-600">
                Patient variables
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Enter the clinical information
              </h2>
            </div>

            <div className="mt-7">
              <label htmlFor="age" className="block">
                <span className="font-bold text-slate-950">Patient age</span>
                <span className="mt-1 block text-sm text-slate-500">
                  Age 65–74 years scores 1 point; age 75 years or older
                  scores 2 points.
                </span>
              </label>

              <div className="mt-4 flex items-center gap-3">
                <input
                  id="age"
                  type="number"
                  min={18}
                  max={120}
                  inputMode="numeric"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="Enter age"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />

                <span className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                  years
                </span>
              </div>

              {age !== "" && !ageIsValid ? (
                <p className="mt-3 text-sm font-semibold text-rose-600">
                  Enter a whole-number age between 18 and 120.
                </p>
              ) : null}
            </div>

            <div className="mt-8 space-y-3">
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
                        ? "border-cyan-300 bg-cyan-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition ${
                        selected
                          ? "border-cyan-600 bg-cyan-600 text-white"
                          : "border-slate-300 bg-white text-transparent"
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

                    <span
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${
                        selected
                          ? "border-cyan-200 bg-white text-cyan-700"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      +{factor.points}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col justify-end gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={generatePdfReport}
                disabled={!ageIsValid}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FileIcon />
                Generate Clinical PDF Report
              </button>

              <button
                type="button"
                onClick={resetCalculator}
                disabled={!hasEnteredValues}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ResetIcon />
                Reset calculator
              </button>
            </div>
          </section>

          <aside className="space-y-6">
            <section
              className={`sticky top-6 rounded-[2rem] border p-6 shadow-xl shadow-slate-200/40 sm:p-8 ${resultClasses.panel}`}
            >
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                    Calculated score
                  </p>

                  <p
                    className={`mt-3 text-7xl font-black tracking-[-0.06em] ${resultClasses.value}`}
                  >
                    {ageIsValid ? score : "—"}
                  </p>
                </div>

                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white text-cyan-600 shadow-sm">
                  <ShieldIcon />
                </span>
              </div>

              <div className="mt-7 border-t border-slate-200 pt-6">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${resultClasses.badge}`}
                >
                  {interpretation.title}
                </span>

                <p className="mt-4 leading-7 text-slate-600">
                  {interpretation.description}
                </p>
              </div>

              {ageIsValid ? (
                <div className="mt-7">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Score components
                  </p>

                  <div className="mt-3 space-y-2">
                    {selectedComponents.map((component) => (
                      <div
                        key={component}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                        {component}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-800">
                  Clinical-use notice
                </p>

                <p className="mt-2 text-xs leading-5 text-amber-900/75">
                  Use this result together with the complete clinical context,
                  bleeding risk, contraindications and current guidelines.
                  Reassess risk when the patient&apos;s condition changes.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Intended population",
              description:
                "Adults with clinically diagnosed atrial fibrillation undergoing assessment of stroke and systemic thromboembolism risk.",
            },
            {
              title: "Important limitations",
              description:
                "The score does not capture every modifier of thromboembolic or bleeding risk and must not be used as the sole basis for clinical decisions.",
            },
            {
              title: "Scientific status",
              description:
                "Guideline-supported clinical risk classification. Formula and interpretation require documented scientific review before public release.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
            >
              <h2 className="font-black text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-600">
            Reference
          </p>

          <h2 className="mt-3 text-xl font-black text-slate-950">
            
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            Van Gelder IC, Rienstra M, Bunting KV, Casado-Arroyo R, Caso V, Crijns HJGM, De Potter TJR, Dwight J, Guasti L, Hanke T, Jaarsma T, Lettino M, Løchen ML, Lumbers RT, Maesen B, Mølgaard I, Rosano GMC, Sanders P, Schnabel RB, Suwalski P, Svennberg E, Tamargo J, Tica O, Traykov V, Tzeis S, Kotecha D; ESC Scientific Document Group. 2024 ESC Guidelines for the management of atrial fibrillation developed in collaboration with the European Association for Cardio-Thoracic Surgery (EACTS). Eur Heart J. 2024 Sep 29;45(36):3314-3414. doi: 10.1093/eurheartj/ehae176. Erratum in: Eur Heart J. 2025 Nov 3;46(41):4349. doi: 10.1093/eurheartj/ehaf306. PMID: 39210723.
          </p>
        </section>
      </section>
    </main>
  );
}
