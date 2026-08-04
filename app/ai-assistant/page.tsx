"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Footer from "@/components/Footer";

type Confidence = "high" | "moderate" | "low";

type RiskLevel =
  | "low"
  | "intermediate"
  | "high"
  | "neutral";

type ExtractedVariable = {
  key: string;
  label: string;
  value: number | boolean | string | null;
  displayValue: string | null;
};

type MissingVariable = {
  key: string;
  label: string;
  description: string;
  unit?: string;
  allowedValues?: readonly string[];
};

type ValidationError = {
  key: string;
  label: string;
  message: string;
};

type ResultComponent = {
  label: string;
  value: string;
  points?: number;
};

type SecondaryValue = {
  label: string;
  value: string;
};

type ClinicalCalculationResult = {
  calculatorId: string;
  calculatorName: string;
  primaryValue: number;
  primaryValueDisplay: string;
  secondaryValues?: SecondaryValue[];
  riskLevel: RiskLevel;
  riskLabel: string;
  riskRange?: string;
  guidelineSummary: string;
  clinicalInterpretation: string;
  components: ResultComponent[];
};

type BaseAssistantResponse = {
  detectedCondition?: string;
  calculatorId?: string | null;
  calculatorName?: string | null;
  calculatorHref?: string;
  confidence?: Confidence;
  rationale?: string;
  extractionNotes?: string[];
  message?: string;
};

type CompleteResponse = BaseAssistantResponse & {
  status: "complete";
  calculatorId: string;
  calculatorName: string;
  extractedVariables: ExtractedVariable[];
  result: ClinicalCalculationResult;
  disclaimer: string;
};

type MissingDataResponse = BaseAssistantResponse & {
  status: "missing-data";
  calculatorId: string;
  calculatorName: string;
  extractedVariables: ExtractedVariable[];
  missingVariables: MissingVariable[];
};

type InvalidDataResponse = BaseAssistantResponse & {
  status: "invalid-data";
  extractedVariables?: ExtractedVariable[];
  validationErrors?: ValidationError[];
};

type UnsupportedResponse = BaseAssistantResponse & {
  status: "unsupported";
  calculatorId: null;
  calculatorName: null;
};

type ErrorResponse = BaseAssistantResponse & {
  status: "error";
};

type ClinicalAssistantResponse =
  | CompleteResponse
  | MissingDataResponse
  | InvalidDataResponse
  | UnsupportedResponse
  | ErrorResponse;

type ExampleCase = {
  title: string;
  calculator: string;
  text: string;
};

const MAXIMUM_TEXT_LENGTH = 20_000;

const exampleCases: ExampleCase[] = [
  {
    title: "Stroke risk",
    calculator: "CHA₂DS₂-VA",
    text:
      "A 72-year-old man with permanent atrial fibrillation has hypertension and diabetes mellitus. He has no clinical heart failure, no previous stroke or TIA, and no history of myocardial infarction or peripheral arterial disease.",
  },
  {
    title: "Adult HCM",
    calculator: "HCM Risk-SCD",
    text:
      "A 46-year-old patient with hypertrophic cardiomyopathy has a maximum wall thickness of 24 mm, left atrial diameter of 44 mm and maximum resting or provoked LVOT gradient of 35 mmHg. There is no family history of sudden cardiac death. NSVT was documented on ambulatory monitoring. There has been no unexplained syncope.",
  },
  {
    title: "QT correction",
    calculator: "QTc",
    text:
      "Calculate the corrected QT interval for a female patient. The measured QT interval is 420 ms and the heart rate is 82 bpm. Use the Fridericia formula.",
  },
  {
    title: "VT ablation risk",
    calculator: "PAINESD",
    text:
      "A 68-year-old patient is scheduled for ventricular tachycardia ablation. He has ischemic cardiomyopathy, NYHA class III heart failure, an LVEF of 20%, diabetes and VT storm. He has no chronic pulmonary disease.",
  },
];

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isAssistantResponse(
  value: unknown,
): value is ClinicalAssistantResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.status === "complete" ||
    value.status === "missing-data" ||
    value.status === "invalid-data" ||
    value.status === "unsupported" ||
    value.status === "error"
  );
}

