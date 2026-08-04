"use client";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import CalculatorShell from "@/components/calculators/CalculatorShell";
import {
  FieldGroup,
  SelectionCard,
} from "@/components/calculators/CalculatorFields";
import CalculatorResult from "@/components/calculators/CalculatorResult";
import { buildClinicalReport } from "@/src/lib/clinical-assistant/calculators/buildClinicalReport";
type BinaryFactors = {
  hypertension: boolean;
  strokeHistory: boolean;
  bleedingHistory: boolean;
  labileInr: boolean;
  elderly: boolean;
  antiplateletOrNsaid: boolean;
  alcohol: boolean;
};

type FactorKey = keyof BinaryFactors;

type RiskLevel = "low" | "moderate" | "high";

const initialFactors: BinaryFactors = {
  hypertension: false,
  strokeHistory: false,
  bleedingHistory: false,
  labileInr: false,
  elderly: false,
  antiplateletOrNsaid: false,
  alcohol: false,
};

const factorDefinitions: {
  id: FactorKey;
  title: string;
  description: string;
  points: number;
}[] = [
  {
    id: "hypertension",
    title: "Uncontrolled hypertension",
    description: "Systolic blood pressure greater than 160 mmHg.",
    points: 1,
  },
  {
    id: "strokeHistory",
    title: "Previous stroke",
    description: "History of ischemic or hemorrhagic stroke.",
    points: 1,
  },
  {
    id: "bleedingHistory",
    title: "Bleeding history or predisposition",
    description:
      "Previous major bleeding or a clinical condition associated with increased bleeding risk.",
    points: 1,
  },
  {
    id: "labileInr",
    title: "Labile INR",
    description:
      "Unstable or high INR values, or poor time in therapeutic range while using a vitamin K antagonist.",
    points: 1,
  },
  {
    id: "elderly",
    title: "Age over 65 years",
    description: "Patient age greater than 65 years.",
    points: 1,
  },
  {
    id: "antiplateletOrNsaid",
    title: "Drugs increasing bleeding risk",
    description:
      "Concomitant antiplatelet therapy or regular use of nonsteroidal anti-inflammatory drugs.",
    points: 1,
  },
  {
    id: "alcohol",
    title: "Alcohol excess",
    description: "Excessive or clinically relevant alcohol use.",
    points: 1,
  },
];

function BloodPressureIcon() {
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
      <path d="M7 4v6a5 5 0 0 0 10 0V4" />
      <path d="M9 4h6" />
      <path d="M12 15v3" />
      <path d="M9 21h6" />
    </svg>
  );
}

function BrainIcon() {
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
      <path d="M9.5 4.5A3 3 0 0 0 6 7.4 3.5 3.5 0 0 0 5 14a3 3 0 0 0 4 4.5" />
      <path d="M14.5 4.5A3 3 0 0 1 18 7.4a3.5 3.5 0 0 1 1 6.6 3 3 0 0 1-4 4.5" />
      <path d="M12 4v16" />
      <path d="M9 9h3" />
      <path d="M12 14h3" />
    </svg>
  );
}

function DropIcon() {
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
      <path d="M12 3s6 6.1 6 11a6 6 0 0 1-12 0c0-4.9 6-11 6-11Z" />
    </svg>
  );
}

function ChartIcon() {
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
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </svg>
  );
}

function PersonIcon() {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function MedicationIcon() {
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
      <path d="m8.5 4.5 11 11a3.5 3.5 0 0 1-5 5l-11-11a3.5 3.5 0 0 1 5-5Z" />
      <path d="m9 10 5-5" />
      <path d="m10 15 5-5" />
    </svg>
  );
}

function AlcoholIcon() {
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
      <path d="M6 3h12l-1.5 7a4.5 4.5 0 0 1-9 0L6 3Z" />
      <path d="M12 14.5V21" />
      <path d="M8 21h8" />
      <path d="M7 7h10" />
    </svg>
  );
}

function KidneyIcon() {
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
      <path d="M9.5 4.5C6 3 3.5 5.7 3.5 9.5c0 4.8 3.2 8 7.5 8V12c-1.8 0-2.5-1-2.5-2.5" />
      <path d="M14.5 4.5c3.5-1.5 6 1.2 6 5 0 4.8-3.2 8-7.5 8V12c1.8 0 2.5-1 2.5-2.5" />
    </svg>
  );
}

