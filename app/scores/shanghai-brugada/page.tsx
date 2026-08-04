"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";

type EcgOption =
  | "none"
  | "drug-induced"
  | "fever-induced"
  | "spontaneous-type-1";

type ClinicalOption =
  | "none"
  | "young-af"
  | "unclear-syncope"
  | "arrhythmic-syncope"
  | "agonal-respiration"
  | "cardiac-arrest";

type FamilyOption =
  | "none"
  | "unexplained-scd"
  | "suspicious-scd"
  | "definite-brugada";

type GeneticOption = "negative-or-unknown" | "pathogenic";

type ScoreOption<T extends string> = {
  value: T;
  title: string;
  description: string;
  points: number;
};

const ecgOptions: ScoreOption<EcgOption>[] = [
  {
    value: "none",
    title: "No qualifying ECG finding",
    description:
      "No spontaneous, fever-induced or drug-provoked qualifying Brugada ECG finding.",
    points: 0,
  },
  {
    value: "drug-induced",
    title: "Type 2 or 3 pattern converting during drug challenge",
    description:
      "A type 2 or type 3 Brugada ECG pattern converts to type 1 during an appropriate sodium-channel blocker challenge.",
    points: 2,
  },
  {
    value: "fever-induced",
    title: "Fever-induced type 1 pattern",
    description:
      "Type 1 Brugada ECG pattern recorded during fever in nominal or high right-precordial leads.",
    points: 3,
  },
  {
    value: "spontaneous-type-1",
    title: "Spontaneous type 1 pattern",
    description:
      "Spontaneous type 1 Brugada ECG pattern in nominal or high right-precordial leads.",
    points: 3.5,
  },
];

const clinicalOptions: ScoreOption<ClinicalOption>[] = [
  {
    value: "none",
    title: "No qualifying clinical history",
    description:
      "No qualifying arrhythmic symptoms or early atrial arrhythmia history.",
    points: 0,
  },
  {
    value: "young-af",
    title: "Atrial flutter or fibrillation before age 30",
    description:
      "Atrial flutter or atrial fibrillation before 30 years of age without another clear cause.",
    points: 0.5,
  },
  {
    value: "unclear-syncope",
    title: "Syncope of unclear mechanism",
    description:
      "Syncope is present, but an arrhythmic mechanism has not been established.",
    points: 1,
  },
  {
    value: "arrhythmic-syncope",
    title: "Suspected arrhythmic syncope",
    description:
      "Clinical characteristics suggest an arrhythmic cause of syncope.",
    points: 2,
  },
  {
    value: "agonal-respiration",
    title: "Nocturnal agonal respiration",
    description:
      "Documented or witnessed abnormal agonal breathing during sleep.",
    points: 2,
  },
  {
    value: "cardiac-arrest",
    title: "Unexplained cardiac arrest or documented VF/polymorphic VT",
    description:
      "Previous unexplained cardiac arrest, ventricular fibrillation or polymorphic ventricular tachycardia.",
    points: 3,
  },
];

const familyOptions: ScoreOption<FamilyOption>[] = [
  {
    value: "none",
    title: "No qualifying family history",
    description:
      "No qualifying Brugada syndrome or sudden-death history in first- or second-degree relatives.",
    points: 0,
  },
  {
    value: "unexplained-scd",
    title: "Unexplained sudden death before age 45",
    description:
      "Unexplained sudden cardiac death before age 45 in a first- or second-degree relative with a negative autopsy.",
    points: 0.5,
  },
  {
    value: "suspicious-scd",
    title: "Suspicious sudden cardiac death",
    description:
      "Sudden death associated with fever, sleep or a Brugada-aggravating drug in a first- or second-degree relative.",
    points: 1,
  },
  {
    value: "definite-brugada",
    title: "Relative with definite Brugada syndrome",
    description:
      "A first- or second-degree relative has a definite diagnosis of Brugada syndrome.",
    points: 2,
  },
];

