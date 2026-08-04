import type {
  BrugadaRiskInput,
  Cha2ds2VaInput,
  ClinicalCalculationResult,
  ClinicalCalculatorId,
  HasBledInput,
  HcmRiskKidsInput,
  HcmRiskScdInput,
  PainesdInput,
  QtcInput,
  SchwartzLqtsInput,
  ShanghaiBrugadaInput,
} from "@/src/lib/clinical-assistant/calculators";

export type ExtractionConfidence =
  | "high"
  | "moderate"
  | "low";

export type AssistantStatus =
  | "complete"
  | "missing-data"
  | "invalid-data"
  | "unsupported"
  | "clarification-required";

export type ClinicalVariableType =
  | "number"
  | "boolean"
  | "string"
  | "enum";

export type ClinicalVariableValue =
  | number
  | boolean
  | string
  | null;

export type ClinicalVariableDefinition = {
  key: string;
  label: string;
  type: ClinicalVariableType;
  unit?: string;
  required: boolean;
  description: string;
  allowedValues?: readonly string[];
  minimum?: number;
  maximum?: number;
};

export type ExtractedVariable = {
  key: string;
  label: string;
  value: ClinicalVariableValue;
  displayValue: string | null;
  sourceText?: string | null;
  confidence?: ExtractionConfidence;
};

export type MissingVariable = {
  key: string;
  label: string;
  description: string;
  unit?: string;
  allowedValues?: readonly string[];
};

export type ValidationError = {
  key: string;
  label: string;
  message: string;
};

export type CalculatorSelection = {
  calculatorId: ClinicalCalculatorId | null;
  calculatorName: string | null;
  detectedCondition: string;
  confidence: ExtractionConfidence;
  rationale: string;
};

export type ClinicalExtractionBase = {
  calculatorId: ClinicalCalculatorId | null;
  detectedCondition: string;
  confidence: ExtractionConfidence;
  rationale: string;
  extractionNotes: string[];
};

export type Cha2ds2VaExtraction =
  ClinicalExtractionBase & {
    calculatorId: "cha2ds2-va";
    variables: {
      age: number | null;
      heartFailure: boolean | null;
      hypertension: boolean | null;
      diabetes: boolean | null;
      previousStroke: boolean | null;
      vascularDisease: boolean | null;
    };
  };

export type HasBledExtraction =
  ClinicalExtractionBase & {
    calculatorId: "has-bled";
    variables: {
      uncontrolledHypertension: boolean | null;
      renalDysfunction: boolean | null;
      liverDysfunction: boolean | null;
      previousStroke: boolean | null;
      bleedingHistory: boolean | null;
      labileInr: boolean | null;
      ageOver65: boolean | null;
      antiplateletOrNsaid: boolean | null;
      alcoholExcess: boolean | null;
    };
  };

export type PainesdExtraction =
  ClinicalExtractionBase & {
    calculatorId: "painesd";
    variables: {
      pulmonaryDisease: boolean | null;
      ageOver60: boolean | null;
      ischemicCardiomyopathy: boolean | null;
      nyhaClassThreeOrFour: boolean | null;
      ejectionFractionBelow25: boolean | null;
      vtStorm: boolean | null;
      diabetes: boolean | null;
    };
  };

export type HcmRiskScdExtraction =
  ClinicalExtractionBase & {
    calculatorId: "hcm-risk-scd";
    variables: {
      age: number | null;
      maxWallThickness: number | null;
      leftAtrialDiameter: number | null;
      lvotGradient: number | null;
      familyHistory: boolean | null;
      nsvt: boolean | null;
      unexplainedSyncope: boolean | null;
    };
  };

export type HcmRiskKidsExtraction =
  ClinicalExtractionBase & {
    calculatorId: "hcm-risk-kids";
    variables: {
      maximalWallThicknessZScore: number | null;
      leftAtrialDiameterZScore: number | null;
      lvotGradient: number | null;
      nsvt: boolean | null;
      unexplainedSyncope: boolean | null;
    };
  };

export type BrugadaRiskExtraction =
  ClinicalExtractionBase & {
    calculatorId: "brugada-risk";
    variables: {
      peripheralType1Pattern: boolean | null;
      probableArrhythmicSyncope: boolean | null;
      peripheralEarlyRepolarization: boolean | null;
      spontaneousType1Pattern: boolean | null;
    };
  };

