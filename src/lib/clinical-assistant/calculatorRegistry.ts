import {
  calculateBrugadaRisk,
  calculateCha2ds2Va,
  calculateHasBled,
  calculateHcmRiskKids,
  calculateHcmRiskScd,
  calculatePainesd,
  calculateQtc,
  calculateSchwartzLqts,
  calculateShanghaiBrugada,
  type ClinicalCalculationResult,
  type ClinicalCalculatorId,
} from "@/src/lib/clinical-assistant//calculators";

import type {
  CalculatorInputMap,
  ClinicalVariableDefinition,
  ClinicalVariableValue,
  ExtractedVariable,
  MissingVariable,
  ValidationError,
} from "@/src/lib/clinical-assistant/types";

const booleanValues = ["yes", "no"] as const;

const sexValues = ["male", "female"] as const;

const qtcFormulaValues = [
  "bazett",
  "fridericia",
  "framingham",
  "hodges",
] as const;

const shanghaiEcgValues = [
  "none",
  "drug-induced",
  "fever-induced",
  "spontaneous-type-1",
] as const;

const shanghaiClinicalValues = [
  "none",
  "young-af",
  "unclear-syncope",
  "arrhythmic-syncope",
  "agonal-respiration",
  "cardiac-arrest",
] as const;

const shanghaiFamilyValues = [
  "none",
  "unexplained-scd",
  "suspicious-scd",
  "definite-brugada",
] as const;

const shanghaiGeneticValues = [
  "negative-or-unknown",
  "pathogenic",
] as const;

const schwartzQtcValues = [
  "normal",
  "male-450-459",
  "460-479",
  "480-or-more",
] as const;

const schwartzSyncopeValues = [
  "none",
  "without-stress",
  "with-stress",
] as const;

const cha2ds2VaVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "age",
      label: "Age",
      type: "number",
      unit: "years",
      required: true,
      minimum: 18,
      maximum: 120,
      description: "Patient age in completed years.",
    },
    {
      key: "heartFailure",
      label: "Heart failure or LV dysfunction",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Clinical heart failure or documented left ventricular systolic dysfunction.",
    },
    {
      key: "hypertension",
      label: "Hypertension",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "History of hypertension or current antihypertensive treatment.",
    },
    {
      key: "diabetes",
      label: "Diabetes mellitus",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Documented diabetes mellitus or current glucose-lowering treatment.",
    },
    {
      key: "previousStroke",
      label: "Previous stroke, TIA or systemic embolism",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Previous ischemic stroke, transient ischemic attack or systemic embolism.",
    },
    {
      key: "vascularDisease",
      label: "Vascular disease",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Previous myocardial infarction, peripheral arterial disease or qualifying aortic or coronary disease.",
    },
  ];

const hasBledVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "uncontrolledHypertension",
      label: "Uncontrolled hypertension",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Systolic blood pressure greater than 160 mmHg.",
    },
    {
      key: "renalDysfunction",
      label: "Abnormal renal function",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Clinically qualifying renal impairment.",
    },
    {
      key: "liverDysfunction",
      label: "Abnormal liver function",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Clinically qualifying hepatic dysfunction.",
    },
    {
      key: "previousStroke",
      label: "Previous stroke",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "History of ischemic or hemorrhagic stroke.",
    },
    {
      key: "bleedingHistory",
      label: "Bleeding history or predisposition",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Previous major bleeding or a clinically important bleeding predisposition.",
    },
    {
      key: "labileInr",
      label: "Labile INR",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Unstable or high INR values or poor time in therapeutic range during vitamin K antagonist treatment.",
    },
    {
      key: "ageOver65",
      label: "Age over 65 years",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Patient age is greater than 65 years.",
    },
    {
      key: "antiplateletOrNsaid",
      label: "Antiplatelet or NSAID use",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Concomitant antiplatelet treatment or regular NSAID use.",
    },
    {
      key: "alcoholExcess",
      label: "Alcohol excess",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Excessive or clinically relevant alcohol use.",
    },
  ];

const painesdVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "pulmonaryDisease",
      label: "Pulmonary disease",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "COPD or another clinically significant chronic pulmonary disorder.",
    },
    {
      key: "ageOver60",
      label: "Age over 60 years",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Patient age is greater than 60 years.",
    },
    {
      key: "ischemicCardiomyopathy",
      label: "Ischemic cardiomyopathy",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Ventricular dysfunction attributable to ischemic heart disease.",
    },
    {
      key: "nyhaClassThreeOrFour",
      label: "NYHA class III or IV",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Marked limitation of physical activity or heart failure symptoms at rest.",
    },
    {
      key: "ejectionFractionBelow25",
      label: "LVEF below 25%",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Documented left ventricular ejection fraction below 25%.",
    },
    {
      key: "vtStorm",
      label: "VT storm",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Recurrent ventricular tachycardia requiring repeated therapies.",
    },
    {
      key: "diabetes",
      label: "Diabetes mellitus",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Documented diabetes mellitus.",
    },
  ];

const hcmRiskScdVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "age",
      label: "Age",
      type: "number",
      unit: "years",
      required: true,
      minimum: 16,
      maximum: 100,
      description: "Patient age in completed years.",
    },
    {
      key: "maxWallThickness",
      label: "Maximum wall thickness",
      type: "number",
      unit: "mm",
      required: true,
      minimum: 10,
      maximum: 50,
      description:
        "Maximum left ventricular wall thickness measured in millimetres.",
    },
    {
      key: "leftAtrialDiameter",
      label: "Left atrial diameter",
      type: "number",
      unit: "mm",
      required: true,
      minimum: 20,
      maximum: 80,
      description:
        "Anteroposterior left atrial diameter measured in millimetres.",
    },
    {
      key: "lvotGradient",
      label: "Maximum LVOT gradient",
      type: "number",
      unit: "mmHg",
      required: true,
      minimum: 0,
      maximum: 250,
      description:
        "Maximum resting or provoked left ventricular outflow tract gradient.",
    },
    {
      key: "familyHistory",
      label: "Family history of sudden cardiac death",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Qualifying family history of sudden cardiac death.",
    },
    {
      key: "nsvt",
      label: "Non-sustained ventricular tachycardia",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Documented non-sustained ventricular tachycardia.",
    },
    {
      key: "unexplainedSyncope",
      label: "Unexplained syncope",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Recent unexplained syncope considered potentially arrhythmic.",
    },
  ];

const hcmRiskKidsVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "maximalWallThicknessZScore",
      label: "Maximum wall thickness Z-score",
      type: "number",
      required: true,
      minimum: -5,
      maximum: 30,
      description:
        "Body-size-adjusted maximum left ventricular wall thickness Z-score.",
    },
    {
      key: "leftAtrialDiameterZScore",
      label: "Left atrial diameter Z-score",
      type: "number",
      required: true,
      minimum: -5,
      maximum: 20,
      description:
        "Body-size-adjusted left atrial diameter Z-score.",
    },
    {
      key: "lvotGradient",
      label: "Maximum LVOT gradient",
      type: "number",
      unit: "mmHg",
      required: true,
      minimum: 0,
      maximum: 250,
      description:
        "Maximum left ventricular outflow tract gradient.",
    },
    {
      key: "nsvt",
      label: "Non-sustained ventricular tachycardia",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Documented non-sustained ventricular tachycardia.",
    },
    {
      key: "unexplainedSyncope",
      label: "Unexplained syncope",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Unexplained syncope considered clinically relevant.",
    },
  ];

const brugadaRiskVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "peripheralType1Pattern",
      label: "Type 1 pattern in peripheral leads",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Type 1 Brugada ECG pattern documented in peripheral leads.",
    },
    {
      key: "probableArrhythmicSyncope",
      label: "Probable arrhythmic syncope",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Syncope considered probably related to an arrhythmia.",
    },
    {
      key: "peripheralEarlyRepolarization",
      label: "Peripheral early repolarization",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Early repolarization in inferior or lateral peripheral ECG leads.",
    },
    {
      key: "spontaneousType1Pattern",
      label: "Spontaneous type 1 pattern",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Spontaneous type 1 Brugada ECG pattern without drug provocation.",
    },
  ];

const shanghaiBrugadaVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "ecg",
      label: "ECG criterion",
      type: "enum",
      required: true,
      allowedValues: shanghaiEcgValues,
      description:
        "Highest qualifying Shanghai Brugada ECG category.",
    },
    {
      key: "clinical",
      label: "Clinical history",
      type: "enum",
      required: true,
      allowedValues: shanghaiClinicalValues,
      description:
        "Highest qualifying clinical presentation category.",
    },
    {
      key: "family",
      label: "Family history",
      type: "enum",
      required: true,
      allowedValues: shanghaiFamilyValues,
      description:
        "Highest qualifying family-history category.",
    },
    {
      key: "genetic",
      label: "Genetic result",
      type: "enum",
      required: true,
      allowedValues: shanghaiGeneticValues,
      description:
        "Qualifying Brugada-associated genetic result.",
    },
  ];

const schwartzLqtsVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "qtcCriterion",
      label: "Resting QTc criterion",
      type: "enum",
      required: true,
      allowedValues: schwartzQtcValues,
      description:
        "Highest applicable resting QTc category.",
    },
    {
      key: "syncopeCriterion",
      label: "Syncope criterion",
      type: "enum",
      required: true,
      allowedValues: schwartzSyncopeValues,
      description:
        "Highest applicable syncope category.",
    },
    {
      key: "exerciseRecoveryQtc480",
      label: "QTc ≥480 ms during exercise recovery",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "QTc at least 480 ms during the fourth minute of exercise recovery.",
    },
    {
      key: "torsadesDePointes",
      label: "Torsades de pointes",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Documented torsades de pointes.",
    },
    {
      key: "tWaveAlternans",
      label: "T-wave alternans",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Beat-to-beat T-wave alternation.",
    },
    {
      key: "notchedTWaveThreeLeads",
      label: "Notched T waves in three leads",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Notched T-wave morphology in at least three leads.",
    },
    {
      key: "lowHeartRateForAge",
      label: "Low heart rate for age",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Resting heart rate below the second centile for age.",
    },
    {
      key: "congenitalDeafness",
      label: "Congenital deafness",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Congenital sensorineural hearing loss.",
    },
    {
      key: "familyLqts",
      label: "Family member with LQTS",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Family member with a clinical or molecular LQTS diagnosis.",
    },
    {
      key: "familySuddenDeathBefore30",
      label: "Family sudden death before age 30",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Unexplained sudden cardiac death before age 30 in an immediate family member.",
    },
    {
      key: "pathogenicVariant",
      label: "Pathogenic LQTS variant",
      type: "boolean",
      required: true,
      allowedValues: booleanValues,
      description:
        "Pathogenic or likely pathogenic variant in an LQTS-associated gene.",
    },
  ];

const qtcVariables: readonly ClinicalVariableDefinition[] =
  [
    {
      key: "qtMilliseconds",
      label: "Measured QT interval",
      type: "number",
      unit: "ms",
      required: true,
      minimum: 200,
      maximum: 700,
      description:
        "Measured uncorrected QT interval in milliseconds.",
    },
    {
      key: "heartRate",
      label: "Heart rate",
      type: "number",
      unit: "bpm",
      required: true,
      minimum: 20,
      maximum: 250,
      description:
        "Heart rate at the time of QT measurement.",
    },
    {
      key: "sex",
      label: "Sex",
      type: "enum",
      required: true,
      allowedValues: sexValues,
      description:
        "Sex used for QTc reference-range interpretation.",
    },
    {
      key: "selectedFormula",
      label: "Correction formula",
      type: "enum",
      required: true,
      allowedValues: qtcFormulaValues,
      description:
        "Preferred heart-rate correction formula. Fridericia is appropriate as a default when no formula is explicitly requested.",
    },
  ];

