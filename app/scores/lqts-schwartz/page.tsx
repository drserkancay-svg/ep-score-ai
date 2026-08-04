"use client";

import Link from "next/link";
import { useState } from "react";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";

type QtcOption =
  | "normal"
  | "male-450-459"
  | "460-479"
  | "480-or-more";

type SyncopeOption =
  | "none"
  | "without-stress"
  | "with-stress";

type ScoreItem = {
  id: string;
  title: string;
  description: string;
  points: number;
};

const qtcOptions: Array<{
  value: QtcOption;
  title: string;
  description: string;
  points: number;
}> = [
  {
    value: "normal",
    title: "No qualifying resting QTc criterion",
    description:
      "Resting QTc does not meet one of the scored ranges below.",
    points: 0,
  },
  {
    value: "male-450-459",
    title: "QTc 450–459 ms in a male patient",
    description:
      "This criterion applies only to male patients.",
    points: 1,
  },
  {
    value: "460-479",
    title: "QTc 460–479 ms",
    description:
      "Resting Bazett-corrected QT interval is between 460 and 479 ms.",
    points: 2,
  },
  {
    value: "480-or-more",
    title: "QTc ≥480 ms",
    description:
      "Resting Bazett-corrected QT interval is 480 ms or greater.",
    points: 3.5,
  },
];

const syncopeOptions: Array<{
  value: SyncopeOption;
  title: string;
  description: string;
  points: number;
}> = [
  {
    value: "none",
    title: "No qualifying syncope",
    description:
      "No syncope considered compatible with long QT syndrome.",
    points: 0,
  },
  {
    value: "without-stress",
    title: "Syncope without stress",
    description:
      "Syncope occurred without exercise, emotional stress or another adrenergic trigger.",
    points: 1,
  },
  {
    value: "with-stress",
    title: "Syncope with stress",
    description:
      "Syncope occurred during exercise, emotional stress or another adrenergic trigger.",
    points: 2,
  },
];

const ecgItems: ScoreItem[] = [
  {
    id: "exercise-recovery",
    title: "QTc ≥480 ms during the fourth minute of exercise recovery",
    description:
      "Bazett-corrected QT interval is at least 480 ms at minute four of recovery.",
    points: 1,
  },
  {
    id: "torsades",
    title: "Torsades de pointes",
    description:
      "Documented torsades de pointes. Do not count this together with syncope caused by the same event.",
    points: 2,
  },
  {
    id: "t-wave-alternans",
    title: "T-wave alternans",
    description:
      "Beat-to-beat alternation in T-wave amplitude or polarity is present.",
    points: 1,
  },
  {
    id: "notched-t-wave",
    title: "Notched T wave in three leads",
    description:
      "Notched T-wave morphology is present in at least three ECG leads.",
    points: 1,
  },
  {
    id: "low-heart-rate",
    title: "Low resting heart rate for age",
    description:
      "Resting heart rate is below the second centile for age.",
    points: 0.5,
  },
];

const clinicalItems: ScoreItem[] = [
  {
    id: "congenital-deafness",
    title: "Congenital deafness",
    description:
      "Congenital sensorineural hearing loss is present.",
    points: 0.5,
  },
];

const familyItems: ScoreItem[] = [
  {
    id: "family-lqts",
    title: "Family member with clinical or molecular LQTS diagnosis",
    description:
      "A family member has a clinical or molecular diagnosis of long QT syndrome.",
    points: 1,
  },
  {
    id: "family-scd",
    title: "Unexplained sudden cardiac death before age 30",
    description:
      "Unexplained sudden cardiac death occurred before age 30 in an immediate family member.",
    points: 0.5,
  },
];

const geneticItems: ScoreItem[] = [
  {
    id: "pathogenic-variant",
    title: "Pathogenic variant in an LQTS-associated gene",
    description:
      "A pathogenic or likely pathogenic variant in a gene known to cause long QT syndrome is present.",
    points: 3.5,
  },
];

const allCheckboxItems: ScoreItem[] = [
  ...ecgItems,
  ...clinicalItems,
  ...familyItems,
  ...geneticItems,
];

function getInterpretation(score: number) {
  if (score <= 1) {
    return {
      title: "Low probability",
      range: "≤1 point",
      description:
        "The score indicates a low clinical probability of long QT syndrome.",
      panelClass: "border-cyan-200 bg-cyan-50",
      textClass: "text-cyan-700",
    };
  }

  if (score <= 3) {
    return {
      title: "Intermediate probability",
      range: "1.5–3 points",
      description:
        "The score indicates an intermediate probability of long QT syndrome. Further specialist evaluation may be appropriate.",
      panelClass: "border-amber-200 bg-amber-50",
      textClass: "text-amber-700",
    };
  }

  return {
    title: "Clinical diagnosis supported",
    range: ">3 points",
    description:
      "In the absence of a secondary cause of QT prolongation, this score supports a clinical diagnosis of long QT syndrome.",
    panelClass: "border-rose-200 bg-rose-50",
    textClass: "text-rose-700",
  };
}

