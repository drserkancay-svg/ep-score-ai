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
} from "../src/lib/clinical-assistant/calculators";

type TestCase = {
  name: string;
  run: () => void;
};

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(
  actual: T,
  expected: T,
  message: string,
): void {
  if (actual !== expected) {
    throw new Error(
      `${message}. Expected: ${String(expected)}, received: ${String(actual)}.`,
    );
  }
}

function assertApproximatelyEqual(
  actual: number,
  expected: number,
  tolerance: number,
  message: string,
): void {
  const difference = Math.abs(actual - expected);

  if (difference > tolerance) {
    throw new Error(
      `${message}. Expected approximately ${expected}, received ${actual}.`,
    );
  }
}

function assertValidResult(
  result: ClinicalCalculationResult,
): void {
  assert(
    typeof result.calculatorId === "string",
    "calculatorId is missing",
  );

  assert(
    typeof result.calculatorName === "string",
    "calculatorName is missing",
  );

  assert(
    Number.isFinite(result.primaryValue),
    "primaryValue must be finite",
  );

  assert(
    result.primaryValueDisplay.length > 0,
    "primaryValueDisplay is missing",
  );

  assert(
    result.components.length > 0,
    "Calculation components are missing",
  );

  assert(
    result.guidelineSummary.length > 0,
    "Guideline summary is missing",
  );

  assert(
    result.clinicalInterpretation.length > 0,
    "Clinical interpretation is missing",
  );
}