export const calculatorRegistry = {
  "cha2ds2-va": {
    id: "cha2ds2-va",
    name: "CHA₂DS₂-VA",
    fullName: "CHA₂DS₂-VA Stroke Risk Score",
    category: "Atrial Fibrillation",
    description:
      "Estimates thromboembolic risk in patients with atrial fibrillation.",
    href: "/scores/cha2ds2-va",
    variables: cha2ds2VaVariables,
    calculate: calculateCha2ds2Va,
  },

  "has-bled": {
    id: "has-bled",
    name: "HAS-BLED",
    fullName: "HAS-BLED Bleeding Risk Score",
    category: "Anticoagulation",
    description:
      "Identifies bleeding risk factors in patients receiving anticoagulation.",
    href: "/scores/has-bled",
    variables: hasBledVariables,
    calculate: calculateHasBled,
  },

  painesd: {
    id: "painesd",
    name: "PAINESD",
    fullName: "PAINESD Hemodynamic Risk Score",
    category: "Ventricular Arrhythmias",
    description:
      "Estimates acute hemodynamic decompensation risk during VT ablation.",
    href: "/scores/painesd",
    variables: painesdVariables,
    calculate: calculatePainesd,
  },

  "hcm-risk-scd": {
    id: "hcm-risk-scd",
    name: "HCM Risk-SCD",
    fullName: "HCM Risk-SCD Calculator",
    category: "Sudden Cardiac Death",
    description:
      "Estimates five-year sudden cardiac death risk in adults with HCM.",
    href: "/scores/hcm-risk-scd",
    variables: hcmRiskScdVariables,
    calculate: calculateHcmRiskScd,
  },

  "hcm-risk-kids": {
    id: "hcm-risk-kids",
    name: "HCM Risk-Kids",
    fullName: "HCM Risk-Kids SCD Calculator",
    category: "Sudden Cardiac Death",
    description:
      "Estimates five-year sudden cardiac death risk in children with HCM.",
    href: "/scores/hcm-risk-kids",
    variables: hcmRiskKidsVariables,
    calculate: calculateHcmRiskKids,
  },

  "brugada-risk": {
    id: "brugada-risk",
    name: "Brugada Risk",
    fullName: "Brugada Syndrome Arrhythmic Risk Assessment",
    category: "Channelopathies",
    description:
      "Estimates arrhythmic risk using the Brugada Risk model.",
    href: "/scores/brugada-risk",
    variables: brugadaRiskVariables,
    calculate: calculateBrugadaRisk,
  },

  "shanghai-brugada": {
    id: "shanghai-brugada",
    name: "Shanghai Brugada",
    fullName: "Shanghai Brugada Diagnostic Score",
    category: "Channelopathies",
    description:
      "Supports diagnostic classification in suspected Brugada syndrome.",
    href: "/scores/shanghai-brugada",
    variables: shanghaiBrugadaVariables,
    calculate: calculateShanghaiBrugada,
  },

  "lqts-schwartz": {
    id: "lqts-schwartz",
    name: "Schwartz LQTS",
    fullName: "Schwartz Long QT Syndrome Diagnostic Score",
    category: "Channelopathies",
    description:
      "Supports the clinical diagnosis of congenital long QT syndrome.",
    href: "/scores/lqts-schwartz",
    variables: schwartzLqtsVariables,
    calculate: calculateSchwartzLqts,
  },

  qtc: {
    id: "qtc",
    name: "QTc",
    fullName: "Corrected QT Interval Calculator",
    category: "Electrocardiography",
    description:
      "Calculates corrected QT using commonly used heart-rate correction formulas.",
    href: "/scores/qtc",
    variables: qtcVariables,
    calculate: calculateQtc,
  },
} as const;