const geneticOptions: ScoreOption<GeneticOption>[] = [
  {
    value: "negative-or-unknown",
    title: "No qualifying pathogenic variant",
    description:
      "Genetic testing is negative, unavailable or has not identified a qualifying pathogenic variant.",
    points: 0,
  },
  {
    value: "pathogenic",
    title: "Probable pathogenic Brugada-associated variant",
    description:
      "A probable pathogenic variant in a recognized Brugada-susceptibility gene has been reported.",
    points: 0.5,
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

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 4v6h6" />
      <path d="M5.5 15a7 7 0 1 0 1.4-7.8L4 10" />
    </svg>
  );
}

function EcgIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2 12h4l2-5 4 10 2-5h8" />
      <path d="M12 3a9 9 0 1 1-8.3 5.5" opacity=".35" />
    </svg>
  );
}

function findOption<T extends string>(
  options: ScoreOption<T>[],
  value: T,
) {
  return options.find((option) => option.value === value)!;
}

function getInterpretation(score: number, hasEcgFinding: boolean) {
  if (!hasEcgFinding) {
    return {
      level: "ECG criterion required",
      range: "No valid diagnostic category",
      description:
        "The Shanghai system requires at least one qualifying ECG finding. Clinical, family-history or genetic points alone do not produce a valid diagnostic classification.",
      panelClass: "border-slate-200 bg-slate-50",
      textClass: "text-slate-700",
    };
  }

  if (score >= 3.5) {
    return {
      level: "Probable or definite Brugada syndrome",
      range: "≥3.5 points",
      description:
        "The total score meets the proposed threshold for probable or definite Brugada syndrome. Exclude Brugada phenocopies and interpret the result in a specialist inherited-arrhythmia setting.",
      panelClass: "border-rose-200 bg-rose-50",
      textClass: "text-rose-700",
    };
  }

  if (score >= 2) {
    return {
      level: "Possible Brugada syndrome",
      range: "2–3 points",
      description:
        "The result falls within the possible Brugada syndrome category. Additional clinical evaluation may be required.",
      panelClass: "border-amber-200 bg-amber-50",
      textClass: "text-amber-700",
    };
  }

  return {
    level: "Nondiagnostic",
    range: "<2 points",
    description:
      "The result is below the proposed diagnostic threshold. A low score does not independently exclude disease when clinical suspicion remains high.",
    panelClass: "border-cyan-200 bg-cyan-50",
    textClass: "text-cyan-700",
  };
}