const tests: TestCase[] = [
  {
    name: "CHA₂DS₂-VA returns 3 points",
    run: () => {
      const result = calculateCha2ds2Va({
        age: 72,
        heartFailure: false,
        hypertension: true,
        diabetes: true,
        previousStroke: false,
        vascularDisease: false,
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "cha2ds2-va",
        "Incorrect calculator ID",
      );
      assertEqual(
        result.primaryValue,
        3,
        "Incorrect CHA₂DS₂-VA score",
      );
      assertEqual(
        result.riskLevel,
        "high",
        "Incorrect CHA₂DS₂-VA risk level",
      );
    },
  },

  {
    name: "HAS-BLED returns 4 points",
    run: () => {
      const result = calculateHasBled({
        uncontrolledHypertension: true,
        renalDysfunction: true,
        liverDysfunction: false,
        previousStroke: false,
        bleedingHistory: false,
        labileInr: true,
        ageOver65: true,
        antiplateletOrNsaid: false,
        alcoholExcess: false,
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "has-bled",
        "Incorrect calculator ID",
      );
      assertEqual(
        result.primaryValue,
        4,
        "Incorrect HAS-BLED score",
      );
      assertEqual(
        result.riskLevel,
        "high",
        "Incorrect HAS-BLED risk level",
      );
    },
  },

  {
    name: "PAINESD returns 26 points",
    run: () => {
      const result = calculatePainesd({
        pulmonaryDisease: false,
        ageOver60: true,
        ischemicCardiomyopathy: true,
        nyhaClassThreeOrFour: true,
        ejectionFractionBelow25: true,
        vtStorm: true,
        diabetes: true,
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "painesd",
        "Incorrect calculator ID",
      );
      assertEqual(
        result.primaryValue,
        26,
        "Incorrect PAINESD score",
      );
      assertEqual(
        result.riskLevel,
        "high",
        "Incorrect PAINESD risk level",
      );
    },
  },

  {
    name: "HCM Risk-SCD returns a valid five-year risk",
    run: () => {
      const result = calculateHcmRiskScd({
        age: 46,
        maxWallThickness: 24,
        leftAtrialDiameter: 44,
        lvotGradient: 35,
        familyHistory: false,
        nsvt: true,
        unexplainedSyncope: false,
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "hcm-risk-scd",
        "Incorrect calculator ID",
      );

      assert(
        result.primaryValue >= 0 &&
          result.primaryValue <= 100,
        "HCM Risk-SCD must be between 0% and 100%",
      );
    },
  },

  {
    name: "HCM Risk-Kids returns a valid five-year risk",
    run: () => {
      const result = calculateHcmRiskKids({
        maximalWallThicknessZScore: 12.4,
        leftAtrialDiameterZScore: 2.8,
        lvotGradient: 25,
        nsvt: false,
        unexplainedSyncope: false,
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "hcm-risk-kids",
        "Incorrect calculator ID",
      );

      assert(
        result.primaryValue >= 0 &&
          result.primaryValue <= 100,
        "HCM Risk-Kids result must be between 0% and 100%",
      );
    },
  },

  {
    name: "Brugada Risk returns 18.3%",
    run: () => {
      const result = calculateBrugadaRisk({
        peripheralType1Pattern: false,
        probableArrhythmicSyncope: true,
        peripheralEarlyRepolarization: false,
        spontaneousType1Pattern: true,
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "brugada-risk",
        "Incorrect calculator ID",
      );

      assertApproximatelyEqual(
        result.primaryValue,
        18.3,
        0.001,
        "Incorrect Brugada Risk estimate",
      );

      assertEqual(
        result.riskLevel,
        "high",
        "Incorrect Brugada risk level",
      );
    },
  },

  {
    name: "Shanghai Brugada returns 5.5 points",
    run: () => {
      const result = calculateShanghaiBrugada({
        ecg: "spontaneous-type-1",
        clinical: "arrhythmic-syncope",
        family: "none",
        genetic: "negative-or-unknown",
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "shanghai-brugada",
        "Incorrect calculator ID",
      );

      assertApproximatelyEqual(
        result.primaryValue,
        5.5,
        0.001,
        "Incorrect Shanghai Brugada score",
      );
    },
  },

  {
    name: "Schwartz LQTS returns 5.5 points",
    run: () => {
      const result = calculateSchwartzLqts({
        qtcCriterion: "480-or-more",
        syncopeCriterion: "with-stress",
        exerciseRecoveryQtc480: false,
        torsadesDePointes: false,
        tWaveAlternans: false,
        notchedTWaveThreeLeads: false,
        lowHeartRateForAge: false,
        congenitalDeafness: false,
        familyLqts: false,
        familySuddenDeathBefore30: false,
        pathogenicVariant: false,
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "lqts-schwartz",
        "Incorrect calculator ID",
      );

      assertApproximatelyEqual(
        result.primaryValue,
        5.5,
        0.001,
        "Incorrect Schwartz LQTS score",
      );

      assertEqual(
        result.riskLevel,
        "high",
        "Incorrect Schwartz LQTS classification",
      );
    },
  },

  {
    name: "Fridericia QTc returns approximately 466 ms",
    run: () => {
      const result = calculateQtc({
        qtMilliseconds: 420,
        heartRate: 82,
        sex: "female",
        selectedFormula: "fridericia",
      });

      assertValidResult(result);
      assertEqual(
        result.calculatorId,
        "qtc",
        "Incorrect calculator ID",
      );

      assertApproximatelyEqual(
        result.primaryValue,
        466,
        1,
        "Incorrect Fridericia QTc",
      );

      assertEqual(
        result.riskLevel,
        "intermediate",
        "Incorrect QTc risk level",
      );
    },
  },
];

let passedTests = 0;
let failedTests = 0;

console.log("");
console.log("EP-SCORE AI Clinical Calculator Tests");
console.log("=====================================");
console.log("");

tests.forEach((test, index) => {
  try {
    test.run();
    passedTests += 1;

    console.log(
      `✓ ${index + 1}. ${test.name}`,
    );
  } catch (error) {
    failedTests += 1;

    const message =
      error instanceof Error
        ? error.message
        : "Unknown test error";

    console.error(
      `✗ ${index + 1}. ${test.name}`,
    );

    console.error(`  ${message}`);
  }
});

console.log("");
console.log("-------------------------------------");
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log("-------------------------------------");
console.log("");

if (failedTests > 0) {
  process.exitCode = 1;
} else {
  console.log(
    "All deterministic calculator tests passed.",
  );
  console.log("");
}