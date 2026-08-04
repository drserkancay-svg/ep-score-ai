"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";

type Sex = "male" | "female";

type FormulaKey =
  | "bazett"
  | "fridericia"
  | "framingham"
  | "hodges";

type QtcResults = Record<FormulaKey, number>;

const formulaDefinitions: {
  key: FormulaKey;
  name: string;
  abbreviation: string;
  formula: string;
  description: string;
}[] = [
  {
    key: "bazett",
    name: "Bazett",
    abbreviation: "QTcB",
    formula: "QT / √RR",
    description:
      "The most commonly reported correction, but it may overcorrect at high heart rates and undercorrect at low heart rates.",
  },
  {
    key: "fridericia",
    name: "Fridericia",
    abbreviation: "QTcF",
    formula: "QT / ∛RR",
    description:
      "Cube-root correction that generally shows less heart-rate dependence than Bazett.",
  },
  {
    key: "framingham",
    name: "Framingham",
    abbreviation: "QTcFram",
    formula: "QT + 154 × (1 − RR)",
    description:
      "A linear correction derived from the Framingham Heart Study.",
  },
  {
    key: "hodges",
    name: "Hodges",
    abbreviation: "QTcH",
    formula: "QT + 1.75 × (HR − 60)",
    description:
      "A linear heart-rate correction expressed directly using beats per minute.",
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
    </svg>
  );
}

function calculateQtc(
  qtMilliseconds: number,
  heartRate: number,
): QtcResults {
  const rrSeconds = 60 / heartRate;

  return {
    bazett: qtMilliseconds / Math.sqrt(rrSeconds),

    fridericia:
      qtMilliseconds / Math.cbrt(rrSeconds),

    framingham:
      qtMilliseconds + 154 * (1 - rrSeconds),

    hodges:
      qtMilliseconds + 1.75 * (heartRate - 60),
  };
}

function getInterpretation(
  qtc: number,
  sex: Sex,
) {
  const prolongedThreshold = sex === "male" ? 450 : 460;

  if (qtc < 350) {
    return {
      level: "Short QT range",
      description:
        "The calculated QTc is below 350 ms. Confirm the measurement manually and evaluate the clinical context.",
      panelClass:
        "border-violet-200 bg-violet-50",
      textClass: "text-violet-700",
    };
  }

  if (qtc < prolongedThreshold) {
    return {
      level: "Within reference range",
      description:
        `The calculated QTc is below the selected prolonged-QT reference threshold of ${prolongedThreshold} ms.`,
      panelClass:
        "border-emerald-200 bg-emerald-50",
      textClass: "text-emerald-700",
    };
  }

  if (qtc < 500) {
    return {
      level: "Prolonged QTc",
      description:
        `The calculated QTc is at or above ${prolongedThreshold} ms but remains below 500 ms. Review medications, electrolytes, QRS duration and clinical context.`,
      panelClass:
        "border-amber-200 bg-amber-50",
      textClass: "text-amber-700",
    };
  }

  return {
    level: "Markedly prolonged QTc",
    description:
      "The calculated QTc is at least 500 ms. Confirm the measurement and promptly evaluate reversible and inherited causes.",
    panelClass:
      "border-rose-200 bg-rose-50",
    textClass: "text-rose-700",
  };
}

