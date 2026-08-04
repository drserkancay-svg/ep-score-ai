"use client";

import Link from "next/link";
import { useState } from "react";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";

type NumericFieldKey =
  | "age"
  | "maxWallThickness"
  | "leftAtrialDiameter"
  | "lvotGradient";

type NumericValues = Record<NumericFieldKey, string>;

const initialValues: NumericValues = {
  age: "",
  maxWallThickness: "",
  leftAtrialDiameter: "",
  lvotGradient: "",
};

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
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      <path d="M6.5 12h3l1.3-3 2.4 6 1.4-3H18" />
    </svg>
  );
}

function calculateHcmRisk({
  age,
  maxWallThickness,
  leftAtrialDiameter,
  lvotGradient,
  familyHistory,
  nsvt,
  unexplainedSyncope,
}: {
  age: number;
  maxWallThickness: number;
  leftAtrialDiameter: number;
  lvotGradient: number;
  familyHistory: boolean;
  nsvt: boolean;
  unexplainedSyncope: boolean;
}) {
  const prognosticIndex =
    0.15939858 * maxWallThickness -
    0.00294271 * maxWallThickness ** 2 +
    0.0259082 * leftAtrialDiameter +
    0.00446131 * lvotGradient +
    0.4583082 * Number(familyHistory) +
    0.82639195 * Number(nsvt) +
    0.71650361 * Number(unexplainedSyncope) -
    0.01799934 * age;

  const fiveYearRisk =
    (1 - Math.pow(0.998, Math.exp(prognosticIndex))) * 100;

  return {
    prognosticIndex,
    fiveYearRisk: Math.max(0, Math.min(fiveYearRisk, 100)),
  };
}

function getInterpretation(risk: number) {
  if (risk < 4) {
    return {
      level: "Lower estimated risk",
      range: "<4% at 5 years",
      description:
        "The estimated five-year sudden cardiac death risk is below 4%. ICD implantation is generally not indicated solely on the basis of this model, but additional clinical risk modifiers must still be reviewed.",
      panelClass:
        "border-emerald-200 bg-emerald-50",
      textClass: "text-emerald-700",
    };
  }

  if (risk < 6) {
    return {
      level: "Intermediate estimated risk",
      range: "4% to <6% at 5 years",
      description:
        "The estimated risk lies within the intermediate range. Individualized discussion of ICD therapy may be appropriate after consideration of additional clinical and imaging factors.",
      panelClass:
        "border-amber-200 bg-amber-50",
      textClass: "text-amber-700",
    };
  }

  return {
    level: "Higher estimated risk",
    range: "≥6% at 5 years",
    description:
      "The estimated five-year risk is at least 6%. Evaluation for primary-prevention ICD therapy should be considered in the context of comprehensive specialist assessment.",
    panelClass: "border-rose-200 bg-rose-50",
    textClass: "text-rose-700",
  };
}

