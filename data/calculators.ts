export type CalculatorStatus =
  | "available"
  | "planned"
  | "external";

export type CalculatorCategory =
  | "Atrial Fibrillation"
  | "Anticoagulation"
  | "Ventricular Arrhythmias"
  | "Sudden Cardiac Death"
  | "Inherited Arrhythmias"
  | "Cardiomyopathies"
  | "CRT / Devices"
  | "Heart Failure"
  | "ECG Tools"
  | "Clinical Calculators";

export type CalculatorDefinition = {
  id: string;
  name: string;
  fullName: string;
  category: CalculatorCategory;
  description: string;
  href?: string;
  scoreRange?: string;
  status: CalculatorStatus;
  featured?: boolean;
  keywords: string[];
};

export const calculators: CalculatorDefinition[] = [
  {
    id: "cha2ds2-va",
    name: "CHA₂DS₂-VA",
    fullName: "CHA₂DS₂-VA Stroke Risk Score",
    category: "Atrial Fibrillation",
    description:
      "Estimates thromboembolic risk in patients with atrial fibrillation using the contemporary sex-neutral scoring approach.",
    href: "/scores/cha2ds2-va",
    scoreRange: "0–8 points",
    status: "available",
    featured: true,
    keywords: [
      "atrial fibrillation",
      "stroke",
      "thromboembolism",
      "anticoagulation",
    ],
  },
  {
    id: "has-bled",
    name: "HAS-BLED",
    fullName: "HAS-BLED Bleeding Risk Score",
    category: "Anticoagulation",
    description:
      "Identifies bleeding risk factors and supports review of modifiable risks in patients receiving anticoagulation.",
    href: "/scores/has-bled",
    scoreRange: "0–9 points",
    status: "available",
    featured: true,
    keywords: [
      "bleeding",
      "anticoagulation",
      "atrial fibrillation",
      "hemorrhage",
    ],
  },
  {
    id: "orbit",
    name: "ORBIT",
    fullName: "ORBIT Bleeding Risk Score",
    category: "Anticoagulation",
    description:
      "Estimates major bleeding risk in patients with atrial fibrillation receiving oral anticoagulation.",
    href: "/scores/orbit",
    scoreRange: "0–7 points",
    status: "available",
    featured: true,
    keywords: [
      "bleeding",
      "anticoagulation",
      "atrial fibrillation",
      "anemia",
      "renal function",
    ],
  },
  
  {
    id: "painesd",
    name: "PAINESD",
    fullName: "PAINESD Hemodynamic Risk Score",
    category: "Ventricular Arrhythmias",
    description:
      "Estimates the risk of acute hemodynamic decompensation during scar-related ventricular tachycardia ablation.",
    href: "/scores/painesd",
    scoreRange: "0–31 points",
    status: "available",
    featured: true,
    keywords: [
      "ventricular tachycardia",
      "VT ablation",
      "hemodynamic decompensation",
      "mechanical support",
    ],
  },

  // Planned atrial fibrillation calculators

  {
  id: "atria-bleeding",
  name: "ATRIA",
  fullName: "ATRIA Bleeding Risk Score",
  category: "Anticoagulation",
  description:
    "Estimates warfarin-associated major hemorrhage risk in patients with atrial fibrillation.",
  href: "/scores/atria-bleeding",
  scoreRange: "0–10 points",
  status: "available",
  keywords: [
    "bleeding",
    "hemorrhage",
    "warfarin",
    "anticoagulation",
    "atrial fibrillation",
    "anemia",
    "renal disease",
  ],
},
  {
    id: "abc-stroke",
    name: "ABC-Stroke",
    fullName: "ABC Stroke Risk Score",
    category: "Atrial Fibrillation",
    description:
      "Combines age, clinical history and biomarkers to estimate stroke risk in atrial fibrillation.",
    status: "planned",
    keywords: [
      "stroke",
      "biomarker",
      "troponin",
      "nt-probnp",
      "atrial fibrillation",
    ],
  },
  {
    id: "abc-bleeding",
    name: "ABC-Bleeding",
    fullName: "ABC Bleeding Risk Score",
    category: "Anticoagulation",
    description:
      "Combines age, biomarkers and clinical history to estimate major bleeding risk.",
    status: "planned",
    keywords: [
      "bleeding",
      "biomarker",
      "hemoglobin",
      "troponin",
      "anticoagulation",
    ],
  },

  // Planned AF ablation calculators

  
  
  

  // Planned sudden cardiac death and cardiomyopathy tools

  {
  id: "hcm-risk-scd",
  name: "HCM Risk-SCD",
  fullName: "HCM Risk-SCD Calculator",
  category: "Sudden Cardiac Death",
  description:
    "Estimates five-year sudden cardiac death risk in adults with hypertrophic cardiomyopathy.",
  href: "/scores/hcm-risk-scd",
  scoreRange: "5-year risk (%)",
  status: "available",
  keywords: [
    "hypertrophic cardiomyopathy",
    "HCM",
    "sudden cardiac death",
    "SCD",
    "ICD",
    "wall thickness",
    "LVOT gradient",
    "NSVT",
    "syncope",
    "family history",
  ],
},
  {
  id: "arvc-risk",
  name: "ARVC Risk",
  fullName: "ARVC Ventricular Arrhythmia Risk Calculator",
  category: "Cardiomyopathies",
  description:
    "Opens the official ARVC Risk Calculator for individualized ventricular arrhythmia risk assessment in patients with definite ARVC.",
  href: "https://arvcrisk.com/",
  scoreRange: "5-year ventricular arrhythmia risk",
  status: "external",
  keywords: [
    "ARVC",
    "arrhythmogenic right ventricular cardiomyopathy",
    "arrhythmogenic cardiomyopathy",
    "ventricular arrhythmia",
    "ventricular tachycardia",
    "sudden cardiac death",
    "ICD",
    "PVC burden",
    "NSVT",
    "cardiac syncope",
    "RVEF",
    "T wave inversion",
  ],
},
  {
  id: "shanghai-brugada",
  name: "Shanghai Score",
  fullName: "Shanghai Brugada Syndrome Score",
  category: "Inherited Arrhythmias",
  description:
    "Supports the diagnostic assessment of suspected Brugada syndrome using ECG, clinical, family-history and genetic findings.",
  href: "/scores/shanghai-brugada",
  scoreRange: "Diagnostic score",
  status: "available",
  keywords: [
    "Brugada syndrome",
    "Shanghai score",
    "inherited arrhythmia",
    "channelopathy",
    "type 1 Brugada pattern",
    "sodium channel blocker",
    "ventricular fibrillation",
    "syncope",
    "sudden cardiac death",
    "SCN5A",
  ],
},

  // Planned clinical calculators

  {
  id: "qtc",
  name: "QTc",
  fullName: "Corrected QT Interval Calculator",
  category: "ECG Tools",
  description:
    "Calculates the heart-rate-corrected QT interval using Bazett, Fridericia, Framingham and Hodges formulas.",
  href: "/scores/qtc",
  scoreRange: "QTc in milliseconds",
  status: "available",
  keywords: [
    "QT",
    "QTc",
    "ECG",
    "Bazett",
    "Fridericia",
    "Framingham",
    "Hodges",
    "long QT",
    "repolarization",
    "heart rate",
  ],
},
{
  id: "tisdale",
  name: "Tisdale",
  fullName: "Tisdale QT Prolongation Risk Score",
  category: "ECG Tools",
  description:
    "Estimates the risk of clinically significant QTc prolongation in hospitalized patients.",
  href: "/scores/tisdale",
  scoreRange: "0–21 points",
  status: "available",
  keywords: [
    "Tisdale",
    "QT",
    "QTc",
    "QT prolongation",
    "torsades de pointes",
    "hospitalized patients",
    "potassium",
    "loop diuretic",
    "sepsis",
    "heart failure",
    "QT prolonging drugs",
  ],
},
  {
  id: "cockcroft-gault",
  name: "Cockcroft–Gault",
  fullName: "Creatinine Clearance Calculator",
  category: "Clinical Calculators",
  description:
    "Estimates creatinine clearance in adults for renal assessment and medication-dosing support.",
  href: "/scores/cockcroft-gault",
  scoreRange: "CrCl in mL/min",
  status: "available",
  keywords: [
    "Cockcroft Gault",
    "creatinine clearance",
    "CrCl",
    "renal function",
    "kidney function",
    "serum creatinine",
    "drug dosing",
    "anticoagulant dosing",
  ],
},
  {
  id: "ckd-epi",
  name: "CKD-EPI",
  fullName: "2021 CKD-EPI eGFR Calculator",
  category: "Clinical Calculators",
  description:
    "Estimates glomerular filtration rate in adults using the race-free 2021 CKD-EPI creatinine equation.",
  href: "/scores/ckd-epi",
  scoreRange: "eGFR in mL/min/1.73 m²",
  status: "available",
  keywords: [
    "CKD-EPI",
    "eGFR",
    "glomerular filtration rate",
    "renal function",
    "kidney function",
    "serum creatinine",
    "chronic kidney disease",
    "CKD",
    "race free equation",
  ],
},
{
  id: "brugada-risk",
  name: "BRUGADA-RISK",
  fullName: "BRUGADA-RISK Ventricular Arrhythmia Risk Score",
  category: "Inherited Arrhythmias",
  description:
    "Estimates ventricular arrhythmia and sudden cardiac death risk in primary-prevention patients with Brugada syndrome.",
  href: "/scores/brugada-risk",
  scoreRange: "Clinical risk estimate",
  status: "available",
  keywords: [
    "Brugada syndrome",
    "BRUGADA-RISK",
    "ventricular arrhythmia",
    "ventricular fibrillation",
    "sudden cardiac death",
    "arrhythmic syncope",
    "spontaneous type 1 ECG",
    "early repolarization",
    "peripheral leads",
    "primary prevention",
  ],
},
{
  id: "lqts-schwartz",
  name: "LQTS Schwartz",
  fullName: "Modified Schwartz Score for Long QT Syndrome",
  category: "Inherited Arrhythmias",
  description:
    "Assesses the diagnostic probability of congenital long QT syndrome using ECG, clinical, family-history and genetic findings.",
  href: "/scores/lqts-schwartz",
  scoreRange: "Diagnostic probability score",
  status: "available",
  keywords: [
    "long QT syndrome",
    "LQTS",
    "Schwartz score",
    "QTc",
    "torsades de pointes",
    "T wave alternans",
    "notched T wave",
    "syncope",
    "congenital deafness",
    "family history",
    "pathogenic variant",
    "inherited arrhythmia",
  ],
},

];

export const availableCalculators = calculators.filter(
  (calculator) => calculator.status === "available",
);

export const plannedCalculators = calculators.filter(
  (calculator) => calculator.status === "planned",
);

export const featuredCalculators = calculators.filter(
  (calculator) =>
    calculator.status === "available" && calculator.featured,
);

export const calculatorCategories = [
  "All",
  ...Array.from(
    new Set(
      calculators.map((calculator) => calculator.category),
    ),
  ),
];