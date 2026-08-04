import {
  generateClinicalPdf,
  type ClinicalPdfRiskLevel,
} from "@/src/lib/clinical-assistant/reports/generateClinicalPdf";

import {
  getCalculatorMetadata,
  type CalculatorId,
} from "@/src/lib/clinical-assistant/calculators/calculatorMetadata";

export type BuildClinicalReportData = {
  calculatorId: CalculatorId;
  score: string | number;
  riskLabel: string;
  riskLevel: ClinicalPdfRiskLevel;
  interpretation: string;
  components?: string[];

  scoreLabel?: string;
  warning?: string;
  reference?: string;
  disclaimer?: string;
};

export function buildClinicalReport(
  data: BuildClinicalReportData,
) {
  const metadata = getCalculatorMetadata(
    data.calculatorId,
  );

  generateClinicalPdf({
    calculatorName: metadata.name,
    calculatorFullName: metadata.fullName,
    category: metadata.category,

    score: data.score,
    scoreLabel:
      data.scoreLabel ?? metadata.scoreLabel,

    riskLabel: data.riskLabel,
    riskLevel: data.riskLevel,
    interpretation: data.interpretation,
    components: data.components,

    warning:
      data.warning ?? metadata.warning,

    reference:
      data.reference ?? metadata.reference,

    disclaimer:
      data.disclaimer ?? metadata.disclaimer,
  });
}