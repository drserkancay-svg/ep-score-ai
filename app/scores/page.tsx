"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { categories, scores } from "@/data/scores";

type AvailabilityFilter = "all" | "available" | "coming-soon";

type SortOption =
  | "recommended"
  | "alphabetical"
  | "category"
  | "availability";

type ViewMode = "grid" | "list";

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.7-3.7" />
    </svg>
  );
}

function FilterIcon() {
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
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
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

function normalizeEvidence(evidence?: string) {
  return evidence?.trim() || "Evidence referenced";
}

function getEvidenceGroup(evidence?: string) {
  const normalized = evidence?.toLowerCase() ?? "";

  if (
    normalized.includes("guideline") ||
    normalized.includes("validated") ||
    normalized.includes("external")
  ) {
    return "high";
  }

  if (
    normalized.includes("derivation") ||
    normalized.includes("original") ||
    normalized.includes("cohort")
  ) {
    return "moderate";
  }

  return "other";
}

export default function ScoresPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("all");
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const availableCount = useMemo(
    () => scores.filter((score) => Boolean(score.href)).length,
    [],
  );

  const comingSoonCount = scores.length - availableCount;

  const filteredScores = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("en-US");

    let result = [...scores];

    if (query) {
      result = result.filter((score) => {
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

        return searchableText.includes(query);
      });
    }

    if (selectedCategories.length > 0) {
      result = result.filter((score) =>
        selectedCategories.includes(score.category),
      );
    }

    if (availability === "available") {
      result = result.filter((score) => Boolean(score.href));
    }

    if (availability === "coming-soon") {
      result = result.filter((score) => !score.href);
    }

    if (evidenceFilter !== "all") {
      result = result.filter(
        (score) => getEvidenceGroup(score.evidence) === evidenceFilter,
      );
    }

    result.sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "category") {
        return (
          a.category.localeCompare(b.category) ||
          a.name.localeCompare(b.name)
        );
      }

      if (sortBy === "availability") {
        return Number(Boolean(b.href)) - Number(Boolean(a.href));
      }

      return (
        Number(Boolean(b.popular)) - Number(Boolean(a.popular)) ||
        Number(Boolean(b.href)) - Number(Boolean(a.href)) ||
        a.name.localeCompare(b.name)
      );
    });

    return result;
  }, [
    search,
    selectedCategories,
    availability,
    evidenceFilter,
    sortBy,
  ]);

  const activeFilterCount =
    selectedCategories.length +
    Number(availability !== "all") +
    Number(evidenceFilter !== "all") +
    Number(Boolean(search.trim()));

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategories([]);
    setAvailability("all");
    setEvidenceFilter("all");
    setSortBy("recommended");
  }

  function removeCategory(category: string) {
    setSelectedCategories((current) =>
      current.filter((item) => item !== category),
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-200/45 blur-[120px]" />
        <div className="absolute right-[-10rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-violet-200/35 blur-[120px]" />
        <div className="absolute bottom-[-15rem] left-[30%] h-[32rem] w-[32rem] rounded-full bg-blue-200/35 blur-[130px]" />
        <div className="ecg-grid absolute inset-0 opacity-20" />
      </div>

      <Header />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm text-cyan-700">
            <ShieldIcon />
            Evidence-based clinical decision support
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-[-0.045em] sm:text-6xl">
            Clinical Calculator Library
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
            Explore validated risk scores, diagnostic criteria and
            procedure-specific prediction tools for cardiac
            electrophysiology.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
              {scores.length} total calculators
            </span>

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              {availableCount} available
            </span>

            <span className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-700">
              {categories.length} categories
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-950">Filters</h2>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-cyan-700 transition hover:text-cyan-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <FilterContent
                selectedCategories={selectedCategories}
                availability={availability}
                evidenceFilter={evidenceFilter}
                availableCount={availableCount}
                comingSoonCount={comingSoonCount}
                onToggleCategory={toggleCategory}
                onAvailabilityChange={setAvailability}
                onEvidenceChange={setEvidenceFilter}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 backdrop-blur-xl sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition focus-within:border-cyan-400 focus-within:bg-white">
                  <span className="text-slate-500">
                    <SearchIcon />
                  </span>

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search calculators, diseases or procedures..."
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-500 sm:text-base"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                      <CloseIcon />
                    </button>
                  )}
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="relative inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 lg:hidden"
                  >
                    <FilterIcon />
                    Filters

                    {activeFilterCount > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-cyan-600 px-1 text-[10px] font-black text-slate-950">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value as SortOption)
                    }
                    aria-label="Sort calculators"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 xl:w-48 xl:flex-none"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="alphabetical">A–Z</option>
                    <option value="category">Category</option>
                    <option value="availability">Availability</option>
                  </select>

                  <div className="hidden rounded-xl border border-slate-200 bg-slate-50 p-1 sm:flex">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                      className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                        viewMode === "grid"
                          ? "bg-slate-100 text-cyan-700"
                          : "text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      <GridIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                      className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                        viewMode === "list"
                          ? "bg-slate-100 text-cyan-700"
                          : "text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      <ListIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {search && (
                  <FilterChip
                    label={`Search: ${search}`}
                    onRemove={() => setSearch("")}
                  />
                )}

                {selectedCategories.map((category) => (
                  <FilterChip
                    key={category}
                    label={category}
                    onRemove={() => removeCategory(category)}
                  />
                ))}

                {availability !== "all" && (
                  <FilterChip
                    label={
                      availability === "available"
                        ? "Available"
                        : "Coming soon"
                    }
                    onRemove={() => setAvailability("all")}
                  />
                )}

                {evidenceFilter !== "all" && (
                  <FilterChip
                    label={
                      evidenceFilter === "high"
                        ? "Guideline / validated"
                        : evidenceFilter === "moderate"
                          ? "Original / derivation"
                          : "Other evidence"
                    }
                    onRemove={() => setEvidenceFilter("all")}
                  />
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-950"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="mb-5 mt-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-950">
                    {filteredScores.length}
                  </span>{" "}
                  of {scores.length} calculators
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {selectedCategories.length === 1
                    ? selectedCategories[0]
                    : search
                      ? "Search results"
                      : "All clinical calculators"}
                </h2>
              </div>
            </div>

            {filteredScores.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 md:grid-cols-2"
                    : "space-y-3"
                }
              >
                {filteredScores.map((score, index) => (
                  <ScoreCard
                    key={score.id}
                    score={score}
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                  <SearchIcon />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No calculators found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try changing your search term or removing one of the active
                  filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] border-t border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/40">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/15" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-black">Filters</p>
                <p className="mt-1 text-xs text-slate-500">
                  Refine the calculator library
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-500"
              >
                <CloseIcon />
              </button>
            </div>

            <FilterContent
              selectedCategories={selectedCategories}
              availability={availability}
              evidenceFilter={evidenceFilter}
              availableCount={availableCount}
              comingSoonCount={comingSoonCount}
              onToggleCategory={toggleCategory}
              onAvailabilityChange={setAvailability}
              onEvidenceChange={setEvidenceFilter}
            />

            <div className="sticky bottom-0 mt-7 grid grid-cols-2 gap-3 bg-white pb-2 pt-4">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
              >
                Show {filteredScores.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

function FilterContent({
  selectedCategories,
  availability,
  evidenceFilter,
  availableCount,
  comingSoonCount,
  onToggleCategory,
  onAvailabilityChange,
  onEvidenceChange,
}: {
  selectedCategories: string[];
  availability: AvailabilityFilter;
  evidenceFilter: string;
  availableCount: number;
  comingSoonCount: number;
  onToggleCategory: (category: string) => void;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  onEvidenceChange: (value: string) => void;
}) {
  return (
    <div className="mt-6 space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Categories
        </p>

        <div className="mt-4 space-y-2">
          {categories.map((category) => {
            const selected = selectedCategories.includes(category.title);
            const categoryCount = scores.filter(
              (score) => score.category === category.title,
            ).length;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onToggleCategory(category.title)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  selected
                    ? "border-cyan-300 bg-cyan-50"
                    : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[10px] font-black ${
                    selected
                      ? "bg-cyan-600 text-slate-950"
                      : "bg-slate-50 text-slate-500"
                  }`}
                >
                  {category.icon}
                </span>

                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
                  {category.title}
                </span>

                <span className="text-xs text-slate-500">
                  {categoryCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Availability
        </p>

        <div className="mt-4 space-y-2">
          <RadioFilter
            selected={availability === "all"}
            label="All calculators"
            count={scores.length}
            onClick={() => onAvailabilityChange("all")}
          />

          <RadioFilter
            selected={availability === "available"}
            label="Available now"
            count={availableCount}
            onClick={() => onAvailabilityChange("available")}
          />

          <RadioFilter
            selected={availability === "coming-soon"}
            label="Coming soon"
            count={comingSoonCount}
            onClick={() => onAvailabilityChange("coming-soon")}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Evidence
        </p>

        <div className="mt-4 space-y-2">
          <RadioFilter
            selected={evidenceFilter === "all"}
            label="All evidence"
            onClick={() => onEvidenceChange("all")}
          />

          <RadioFilter
            selected={evidenceFilter === "high"}
            label="Guideline / validated"
            onClick={() => onEvidenceChange("high")}
          />

          <RadioFilter
            selected={evidenceFilter === "moderate"}
            label="Original / derivation"
            onClick={() => onEvidenceChange("moderate")}
          />

          <RadioFilter
            selected={evidenceFilter === "other"}
            label="Other evidence"
            onClick={() => onEvidenceChange("other")}
          />
        </div>
      </div>
    </div>
  );
}

function RadioFilter({
  selected,
  label,
  count,
  onClick,
}: {
  selected: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50"
    >
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
          selected
            ? "border-cyan-400 bg-cyan-600"
            : "border-slate-300 bg-transparent"
        }`}
      >
        {selected && (
          <span className="h-2 w-2 rounded-full bg-white" />
        )}
      </span>

      <span
        className={`min-w-0 flex-1 text-sm ${
          selected
            ? "font-semibold text-slate-950"
            : "text-slate-500"
        }`}
      >
        {label}
      </span>

      {typeof count === "number" && (
        <span className="text-xs text-slate-500">{count}</span>
      )}
    </button>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
      {label}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="grid h-4 w-4 place-items-center rounded-full transition hover:bg-slate-100"
      >
        <CloseIcon />
      </button>
    </span>
  );
}

function ScoreCard({
  score,
  index,
  viewMode,
}: {
  score: (typeof scores)[number];
  index: number;
  viewMode: ViewMode;
}) {
  const available = Boolean(score.href);

  if (viewMode === "list") {
    return (
      <article className="group rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition hover:border-cyan-300 hover:bg-slate-50">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-xs font-black text-cyan-700">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {score.category}
              </span>

              {score.popular && (
                <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                  Popular
                </span>
              )}
            </div>

            <h3 className="mt-3 text-xl font-black tracking-tight">
              {score.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {score.fullName}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs text-slate-500">
              {normalizeEvidence(score.evidence)}
            </p>

            {available ? (
              <Link
                href={score.href!}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-cyan-700"
              >
                Open calculator
                <ArrowIcon />
              </Link>
            ) : (
              <span className="mt-3 inline-flex rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-500">
                Coming soon
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="score-card group relative flex min-h-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-white/[0.065]">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-50 blur-3xl transition group-hover:bg-cyan-600/[0.16]" />

      <div className="relative flex h-full flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
              {score.category}
            </span>

            {score.popular && (
              <span className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                Popular
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-cyan-700/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-7 text-2xl font-black tracking-tight text-slate-950">
          {score.name}
        </h3>

        <p className="mt-2 text-sm font-medium text-slate-500">
          {score.fullName}
        </p>

        <p className="mt-5 flex-1 text-sm leading-6 text-slate-500">
          {score.description}
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Evidence
          </p>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            {normalizeEvidence(score.evidence)}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">
          <span
            className={`inline-flex items-center gap-2 text-xs font-semibold ${
              available ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                available ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />

            {available ? "Available" : "Coming soon"}
          </span>

          {available ? (
            <Link
              href={score.href!}
              className="inline-flex items-center gap-2 text-sm font-black text-cyan-700 transition group-hover:gap-3"
            >
              Open
              <ArrowIcon />
            </Link>
          ) : (
            <span className="text-xs font-semibold text-slate-500">
              In development
            </span>
          )}
        </div>
      </div>
    </article>
  );
}