function LiverIcon() {
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
      <path d="M4 12c0-5 4-8 9-8h3c2.8 0 4 2.2 4 4.5V11c-3.5 0-5 1.5-6 4-1.2 3-3.8 5-7 5H5c-.7-2.4-1-5.2-1-8Z" />
      <path d="M11 8c1.5 2 3.8 3 7 3" />
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
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v6h6" />
    </svg>
  );
}

const factorIcons: Record<FactorKey, ReactNode> = {
  hypertension: <BloodPressureIcon />,
  strokeHistory: <BrainIcon />,
  bleedingHistory: <DropIcon />,
  labileInr: <ChartIcon />,
  elderly: <PersonIcon />,
  antiplateletOrNsaid: <MedicationIcon />,
  alcohol: <AlcoholIcon />,
};

export default function HasBledPage() {
  const [factors, setFactors] =
    useState<BinaryFactors>(initialFactors);

  const [renalFunction, setRenalFunction] = useState(false);
  const [liverFunction, setLiverFunction] = useState(false);

  const score = useMemo(() => {
    let total = 0;

    Object.values(factors).forEach((selected) => {
      if (selected) {
        total += 1;
      }
    });

    if (renalFunction) {
      total += 1;
    }

    if (liverFunction) {
      total += 1;
    }

    return total;
  }, [factors, renalFunction, liverFunction]);

  const interpretation = useMemo<{
    title: string;
    description: string;
    riskLevel: RiskLevel;
  }>(() => {
    if (score >= 3) {
      return {
        title: "High bleeding risk",
        description:
          "A HAS-BLED score of 3 or more identifies a patient who requires careful clinical review, correction of modifiable bleeding-risk factors and closer follow-up.",
        riskLevel: "high",
      };
    }

    if (score >= 1) {
      return {
        title: "Bleeding risk factors present",
        description:
          "One or more bleeding-risk factors are present. Review each selected component and address modifiable causes wherever possible.",
        riskLevel: "moderate",
      };
    }

    return {
      title: "No HAS-BLED risk factors selected",
      description:
        "The current score is 0. Bleeding risk should still be reassessed over time as the patient's clinical status and treatment change.",
      riskLevel: "low",
    };
  }, [score]);

  const selectedComponents = useMemo(() => {
    const components: string[] = [];

    factorDefinitions.forEach((factor) => {
      if (factors[factor.id]) {
        components.push(`${factor.title}: +1`);
      }
    });

    if (renalFunction) {
      components.push("Abnormal renal function: +1");
    }

    if (liverFunction) {
      components.push("Abnormal liver function: +1");
    }

    return components;
  }, [factors, renalFunction, liverFunction]);

  const hasSelectedFactors = selectedComponents.length > 0;

  function toggleFactor(id: FactorKey) {
    setFactors((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  function resetCalculator() {
    setFactors(initialFactors);
    setRenalFunction(false);
    setLiverFunction(false);
  }
function generatePdfReport() {
  buildClinicalReport({
    calculatorId: "has-bled",
    score,
    riskLabel: interpretation.title,
    riskLevel: interpretation.riskLevel,
    interpretation: interpretation.description,
    components: selectedComponents,
  });
}
  return (
    <CalculatorShell
      name="HAS-BLED"
      fullName="Bleeding Risk Assessment in Atrial Fibrillation"
      category="Anticoagulation"
      description="Identifies bleeding-risk factors in patients with atrial fibrillation and highlights potentially modifiable causes that require clinical review."
      evidence="Validated clinical bleeding-risk score for patients with atrial fibrillation"
      guideline="Used in contemporary atrial fibrillation guidance as a structured approach to identifying and correcting modifiable bleeding-risk factors."
      result={
        <CalculatorResult
          score={score}
          scoreLabel="HAS-BLED score · 0–9 points"
          riskLabel={interpretation.title}
          riskLevel={interpretation.riskLevel}
          interpretation={interpretation.description}
          details={
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-600">
                  Score components
                </p>

                {hasSelectedFactors ? (
                  <div className="mt-3 space-y-2">
                    {selectedComponents.map((component) => (
                      <div
                        key={component}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white px-4 py-3 text-sm text-slate-700"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />

                        <span className="min-w-0">
                          {component}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-white/[0.02] px-4 py-5 text-center">
                    <p className="text-sm text-slate-500">
                      No score components selected.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-800">
                  Do not use the score to withhold anticoagulation
                </p>

                <p className="mt-2 text-xs leading-6 text-amber-100/60">
                  A high HAS-BLED score should prompt correction of
                  modifiable bleeding risks and closer follow-up. It should
                  not, by itself, determine whether anticoagulation is
                  prescribed, withheld or withdrawn.
                </p>
              </div>
            </div>
          }
        />
      }
      information={
        <div className="space-y-5">
          <article className="rounded-2xl border border-white/[0.08] bg-white p-5">
            <h3 className="font-black text-slate-950">
              Intended population
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Adults with atrial fibrillation undergoing assessment of
              bleeding risk, particularly before or during antithrombotic
              treatment.
            </p>
          </article>

          <article className="rounded-2xl border border-white/[0.08] bg-white p-5">
            <h3 className="font-black text-slate-950">
              Primary clinical value
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              The score provides a structured method for identifying
              potentially modifiable factors such as uncontrolled blood
              pressure, labile INR, interacting drugs and excess alcohol
              use.
            </p>
          </article>

          <article className="rounded-2xl border border-white/[0.08] bg-white p-5">
            <h3 className="font-black text-slate-950">
              High-risk threshold
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              A score of 3 or more is commonly treated as a high-risk flag
              requiring earlier review, correction of reversible factors
              and more frequent clinical follow-up.
            </p>
          </article>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
            <p className="text-sm font-bold text-cyan-700">
              Dynamic reassessment
            </p>

            <p className="mt-2 text-sm leading-6 text-cyan-100/60">
              Bleeding risk is not static. HAS-BLED should be reassessed
              when blood pressure, renal or hepatic function, medication
              exposure, alcohol use or anticoagulation control changes.
            </p>
          </div>
        </div>
      }
      references={
        <div className="space-y-4">
          <article className="rounded-2xl border border-white/[0.08] bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
              Original derivation study
            </p>

            <h3 className="mt-3 font-bold leading-7 text-slate-950">
              
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Pisters R, Lane DA, Nieuwlaat R, de Vos CB, Crijns HJ, Lip GY. A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation: the Euro Heart Survey. Chest. 2010 Nov;138(5):1093-100. doi: 10.1378/chest.10-0134. Epub 2010 Mar 18. PMID: 20299623.
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-500">
              
            </p>
          </article>

          <article className="rounded-2xl border border-white/[0.08] bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
              Clinical interpretation
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              The score is intended primarily to identify patients who
              require closer follow-up and correction of modifiable
              bleeding-risk factors. A high score is not an automatic
              contraindication to oral anticoagulation.
            </p>
          </article>
        </div>
      }
    >
      <div className="space-y-8">
        
        <FieldGroup
          title="Standard HAS-BLED factors"
          description="Select every clinical factor that applies to the patient. Each selected factor adds one point."
        >
          {factorDefinitions.map((factor) => (
            <SelectionCard
              key={factor.id}
              selected={factors[factor.id]}
              title={factor.title}
              description={factor.description}
              points={factor.points}
              icon={factorIcons[factor.id]}
              onClick={() => toggleFactor(factor.id)}
            />
          ))}
        </FieldGroup>

        <FieldGroup
          title="Abnormal renal or liver function"
          description="Renal and hepatic dysfunction are scored independently. Selecting both adds two points."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <SelectionCard
              selected={renalFunction}
              title="Abnormal renal function"
              description="Chronic dialysis, renal transplantation or clinically significant renal impairment."
              points={1}
              icon={<KidneyIcon />}
              onClick={() =>
                setRenalFunction((current) => !current)
              }
            />

            <SelectionCard
              selected={liverFunction}
              title="Abnormal liver function"
              description="Chronic hepatic disease or biochemical evidence of significant hepatic dysfunction."
              points={1}
              icon={<LiverIcon />}
              onClick={() =>
                setLiverFunction((current) => !current)
              }
            />
          </div>
        </FieldGroup>

        <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {selectedComponents.length} of 9 possible factors selected
            </p>

            <p className="mt-1 text-xs text-slate-600">
              The result updates automatically after each selection.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
  <button
    type="button"
    onClick={generatePdfReport}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-600 bg-cyan-600 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-100 transition hover:bg-cyan-700"
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
    disabled={!hasSelectedFactors}
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
  >
    <ResetIcon />
    Reset calculator
  </button>
</div>
        </div>
      </div>
    </CalculatorShell>
  );
}