export function getCalculatorRegistryEntry(
  calculatorId: ClinicalCalculatorId,
) {
  return calculatorRegistry[calculatorId];
}

export function getCalculatorNames(): Array<{
  id: ClinicalCalculatorId;
  name: string;
  description: string;
}> {
  return Object.values(calculatorRegistry).map(
    (calculator) => ({
      id: calculator.id,
      name: calculator.name,
      description: calculator.description,
    }),
  );
}

export function getMissingVariables(
  calculatorId: ClinicalCalculatorId,
  variables: Record<string, ClinicalVariableValue>,
): MissingVariable[] {
  const calculator =
    getCalculatorRegistryEntry(calculatorId);

  return calculator.variables
    .filter(
      (definition) =>
        definition.required &&
        (variables[definition.key] === null ||
          variables[definition.key] === undefined),
    )
    .map((definition) => ({
      key: definition.key,
      label: definition.label,
      description: definition.description,
      unit: definition.unit,
      allowedValues: definition.allowedValues,
    }));
}

export function validateExtractedVariables(
  calculatorId: ClinicalCalculatorId,
  variables: Record<string, ClinicalVariableValue>,
): ValidationError[] {
  const calculator =
    getCalculatorRegistryEntry(calculatorId);

  const errors: ValidationError[] = [];

  calculator.variables.forEach((definition) => {
    const value = variables[definition.key];

    if (value === null || value === undefined) {
      return;
    }

    if (
      definition.type === "number" &&
      typeof value !== "number"
    ) {
      errors.push({
        key: definition.key,
        label: definition.label,
        message: `${definition.label} must be numeric.`,
      });

      return;
    }

    if (
      definition.type === "boolean" &&
      typeof value !== "boolean"
    ) {
      errors.push({
        key: definition.key,
        label: definition.label,
        message: `${definition.label} must be Yes or No.`,
      });

      return;
    }

    if (
      definition.type === "enum" &&
      typeof value !== "string"
    ) {
      errors.push({
        key: definition.key,
        label: definition.label,
        message: `${definition.label} contains an invalid value.`,
      });

      return;
    }

    if (
      typeof value === "number" &&
      definition.minimum !== undefined &&
      value < definition.minimum
    ) {
      errors.push({
        key: definition.key,
        label: definition.label,
        message: `${definition.label} must be at least ${definition.minimum}${definition.unit ? ` ${definition.unit}` : ""}.`,
      });
    }

    if (
      typeof value === "number" &&
      definition.maximum !== undefined &&
      value > definition.maximum
    ) {
      errors.push({
        key: definition.key,
        label: definition.label,
        message: `${definition.label} must not exceed ${definition.maximum}${definition.unit ? ` ${definition.unit}` : ""}.`,
      });
    }

    if (
      typeof value === "string" &&
      definition.allowedValues &&
      !definition.allowedValues.includes(value)
    ) {
      errors.push({
        key: definition.key,
        label: definition.label,
        message: `${definition.label} must be one of: ${definition.allowedValues.join(", ")}.`,
      });
    }
  });

  return errors;
}

