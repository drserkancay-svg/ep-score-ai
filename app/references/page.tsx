import Footer from "@/components/Footer";
import Header from "@/components/Header";

type ReferenceGroup = {
  title: string;
  description: string;
  references: {
    title: string;
    citation: string;
    href?: string;
  }[];
};

const referenceGroups: ReferenceGroup[] = [
  {
    title: "Atrial fibrillation and anticoagulation",
    description:
      "Guidelines and validation studies supporting stroke and bleeding-risk assessment in patients with atrial fibrillation.",
    references: [
      {
        title:
          "2024 ESC Guidelines for the management of atrial fibrillation developed in collaboration with the European Association for Cardio-Thoracic Surgery (EACTS)",
        citation:
          "Van Gelder IC, Rienstra M, Bunting KV, Casado-Arroyo R, Caso V, Crijns HJGM, De Potter TJR, Dwight J, Guasti L, Hanke T, Jaarsma T, Lettino M, Løchen ML, Lumbers RT, Maesen B, Mølgaard I, Rosano GMC, Sanders P, Schnabel RB, Suwalski P, Svennberg E, Tamargo J, Tica O, Traykov V, Tzeis S, Kotecha D; ESC Scientific Document Group. 2024 ESC Guidelines for the management of atrial fibrillation developed in collaboration with the European Association for Cardio-Thoracic Surgery (EACTS). Eur Heart J. 2024 Sep 29;45(36):3314-3414. doi: 10.1093/eurheartj/ehae176. Erratum in: Eur Heart J. 2025 Nov 3;46(41):4349. doi: 10.1093/eurheartj/ehaf306. PMID: 39210723.",
      },
      {
        title:
          "Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation using a novel risk factor-based approach: the euro heart survey on atrial fibrillation",
        citation:
          "Lip GY, Nieuwlaat R, Pisters R, Lane DA, Crijns HJ. Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation using a novel risk factor-based approach: the euro heart survey on atrial fibrillation. Chest. 2010 Feb;137(2):263-72. doi: 10.1378/chest.09-1584. Epub 2009 Sep 17. PMID: 19762550.",
      },
      {
        title:
          "A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation: the Euro Heart Survey",
        citation:
          "Pisters R, Lane DA, Nieuwlaat R, de Vos CB, Crijns HJ, Lip GY. A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation: the Euro Heart Survey. Chest. 2010 Nov;138(5):1093-100. doi: 10.1378/chest.10-0134. Epub 2010 Mar 18. PMID: 20299623.",
      },
      {
        title:
          "Gender differences in the risk of ischemic stroke and peripheral embolism in atrial fibrillation: the AnTicoagulation and Risk factors In Atrial fibrillation (ATRIA) study",
        citation:
          "Fang MC, Singer DE, Chang Y, Hylek EM, Henault LE, Jensvold NG, Go AS. Gender differences in the risk of ischemic stroke and peripheral embolism in atrial fibrillation: the AnTicoagulation and Risk factors In Atrial fibrillation (ATRIA) study. Circulation. 2005 Sep 20;112(12):1687-91. doi: 10.1161/CIRCULATIONAHA.105.553438. Epub 2005 Sep 12. PMID: 16157766; PMCID: PMC3522521.",
      },
      {
        title:
          "The ORBIT bleeding score: a simple bedside score to assess bleeding risk in atrial fibrillation",
        citation:
          "O'Brien EC, Simon DN, Thomas LE, Hylek EM, Gersh BJ, Ansell JE, Kowey PR, Mahaffey KW, Chang P, Fonarow GC, Pencina MJ, Piccini JP, Peterson ED. The ORBIT bleeding score: a simple bedside score to assess bleeding risk in atrial fibrillation. Eur Heart J. 2015 Dec 7;36(46):3258-64. doi: 10.1093/eurheartj/ehv476. Epub 2015 Sep 29. PMID: 26424865; PMCID: PMC4670965.",
      },
    ],
  },
  {
    title: "Hypertrophic cardiomyopathy",
    description:
      "Risk models and clinical guidelines used for sudden cardiac death assessment in adult and pediatric hypertrophic cardiomyopathy.",
    references: [
      {
        title:
          "2014 ESC Guidelines on diagnosis and management of hypertrophic cardiomyopathy: the Task Force for the Diagnosis and Management of Hypertrophic Cardiomyopathy of the European Society of Cardiology (ESC)",
        citation:
          "Authors/Task Force members; Elliott PM, Anastasakis A, Borger MA, Borggrefe M, Cecchi F, Charron P, Hagege AA, Lafont A, Limongelli G, Mahrholdt H, McKenna WJ, Mogensen J, Nihoyannopoulos P, Nistri S, Pieper PG, Pieske B, Rapezzi C, Rutten FH, Tillmanns C, Watkins H. 2014 ESC Guidelines on diagnosis and management of hypertrophic cardiomyopathy: the Task Force for the Diagnosis and Management of Hypertrophic Cardiomyopathy of the European Society of Cardiology (ESC). Eur Heart J. 2014 Oct 14;35(39):2733-79. doi: 10.1093/eurheartj/ehu284. Epub 2014 Aug 29. PMID: 25173338.",
      },
      {
        title:
          "A novel clinical risk prediction model for sudden cardiac death in hypertrophic cardiomyopathy (HCM risk-SCD)",
        citation:
          "O'Mahony C, Jichi F, Pavlou M, Monserrat L, Anastasakis A, Rapezzi C, Biagini E, Gimeno JR, Limongelli G, McKenna WJ, Omar RZ, Elliott PM; Hypertrophic Cardiomyopathy Outcomes Investigators. A novel clinical risk prediction model for sudden cardiac death in hypertrophic cardiomyopathy (HCM risk-SCD). Eur Heart J. 2014 Aug 7;35(30):2010-20. doi: 10.1093/eurheartj/eht439. Epub 2013 Oct 14. PMID: 24126876.",
      },
      {
        title:
          "Development of a Novel Risk Prediction Model for Sudden Cardiac Death in Childhood Hypertrophic Cardiomyopathy (HCM Risk-Kids)",
        citation:
          "Norrish G, Ding T, Field E, Ziólkowska L, Olivotto I, Limongelli G, Anastasakis A, Weintraub R, Biagini E, Ragni L, Prendiville T, Duignan S, McLeod K, Ilina M, Fernández A, Bökenkamp R, Baban A, Kubuš P, Daubeney PEF, Sarquella-Brugada G, Cesar S, Marrone C, Bhole V, Medrano C, Uzun O, Brown E, Gran F, Castro FJ, Stuart G, Vignati G, Barriales-Villa R, Guereta LG, Adwani S, Linter K, Bharucha T, Garcia-Pavia P, Rasmussen TB, Calcagnino MM, Jones CB, De Wilde H, Toru-Kubo J, Felice T, Mogensen J, Mathur S, Reinhardt Z, O'Mahony C, Elliott PM, Omar RZ, Kaski JP. Development of a Novel Risk Prediction Model for Sudden Cardiac Death in Childhood Hypertrophic Cardiomyopathy (HCM Risk-Kids). JAMA Cardiol. 2019 Sep 1;4(9):918-927. doi: 10.1001/jamacardio.2019.2861. PMID: 31411652; PMCID: PMC6694401.",
      },
    ],
  },
  {
    title: "Inherited arrhythmia syndromes",
    description:
      "Diagnostic scoring systems and consensus recommendations for long QT syndrome and Brugada syndrome.",
    references: [
      {
        title:
          "Diagnostic criteria for the long QT syndrome. An update",
        citation:
          "Schwartz PJ, Moss AJ, Vincent GM, Crampton RS. Diagnostic criteria for the long QT syndrome. An update. Circulation. 1993 Aug;88(2):782-4. doi: 10.1161/01.cir.88.2.782. PMID: 8339437.",
      },
      {
        title:
          "Long-QT syndrome: from genetics to management",
        citation:
          "Schwartz PJ, Crotti L, Insolia R. Long-QT syndrome: from genetics to management. Circ Arrhythm Electrophysiol. 2012 Aug 1;5(4):868-77. doi: 10.1161/CIRCEP.111.962019. Erratum in: Circ Arrhythm Electrophysiol. 2012 Dec;5(6):e119-20. PMID: 22895603; PMCID: PMC3461497.",
      },
      {
        title:
          "J-Wave syndromes expert consensus conference report: Emerging concepts and gaps in knowledge",
        citation:
          "Antzelevitch C, Yan GX, Ackerman MJ, Borggrefe M, Corrado D, Guo J, Gussak I, Hasdemir C, Horie M, Huikuri H, Ma C, Morita H, Nam GB, Sacher F, Shimizu W, Viskin S, Wilde AA. J-Wave syndromes expert consensus conference report: Emerging concepts and gaps in knowledge. Heart Rhythm. 2016 Oct;13(10):e295-324. doi: 10.1016/j.hrthm.2016.05.024. Epub 2016 Jul 13. PMID: 27423412; PMCID: PMC5035208.",
      },
      {
        title:
          "2022 ESC Guidelines for the management of patients with ventricular arrhythmias and the prevention of sudden cardiac death",
        citation:
          "Zeppenfeld K, Tfelt-Hansen J, de Riva M, Winkel BG, Behr ER, Blom NA, Charron P, Corrado D, Dagres N, de Chillou C, Eckardt L, Friede T, Haugaa KH, Hocini M, Lambiase PD, Marijon E, Merino JL, Peichl P, Priori SG, Reichlin T, Schulz-Menger J, Sticherling C, Tzeis S, Verstrael A, Volterrani M; ESC Scientific Document Group. 2022 ESC Guidelines for the management of patients with ventricular arrhythmias and the prevention of sudden cardiac death. Eur Heart J. 2022 Oct 21;43(40):3997-4126. doi: 10.1093/eurheartj/ehac262. PMID: 36017572.",
      },
    ],
  },
  {
    title: "Ventricular tachycardia and procedural risk",
    description:
      "Risk stratification tools used before ventricular tachycardia ablation and assessment of acute hemodynamic decompensation.",
    references: [
      {
        title:
          "Early Mortality After Catheter Ablation of Ventricular Tachycardia in Patients With Structural Heart Disease",
        citation:
          "Santangeli P, Frankel DS, Tung R, Vaseghi M, Sauer WH, Tzou WS, Mathuria N, Nakahara S, Dickfeldt TM, Lakkireddy D, Bunch TJ, Di Biase L, Natale A, Tholakanahalli V, Tedrow UB, Kumar S, Stevenson WG, Della Bella P, Shivkumar K, Marchlinski FE, Callans DJ; International VT Ablation Center Collaborative Group. Early Mortality After Catheter Ablation of Ventricular Tachycardia in Patients With Structural Heart Disease. J Am Coll Cardiol. 2017 May 2;69(17):2105-2115. doi: 10.1016/j.jacc.2017.02.044. PMID: 28449770.",
      },
      {
        title:
          "2019 HRS/EHRA/APHRS/LAHRS expert consensus statement on catheter ablation of ventricular arrhythmias",
        citation:
          "Cronin EM, Bogun FM, Maury P, Peichl P, Chen M, Namboodiri N, Aguinaga L, Leite LR, Al-Khatib SM, Anter E, Berruezo A, Callans DJ, Chung MK, Cuculich P, d'Avila A, Deal BJ, Della Bella P, Deneke T, Dickfeld TM, Hadid C, Haqqani HM, Kay GN, Latchamsetty R, Marchlinski F, Miller JM, Nogami A, Patel AR, Pathak RK, Saenz Morales LC, Santangeli P, Sapp JL Jr, Sarkozy A, Soejima K, Stevenson WG, Tedrow UB, Tzou WS, Varma N, Zeppenfeld K. 2019 HRS/EHRA/APHRS/LAHRS expert consensus statement on catheter ablation of ventricular arrhythmias. Heart Rhythm. 2020 Jan;17(1):e2-e154. doi: 10.1016/j.hrthm.2019.03.002. Epub 2019 May 10. PMID: 31085023; PMCID: PMC8453449.",
      },
    ],
  },
  {
    title: "QT interval assessment",
    description:
      "Frequently used correction formulas for heart rate-adjusted QT interval calculation.",
    references: [
      {
        title:
          "An Analysis of the Time-Relations of Electrocardiograms",
        citation:
          "Bazett HC. An Analysis of the Time-Relations of Electrocardiograms. Heart. 1920;7:353-70.",
      },
      {
        title:
          "The Duration of Systole in the Electrocardiogram of Normal Subjects and of Patients with Heart Disease",
        citation:
          "Fridericia LS. The Duration of Systole in the Electrocardiogram of Normal Subjects and of Patients with Heart Disease. Acta Medica Scandinavica. 1920;53:469-86.",
      },
      {
        title:
          "An improved method for adjusting the QT interval for heart rate (the Framingham Heart Study)",
        citation:
          "Sagie A, Larson MG, Goldberg RJ, Bengtson JR, Levy D. An improved method for adjusting the QT interval for heart rate (the Framingham Heart Study). Am J Cardiol. 1992 Sep 15;70(7):797-801. doi: 10.1016/0002-9149(92)90562-d. PMID: 1519533.",
      },
      {
        title:
          "Bazett's QT correction reviewed: Evidence that a linear QT correction for heart rate is better",
        citation:
          "Hodges M, Salerno D, Erlien D. Bazett's QT correction reviewed: Evidence that a linear QT correction for heart rate is better. J Am Coll Cardiol. 1983;1(2):694.",
      },
    ],
  },
];

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