export default function QtcPage() {
  const [qt, setQt] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [selectedFormula, setSelectedFormula] =
    useState<FormulaKey>("fridericia");

  const numericQt = Number(qt);
  const numericHeartRate = Number(heartRate);

  const qtValid =
    qt !== "" &&
    numericQt >= 200 &&
    numericQt <= 700;

  const heartRateValid =
    heartRate !== "" &&
    numericHeartRate >= 20 &&
    numericHeartRate <= 250;

  const results = useMemo(() => {
    if (!qtValid || !heartRateValid) {
      return null;
    }

    return calculateQtc(
      numericQt,
      numericHeartRate,
    );
  }, [
    qtValid,
    heartRateValid,
    numericQt,
    numericHeartRate,
  ]);

  const rrInterval = heartRateValid
    ? 60 / numericHeartRate
    : null;

  const selectedResult = results
    ? results[selectedFormula]
    : null;

  const interpretation =
    selectedResult !== null
      ? getInterpretation(selectedResult, sex)
      : null;

  function resetCalculator() {
    setQt("");
    setHeartRate("");
    setSex("male");
    setSelectedFormula("fridericia");
  }
  function generatePdfReport() {
    if (!results || selectedResult === null || !interpretation) return;

    const riskLevel =
      selectedResult >= 500
        ? "high"
        : selectedResult >= (sex === "male" ? 450 : 460)
          ? "moderate"
          : "low";

    buildClinicalReport({
      calculatorId: "qtc",
      score: `${Math.round(selectedResult)} ms`,
      riskLabel: interpretation.level,
      riskLevel,
      interpretation: interpretation.description,
      components: [
        `Sex: ${sex === "male" ? "Male" : "Female"}`,
        `Measured QT interval: ${numericQt} ms`,
        `Heart rate: ${numericHeartRate} bpm`,
        `RR interval: ${(60 / numericHeartRate).toFixed(3)} s`,
        `Selected formula: ${formulaDefinitions.find((formula) => formula.key === selectedFormula)?.name ?? selectedFormula}`,
        ...formulaDefinitions.map(
          (formula) => `${formula.name}: ${Math.round(results[formula.key])} ms`,
        ),
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
            ECG intervals
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Corrected QT Interval
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Calculates the heart-rate-corrected QT interval using
            Bazett, Fridericia, Framingham and Hodges formulas.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-violet-400/15 bg-violet-400/[0.05] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
            Measurement guidance
          </p>

          <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-600">
            Enter the manually measured QT interval from the beginning
            of the QRS complex to the end of the T wave. When rhythm is
            irregular, assessment across several representative beats
            may be necessary.
          </p>
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  ECG variables
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Enter QT and heart rate
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

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Measured QT interval"
                description="QT interval measured directly from the ECG."
                value={qt}
                unit="ms"
                min={200}
                max={700}
                placeholder="e.g. 410"
                onChange={setQt}
              />

              <NumberField
                label="Heart rate"
                description="Heart rate at the time of QT measurement."
                value={heartRate}
                unit="bpm"
                min={20}
                max={250}
                placeholder="e.g. 72"
                onChange={setHeartRate}
              />
            </div>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="font-bold">
                Reference sex category
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Used only for the displayed prolonged-QT reference
                threshold. It does not alter the QTc calculation.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <OptionButton
                  selected={sex === "male"}
                  label="Male"
                  sublabel="Threshold 450 ms"
                  onClick={() => setSex("male")}
                />

                <OptionButton
                  selected={sex === "female"}
                  label="Female"
                  sublabel="Threshold 460 ms"
                  onClick={() => setSex("female")}
                />
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h3 className="font-bold">
                Primary displayed formula
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                All formulas are calculated. Select which result should
                be emphasized and interpreted.
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {formulaDefinitions.map((formula) => (
                  <OptionButton
                    key={formula.key}
                    selected={
                      selectedFormula === formula.key
                    }
                    label={formula.name}
                    sublabel={formula.formula}
                    onClick={() =>
                      setSelectedFormula(formula.key)
                    }
                  />
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 backdrop-blur-xl">
              <div className="border-b border-slate-200 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Selected QTc result
                </p>

                <p className="mt-3 text-sm font-bold text-cyan-700">
                  {
                    formulaDefinitions.find(
                      (formula) =>
                        formula.key === selectedFormula,
                    )?.name
                  }
                </p>

                <div className="mt-3 flex items-end gap-3">
                  <span className="text-6xl font-black tracking-[-0.07em] sm:text-7xl">
                    {selectedResult !== null
                      ? Math.round(selectedResult)
                      : "—"}
                  </span>

                  <span className="pb-2 text-lg font-bold text-slate-500">
                    ms
                  </span>
                </div>
              </div>

              {!interpretation ? (
                <div className="m-5 rounded-2xl border border-slate-200 bg-white/90 p-5">
                  <p className="text-sm font-semibold text-slate-600">
                    Enter valid QT and heart-rate values
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Corrected QT results will appear automatically.
                  </p>
                </div>
              ) : (
                <div
                  className={`m-5 rounded-2xl border p-5 ${interpretation.panelClass}`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.14em] ${interpretation.textClass}`}
                  >
                    {interpretation.level}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {interpretation.description}
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                ECG data
              </p>

              <div className="mt-4 space-y-3">
                <SummaryRow
                  label="Measured QT"
                  value={
                    qtValid
                      ? `${numericQt} ms`
                      : "Not entered"
                  }
                />

                <SummaryRow
                  label="Heart rate"
                  value={
                    heartRateValid
                      ? `${numericHeartRate} bpm`
                      : "Not entered"
                  }
                />

                <SummaryRow
                  label="RR interval"
                  value={
                    rrInterval !== null
                      ? `${rrInterval.toFixed(3)} s`
                      : "—"
                  }
                />

                <SummaryRow
                  label="Reference category"
                  value={
                    sex === "male"
                      ? "Male"
                      : "Female"
                  }
                />
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            Formula comparison
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {formulaDefinitions.map((formula) => {
              const value = results
                ? results[formula.key]
                : null;

              const selected =
                selectedFormula === formula.key;

              return (
                <button
                  key={formula.key}
                  type="button"
                  onClick={() =>
                    setSelectedFormula(formula.key)
                  }
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-cyan-300 bg-cyan-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">
                        {formula.name}
                      </p>

                      <p className="mt-1 text-xs font-bold text-cyan-700">
                        {formula.abbreviation}
                      </p>
                    </div>

                    <p className="text-2xl font-black text-slate-950">
                      {value !== null
                        ? Math.round(value)
                        : "—"}
                    </p>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-500">
                    {formula.formula}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {formula.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <h2 className="font-black text-amber-800">
            Important clinical considerations
          </h2>

          <div className="mt-3 max-w-5xl space-y-2 text-sm leading-7 text-slate-500">
            <p>
              QTc formulas may produce substantially different results,
              particularly at very high or very low heart rates. Always
              document which correction formula was used.
            </p>

            <p>
              In patients with bundle branch block, ventricular pacing
              or a wide QRS complex, conventional QTc may overestimate
              repolarization duration. Assessment of the JT interval or
              another wide-QRS correction method may be more
              appropriate.
            </p>

            <p>
              A single automated ECG measurement should be manually
              reviewed before making diagnostic or treatment decisions.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            References
          </p>

          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-500">
            <p>
              Rautaharju PM, Surawicz B, Gettes LS, Bailey JJ, Childers R, Deal BJ, Gorgels A, Hancock EW, Josephson M, Kligfield P, Kors JA, Macfarlane P, Mason JW, Mirvis DM, Okin P, Pahlm O, van Herpen G, Wagner GS, Wellens H; American Heart Association Electrocardiography and Arrhythmias Committee, Council on Clinical Cardiology; American College of Cardiology Foundation; Heart Rhythm Society. AHA/ACCF/HRS recommendations for the standardization and interpretation of the electrocardiogram: part IV: the ST segment, T and U waves, and the QT interval: a scientific statement from the American Heart Association Electrocardiography and Arrhythmias Committee, Council on Clinical Cardiology; the American College of Cardiology Foundation; and the Heart Rhythm Society: endorsed by the International Society for Computerized Electrocardiology. Circulation. 2009 Mar 17;119(10):e241-50. doi: 10.1161/CIRCULATIONAHA.108.191096. Epub 2009 Feb 19. PMID: 19228821.
            </p>

            <p>
              Sagie A, Larson MG, Goldberg RJ, Bengtson JR, Levy D. An improved method for adjusting the QT interval for heart rate (the Framingham Heart Study). Am J Cardiol. 1992 Sep 15;70(7):797-801. doi: 10.1016/0002-9149(92)90562-d. PMID: 1519533.
            </p>

            <p>
              This calculator provides clinical decision support and
              does not replace manual ECG interpretation, assessment
              of symptoms, medication review, electrolyte evaluation
              or specialist judgment.
            </p>
          </div>
        </section>
      </section>

      <button
        type="button"
        onClick={generatePdfReport}
        disabled={!results || selectedResult === null}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Generate PDF
      </button>
    </main>
  );
}

function NumberField({
  label,
  description,
  value,
  unit,
  min,
  max,
  placeholder,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  unit: string;
  min: number;
  max: number;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const numericValue = Number(value);

  const invalid =
    value !== "" &&
    (
      !Number.isFinite(numericValue) ||
      numericValue < min ||
      numericValue > max
    );

  return (
    <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <span className="block font-bold">
        {label}
      </span>

      <span className="mt-1.5 block min-h-12 text-sm leading-6 text-slate-500">
        {description}
      </span>

      <span className="relative mt-4 block">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step="1"
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`w-full rounded-xl border bg-white/90 px-4 py-3.5 pr-20 text-slate-950 outline-none transition placeholder:text-slate-400 ${
            invalid
              ? "border-rose-400/50 focus:border-rose-400"
              : "border-slate-200 focus:border-cyan-400"
          }`}
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-600">
          {unit}
        </span>
      </span>

      <span
        className={`mt-2 block text-xs ${
          invalid
            ? "text-rose-700"
            : "text-slate-700"
        }`}
      >
        Accepted range: {min}–{max} {unit}
      </span>
    </label>
  );
}

function OptionButton({
  selected,
  label,
  sublabel,
  onClick,
}: {
  selected: boolean;
  label: string;
  sublabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition ${
        selected
          ? "border-cyan-300 bg-cyan-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span
        className={`block font-bold ${
          selected
            ? "text-slate-950"
            : "text-slate-600"
        }`}
      >
        {label}
      </span>

      <span className="mt-1 block text-xs text-slate-600">
        {sublabel}
      </span>
    </button>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}