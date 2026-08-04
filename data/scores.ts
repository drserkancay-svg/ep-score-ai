export type ScoreStatus =
  | "Available"
  | "Coming soon"
  | "In development";

export type Score = {
  id: string;
  name: string;
  fullName: string;
  category: string;
  description: string;
  evidence: string;
  status: ScoreStatus;
  popular?: boolean;
  href?: string;
  keywords?: string[];
};

export type ScoreCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export const scores: Score[] = [
  {
    id: "cha2ds2-va",
    name: "CHA₂DS₂-VA",
    fullName: "CHA₂DS₂-VA Stroke Risk Score",
    category: "Atrial Fibrillation",
    description:
      "Estimates thromboembolic risk in patients with atrial fibrillation.",
    evidence: "Guideline supported",
    status: "Available",
    popular: true,
    href: "/scores/cha2ds2-va",
    keywords: [
      "stroke",
      "thromboembolism",
      "anticoagulation",
      "atrial fibrillation",
      "af",
      "cha2ds2-va",
      "cha2ds2va",
    ],
  },

  {
    id: "has-bled",
    name: "HAS-BLED",
    fullName: "HAS-BLED Bleeding Risk Score",
    category: "Anticoagulation",
    description:
      "Identifies modifiable and non-modifiable bleeding risk factors in patients receiving anticoagulation.",
    evidence: "Guideline supported",
    status: "Available",
    popular: true,
    href: "/scores/has-bled",
    keywords: [
      "bleeding",
      "anticoagulation",
      "warfarin",
      "oral anticoagulant",
      "atrial fibrillation",
      "af",
      "has-bled",
    ],
  },

  {
    id: "painesd",
    name: "PAINESD",
    fullName: "PAINESD Hemodynamic Risk Score",
    category: "Ventricular Arrhythmias",
    description:
      "Estimates the risk of acute hemodynamic decompensation during ventricular tachycardia ablation.",
    evidence: "Procedure risk tool",
    status: "Available",
    popular: true,
    href: "/scores/painesd",
    keywords: [
      "ventricular tachycardia",
      "vt",
      "ablation",
      "hemodynamic collapse",
      "hemodynamic decompensation",
      "mechanical circulatory support",
      "painesd",
    ],
  },

  {
    id: "hcm-risk-scd",
    name: "HCM Risk-SCD",
    fullName: "HCM Risk-SCD Calculator",
    category: "Sudden Cardiac Death",
    description:
      "Estimates five-year sudden cardiac death risk in adults with hypertrophic cardiomyopathy.",
    evidence: "Guideline supported",
    status: "Available",
    popular: true,
    href: "/scores/hcm-risk-scd",
    keywords: [
      "hypertrophic cardiomyopathy",
      "hcm",
      "sudden cardiac death",
      "sudden death",
      "icd",
      "adult",
      "hcm risk scd",
    ],
  },

  {
    id: "hcm-risk-kids",
    name: "HCM Risk-Kids",
    fullName: "HCM Risk-Kids SCD Calculator",
    category: "Sudden Cardiac Death",
    description:
      "Estimates five-year sudden cardiac death risk in children with hypertrophic cardiomyopathy.",
    evidence: "Pediatric prediction model",
    status: "Available",
    popular: true,
    href: "/scores/hcm-risk-kids",
    keywords: [
      "pediatric",
      "children",
      "hypertrophic cardiomyopathy",
      "hcm",
      "sudden cardiac death",
      "sudden death",
      "icd",
      "hcm risk kids",
    ],
  },

  {
    id: "brugada-risk",
    name: "Brugada Risk",
    fullName: "Brugada Syndrome Arrhythmic Risk Assessment",
    category: "Channelopathies",
    description:
      "Supports arrhythmic risk assessment in patients with Brugada syndrome.",
    evidence: "Clinical risk assessment",
    status: "Available",
    popular: true,
    href: "/scores/brugada-risk",
    keywords: [
      "brugada",
      "brugada syndrome",
      "ventricular fibrillation",
      "ventricular arrhythmia",
      "sudden cardiac death",
      "syncope",
      "arrhythmic risk",
    ],
  },

  {
    id: "shanghai-brugada",
    name: "Shanghai Brugada",
    fullName: "Shanghai Brugada Diagnostic Score",
    category: "Channelopathies",
    description:
      "Supports diagnostic classification in patients with suspected Brugada syndrome.",
    evidence: "Consensus diagnostic criteria",
    status: "Available",
    popular: true,
    href: "/scores/shanghai-brugada",
    keywords: [
      "shanghai",
      "brugada",
      "brugada syndrome",
      "channelopathy",
      "ecg",
      "syncope",
      "sudden cardiac death",
      "diagnosis",
    ],
  },

  {
    id: "lqts-schwartz",
    name: "Schwartz LQTS",
    fullName: "Schwartz Long QT Syndrome Diagnostic Score",
    category: "Channelopathies",
    description:
      "Supports the clinical diagnosis of congenital long QT syndrome.",
    evidence: "Established diagnostic criteria",
    status: "Available",
    popular: true,
    href: "/scores/lqts-schwartz",
    keywords: [
      "schwartz",
      "long qt",
      "long qt syndrome",
      "lqts",
      "qtc",
      "channelopathy",
      "syncope",
      "torsades de pointes",
    ],
  },

  {
    id: "qtc",
    name: "QTc",
    fullName: "Corrected QT Interval Calculator",
    category: "Electrocardiography",
    description:
      "Calculates the corrected QT interval using commonly used heart-rate correction formulas.",
    evidence: "Established electrocardiographic formulas",
    status: "Available",
    popular: true,
    href: "/scores/qtc",
    keywords: [
      "qt",
      "qtc",
      "qt interval",
      "corrected qt",
      "bazett",
      "fridericia",
      "framingham",
      "hodges",
      "ecg",
    ],
  },
  
];