export default function HcmRiskScdPage() {
  const [values, setValues] =
    useState<NumericValues>(initialValues);

  const [familyHistory, setFamilyHistory] = useState(false);
  const [nsvt, setNsvt] = useState(false);
  const [unexplainedSyncope, setUnexplainedSyncope] =
    useState(false);

  const parsedValues = {
    age: Number(values.age),
    maxWallThickness: Number(values.maxWallThickness),
    leftAtrialDiameter: Number(values.leftAtrialDiameter),
    lvotGradient: Number(values.lvotGradient),
  };

  const allNumericFieldsCompleted = Object.values(values).every(
    (value) => value.trim() !== "",
  );

  const fieldsValid =
    allNumericFieldsCompleted &&
    parsedValues.age >= 16 &&
    parsedValues.age <= 100 &&
    parsedValues.maxWallThickness >= 10 &&
    parsedValues.maxWallThickness <= 50 &&
    parsedValues.leftAtrialDiameter >= 20 &&
    parsedValues.leftAtrialDiameter <= 80 &&
    parsedValues.lvotGradient >= 0 &&
    parsedValues.lvotGradient <= 250;

  const result = fieldsValid
    ? calculateHcmRisk({
        ...parsedValues,
        familyHistory,
        nsvt,
        unexplainedSyncope,
      })
    : null;

  const interpretation = result
    ? getInterpretation(result.fiveYearRisk)
    : null;

  function updateValue(
    key: NumericFieldKey,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const hasEnteredValues =
    Object.values(values).some((value) => value.trim() !== "") ||
    familyHistory ||
    nsvt ||
    unexplainedSyncope;

  function resetCalculator() {
    setValues(initialValues);
    setFamilyHistory(false);
    setNsvt(false);
    setUnexplainedSyncope(false);
  }

  function generatePdfReport() {
    if (!result || !interpretation) return;

    const riskLevel =
      result.fiveYearRisk >= 6
        ? "high"
        : result.fiveYearRisk >= 4
          ? "moderate"
          : "low";

    const components = [
      `Age: ${values.age} years`,
      `Maximum LV wall thickness: ${values.maxWallThickness} mm`,
      `Left atrial diameter: ${values.leftAtrialDiameter} mm`,
      `Maximum LVOT gradient: ${values.lvotGradient} mmHg`,
      `Family history of sudden cardiac death: ${familyHistory ? "Yes" : "No"}`,
      `Non-sustained ventricular tachycardia: ${nsvt ? "Yes" : "No"}`,
      `Unexplained syncope: ${unexplainedSyncope ? "Yes" : "No"}`,
      `Prognostic index: ${result.prognosticIndex.toFixed(4)}`,
      `Estimated 5-year SCD risk: ${result.fiveYearRisk.toFixed(2)}%`,
    ];

    buildClinicalReport({
      calculatorId: "hcm-risk-scd",
      score: `${result.fiveYearRisk.toFixed(2)}%`,
      riskLabel: interpretation.level,
      riskLevel,
      interpretation: interpretation.description,
      components,
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
            <HeartPulseIcon />
            Sudden cardiac death
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            HCM Risk-SCD
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Estimates the five-year risk of sudden cardiac death
            in adults with hypertrophic cardiomyopathy using the
            ESC HCM Risk-SCD model.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-violet-400/15 bg-violet-400/[0.05] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
            Intended population
          </p>

          <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-600">
            Use in patients aged 16 years or older with
            hypertrophic cardiomyopathy who are undergoing
            primary-prevention sudden cardiac death risk
            assessment. This model is not intended for survivors
            of cardiac arrest or patients with previous sustained
            ventricular tachycardia.
          </p>
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Clinical variables
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Enter patient data
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={generatePdfReport}
                  disabled={!result || !interpretation}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-600 bg-cyan-600 px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-cyan-100 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                  Generate Clinical PDF Report
                </button>

                <button
                  type="button"
                  onClick={resetCalculator}
                  disabled={!hasEnteredValues}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ResetIcon />
                  Reset calculator
                </button>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Age"
                description="Age at clinical evaluation."
                value={values.age}
                unit="years"
                min={16}
                max={100}
                placeholder="e.g. 48"
                onChange={(value) =>
                  updateValue("age", value)
                }
              />

              <NumberField
                label="Maximum LV wall thickness"
                description="Maximum measured LV wall thickness."
                value={values.maxWallThickness}
                unit="mm"
                min={10}
                max={50}
                step={0.1}
                placeholder="e.g. 22"
                onChange={(value) =>
                  updateValue("maxWallThickness", value)
                }
              />

              <NumberField
                label="Left atrial diameter"
                description="Anteroposterior left atrial diameter."
                value={values.leftAtrialDiameter}
                unit="mm"
                min={20}
                max={80}
                step={0.1}
                placeholder="e.g. 43"
                onChange={(value) =>
                  updateValue("leftAtrialDiameter", value)
                }
              />

              <NumberField
                label="Maximum LVOT gradient"
                description="Maximum resting or provoked gradient."
                value={values.lvotGradient}
                unit="mmHg"
                min={0}
                max={250}
                step={0.1}
                placeholder="e.g. 35"
                onChange={(value) =>
                  updateValue("lvotGradient", value)
                }
              />
            </div>

            <div className="mt-5 space-y-3">
              <ToggleFactor
                title="Family history of sudden cardiac death"
                description="Sudden cardiac death in an appropriate first-degree relative or a relative with confirmed HCM."
                selected={familyHistory}
                onClick={() =>
                  setFamilyHistory((current) => !current)
                }
              />

              <ToggleFactor
                title="Non-sustained ventricular tachycardia"
                description="NSVT documented during ambulatory ECG monitoring."
                selected={nsvt}
                onClick={() =>
                  setNsvt((current) => !current)
                }
              />

              <ToggleFactor
                title="Unexplained syncope"
                description="Recent unexplained syncope considered potentially arrhythmic."
                selected={unexplainedSyncope}
                onClick={() =>
                  setUnexplainedSyncope(
                    (current) => !current,
                  )
                }
              />
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 backdrop-blur-xl">
              <div className="border-b border-slate-200 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Estimated 5-year SCD risk
                </p>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-6xl font-black tracking-[-0.07em] sm:text-7xl">
                    {result
                      ? result.fiveYearRisk.toFixed(2)
                      : "—"}
                  </span>

                  <span className="pb-2 text-lg font-bold text-slate-500">
                    %
                  </span>
                </div>
              </div>

              {!result || !interpretation ? (
                <div className="m-5 rounded-2xl border border-slate-200 bg-white/90 p-5">
                  <p className="text-sm font-semibold text-slate-600">
                    Complete all numeric fields
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A risk estimate will appear after valid values
                    have been entered.
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

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {interpretation.range}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {interpretation.description}
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                Entered data
              </p>

              <div className="mt-4 space-y-3">
                <SummaryRow
                  label="Age"
                  value={
                    values.age
                      ? `${values.age} years`
                      : "Not entered"
                  }
                />

                <SummaryRow
                  label="Maximum wall thickness"
                  value={
                    values.maxWallThickness
                      ? `${values.maxWallThickness} mm`
                      : "Not entered"
                  }
                />

                <SummaryRow
                  label="Left atrial diameter"
                  value={
                    values.leftAtrialDiameter
                      ? `${values.leftAtrialDiameter} mm`
                      : "Not entered"
                  }
                />

                <SummaryRow
                  label="Maximum LVOT gradient"
                  value={
                    values.lvotGradient
                      ? `${values.lvotGradient} mmHg`
                      : "Not entered"
                  }
                />

                <SummaryRow
                  label="Family history"
                  value={familyHistory ? "Yes" : "No"}
                />

                <SummaryRow
                  label="NSVT"
                  value={nsvt ? "Yes" : "No"}
                />

                <SummaryRow
                  label="Unexplained syncope"
                  value={unexplainedSyncope ? "Yes" : "No"}
                />
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            ESC risk categories
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <RiskCard
              title="Lower estimated risk"
              range="<4% at 5 years"
              description="ICD generally not indicated solely by the calculated estimate."
              className="border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-700"
            />

            <RiskCard
              title="Intermediate risk"
              range="4% to <6%"
              description="ICD may be considered after individualized assessment."
              className="border-amber-200 bg-amber-50 text-amber-700"
            />

            <RiskCard
              title="Higher estimated risk"
              range="≥6% at 5 years"
              description="Primary-prevention ICD evaluation should be considered."
              className="border-rose-200 bg-rose-400/[0.05] text-rose-700"
            />
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <h2 className="font-black text-amber-800">
            Important clinical limitations
          </h2>

          <div className="mt-3 max-w-5xl space-y-2 text-sm leading-7 text-slate-500">
            <p>
              The result must not be used as the sole basis for an
              ICD decision. Extensive late gadolinium enhancement,
              LV systolic dysfunction, apical aneurysm, genotype,
              competing mortality, comorbidities and patient
              preferences may alter the final assessment.
            </p>

            <p>
              Exercise caution in patients with maximum wall
              thickness of 35 mm or more and in patients previously
              treated with surgical myectomy or alcohol septal
              ablation.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            References
          </p>

          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-500">
            <p>
              O&apos;Mahony C, Jichi F, Pavlou M, Monserrat L, Anastasakis A, Rapezzi C, Biagini E, Gimeno JR, Limongelli G, McKenna WJ, Omar RZ, Elliott PM; Hypertrophic Cardiomyopathy Outcomes Investigators. A novel clinical risk prediction model for sudden cardiac death in hypertrophic cardiomyopathy (HCM risk-SCD). Eur Heart J. 2014 Aug 7;35(30):2010-20. doi: 10.1093/eurheartj/eht439. Epub 2013 Oct 14. PMID: 24126876.
            </p>

            <p>
              Authors/Task Force members; Elliott PM, Anastasakis A, Borger MA, Borggrefe M, Cecchi F, Charron P, Hagege AA, Lafont A, Limongelli G, Mahrholdt H, McKenna WJ, Mogensen J, Nihoyannopoulos P, Nistri S, Pieper PG, Pieske B, Rapezzi C, Rutten FH, Tillmanns C, Watkins H. 2014 ESC Guidelines on diagnosis and management of hypertrophic cardiomyopathy: the Task Force for the Diagnosis and Management of Hypertrophic Cardiomyopathy of the European Society of Cardiology (ESC). Eur Heart J. 2014 Oct 14;35(39):2733-79. doi: 10.1093/eurheartj/ehu284. Epub 2014 Aug 29. PMID: 25173338.
            </p>

            <p>
              This calculator provides clinical decision support
              and does not replace comprehensive evaluation by an
              experienced cardiomyopathy or electrophysiology
              specialist.
            </p>
          </div>
        </section>
      </section>
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
  step = 1,
  placeholder,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const numericValue = Number(value);

  const invalid =
    value !== "" &&
    (numericValue < min || numericValue > max);

  return (
    <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <span className="block font-bold">{label}</span>

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
          step={step}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
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
          invalid ? "text-rose-700" : "text-slate-700"
        }`}
      >
        Accepted range: {min}–{max} {unit}
      </span>
    </label>
  );
}

function ToggleFactor({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
        selected
          ? "border-cyan-300 bg-cyan-50"
          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white/90"
      }`}
    >
      <span
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border ${
          selected
            ? "border-cyan-300 bg-cyan-600 text-[#020617]"
            : "border-slate-300 bg-white text-transparent"
        }`}
      >
        <CheckIcon />
      </span>

      <span className="min-w-0">
        <span className="block font-bold">{title}</span>

        <span className="mt-1.5 block text-sm leading-6 text-slate-500">
          {description}
        </span>
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
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}

function RiskCard({
  title,
  range,
  description,
  className,
}: {
  title: string;
  range: string;
  description: string;
  className: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${className}`}>
      <p className="font-black">{title}</p>

      <p className="mt-2 text-sm font-bold">{range}</p>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}