export default function ReferencesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-8 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
            Scientific references
          </span>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
            Evidence supporting EP-SCORE AI calculators.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            This library summarizes the principal guidelines, validation
            studies and original publications supporting the clinical
            calculators available in EP-SCORE AI.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="space-y-8">
          {referenceGroups.map((group) => (
            <section
              key={group.title}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                    <BookIcon />
                  </span>

                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-950">
                      {group.title}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {group.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {group.references.map((reference, index) => (
                  <article
                    key={`${group.title}-${reference.title}`}
                    className="grid gap-4 px-6 py-6 sm:grid-cols-[44px_minmax(0,1fr)] sm:px-8"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-black text-slate-500">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="text-base font-bold leading-7 text-slate-950">
                        {reference.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {reference.citation}
                      </p>

                      {reference.href ? (
                        <a
                          href={reference.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-sm font-bold text-cyan-700 transition hover:text-cyan-900"
                        >
                          View publication
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-7 sm:p-9">
          <p className="text-sm font-black text-amber-800">
            Reference notice
          </p>

          <p className="mt-3 max-w-5xl text-sm leading-7 text-amber-900/70">
            This page provides a curated scientific overview and is not intended
            to represent an exhaustive systematic review. Guideline versions
            and recommendations may change over time. Clinical decisions should
            always be based on the latest official publications and individual
            patient assessment.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}