export const categories: ScoreCategory[] = [
  {
    id: "atrial-fibrillation",
    title: "Atrial Fibrillation",
    subtitle: "Stroke prevention, symptoms and disease progression",
    icon: "AF",
  },
  {
    id: "anticoagulation",
    title: "Anticoagulation",
    subtitle: "Bleeding risk and treatment support",
    icon: "AC",
  },
  
  {
    id: "ventricular-arrhythmias",
    title: "Ventricular Arrhythmias",
    subtitle: "VT ablation and hemodynamic risk",
    icon: "VT",
  },
  {
    id: "sudden-cardiac-death",
    title: "Sudden Cardiac Death",
    subtitle: "Cardiomyopathy and ICD risk assessment",
    icon: "SD",
  },
  {
    id: "channelopathies",
    title: "Channelopathies",
    subtitle: "Brugada syndrome, LQTS, SQTS and CPVT",
    icon: "CH",
  },
  {
    id: "electrocardiography",
    title: "Electrocardiography",
    subtitle: "ECG intervals, correction formulas and diagnostic measurements",
    icon: "EC",
  },
  
  
  
];

export function getAvailableScores(): Score[] {
  return scores.filter(
    (score) => score.status === "Available" && Boolean(score.href),
  );
}

export function getPopularScores(): Score[] {
  return scores.filter((score) => score.popular);
}

export function getScoresByCategory(category: string): Score[] {
  return scores.filter((score) => score.category === category);
}

export function getCategoryScoreCount(category: string): number {
  return scores.filter((score) => score.category === category).length;
}

export function searchScores(query: string): Score[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("en-US");

  if (!normalizedQuery) {
    return getPopularScores();
  }

  return scores.filter((score) => {
    const searchableText = [
      score.name,
      score.fullName,
      score.category,
      score.description,
      score.evidence,
      score.status,
      ...(score.keywords ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("en-US");

    return searchableText.includes(normalizedQuery);
  });
}