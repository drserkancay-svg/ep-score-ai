"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  categories,
  getAvailableScores,
  getCategoryScoreCount,
  scores,
} from "@/data/scores";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.7-3.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
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
    >
      <path d="M12 3 5 6v5c0 4.8 2.8 8.1 7 10 4.2-1.9 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const filteredScores = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("en-US");

    let result = [...scores];

    if (selectedCategory) {
      result = result.filter(
        (score) => score.category === selectedCategory,
      );
    }

    if (query) {
      result = result.filter((score) => {
        const searchableText = [
          score.name,
          score.fullName,
          score.category,
          score.description,
          score.evidence,
          ...(score.keywords ?? []),
        ]
          .join(" ")
          .toLocaleLowerCase("en-US");

        return searchableText.includes(query);
      });
    }

    if (!query && !selectedCategory) {
      return result
        .filter((score) => score.popular)
        .slice(0, 6);
    }

    return result;
  }, [search, selectedCategory]);

  const availableScoreCount = useMemo(
    () => getAvailableScores().length,
    [],
  );

  const activeCategoryTitle =
    selectedCategory ?? "All clinical categories";

  function scrollToScores() {
    document
      .getElementById("scores")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function selectCategory(category: string) {
    setSelectedCategory(category);
    setSearch("");

    window.setTimeout(() => {
      document
        .getElementById("scores")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategory(null);
  }

  function handleSearchChange(value: string) {
    setSearch(value);

    if (value.trim()) {
      setSelectedCategory(null);
    }
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-200/45 blur-[120px]" />
        <div className="absolute right-[-10rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-violet-200/35 blur-[120px]" />
        <div className="absolute bottom-[-15rem] left-[30%] h-[32rem] w-[32rem] rounded-full bg-blue-200/35 blur-[130px]" />
        <div className="ecg-grid absolute inset-0 opacity-[0.08]" />
      </div>

      <Header onScoresClick={scrollToScores} />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm backdrop-blur">
            <ShieldIcon />
            Evidence-based cardiac electrophysiology tools
          </div>

          <h1 className="text-balance text-4xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
            Clinical risk scores,
            <span className="block bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              built for electrophysiology.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
            A unified platform for validated risk calculators, diagnostic
            criteria and procedure-specific prediction tools in modern cardiac
            electrophysiology.
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            <label className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">
              <span className="text-slate-400 transition group-focus-within:text-cyan-600">
                <SearchIcon />
              </span>

              <input
                value={search}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                placeholder="Search CHA₂DS₂-VA, bleeding risk, VT ablation..."
                className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-lg"
              />

              <span className="hidden rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500 sm:block">
                {filteredScores.length} tools
              </span>
            </label>

            {search && (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white/95 p-2 text-left shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
                {filteredScores.length > 0 ? (
                  filteredScores.slice(0, 5).map((score) =>
                    score.href ? (
                      <Link
                        key={score.id}
                        href={score.href}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition hover:bg-slate-50"
                      >
                        <span>
                          <span className="block font-semibold text-slate-900">
                            {score.name}
                          </span>

                          <span className="block text-sm text-slate-500">
                            {score.category}
                          </span>
                        </span>

                        <span className="text-cyan-600">
                          <ArrowIcon />
                        </span>
                      </Link>
                    ) : (
                      <div
                        key={score.id}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 opacity-60"
                      >
                        <span>
                          <span className="block font-semibold text-slate-900">
                            {score.name}
                          </span>

                          <span className="block text-sm text-slate-500">
                            {score.category}
                          </span>
                        </span>

                        <span className="text-xs font-semibold text-slate-600">
                          Coming soon
                        </span>
                      </div>
                    ),
                  )
                ) : (
                  <div className="px-4 py-5 text-sm text-slate-500">
                    No matching score found.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToScores}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-bold text-white shadow-xl shadow-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-600"
            >
              Browse clinical scores
              <ArrowIcon />
            </button>

            <a
              href="#ai-assistant"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Explore AI assistant
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
            <span>Guideline-linked</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span>Formula verified</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span>Mobile optimized</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span>Clinical decision support</span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              availableScoreCount.toString(),
              "Available calculators",
            ],
            [
              scores.length.toString(),
              "Total score library",
            ],
            [
              categories.length.toString(),
              "Clinical categories",
            ],
            [
              "Verified",
              "Fixed calculation logic",
            ],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`px-8 py-7 text-center ${index > 0
                  ? "border-t border-slate-200 sm:border-l sm:border-t-0"
                  : ""
                }`}
            >
              <div className="text-3xl font-black tracking-tight text-slate-950">
                {value}
              </div>
              <div className="mt-1 text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="scores"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8"
      >
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">
              Clinical calculators
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {search
                ? "Search results"
                : selectedCategory
                  ? selectedCategory
                  : "Popular scores"}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Commonly used and clinically relevant tools for everyday
              electrophysiology practice.
            </p>
            {(search || selectedCategory) && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                  {search
                    ? `Search: ${search}`
                    : activeCategoryTitle}
                </span>

                <span className="text-xs text-slate-500">
                  {filteredScores.length} result
                  {filteredScores.length === 1 ? "" : "s"}
                </span>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <Link
            href="/scores"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 transition hover:gap-3 hover:text-cyan-800"
          >
            View all calculators
            <ArrowIcon />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredScores.map((score, index) => (
            <article
              key={score.name}
              className="score-card group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-200/40 blur-3xl transition group-hover:bg-cyan-200/70" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {score.category}
                  </span>

                  <span className="text-xs font-medium text-cyan-600/80">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black tracking-tight">
                  {score.name}
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-600">
                  {score.fullName}
                </p>

                <p className="mt-5 min-h-16 text-sm leading-6 text-slate-500">
                  {score.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
                  <span className="text-xs text-slate-600">{score.status}</span>

                  {score.href ? (
                    <Link
                      href={score.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 transition group-hover:gap-3"
                    >
                      Open
                      <ArrowIcon />
                    </Link>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="categories"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8"
      >
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
            Structured navigation
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Browse by clinical category
          </h2>
          <p className="mt-3 leading-7 text-slate-500">
            Find the appropriate calculator by disease, procedure or clinical
            decision.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category.title)}
              className={`group flex items-center gap-5 rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:border-violet-300 hover:bg-white ${selectedCategory === category.title
                  ? "border-violet-300 bg-violet-50"
                  : "border-slate-200 bg-white/85 shadow-sm"
                }`}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet-200 bg-violet-50 text-sm font-black text-violet-700">
                {category.icon}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-bold text-slate-950">
                  {category.title}
                </span>
                <span className="mt-1 block text-sm leading-5 text-slate-500">
                  {category.subtitle}
                </span>
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {getCategoryScoreCount(category.title)}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section
        id="ai-assistant"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8"
      >
        <div className="overflow-hidden rounded-[2rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-6 shadow-2xl shadow-slate-200/60 sm:p-10 lg:p-14">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-cyan-700">
                AI clinical navigator
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
                Find the right score for your clinical question.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Describe a clinical scenario and EP-SCORE AI will identify
                potentially relevant calculators. Mathematical results remain
                generated by fixed, verified scoring logic.
              </p>

              <Link
                href="/ai-assistant"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Launch assistant
                <ArrowIcon />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-slate-600">
                  Clinical assistant preview
                </span>
              </div>

              <div className="mt-5 rounded-2xl rounded-bl-md bg-slate-100 p-4 text-sm leading-6 text-slate-700">
                I have a 72-year-old patient with atrial fibrillation who requires
                thromboembolic and bleeding risk assessment before treatment planning.
              </div>

              <div className="mt-4 rounded-2xl rounded-br-md border border-cyan-200 bg-cyan-50 p-4">
                <p className="text-sm font-semibold text-cyan-700">
                  Potentially relevant tools
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    ["CHA₂DS₂-VA", "Thromboembolic risk"],
                    ["HAS-BLED", "Bleeding risk assessment"],
                    ["QTc", "Corrected QT interval"],
                    ["Schwartz Score", "Long QT syndrome probability"],
                  ].map(([name, purpose]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <span className="font-semibold text-slate-950">{name}</span>
                      <span className="text-xs text-slate-500">{purpose}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-600">
                AI recommendations support navigation only and do not replace
                clinical judgment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Formula verified",
              description:
                "Each calculator is implemented using fixed and reviewable calculation logic.",
            },
            {
              title: "Evidence referenced",
              description:
                "Original publications, validation studies and relevant guidelines are linked.",
            },
            {
              title: "Clinically transparent",
              description:
                "Population, limitations and validation status are presented with every score.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-sm"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                <ShieldIcon />
              </span>
              <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-500">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}