"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";

type YesNo = "no" | "yes";
type Gender = "female" | "male";

type CalculatorValues = {
  age: string;
  gender: Gender;
  weight: string;
  maximalWallThickness: string;
  maximalWallThicknessZScore: string;
  leftAtrialDiameter: string;
  leftAtrialDiameterZScore: string;
  lvotGradient: string;
  nsvt: YesNo;
  unexplainedSyncope: YesNo;
  previousSustainedVtVf: YesNo;
  syndromicHcm: YesNo;
};

type RiskTone = "low" | "intermediate" | "high";

type RiskResult = {
  prognosticIndex: number;
  survival: number;
  risk: number;
  category: string;
  tone: RiskTone;
};

const initialValues: CalculatorValues = {
  age: "",
  gender: "female",
  weight: "",
  maximalWallThickness: "",
  maximalWallThicknessZScore: "",
  leftAtrialDiameter: "",
  leftAtrialDiameterZScore: "",
  lvotGradient: "",
  nsvt: "no",
  unexplainedSyncope: "no",
  previousSustainedVtVf: "no",
  syndromicHcm: "no",
};

function parseClinicalNumber(value: string): number | null {
  if (value.trim() === "") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function calculateHcmRiskKids({
  maximalWallThicknessZScore,
  leftAtrialDiameterZScore,
  lvotGradient,
  nsvt,
  unexplainedSyncope,
}: {
  maximalWallThicknessZScore: number;
  leftAtrialDiameterZScore: number;
  lvotGradient: number;
  nsvt: boolean;
  unexplainedSyncope: boolean;
}): RiskResult {
  const prognosticIndex =
    0.2171364 * (maximalWallThicknessZScore - 11.09) -
    0.0047562 *
      (Math.pow(maximalWallThicknessZScore, 2) - 174.12) +
    0.130365 * (leftAtrialDiameterZScore - 1.92) +
    0.429624 * (unexplainedSyncope ? 1 : 0) +
    0.1861694 * (nsvt ? 1 : 0) -
    0.0065555 * (lvotGradient - 21.8);

  const survival = Math.pow(
    0.949437808,
    Math.exp(prognosticIndex),
  );

  const risk = clamp((1 - survival) * 100, 0, 100);

  if (risk < 4) {
    return {
      prognosticIndex,
      survival: survival * 100,
      risk,
      category: "Lower estimated risk",
      tone: "low",
    };
  }

  if (risk < 6) {
    return {
      prognosticIndex,
      survival: survival * 100,
      risk,
      category: "Intermediate estimated risk",
      tone: "intermediate",
    };
  }

  return {
    prognosticIndex,
    survival: survival * 100,
    risk,
    category: "Higher estimated risk",
    tone: "high",
  };
}

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

function HeartPulseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      <path d="M3.5 12h4l1.5-3 3 7 2-4h6.5" />
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

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 9v5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  unit,
  description,
  min,
  max,
  step = "0.1",
  required = true,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: string;
  required?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition focus-within:border-cyan-300 focus-within:bg-cyan-50">
      <label
        htmlFor={id}
        className="block text-sm font-bold text-slate-950"
      >
        {label}
        {required && (
          <span className="ml-1 text-cyan-700">*</span>
        )}
      </label>

      {description && (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}

      <div className="relative mt-3">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 ${
            unit ? "pr-24" : ""
          }`}
          placeholder="Enter value"
        />

        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function SegmentedField<T extends string>({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description?: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-4">
      <legend className="sr-only">{label}</legend>

      <p className="text-sm font-bold text-slate-950">
        {label}
        <span className="ml-1 text-cyan-700">*</span>
      </p>

      {description && (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}

      <div
        className="mt-4 grid rounded-xl border border-slate-200 bg-slate-50 p-1"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-lg px-4 py-3 text-sm font-bold transition ${
                selected
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-100"
                  : "text-slate-500 hover:text-slate-950"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function HcmRiskKidsPage() {
  const [values, setValues] =
    useState<CalculatorValues>(initialValues);

  function updateValue<K extends keyof CalculatorValues>(
    key: K,
    value: CalculatorValues[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const numericValues = useMemo(
    () => ({
      age: parseClinicalNumber(values.age),
      weight: parseClinicalNumber(values.weight),
      maximalWallThickness: parseClinicalNumber(
        values.maximalWallThickness,
      ),
      maximalWallThicknessZScore: parseClinicalNumber(
        values.maximalWallThicknessZScore,
      ),
      leftAtrialDiameter: parseClinicalNumber(
        values.leftAtrialDiameter,
      ),
      leftAtrialDiameterZScore: parseClinicalNumber(
        values.leftAtrialDiameterZScore,
      ),
      lvotGradient: parseClinicalNumber(values.lvotGradient),
    }),
    [values],
  );

  const eligibilityProblems = useMemo(() => {
    const problems: string[] = [];

    if (
      numericValues.age !== null &&
      (numericValues.age < 1 || numericValues.age > 16)
    ) {
      problems.push(
        "Age is outside the validated range of 1–16 years.",
      );
    }

    if (values.previousSustainedVtVf === "yes") {
      problems.push(
        "Previous sustained VT or ventricular fibrillation is present.",
      );
    }

    if (values.syndromicHcm === "yes") {
      problems.push(
        "Syndromic or secondary hypertrophic cardiomyopathy is present.",
      );
    }

    return problems;
  }, [
    numericValues.age,
    values.previousSustainedVtVf,
    values.syndromicHcm,
  ]);

  const missingFields = useMemo(() => {
    const fields: string[] = [];

    if (numericValues.age === null) {
      fields.push("Age");
    }

    if (numericValues.weight === null) {
      fields.push("Weight");
    }

    if (numericValues.maximalWallThickness === null) {
      fields.push("Maximal LV wall thickness");
    }

    if (numericValues.maximalWallThicknessZScore === null) {
      fields.push("LVMWT Z-score");
    }

    if (numericValues.leftAtrialDiameter === null) {
      fields.push("Left atrial diameter");
    }

    if (numericValues.leftAtrialDiameterZScore === null) {
      fields.push("LA diameter Z-score");
    }

    if (numericValues.lvotGradient === null) {
      fields.push("LVOT gradient");
    }

    return fields;
  }, [numericValues]);

  const riskResult = useMemo(() => {
    if (
      eligibilityProblems.length > 0 ||
      numericValues.maximalWallThicknessZScore === null ||
      numericValues.leftAtrialDiameterZScore === null ||
      numericValues.lvotGradient === null
    ) {
      return null;
    }

    return calculateHcmRiskKids({
      maximalWallThicknessZScore:
        numericValues.maximalWallThicknessZScore,
      leftAtrialDiameterZScore:
        numericValues.leftAtrialDiameterZScore,
      lvotGradient: numericValues.lvotGradient,
      nsvt: values.nsvt === "yes",
      unexplainedSyncope:
        values.unexplainedSyncope === "yes",
    });
  }, [
    eligibilityProblems,
    numericValues.maximalWallThicknessZScore,
    numericValues.leftAtrialDiameterZScore,
    numericValues.lvotGradient,
    values.nsvt,
    values.unexplainedSyncope,
  ]);

  const resultTone = riskResult?.tone ?? "low";

  const resultBorder =
    resultTone === "high"
      ? "border-rose-200"
      : resultTone === "intermediate"
        ? "border-amber-200"
        : "border-emerald-200";

  const resultBackground =
    resultTone === "high"
      ? "bg-rose-50"
      : resultTone === "intermediate"
        ? "bg-amber-50"
        : "bg-emerald-50";

  const resultAccent =
    resultTone === "high"
      ? "text-rose-700"
      : resultTone === "intermediate"
        ? "text-amber-700"
        : "text-emerald-700";

  const gaugePosition = riskResult
    ? clamp((riskResult.risk / 15) * 100, 0, 100)
    : 0;
const hasEnteredValues = useMemo(
  () =>
    values.age !== "" ||
    values.weight !== "" ||
    values.maximalWallThickness !== "" ||
    values.maximalWallThicknessZScore !== "" ||
    values.leftAtrialDiameter !== "" ||
    values.leftAtrialDiameterZScore !== "" ||
    values.lvotGradient !== "" ||
    values.nsvt !== "no" ||
    values.unexplainedSyncope !== "no" ||
    values.previousSustainedVtVf !== "no" ||
    values.syndromicHcm !== "no" ||
    values.gender !== "female",
  [values],
);
  function resetCalculator() {
    setValues(initialValues);
  }
function generatePdfReport() {
  if (!riskResult) return;

  const interpretation =
    riskResult.tone === "high"
      ? "High estimated 5-year sudden cardiac death risk."
      : riskResult.tone === "intermediate"
        ? "Intermediate estimated 5-year sudden cardiac death risk."
        : "Lower estimated 5-year sudden cardiac death risk.";

  const components = [
    `Age: ${values.age} years`,
    `Gender: ${values.gender === "female" ? "Female" : "Male"}`,
    `Weight: ${values.weight} kg`,
    `LV maximal wall thickness: ${values.maximalWallThickness} mm`,
    `LVMWT Z-score: ${values.maximalWallThicknessZScore}`,
    `Left atrial diameter: ${values.leftAtrialDiameter} mm`,
    `LA diameter Z-score: ${values.leftAtrialDiameterZScore}`,
    `LVOT gradient: ${values.lvotGradient} mmHg`,
    `NSVT: ${values.nsvt === "yes" ? "Yes" : "No"}`,
    `Unexplained syncope: ${
      values.unexplainedSyncope === "yes" ? "Yes" : "No"
    }`,
    `Prognostic index: ${riskResult.prognosticIndex.toFixed(4)}`,
    `Estimated 5-year SCD-free survival: ${riskResult.survival.toFixed(1)}%`,
  ];

  buildClinicalReport({
    calculatorId: "hcm-risk-kids",
    score: `${riskResult.risk.toFixed(1)}%`,
    riskLabel: riskResult.category,
    riskLevel:
      riskResult.tone === "high"
        ? "high"
        : riskResult.tone === "intermediate"
          ? "moderate"
          : "low",
    interpretation,
    components,
  });
}
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
            <span>Inherited cardiomyopathy</span>
            <span>/</span>
            <span className="text-slate-700">
              HCM Risk-Kids
            </span>
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">
                Pediatric sudden cardiac death risk
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                HCM Risk-Kids
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Estimates the individual probability of
                sudden cardiac death within five years in
                children with hypertrophic cardiomyopathy.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Validated age
              </p>

              <p className="mt-1 text-2xl font-black">
                1–16 years
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
                Enter the patient data
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fields marked with an asterisk are required.
                Results update automatically.
              </p>
            </div>

            <div className="mt-7">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Demographics
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <NumberField
                  id="age"
                  label="Age"
                  value={values.age}
                  onChange={(value) =>
                    updateValue("age", value)
                  }
                  unit="years"
                  min={0}
                  max={18}
                  description="The model is validated for patients aged 1–16 years."
                />

                <SegmentedField
                  label="Gender"
                  value={values.gender}
                  options={[
                    {
                      label: "Female",
                      value: "female",
                    },
                    {
                      label: "Male",
                      value: "male",
                    },
                  ]}
                  onChange={(value) =>
                    updateValue("gender", value)
                  }
                />

                <NumberField
                  id="weight"
                  label="Weight"
                  value={values.weight}
                  onChange={(value) =>
                    updateValue("weight", value)
                  }
                  unit="kg"
                  min={0}
                  max={300}
                  description="Recorded at the time of clinical evaluation."
                />
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-7">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Echocardiography
                </p>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberField
                    id="maximal-wall-thickness"
                    label="LV maximal wall thickness"
                    value={values.maximalWallThickness}
                    onChange={(value) =>
                      updateValue(
                        "maximalWallThickness",
                        value,
                      )
                    }
                    unit="mm"
                    min={0}
                    description="Maximum LV wall thickness on transthoracic echocardiography at evaluation."
                  />

                  <NumberField
                    id="maximal-wall-thickness-z-score"
                    label="LVMWT Z-score"
                    value={
                      values.maximalWallThicknessZScore
                    }
                    onChange={(value) =>
                      updateValue(
                        "maximalWallThicknessZScore",
                        value,
                      )
                    }
                    step="0.01"
                    description="Enter a Z-score generated using a validated pediatric reference method."
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberField
                    id="left-atrial-diameter"
                    label="Left atrial diameter"
                    value={values.leftAtrialDiameter}
                    onChange={(value) =>
                      updateValue(
                        "leftAtrialDiameter",
                        value,
                      )
                    }
                    unit="mm"
                    min={0}
                    description="Measured by M-mode or 2D echocardiography in the parasternal long-axis plane."
                  />

                  <NumberField
                    id="left-atrial-diameter-z-score"
                    label="LA diameter Z-score"
                    value={
                      values.leftAtrialDiameterZScore
                    }
                    onChange={(value) =>
                      updateValue(
                        "leftAtrialDiameterZScore",
                        value,
                      )
                    }
                    step="0.01"
                    description="Enter a Z-score generated using a validated pediatric reference method."
                  />
                </div>

                <NumberField
                  id="lvot-gradient"
                  label="Left ventricular outflow tract gradient"
                  value={values.lvotGradient}
                  onChange={(value) =>
                    updateValue("lvotGradient", value)
                  }
                  unit="mmHg"
                  min={0}
                  max={300}
                  step="1"
                  description="Maximum gradient at rest or during Valsalva provocation."
                />
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-7">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Arrhythmic and clinical history
                </p>
              </div>

              <div className="grid gap-3">
                <SegmentedField
                  label="Non-sustained ventricular tachycardia"
                  value={values.nsvt}
                  options={[
                    { label: "No", value: "no" },
                    { label: "Yes", value: "yes" },
                  ]}
                  onChange={(value) =>
                    updateValue("nsvt", value)
                  }
                  description="At least 3 consecutive ventricular beats at ≥120 beats/min lasting less than 30 seconds on ambulatory monitoring."
                />

                <SegmentedField
                  label="Unexplained syncope"
                  value={values.unexplainedSyncope}
                  options={[
                    { label: "No", value: "no" },
                    { label: "Yes", value: "yes" },
                  ]}
                  onChange={(value) =>
                    updateValue(
                      "unexplainedSyncope",
                      value,
                    )
                  }
                  description="History of otherwise unexplained syncope at or before evaluation."
                />
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-7">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Model eligibility
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  These selections are not part of the
                  mathematical equation but determine
                  whether the model is applicable.
                </p>
              </div>

              <div className="grid gap-3">
                <SegmentedField
                  label="Previous sustained VT or ventricular fibrillation"
                  value={values.previousSustainedVtVf}
                  options={[
                    { label: "No", value: "no" },
                    { label: "Yes", value: "yes" },
                  ]}
                  onChange={(value) =>
                    updateValue(
                      "previousSustainedVtVf",
                      value,
                    )
                  }
                />

                <SegmentedField
                  label="Syndromic or secondary HCM"
                  value={values.syndromicHcm}
                  options={[
                    { label: "No", value: "no" },
                    { label: "Yes", value: "yes" },
                  ]}
                  onChange={(value) =>
                    updateValue("syndromicHcm", value)
                  }
                  description="Includes metabolic disease, RASopathy syndromes and neuromuscular disorders."
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-600">
                The raw measurements are displayed for
                documentation. The risk equation uses the
                corresponding Z-scores.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
  <button
    type="button"
    onClick={generatePdfReport}
    disabled={!riskResult}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-600 bg-cyan-600 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-100 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
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
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
  >
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
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v6h6" />
    </svg>

    Reset calculator
  </button>
</div>     
            </div>
          </section>

          <aside>
            <section
              className={`sticky top-6 rounded-[2rem] border p-6 backdrop-blur-xl sm:p-8 ${resultBorder} ${resultBackground}`}
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                    Estimated risk of SCD at 5 years
                  </p>

                  <div className="mt-3">
                    {riskResult ? (
                      <p className="text-7xl font-black tracking-[-0.06em]">
                        {riskResult.risk.toFixed(1)}
                        <span className="ml-1 text-3xl">
                          %
                        </span>
                      </p>
                    ) : (
                      <p className="text-7xl font-black tracking-[-0.06em] text-slate-700">
                        —
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white ${resultAccent}`}
                >
                  <HeartPulseIcon />
                </span>
              </div>

              {riskResult ? (
                <>
                  <div className="mt-7 border-t border-slate-200 pt-6">
                    <h2
                      className={`text-xl font-black ${resultAccent}`}
                    >
                      {riskResult.category}
                    </h2>

                    <p className="mt-3 leading-7 text-slate-600">
                      Individualized five-year estimate
                      generated from the published HCM
                      Risk-Kids equation.
                    </p>
                  </div>

                  <div className="mt-7">
                    <div className="relative pt-6">
                      <div className="flex h-3 overflow-hidden rounded-full">
                        <div className="w-[26.67%] bg-emerald-400" />
                        <div className="w-[13.33%] bg-amber-400" />
                        <div className="flex-1 bg-rose-400" />
                      </div>

                      <div
                        className="absolute top-0 -translate-x-1/2"
                        style={{
                          left: `${gaugePosition}%`,
                        }}
                      >
                        <div className="rounded-lg border border-slate-300 bg-slate-950 px-2 py-1 text-[10px] font-black text-slate-950 shadow-xl">
                          {riskResult.risk.toFixed(1)}%
                        </div>

                        <div className="mx-auto h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-white" />
                      </div>

                      <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600">
                        <span>0%</span>
                        <span>4%</span>
                        <span>6%</span>
                        <span>15%+</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 divide-y divide-white/8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between gap-4 px-4 py-4">
                      <span className="text-sm text-slate-500">
                        Prognostic index
                      </span>

                      <span className="font-black text-slate-950">
                        {riskResult.prognosticIndex.toFixed(
                          4,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 px-4 py-4">
                      <span className="text-sm text-slate-500">
                        Survival from SCD at 5 years
                      </span>

                      <span className="font-black text-slate-950">
                        {riskResult.survival.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 px-4 py-4">
                      <span className="text-sm text-slate-500">
                        Model eligibility
                      </span>

                      <span className="inline-flex items-center gap-2 font-bold text-emerald-700">
                        <CheckIcon />
                        Eligible
                      </span>
                    </div>
                  </div>
                </>
              ) : eligibilityProblems.length > 0 ? (
                <div className="mt-7 rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <div className="flex items-center gap-3 text-rose-700">
                    <AlertIcon />

                    <h2 className="font-black">
                      Model not applicable
                    </h2>
                  </div>

                  <div className="mt-4 space-y-3">
                    {eligibilityProblems.map((problem) => (
                      <div
                        key={problem}
                        className="flex gap-3 text-sm leading-6 text-slate-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
                        <span>{problem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-7 rounded-2xl border border-cyan-400/15 bg-cyan-50 p-5">
                  <h2 className="font-black text-cyan-700">
                    Complete the clinical variables
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter the two Z-scores and LVOT gradient
                    to generate the risk estimate.
                  </p>

                  {missingFields.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {missingFields.map((field) => (
                        <span
                          key={field}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-500"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-800">
                  Specialist interpretation required
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  The estimate should not be used as the
                  sole basis for ICD implantation. Consider
                  the complete phenotype, clinical course,
                  patient preferences and multidisciplinary
                  assessment.
                </p>
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6">
            <h2 className="font-black">
              Intended population
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Children aged 1–16 years with primary
              hypertrophic cardiomyopathy and without a
              previous sustained ventricular arrhythmia.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6">
            <h2 className="font-black">
              Model predictors
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Maximal wall thickness Z-score, left atrial
              diameter Z-score, LVOT gradient, NSVT and
              unexplained syncope.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6">
            <h2 className="font-black">
              Measurement note
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Z-scores should be obtained using an
              appropriate and validated pediatric
              echocardiographic reference method.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">
            Scientific reference
          </p>

          <h2 className="mt-3 max-w-5xl text-xl font-black leading-8">
            
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-500">
            Norrish G, Ding T, Field E, Ziólkowska L, Olivotto I, Limongelli G, Anastasakis A, Weintraub R, Biagini E, Ragni L, Prendiville T, Duignan S, McLeod K, Ilina M, Fernández A, Bökenkamp R, Baban A, Kubuš P, Daubeney PEF, Sarquella-Brugada G, Cesar S, Marrone C, Bhole V, Medrano C, Uzun O, Brown E, Gran F, Castro FJ, Stuart G, Vignati G, Barriales-Villa R, Guereta LG, Adwani S, Linter K, Bharucha T, Garcia-Pavia P, Rasmussen TB, Calcagnino MM, Jones CB, De Wilde H, Toru-Kubo J, Felice T, Mogensen J, Mathur S, Reinhardt Z, O'Mahony C, Elliott PM, Omar RZ, Kaski JP. Development of a Novel Risk Prediction Model for Sudden Cardiac Death in Childhood Hypertrophic Cardiomyopathy (HCM Risk-Kids). JAMA Cardiol. 2019 Sep 1;4(9):918-927. doi: 10.1001/jamacardio.2019.2861. PMID: 31411652; PMCID: PMC6694401.
          </p>
        </section>
      </section>
    </main>
  );
}