function getRiskClasses(
  riskLevel: RiskLevel,
): {
  panel: string;
  badge: string;
  value: string;
} {
  switch (riskLevel) {
    case "low":
      return {
        panel:
          "border-emerald-200 bg-emerald-50",
        badge:
          "border-emerald-200 bg-emerald-100 text-emerald-700",
        value: "text-emerald-700",
      };

    case "intermediate":
      return {
        panel:
          "border-amber-200 bg-amber-50",
        badge:
          "border-amber-200 bg-amber-100 text-amber-700",
        value: "text-amber-700",
      };

    case "high":
      return {
        panel:
          "border-rose-200 bg-rose-50",
        badge:
          "border-rose-200 bg-rose-100 text-rose-700",
        value: "text-rose-700",
      };

    default:
      return {
        panel:
          "border-cyan-200 bg-cyan-50",
        badge:
          "border-cyan-200 bg-cyan-100 text-cyan-700",
        value: "text-cyan-700",
      };
  }
}

function getConfidenceClasses(
  confidence?: Confidence,
): string {
  switch (confidence) {
    case "high":
      return "border-emerald-200 bg-emerald-100 text-emerald-700";

    case "moderate":
      return "border-amber-200 bg-amber-100 text-amber-700";

    case "low":
      return "border-rose-200 bg-rose-100 text-rose-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function formatConfidence(
  confidence?: Confidence,
): string {
  if (!confidence) {
    return "Unknown";
  }

  return (
    confidence.charAt(0).toUpperCase() +
    confidence.slice(1)
  );
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

function SparklesIcon() {
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
      <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
      <path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" />
      <path d="m5 13 .8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" />
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

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function LoadingIndicator() {
  return (
    <span
      aria-hidden="true"
      className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
    />
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
        {title}
      </h2>

      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ExtractedVariablesPanel({
  variables,
}: {
  variables: ExtractedVariable[];
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      <SectionHeading
        eyebrow="AI extraction"
        title="Extracted clinical variables"
        description="Only information identified from the supplied clinical text is shown."
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {variables.map((variable) => {
          const missing =
            variable.value === null ||
            variable.displayValue === null;

          return (
            <div
              key={variable.key}
              className={`rounded-2xl border p-4 ${
                missing
                  ? "border-amber-200 bg-amber-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {variable.label}
              </p>

              <p
                className={`mt-2 text-sm font-bold ${
                  missing
                    ? "text-amber-700"
                    : "text-slate-950"
                }`}
              >
                {variable.displayValue ?? "Missing"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MissingDataPanel({
  response,
}: {
  response: MissingDataResponse;
}) {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
            <AlertIcon />
          </span>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
              Missing clinical data
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-950">
              More information is required
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {response.message ??
                "One or more required variables are missing. No score has been calculated."}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {response.missingVariables.map(
            (variable) => (
              <div
                key={variable.key}
                className="rounded-2xl border border-amber-200 bg-slate-50 p-4"
              >
                <p className="font-bold text-slate-950">
                  {variable.label}
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {variable.description}
                </p>

                {variable.allowedValues?.length ? (
                  <p className="mt-2 text-xs text-amber-700">
                    Accepted values:{" "}
                    {variable.allowedValues.join(", ")}
                  </p>
                ) : null}
              </div>
            ),
          )}
        </div>
      </section>

      <ExtractedVariablesPanel
        variables={response.extractedVariables}
      />
    </div>
  );
}

function InvalidDataPanel({
  response,
}: {
  response: InvalidDataResponse;
}) {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700">
            <AlertIcon />
          </span>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">
              Invalid data
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-950">
              The calculation could not be completed
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {response.message ??
                "The request or extracted clinical values were invalid."}
            </p>
          </div>
        </div>

        {response.validationErrors?.length ? (
          <div className="mt-5 space-y-3">
            {response.validationErrors.map(
              (error) => (
                <div
                  key={`${error.key}-${error.message}`}
                  className="rounded-2xl border border-rose-200 bg-slate-50 p-4"
                >
                  <p className="font-bold text-slate-950">
                    {error.label}
                  </p>

                  <p className="mt-1 text-sm text-rose-700">
                    {error.message}
                  </p>
                </div>
              ),
            )}
          </div>
        ) : null}
      </section>

      {response.extractedVariables?.length ? (
        <ExtractedVariablesPanel
          variables={response.extractedVariables}
        />
      ) : null}
    </div>
  );
}

function UnsupportedPanel({
  response,
}: {
  response: UnsupportedResponse;
}) {
  return (
    <section className="rounded-3xl border border-violet-200 bg-violet-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-700">
          <SparklesIcon />
        </span>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
            Unsupported request
          </p>

          <h2 className="mt-2 text-xl font-black text-slate-950">
            No matching calculator was identified
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {response.message ??
              "The clinical text does not match one of the currently supported calculators."}
          </p>

          {response.detectedCondition ? (
            <p className="mt-4 text-sm text-slate-600">
              Detected context:{" "}
              <span className="font-semibold text-slate-950">
                {response.detectedCondition}
              </span>
            </p>
          ) : null}

          {response.rationale ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {response.rationale}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ErrorPanel({
  message,
}: {
  message: string;
}) {
  return (
    <section className="rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700">
          <AlertIcon />
        </span>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">
            Assistant error
          </p>

          <h2 className="mt-2 text-xl font-black text-slate-950">
            The analysis could not be completed
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}

function CompleteResultPanel({
  response,
}: {
  response: CompleteResponse;
}) {
  const classes = getRiskClasses(
    response.result.riskLevel,
  );

  return (
    <div className="space-y-5">
      <section
        className={`rounded-3xl border p-5 sm:p-7 ${classes.panel}`}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${classes.badge}`}
              >
                {response.result.riskLabel}
              </span>

              {response.result.riskRange ? (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                  {response.result.riskRange}
                </span>
              ) : null}
            </div>

            <p className="mt-5 text-sm font-bold text-slate-600">
              {response.result.calculatorName}
            </p>

            <p
              className={`mt-1 text-5xl font-black tracking-tight sm:text-6xl ${classes.value}`}
            >
              {response.result.primaryValueDisplay}
            </p>
          </div>

          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-cyan-700">
            <CheckIcon />
          </span>
        </div>

        {response.result.secondaryValues?.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {response.result.secondaryValues.map(
              (item) => (
                <div
                  key={`${item.label}-${item.value}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    {item.label}
                  </p>

                  <p className="mt-2 font-bold text-slate-950">
                    {item.value}
                  </p>
                </div>
              ),
            )}
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <SectionHeading
            eyebrow="Guideline context"
            title="Clinical guidance summary"
          />

          <p className="mt-4 text-sm leading-7 text-slate-700">
            {response.result.guidelineSummary}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <SectionHeading
            eyebrow="Interpretation"
            title="Clinical interpretation"
          />

          <p className="mt-4 text-sm leading-7 text-slate-700">
            {response.result.clinicalInterpretation}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <SectionHeading
          eyebrow="Calculation details"
          title="Score components"
        />

        <div className="mt-5 divide-y divide-slate-200">
          {response.result.components.map(
            (component, index) => (
              <div
                key={`${component.label}-${index}`}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-950">
                    {component.label}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {component.value}
                  </p>
                </div>

                {component.points !== undefined ? (
                  <span className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                    {component.points >= 0 ? "+" : ""}
                    {component.points}{" "}
                    {Math.abs(component.points) === 1
                      ? "point"
                      : "points"}
                  </span>
                ) : null}
              </div>
            ),
          )}
        </div>
      </section>

      <ExtractedVariablesPanel
        variables={response.extractedVariables}
      />

      <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-cyan-700">
            <ShieldIcon />
          </span>

          <div>
            <p className="font-bold text-slate-950">
              Clinical safety notice
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {response.disclaimer}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AiAssistantPage() {
  const [clinicalText, setClinicalText] =
    useState("");

  const [response, setResponse] =
    useState<ClinicalAssistantResponse | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const characterCount = clinicalText.length;

  const canAnalyze =
    clinicalText.trim().length >= 10 &&
    characterCount <= MAXIMUM_TEXT_LENGTH &&
    !isLoading;

  const selectedCalculator = useMemo(() => {
    if (
      !response ||
      response.status === "error" ||
      response.status === "unsupported"
    ) {
      return null;
    }

    return response.calculatorName ?? null;
  }, [response]);

  function resetAssistant() {
    setClinicalText("");
    setResponse(null);
    setErrorMessage(null);
  }

  function loadExample(example: ExampleCase) {
    setClinicalText(example.text);
    setResponse(null);
    setErrorMessage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function analyzeClinicalText() {
    const normalizedText = clinicalText.trim();

    if (normalizedText.length < 10) {
      setErrorMessage(
        "Please enter a more complete clinical description.",
      );

      return;
    }

    if (
      normalizedText.length >
      MAXIMUM_TEXT_LENGTH
    ) {
      setErrorMessage(
        `Clinical text must not exceed ${MAXIMUM_TEXT_LENGTH.toLocaleString(
          "en-US",
        )} characters.`,
      );

      return;
    }

    setIsLoading(true);
    setResponse(null);
    setErrorMessage(null);

    try {
      const apiResponse = await fetch(
        "/api/clinical-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clinicalText: normalizedText,
          }),
        },
      );

      const payload: unknown =
        await apiResponse.json();

      if (!isAssistantResponse(payload)) {
        throw new Error(
          "The server returned an invalid assistant response.",
        );
      }

      if (!apiResponse.ok) {
        throw new Error(
          payload.message ??
            "The clinical analysis request failed.",
        );
      }

      setResponse(payload);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      setErrorMessage(message);

      setResponse({
        status: "error",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-200/45 blur-[110px]" />
        <div className="absolute right-[-14rem] top-[12rem] h-[36rem] w-[36rem] rounded-full bg-blue-200/35 blur-[120px]" />
        <div className="absolute bottom-[-18rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-violet-200/35 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      </div>

      <header className="relative z-10 border-b border-slate-200/80 bg-white/80 shadow-sm shadow-slate-200/40 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <BackIcon />
            Back to EP-SCORE AI
          </Link>

          <div className="flex items-center gap-2">
            {selectedCalculator ? (
              <span className="hidden rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700 sm:inline-flex">
                {selectedCalculator}
              </span>
            ) : null}

            <button
              type="button"
              onClick={resetAssistant}
              disabled={
                isLoading ||
                (!clinicalText && !response)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-cyan-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ResetIcon />
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="mx-auto max-w-4xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-lg shadow-cyan-100">
            <SparklesIcon />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.26em] text-cyan-700">
            AI Clinical Assistant
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            From clinical text to the
            <span className="block bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              appropriate EP risk score
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Enter a clinical description. AI selects
            the appropriate calculator and extracts
            the variables. The final score is calculated
            by a deterministic TypeScript engine.
          </p>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <SectionHeading
                eyebrow="Clinical input"
                title="Describe the patient"
                description="Include all relevant positive and negative findings. Unmentioned variables will remain missing."
              />

              <span className="hidden grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-cyan-700 sm:grid">
                <SparklesIcon />
              </span>
            </div>

            <div className="relative mt-6">
              <textarea
                value={clinicalText}
                onChange={(event) => {
                  setClinicalText(
                    event.target.value,
                  );

                  if (response) {
                    setResponse(null);
                  }

                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                }}
                disabled={isLoading}
                placeholder="Example: A 72-year-old man with atrial fibrillation has hypertension and diabetes. He has no heart failure, previous stroke or vascular disease..."
                className="min-h-[310px] w-full resize-y rounded-3xl border border-slate-200 bg-white px-5 py-5 text-[15px] leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/[0.05] disabled:cursor-wait disabled:opacity-70"
              />

              <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-500 backdrop-blur">
                {characterCount.toLocaleString(
                  "en-US",
                )}{" "}
                /{" "}
                {MAXIMUM_TEXT_LENGTH.toLocaleString(
                  "en-US",
                )}
              </div>
            </div>

            {characterCount >
            MAXIMUM_TEXT_LENGTH ? (
              <p className="mt-3 text-sm font-semibold text-rose-700">
                The clinical text is too long.
              </p>
            ) : null}

            {errorMessage ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="button"
              onClick={analyzeClinicalText}
              disabled={!canAnalyze}
              className="group mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-5 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(37,99,235,0.3)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <LoadingIndicator />
                  Extracting clinical variables…
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Analyze clinical text
                  <span className="transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </>
              )}
            </button>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <span className="mt-0.5 text-cyan-700">
                <ShieldIcon />
              </span>

              <p className="text-xs leading-5 text-slate-500">
                AI extracts information but does not
                calculate the score. Missing variables
                are never assumed to be negative.
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-2xl sm:p-6">
              <SectionHeading
                eyebrow="Try an example"
                title="Example clinical cases"
                description="Load a complete sample case and test the assistant."
              />

              <div className="mt-5 space-y-3">
                {exampleCases.map((example) => (
                  <button
                    key={example.title}
                    type="button"
                    onClick={() =>
                      loadExample(example)
                    }
                    disabled={isLoading}
                    className="group w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950">
                          {example.title}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-cyan-700">
                          {example.calculator}
                        </p>
                      </div>

                      <span className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-700">
                        <ArrowIcon />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 backdrop-blur-2xl sm:p-6">
              <SectionHeading
                eyebrow="Supported tools"
                title="Nine clinical calculators"
              />

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "CHA₂DS₂-VA",
                  "HAS-BLED",
                  "PAINESD",
                  "HCM Risk-SCD",
                  "HCM Risk-Kids",
                  "Brugada Risk",
                  "Shanghai Brugada",
                  "Schwartz LQTS",
                  "QTc",
                ].map((calculator) => (
                  <span
                    key={calculator}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"
                  >
                    {calculator}
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {isLoading ? (
          <section className="mt-8 rounded-[2rem] border border-cyan-200 bg-cyan-50 p-7 text-center backdrop-blur-2xl">
            <div className="mx-auto grid h-12 w-12 place-items-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600" />
            </div>

            <p className="mt-4 font-black text-slate-950">
              Analyzing the clinical description
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Selecting the calculator and checking
              all required variables…
            </p>
          </section>
        ) : null}

        {!isLoading && response ? (
          <section className="mt-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Assistant output"
                title="Clinical decision-support result"
                description="Review the selected calculator, extracted variables and deterministic result."
              />

              {response.calculatorName ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700">
                    {response.calculatorName}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-black ${getConfidenceClasses(
                      response.confidence,
                    )}`}
                  >
                    {formatConfidence(
                      response.confidence,
                    )}{" "}
                    confidence
                  </span>

                  {response.calculatorHref ? (
                    <Link
                      href={
                        response.calculatorHref
                      }
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      Open calculator
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>

            {response.rationale ? (
              <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
                  Calculator selection
                </p>

                {response.detectedCondition ? (
                  <p className="mt-3 font-black text-slate-950">
                    {
                      response.detectedCondition
                    }
                  </p>
                ) : null}

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {response.rationale}
                </p>

                {response.extractionNotes
                  ?.length ? (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Extraction notes
                    </p>

                    <ul className="mt-3 space-y-2">
                      {response.extractionNotes.map(
                        (note, index) => (
                          <li
                            key={`${note}-${index}`}
                            className="flex gap-2 text-sm leading-6 text-slate-600"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                            <span>{note}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}

            {response.status ===
            "complete" ? (
              <CompleteResultPanel
                response={response}
              />
            ) : null}

            {response.status ===
            "missing-data" ? (
              <MissingDataPanel
                response={response}
              />
            ) : null}

            {response.status ===
            "invalid-data" ? (
              <InvalidDataPanel
                response={response}
              />
            ) : null}

            {response.status ===
            "unsupported" ? (
              <UnsupportedPanel
                response={response}
              />
            ) : null}

            {response.status === "error" ? (
              <ErrorPanel
                message={
                  response.message ??
                  "An unexpected error occurred."
                }
              />
            ) : null}
          </section>
        ) : null}
      </div>

      <Footer />
    </main>
  );
}