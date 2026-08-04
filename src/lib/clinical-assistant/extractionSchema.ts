export const supportedCalculatorIds = [
  "cha2ds2-va",
  "has-bled",
  "painesd",
  "hcm-risk-scd",
  "hcm-risk-kids",
  "brugada-risk",
  "shanghai-brugada",
  "lqts-schwartz",
  "qtc",
] as const;

export const extractionConfidenceValues = [
  "high",
  "moderate",
  "low",
] as const;

const nullableBooleanSchema = {
  anyOf: [
    {
      type: "boolean",
    },
    {
      type: "null",
    },
  ],
} as const;

const nullableNumberSchema = {
  anyOf: [
    {
      type: "number",
    },
    {
      type: "null",
    },
  ],
} as const;

function nullableEnumSchema(
  values: readonly string[],
) {
  return {
    anyOf: [
      {
        type: "string",
        enum: values,
      },
      {
        type: "null",
      },
    ],
  } as const;
}

const baseExtractionProperties = {
  detectedCondition: {
    type: "string",
  },

  confidence: {
    type: "string",
    enum: extractionConfidenceValues,
  },

  rationale: {
    type: "string",
  },

  extractionNotes: {
    type: "array",
    items: {
      type: "string",
    },
  },
} as const;

const cha2ds2VaExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["cha2ds2-va"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "age",
        "heartFailure",
        "hypertension",
        "diabetes",
        "previousStroke",
        "vascularDisease",
      ],
      properties: {
        age: nullableNumberSchema,
        heartFailure: nullableBooleanSchema,
        hypertension: nullableBooleanSchema,
        diabetes: nullableBooleanSchema,
        previousStroke: nullableBooleanSchema,
        vascularDisease: nullableBooleanSchema,
      },
    },
  },
} as const;

const hasBledExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["has-bled"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "uncontrolledHypertension",
        "renalDysfunction",
        "liverDysfunction",
        "previousStroke",
        "bleedingHistory",
        "labileInr",
        "ageOver65",
        "antiplateletOrNsaid",
        "alcoholExcess",
      ],
      properties: {
        uncontrolledHypertension:
          nullableBooleanSchema,

        renalDysfunction:
          nullableBooleanSchema,

        liverDysfunction:
          nullableBooleanSchema,

        previousStroke:
          nullableBooleanSchema,

        bleedingHistory:
          nullableBooleanSchema,

        labileInr:
          nullableBooleanSchema,

        ageOver65:
          nullableBooleanSchema,

        antiplateletOrNsaid:
          nullableBooleanSchema,

        alcoholExcess:
          nullableBooleanSchema,
      },
    },
  },
} as const;

const painesdExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["painesd"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "pulmonaryDisease",
        "ageOver60",
        "ischemicCardiomyopathy",
        "nyhaClassThreeOrFour",
        "ejectionFractionBelow25",
        "vtStorm",
        "diabetes",
      ],
      properties: {
        pulmonaryDisease:
          nullableBooleanSchema,

        ageOver60:
          nullableBooleanSchema,

        ischemicCardiomyopathy:
          nullableBooleanSchema,

        nyhaClassThreeOrFour:
          nullableBooleanSchema,

        ejectionFractionBelow25:
          nullableBooleanSchema,

        vtStorm:
          nullableBooleanSchema,

        diabetes:
          nullableBooleanSchema,
      },
    },
  },
} as const;

const hcmRiskScdExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["hcm-risk-scd"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "age",
        "maxWallThickness",
        "leftAtrialDiameter",
        "lvotGradient",
        "familyHistory",
        "nsvt",
        "unexplainedSyncope",
      ],
      properties: {
        age: nullableNumberSchema,

        maxWallThickness:
          nullableNumberSchema,

        leftAtrialDiameter:
          nullableNumberSchema,

        lvotGradient:
          nullableNumberSchema,

        familyHistory:
          nullableBooleanSchema,

        nsvt:
          nullableBooleanSchema,

        unexplainedSyncope:
          nullableBooleanSchema,
      },
    },
  },
} as const;

const hcmRiskKidsExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["hcm-risk-kids"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "maximalWallThicknessZScore",
        "leftAtrialDiameterZScore",
        "lvotGradient",
        "nsvt",
        "unexplainedSyncope",
      ],
      properties: {
        maximalWallThicknessZScore:
          nullableNumberSchema,

        leftAtrialDiameterZScore:
          nullableNumberSchema,

        lvotGradient:
          nullableNumberSchema,

        nsvt:
          nullableBooleanSchema,

        unexplainedSyncope:
          nullableBooleanSchema,
      },
    },
  },
} as const;

const brugadaRiskExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["brugada-risk"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "peripheralType1Pattern",
        "probableArrhythmicSyncope",
        "peripheralEarlyRepolarization",
        "spontaneousType1Pattern",
      ],
      properties: {
        peripheralType1Pattern:
          nullableBooleanSchema,

        probableArrhythmicSyncope:
          nullableBooleanSchema,

        peripheralEarlyRepolarization:
          nullableBooleanSchema,

        spontaneousType1Pattern:
          nullableBooleanSchema,
      },
    },
  },
} as const;

const shanghaiBrugadaExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["shanghai-brugada"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "ecg",
        "clinical",
        "family",
        "genetic",
      ],
      properties: {
        ecg: nullableEnumSchema([
          "none",
          "drug-induced",
          "fever-induced",
          "spontaneous-type-1",
        ]),

        clinical: nullableEnumSchema([
          "none",
          "young-af",
          "unclear-syncope",
          "arrhythmic-syncope",
          "agonal-respiration",
          "cardiac-arrest",
        ]),

        family: nullableEnumSchema([
          "none",
          "unexplained-scd",
          "suspicious-scd",
          "definite-brugada",
        ]),

        genetic: nullableEnumSchema([
          "negative-or-unknown",
          "pathogenic",
        ]),
      },
    },
  },
} as const;

const schwartzLqtsExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["lqts-schwartz"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "qtcCriterion",
        "syncopeCriterion",
        "exerciseRecoveryQtc480",
        "torsadesDePointes",
        "tWaveAlternans",
        "notchedTWaveThreeLeads",
        "lowHeartRateForAge",
        "congenitalDeafness",
        "familyLqts",
        "familySuddenDeathBefore30",
        "pathogenicVariant",
      ],
      properties: {
        qtcCriterion: nullableEnumSchema([
          "normal",
          "male-450-459",
          "460-479",
          "480-or-more",
        ]),

        syncopeCriterion: nullableEnumSchema([
          "none",
          "without-stress",
          "with-stress",
        ]),

        exerciseRecoveryQtc480:
          nullableBooleanSchema,

        torsadesDePointes:
          nullableBooleanSchema,

        tWaveAlternans:
          nullableBooleanSchema,

        notchedTWaveThreeLeads:
          nullableBooleanSchema,

        lowHeartRateForAge:
          nullableBooleanSchema,

        congenitalDeafness:
          nullableBooleanSchema,

        familyLqts:
          nullableBooleanSchema,

        familySuddenDeathBefore30:
          nullableBooleanSchema,

        pathogenicVariant:
          nullableBooleanSchema,
      },
    },
  },
} as const;

const qtcExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "string",
      enum: ["qtc"],
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      required: [
        "qtMilliseconds",
        "heartRate",
        "sex",
        "selectedFormula",
      ],
      properties: {
        qtMilliseconds:
          nullableNumberSchema,

        heartRate:
          nullableNumberSchema,

        sex: nullableEnumSchema([
          "male",
          "female",
        ]),

        selectedFormula: nullableEnumSchema([
          "bazett",
          "fridericia",
          "framingham",
          "hodges",
        ]),
      },
    },
  },
} as const;

const unsupportedExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "calculatorId",
    "detectedCondition",
    "confidence",
    "rationale",
    "extractionNotes",
    "variables",
  ],
  properties: {
    calculatorId: {
      type: "null",
    },

    ...baseExtractionProperties,

    variables: {
      type: "object",
      additionalProperties: false,
      properties: {},
      required: [],
    },
  },
} as const;

export const clinicalExtractionJsonSchema = {
  name: "clinical_calculator_extraction",
  strict: true,

  schema: {
    type: "object",
    additionalProperties: false,
    required: ["extraction"],

    properties: {
      extraction: {
        anyOf: [
          cha2ds2VaExtractionSchema,
          hasBledExtractionSchema,
          painesdExtractionSchema,
          hcmRiskScdExtractionSchema,
          hcmRiskKidsExtractionSchema,
          brugadaRiskExtractionSchema,
          shanghaiBrugadaExtractionSchema,
          schwartzLqtsExtractionSchema,
          qtcExtractionSchema,
          unsupportedExtractionSchema,
        ],
      },
    },
  },
} as const;