export default function LqtsSchwartzPage() {
  const [qtc, setQtc] = useState<QtcOption>("normal");
  const [syncope, setSyncope] =
    useState<SyncopeOption>("none");
  const [selectedItems, setSelectedItems] =
    useState<string[]>([]);

  const selectedQtc =
    qtcOptions.find((item) => item.value === qtc) ??
    qtcOptions[0];

  const selectedSyncope =
    syncopeOptions.find((item) => item.value === syncope) ??
    syncopeOptions[0];

  const checkboxPoints = allCheckboxItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.points, 0);

  const score =
    selectedQtc.points +
    selectedSyncope.points +
    checkboxPoints;

  const interpretation = getInterpretation(score);

  function toggleItem(id: string) {
    setSelectedItems((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function resetCalculator() {
    setQtc("normal");
    setSyncope("none");
    setSelectedItems([]);
  }
  function generatePdfReport() {
    const selectedComponents = allCheckboxItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => `${item.title}: +${item.points}`);

    const riskLevel = score > 3 ? "high" : score > 1 ? "moderate" : "low";

    buildClinicalReport({
      calculatorId: "lqts-schwartz",
      score: `${score} point${score === 1 ? "" : "s"}`,
      riskLabel: interpretation.title,
      riskLevel,
      interpretation: interpretation.description,
      components: [
        `Resting QTc criterion: ${selectedQtc.title} (+${selectedQtc.points})`,
        `Syncope criterion: ${selectedSyncope.title} (+${selectedSyncope.points})`,
        ...selectedComponents,
        `Total Schwartz score: ${score} points`,
      ],
    });
  }


  function displayScore(value: number) {
    return value % 1 === 0
      ? value.toFixed(0)
      : value.toFixed(1);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-200/45 blur-[130px]" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-violet-200/35 blur-[130px]" />
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-slate-950"
          >
            ← All calculators
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="max-w-4xl">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
            Inherited arrhythmias
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            LQTS Schwartz Score
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Assesses the diagnostic probability of congenital long QT
            syndrome using ECG, clinical, family-history and genetic
            findings.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
            Before scoring
          </p>

          <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-600">
            ECG findings should be assessed in the absence of drugs,
            electrolyte abnormalities or other disorders known to prolong
            the QT interval. Resting QTc should be calculated with the
            Bazett formula.
          </p>
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-5">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between gap-4">
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
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                >
                  Reset
                </button>
              </div>
            </section>

            <RadioSection
              number="01"
              title="Resting QTc"
              subtitle="Select only one resting QTc category."
              options={qtcOptions}
              value={qtc}
              onChange={setQtc}
            />

            <CheckboxSection
              number="02"
              title="Additional ECG findings"
              subtitle="Select each independent finding that applies."
              items={ecgItems}
              selectedItems={selectedItems}
              onToggle={toggleItem}
            />

            <RadioSection
              number="03"
              title="Syncope"
              subtitle="Select only the highest applicable syncope category."
              options={syncopeOptions}
              value={syncope}
              onChange={setSyncope}
            />

            <CheckboxSection
              number="04"
              title="Clinical history"
              subtitle="Select the finding if present."
              items={clinicalItems}
              selectedItems={selectedItems}
              onToggle={toggleItem}
            />

            <CheckboxSection
              number="05"
              title="Family history"
              subtitle="The same family member should not be used for both family-history criteria."
              items={familyItems}
              selectedItems={selectedItems}
              onToggle={toggleItem}
            />

            <CheckboxSection
              number="06"
              title="Genetic finding"
              subtitle="Use only a clinically classified pathogenic or likely pathogenic variant."
              items={geneticItems}
              selectedItems={selectedItems}
              onToggle={toggleItem}
            />
          </section>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 backdrop-blur-xl">
              <div className="border-b border-slate-200 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Schwartz score
                </p>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-7xl font-black tracking-[-0.08em]">
                    {displayScore(score)}
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
                  {interpretation.title}
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {interpretation.range}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {interpretation.description}
                </p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                Selected primary criteria
              </p>

              <div className="mt-4 space-y-4">
                <ScoreRow
                  label="Resting QTc"
                  value={selectedQtc.title}
                  points={selectedQtc.points}
                />

                <ScoreRow
                  label="Syncope"
                  value={selectedSyncope.title}
                  points={selectedSyncope.points}
                />
              </div>
            </section>

            {selectedItems.includes("torsades") &&
              syncope !== "none" && (
                <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
                    Check for double counting
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Torsades de pointes and syncope are mutually exclusive
                    when they represent the same clinical event.
                  </p>
                </section>
              )}
          </aside>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            Interpretation
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InterpretationCard
              title="Low probability"
              range="≤1 point"
              description="Low clinical probability of LQTS."
            />

            <InterpretationCard
              title="Intermediate probability"
              range="1.5–3 points"
              description="Further clinical assessment may be required."
            />

            <InterpretationCard
              title="Clinical diagnosis supported"
              range=">3 points"
              description="Supports LQTS diagnosis when secondary causes are absent."
            />
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <h2 className="font-black text-amber-800">
            Clinical limitations
          </h2>

          <div className="mt-3 max-w-5xl space-y-2 text-sm leading-7 text-slate-500">
            <p>
              This is a diagnostic support score and does not predict an
              individual patient&apos;s future arrhythmic-event risk.
            </p>

            <p>
              Acquired QT prolongation from medication, electrolyte
              disturbance, bradyarrhythmia or systemic disease should be
              excluded before interpreting the score.
            </p>

            <p>
              A pathogenic LQTS-associated genetic variant can establish
              the diagnosis even when the resting QTc is normal.
            </p>

            <p>
              Management decisions require specialist assessment,
              genotype interpretation and individualized risk evaluation.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            References
          </p>

          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-500">
            <p>
              Schwartz PJ, Crotti L, Insolia R. Long-QT syndrome: from genetics to management. Circ Arrhythm Electrophysiol. 2012 Aug 1;5(4):868-77. doi: 10.1161/CIRCEP.111.962019. Erratum in: Circ Arrhythm Electrophysiol. 2012 Dec;5(6):e119-20. PMID: 22895603; PMCID: PMC3461497.
            </p>

            <p>
              Zeppenfeld K, Tfelt-Hansen J, de Riva M, Winkel BG, Behr ER, Blom NA, Charron P, Corrado D, Dagres N, de Chillou C, Eckardt L, Friede T, Haugaa KH, Hocini M, Lambiase PD, Marijon E, Merino JL, Peichl P, Priori SG, Reichlin T, Schulz-Menger J, Sticherling C, Tzeis S, Verstrael A, Volterrani M; ESC Scientific Document Group. 2022 ESC Guidelines for the management of patients with ventricular arrhythmias and the prevention of sudden cardiac death. Eur Heart J. 2022 Oct 21;43(40):3997-4126. doi: 10.1093/eurheartj/ehac262. PMID: 36017572.
            </p>

            <p>
              This calculator provides clinical decision support and does
              not replace expert ECG review or inherited-arrhythmia
              consultation.
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

function RadioSection<T extends string>({
  number,
  title,
  subtitle,
  options,
  value,
  onChange,
}: {
  number: string;
  title: string;
  subtitle: string;
  options: Array<{
    value: T;
    title: string;
    description: string;
    points: number;
  }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
      <SectionHeader
        number={number}
        title={title}
        subtitle={subtitle}
      />

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
              <span>
                <span
                  className={`block font-bold ${
                    selected ? "text-slate-950" : "text-slate-700"
                  }`}
                >
                  {option.title}
                </span>

                <span className="mt-1.5 block text-sm leading-6 text-slate-500">
                  {option.description}
                </span>
              </span>

              <PointBadge
                points={option.points}
                selected={selected}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CheckboxSection({
  number,
  title,
  subtitle,
  items,
  selectedItems,
  onToggle,
}: {
  number: string;
  title: string;
  subtitle: string;
  items: ScoreItem[];
  selectedItems: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
      <SectionHeader
        number={number}
        title={title}
        subtitle={subtitle}
      />

      <div className="mt-5 space-y-2">
        {items.map((item) => {
          const selected = selectedItems.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(item.id)}
              className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-cyan-300 bg-cyan-50"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span>
                <span
                  className={`block font-bold ${
                    selected ? "text-slate-950" : "text-slate-700"
                  }`}
                >
                  {item.title}
                </span>

                <span className="mt-1.5 block text-sm leading-6 text-slate-500">
                  {item.description}
                </span>
              </span>

              <PointBadge
                points={item.points}
                selected={selected}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-200 bg-cyan-50 text-xs font-black text-cyan-700">
        {number}
      </span>

      <div>
        <h3 className="text-xl font-black">{title}</h3>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function PointBadge({
  points,
  selected,
}: {
  points: number;
  selected: boolean;
}) {
  return (
    <span
      className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-black ${
        selected
          ? "border-cyan-200 bg-cyan-50 text-cyan-700"
          : "border-slate-200 bg-white text-slate-500"
      }`}
    >
      +{points}
    </span>
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
    <div className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
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

function InterpretationCard({
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