export default function ShanghaiBrugadaPage() {
  const [ecg, setEcg] = useState<EcgOption>("none");
  const [clinical, setClinical] =
    useState<ClinicalOption>("none");
  const [family, setFamily] =
    useState<FamilyOption>("none");
  const [genetic, setGenetic] =
    useState<GeneticOption>("negative-or-unknown");

  const selectedEcg = findOption(ecgOptions, ecg);
  const selectedClinical = findOption(
    clinicalOptions,
    clinical,
  );
  const selectedFamily = findOption(
    familyOptions,
    family,
  );
  const selectedGenetic = findOption(
    geneticOptions,
    genetic,
  );

  const score = useMemo(
    () =>
      selectedEcg.points +
      selectedClinical.points +
      selectedFamily.points +
      selectedGenetic.points,
    [
      selectedEcg.points,
      selectedClinical.points,
      selectedFamily.points,
      selectedGenetic.points,
    ],
  );

  const hasEcgFinding = selectedEcg.points > 0;
  const interpretation = getInterpretation(
    score,
    hasEcgFinding,
  );

  function resetCalculator() {
    setEcg("none");
    setClinical("none");
    setFamily("none");
    setGenetic("negative-or-unknown");
  }
  function generatePdfReport() {
    const riskLevel = score >= 3.5 ? "high" : score >= 2 ? "moderate" : "low";

    buildClinicalReport({
      calculatorId: "shanghai-brugada" as never,
      score: `${score} point${score === 1 ? "" : "s"}`,
      riskLabel: interpretation.level,
      riskLevel,
      interpretation: interpretation.description,
      components: [
        `ECG criterion: ${selectedEcg.title} (+${selectedEcg.points})`,
        `Clinical history: ${selectedClinical.title} (+${selectedClinical.points})`,
        `Family history: ${selectedFamily.title} (+${selectedFamily.points})`,
        `Genetic finding: ${selectedGenetic.title} (+${selectedGenetic.points})`,
        `Qualifying ECG finding present: ${hasEcgFinding ? "Yes" : "No"}`,
        `Total Shanghai score: ${score} points`,
      ],
    });
  }


  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-200/45 blur-[130px]" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-violet-200/35 blur-[130px]" />
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
            href="/scores"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-slate-950"
          >
            <ArrowLeftIcon />
            All calculators
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
            <EcgIcon />
            Inherited arrhythmias
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Shanghai Brugada Score
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Supports the diagnostic assessment of suspected
            Brugada syndrome using ECG findings, clinical history,
            family history and genetic testing.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-violet-400/15 bg-violet-400/[0.05] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
            Scoring rule
          </p>

          <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-600">
            Select one option from each section. Only the highest
            applicable finding within a category is scored. At
            least one qualifying ECG finding is required.
          </p>
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-5">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                    Diagnostic variables
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Select applicable findings
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={resetCalculator}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <ResetIcon />
                  Reset
                </button>
              </div>
            </div>

            <ScoreSection
              number="01"
              title="ECG findings"
              subtitle="One ECG option must apply for a valid classification."
              options={ecgOptions}
              value={ecg}
              onChange={setEcg}
              required
            />

            <ScoreSection
              number="02"
              title="Clinical history"
              subtitle="Select the single highest applicable clinical-history item."
              options={clinicalOptions}
              value={clinical}
              onChange={setClinical}
            />

            <ScoreSection
              number="03"
              title="Family history"
              subtitle="Consider first- and second-degree relatives."
              options={familyOptions}
              value={family}
              onChange={setFamily}
            />

            <ScoreSection
              number="04"
              title="Genetic test result"
              subtitle="Variant interpretation should follow current clinical genetics standards."
              options={geneticOptions}
              value={genetic}
              onChange={setGenetic}
            />
          </section>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 backdrop-blur-xl">
              <div className="border-b border-slate-200 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Shanghai score
                </p>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-7xl font-black tracking-[-0.08em]">
                    {score.toFixed(score % 1 === 0 ? 0 : 1)}
                  </span>

                  <span className="pb-2 text-sm font-bold text-slate-500">
                    points
                  </span>
                </div>
              </div>

              <div
                className={`m-5 rounded-2xl border p-5 ${interpretation.panelClass}`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-[0.14em] ${interpretation.textClass}`}
                >
                  {interpretation.level}
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {interpretation.range}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {interpretation.description}
                </p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                Score components
              </p>

              <div className="mt-4 space-y-3">
                <ScoreRow
                  label="ECG"
                  value={selectedEcg.title}
                  points={selectedEcg.points}
                />

                <ScoreRow
                  label="Clinical history"
                  value={selectedClinical.title}
                  points={selectedClinical.points}
                />

                <ScoreRow
                  label="Family history"
                  value={selectedFamily.title}
                  points={selectedFamily.points}
                />

                <ScoreRow
                  label="Genetics"
                  value={selectedGenetic.title}
                  points={selectedGenetic.points}
                />
              </div>
            </section>

            {!hasEcgFinding && (
              <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
                  Incomplete classification
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Select a qualifying ECG finding before
                  interpreting the total score.
                </p>
              </section>
            )}
          </aside>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            Diagnostic categories
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <DiagnosticCard
              title="Nondiagnostic"
              range="<2 points"
              description="Below the proposed diagnostic threshold."
            />

            <DiagnosticCard
              title="Possible Brugada syndrome"
              range="2–3 points"
              description="Additional assessment may be needed."
            />

            <DiagnosticCard
              title="Probable or definite"
              range="≥3.5 points"
              description="Meets the proposed Shanghai threshold."
            />
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <h2 className="font-black text-amber-800">
            Important clinical limitations
          </h2>

          <div className="mt-3 max-w-5xl space-y-2 text-sm leading-7 text-slate-500">
            <p>
              The Shanghai score is a diagnostic support system,
              not an independent treatment or ICD-decision score.
            </p>

            <p>
              Brugada phenocopies and alternative causes of right
              precordial ST-segment elevation should be excluded,
              including ischemia, electrolyte disturbances,
              mechanical compression and medication effects.
            </p>

            <p>
              Drug-provocation testing should be performed only
              under an appropriate specialist protocol with
              continuous monitoring and resuscitation facilities.
            </p>

            <p>
              Genetic variants should not be counted solely
              because they are reported in a Brugada-associated
              gene. Formal pathogenicity assessment is required.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            References
          </p>

          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-500">
            <p>
              Antzelevitch C, Yan GX, Ackerman MJ, Borggrefe M, Corrado D, Guo J, Gussak I, Hasdemir C, Horie M, Huikuri H, Ma C, Morita H, Nam GB, Sacher F, Shimizu W, Viskin S, Wilde AA. J-Wave syndromes expert consensus conference report: Emerging concepts and gaps in knowledge. Heart Rhythm. 2016 Oct;13(10):e295-324. doi: 10.1016/j.hrthm.2016.05.024. Epub 2016 Jul 13. PMID: 27423412; PMCID: PMC5035208.
            </p>

            <p>
              Kawada S, Morita H, Antzelevitch C, Morimoto Y, Nakagawa K, Watanabe A, Nishii N, Nakamura K, Ito H. Shanghai Score System for Diagnosis of Brugada Syndrome: Validation of the Score System and System and Reclassification of the Patients. JACC Clin Electrophysiol. 2018 Jun;4(6):724-730. doi: 10.1016/j.jacep.2018.02.009. Epub 2018 Mar 28. PMID: 29929664.
            </p>

            <p>
              This calculator provides clinical decision support
              and does not replace specialist ECG interpretation,
              exclusion of phenocopies, genetic counseling or
              individualized arrhythmic-risk assessment.
            </p>
          </div>
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

function ScoreSection<T extends string>({
  number,
  title,
  subtitle,
  options,
  value,
  onChange,
  required = false,
}: {
  number: string;
  title: string;
  subtitle: string;
  options: ScoreOption<T>[];
  value: T;
  onChange: (value: T) => void;
  required?: boolean;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-200 bg-cyan-50 text-xs font-black text-cyan-700">
          {number}
        </span>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black">{title}</h3>

            {required && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
                Required
              </span>
            )}
          </div>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-cyan-300 bg-cyan-50"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span className="min-w-0">
                <span
                  className={`block font-bold ${
                    selected ? "text-slate-950" : "text-slate-600"
                  }`}
                >
                  {option.title}
                </span>

                <span className="mt-1.5 block text-sm leading-6 text-slate-500">
                  {option.description}
                </span>
              </span>

              <span
                className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-black ${
                  selected
                    ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                +{option.points}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ScoreRow({
  label,
  value,
  points,
}: {
  label: string;
  value: string;
  points: number;
}) {
  return (
    <div className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
          {label}
        </span>

        <span className="text-sm font-black text-cyan-700">
          +{points}
        </span>
      </div>

      <p className="mt-1.5 text-sm leading-5 text-slate-600">
        {value}
      </p>
    </div>
  );
}

function DiagnosticCard({
  title,
  range,
  description,
}: {
  title: string;
  range: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="font-black text-slate-950">{title}</p>

      <p className="mt-2 text-sm font-bold text-cyan-700">
        {range}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}