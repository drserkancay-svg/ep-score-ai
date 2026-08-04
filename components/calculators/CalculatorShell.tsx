"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

type CalculatorShellProps = {
  name: string;
  fullName: string;
  category: string;
  description: string;
  evidence?: string;
  guideline?: string;
  status?: "available" | "beta";
  children: ReactNode;
  result?: ReactNode;
  information?: ReactNode;
  references?: ReactNode;
};

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 4.8 2.8 8.1 7 10 4.2-1.9 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
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

function CalculatorIcon() {
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
      <rect x="4" y="2.5" width="16" height="19" rx="3" />
      <path d="M8 6.5h8v3H8z" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
      <path d="M8 17h.01" />
      <path d="M12 17h.01" />
      <path d="M16 17h.01" />
    </svg>
  );
}

function InformationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function ResultPlaceholder() {
  return (
    <div className="flex min-h-[330px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
        <CalculatorIcon />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">
        Complete the calculator
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Enter the required clinical variables to generate the calculated
        score and interpretation.
      </p>
    </div>
  );
}

function DefaultInformation({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-950">
          About {name}
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          {description}
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-bold text-amber-800">
          Clinical decision-support notice
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-900/70">
          This calculator is intended to support, not replace, professional
          clinical judgment. Results must be interpreted in the context of
          the individual patient.
        </p>
      </div>
    </div>
  );
}

export default function CalculatorShell({
  name,
  fullName,
  category,
  description,
  evidence,
  guideline,
  status = "available",
  children,
  result,
  information,
  references,
}: CalculatorShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-cyan-200/45 blur-[130px]" />

        <div className="absolute -right-44 top-[18rem] h-[32rem] w-[32rem] rounded-full bg-violet-200/35 blur-[130px]" />

        <div className="absolute bottom-[-16rem] left-[32%] h-[34rem] w-[34rem] rounded-full bg-blue-200/35 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <Header />

      <div className="relative z-10">
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
            <Link
              href="/scores"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:gap-3 hover:text-cyan-700"
            >
              <ArrowLeftIcon />
              Back to calculator library
            </Link>

            <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3.5 py-2 text-xs font-bold text-cyan-700">
                    {category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold ${
                      status === "available"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-violet-200 bg-violet-50 text-violet-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        status === "available"
                          ? "bg-emerald-400"
                          : "bg-violet-400"
                      }`}
                    />

                    {status === "available" ? "Available" : "Beta"}
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
                  {name}
                </h1>

                <p className="mt-3 text-lg font-semibold text-slate-700 sm:text-xl">
                  {fullName}
                </p>

                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 sm:text-lg">
                  {description}
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                    <ShieldIcon />
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-500">
                      Evidence basis
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                      {evidence || "Evidence-based clinical prediction tool"}
                    </p>
                  </div>
                </div>

                {guideline && (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-500">
                      Guideline
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {guideline}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
            <section className="min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
              <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                    <CalculatorIcon />
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
                      Calculator
                    </p>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Clinical variables
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8">{children}</div>
            </section>

            <aside className="min-w-0 xl:sticky xl:top-28">
              <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                <div className="border-b border-slate-200 px-6 py-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
                    Calculated result
                  </p>

                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                    Risk interpretation
                  </h2>
                </div>

                <div className="p-5 sm:p-6">
                  {result ?? <ResultPlaceholder />}
                </div>
              </section>
            </aside>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700">
                  <InformationIcon />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.17em] text-blue-700">
                    Clinical information
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Interpretation and use
                  </h2>
                </div>
              </div>

              <div className="mt-7">
                {information ?? (
                  <DefaultInformation
                    name={name}
                    description={description}
                  />
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200 bg-violet-50 text-violet-700">
                  <BookIcon />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.17em] text-violet-700">
                    Scientific basis
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    References
                  </h2>
                </div>
              </div>

              <div className="mt-7">
                {references ?? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      Reference information will be added to this calculator.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-[2rem] border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-black text-amber-800">
              Medical disclaimer
            </p>

            <p className="mt-3 max-w-5xl text-sm leading-7 text-amber-900/70">
              EP-SCORE AI provides clinical decision-support tools for
              educational and professional use. Calculator results do not
              constitute a diagnosis or treatment recommendation and must not
              replace individualized clinical assessment, current guidelines
              or professional medical judgment.
            </p>
          </section>
        </section>
      </div>

      <Footer />
    </main>
  );
}