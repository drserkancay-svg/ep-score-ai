import Footer from "@/components/Footer";
import Header from "@/components/Header";

function HeartPulseIcon() {
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
      <path d="M3 12h4l2-5 4 10 2-5h6" />
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function ShieldIcon() {
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
      <path d="M12 3 5 6v5c0 4.8 2.8 8.1 7 10 4.2-1.9 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BrainIcon() {
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
      <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.5A3.5 3.5 0 0 0 4.5 15H6a4 4 0 0 0 4 4" />
      <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.5a3.5 3.5 0 0 1 1.5 6.5H18a4 4 0 0 1-4 4" />
      <path d="M12 4v16" />
      <path d="M8 9h4" />
      <path d="M12 15h4" />
    </svg>
  );
}

const features = [
  {
    title: "Electrophysiology focused",
    description:
      "Designed specifically for arrhythmia, inherited cardiac conditions, anticoagulation and electrophysiology practice.",
    icon: <HeartPulseIcon />,
  },
  {
    title: "Evidence based",
    description:
      "Calculators are built around validated clinical risk models, scientific publications and current guideline frameworks.",
    icon: <ShieldIcon />,
  },
  {
    title: "AI supported",
    description:
      "The clinical assistant helps identify appropriate scores, detect missing variables and provide structured interpretation.",
    icon: <BrainIcon />,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
            About EP-SCORE AI
          </span>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
            Clinical decision support for cardiac electrophysiology.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            EP-SCORE AI is a specialized clinical calculator platform developed
            to make electrophysiology risk assessment faster, clearer and more
            accessible in daily practice.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                {feature.icon}
              </div>

              <h2 className="mt-6 text-xl font-black tracking-tight text-slate-950">
                {feature.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
              Mission
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950">
              Turning validated clinical models into practical tools.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              The platform combines established scoring systems with a clean,
              modern interface. Its purpose is to reduce calculation errors,
              improve access to risk models and support structured clinical
              reasoning.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              EP-SCORE AI does not replace professional judgment. Every result
              must be interpreted together with the patient&apos;s complete
              clinical profile, current guidelines and physician assessment.
            </p>
          </article>

          <aside className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl shadow-slate-300 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Developer
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">
              Serkan Cay
            </h2>

            <p className="mt-3 text-base font-semibold text-slate-300">
              Cardiac Electrophysiology Specialist
            </p>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              EP-SCORE AI was created at the intersection of clinical
              electrophysiology, software development and artificial
              intelligence research.
            </p>

            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-sm leading-7 text-slate-400">
                The project is designed as an evolving clinical platform. New
                calculators, guideline summaries and AI-assisted workflows will
                continue to be added over time.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-7 sm:p-9">
          <p className="text-sm font-black text-amber-800">
            Medical disclaimer
          </p>

          <p className="mt-3 max-w-5xl text-sm leading-7 text-amber-900/70">
            EP-SCORE AI provides clinical decision-support tools for
            educational and professional use. Results do not constitute a
            diagnosis or treatment recommendation and must not replace
            individualized clinical assessment, current guidelines or
            professional medical judgment.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}