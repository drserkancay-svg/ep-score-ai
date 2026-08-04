export type HcmRiskScdInput = {
  age: number;
  maxWallThickness: number;
  leftAtrialDiameter: number;
  lvotGradient: number;
  familyHistory: boolean;
  nsvt: boolean;
  unexplainedSyncope: boolean;
};

export type HcmRiskScdLevel = "low" | "intermediate" | "high";

export type HcmRiskScdResult = {
  prognosticIndex: number;
  fiveYearRisk: number;
  riskLevel: HcmRiskScdLevel;
  riskLabel: string;
  riskRange: string;
  escSummary: string;
  clinicalInterpretation: string;
};

export type HcmRiskScdValidationResult =
  | {
      valid: true;
      errors: [];
    }
  | {
      valid: false;
      errors: string[];
    };

export function validateHcmRiskScdInput(
  input: HcmRiskScdInput,
): HcmRiskScdValidationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.age) || input.age < 16 || input.age > 100) {
    errors.push("Age must be between 16 and 100 years.");
  }

  if (
    !Number.isFinite(input.maxWallThickness) ||
    input.maxWallThickness < 10 ||
    input.maxWallThickness > 50
  ) {
    errors.push(
      "Maximum left ventricular wall thickness must be between 10 and 50 mm.",
    );
  }

  if (
    !Number.isFinite(input.leftAtrialDiameter) ||
    input.leftAtrialDiameter < 20 ||
    input.leftAtrialDiameter > 80
  ) {
    errors.push("Left atrial diameter must be between 20 and 80 mm.");
  }

  if (
    !Number.isFinite(input.lvotGradient) ||
    input.lvotGradient < 0 ||
    input.lvotGradient > 250
  ) {
    errors.push("Maximum LVOT gradient must be between 0 and 250 mmHg.");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    errors: [],
  };
}

function getRiskClassification(
  risk: number,
): Pick<
  HcmRiskScdResult,
  | "riskLevel"
  | "riskLabel"
  | "riskRange"
  | "escSummary"
> {
  if (risk < 4) {
    return {
      riskLevel: "low",
      riskLabel: "Lower estimated risk",
      riskRange: "<4% at 5 years",
      escSummary:
        "The estimated five-year sudden cardiac death risk is below 4%. Primary-prevention ICD implantation is generally not indicated solely on the basis of the HCM Risk-SCD model. Additional clinical and imaging risk modifiers must still be reviewed.",
    };
  }

  if (risk < 6) {
    return {
      riskLevel: "intermediate",
      riskLabel: "Intermediate estimated risk",
      riskRange: "4% to <6% at 5 years",
      escSummary:
        "The estimated five-year sudden cardiac death risk is between 4% and less than 6%. Primary-prevention ICD implantation may be considered after individualized specialist assessment and shared decision-making.",
    };
  }

  return {
    riskLevel: "high",
    riskLabel: "Higher estimated risk",
    riskRange: "≥6% at 5 years",
    escSummary:
      "The estimated five-year sudden cardiac death risk is at least 6%. Evaluation for primary-prevention ICD implantation should be considered after comprehensive specialist assessment and shared decision-making.",
  };
}

function buildClinicalInterpretation(
  input: HcmRiskScdInput,
  riskLevel: HcmRiskScdLevel,
) {
  const positiveRiskMarkers: string[] = [];

  if (input.nsvt) {
    positiveRiskMarkers.push("documented non-sustained ventricular tachycardia");
  }

  if (input.unexplainedSyncope) {
    positiveRiskMarkers.push("unexplained syncope");
  }

  if (input.familyHistory) {
    positiveRiskMarkers.push(
      "a family history of sudden cardiac death",
    );
  }

  const markerSentence =
    positiveRiskMarkers.length > 0
      ? `Risk-enhancing model variables include ${positiveRiskMarkers.join(
          ", ",
        )}.`
      : "No positive binary risk markers were identified among family history of sudden cardiac death, non-sustained ventricular tachycardia and unexplained syncope.";

  const levelSentence =
    riskLevel === "high"
      ? "The calculated result is in the higher-risk range and supports formal evaluation for primary-prevention ICD therapy."
      : riskLevel === "intermediate"
        ? "The calculated result is in the intermediate-risk range, where individualized ICD discussion may be appropriate."
        : "The calculated result is in the lower-risk range, but it should not be used as the sole basis for excluding clinically important risk.";

  return `${levelSentence} ${markerSentence} Final assessment should also consider left ventricular systolic function, apical aneurysm, extensive late gadolinium enhancement, genotype, comorbidities, competing mortality risk and patient preference.`;
}

export function calculateHcmRiskScd(
  input: HcmRiskScdInput,
): HcmRiskScdResult {
  const validation = validateHcmRiskScdInput(input);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const prognosticIndex =
    0.15939858 * input.maxWallThickness -
    0.00294271 * input.maxWallThickness ** 2 +
    0.0259082 * input.leftAtrialDiameter +
    0.00446131 * input.lvotGradient +
    0.4583082 * Number(input.familyHistory) +
    0.82639195 * Number(input.nsvt) +
    0.71650361 * Number(input.unexplainedSyncope) -
    0.01799934 * input.age;

  const unboundedFiveYearRisk =
    (1 - Math.pow(0.998, Math.exp(prognosticIndex))) * 100;

  const fiveYearRisk = Math.max(
    0,
    Math.min(unboundedFiveYearRisk, 100),
  );

  const classification = getRiskClassification(fiveYearRisk);

  return {
    prognosticIndex,
    fiveYearRisk,
    ...classification,
    clinicalInterpretation: buildClinicalInterpretation(
      input,
      classification.riskLevel,
    ),
  };
}