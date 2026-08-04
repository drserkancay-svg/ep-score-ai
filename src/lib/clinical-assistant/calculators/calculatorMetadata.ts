export type CalculatorId =
  | "brugada-risk"
  | "cha2ds2-va"
  | "has-bled"
  | "hcm-risk-kids"
  | "hcm-risk-scd"
  | "lqts-schwartz"
  | "painesd"
  | "qtc"
  | "shanghai-brugada";

export type CalculatorMetadata = {
  id: CalculatorId;
  name: string;
  fullName: string;
  category: string;
  scoreLabel: string;
  warning?: string;
  reference?: string;
  disclaimer?: string;
};

export const calculatorMetadata: Record<
  CalculatorId,
  CalculatorMetadata
> = {
  "has-bled": {
    id: "has-bled",
    name: "HAS-BLED",
    fullName:
      "Bleeding Risk Assessment in Atrial Fibrillation",
    category: "Anticoagulation",
    scoreLabel: "HAS-BLED score · 0–9 points",

    warning:
      "A high HAS-BLED score should prompt correction of modifiable bleeding risk factors and closer clinical follow-up. It should not, by itself, determine whether anticoagulation is prescribed, withheld or withdrawn.",

    reference:
      "Lip GY, Nieuwlaat R, Pisters R, Lane DA, Crijns HJ. Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation using a novel risk factor-based approach: the euro heart survey on atrial fibrillation. Chest. 2010 Feb;137(2):263-72. doi: 10.1378/chest.09-1584. Epub 2009 Sep 17. PMID: 19762550.",

    disclaimer:
      "This report is intended for clinical decision support and educational use. HAS-BLED should not be used in isolation to withhold oral anticoagulation. Clinical decisions require complete patient assessment and professional medical judgment.",
  },

  "hcm-risk-kids": {
    id: "hcm-risk-kids",
    name: "HCM Risk-Kids",
    fullName:
      "Risk Prediction Model for Sudden Cardiac Death in Childhood Hypertrophic Cardiomyopathy",
    category: "Hypertrophic Cardiomyopathy",
    scoreLabel: "Estimated 5-year SCD risk",

    warning:
      "Risk estimation should always be interpreted together with the patient's complete clinical evaluation. The model supports, but does not replace, expert clinical judgment regarding ICD implantation.",

    reference:
      "Norrish G, Ding T, Field E, Ziólkowska L, Olivotto I, Limongelli G, Anastasakis A, Weintraub R, Biagini E, Ragni L, Prendiville T, Duignan S, McLeod K, Ilina M, Fernández A, Bökenkamp R, Baban A, Kubuš P, Daubeney PEF, Sarquella-Brugada G, Cesar S, Marrone C, Bhole V, Medrano C, Uzun O, Brown E, Gran F, Castro FJ, Stuart G, Vignati G, Barriales-Villa R, Guereta LG, Adwani S, Linter K, Bharucha T, Garcia-Pavia P, Rasmussen TB, Calcagnino MM, Jones CB, De Wilde H, Toru-Kubo J, Felice T, Mogensen J, Mathur S, Reinhardt Z, O'Mahony C, Elliott PM, Omar RZ, Kaski JP. Development of a Novel Risk Prediction Model for Sudden Cardiac Death in Childhood Hypertrophic Cardiomyopathy (HCM Risk-Kids). JAMA Cardiol. 2019 Sep 1;4(9):918-927. doi: 10.1001/jamacardio.2019.2861. PMID: 31411652; PMCID: PMC6694401.",

    disclaimer:
      "This report is intended for clinical decision support and educational purposes. Decisions regarding ICD implantation should be individualized according to contemporary international guidance and multidisciplinary evaluation.",
  },

  "hcm-risk-scd": {
    id: "hcm-risk-scd",
    name: "HCM Risk-SCD",
    fullName:
      "Five-Year Sudden Cardiac Death Risk in Hypertrophic Cardiomyopathy",
    category: "Hypertrophic Cardiomyopathy",
    scoreLabel: "Estimated 5-year SCD risk",

    warning:
      "The calculated risk must be interpreted together with additional clinical, imaging and genetic risk modifiers. It should not be used as the sole basis for an ICD decision.",

    reference:
      "O'Mahony C, Jichi F, Pavlou M, Monserrat L, Anastasakis A, Rapezzi C, Biagini E, Gimeno JR, Limongelli G, McKenna WJ, Omar RZ, Elliott PM; Hypertrophic Cardiomyopathy Outcomes Investigators. A novel clinical risk prediction model for sudden cardiac death in hypertrophic cardiomyopathy (HCM risk-SCD). Eur Heart J. 2014 Aug 7;35(30):2010-20. doi: 10.1093/eurheartj/eht439. Epub 2013 Oct 14. PMID: 24126876.",

    disclaimer:
      "This report is intended for clinical decision support and educational purposes. Primary-prevention ICD decisions require comprehensive specialist assessment, shared decision-making and consideration of factors not included in the model.",
  },

  "cha2ds2-va": {
  id: "cha2ds2-va",
  name: "CHA₂DS₂-VA",
  fullName:
    "Thromboembolic Risk Assessment in Atrial Fibrillation",
  category: "Atrial Fibrillation",
  scoreLabel: "CHA₂DS₂-VA score · 0–8 points",

  warning:
    "The score supports thromboembolic risk assessment in atrial fibrillation. The result should be interpreted together with bleeding risk, contraindications, comorbidities and patient preferences.",

  reference:
    "Van Gelder IC, Rienstra M, Bunting KV, Casado-Arroyo R, Caso V, Crijns HJGM, De Potter TJR, Dwight J, Guasti L, Hanke T, Jaarsma T, Lettino M, Løchen ML, Lumbers RT, Maesen B, Mølgaard I, Rosano GMC, Sanders P, Schnabel RB, Suwalski P, Svennberg E, Tamargo J, Tica O, Traykov V, Tzeis S, Kotecha D; ESC Scientific Document Group. 2024 ESC Guidelines for the management of atrial fibrillation developed in collaboration with the European Association for Cardio-Thoracic Surgery (EACTS). Eur Heart J. 2024 Sep 29;45(36):3314-3414. doi: 10.1093/eurheartj/ehae176. Erratum in: Eur Heart J. 2025 Nov 3;46(41):4349. doi: 10.1093/eurheartj/ehaf306. PMID: 39210723.",

  disclaimer:
    "This report is intended for clinical decision support and educational use. Anticoagulation decisions require complete clinical assessment, consideration of contraindications and professional medical judgment.",
},

  

  qtc: {
    id: "qtc",
    name: "QTc",
    fullName:
      "Heart Rate-Corrected QT Interval",
    category: "Electrocardiography",
    scoreLabel: "Corrected QT interval · ms",

    warning:
      "Automated or calculated QTc values should be confirmed by careful ECG review when the tracing is abnormal, the QRS is wide, the rhythm is irregular or clinical decisions depend on the result.",

    reference:
      "Bazett HC. An Analysis of the Time-Relations of Electrocardiograms. Heart. 1920;7:353-70.",

    disclaimer:
      "This report is intended for clinical decision support and educational use. QT measurement and interpretation require consideration of heart rate, QRS duration, rhythm, medications, electrolytes and the selected correction formula.",
  },

  

  "brugada-risk": {
  id: "brugada-risk",
  name: "Brugada Risk",
  fullName: "Brugada Syndrome Clinical Risk Assessment",
  category: "Inherited Arrhythmia",
  scoreLabel: "Brugada risk assessment result",

  warning:
    "Brugada syndrome diagnosis and risk assessment require expert interpretation of ECG morphology, clinical history, family history and, when appropriate, provocative testing.",

  reference:
    "Antzelevitch C, Yan GX, Ackerman MJ, Borggrefe M, Corrado D, Guo J, Gussak I, Hasdemir C, Horie M, Huikuri H, Ma C, Morita H, Nam GB, Sacher F, Shimizu W, Viskin S, Wilde AA. J-Wave syndromes expert consensus conference report: Emerging concepts and gaps in knowledge. Heart Rhythm. 2016 Oct;13(10):e295-324. doi: 10.1016/j.hrthm.2016.05.024. Epub 2016 Jul 13. PMID: 27423412; PMCID: PMC5035208.",

  disclaimer:
    "This report is intended for clinical decision support and educational use. It must not be used as a stand-alone diagnostic test or as the sole basis for ICD implantation.",
},

  

  painesd: {
    id: "painesd",
    name: "PAINESD",
    fullName:
      "Risk of Acute Hemodynamic Decompensation During Ventricular Tachycardia Ablation",
    category: "Ventricular Tachycardia Ablation",
    scoreLabel: "PAINESD score · 0–31 points",

    warning:
      "A higher PAINESD score indicates greater risk of acute hemodynamic decompensation during ventricular tachycardia ablation and may support planning for advanced hemodynamic support.",

    reference:
      "Santangeli P, Frankel DS, Tung R, Vaseghi M, Sauer WH, Tzou WS, Mathuria N, Nakahara S, Dickfeldt TM, Lakkireddy D, Bunch TJ, Di Biase L, Natale A, Tholakanahalli V, Tedrow UB, Kumar S, Stevenson WG, Della Bella P, Shivkumar K, Marchlinski FE, Callans DJ; International VT Ablation Center Collaborative Group. Early Mortality After Catheter Ablation of Ventricular Tachycardia in Patients With Structural Heart Disease. J Am Coll Cardiol. 2017 May 2;69(17):2105-2115. doi: 10.1016/j.jacc.2017.02.044. PMID: 28449770.",

    disclaimer:
      "This report is intended for clinical decision support and educational use. Decisions regarding mechanical circulatory support, anesthesia and procedural strategy require multidisciplinary specialist assessment.",
  },

  
  "lqts-schwartz": {
  id: "lqts-schwartz",
  name: "Schwartz Score",
  fullName:
    "Schwartz Diagnostic Score for Long QT Syndrome",
  category: "Inherited Arrhythmia",
  scoreLabel: "Schwartz score",

  warning:
    "The Schwartz score supports assessment of the probability of congenital long QT syndrome. ECG findings should be interpreted together with clinical history, family history, medications, electrolyte status and genetic evaluation when appropriate.",

  reference:
    "Schwartz PJ, Crotti L, Insolia R. Long-QT syndrome: from genetics to management. Circ Arrhythm Electrophysiol. 2012 Aug 1;5(4):868-77. doi: 10.1161/CIRCEP.111.962019. Erratum in: Circ Arrhythm Electrophysiol. 2012 Dec;5(6):e119-20. PMID: 22895603; PMCID: PMC3461497.",

  disclaimer:
    "This report is intended for clinical decision support and educational use. The score does not replace specialist evaluation, repeated ECG assessment or genetic counseling.",
},
"shanghai-brugada": {
  id: "shanghai-brugada",
  name: "Shanghai Score",
  fullName:
    "Shanghai Score System for Diagnosis of Brugada Syndrome",
  category: "Inherited Arrhythmia",
  scoreLabel: "Shanghai Brugada score",

  warning:
    "The Shanghai score supports diagnostic assessment of Brugada syndrome. ECG patterns, clinical history, family history and genetic findings require expert interpretation.",

  reference:
    "Antzelevitch C, Yan GX, Ackerman MJ, Borggrefe M, Corrado D, Guo J, Gussak I, Hasdemir C, Horie M, Huikuri H, Ma C, Morita H, Nam GB, Sacher F, Shimizu W, Viskin S, Wilde AA. J-Wave syndromes expert consensus conference report: Emerging concepts and gaps in knowledge. Heart Rhythm. 2016 Oct;13(10):e295-324. doi: 10.1016/j.hrthm.2016.05.024. Epub 2016 Jul 13. PMID: 27423412; PMCID: PMC5035208.",

  disclaimer:
    "This report is intended for clinical decision support and educational use. It must not be used as the sole basis for diagnosis, electrophysiological testing or ICD implantation.",
},
};

export function getCalculatorMetadata(
  calculatorId: CalculatorId,
): CalculatorMetadata {
  const metadata = calculatorMetadata[calculatorId];

  if (!metadata) {
    throw new Error(
      `Calculator metadata is not defined for "${calculatorId}".`,
    );
  }

  return metadata;
}