function formatEnumValue(value: string): string {
  const specialLabels: Record<string, string> = {
    none: "None",
    male: "Male",
    female: "Female",
    bazett: "Bazett",
    fridericia: "Fridericia",
    framingham: "Framingham",
    hodges: "Hodges",
    "drug-induced": "Drug-induced",
    "fever-induced": "Fever-induced",
    "spontaneous-type-1":
      "Spontaneous type 1",
    "young-af":
      "Atrial fibrillation or flutter before age 30",
    "unclear-syncope":
      "Syncope of unclear mechanism",
    "arrhythmic-syncope":
      "Suspected arrhythmic syncope",
    "agonal-respiration":
      "Nocturnal agonal respiration",
    "cardiac-arrest":
      "Cardiac arrest or documented VF/polymorphic VT",
    "unexplained-scd":
      "Unexplained sudden cardiac death",
    "suspicious-scd":
      "Suspicious sudden cardiac death",
    "definite-brugada":
      "Relative with definite Brugada syndrome",
    "negative-or-unknown":
      "Negative or unknown",
    pathogenic: "Pathogenic variant",
    normal: "No qualifying QTc criterion",
    "male-450-459":
      "QTc 450–459 ms in a male patient",
    "460-479": "QTc 460–479 ms",
    "480-or-more": "QTc ≥480 ms",
    "without-stress": "Syncope without stress",
    "with-stress": "Syncope with stress",
  };

  return (
    specialLabels[value] ??
    value
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1),
      )
      .join(" ")
  );
}

export function formatExtractedVariables(
  calculatorId: ClinicalCalculatorId,
  variables: Record<string, ClinicalVariableValue>,
): ExtractedVariable[] {
  const calculator =
    getCalculatorRegistryEntry(calculatorId);

  return calculator.variables.map((definition) => {
    const value = variables[definition.key];

    let displayValue: string | null = null;

    if (value === null || value === undefined) {
      displayValue = null;
    } else if (typeof value === "boolean") {
      displayValue = value ? "Yes" : "No";
    } else if (typeof value === "number") {
      displayValue = definition.unit
        ? `${value} ${definition.unit}`
        : String(value);
    } else {
      displayValue = formatEnumValue(value);
    }

    return {
      key: definition.key,
      label: definition.label,
      value: value ?? null,
      displayValue,
    };
  });
}

export function buildCalculatorInput(
  calculatorId: ClinicalCalculatorId,
  variables: Record<string, ClinicalVariableValue>,
): CalculatorInputMap[ClinicalCalculatorId] {
  const calculator =
    getCalculatorRegistryEntry(calculatorId);

  const input: Record<string, unknown> = {};

  calculator.variables.forEach((definition) => {
    const value = variables[definition.key];

    if (value === null || value === undefined) {
      throw new Error(
        `Missing required variable: ${definition.label}.`,
      );
    }

    input[definition.key] = value;
  });

  return input as CalculatorInputMap[ClinicalCalculatorId];
}

export function calculateFromExtractedVariables(
  calculatorId: ClinicalCalculatorId,
  variables: Record<string, ClinicalVariableValue>,
): ClinicalCalculationResult {
  const input = buildCalculatorInput(
    calculatorId,
    variables,
  );

  switch (calculatorId) {
    case "cha2ds2-va":
      return calculateCha2ds2Va(
        input as CalculatorInputMap["cha2ds2-va"],
      );

    case "has-bled":
      return calculateHasBled(
        input as CalculatorInputMap["has-bled"],
      );

    case "painesd":
      return calculatePainesd(
        input as CalculatorInputMap["painesd"],
      );

    case "hcm-risk-scd":
      return calculateHcmRiskScd(
        input as CalculatorInputMap["hcm-risk-scd"],
      );

    case "hcm-risk-kids":
      return calculateHcmRiskKids(
        input as CalculatorInputMap["hcm-risk-kids"],
      );

    case "brugada-risk":
      return calculateBrugadaRisk(
        input as CalculatorInputMap["brugada-risk"],
      );

    case "shanghai-brugada":
      return calculateShanghaiBrugada(
        input as CalculatorInputMap["shanghai-brugada"],
      );

    case "lqts-schwartz":
      return calculateSchwartzLqts(
        input as CalculatorInputMap["lqts-schwartz"],
      );

    case "qtc":
      return calculateQtc(
        input as CalculatorInputMap["qtc"],
      );

    default: {
      const exhaustiveCheck: never = calculatorId;

      throw new Error(
        `Unsupported calculator: ${exhaustiveCheck}`,
      );
    }
  }
}