export type ShanghaiBrugadaExtraction =
  ClinicalExtractionBase & {
    calculatorId: "shanghai-brugada";
    variables: {
      ecg:
        | ShanghaiBrugadaInput["ecg"]
        | null;
      clinical:
        | ShanghaiBrugadaInput["clinical"]
        | null;
      family:
        | ShanghaiBrugadaInput["family"]
        | null;
      genetic:
        | ShanghaiBrugadaInput["genetic"]
        | null;
    };
  };

export type SchwartzLqtsExtraction =
  ClinicalExtractionBase & {
    calculatorId: "lqts-schwartz";
    variables: {
      qtcCriterion:
        | SchwartzLqtsInput["qtcCriterion"]
        | null;
      syncopeCriterion:
        | SchwartzLqtsInput["syncopeCriterion"]
        | null;
      exerciseRecoveryQtc480: boolean | null;
      torsadesDePointes: boolean | null;
      tWaveAlternans: boolean | null;
      notchedTWaveThreeLeads: boolean | null;
      lowHeartRateForAge: boolean | null;
      congenitalDeafness: boolean | null;
      familyLqts: boolean | null;
      familySuddenDeathBefore30: boolean | null;
      pathogenicVariant: boolean | null;
    };
  };

export type QtcExtraction =
  ClinicalExtractionBase & {
    calculatorId: "qtc";
    variables: {
      qtMilliseconds: number | null;
      heartRate: number | null;
      sex: QtcInput["sex"] | null;
      selectedFormula:
        | QtcInput["selectedFormula"]
        | null;
    };
  };

export type UnsupportedExtraction =
  ClinicalExtractionBase & {
    calculatorId: null;
    variables: Record<string, never>;
  };

export type ClinicalExtraction =
  | Cha2ds2VaExtraction
  | HasBledExtraction
  | PainesdExtraction
  | HcmRiskScdExtraction
  | HcmRiskKidsExtraction
  | BrugadaRiskExtraction
  | ShanghaiBrugadaExtraction
  | SchwartzLqtsExtraction
  | QtcExtraction
  | UnsupportedExtraction;

export type CalculatorInputMap = {
  "cha2ds2-va": Cha2ds2VaInput;
  "has-bled": HasBledInput;
  painesd: PainesdInput;
  "hcm-risk-scd": HcmRiskScdInput;
  "hcm-risk-kids": HcmRiskKidsInput;
  "brugada-risk": BrugadaRiskInput;
  "shanghai-brugada": ShanghaiBrugadaInput;
  "lqts-schwartz": SchwartzLqtsInput;
  qtc: QtcInput;
};

export type CalculatorRegistryEntry<
  TId extends ClinicalCalculatorId =
    ClinicalCalculatorId,
> = {
  id: TId;
  name: string;
  fullName: string;
  category: string;
  description: string;
  href: string;
  variables: readonly ClinicalVariableDefinition[];
  calculate: (
    input: CalculatorInputMap[TId],
  ) => ClinicalCalculationResult;
};

export type AssistantCompleteResponse = {
  status: "complete";
  detectedCondition: string;
  calculatorId: ClinicalCalculatorId;
  calculatorName: string;
  confidence: ExtractionConfidence;
  rationale: string;
  extractedVariables: ExtractedVariable[];
  extractionNotes: string[];
  result: ClinicalCalculationResult;
  disclaimer: string;
};

export type AssistantMissingDataResponse = {
  status: "missing-data";
  detectedCondition: string;
  calculatorId: ClinicalCalculatorId;
  calculatorName: string;
  confidence: ExtractionConfidence;
  rationale: string;
  extractedVariables: ExtractedVariable[];
  missingVariables: MissingVariable[];
  extractionNotes: string[];
  message: string;
};

export type AssistantInvalidDataResponse = {
  status: "invalid-data";
  detectedCondition: string;
  calculatorId: ClinicalCalculatorId;
  calculatorName: string;
  confidence: ExtractionConfidence;
  rationale: string;
  extractedVariables: ExtractedVariable[];
  validationErrors: ValidationError[];
  extractionNotes: string[];
  message: string;
};

export type AssistantUnsupportedResponse = {
  status: "unsupported";
  detectedCondition: string;
  calculatorId: null;
  calculatorName: null;
  confidence: ExtractionConfidence;
  rationale: string;
  extractionNotes: string[];
  message: string;
};

export type ClinicalAssistantResponse =
  | AssistantCompleteResponse
  | AssistantMissingDataResponse
  | AssistantInvalidDataResponse
  | AssistantUnsupportedResponse;