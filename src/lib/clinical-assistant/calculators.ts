export type ClinicalRiskLevel =
  | "low"
  | "intermediate"
  | "high"
  | "neutral";

export type ClinicalCalculatorId =
  | "cha2ds2-va"
  | "has-bled"
  | "painesd"
  | "hcm-risk-scd"
  | "hcm-risk-kids"
  | "brugada-risk"
  | "shanghai-brugada"
  | "lqts-schwartz"
  | "qtc";

export type ClinicalCalculationResult = {
  calculatorId: ClinicalCalculatorId;
  calculatorName: string;
  primaryValue: number;
  primaryValueDisplay: string;
  secondaryValues?: Array<{
    label: string;
    value: string;
  }>;
  riskLevel: ClinicalRiskLevel;
  riskLabel: string;
  riskRange?: string;
  guidelineSummary: string;
  clinicalInterpretation: string;
  components: Array<{
    label: string;
    value: string;
    points?: number;
  }>;
};

/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function yesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

function assertFiniteNumber(
  value: number,
  label: string,
): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a valid number.`);
  }
}

function assertRange(
  value: number,
  minimum: number,
  maximum: number,
  label: string,
): void {
  assertFiniteNumber(value, label);

  if (value < minimum || value > maximum) {
    throw new Error(
      `${label} must be between ${minimum} and ${maximum}.`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                CHA₂DS₂-VA                                  */
/* -------------------------------------------------------------------------- */

export type Cha2ds2VaInput = {
  age: number;
  heartFailure: boolean;
  hypertension: boolean;
  diabetes: boolean;
  previousStroke: boolean;
  vascularDisease: boolean;
};

export function calculateCha2ds2Va(
  input: Cha2ds2VaInput,
): ClinicalCalculationResult {
  assertRange(input.age, 18, 120, "Age");

  const agePoints =
    input.age >= 75 ? 2 : input.age >= 65 ? 1 : 0;

  const components = [
    {
      label: "Age",
      value: `${input.age} years`,
      points: agePoints,
    },
    {
      label: "Heart failure or LV dysfunction",
      value: yesNo(input.heartFailure),
      points: input.heartFailure ? 1 : 0,
    },
    {
      label: "Hypertension",
      value: yesNo(input.hypertension),
      points: input.hypertension ? 1 : 0,
    },
    {
      label: "Diabetes mellitus",
      value: yesNo(input.diabetes),
      points: input.diabetes ? 1 : 0,
    },
    {
      label: "Previous stroke, TIA or systemic embolism",
      value: yesNo(input.previousStroke),
      points: input.previousStroke ? 2 : 0,
    },
    {
      label: "Vascular disease",
      value: yesNo(input.vascularDisease),
      points: input.vascularDisease ? 1 : 0,
    },
  ];

  const score = components.reduce(
    (total, component) => total + (component.points ?? 0),
    0,
  );

  if (score === 0) {
    return {
      calculatorId: "cha2ds2-va",
      calculatorName: "CHA₂DS₂-VA",
      primaryValue: score,
      primaryValueDisplay: `${score} points`,
      riskLevel: "low",
      riskLabel: "Low thromboembolic risk",
      riskRange: "0 points",
      guidelineSummary:
        "Oral anticoagulation is generally not indicated solely on the basis of a CHA₂DS₂-VA score of 0. Periodic reassessment is appropriate because clinical risk factors may change.",
      clinicalInterpretation:
        "No CHA₂DS₂-VA thromboembolic risk factors were identified. The score should be reassessed when age, comorbidities or the clinical condition changes.",
      components,
    };
  }

  if (score === 1) {
    return {
      calculatorId: "cha2ds2-va",
      calculatorName: "CHA₂DS₂-VA",
      primaryValue: score,
      primaryValueDisplay: `${score} point`,
      riskLevel: "intermediate",
      riskLabel: "Intermediate thromboembolic risk",
      riskRange: "1 point",
      guidelineSummary:
        "Oral anticoagulation should be considered after individualized assessment of thromboembolic risk, bleeding risk, comorbidities and patient preference.",
      clinicalInterpretation:
        "A single CHA₂DS₂-VA point is present. The responsible risk factor and the overall clinical context should guide shared treatment decisions.",
      components,
    };
  }

  return {
    calculatorId: "cha2ds2-va",
    calculatorName: "CHA₂DS₂-VA",
    primaryValue: score,
    primaryValueDisplay: `${score} points`,
    riskLevel: "high",
    riskLabel: "Elevated thromboembolic risk",
    riskRange: "≥2 points",
    guidelineSummary:
      "Oral anticoagulation is generally recommended for eligible patients with a CHA₂DS₂-VA score of at least 2, unless contraindications or competing clinical considerations are present.",
    clinicalInterpretation:
      "The calculated score indicates clinically important thromboembolic risk. Previous stroke or systemic embolism, when present, contributes two points and is a particularly important risk marker.",
    components,
  };
}

/* -------------------------------------------------------------------------- */
/*                                  HAS-BLED                                  */
/* -------------------------------------------------------------------------- */

export type HasBledInput = {
  uncontrolledHypertension: boolean;
  renalDysfunction: boolean;
  liverDysfunction: boolean;
  previousStroke: boolean;
  bleedingHistory: boolean;
  labileInr: boolean;
  ageOver65: boolean;
  antiplateletOrNsaid: boolean;
  alcoholExcess: boolean;
};

export function calculateHasBled(
  input: HasBledInput,
): ClinicalCalculationResult {
  const components = [
    {
      label: "Uncontrolled hypertension",
      value: yesNo(input.uncontrolledHypertension),
      points: input.uncontrolledHypertension ? 1 : 0,
    },
    {
      label: "Abnormal renal function",
      value: yesNo(input.renalDysfunction),
      points: input.renalDysfunction ? 1 : 0,
    },
    {
      label: "Abnormal liver function",
      value: yesNo(input.liverDysfunction),
      points: input.liverDysfunction ? 1 : 0,
    },
    {
      label: "Previous stroke",
      value: yesNo(input.previousStroke),
      points: input.previousStroke ? 1 : 0,
    },
    {
      label: "Bleeding history or predisposition",
      value: yesNo(input.bleedingHistory),
      points: input.bleedingHistory ? 1 : 0,
    },
    {
      label: "Labile INR",
      value: yesNo(input.labileInr),
      points: input.labileInr ? 1 : 0,
    },
    {
      label: "Age over 65 years",
      value: yesNo(input.ageOver65),
      points: input.ageOver65 ? 1 : 0,
    },
    {
      label: "Antiplatelet or NSAID use",
      value: yesNo(input.antiplateletOrNsaid),
      points: input.antiplateletOrNsaid ? 1 : 0,
    },
    {
      label: "Alcohol excess",
      value: yesNo(input.alcoholExcess),
      points: input.alcoholExcess ? 1 : 0,
    },
  ];

  const score = components.reduce(
    (total, component) => total + (component.points ?? 0),
    0,
  );

  const highRisk = score >= 3;

  return {
    calculatorId: "has-bled",
    calculatorName: "HAS-BLED",
    primaryValue: score,
    primaryValueDisplay: `${score} ${score === 1 ? "point" : "points"}`,
    riskLevel: highRisk
      ? "high"
      : score === 2
        ? "intermediate"
        : "low",
    riskLabel: highRisk
      ? "Increased bleeding risk"
      : score === 2
        ? "Moderate bleeding risk"
        : "Lower bleeding risk",
    riskRange: highRisk ? "≥3 points" : `${score} points`,
    guidelineSummary:
      score >= 3
        ? "A HAS-BLED score of at least 3 identifies a patient requiring closer clinical review and more frequent follow-up. A high score should not be used by itself to withhold indicated anticoagulation."
        : "The score does not identify a high bleeding-risk category, but modifiable bleeding risk factors should still be reviewed and corrected where possible.",
    clinicalInterpretation:
      "HAS-BLED is primarily intended to identify bleeding risk factors that may require correction or closer surveillance. Review blood pressure control, interacting medication, alcohol intake, renal and hepatic function, and anticoagulation quality.",
    components,
  };
}

/* -------------------------------------------------------------------------- */
/*                                   PAINESD                                  */
/* -------------------------------------------------------------------------- */

export type PainesdInput = {
  pulmonaryDisease: boolean;
  ageOver60: boolean;
  ischemicCardiomyopathy: boolean;
  nyhaClassThreeOrFour: boolean;
  ejectionFractionBelow25: boolean;
  vtStorm: boolean;
  diabetes: boolean;
};

export function calculatePainesd(
  input: PainesdInput,
): ClinicalCalculationResult {
  const components = [
    {
      label: "Pulmonary disease",
      value: yesNo(input.pulmonaryDisease),
      points: input.pulmonaryDisease ? 5 : 0,
    },
    {
      label: "Age greater than 60 years",
      value: yesNo(input.ageOver60),
      points: input.ageOver60 ? 3 : 0,
    },
    {
      label: "Ischemic cardiomyopathy",
      value: yesNo(input.ischemicCardiomyopathy),
      points: input.ischemicCardiomyopathy ? 6 : 0,
    },
    {
      label: "NYHA functional class III or IV",
      value: yesNo(input.nyhaClassThreeOrFour),
      points: input.nyhaClassThreeOrFour ? 6 : 0,
    },
    {
      label: "LVEF below 25%",
      value: yesNo(input.ejectionFractionBelow25),
      points: input.ejectionFractionBelow25 ? 3 : 0,
    },
    {
      label: "VT storm",
      value: yesNo(input.vtStorm),
      points: input.vtStorm ? 5 : 0,
    },
    {
      label: "Diabetes mellitus",
      value: yesNo(input.diabetes),
      points: input.diabetes ? 3 : 0,
    },
  ];

  const score = components.reduce(
    (total, component) => total + (component.points ?? 0),
    0,
  );

  if (score <= 8) {
    return {
      calculatorId: "painesd",
      calculatorName: "PAINESD",
      primaryValue: score,
      primaryValueDisplay: `${score} points`,
      riskLevel: "low",
      riskLabel: "Lower procedural risk",
      riskRange: "0–8 points",
      guidelineSummary:
        "The patient is within the lower PAINESD category. Procedural planning must still account for ventricular function, clinical stability, VT characteristics and anticipated procedural complexity.",
      clinicalInterpretation:
        "The score does not indicate the intermediate or high PAINESD category. This does not eliminate the risk of acute hemodynamic decompensation during VT ablation.",
      components,
    };
  }

  if (score <= 14) {
    return {
      calculatorId: "painesd",
      calculatorName: "PAINESD",
      primaryValue: score,
      primaryValueDisplay: `${score} points`,
      riskLevel: "intermediate",
      riskLabel: "Intermediate procedural risk",
      riskRange: "9–14 points",
      guidelineSummary:
        "The result suggests an intermediate risk of acute hemodynamic deterioration during VT ablation. Careful procedural planning and assessment of the potential need for circulatory support are appropriate.",
      clinicalInterpretation:
        "The patient has a clinically relevant combination of PAINESD risk factors. Ventricular function, hemodynamic reserve and the expected duration and complexity of mapping should be reviewed.",
      components,
    };
  }

  return {
    calculatorId: "painesd",
    calculatorName: "PAINESD",
    primaryValue: score,
    primaryValueDisplay: `${score} points`,
    riskLevel: "high",
    riskLabel: "Higher procedural risk",
    riskRange: "≥15 points",
    guidelineSummary:
      "The result indicates a higher risk of acute hemodynamic decompensation during VT ablation. Advanced procedural planning and individualized consideration of mechanical circulatory support may be appropriate.",
    clinicalInterpretation:
      "The PAINESD score should be integrated with current hemodynamic status, ventricular function, VT burden, comorbidities and the planned ablation strategy.",
    components,
  };
}

/* -------------------------------------------------------------------------- */
/*                               HCM RISK-SCD                                 */
/* -------------------------------------------------------------------------- */

export type HcmRiskScdInput = {
  age: number;
  maxWallThickness: number;
  leftAtrialDiameter: number;
  lvotGradient: number;
  familyHistory: boolean;
  nsvt: boolean;
  unexplainedSyncope: boolean;
};

export function calculateHcmRiskScd(
  input: HcmRiskScdInput,
): ClinicalCalculationResult {
  assertRange(input.age, 16, 100, "Age");
  assertRange(
    input.maxWallThickness,
    10,
    50,
    "Maximum wall thickness",
  );
  assertRange(
    input.leftAtrialDiameter,
    20,
    80,
    "Left atrial diameter",
  );
  assertRange(
    input.lvotGradient,
    0,
    250,
    "Maximum LVOT gradient",
  );

  const prognosticIndex =
    0.15939858 * input.maxWallThickness -
    0.00294271 * input.maxWallThickness ** 2 +
    0.0259082 * input.leftAtrialDiameter +
    0.00446131 * input.lvotGradient +
    0.4583082 * Number(input.familyHistory) +
    0.82639195 * Number(input.nsvt) +
    0.71650361 * Number(input.unexplainedSyncope) -
    0.01799934 * input.age;

  const risk = clamp(
    (1 - Math.pow(0.998, Math.exp(prognosticIndex))) * 100,
    0,
    100,
  );

  const components = [
    {
      label: "Age",
      value: `${input.age} years`,
    },
    {
      label: "Maximum wall thickness",
      value: `${input.maxWallThickness} mm`,
    },
    {
      label: "Left atrial diameter",
      value: `${input.leftAtrialDiameter} mm`,
    },
    {
      label: "Maximum LVOT gradient",
      value: `${input.lvotGradient} mmHg`,
    },
    {
      label: "Family history of sudden cardiac death",
      value: yesNo(input.familyHistory),
    },
    {
      label: "NSVT",
      value: yesNo(input.nsvt),
    },
    {
      label: "Unexplained syncope",
      value: yesNo(input.unexplainedSyncope),
    },
  ];

  const secondaryValues = [
    {
      label: "Prognostic index",
      value: prognosticIndex.toFixed(4),
    },
  ];

  if (risk < 4) {
    return {
      calculatorId: "hcm-risk-scd",
      calculatorName: "HCM Risk-SCD",
      primaryValue: risk,
      primaryValueDisplay: `${risk.toFixed(2)}%`,
      secondaryValues,
      riskLevel: "low",
      riskLabel: "Lower estimated risk",
      riskRange: "<4% at 5 years",
      guidelineSummary:
        "The estimated five-year sudden cardiac death risk is below 4%. ICD implantation is generally not indicated solely on the basis of this model, although additional clinical and imaging risk modifiers must still be reviewed.",
      clinicalInterpretation:
        "The model result is in the lower-risk range. Final assessment should also consider left ventricular systolic function, apical aneurysm, extensive late gadolinium enhancement, genotype, comorbidities and patient preference.",
      components,
    };
  }

  if (risk < 6) {
    return {
      calculatorId: "hcm-risk-scd",
      calculatorName: "HCM Risk-SCD",
      primaryValue: risk,
      primaryValueDisplay: `${risk.toFixed(2)}%`,
      secondaryValues,
      riskLevel: "intermediate",
      riskLabel: "Intermediate estimated risk",
      riskRange: "4% to <6% at 5 years",
      guidelineSummary:
        "The estimated five-year sudden cardiac death risk is between 4% and less than 6%. Individualized discussion of primary-prevention ICD therapy may be appropriate.",
      clinicalInterpretation:
        "The result falls within the intermediate range. Additional imaging and clinical modifiers, competing mortality risk and patient preference are particularly important in this category.",
      components,
    };
  }

  return {
    calculatorId: "hcm-risk-scd",
    calculatorName: "HCM Risk-SCD",
    primaryValue: risk,
    primaryValueDisplay: `${risk.toFixed(2)}%`,
    secondaryValues,
    riskLevel: "high",
    riskLabel: "Higher estimated risk",
    riskRange: "≥6% at 5 years",
    guidelineSummary:
      "The estimated five-year sudden cardiac death risk is at least 6%. Evaluation for primary-prevention ICD implantation should be considered following comprehensive specialist assessment.",
    clinicalInterpretation:
      "The result is in the higher-risk range. The calculated risk should be integrated with the overall phenotype, imaging findings, comorbidities, life expectancy and shared decision-making.",
    components,
  };
}

/* -------------------------------------------------------------------------- */
/*                              HCM RISK-KIDS                                 */
/* -------------------------------------------------------------------------- */

export type HcmRiskKidsInput = {
  maximalWallThicknessZScore: number;
  leftAtrialDiameterZScore: number;
  lvotGradient: number;
  nsvt: boolean;
  unexplainedSyncope: boolean;
};

export function calculateHcmRiskKids(
  input: HcmRiskKidsInput,
): ClinicalCalculationResult {
  assertRange(
    input.maximalWallThicknessZScore,
    -5,
    30,
    "Maximum wall thickness Z-score",
  );

  assertRange(
    input.leftAtrialDiameterZScore,
    -5,
    20,
    "Left atrial diameter Z-score",
  );

  assertRange(
    input.lvotGradient,
    0,
    250,
    "Maximum LVOT gradient",
  );

  const prognosticIndex =
    0.2171364 *
      (input.maximalWallThicknessZScore - 11.09) -
    0.0047562 *
      (input.maximalWallThicknessZScore ** 2 - 174.12) +
    0.130365 *
      (input.leftAtrialDiameterZScore - 1.92) +
    0.429624 * Number(input.unexplainedSyncope) +
    0.1861694 * Number(input.nsvt) -
    0.0065555 * (input.lvotGradient - 21.8);

  const survival = Math.pow(
    0.949437808,
    Math.exp(prognosticIndex),
  );

  const risk = clamp((1 - survival) * 100, 0, 100);

  const components = [
    {
      label: "Maximum wall thickness Z-score",
      value: input.maximalWallThicknessZScore.toFixed(2),
    },
    {
      label: "Left atrial diameter Z-score",
      value: input.leftAtrialDiameterZScore.toFixed(2),
    },
    {
      label: "Maximum LVOT gradient",
      value: `${input.lvotGradient} mmHg`,
    },
    {
      label: "NSVT",
      value: yesNo(input.nsvt),
    },
    {
      label: "Unexplained syncope",
      value: yesNo(input.unexplainedSyncope),
    },
  ];

  const secondaryValues = [
    {
      label: "Prognostic index",
      value: prognosticIndex.toFixed(4),
    },
    {
      label: "Estimated five-year SCD-free survival",
      value: `${(survival * 100).toFixed(1)}%`,
    },
  ];

  const riskLevel: ClinicalRiskLevel =
    risk >= 6
      ? "high"
      : risk >= 4
        ? "intermediate"
        : "low";

  const riskLabel =
    riskLevel === "high"
      ? "Higher estimated risk"
      : riskLevel === "intermediate"
        ? "Intermediate estimated risk"
        : "Lower estimated risk";

  return {
    calculatorId: "hcm-risk-kids",
    calculatorName: "HCM Risk-Kids",
    primaryValue: risk,
    primaryValueDisplay: `${risk.toFixed(2)}%`,
    secondaryValues,
    riskLevel,
    riskLabel,
    riskRange:
      riskLevel === "high"
        ? "≥6% at 5 years"
        : riskLevel === "intermediate"
          ? "4% to <6% at 5 years"
          : "<4% at 5 years",
    guidelineSummary:
      "The HCM Risk-Kids estimate should support, rather than replace, specialist pediatric HCM assessment. ICD decisions require individualized review of the complete phenotype, imaging findings, symptoms and family preferences.",
    clinicalInterpretation:
      "The pediatric estimate must be interpreted in the context of age, body size, disease evolution and repeated longitudinal assessment. A single calculation should not be treated as a permanent risk classification.",
    components,
  };
}

/* -------------------------------------------------------------------------- */
/*                               BRUGADA RISK                                 */
/* -------------------------------------------------------------------------- */

export type BrugadaRiskInput = {
  peripheralType1Pattern: boolean;
  probableArrhythmicSyncope: boolean;
  peripheralEarlyRepolarization: boolean;
  spontaneousType1Pattern: boolean;
};

const BRUGADA_RISK_BY_SCORE: Record<number, number> = {
  0: 1.5,
  9: 3.6,
  12: 4.9,
  14: 5.9,
  21: 11.5,
  23: 13.9,
  24: 15.2,
  26: 18.3,
  33: 33.4,
  35: 39.1,
  38: 48.8,
  47: 80.7,
};

export function calculateBrugadaRisk(
  input: BrugadaRiskInput,
): ClinicalCalculationResult {
  const components = [
    {
      label: "Type 1 pattern in peripheral leads",
      value: yesNo(input.peripheralType1Pattern),
      points: input.peripheralType1Pattern ? 9 : 0,
    },
    {
      label: "Probable arrhythmia-related syncope",
      value: yesNo(input.probableArrhythmicSyncope),
      points: input.probableArrhythmicSyncope ? 12 : 0,
    },
    {
      label: "Early repolarization in peripheral leads",
      value: yesNo(input.peripheralEarlyRepolarization),
      points: input.peripheralEarlyRepolarization ? 12 : 0,
    },
    {
      label: "Spontaneous type 1 Brugada pattern",
      value: yesNo(input.spontaneousType1Pattern),
      points: input.spontaneousType1Pattern ? 14 : 0,
    },
  ];

  const score = components.reduce(
    (total, component) => total + (component.points ?? 0),
    0,
  );

  const predictedRisk = BRUGADA_RISK_BY_SCORE[score];

  if (predictedRisk === undefined) {
    throw new Error(
      `No Brugada risk estimate is available for a total score of ${score}.`,
    );
  }

  const riskLevel: ClinicalRiskLevel =
    predictedRisk >= 10
      ? "high"
      : predictedRisk >= 5
        ? "intermediate"
        : "low";

  return {
    calculatorId: "brugada-risk",
    calculatorName: "Brugada Risk",
    primaryValue: predictedRisk,
    primaryValueDisplay: `${predictedRisk.toFixed(1)}%`,
    secondaryValues: [
      {
        label: "Brugada Risk total",
        value: `${score} points`,
      },
    ],
    riskLevel,
    riskLabel:
      riskLevel === "high"
        ? "High predicted risk"
        : riskLevel === "intermediate"
          ? "Increased predicted risk"
          : "Lower predicted risk",
    riskRange:
      riskLevel === "high"
        ? "≥10% predicted 5-year risk"
        : riskLevel === "intermediate"
          ? "5% to <10% predicted 5-year risk"
          : "<5% predicted 5-year risk",
    guidelineSummary:
      "This estimate is a supplementary arrhythmic risk tool and should not be used as the sole basis for ICD decisions. Prior cardiac arrest, documented ventricular arrhythmia and arrhythmic syncope require direct specialist assessment.",
    clinicalInterpretation:
      "Interpret the calculated estimate together with spontaneous type 1 ECG pattern, symptom mechanism, documented ventricular arrhythmias, family history and competing clinical factors.",
    components,
  };
}

/* -------------------------------------------------------------------------- */
/*                            SHANGHAI BRUGADA                                */
/* -------------------------------------------------------------------------- */

export type ShanghaiBrugadaEcg =
  | "none"
  | "drug-induced"
  | "fever-induced"
  | "spontaneous-type-1";

export type ShanghaiBrugadaClinical =
  | "none"
  | "young-af"
  | "unclear-syncope"
  | "arrhythmic-syncope"
  | "agonal-respiration"
  | "cardiac-arrest";

export type ShanghaiBrugadaFamily =
  | "none"
  | "unexplained-scd"
  | "suspicious-scd"
  | "definite-brugada";

export type ShanghaiBrugadaGenetic =
  | "negative-or-unknown"
  | "pathogenic";

export type ShanghaiBrugadaInput = {
  ecg: ShanghaiBrugadaEcg;
  clinical: ShanghaiBrugadaClinical;
  family: ShanghaiBrugadaFamily;
  genetic: ShanghaiBrugadaGenetic;
};

const SHANGHAI_ECG_POINTS: Record<
  ShanghaiBrugadaEcg,
  number
> = {
  none: 0,
  "drug-induced": 2,
  "fever-induced": 3,
  "spontaneous-type-1": 3.5,
};

const SHANGHAI_CLINICAL_POINTS: Record<
  ShanghaiBrugadaClinical,
  number
> = {
  none: 0,
  "young-af": 0.5,
  "unclear-syncope": 1,
  "arrhythmic-syncope": 2,
  "agonal-respiration": 2,
  "cardiac-arrest": 3,
};

const SHANGHAI_FAMILY_POINTS: Record<
  ShanghaiBrugadaFamily,
  number
> = {
  none: 0,
  "unexplained-scd": 0.5,
  "suspicious-scd": 1,
  "definite-brugada": 2,
};

const SHANGHAI_GENETIC_POINTS: Record<
  ShanghaiBrugadaGenetic,
  number
> = {
  "negative-or-unknown": 0,
  pathogenic: 0.5,
};

function formatShanghaiValue(value: string): string {
  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

export function calculateShanghaiBrugada(
  input: ShanghaiBrugadaInput,
): ClinicalCalculationResult {
  const components = [
    {
      label: "ECG criterion",
      value: formatShanghaiValue(input.ecg),
      points: SHANGHAI_ECG_POINTS[input.ecg],
    },
    {
      label: "Clinical history",
      value: formatShanghaiValue(input.clinical),
      points: SHANGHAI_CLINICAL_POINTS[input.clinical],
    },
    {
      label: "Family history",
      value: formatShanghaiValue(input.family),
      points: SHANGHAI_FAMILY_POINTS[input.family],
    },
    {
      label: "Genetic result",
      value: formatShanghaiValue(input.genetic),
      points: SHANGHAI_GENETIC_POINTS[input.genetic],
    },
  ];

  const score = components.reduce(
    (total, component) => total + (component.points ?? 0),
    0,
  );

  const hasQualifyingEcg =
    SHANGHAI_ECG_POINTS[input.ecg] > 0;

  let riskLevel: ClinicalRiskLevel;
  let riskLabel: string;
  let riskRange: string;

  if (!hasQualifyingEcg) {
    riskLevel = "neutral";
    riskLabel = "No qualifying ECG criterion";
    riskRange = `${score.toFixed(1)} points`;
  } else if (score >= 3.5) {
    riskLevel = "high";
    riskLabel = "Probable or definite Brugada syndrome";
    riskRange = "≥3.5 points";
  } else if (score >= 2) {
    riskLevel = "intermediate";
    riskLabel = "Possible Brugada syndrome";
    riskRange = "2.0–3.0 points";
  } else {
    riskLevel = "low";
    riskLabel = "Low diagnostic probability";
    riskRange = "<2 points";
  }

  return {
    calculatorId: "shanghai-brugada",
    calculatorName: "Shanghai Brugada",
    primaryValue: score,
    primaryValueDisplay: `${score.toFixed(1)} points`,
    riskLevel,
    riskLabel,
    riskRange,
    guidelineSummary:
      "The Shanghai score supports diagnostic classification but does not replace expert ECG review. A qualifying Brugada ECG pattern and exclusion of phenocopies remain essential.",
    clinicalInterpretation:
      hasQualifyingEcg
        ? "A qualifying ECG criterion is present. Interpret the total score together with clinical presentation, family history, genetics, drug exposure, fever and alternative causes of Brugada-like ECG changes."
        : "No qualifying ECG criterion was identified. Clinical or genetic findings alone are insufficient to establish Brugada syndrome using this scoring framework.",
    components,
  };
}

/* -------------------------------------------------------------------------- */
/*                              SCHWARTZ LQTS                                 */
/* -------------------------------------------------------------------------- */

export type SchwartzQtcCriterion =
  | "normal"
  | "male-450-459"
  | "460-479"
  | "480-or-more";

export type SchwartzSyncopeCriterion =
  | "none"
  | "without-stress"
  | "with-stress";

export type SchwartzLqtsInput = {
  qtcCriterion: SchwartzQtcCriterion;
  syncopeCriterion: SchwartzSyncopeCriterion;
  exerciseRecoveryQtc480: boolean;
  torsadesDePointes: boolean;
  tWaveAlternans: boolean;
  notchedTWaveThreeLeads: boolean;
  lowHeartRateForAge: boolean;
  congenitalDeafness: boolean;
  familyLqts: boolean;
  familySuddenDeathBefore30: boolean;
  pathogenicVariant: boolean;
};

const SCHWARTZ_QTC_POINTS: Record<
  SchwartzQtcCriterion,
  number
> = {
  normal: 0,
  "male-450-459": 1,
  "460-479": 2,
  "480-or-more": 3.5,
};

const SCHWARTZ_SYNCOPE_POINTS: Record<
  SchwartzSyncopeCriterion,
  number
> = {
  none: 0,
  "without-stress": 1,
  "with-stress": 2,
};

export function calculateSchwartzLqts(
  input: SchwartzLqtsInput,
): ClinicalCalculationResult {
  const components = [
    {
      label: "Resting QTc criterion",
      value: formatShanghaiValue(input.qtcCriterion),
      points: SCHWARTZ_QTC_POINTS[input.qtcCriterion],
    },
    {
      label: "Syncope criterion",
      value: formatShanghaiValue(input.syncopeCriterion),
      points:
        SCHWARTZ_SYNCOPE_POINTS[input.syncopeCriterion],
    },
    {
      label: "QTc ≥480 ms at minute four of exercise recovery",
      value: yesNo(input.exerciseRecoveryQtc480),
      points: input.exerciseRecoveryQtc480 ? 1 : 0,
    },
    {
      label: "Torsades de pointes",
      value: yesNo(input.torsadesDePointes),
      points: input.torsadesDePointes ? 2 : 0,
    },
    {
      label: "T-wave alternans",
      value: yesNo(input.tWaveAlternans),
      points: input.tWaveAlternans ? 1 : 0,
    },
    {
      label: "Notched T wave in three leads",
      value: yesNo(input.notchedTWaveThreeLeads),
      points: input.notchedTWaveThreeLeads ? 1 : 0,
    },
    {
      label: "Low resting heart rate for age",
      value: yesNo(input.lowHeartRateForAge),
      points: input.lowHeartRateForAge ? 0.5 : 0,
    },
    {
      label: "Congenital deafness",
      value: yesNo(input.congenitalDeafness),
      points: input.congenitalDeafness ? 0.5 : 0,
    },
    {
      label: "Family member with LQTS",
      value: yesNo(input.familyLqts),
      points: input.familyLqts ? 1 : 0,
    },
    {
      label: "Unexplained family sudden death before age 30",
      value: yesNo(input.familySuddenDeathBefore30),
      points: input.familySuddenDeathBefore30 ? 0.5 : 0,
    },
    {
      label: "Pathogenic LQTS-associated variant",
      value: yesNo(input.pathogenicVariant),
      points: input.pathogenicVariant ? 3.5 : 0,
    },
  ];

  const score = components.reduce(
    (total, component) => total + (component.points ?? 0),
    0,
  );

  const riskLevel: ClinicalRiskLevel =
    score > 3
      ? "high"
      : score > 1
        ? "intermediate"
        : "low";

  return {
    calculatorId: "lqts-schwartz",
    calculatorName: "Schwartz LQTS",
    primaryValue: score,
    primaryValueDisplay: `${score.toFixed(1)} points`,
    riskLevel,
    riskLabel:
      riskLevel === "high"
        ? "Clinical diagnosis supported"
        : riskLevel === "intermediate"
          ? "Intermediate probability"
          : "Low probability",
    riskRange:
      riskLevel === "high"
        ? ">3 points"
        : riskLevel === "intermediate"
          ? "1.5–3 points"
          : "≤1 point",
    guidelineSummary:
      "A score above 3 supports a clinical diagnosis of long QT syndrome when secondary causes of QT prolongation have been excluded. Intermediate results require further specialist evaluation.",
    clinicalInterpretation:
      "Interpret the score together with manual QT measurement, correction formula, medication exposure, electrolytes, QRS duration, symptoms, family history and genetic findings. Avoid counting syncope and torsades from the same event twice.",
    components,
  };
}

/* -------------------------------------------------------------------------- */
/*                                     QTc                                    */
/* -------------------------------------------------------------------------- */

export type QtcSex = "male" | "female";

export type QtcFormula =
  | "bazett"
  | "fridericia"
  | "framingham"
  | "hodges";

export type QtcInput = {
  qtMilliseconds: number;
  heartRate: number;
  sex: QtcSex;
  selectedFormula: QtcFormula;
};

export function calculateQtc(
  input: QtcInput,
): ClinicalCalculationResult {
  assertRange(
    input.qtMilliseconds,
    200,
    700,
    "QT interval",
  );

  assertRange(
    input.heartRate,
    20,
    250,
    "Heart rate",
  );

  const rrSeconds = 60 / input.heartRate;

  const results: Record<QtcFormula, number> = {
    bazett:
      input.qtMilliseconds / Math.sqrt(rrSeconds),

    fridericia:
      input.qtMilliseconds / Math.cbrt(rrSeconds),

    framingham:
      input.qtMilliseconds + 154 * (1 - rrSeconds),

    hodges:
      input.qtMilliseconds +
      1.75 * (input.heartRate - 60),
  };

  const selectedQtc = results[input.selectedFormula];

  const prolongedThreshold =
    input.sex === "male" ? 450 : 460;

  let riskLevel: ClinicalRiskLevel;
  let riskLabel: string;
  let riskRange: string;
  let guidelineSummary: string;

  if (selectedQtc < 350) {
    riskLevel = "intermediate";
    riskLabel = "Short QT range";
    riskRange = "<350 ms";
    guidelineSummary =
      "The calculated QTc is below 350 ms. Confirm the QT measurement manually and assess the ECG morphology, symptoms, family history and possible secondary causes.";
  } else if (selectedQtc < prolongedThreshold) {
    riskLevel = "low";
    riskLabel = "Within reference range";
    riskRange = `<${prolongedThreshold} ms`;
    guidelineSummary =
      "The selected QTc result is below the sex-specific prolonged-QT reference threshold. Clinical interpretation remains necessary when symptoms, medication exposure or inherited arrhythmia suspicion is present.";
  } else if (selectedQtc < 500) {
    riskLevel = "intermediate";
    riskLabel = "Prolonged QTc";
    riskRange = `${prolongedThreshold}–499 ms`;
    guidelineSummary =
      "The selected QTc is prolonged. Review QT measurement, correction formula, medication exposure, electrolytes, QRS duration and the clinical context.";
  } else {
    riskLevel = "high";
    riskLabel = "Markedly prolonged QTc";
    riskRange = "≥500 ms";
    guidelineSummary =
      "A QTc of at least 500 ms is markedly prolonged. Confirm the measurement and promptly assess reversible, acquired and inherited causes.";
  }

  return {
    calculatorId: "qtc",
    calculatorName: "Corrected QT Interval",
    primaryValue: selectedQtc,
    primaryValueDisplay: `${Math.round(selectedQtc)} ms`,
    secondaryValues: [
      {
        label: "Bazett QTc",
        value: `${Math.round(results.bazett)} ms`,
      },
      {
        label: "Fridericia QTc",
        value: `${Math.round(results.fridericia)} ms`,
      },
      {
        label: "Framingham QTc",
        value: `${Math.round(results.framingham)} ms`,
      },
      {
        label: "Hodges QTc",
        value: `${Math.round(results.hodges)} ms`,
      },
      {
        label: "RR interval",
        value: `${rrSeconds.toFixed(3)} s`,
      },
    ],
    riskLevel,
    riskLabel,
    riskRange,
    guidelineSummary,
    clinicalInterpretation:
      "Bazett correction may overcorrect at faster heart rates and undercorrect at slower heart rates. The QT interval should be measured manually in an appropriate lead and interpreted alongside QRS duration and clinical context.",
    components: [
      {
        label: "Measured QT interval",
        value: `${input.qtMilliseconds} ms`,
      },
      {
        label: "Heart rate",
        value: `${input.heartRate} bpm`,
      },
      {
        label: "Sex",
        value: input.sex === "male" ? "Male" : "Female",
      },
      {
        label: "Selected formula",
        value:
          input.selectedFormula.charAt(0).toUpperCase() +
          input.selectedFormula.slice(1),
      },
    ],
  };
}